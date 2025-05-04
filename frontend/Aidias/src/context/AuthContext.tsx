//@ts-nocheck
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import {
  createWalletClient,
  custom,
  http,
  createPublicClient,
} from 'viem';
import { soneiumMinato } from 'viem/chains';
import {
  toNexusAccount,
  createSmartAccountClient,
} from '@biconomy/abstractjs';
import { createPaymasterClient } from 'viem/account-abstraction';
import * as snarkjs from 'snarkjs';
import { buildPoseidon } from "circomlibjs";

// Replace with your actual env vars or constants
const MOCK_ATTESTER_ADDRESS = '0x...';
const NEXUS_K1_VALIDATOR_FACTORY_ADDRESS = '0x...';
const NEXUS_K1_VALIDATOR_ADDRESS = '0x...';
const PAYMASTER_SERVICE_URL = 'https://...';
const BUNDLER_URL = 'https://...';
const ZK_API_URL = 'http://localhost:3000'; // Your local ZK API

interface AuthContextType {
  isLoggedIn: boolean;
  isVerified: boolean;
  walletAddress: string | null;
  loginHook: () => void;
  logoutHook: () => void;
  startVerification: () => void;
  completeVerification: (location: string) => void;

  // Wallet Logic
  provider: any;
  signer: any;
  nexusAccount: any;
  smartAccountClient: any;
  isInitialized: boolean;
  loading: boolean;
  error: string | null;
  initialize: () => void;
  sendTransaction: (to: string, value?: bigint, data?: string) => Promise<string>;
  authenticated: boolean;

  // ZK Proof Functions
  generateProof: () => Promise<{ proof: any, publicSignals: any }>;
  verifyProof: (proof: any, publicSignals: any) => Promise<boolean>;
  verifyProofOnChain: (proof: any, publicSignals: any) => Promise<{ success: boolean, transactionHash?: string }>;
  proofState: {
    proof: any;
    publicSignals: any;
    proofLoading: boolean;
    proofError: string | null;
    verificationResult: boolean | null;
    verificationError: string | null;
    verificationLoading: boolean;
  };
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);
export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const { wallets } = useWallets();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const [provider, setProvider] = useState<any>(null);
  const [signer, setSigner] = useState<any>(null);
  const [nexusAccount, setNexusAccount] = useState<any>(null);
  const [smartAccountClient, setSmartAccountClient] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ZK Proof State
  const [proofState, setProofState] = useState({
    proof: null,
    publicSignals: null,
    proofLoading: false,
    proofError: null,
    verificationResult: null,
    verificationError: null,
    verificationLoading: false,
  });

  useEffect(() => {
    if (authenticated) {
      setIsLoggedIn(true);
    }
    if (wallets && wallets[0]?.address && isVerified) {
      setWalletAddress(wallets[0].address);
    }
  }, [wallets, authenticated]);

  const loginHook = () => {
    login();
  };

  const logoutHook = () => {
    logout();
  };

  const startVerification = () => {
    generateProof()
    console.log('Starting verification process');
  };

  const completeVerification = async (location: string) => {
    try {
      if (!location.trim()) {
        throw new Error("Location is required");
      }
  
      // 1. Generate the proof
      const proofData = await generateProof();
      console.log('Generated proof data:', proofData);
  
      // 2. Verify the proof on-chain via your backend API
      const verificationResponse = await fetch('http://localhost:3000/api/verify-proof', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          proof: proofData.proof,
          publicSignals: proofData.publicSignals
        }),
      });
  
      const verificationResult = await verificationResponse.json();
  
      if (!verificationResult.success) {
        throw new Error(verificationResult.error || 'On-chain verification failed');
      }
  
      console.log('On-chain verification result:', verificationResult);
  
      // 3. Update state only after successful verification
      setIsVerified(true);
      if (wallets?.[0]?.address) {
        setWalletAddress(wallets[0].address);
      }
  
      console.log(`Verification completed with location: ${location}`);
  
      // Return both proof generation and verification results
      return {
        proofGeneration: proofData,
        onChainVerification: verificationResult
      };
  
    } catch (error) {
      console.error('Verification error:', error);
      // Update error state if you have one
      setError(error.message || 'Verification failed');
      throw error; // Re-throw if you want calling code to handle it
    }
  };

  // ZK Proof Functions
  const generateProof = async () => {
    try {
      setProofState(prev => ({
        ...prev,
        proofLoading: true,
        proofError: null,
      }));
      console.log("in generating proof")
      const response = await fetch(`${ZK_API_URL}/api/generate-proof`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();
      console.log("data",data)
      if (!data.success) {
        throw new Error(data.error || 'Failed to generate proof');
      }

      setProofState(prev => ({
        ...prev,
        proof: data.proof,
        publicSignals: data.publicSignals,
        proofLoading: false,
      }));

      return data;
    } catch (error: any) {
      setProofState(prev => ({
        ...prev,
        proofError: error.message || 'Proof generation failed',
        proofLoading: false,
      }));
      throw error;
    }
  };

  const verifyProof = async (proof: any, publicSignals: any) => {
    try {
      if (!proof || !publicSignals) {
        throw new Error("Proof and publicSignals are required");
      }

      const response = await fetch(`${ZK_API_URL}/api/verify-proof`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          proof,
          publicSignals,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Verification failed');
      }

      setProofState(prev => ({
        ...prev,
        verificationResult: data.verificationResult,
        verificationError: null,
      }));

      return data.verificationResult;
    } catch (error: any) {
      setProofState(prev => ({
        ...prev,
        verificationError: error.message || 'Verification failed',
        verificationResult: false,
      }));
      throw error;
    }
  };

  const verifyProofOnChain = async (proof: any, publicSignals: any) => {
    try {
      setProofState(prev => ({
        ...prev,
        verificationLoading: true,
        verificationError: null,
      }));

      if (!proof || !publicSignals) {
        throw new Error("Proof and publicSignals are required");
      }

      const response = await fetch(`${ZK_API_URL}/api/verify-proof`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          proof,
          publicSignals,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'On-chain verification failed');
      }

      setProofState(prev => ({
        ...prev,
        verificationResult: data.verificationResult,
        verificationLoading: false,
      }));

      return {
        success: data.verificationResult,
        transactionHash: data.transactionHash,
      };
    } catch (error: any) {
      setProofState(prev => ({
        ...prev,
        verificationError: error.message || 'On-chain verification failed',
        verificationLoading: false,
        verificationResult: false,
      }));
      throw error;
    }
  };

  const initialize = async () => {
    console.log("weeeps");
    try {
      setLoading(true);
      setError(null);

      const walletProvider = await wallets[0].getEthereumProvider();
      const walletAddr = wallets[0].address;

      setProvider(walletProvider);
      setWalletAddress(walletAddr);

      const walletClient = createWalletClient({
        account: walletAddr,
        chain: soneiumMinato,
        transport: custom(walletProvider),
      });

      setSigner(walletClient);

      const account = await toNexusAccount({
        signer: walletClient,
        chain: soneiumMinato,
        transport: http(),
        attesters: [MOCK_ATTESTER_ADDRESS],
        factoryAddress: NEXUS_K1_VALIDATOR_FACTORY_ADDRESS,
        validatorAddress: NEXUS_K1_VALIDATOR_ADDRESS,
        index: BigInt(1000029),
      });

      setNexusAccount(account);

      const publicClient = createPublicClient({
        chain: soneiumMinato,
        transport: http(),
      });

      const paymaster = createPaymasterClient({
        transport: http(PAYMASTER_SERVICE_URL),
      });

      const smartAccount = createSmartAccountClient({
        account,
        transport: http(BUNDLER_URL),
        client: publicClient,
        paymaster: {
          async getPaymasterData(params) {
            params.paymasterPostOpGasLimit = BigInt(100_000);
            params.paymasterVerificationGasLimit = BigInt(200_000);
            params.verificationGasLimit = BigInt(500_000);
            return await paymaster.getPaymasterData(params);
          },
          async getPaymasterStubData(params) {
            return await paymaster.getPaymasterStubData(params);
          },
        },
        paymasterContext: {
          calculateGasLimits: true,
          policyId: 'sudo',
        },
        userOperation: {
          estimateFeesPerGas: async () => ({
            maxFeePerGas: BigInt(10_000_000),
            maxPriorityFeePerGas: BigInt(10_000_000),
          }),
        },
      });

      setSmartAccountClient(smartAccount);
      setIsInitialized(true);
    } catch (err: any) {
      setError(err.message);
      console.error('Initialization error:', err);
    } finally {
      setLoading(false);
    }
  };

  const sendTransaction = async (
    to: string,
    value: bigint = BigInt(0),
    data: string = '0x'
  ) => {
    if (!smartAccountClient) {
      throw new Error('Smart account not initialized');
    }
    try {
      setLoading(true);
      const txHash = await smartAccountClient.sendTransaction({ to, value, data });
      return txHash;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authenticated && wallets?.length && !isInitialized) {
      initialize();
    }
  }, [authenticated, wallets]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isVerified,
        walletAddress,
        loginHook,
        logoutHook,
        startVerification,
        completeVerification,

        provider,
        signer,
        nexusAccount,
        smartAccountClient,
        isInitialized,
        loading,
        error,
        initialize,
        sendTransaction,
        authenticated,

        // ZK Proof Functions
        generateProof,
        verifyProof,
        verifyProofOnChain,
        proofState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
//@ts-nocheck

import  { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { soneiumMinato } from "viem/chains";
import { PrivyProvider } from '@privy-io/react-auth';
import {LLMActorProvider} from "./context/LLM";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
       <PrivyProvider
      appId={"cma7zloue01j0i50nuddq7ort"}
      config={{
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
          // Setting this to true will show a "Sign" popup on every request
          showWalletUIs: false,
        },
        supportedChains: [soneiumMinato],
        defaultChain: soneiumMinato,
      }}
    >
    <AuthProvider>
      <LLMActorProvider>
      <App />
      </LLMActorProvider>
    </AuthProvider>
    </PrivyProvider>
  </StrictMode>
);
 
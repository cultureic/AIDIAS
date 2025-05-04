import  Modal from 'react-modal';
import { X, Heart, Zap, Share, Brain, MessageSquare, ArrowRight, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import UnverifiedWarningModal from './UnverifiedWarningModal';
import VerificationModal from './VerificationModal';
import { useState } from 'react';

Modal.setAppElement('#root');

interface Capsule {
  id: string;
  title: string;
  content: string;
  author: string;
  tags: string[];
  tips: number;
  rank?: string;
  tone?: string;
  imageUrl: string;
  reactions: {
    heart: number;
    bulb: number;
    mind_blown: number;
    brain: number;
  };
}

interface CapsuleDetailModalProps {
  capsule: Capsule | null;
  isOpen: boolean;
  onClose: () => void;
  onTip: (capsule: Capsule) => void;
  onSwapOpen: () => void;
}

export default function CapsuleDetailModal({ 
  capsule, 
  isOpen, 
  onClose, 
  onTip, 
  onSwapOpen 
}: CapsuleDetailModalProps) {
  const { isLoggedIn, isVerified } = useAuth();
  const [warningModalOpen, setWarningModalOpen] = useState(false);
  const [warningAction, setWarningAction] = useState('');
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);
  
  if (!capsule) return null;
  
  const isAstrArticle = capsule.id === '5';
  
  // Generate mock CAMP hash
  const campHash = `0x${capsule.id.padStart(2, '0')}${Math.random().toString(16).substring(2, 10)}`;
  
  // Determine CC license based on capsule ID for demo purposes
  const getLicense = (id: string) => {
    const options = ['CC BY', 'CC BY-SA', 'CC BY-NC', 'CC0'];
    return options[parseInt(id) % options.length];
  };
  
  const handleTip = () => {
    onClose();
    onTip(capsule);
  };
  
  const handleComment = () => {
    if (!isLoggedIn) return;
    
    if (!isVerified) {
      setWarningAction('leave a comment');
      setWarningModalOpen(true);
      return;
    }
    
    // Implement comment functionality
    console.log("Comment on capsule:", capsule.id);
  };
  
  const handleStartVerification = () => {
    setWarningModalOpen(false);
    setVerificationModalOpen(true);
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="w-[700px] max-w-[90vw] max-h-[85vh] bg-[#1a1f2c] rounded-xl mx-auto mt-[5vh] outline-none overflow-hidden flex flex-col"
      overlayClassName="fixed inset-0 flex items-start justify-center bg-black/75 overflow-y-auto py-4"
    >
      <div className="p-4 border-b border-[#2d3748] flex justify-between items-center">
        <h2 className="text-xl font-bold">Idea Capsule</h2>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-[#2d3748]">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="h-48 relative">
          <img 
            src={capsule.imageUrl} 
            alt={capsule.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1a1f2c]/90 flex items-end">
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-1">{capsule.title}</h3>
              
              <div className="flex items-center text-gray-300 opacity-90">
                <Brain className="w-4 h-4 mr-1 text-[#4ade80]" /> 
                <span className="font-medium mr-1">{capsule.author}</span> + AI
                
                {capsule.rank && (
                  <span className="ml-3 text-xs px-2 py-0.5 bg-[#4ade80]/20 text-[#4ade80] rounded-full">
                    {capsule.rank}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {capsule.tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-1 rounded-full text-white bg-[#2d3748]">#{tag}</span>
            ))}
          </div>
          
          <div className="mb-6">
            {isAstrArticle ? (
              <>
                <h4 className="text-lg font-medium mb-3">A Comprehensive Guide to Acquiring $ASTR</h4>
                
                <p className="mb-4 text-gray-300 opacity-90">
                  $ASTR is the native token of the Astra ecosystem on Soneium Network, powering everything from platform governance to tipping creators. Here are the top methods to acquire $ASTR tokens:
                </p>
                
                <h5 className="text-base font-medium mb-2">1. Centralized Exchanges (CEXs)</h5>
                <p className="mb-3 text-gray-300 opacity-90">
                  $ASTR is available on major exchanges including Binance, Kraken, and KuCoin. Simply create an account, complete KYC, and purchase $ASTR with fiat or other cryptocurrencies.
                </p>
                
                <h5 className="text-base font-medium mb-2">2. Decentralized Exchanges (DEXs)</h5>
                <p className="mb-3 text-gray-300 opacity-90">
                  For those preferring non-custodial solutions, $ASTR can be swapped on Uniswap (Ethereum), PancakeSwap (BSC), or Osmosis (Cosmos). Ensure you have the proper network configured in your wallet to connect with Soneium Network.
                </p>
                
                <h5 className="text-base font-medium mb-2">3. Earning $ASTR on Aidias</h5>
                <p className="mb-3 text-gray-300 opacity-90">
                  Create valuable content on Aidias to earn $ASTR through tips and rewards. High-quality AI-assisted capsules can generate significant token rewards from the community.
                </p>
                
                <h5 className="text-base font-medium mb-2">4. Staking Rewards</h5>
                <p className="mb-3 text-gray-300 opacity-90">
                  Stake your $ASTR tokens to earn passive rewards while supporting Soneium Network security. Current APY ranges from 7-12% depending on lock-up periods.
                </p>
                
                <div className="bg-[#0f1116] border border-[#2d3748] rounded-lg p-4 my-5">
                  <div className="flex items-start gap-3">
                    <div className="text-mint text-lg mt-1">💡</div>
                    <div>
                      <h5 className="font-medium mb-1">AI Assistant Suggestion</h5>
                      <p className="text-gray-300 opacity-90 text-sm mb-2">
                        I notice you're reading about $ASTR tokens. Would you like to acquire some now to enable tipping and other platform features?
                      </p>
                      <button 
                        onClick={() => {
                          onClose();
                          onSwapOpen();
                        }}
                        className="text-mint hover:underline flex items-center gap-1 text-sm font-medium"
                      >
                        Open $ASTR swap interface <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <h5 className="text-base font-medium mb-2">5. Token Airdrops</h5>
                <p className="mb-3 text-gray-300 opacity-90">
                  Active participants in the Aidias ecosystem may be eligible for periodic $ASTR airdrops on Soneium Network. Ensure your account is verified and remain active to qualify.
                </p>
                
                <div className="mt-5 text-sm text-gray-300 opacity-70">
                  <p className="italic">Last updated: June 2023 - Please conduct your own research before making any investment decisions.</p>
                </div>
              </>
            ) : (
              <p className="whitespace-pre-line text-gray-300 opacity-90">{capsule.content}</p>
            )}
          </div>
          
          <div className="flex flex-wrap gap-3 mt-6">
            <button className="border border-[#2d3748] text-gray-300 opacity-80 hover:bg-[#2d3748] px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5">
              <Heart className="w-4 h-4" />
              <span>{capsule.reactions.heart}</span>
            </button>
            <button 
              className="border border-[#2d3748] text-gray-300 opacity-80 hover:bg-[#2d3748] px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5"
              onClick={handleComment}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Comment</span>
            </button>
            <button className="border border-[#2d3748] text-gray-300 opacity-80 hover:bg-[#2d3748] px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5">
              <Share className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
          
          <div className="mt-8 pt-4 border-t border-[#2d3748]/50">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Content Hash</h4>
                <a 
                  href={`https://camp-network-testnet.blockscout.com/address/${campHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-300 opacity-80 flex items-center gap-1 hover:text-[#4ade80] transition-colors"
                >
                  {campHash}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1">License</h4>
                <div className="flex items-center gap-1">
                  <span className="text-xs bg-[#2d3748] px-2 py-0.5 rounded-full">
                    {getLicense(capsule.id)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t border-[#2d3748] flex justify-between items-center">
        <div className="text-sm text-gray-300 opacity-70">
          <span className="font-medium">Tips in $ASTR help creators build more</span>
        </div>
        
        <button 
          className="bg-[#4ade80] text-[#0f1116] px-4 py-2 rounded-md font-medium transition-all hover:bg-[#3ab369] flex items-center gap-2"
          onClick={handleTip}
        >
          <Zap className="w-4 h-4" />
          <span>Tip ({capsule.tips} $ASTR)</span>
        </button>
      </div>
      
      <UnverifiedWarningModal
        isOpen={warningModalOpen}
        onClose={() => setWarningModalOpen(false)}
        onStartVerification={handleStartVerification}
        action={warningAction}
      />
      
      <VerificationModal
        isOpen={verificationModalOpen}
        onClose={() => setVerificationModalOpen(false)}
      />
    </Modal>
  );
}
 
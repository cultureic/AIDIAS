import  { useState } from 'react';
import { Heart, Zap, Maximize2, Brain, MessageSquare, Info, ExternalLink, Copy } from 'lucide-react';
import CapsuleDetailModal from './CapsuleDetailModal';
import TipModal from './TipModal';
import UnverifiedWarningModal from './UnverifiedWarningModal';
import VerificationModal from './VerificationModal';
import SwapModal from './SwapModal';
import { useAuth } from '../context/AuthContext';

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

const capsules: Capsule[] = [
  {
    id: '1',
    title: 'How to Launch a DeFi Protocol Without VC Funding',
    content: 'Creating a sustainable DeFi protocol requires focusing on community governance and innovative token distribution. Start with a small but dedicated core team and leverage community resources...',
    author: 'defi_builder',
    tags: ['DeFi', 'Web3', 'Finance'],
    tips: 32,
    rank: 'Top 5 this week',
    tone: 'idea',
    imageUrl: 'https://images.unsplash.com/photo-1617396900799-f4ec2b43c7ae?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGJsb2NrY2hhaW4lMjB0ZWNobm9sb2d5JTIwZGlnaXRhbCUyMGFydCUyMGNvbmNlcHR8ZW58MHx8fHwxNzQ2MzQxNTcwfDA&ixlib=rb-4.0.3&fit=fillmax&h=400&w=800',
    reactions: { heart: 24, bulb: 18, mind_blown: 12, brain: 7 }
  },
  {
    id: '2',
    title: 'The Future of NFTs in Digital Identity',
    content: 'NFTs can revolutionize digital identity by creating verifiable, portable credentials that users actually own. This solves the current fragmentation problem while reducing dependence on centralized identity providers...',
    author: 'nft_enthusiast',
    tags: ['NFT', 'Identity', 'Blockchain'],
    tips: 18,
    tone: 'explainer',
    imageUrl: 'https://images.unsplash.com/photo-1533158326339-7f3cf2404354?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwzfHxhYnN0cmFjdCUyMGJsb2NrY2hhaW4lMjB0ZWNobm9sb2d5JTIwZGlnaXRhbCUyMGFydCUyMGNvbmNlcHR8ZW58MHx8fHwxNzQ2MzQxNTcwfDA&ixlib=rb-4.0.3&fit=fillmax&h=400&w=800',
    reactions: { heart: 15, bulb: 22, mind_blown: 8, brain: 11 }
  },
  {
    id: '3',
    title: 'AI-Powered Collaborative Filtering Systems',
    content: 'By combining transformer models with collaborative filtering, we can create recommendation systems that understand context and user intent beyond simple pattern matching. This approach yields 37% better results in our testing...',
    author: 'data_scientist',
    tags: ['AI', 'MachineLearning', 'Data'],
    tips: 26,
    rank: 'Rising Star',
    tone: 'alpha',
    imageUrl: 'https://images.unsplash.com/photo-1579541814924-49fef17c5be5?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw0fHxhYnN0cmFjdCUyMGJsb2NrY2hhaW4lMjB0ZWNobm9sb2d5JTIwZGlnaXRhbCUyMGFydCUyMGNvbmNlcHR8ZW58MHx8fHwxNzQ2MzQxNTcwfDA&ixlib=rb-4.0.3&fit=fillmax&h=400&w=800',
    reactions: { heart: 19, bulb: 31, mind_blown: 16, brain: 24 }
  },
  {
    id: '4',
    title: 'Reflections on Building in Web3 During the Bear Market',
    content: 'The quieter periods in crypto markets are when the most important infrastructure is built. My experience leading a team through the last bear cycle taught me these five counterintuitive lessons about resilience...',
    author: 'builder_anon',
    tags: ['Reflection', 'Web3', 'Building'],
    tips: 41,
    rank: 'Most Tipped',
    tone: 'reflection',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwyfHxhYnN0cmFjdCUyMGJsb2NrY2hhaW4lMjB0ZWNobm9sb2d5JTIwZGlnaXRhbCUyMGFydCUyMGNvbmNlcHR8ZW58MHx8fHwxNzQ2MzQxNTcwfDA&ixlib=rb-4.0.3&fit=fillmax&h=400&w=800',
    reactions: { heart: 38, bulb: 16, mind_blown: 22, brain: 14 }
  },
  {
    id: '5',
    title: 'The Complete Guide to Acquiring $ASTR Tokens',
    content: 'Astra Protocol ($ASTR) is an innovative layer-2 solution that provides decentralized compliance and KYC infrastructure for DeFi applications. This guide outlines multiple strategies for acquiring, staking and maximizing your $ASTR holdings...',
    author: 'defi_educator',
    tags: ['DeFi', 'ASTR', 'TokenGuide'],
    tips: 56,
    rank: 'Featured',
    tone: 'explainer',
    imageUrl: 'https://images.unsplash.com/photo-1577083165633-14ebcdb0f658?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw1fHxhYnN0cmFjdCUyMGJsb2NrY2hhaW4lMjB0ZWNobm9sb2d5JTIwZGlnaXRhbCUyMGFydCUyMGNvbmNlcHR8ZW58MHx8fHwxNzQ2MzQxNTcwfDA&ixlib=rb-4.0.3&fit=fillmax&h=400&w=800',
    reactions: { heart: 48, bulb: 34, mind_blown: 28, brain: 18 }
  }
];

interface CapsuleFeedProps {
  sidebarState: string;
  chatState: string;
}

export default function CapsuleFeed({ sidebarState, chatState }: CapsuleFeedProps) {
  const { isLoggedIn, isVerified } = useAuth();
  const [selectedCapsule, setSelectedCapsule] = useState<Capsule | null>(null);
  const [tipModalOpen, setTipModalOpen] = useState(false);
  const [capsuleToTip, setCapsuleToTip] = useState<Capsule | null>(null);
  const [warningModalOpen, setWarningModalOpen] = useState(false);
  const [warningAction, setWarningAction] = useState('');
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);
  const [swapModalOpen, setSwapModalOpen] = useState(false);
  
  const handleOpenTipModal = (capsule: Capsule) => {
    if (!isLoggedIn) return;
    
    if (!isVerified) {
      setWarningAction('send a tip');
      setWarningModalOpen(true);
      return;
    }
    
    setCapsuleToTip(capsule);
    setTipModalOpen(true);
  };
  
  const handleStartVerification = () => {
    setWarningModalOpen(false);
    setVerificationModalOpen(true);
  };
  
  const handleOpenAstrArticle = () => {
    const astrCapsule = capsules.find(c => c.id === '5');
    if (astrCapsule) {
      setSelectedCapsule(astrCapsule);
    }
  };
  
  const getToneIcon = (tone: string) => {
    if (tone === 'idea') return '🔥';
    if (tone === 'reflection') return '✨';
    if (tone === 'explainer') return '📚';
    if (tone === 'alpha') return '🚀';
    return null;
  };
  
  // Generate mock CAMP hash
  const getCampHash = (id: string) => {
    return `0x${id.padStart(2, '0')}${Math.random().toString(16).substring(2, 10)}`;
  };
  
  // Determine CC license based on capsule ID for demo purposes
  const getLicense = (id: string) => {
    const options = ['CC BY', 'CC BY-SA', 'CC BY-NC', 'CC0'];
    return options[parseInt(id) % options.length];
  };
  
  return (
    <div className="flex-1 h-screen overflow-y-auto px-6 py-4">
      <div className="mb-6 mt-10">
        <h2 className="text-2xl font-bold mb-1">Welcome to Aidias</h2>
        <p className="text-gray-300 opacity-80">Where your AI-born ideas become viral & valuable</p>
      </div>
      
      <div className="rounded-xl p-4 bg-gradient-to-r from-[#0f172a] to-[#1a2035] mb-6 border border-[#2d3748]/50 shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <Info className="w-5 h-5 text-mint" />
          <h3 className="font-semibold">Did you know?</h3>
        </div>
        <p className="text-sm text-gray-300 mb-3">
          All interactions on Aidias, including tips and content rewards, utilize the $ASTR token on Soneium Network. 
          Learn how to <button 
            onClick={handleOpenAstrArticle}
            className="text-mint hover:underline"
          >acquire $ASTR tokens</button> to enhance your experience.
        </p>
      </div>
      
      <div className={`grid grid-cols-1 ${
        sidebarState === 'expanded' && chatState === 'expanded' ? 'md:grid-cols-1' :
        (sidebarState === 'collapsed' && chatState === 'collapsed') ? 'md:grid-cols-3' :
        'md:grid-cols-2'
      } gap-6`}>
        {capsules.map((capsule) => (
          <div key={capsule.id} className="bg-[#1a1f2c] rounded-xl overflow-hidden shadow-md transition-all hover:shadow-lg hover:-translate-y-1">
            <div className="relative h-40 overflow-hidden">
              <img 
                src={capsule.imageUrl} 
                alt={capsule.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1a1f2c]/90"></div>
              
              <button 
                className="absolute top-2 right-2 p-1.5 rounded-md bg-[#1a1f2c]/70 hover:bg-[#1a1f2c] transition-colors"
                onClick={() => setSelectedCapsule(capsule)}
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              
              <div className="absolute top-2 left-2 flex gap-1">
                {capsule.tone && (
                  <div className="text-xs px-2 py-1 bg-[#1a1f2c]/60 flex items-center gap-1 rounded-md">
                    {getToneIcon(capsule.tone)}
                  </div>
                )}
                
                {capsule.rank && (
                  <div className="text-xs px-2 py-1 bg-[#4ade80]/80 text-[#0f1116] font-medium rounded-full">
                    {capsule.rank}
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-5">
              <h3 className="text-xl font-semibold mb-2">{capsule.title}</h3>
              <p className="text-gray-300 opacity-80 mb-3 line-clamp-2">{capsule.content}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {capsule.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-1 rounded-full text-white bg-[#2d3748]">#{tag}</span>
                ))}
              </div>
              
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-300 opacity-70 flex items-center">
                  <Brain className="w-4 h-4 mr-1 text-[#4ade80]" /> 
                  <span className="font-medium ml-1">{capsule.author}</span> + AI
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex gap-3">
                  <button className="flex items-center gap-1 text-gray-300 opacity-70 hover:text-[#4ade80] transition-colors">
                    <Heart className="w-4 h-4" />
                    <span>{capsule.reactions.heart}</span>
                  </button>
                  <button 
                    className="flex items-center gap-1 text-gray-300 opacity-70 hover:text-[#4ade80] transition-colors"
                    title={`Tip this capsule with $ASTR (${capsule.tips})`}
                    onClick={() => handleOpenTipModal(capsule)}
                  >
                    <Zap className="w-4 h-4" />
                    <span>{capsule.tips}</span>
                  </button>
                </div>
                
                <div className="text-xs text-gray-400 flex items-center gap-1">
                  <Copy className="w-3 h-3" />
                  <span>{getLicense(capsule.id)}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-2 border-t border-[#2d3748]/30 flex items-center justify-between">
                <a 
                  href={`https://camp-network-testnet.blockscout.com/address/${getCampHash(capsule.id)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-400 flex items-center gap-1 hover:text-[#4ade80] transition-colors"
                >
                  <span className="font-mono truncate max-w-[180px]">{getCampHash(capsule.id).substring(0, 12)}...</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {selectedCapsule && (
        <CapsuleDetailModal 
          capsule={selectedCapsule}
          isOpen={!!selectedCapsule}
          onClose={() => setSelectedCapsule(null)}
          onTip={handleOpenTipModal}
          onSwapOpen={() => setSwapModalOpen(true)}
        />
      )}
      
      {capsuleToTip && (
        <TipModal 
          isOpen={tipModalOpen}
          onClose={() => setTipModalOpen(false)}
          capsule={capsuleToTip}
          onSwapOpen={() => setSwapModalOpen(true)}
        />
      )}
      
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
      
      <SwapModal
        isOpen={swapModalOpen}
        onClose={() => setSwapModalOpen(false)}
      />
    </div>
  );
}
 
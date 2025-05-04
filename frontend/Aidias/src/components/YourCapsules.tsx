import  { useState } from 'react';
import { Heart, Zap, Maximize2, Brain, Filter, Package, ExternalLink, Copy } from 'lucide-react';
import CapsuleDetailModal from './CapsuleDetailModal';
import TipModal from './TipModal';
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

const userCapsules: Capsule[] = [
  {
    id: '101',
    title: 'Web3 Gaming: The Future of Player-Owned Economies',
    content: 'Gaming economics are being revolutionized by blockchain technology. Players now have true ownership of in-game assets and can monetize their gameplay in ways never before possible...',
    author: 'you',
    tags: ['Gaming', 'NFT', 'Web3'],
    tips: 14,
    rank: 'Rising Star',
    tone: 'explainer',
    imageUrl: 'https://images.unsplash.com/photo-1579541814924-49fef17c5be5?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw0fHxhYnN0cmFjdCUyMGJsb2NrY2hhaW4lMjB0ZWNobm9sb2d5JTIwZGlnaXRhbCUyMGFydCUyMGNvbmNlcHR8ZW58MHx8fHwxNzQ2MzQxNTcwfDA&ixlib=rb-4.0.3&fit=fillmax&h=400&w=800',
    reactions: { heart: 19, bulb: 12, mind_blown: 8, brain: 5 }
  },
  {
    id: '102',
    title: 'On-Chain Governance: Lessons From Early DAOs',
    content: 'The evolution of decentralized governance shows distinct patterns of success and failure. This analysis of five major DAOs reveals key insights for future governance designers...',
    author: 'you',
    tags: ['Governance', 'DAO', 'Web3'],
    tips: 27,
    tone: 'reflection',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwyfHxhYnN0cmFjdCUyMGJsb2NrY2hhaW4lMjB0ZWNobm9sb2d5JTIwZGlnaXRhbCUyMGFydCUyMGNvbmNlcHR8ZW58MHx8fHwxNzQ2MzQxNTcwfDA&ixlib=rb-4.0.3&fit=fillmax&h=400&w=800',
    reactions: { heart: 24, bulb: 19, mind_blown: 15, brain: 11 }
  },
  {
    id: '103',
    title: 'Zero-Knowledge Identity Systems for DeFi Compliance',
    content: 'Privacy-preserving compliance is possible with zero-knowledge proofs. This framework enables DeFi protocols to maintain regulatory compliance without exposing user identity data...',
    author: 'you',
    tags: ['ZK-Proofs', 'DeFi', 'Privacy'],
    tips: 36,
    rank: 'Most Tipped',
    tone: 'alpha',
    imageUrl: 'https://images.unsplash.com/photo-1484589065579-248aad0d8b13?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxibG9ja2NoYWluJTIwdGVjaG5vbG9neSUyMHZlcmlmaWNhdGlvbiUyMGFic3RyYWN0fGVufDB8fHx8MTc0NjM0MDQ1M3ww&ixlib=rb-4.0.3&fit=fillmax&h=400&w=800',
    reactions: { heart: 32, bulb: 27, mind_blown: 21, brain: 18 }
  }
];

// Draft capsules that haven't been published yet
const draftCapsules: Capsule[] = [
  {
    id: 'draft1',
    title: 'Scaling Layer 2 Solutions: A Technical Comparison',
    content: 'Draft comparing ZK-Rollups, Optimistic Rollups, and Validium scaling approaches...',
    author: 'you',
    tags: ['Scaling', 'Layer2', 'ZK-Rollups'],
    tips: 0,
    tone: 'explainer',
    imageUrl: 'https://images.unsplash.com/photo-1617396900799-f4ec2b43c7ae?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGJsb2NrY2hhaW4lMjB0ZWNobm9sb2d5JTIwZGlnaXRhbCUyMGFydCUyMGNvbmNlcHR8ZW58MHx8fHwxNzQ2MzQxNTcwfDA&ixlib=rb-4.0.3&fit=fillmax&h=400&w=800',
    reactions: { heart: 0, bulb: 0, mind_blown: 0, brain: 0 }
  }
];

export default function YourCapsules() {
  const { isLoggedIn, isVerified } = useAuth();
  const [selectedCapsule, setSelectedCapsule] = useState<Capsule | null>(null);
  const [tipModalOpen, setTipModalOpen] = useState(false);
  const [capsuleToTip, setCapsuleToTip] = useState<Capsule | null>(null);
  const [swapModalOpen, setSwapModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'published' | 'drafts'>('all');
  
  const handleOpenTipModal = (capsule: Capsule) => {
    if (!isLoggedIn || !isVerified) return;
    
    setCapsuleToTip(capsule);
    setTipModalOpen(true);
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
    return options[parseInt(id) % options.length] || 'CC BY';
  };
  
  // Get filtered capsules based on current filter selection
  const getFilteredCapsules = () => {
    switch (filter) {
      case 'published':
        return userCapsules;
      case 'drafts':
        return draftCapsules;
      case 'all':
      default:
        return [...userCapsules, ...draftCapsules];
    }
  };
  
  const capsulesToDisplay = getFilteredCapsules();
  
  return (
    <div className="flex-1 h-screen overflow-y-auto px-6 py-4">
      <div className="mb-6 mt-10">
        <h2 className="text-2xl font-bold mb-1">Your Capsules</h2>
        <p className="text-gray-300 opacity-80">Manage your published and draft idea capsules</p>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <Package className="w-5 h-5 text-mint mr-2" />
            <span className="font-medium">Total: {userCapsules.length + draftCapsules.length}</span>
          </div>
          <div className="text-sm text-gray-300 opacity-80 flex items-center gap-1">
            <span>Published: {userCapsules.length}</span>
            <span className="mx-1">•</span>
            <span>Drafts: {draftCapsules.length}</span>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'published' | 'drafts')}
              className="bg-[#1a1f2c] border border-[#2d3748] rounded-md px-4 py-2 pl-10 pr-8 focus:outline-none focus:ring-1 focus:ring-[#4ade80] appearance-none"
            >
              <option value="all">All Capsules</option>
              <option value="published">Published</option>
              <option value="drafts">Drafts</option>
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {capsulesToDisplay.length === 0 ? (
        <div className="bg-[#1a1f2c] rounded-xl p-10 text-center">
          <Package className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No capsules found</h3>
          <p className="text-gray-300 opacity-80 mb-4">
            {filter === 'all' 
              ? "You haven't created any capsules yet" 
              : filter === 'published' 
              ? "You don't have any published capsules yet" 
              : "You don't have any draft capsules"}
          </p>
          <button className="bg-[#4ade80] text-[#0f1116] px-4 py-2 rounded-md font-medium transition-all hover:bg-[#3ab369]">
            Create a Capsule
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capsulesToDisplay.map((capsule) => (
            <div 
              key={capsule.id} 
              className={`bg-[#1a1f2c] rounded-xl overflow-hidden shadow-md transition-all hover:shadow-lg hover:-translate-y-1 ${
                capsule.id.startsWith('draft') ? 'border border-dashed border-[#2d3748]' : ''
              }`}
            >
              <div className="relative h-40 overflow-hidden">
                <img 
                  src={capsule.imageUrl} 
                  alt={capsule.title}
                  className={`w-full h-full object-cover ${
                    capsule.id.startsWith('draft') ? 'opacity-60' : ''
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1a1f2c]/90"></div>
                
                <button 
                  className="absolute top-2 right-2 p-1.5 rounded-md bg-[#1a1f2c]/70 hover:bg-[#1a1f2c] transition-colors"
                  onClick={() => setSelectedCapsule(capsule)}
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                
                <div className="absolute top-2 left-2 flex gap-1">
                  {capsule.id.startsWith('draft') && (
                    <div className="text-xs px-2 py-1 bg-[#2d3748] text-white font-medium rounded-full">
                      Draft
                    </div>
                  )}
                  
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
                    <span className="font-medium ml-1">You</span> + AI
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex gap-3">
                    <div className="flex items-center gap-1 text-gray-300 opacity-70">
                      <Heart className="w-4 h-4" />
                      <span>{capsule.reactions.heart}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-300 opacity-70">
                      <Zap className="w-4 h-4" />
                      <span>{capsule.tips}</span>
                    </div>
                  </div>
                  
                  {!capsule.id.startsWith('draft') && (
                    <div className="text-xs text-gray-400 flex items-center gap-1">
                      <Copy className="w-3 h-3" />
                      <span>{getLicense(capsule.id)}</span>
                    </div>
                  )}
                </div>
                
                {!capsule.id.startsWith('draft') && (
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
                )}
                
                {capsule.id.startsWith('draft') && (
                  <div className="mt-4 pt-2 border-t border-[#2d3748]/30 flex items-center justify-between">
                    <button className="text-xs text-gray-300 hover:text-white transition-colors">
                      Edit Draft
                    </button>
                    <button className="text-xs text-mint hover:underline">
                      Continue Publishing
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
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
      
      <SwapModal
        isOpen={swapModalOpen}
        onClose={() => setSwapModalOpen(false)}
      />
    </div>
  );
}
 
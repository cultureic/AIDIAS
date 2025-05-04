import  { Shield, Copy, Zap, Heart, MessageSquare, ExternalLink, Edit, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import VerificationModal from './VerificationModal';
import { useState } from 'react';

export default function UserProfile() {
  const { isLoggedIn, isVerified, walletAddress } = useAuth();
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);
  
  // Mock user data
  const userData = {
    username: "crypto_builder",
    bio: "Building decentralized systems for a better future. ZK researcher and DeFi enthusiast. Always learning, always building.",
    totalTips: 77,
    totalReceivedASTR: 312.5,
    joinedDate: "March 2023",
    totalPublishedCapsules: 3,
    totalReactions: {
      hearts: 75,
      minds: 42,
      sparkles: 21,
      comments: 18
    },
    website: "https://example.com"
  };
  
  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  if (!isLoggedIn) {
    return (
      <div className="flex-1 h-screen flex items-center justify-center p-6">
        <div className="bg-[#1a1f2c] rounded-xl p-8 max-w-md text-center">
          <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Connect Your Wallet</h2>
          <p className="text-gray-300 opacity-80 mb-6">
            Connect your wallet to view and manage your profile information
          </p>
          <button className="bg-[#4ade80] text-[#0f1116] px-6 py-3 rounded-md font-medium transition-all hover:bg-[#3ab369]">
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex-1 h-screen overflow-y-auto px-6 py-4">
      <div className="mb-10 mt-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-1">Your Profile</h2>
            <p className="text-gray-300 opacity-80">Manage your profile and view your contributions</p>
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 rounded-md border border-[#2d3748] hover:bg-[#2d3748] transition-colors">
            <Edit className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Overview Card */}
          <div className="bg-[#1a1f2c] rounded-xl overflow-hidden shadow-md">
            <div className="h-32 bg-gradient-to-r from-[#4ade80]/20 to-[#3ab369]/30"></div>
            <div className="px-6 py-5">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-[#2d3748] border-4 border-[#1a1f2c] flex items-center justify-center -mt-14 mb-3 text-2xl font-bold">
                  {userData.username.substring(0, 2).toUpperCase()}
                </div>
                
                <h3 className="text-xl font-bold mb-1">@{userData.username}</h3>
                
                {isVerified ? (
                  <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-[#4ade80]/20 text-[#4ade80] mb-3">
                    <Shield className="w-3 h-3" />
                    <span>ZK Verified</span>
                  </div>
                ) : (
                  <button 
                    className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-colors mb-3"
                    onClick={() => setVerificationModalOpen(true)}
                  >
                    <Shield className="w-3 h-3" />
                    <span>Verify with ZK Proof</span>
                  </button>
                )}
                
                <p className="text-gray-300 opacity-90 text-sm text-center mb-4">
                  {userData.bio}
                </p>
                
                {walletAddress && (
                  <div className="flex items-center gap-1 text-xs text-gray-300 opacity-80 bg-[#0f1116] px-3 py-1.5 rounded-full mb-4">
                    <span className="font-mono">{truncateAddress(walletAddress)}</span>
                    <button className="p-0.5 hover:text-[#4ade80] transition-colors">
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                )}
                
                <div className="w-full flex justify-between text-sm text-gray-300 opacity-80">
                  <div>Joined {userData.joinedDate}</div>
                  {userData.website && (
                    <a 
                      href={userData.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-[#4ade80] transition-colors"
                    >
                      <span>Website</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#1a1f2c] rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#4ade80]" />
                Tip Statistics
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-[#2d3748]">
                  <span className="text-gray-300 opacity-80">Total Tips Received</span>
                  <span className="font-bold">{userData.totalTips}</span>
                </div>
                
                <div className="flex justify-between items-center pb-2 border-b border-[#2d3748]">
                  <span className="text-gray-300 opacity-80">Total $ASTR Earned</span>
                  <span className="font-bold text-[#4ade80]">{userData.totalReceivedASTR}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 opacity-80">Highest Tipped Capsule</span>
                  <span className="font-bold">36 $ASTR</span>
                </div>
              </div>
            </div>
            
            <div className="bg-[#1a1f2c] rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-[#4ade80]" />
                Content & Engagement
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-[#2d3748]">
                  <span className="text-gray-300 opacity-80">Published Capsules</span>
                  <span className="font-bold">{userData.totalPublishedCapsules}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 opacity-80">Total Reactions</span>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-1 text-gray-300 opacity-80">
                      <Heart className="w-3 h-3" />
                      <span>{userData.totalReactions.hearts}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-300 opacity-80">
                      <MessageSquare className="w-3 h-3" />
                      <span>{userData.totalReactions.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <VerificationModal
        isOpen={verificationModalOpen}
        onClose={() => setVerificationModalOpen(false)}
      />
    </div>
  );
}
 
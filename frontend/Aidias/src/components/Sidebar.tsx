//@ts-nocheck
import { useState } from 'react';
import { Home, Package, User, Wallet, Brain, ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  onStartVerification: () => void;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({ isCollapsed, toggleSidebar, onStartVerification, onTabChange }: SidebarProps) {
  const [activeTab, setActiveTab] = useState('explore');
  const { isLoggedIn, isVerified, walletAddress, loginHook, logoutHook, initialize } = useAuth();

  const tabs = [
    { id: 'explore', label: 'Explore', icon: <Home className="w-5 h-5" /> },
    { id: 'capsules', label: 'Your Capsules', icon: <Package className="w-5 h-5" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange(tabId);
  };

  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="h-screen border-r border-[#2d3748] flex flex-col relative">
      <div className={`p-4 border-b border-[#2d3748] ${isCollapsed ? 'flex justify-center' : ''}`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2'}`}>
          <Brain className="w-6 h-6 text-[#4ade80]" />
          {!isCollapsed && <h1 className="text-xl font-bold">Aidias</h1>}
        </div>
      </div>

      <button
        className="absolute top-4 right-0 translate-x-1/2 z-10 bg-[#1a1f2c] p-1 rounded-full border border-[#2d3748]"
        onClick={toggleSidebar}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      <div className="flex-1 py-4 overflow-y-auto">
        <nav className="space-y-1 px-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-[#2d3748] transition-colors w-full text-left ${activeTab === tab.id ? 'bg-[#2d3748] font-medium' : ''
                } ${isCollapsed ? 'justify-center' : ''}`}
              onClick={() => handleTabChange(tab.id)}
            >
              {tab.icon}
              {!isCollapsed && <span>{tab.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      <div className={`p-4 space-y-2 border-t border-[#2d3748] ${isCollapsed ? 'flex flex-col items-center gap-2' : ''}`}>
        {isCollapsed ? (
          <>
            <button
              className={`p-2 rounded-md ${isLoggedIn ? 'bg-[#2d3748]' : 'bg-[#4ade80] text-[#0f1116]'} hover:brightness-110 transition-colors`}
              onClick={() => isLoggedIn ? logoutHook() : loginHook()}
            >
              <Wallet className="w-5 h-5" />
            </button>

            {isLoggedIn && !isVerified && (
              <button
                className="p-2 rounded-md bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-colors"
                onClick={onStartVerification}
                title="ZK Verify account"
              >
                <Lock className="w-5 h-5" />
              </button>
            )}
          </>
        ) : (
          <>
            <button
              className={`px-4 py-2 rounded-md font-medium transition-all w-full flex items-center justify-center gap-2 ${isLoggedIn
                  ? 'bg-[#2d3748] text-white hover:bg-[#374151]'
                  : 'bg-[#4ade80] text-[#0f1116] hover:bg-[#3ab369]'
                }`}
              onClick={() => isLoggedIn ? logoutHook() : loginHook()}
            >
              <Wallet className="w-4 h-4" />
              {isLoggedIn
                ? (isVerified && walletAddress
                  ? truncateAddress(walletAddress)
                  : "Wallet Connected")
                : "Connect Wallet"}
            </button>

            {isLoggedIn && !isVerified && (
              <button
                className="px-4 py-2 rounded-md font-medium transition-all w-full flex items-center justify-center gap-2 bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                onClick={onStartVerification}
              >
                <Lock className="w-4 h-4" />
                ZK Verification
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

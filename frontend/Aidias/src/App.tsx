import  { useState } from 'react';
import Sidebar from './components/Sidebar';
import CapsuleFeed from './components/CapsuleFeed';
import YourCapsules from './components/YourCapsules';
import UserProfile from './components/UserProfile';
import ChatInterface from './components/ChatInterface';
import VerificationModal from './components/VerificationModal';
import UnverifiedWarningModal from './components/UnverifiedWarningModal';
import ProfileVerificationBanner from './components/ProfileVerificationBanner';
import { MessageSquare } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';

type PanelState = 'expanded' | 'collapsed' | 'hidden' | 'fullwidth';

function AppContent() {
  const [sidebarState, setSidebarState] = useState<PanelState>('expanded');
  const [chatState, setChatState] = useState<PanelState>('collapsed');
  const { isLoggedIn, isVerified } = useAuth();
  const [currentTab, setCurrentTab] = useState('explore');
  
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);
  const [warningModalOpen, setWarningModalOpen] = useState(false);
  const [warningAction, setWarningAction] = useState('');
  
  const toggleSidebar = () => {
    setSidebarState(prev => prev === 'expanded' ? 'collapsed' : 'expanded');
  };
  
  const toggleChat = () => {
    if (!isLoggedIn) return;
    
    if (!isVerified) {
      setWarningAction('use the chat');
      setWarningModalOpen(true);
      return;
    }
    
    if (chatState === 'expanded') {
      setChatState('collapsed');
    } else if (chatState === 'collapsed') {
      setChatState('expanded');
    } else if (chatState === 'fullwidth') {
      setChatState('expanded');
    }
  };
  
  const expandChatFullWidth = () => {
    if (isVerified) {
      setChatState('fullwidth');
    }
  };
  
  const handleStartVerification = () => {
    setWarningModalOpen(false);
    setVerificationModalOpen(true);
  };

  const renderCurrentTab = () => {
    switch (currentTab) {
      case 'capsules':
        return <YourCapsules />;
      case 'profile':
        return <UserProfile />;
      case 'explore':
      default:
        return (
          <CapsuleFeed 
            sidebarState={sidebarState}
            chatState={chatState}
          />
        );
    }
  };

  return (
    <div className="flex flex-col h-screen bg-dark-bg text-white overflow-hidden">
      <ProfileVerificationBanner onStartVerification={handleStartVerification} />
      
      <div className="flex flex-1 overflow-hidden">
        <div className={`sidebar-container transition-all duration-300 ${
          sidebarState === 'expanded' ? 'w-64' : 'w-16'
        } ${chatState === 'fullwidth' ? 'hidden md:block' : ''}`}>
          <Sidebar 
            isCollapsed={sidebarState === 'collapsed'} 
            toggleSidebar={toggleSidebar}
            onStartVerification={handleStartVerification}
            onTabChange={setCurrentTab}
          />
        </div>
        
        <div className="flex-1 flex overflow-hidden">
          {chatState !== 'fullwidth' && (
            renderCurrentTab()
          )}
          
          {chatState !== 'collapsed' && (
            <div className={`transition-all duration-300 ${
              chatState === 'fullwidth' ? 'w-full' : 'w-96'
            }`}>
              <ChatInterface 
                onClose={toggleChat} 
                onExpand={expandChatFullWidth} 
                isFullWidth={chatState === 'fullwidth'}
              />
            </div>
          )}
        </div>
      </div>
      
      {chatState === 'collapsed' && (
        <div className="fixed right-6 bottom-6 flex flex-col gap-3 items-end z-20">
          <button 
            className="p-3 rounded-full bg-mint text-dark-bg shadow-lg hover:bg-[#3ab369] transition-colors"
            onClick={toggleChat}
            aria-label="Open chat"
          >
            <MessageSquare className="w-5 h-5" />
          </button>
        </div>
      )}
      
      <VerificationModal
        isOpen={verificationModalOpen}
        onClose={() => setVerificationModalOpen(false)}
      />
      
      <UnverifiedWarningModal
        isOpen={warningModalOpen}
        onClose={() => setWarningModalOpen(false)}
        onStartVerification={handleStartVerification}
        action={warningAction}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
 
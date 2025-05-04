//@ts-nocheck
import { useState, useRef, useEffect } from 'react';
import { Send, X, Sparkles, Maximize2, Minimize2, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLLMActor } from '../context/LLM.jsx';
import UnverifiedWarningModal from './UnverifiedWarningModal';
import VerificationModal from './VerificationModal';
import GlowModal from './GlowModal'; // Add this import

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
}

interface ChatInterfaceProps {
  onClose: () => void;
  onExpand: () => void;
  isFullWidth: boolean;
}

export default function ChatInterface({ onClose, onExpand, isFullWidth }: ChatInterfaceProps) {
  const { isLoggedIn, isVerified } = useAuth();
  const { chatComplete, loading: llmLoading, error: llmError } = useLLMActor();
  const [input, setInput] = useState('');
  const [warningModalOpen, setWarningModalOpen] = useState(false);
  const [warningAction, setWarningAction] = useState('');
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([ 
    {
      id: '1',
      content: "Hi there! I'm your AI assistant. How can I help you generate innovative ideas today?",
      sender: 'ai'
    }
  ]);
  const [glowModalOpen, setGlowModalOpen] = useState(false); // Add this state
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!isLoggedIn) return;
    
    if (!isVerified) {
      setWarningAction('send messages');
      setWarningModalOpen(true);
      return;
    }
    
    if (input.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        content: input,
        sender: 'user'
      };
      
      setMessages(prev => [...prev, newMessage]);
      setInput('');
      
      try {
        const llmMessages = [
          ...messages.filter(m => m.sender === 'ai').map(m => ({
            role: 'assistant',
            content: m.content
          })),
          ...messages.filter(m => m.sender === 'user').map(m => ({
            role: 'user',
            content: m.content
          })),
          {
            role: 'user',
            content: input
          }
        ];
  
        const response = await chatComplete({
          model: "llama3.1:8b",
          messages: llmMessages
        });
  
        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: typeof response === 'string' ? response : "I didn't get a valid response.",
          sender: 'ai'
        };
        setMessages(prev => [...prev, aiResponse]);
  
      } catch (err) {
        const errorMessage: ChatMessage = {
          id: `error-${Date.now()}`,
          content: `Sorry, I encountered an error: ${err.message}`,
          sender: 'ai'
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    }
  };
  
  const handleGlowIt = async () => {
    if (!isLoggedIn) return;
    
    if (!isVerified) {
      setWarningAction('glow and compile your conversation');
      setWarningModalOpen(true);
      return;
    }
    
    // Instead of generating a capsule directly, open the Glow modal
    setGlowModalOpen(true);
  };
  
  const handleStartVerification = () => {
    setWarningModalOpen(false);
    setVerificationModalOpen(true);
  };
  
  return (
    <div className="h-screen flex flex-col border-l border-[#2d3748] bg-[#0f1116]">
      <div className="p-4 border-b border-[#2d3748] flex justify-between items-center">
        <h2 className="text-lg font-semibold">AI Chat</h2>
        <div className="flex items-center gap-2">
          {!isFullWidth ? (
            <button 
              onClick={onExpand}
              className="p-1 rounded-full hover:bg-[#2d3748] transition-colors"
              aria-label="Expand to full width"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          ) : (
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-[#2d3748] transition-colors"
              aria-label="Reduce to panel"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
          )}
          
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[#2d3748] transition-colors"
            aria-label="Close chat panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`p-4 rounded-lg ${
              message.sender === 'user' 
                ? 'bg-[#2d3748]' 
                : 'bg-[#1a1f2c]'
            } ${
              message.id.startsWith('error') ? 'border border-red-500' : ''
            }`}
          >
            {message.id.startsWith('capsule') ? (
              <div 
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: message.content.replace(/\n/g, '<br />') }}
              />
            ) : (
              <p className="whitespace-pre-line">{message.content}</p>
            )}
          </div>
        ))}
        {llmLoading && (
          <div className="p-4 rounded-lg bg-[#1a1f2c]">
            <p className="text-gray-400">Thinking...</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="px-4 py-3 border-t border-[#2d3748] bg-[#1a1f2c]/50 flex justify-center">
        <button 
          className={`flex items-center gap-1 px-4 py-2 rounded-md transition-all border ${
            llmLoading 
              ? 'border-gray-500 text-gray-500 cursor-not-allowed' 
              : 'border-[#4ade80] text-[#4ade80] hover:bg-[#4ade80]/10'
          }`}
          onClick={handleGlowIt}
          disabled={llmLoading}
        >
          <Sparkles className="w-4 h-4" /> 
          Glow It
        </button>
      </div>
      
      <div className="p-4 border-t border-[#2d3748]">
        <div className="flex items-center">
          <input
            type="text"
            className="flex-1 bg-[#1a1f2c] border-0 rounded-l-md p-2 focus:outline-none focus:ring-1 focus:ring-[#4ade80]"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !llmLoading && handleSend()}
            disabled={llmLoading}
          />
          <button 
            className={`p-2 rounded-r-md ${
              llmLoading
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-[#4ade80] text-[#0f1116] hover:bg-[#3ab369]'
            }`}
            onClick={handleSend}
            disabled={llmLoading}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
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
      
      {/* Add the GlowModal component */}
      <GlowModal
        isOpen={glowModalOpen}
        onClose={() => setGlowModalOpen(false)}
        conversation={messages}
      />
      
      {!isVerified && isLoggedIn && (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-b from-[#0f1116]/80 to-[#0f1116]/95 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="text-center p-6 max-w-sm">
            <Shield className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">ZK Verification Required</h3>
            <p className="text-gray-300 mb-6">
              You need to complete zero-knowledge verification to chat with AI and create capsules.
            </p>
            <button
              className="bg-[#4ade80] text-[#0f1116] px-6 py-3 rounded-md font-medium transition-all hover:bg-[#3ab369]"
              onClick={handleStartVerification}
            >
              Verify My Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
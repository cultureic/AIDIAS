import  { useState } from 'react';
import Modal from 'react-modal';
import { X, Zap, ArrowRight } from 'lucide-react';

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

interface TipModalProps {
  isOpen: boolean;
  onClose: () => void;
  capsule: Capsule | null;
  onSwapOpen: () => void;
}

export default function TipModal({ isOpen, onClose, capsule, onSwapOpen }: TipModalProps) {
  const [tipAmount, setTipAmount] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [astrBalance, setAstrBalance] = useState(0.5); // Mock user balance
  
  if (!capsule) return null;
  
  const handleTip = () => {
    if (astrBalance < tipAmount) {
      // Not enough balance, suggest getting more ASTR
      onClose();
      onSwapOpen();
      return;
    }
    
    setIsSubmitting(true);
    // Simulate transaction
    setTimeout(() => {
      setIsSubmitting(false);
      setAstrBalance(prev => prev - tipAmount);
      onClose();
    }, 1000);
  };
  
  const predefinedAmounts = [1, 3, 5, 10];
  
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="w-[400px] max-w-[90vw] bg-[#1a1f2c] rounded-xl mx-auto mt-[10vh] outline-none max-h-[80vh] overflow-y-auto"
      overlayClassName="fixed inset-0 flex items-start justify-center bg-black/75 overflow-y-auto py-4"
    >
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">Tip Creator</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-[#2d3748]">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="text-center mb-4">
          <p className="text-gray-300 opacity-80 mb-1">Sending to</p>
          <p className="font-medium">{capsule.author}</p>
          <p className="text-gray-300 opacity-80 mt-1 text-sm">For: "{capsule.title}"</p>
        </div>
        
        <div className="flex justify-between items-center text-sm mb-2 px-1">
          <div className="flex items-center gap-1 text-gray-300">
            <span>Your balance:</span>
          </div>
          <div className="font-medium">
            {astrBalance} <span className="text-mint">$ASTR</span>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Choose Amount</label>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {predefinedAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => setTipAmount(amount)}
                className={`py-2 rounded-md ${
                  tipAmount === amount 
                    ? 'bg-[#4ade80] text-[#0f1116] font-medium' 
                    : 'bg-[#2d3748] hover:bg-[#374151]'
                }`}
              >
                {amount}
              </button>
            ))}
          </div>
          
          <div className="flex items-center">
            <div className="relative flex-1">
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={tipAmount}
                onChange={(e) => setTipAmount(Number(e.target.value))}
                className="w-full bg-[#0f1116] border border-[#2d3748] rounded-md p-2 pr-16 focus:outline-none focus:ring-1 focus:ring-[#4ade80]"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 opacity-70">$ASTR</span>
            </div>
          </div>
        </div>
        
        {astrBalance < tipAmount && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-md p-3 text-sm text-amber-200">
            <div className="flex items-start gap-2">
              <div className="mt-0.5">⚠️</div>
              <div>
                <p className="font-medium mb-1">Insufficient $ASTR balance</p>
                <p className="opacity-80">You need {tipAmount - astrBalance} more $ASTR to complete this tip.</p>
                <button 
                  onClick={() => {
                    onClose();
                    onSwapOpen();
                  }}
                  className="text-mint hover:underline flex items-center gap-1 mt-2"
                >
                  Get more $ASTR <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        )}
        
        <button 
          className={`bg-[#4ade80] text-[#0f1116] px-4 py-2 rounded-md font-medium transition-all hover:bg-[#3ab369] w-full flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-80' : ''}`}
          onClick={handleTip}
          disabled={isSubmitting}
        >
          <Zap className="w-4 h-4" />
          <span>{isSubmitting ? 'Processing...' : 'Send Tip'}</span>
        </button>
        
        <p className="text-xs text-center text-gray-300 opacity-60 mt-2">
          Tips are non-refundable and 95% goes directly to creators on Soneium Network
        </p>
      </div>
    </Modal>
  );
}
 
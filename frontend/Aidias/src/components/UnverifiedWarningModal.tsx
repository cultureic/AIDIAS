import  Modal from 'react-modal';
import { X, AlertTriangle, Shield, Lock } from 'lucide-react';

Modal.setAppElement('#root');

interface UnverifiedWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartVerification: () => void;
  action: string;
}

export default function UnverifiedWarningModal({ 
  isOpen, 
  onClose, 
  onStartVerification, 
  action 
}: UnverifiedWarningModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="w-[400px] max-w-[90vw] bg-[#1a1f2c] rounded-xl mx-auto mt-[15vh] outline-none p-6"
      overlayClassName="fixed inset-0 flex items-start justify-center bg-black/75 overflow-y-auto py-4"
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold flex items-center gap-2 text-amber-400">
            <AlertTriangle className="w-5 h-5" />
            ZK Verification Required
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-[#2d3748]">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="py-3">
          <p className="mb-3">
            You need to complete ZK-proof verification before you can {action}.
          </p>
          <div className="bg-[#0f1116] p-3 rounded-lg mb-3">
            <div className="flex items-start gap-2">
              <Lock className="w-4 h-4 text-mint mt-0.5" />
              <div>
                <h4 className="text-sm font-medium mb-1">Why ZK Verification?</h4>
                <p className="text-xs text-gray-300 opacity-80">
                  Zero-knowledge proofs allow us to verify your identity without exposing personal data, ensuring privacy while maintaining platform integrity.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 pt-2">
          <button 
            className="px-4 py-2 rounded-md border border-[#2d3748] hover:bg-[#2d3748] transition-colors flex-1"
            onClick={onClose}
          >
            Later
          </button>
          
          <button 
            className="bg-[#4ade80] text-[#0f1116] px-4 py-2 rounded-md font-medium transition-all hover:bg-[#3ab369] flex-1 flex items-center justify-center gap-2"
            onClick={onStartVerification}
          >
            <Shield className="w-4 h-4" />
            Verify Now
          </button>
        </div>
      </div>
    </Modal>
  );
}
 
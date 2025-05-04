import  { useState } from 'react';
import Modal from 'react-modal';
import { X, MapPin, Shield, CheckCircle, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

Modal.setAppElement('#root');

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VerificationModal({ isOpen, onClose }: VerificationModalProps) {
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isZkVerifying, setIsZkVerifying] = useState(false);
  const { completeVerification } = useAuth();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsZkVerifying(true);
    
    // Simulate zk-proof verification process
    setTimeout(() => {
      setIsZkVerifying(false);
      
      // After zk verification, complete the process
      setTimeout(() => {
        completeVerification(location);
        setIsSubmitting(false);
        onClose();
      }, 800);
    }, 2000);
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="w-[500px] max-w-[90vw] bg-[#1a1f2c] rounded-xl mx-auto mt-[10vh] outline-none max-h-[85vh] overflow-y-auto"
      overlayClassName="fixed inset-0 flex items-start justify-center bg-black/75 overflow-y-auto pt-4 pb-6"
    >
      <div className="p-6 space-y-5">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#4ade80]" /> 
            Verify Your Identity
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-[#2d3748]">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="relative h-40 overflow-hidden rounded-lg mb-2">
          <img 
            src="https://images.unsplash.com/photo-1484589065579-248aad0d8b13?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxibG9ja2NoYWluJTIwdGVjaG5vbG9neSUyMHZlcmlmaWNhdGlvbiUyMGFic3RyYWN0fGVufDB8fHx8MTc0NjM0MDQ1M3ww&ixlib=rb-4.0.3&fit=fillmax&h=400&w=800" 
            alt="ZK-Proof Verification"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1a1f2c]/90"></div>
          <div className="absolute top-4 left-4 bg-[#4ade80]/20 text-[#4ade80] px-2 py-1 rounded-md text-xs font-medium backdrop-blur-sm">
            <div className="flex items-center gap-1">
              <Lock className="w-3 h-3" />
              <span>Zero-Knowledge Proof</span>
            </div>
          </div>
        </div>
        
        <div className="text-center mb-4">
          <h3 className="text-lg font-medium mb-2">Enhanced Privacy Verification</h3>
          <p className="text-gray-300 opacity-80 text-sm">
            Complete your identity verification using zero-knowledge proofs to access all features while maintaining your privacy.
          </p>
        </div>
        
        {isZkVerifying ? (
          <div className="bg-[#0f1116] rounded-lg p-6 flex flex-col items-center">
            <div className="h-16 w-16 rounded-full border-4 border-t-[#4ade80] border-[#2d3748] animate-spin mb-4"></div>
            <h4 className="font-medium mb-2">Generating ZK-Proof</h4>
            <p className="text-gray-300 opacity-80 text-sm text-center">
              Please wait while we securely verify your identity without exposing your personal information...
            </p>
            <div className="w-full mt-6 h-2 bg-[#2d3748] rounded-full overflow-hidden">
              <div className="h-full bg-[#4ade80] animate-pulse" style={{width: '70%'}}></div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="bg-[#0f1116] rounded-lg p-4 mb-5">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-[#4ade80] mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">Zero-Knowledge Verification</h4>
                  <p className="text-xs text-gray-300 opacity-80 mb-2">
                    Our ZK-proof system verifies your identity without revealing personal information. This allows:
                  </p>
                  <ul className="text-xs text-gray-300 opacity-80 space-y-1 ml-4 list-disc">
                    <li>Full verification without exposing personal data</li>
                    <li>On-chain proof of verification</li>
                    <li>Privacy-preserving identity verification</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Your Location</label>
              <div className="flex items-center">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Enter your city or region"
                    className="w-full bg-[#0f1116] border border-[#2d3748] rounded-md p-2 pl-10 focus:outline-none focus:ring-1 focus:ring-[#4ade80]"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-[#0f1116] rounded-md p-3 mb-5">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#4ade80] mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">Privacy Protection</h4>
                  <p className="text-xs text-gray-300 opacity-80">
                    Your location is only used to generate a ZK-proof. We never store or share your specific details.
                  </p>
                </div>
              </div>
            </div>
            
            <button 
              type="submit"
              className={`bg-[#4ade80] text-[#0f1116] px-4 py-2 rounded-md font-medium transition-all hover:bg-[#3ab369] w-full flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-80 cursor-not-allowed' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Verifying...' : 'Begin ZK Verification'}
            </button>
          </form>
        )}
      </div>
    </Modal>
  );
}
 
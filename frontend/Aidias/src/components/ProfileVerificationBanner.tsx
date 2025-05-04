import  { Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ProfileVerificationBannerProps {
  onStartVerification: () => void;
}

export default function ProfileVerificationBanner({ onStartVerification }: ProfileVerificationBannerProps) {
  const { isLoggedIn, isVerified } = useAuth();
  
  if (!isLoggedIn || isVerified) return null;
  
  return (
    <div className="bg-amber-500/20 border-b border-amber-500/30">
      <div className="container mx-auto px-4 py-2 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-amber-400" />
          <span className="text-sm">
            <span className="font-medium">ZK Verification required:</span> 
            {' '}Complete the zero-knowledge verification process to unlock all features.
          </span>
        </div>
        <button 
          className="mt-2 md:mt-0 px-3 py-1 text-sm bg-amber-500/30 hover:bg-amber-500/40 transition-colors rounded-full text-amber-200 flex items-center gap-1"
          onClick={onStartVerification}
        >
          <Shield className="w-3 h-3" />
          Verify Now
        </button>
      </div>
    </div>
  );
}
 
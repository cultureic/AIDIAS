import  { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { X, ArrowDown, RefreshCw, Info, Zap } from 'lucide-react';

Modal.setAppElement('#root');

interface SwapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SwapModal({ isOpen, onClose }: SwapModalProps) {
  const [fromToken, setFromToken] = useState('ETH');
  const [toToken] = useState('ASTR');
  const [fromAmount, setFromAmount] = useState('0.01');
  const [toAmount, setToAmount] = useState('0');
  const [swapRate, setSwapRate] = useState(450); // 1 ETH = 450 ASTR
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [swapComplete, setSwapComplete] = useState(false);
  
  const fromTokenOptions = [
    { value: 'ETH', label: 'Ethereum', logo: '⟠' },
    { value: 'USDT', label: 'Tether', logo: '₮' },
    { value: 'USDC', label: 'USD Coin', logo: '₵' }
  ];
  
  useEffect(() => {
    if (fromAmount && !isNaN(parseFloat(fromAmount))) {
      const tokenRate = fromToken === 'ETH' ? swapRate : 
                      fromToken === 'USDT' ? 0.9 : 
                      fromToken === 'USDC' ? 0.9 : 1;
                      
      const calculatedAmount = parseFloat(fromAmount) * tokenRate;
      setToAmount(calculatedAmount.toFixed(2));
    } else {
      setToAmount('0');
    }
  }, [fromAmount, fromToken, swapRate]);
  
  const handleFromTokenChange = (token: string) => {
    setFromToken(token);
  };
  
  const handleSwap = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setConfirming(true);
      
      // Simulate confirmation
      setTimeout(() => {
        setConfirming(false);
        setSwapComplete(true);
      }, 1500);
    }, 1000);
  };
  
  const resetState = () => {
    setFromAmount('0.01');
    setSwapComplete(false);
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={swapComplete ? () => {
        onClose();
        resetState();
      } : loading || confirming ? () => {} : onClose}
      className="w-[450px] max-w-[90vw] bg-[#1a1f2c] rounded-xl mx-auto mt-[10vh] outline-none max-h-[80vh] overflow-y-auto"
      overlayClassName="fixed inset-0 flex items-start justify-center bg-black/80 overflow-y-auto pt-4 pb-6"
    >
      {swapComplete ? (
        <div className="p-6 space-y-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Swap Complete</h2>
            <button 
              onClick={() => {
                onClose();
                resetState();
              }} 
              className="p-1 rounded-full hover:bg-[#2d3748]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex flex-col items-center justify-center py-6">
            <div className="w-16 h-16 bg-[#4ade80]/20 rounded-full flex items-center justify-center mb-4">
              <Zap className="w-8 h-8 text-[#4ade80]" />
            </div>
            
            <h3 className="text-xl font-medium mb-1">Swap Successful!</h3>
            <p className="text-gray-300 opacity-80 text-center mb-3">
              You've successfully acquired {toAmount} $ASTR tokens on Soneium Network.
            </p>
            
            <div className="bg-[#0f1116] w-full rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-300 opacity-70">Amount</span>
                <span className="font-medium">{toAmount} $ASTR</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300 opacity-70">Paid</span>
                <span className="font-medium">{fromAmount} {fromToken}</span>
              </div>
            </div>
            
            <button
              onClick={() => {
                onClose();
                resetState();
              }}
              className="bg-[#4ade80] text-[#0f1116] px-6 py-2 rounded-md font-medium transition-all hover:bg-[#3ab369] w-full"
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold">Swap to $ASTR</h2>
            <button 
              onClick={onClose} 
              className="p-1 rounded-full hover:bg-[#2d3748]"
              disabled={loading || confirming}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="bg-[#0f1116] rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">From</span>
              <div className="flex gap-2">
                {fromTokenOptions.map(token => (
                  <button
                    key={token.value}
                    onClick={() => handleFromTokenChange(token.value)}
                    className={`px-2 py-1 text-xs rounded-md ${
                      fromToken === token.value 
                        ? 'bg-[#4ade80]/20 text-[#4ade80]' 
                        : 'bg-[#2d3748] hover:bg-[#374151]'
                    }`}
                  >
                    {token.logo} {token.value}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                type="number"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                disabled={loading || confirming}
                className="flex-1 bg-transparent border-0 focus:outline-none focus:ring-0 text-xl font-medium"
                placeholder="0.0"
              />
              <div className="flex items-center gap-1">
                <span className="text-xl font-medium">{fromToken}</span>
              </div>
            </div>
            
            <div className="text-xs text-gray-400 mt-1">
              {fromToken === 'ETH' ? '≈ $' + (parseFloat(fromAmount || '0') * 2500).toFixed(2) : 
               fromToken === 'USDT' || fromToken === 'USDC' ? '≈ $' + parseFloat(fromAmount || '0').toFixed(2) : ''}
            </div>
          </div>
          
          <div className="flex justify-center -my-2 relative z-10">
            <div className="bg-[#1a1f2c] p-1 rounded-full border border-[#2d3748]">
              <ArrowDown className="w-5 h-5 text-[#4ade80]" />
            </div>
          </div>
          
          <div className="bg-[#0f1116] rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">To</span>
              <div className="px-2 py-1 text-xs rounded-md bg-[#4ade80]/20 text-[#4ade80]">
                ★ ASTR
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                type="text"
                value={toAmount}
                readOnly
                className="flex-1 bg-transparent border-0 focus:outline-none focus:ring-0 text-xl font-medium"
                placeholder="0.0"
              />
              <div className="flex items-center gap-1">
                <span className="text-xl font-medium">ASTR</span>
              </div>
            </div>
            
            <div className="text-xs text-gray-400 mt-1">
              ≈ ${(parseFloat(toAmount || '0') * 5.5).toFixed(2)}
            </div>
          </div>
          
          <div className="bg-[#0f1116] rounded-lg p-3 flex justify-between items-center">
            <div className="flex items-center gap-1 text-sm">
              <span>Rate</span>
              <Info className="w-3 h-3 text-gray-400" />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm">1 {fromToken} = {fromToken === 'ETH' ? swapRate : fromToken === 'USDT' || fromToken === 'USDC' ? 0.9 : 1} ASTR</span>
              <button 
                className="p-1 rounded-full hover:bg-[#2d3748]"
                onClick={() => setSwapRate(prev => prev + Math.random() * 10 - 5)}
                disabled={loading || confirming}
              >
                <RefreshCw className="w-3 h-3 text-gray-400" />
              </button>
            </div>
          </div>
          
          <button
            onClick={handleSwap}
            disabled={loading || confirming || parseFloat(fromAmount) <= 0}
            className={`bg-[#4ade80] text-[#0f1116] px-4 py-3 rounded-md font-medium transition-all hover:bg-[#3ab369] w-full flex items-center justify-center ${
              loading || confirming ? 'opacity-80' : ''
            }`}
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Getting quotes...
              </>
            ) : confirming ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Confirming swap...
              </>
            ) : (
              `Swap to ${toAmount} ASTR`
            )}
          </button>
          
          <div className="flex justify-between items-center text-xs text-center text-gray-300 opacity-60">
            <span>Powered by Kyo Finance</span>
            <span>Slippage tolerance: 0.5%</span>
          </div>
        </div>
      )}
    </Modal>
  );
}
 
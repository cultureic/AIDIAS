import  { useState } from 'react';
import Modal from 'react-modal';
import { X, Upload, Lock, Heart, Zap, Share, Copy } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

Modal.setAppElement('#root');

interface CompileCapsuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  tags: string[];
  tone: string;
  imageUrl: string;
}

export default function CompileCapsuleModal({ 
  isOpen, 
  onClose, 
  title, 
  content, 
  tags, 
  tone, 
  imageUrl 
}: CompileCapsuleModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shareOption, setShareOption] = useState('public');
  const [selectedLicense, setSelectedLicense] = useState('CC BY');
  
  const licenses = [
    { id: 'cc-by', name: 'CC BY', description: 'Credit must be given to the creator' },
    { id: 'cc-by-sa', name: 'CC BY-SA', description: 'Credit must be given + same license applies' },
    { id: 'cc-by-nc', name: 'CC BY-NC', description: 'Credit must be given + non-commercial use only' },
    { id: 'cc0', name: 'CC0', description: 'No rights reserved (public domain)' }
  ];
  
  const handleSubmit = (option: string) => {
    setIsSubmitting(true);
    
    // Simulate publishing
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 1500);
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="w-[700px] max-w-[92vw] max-h-[85vh] bg-[#1a1f2c] rounded-xl mx-auto mt-[5vh] outline-none overflow-y-auto"
      overlayClassName="fixed inset-0 flex items-start justify-center bg-black/80 overflow-y-auto py-4"
    >
      <div className="flex flex-col">
        <div className="p-4 border-b border-[#2d3748] flex justify-between items-center">
          <h2 className="text-xl font-bold">Publish Capsule</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-[#2d3748]">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-[#0f1116] rounded-lg overflow-hidden shadow-md mb-6">
            <div className="relative">
              <img 
                src={imageUrl} 
                alt={title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0f1116]/90"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-xl font-bold mb-1">{title}</h3>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-1 rounded-full text-white bg-[#2d3748]">#{tag}</span>
                ))}
              </div>
              
              <div className="prose prose-invert max-w-none prose-headings:text-[#4ade80] prose-headings:font-bold prose-p:text-gray-300 prose-strong:text-white prose-blockquote:border-[#4ade80] prose-blockquote:bg-[#2d3748]/30 prose-blockquote:p-2 prose-blockquote:rounded-md max-h-[300px] overflow-y-auto pr-2">
                <ReactMarkdown>
                  {content}
                </ReactMarkdown>
              </div>
              
              <div className="flex justify-between items-center text-sm text-gray-300 opacity-70 mt-4">
                <div className="flex items-center">
                  <span className="font-medium">You</span> + <span className="text-[#4ade80] ml-1">AI</span>
                </div>
                
                <div className="flex gap-3">
                  <button className="flex items-center gap-1 text-gray-300 opacity-70 hover:text-[#4ade80] transition-colors">
                    <Heart className="w-4 h-4" />
                    <span>0</span>
                  </button>
                  <button className="flex items-center gap-1 text-gray-300 opacity-70 hover:text-[#4ade80] transition-colors">
                    <Zap className="w-4 h-4" />
                    <span>0</span>
                  </button>
                  <button className="flex items-center gap-1 text-gray-300 opacity-70 hover:text-[#4ade80] transition-colors">
                    <Share className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-semibold mb-3">Choose License</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {licenses.map(license => (
                  <button
                    key={license.id}
                    onClick={() => setSelectedLicense(license.name)}
                    className={`p-3 rounded-md text-left border ${
                      selectedLicense === license.name
                        ? 'bg-[#4ade80]/10 border-[#4ade80]' 
                        : 'border-[#2d3748] hover:bg-[#2d3748]/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Copy className="w-4 h-4" />
                      <span className="font-medium">{license.name}</span>
                    </div>
                    <p className="text-xs text-gray-300 opacity-70">{license.description}</p>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-300 opacity-60 mt-2">
                Learn more about <a href="https://creativecommons.org/licenses/" target="_blank" rel="noopener noreferrer" className="text-[#4ade80] hover:underline">Creative Commons licenses</a>
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Sharing Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  onClick={() => setShareOption('public')}
                  className={`p-3 rounded-md text-left border ${
                    shareOption === 'public' 
                      ? 'bg-[#4ade80]/10 border-[#4ade80]' 
                      : 'border-[#2d3748] hover:bg-[#2d3748]/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Upload className="w-4 h-4" />
                    <span className="font-medium">Public</span>
                  </div>
                  <p className="text-sm text-gray-300 opacity-70">Share with everyone on Aidias</p>
                </button>
                
                <button
                  onClick={() => setShareOption('private')}
                  className={`p-3 rounded-md text-left border ${
                    shareOption === 'private' 
                      ? 'bg-[#4ade80]/10 border-[#4ade80]' 
                      : 'border-[#2d3748] hover:bg-[#2d3748]/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Lock className="w-4 h-4" />
                    <span className="font-medium">Private</span>
                  </div>
                  <p className="text-sm text-gray-300 opacity-70">Only visible to you</p>
                </button>
              </div>
            </div>
            
            <div className="bg-[#0f1116] rounded-lg p-4 mt-4">
              <h4 className="text-sm font-medium mb-2">CAMP Network Integration</h4>
              <p className="text-xs text-gray-300 opacity-80 mb-3">
                This capsule will be registered on the CAMP Network with a unique hash identifier, making it verifiable and immutable.
              </p>
              <div className="flex items-center text-xs text-[#4ade80] bg-[#4ade80]/10 p-2 rounded">
                <span className="font-mono">Publishing will generate a unique CAMP Hash for this content</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-[#2d3748] flex justify-end gap-3">
          <button 
            className="px-4 py-2 rounded-md border border-[#2d3748] hover:bg-[#2d3748] transition-colors"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          
          <button 
            className={`bg-[#4ade80] text-[#0f1116] px-6 py-2 rounded-md font-medium transition-all hover:bg-[#3ab369] flex items-center gap-2 ${
              isSubmitting ? 'opacity-80' : ''
            }`}
            onClick={() => handleSubmit(shareOption)}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Publishing...' : 'Publish Capsule'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
 
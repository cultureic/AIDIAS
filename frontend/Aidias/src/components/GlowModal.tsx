import  { useState, useRef, useEffect } from 'react';
import Modal from 'react-modal';
import { X, Upload, Lock, Tag, Flame, Sparkles, Book, Rocket, Plus } from 'lucide-react';
import { ChatMessage } from '../types';
import CompileCapsuleModal from './CompileCapsuleModal';
import { transformContentWithTone, getToneStyle } from '../utils/toneTransformer';
import ReactMarkdown from 'react-markdown';

Modal.setAppElement('#root');

interface GlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversation: ChatMessage[];
}

export default function GlowModal({ isOpen, onClose, conversation }: GlowModalProps) {
  const [title, setTitle] = useState('How to Launch a DeFi Protocol Without VC Funding');
  const [rawContent, setRawContent] = useState(
    'Creating a sustainable DeFi protocol requires focusing on community governance and innovative token distribution. Start with a small but dedicated core team and leverage community resources.\n\n1. Start with a small core team of 2-3 developers working part-time\n2. Design a token model with community allocation of at least 60%\n3. Build a minimal viable protocol that solves a specific pain point\n4. Launch a fair distribution method like liquidity mining or a Balancer LBP\n5. Create a DAO structure from day one to ensure community governance'
  );
  const [transformedContent, setTransformedContent] = useState('');
  const [tags, setTags] = useState(['DeFi', 'Web3', 'Finance']);
  const [newTag, setNewTag] = useState('');
  const [selectedTone, setSelectedTone] = useState('idea');
  const [compileCapsuleOpen, setCompileCapsuleOpen] = useState(false);
  const [customImageUrl, setCustomImageUrl] = useState<string | null>(null);
  const [imageInputUrl, setImageInputUrl] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const tones = [
    { id: 'idea', name: 'Idea Launch', icon: <Flame className="w-4 h-4" /> },
    { id: 'reflection', name: 'Reflection', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'explainer', name: 'Explainer', icon: <Book className="w-4 h-4" /> },
    { id: 'alpha', name: 'Alpha Drop', icon: <Rocket className="w-4 h-4" /> }
  ];
  
  const headerImageOptions = {
    idea: 'https://images.unsplash.com/photo-1617396900799-f4ec2b43c7ae?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHRlY2glMjBibG9ja2NoYWluJTIwZGlnaXRhbCUyMGFydCUyMGNvbmNlcHR8ZW58MHx8fHwxNzQ2MzE2NjcxfDA&ixlib=rb-4.0.3&fit=fillmax&h=400&w=800',
    reflection: 'https://images.unsplash.com/photo-1533628635777-112b2239b1c7?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjB0ZWNoJTIwVUklMjBkYXJrJTIwdGhlbWUlMjBhYnN0cmFjdCUyMGJhY2tncm91bmR8ZW58MHx8fHwxNzQ2MzMzNzIyfDA&ixlib=rb-4.0.3&fit=fillmax&h=400&w=800',
    explainer: 'https://images.unsplash.com/photo-1533158326339-7f3cf2404354?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwzfHxhYnN0cmFjdCUyMHRlY2glMjBibG9ja2NoYWluJTIwZGlnaXRhbCUyMGFydCUyMGNvbmNlcHR8ZW58MHx8fHwxNzQ2MzE2NjcxfDA&ixlib=rb-4.0.3&fit=fillmax&h=400&w=800',
    alpha: 'https://images.unsplash.com/photo-1579541814924-49fef17c5be5?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw0fHxhYnN0cmFjdCUyMHRlY2glMjBibG9ja2NoYWluJTIwZGlnaXRhbCUyMGFydCUyMGNvbmNlcHR8ZW58MHx8fHwxNzQ2MzE2NjcxfDA&ixlib=rb-4.0.3&fit=fillmax&h=400&w=800'
  };

  // Initialize content from conversation when modal opens
  useEffect(() => {
    if (isOpen) {
      const aiMessages = conversation.filter(msg => msg.sender === 'ai');
      if (aiMessages.length > 0) {
        // Using the latest AI message
        const latestResponse = aiMessages[aiMessages.length - 1].content;
        if (latestResponse) {
          setRawContent(latestResponse);
        }
      }
    }
  }, [isOpen, conversation]);

  // Transform content when tone or raw content changes
  useEffect(() => {
    const newTransformedContent = transformContentWithTone(rawContent, title, selectedTone);
    setTransformedContent(newTransformedContent);
  }, [rawContent, title, selectedTone]);

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleCompile = () => {
    setCompileCapsuleOpen(true);
    onClose();
  };
  
  const handleCustomImageUrlChange = () => {
    if (imageInputUrl && imageInputUrl.startsWith('http')) {
      setCustomImageUrl(imageInputUrl);
    }
  };
  
  const getCurrentImageUrl = () => {
    if (customImageUrl) return customImageUrl;
    return headerImageOptions[selectedTone as keyof typeof headerImageOptions];
  };

  const handleRawContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRawContent(e.target.value);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        className="w-[900px] max-w-[92vw] max-h-[92vh] bg-[#1a1f2c] rounded-xl mx-auto mt-[5vh] outline-none overflow-y-auto"
        overlayClassName="fixed inset-0 flex items-start justify-center bg-black/80 overflow-y-auto py-4"
      >
        <div className="p-5">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#4ade80]" /> Glow It
            </h2>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-[#2d3748]">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* Left Panel - Settings */}
            <div className="md:col-span-2 space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#0f1116] border border-[#2d3748] rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-[#4ade80]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <div key={tag} className="flex items-center gap-1 text-xs px-2 py-1 rounded-full text-white bg-[#2d3748]">
                      #{tag}
                      <button onClick={() => removeTag(tag)} className="text-xs">×</button>
                    </div>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag"
                    className="flex-1 bg-[#0f1116] border border-[#2d3748] rounded-l-md p-2 focus:outline-none focus:ring-1 focus:ring-[#4ade80]"
                    onKeyDown={(e) => e.key === 'Enter' && addTag()}
                  />
                  <button
                    onClick={addTag}
                    className="bg-[#2d3748] px-3 rounded-r-md flex items-center"
                  >
                    <Tag className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Select Tone</label>
                <div className="grid grid-cols-2 gap-2">
                  {tones.map(tone => (
                    <button
                      key={tone.id}
                      onClick={() => setSelectedTone(tone.id)}
                      className={`flex items-center gap-2 p-2 rounded-md ${
                        selectedTone === tone.id 
                          ? 'bg-[#4ade80] text-[#0f1116] font-medium' 
                          : 'bg-[#2d3748] hover:bg-[#374151]'
                      }`}
                    >
                      {tone.icon}
                      <span>{tone.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Writing Style</label>
                <div className="bg-[#0f1116] border border-[#2d3748] rounded-md p-3 text-sm">
                  <span className="font-medium">Current tone:</span> {getToneStyle(selectedTone)}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Original Content</label>
                <textarea
                  value={rawContent}
                  onChange={handleRawContentChange}
                  className="w-full bg-[#0f1116] border border-[#2d3748] rounded-md p-2 h-40 focus:outline-none focus:ring-1 focus:ring-[#4ade80] text-sm font-mono"
                  placeholder="Enter your content here..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Custom Image (optional)</label>
                <div className="mb-2">
                  <div className="flex">
                    <input 
                      type="text" 
                      value={imageInputUrl}
                      onChange={(e) => setImageInputUrl(e.target.value)}
                      placeholder="Enter image URL" 
                      className="flex-1 bg-[#0f1116] border border-[#2d3748] rounded-l-md p-2 focus:outline-none focus:ring-1 focus:ring-[#4ade80]"
                    />
                    <button
                      onClick={handleCustomImageUrlChange}
                      className="bg-[#2d3748] px-3 rounded-r-md flex items-center"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Current image will update based on selected tone if no custom image is provided
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={handleCompile}
                  className="bg-[#4ade80] text-[#0f1116] hover:bg-[#3ab369] px-4 py-2 rounded-md font-medium transition-all flex-1 flex items-center justify-center gap-1"
                >
                  Compile Capsule
                </button>
              </div>
            </div>
            
            {/* Right Panel - Preview */}
            <div className="md:col-span-3 bg-[#0f1116] rounded-lg overflow-hidden border border-[#2d3748]">
              <div className="relative">
                <div className="absolute top-2 right-2 z-10 flex gap-2">
                  <div className="text-xs bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md font-medium text-[#4ade80]">
                    {selectedTone.charAt(0).toUpperCase() + selectedTone.slice(1)} Tone
                  </div>
                </div>
                <img 
                  src={getCurrentImageUrl()} 
                  alt="Capsule header"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0f1116]/20 to-[#0f1116]"></div>
              </div>
              
              <div className="p-4">
                <h2 className="text-xl font-bold mb-3">{title}</h2>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-1 rounded-full text-white bg-[#2d3748]">#{tag}</span>
                  ))}
                </div>
                
                <div className="prose prose-invert max-w-none prose-headings:text-[#4ade80] prose-headings:font-bold prose-p:text-gray-300 prose-strong:text-white prose-blockquote:border-[#4ade80] prose-blockquote:bg-[#2d3748]/30 prose-blockquote:p-2 prose-blockquote:rounded-md overflow-y-auto max-h-[350px] pr-2">
                  <ReactMarkdown>
                    {transformedContent}
                  </ReactMarkdown>
                </div>
                
                <div className="mt-4 flex items-center text-sm text-gray-400">
                  <span className="font-medium mr-1">You</span> + <span className="text-[#4ade80] ml-1">AI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      
      <CompileCapsuleModal 
        isOpen={compileCapsuleOpen} 
        onClose={() => setCompileCapsuleOpen(false)}
        title={title}
        content={transformedContent}
        tags={tags}
        tone={selectedTone}
        imageUrl={getCurrentImageUrl()}
      />
    </>
  );
}
 
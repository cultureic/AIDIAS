export  interface Capsule {
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

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
}
 
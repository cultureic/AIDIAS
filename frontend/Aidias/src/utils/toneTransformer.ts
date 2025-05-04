export  interface ToneTransformation {
  style: string;
  formatContent: (content: string, title: string) => string;
}

const toneTransformations: Record<string, ToneTransformation> = {
  idea: {
    style: "direct, innovative, forward-thinking",
    formatContent: (content: string, title: string) => {
      // Extract key points if possible
      const points = content.split(/\n+/).filter(line => 
        line.trim().length > 0 && !line.trim().match(/^[0-9]+\./)
      );
      
      // Extract numbered points if they exist
      const numberedPoints = content.match(/[0-9]+\.\s+[^\n]+/g) || [];
      
      let transformed = `# ${title}\n\n`;
      
      // Add an intro if there are points
      if (points.length > 0) {
        transformed += `**Here's a groundbreaking approach that changes the game:**\n\n`;
      }
      
      // Add numbered points with emoji
      if (numberedPoints.length > 0) {
        transformed += "## Key Innovation Points:\n\n";
        numberedPoints.forEach(point => {
          const cleanPoint = point.replace(/^[0-9]+\.\s+/, '');
          transformed += `🚀 **${cleanPoint}**\n\n`;
        });
      } else {
        // If no numbered points, format into paragraphs with emphasis
        points.forEach(point => {
          transformed += `${point}\n\n`;
        });
      }
      
      transformed += `\n**Why this works:** This approach has been validated in the real world and represents a significant departure from conventional wisdom.`;
      
      return transformed;
    }
  },
  reflection: {
    style: "thoughtful, introspective, personal",
    formatContent: (content: string, title: string) => {
      const paragraphs = content.split(/\n+/).filter(line => line.trim().length > 0);
      
      let transformed = `# ${title}\n\n`;
      transformed += `*A personal journey and reflection*\n\n`;
      
      if (paragraphs.length > 0) {
        transformed += `I've been thinking deeply about this, and here's what I've learned...\n\n`;
      }
      
      // Convert bullet points into reflective questions and insights
      paragraphs.forEach((para, index) => {
        // Remove numbering if it exists
        const cleanPara = para.replace(/^[0-9]+\.\s+/, '');
        
        if (index === 0) {
          transformed += `> "${cleanPara}"\n\n`;
        } else if (cleanPara.length < 60) {
          transformed += `**What if:** ${cleanPara}?\n\n`;
        } else {
          transformed += `${cleanPara}\n\n`;
        }
      });
      
      transformed += `*These thoughts are still evolving as I continue to explore this space...*`;
      
      return transformed;
    }
  },
  explainer: {
    style: "educational, clear, authoritative",
    formatContent: (content: string, title: string) => {
      const paragraphs = content.split(/\n+/).filter(line => line.trim().length > 0);
      
      let transformed = `# ${title}: An Explainer\n\n`;
      transformed += `**Understanding the fundamentals**\n\n`;
      
      if (paragraphs.length > 0) {
        transformed += `Let me break this down in clear, simple terms:\n\n`;
      }
      
      // Numbered items become a clear list with headers
      const numberedPoints = content.match(/[0-9]+\.\s+[^\n]+/g) || [];
      if (numberedPoints.length > 0) {
        transformed += "## Core Concepts\n\n";
        numberedPoints.forEach((point, index) => {
          const cleanPoint = point.replace(/^[0-9]+\.\s+/, '');
          transformed += `### ${index + 1}. ${cleanPoint}\n\n`;
          transformed += `This is essential because it provides the foundation for understanding how this system operates in real-world scenarios.\n\n`;
        });
      } else {
        // Format paragraphs with explanatory tone
        paragraphs.forEach(para => {
          transformed += `${para}\n\n`;
        });
      }
      
      transformed += `**Key takeaway:** The critical insight here is that understanding these principles enables you to navigate this space effectively.`;
      
      return transformed;
    }
  },
  alpha: {
    style: "insider, exclusive, urgent",
    formatContent: (content: string, title: string) => {
      const paragraphs = content.split(/\n+/).filter(line => line.trim().length > 0);
      
      let transformed = `# 🔓 ALPHA: ${title}\n\n`;
      transformed += `**CONFIDENTIAL INFO - ACT QUICKLY**\n\n`;
      
      if (paragraphs.length > 0) {
        transformed += `I'm sharing this alpha before it becomes common knowledge. Here's what you need to know:\n\n`;
      }
      
      // Convert each point to look like insider information
      const numberedPoints = content.match(/[0-9]+\.\s+[^\n]+/g) || [];
      if (numberedPoints.length > 0) {
        transformed += "## INSIDER STRATEGY:\n\n";
        numberedPoints.forEach(point => {
          const cleanPoint = point.replace(/^[0-9]+\.\s+/, '');
          transformed += `🔥 **EDGE:** ${cleanPoint}\n\n`;
        });
      } else {
        // Format paragraphs with emphasis on exclusivity
        paragraphs.forEach(para => {
          transformed += `**INSIGHT:** ${para}\n\n`;
        });
      }
      
      transformed += `⚡ **ADVANTAGE:** Those who act on this information first will have a significant edge over the market. This window won't last.`;
      
      return transformed;
    }
  }
};

export const transformContentWithTone = (
  content: string,
  title: string,
  tone: string
): string => {
  const transformer = toneTransformations[tone];
  if (!transformer) {
    return content; // Return original if tone not found
  }
  
  return transformer.formatContent(content, title);
};

export const getToneStyle = (tone: string): string => {
  return toneTransformations[tone]?.style || "neutral, balanced";
};
 
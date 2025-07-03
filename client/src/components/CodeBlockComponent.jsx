import React, { useState } from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { Copy } from 'lucide-react'; // <-- FIX: Imported 'Copy' from lucide-react

const CodeBlockComponent = ({ node }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // This uses the navigator's clipboard API to copy the text content of the code block
    navigator.clipboard.writeText(node.textContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset the "Copied!" message after 2 seconds
  };

  return (
    <NodeViewWrapper className="code-block-container" style={{ position: 'relative' }}>
      <pre>
        <NodeViewContent as="code" />
      </pre>
      <button 
        type='button'
        onClick={handleCopy} 
        className="code-block-copy-button" 
        style={{ 
          position: 'absolute', 
          top: '0.5rem', 
          right: '0.5rem', 
          background: '#e9ecef', 
          border: 'none', 
          padding: '0.25rem 0.5rem', 
          cursor: 'pointer', 
          borderRadius: '4px' 
        }}
        aria-label="Copy code"
      >
        {copied ? 'Copied!' : <Copy size={16} />} {/* <-- FIX: Replaced FaCopy with the Copy icon from lucide-react */}
      </button>
    </NodeViewWrapper>
  );
};

export default CodeBlockComponent;
import React, { useState } from 'react';
import { Copy } from 'lucide-react';

const StaticCodeBlock = ({ codeString }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ position: 'relative' }}>
      <pre>
        <code>{codeString}</code>
      </pre>
      <button 
        onClick={handleCopy} 
        style={{ 
          position: 'absolute', top: '0.5rem', right: '0.5rem', 
          background: '#e9ecef', border: 'none', padding: '0.25rem 0.5rem', 
          cursor: 'pointer', borderRadius: '4px', opacity: 0.7 
        }}
        aria-label="Copy code"
        title="Copy code"
      >
        {copied ? 'Copied!' : <Copy size={16} />}
      </button>
    </div>
  );
};

export default StaticCodeBlock;
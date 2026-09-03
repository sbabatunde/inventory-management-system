// src/modules/documentation/components/shared/CodeBlock.tsx

import React, { useState } from "react";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = "text",
  title,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (): Promise<void> => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-red-500 rounded-full" />
          <span className="w-3 h-3 bg-amber-500 rounded-full" />
          <span className="w-3 h-3 bg-emerald-500 rounded-full" />
          <span className="ml-2 text-xs text-slate-400">
            {title || language}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="text-slate-400 hover:text-white transition-colors"
          title="Copy code"
        >
          <i
            className={`fas ${copied ? "fa-check text-emerald-500" : "fa-copy"}`}
          />
        </button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className="text-sm text-slate-300 font-mono">{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;

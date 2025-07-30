'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface AgentSummaryCardProps {
  summary: string;
  tradeOffs?: string[];
  className?: string;
}

export const AgentSummaryCard = ({ summary, tradeOffs = [], className = '' }: AgentSummaryCardProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopySummary = async () => {
    try {
      const summaryText = tradeOffs.length > 0 
        ? `${summary}\n\nKey Trade-offs:\n${tradeOffs.map(t => `• ${t}`).join('\n')}`
        : summary;
      
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy summary:', error);
    }
  };

  return (
    <motion.div
      className={`bg-muted p-4 rounded-xl border shadow-sm ${className}`}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Summary Heading */}
      <motion.h3 
        className="text-lg font-semibold mb-2 text-foreground"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        Consensus Summary
      </motion.h3>

      {/* Summary Content */}
      <motion.div 
        className="text-sm text-muted-foreground leading-relaxed mb-4"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {summary}
      </motion.div>

      {/* Trade-offs List */}
      {tradeOffs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <h4 className="text-sm font-medium text-foreground mb-2">Key Trade-offs:</h4>
          <ul className="list-disc ml-6 text-sm text-muted-foreground space-y-1">
            {tradeOffs.map((tradeOff, index) => (
              <motion.li 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                className="leading-relaxed"
              >
                {tradeOff}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Copy Summary Button */}
      <motion.div 
        className="mt-4 flex justify-end"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <button
          onClick={handleCopySummary}
          className="text-xs bg-accent px-2 py-1 rounded hover:bg-accent-foreground text-accent-foreground transition-all duration-200 flex items-center gap-1"
        >
          {copied ? (
            <>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Summary
            </>
          )}
        </button>
      </motion.div>
    </motion.div>
  );
}; 
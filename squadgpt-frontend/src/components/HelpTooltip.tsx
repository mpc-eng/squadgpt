'use client';

import { useState } from 'react';

interface HelpTooltipProps {
  content: string | React.ReactNode;
  title?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  children?: React.ReactNode;
}

export const HelpTooltip = ({ 
  content, 
  title, 
  position = 'top', 
  className = '',
  children 
}: HelpTooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children || (
        <button
          type="button"
          className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-gray-500 bg-gray-100 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          ?
        </button>
      )}
      
      {isVisible && (
        <div className={`absolute z-50 ${positionClasses[position]}`}>
          <div className="bg-gray-900 text-white text-sm rounded-lg p-3 max-w-xs shadow-lg">
            {title && (
              <div className="font-semibold mb-1">{title}</div>
            )}
            <div className="text-gray-100">
              {content}
            </div>
            {/* Arrow */}
            <div className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
              position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1' :
              position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1' :
              position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1' :
              'right-full top-1/2 -translate-y-1/2 -mr-1'
            }`} />
          </div>
        </div>
      )}
    </div>
  );
};

// Predefined help content for common use cases
export const HELP_CONTENT = {
  PRD_EDITOR: {
    title: 'PRD Editor',
    content: 'Use this tabbed editor to organize your product requirements. Each tab focuses on a specific aspect of your PRD.'
  },
  AI_CHAT: {
    title: 'AI Chat',
    content: 'Chat with our AI squad for guidance, analysis, and recommendations. The AI is context-aware and will help you based on your current stage.'
  },
  AGENT_DEBATE: {
    title: 'Agent Debate',
    content: 'See how different AI agents analyze your project from various perspectives. Each agent has a specific role and expertise.'
  },
  STAGE_NAVIGATION: {
    title: 'Stage Navigation',
    content: 'Navigate through the 6 stages of product development. Each stage builds upon the previous one and has specific goals.'
  },
  SUCCESS_METRICS: {
    title: 'Success Metrics',
    content: 'Define measurable criteria that will determine if your product is successful. These should be specific, measurable, and achievable.'
  },
  TRADE_OFFS: {
    title: 'Trade-offs',
    content: 'Document the decisions and compromises you need to make. This helps clarify your priorities and constraints.'
  },
  PROBLEM_STATEMENT: {
    title: 'Problem Statement',
    content: 'Clearly define the problem you\'re solving. A good problem statement is specific, measurable, and addresses a real user need.'
  },
  LEARNINGS: {
    title: 'Learnings',
    content: 'Capture insights from research, user feedback, and analysis. This helps inform your decisions and can be referenced later.'
  }
}; 
'use client';

import { useState } from 'react';
import { usePRD } from '../contexts/PRDContext';

interface WorkspaceGuidanceProps {
  className?: string;
}

const STAGE_GUIDANCE = {
  Aperture: {
    title: 'Initial Exploration',
    description: 'Start exploring your product idea and gather initial insights',
    actions: [
      'Review your hypothesis and initial insights',
      'Chat with AI to explore different angles of your idea',
      'Use the PRD Editor to refine your problem statement',
      'Ask AI to suggest research areas to investigate'
    ],
    aiTips: [
      'Ask: "What are the key assumptions in my hypothesis?"',
      'Ask: "What research should I conduct next?"',
      'Ask: "Who are my potential competitors?"',
      'Ask: "What are the biggest risks to my idea?"'
    ]
  },
  Discovery: {
    title: 'Deep Research',
    description: 'Conduct comprehensive research to validate your hypothesis',
    actions: [
      'Add your research findings to the Learnings section',
      'Use AI to analyze your research and identify patterns',
      'Refine your problem statement based on findings',
      'Identify key user personas and pain points'
    ],
    aiTips: [
      'Ask: "What patterns do you see in my research?"',
      'Ask: "What additional research would strengthen my case?"',
      'Ask: "How should I prioritize my findings?"',
      'Ask: "What are the most important user insights?"'
    ]
  },
  Define: {
    title: 'Problem Definition',
    description: 'Clearly define the problem, success metrics, and trade-offs',
    actions: [
      'Refine your problem statement with AI assistance',
      'Define clear success metrics and KPIs',
      'Identify and document key trade-offs',
      'Use the PRD Editor to organize your findings'
    ],
    aiTips: [
      'Ask: "How can I make my problem statement more specific?"',
      'Ask: "What metrics would best measure success?"',
      'Ask: "What are the key trade-offs I need to consider?"',
      'Ask: "How should I prioritize different success criteria?"'
    ]
  },
  Design: {
    title: 'Solution Design',
    description: 'Design the solution architecture and user experience',
    actions: [
      'Design your solution architecture',
      'Create user experience flows',
      'Define technical requirements',
      'Plan the implementation approach'
    ],
    aiTips: [
      'Ask: "What technical architecture would work best?"',
      'Ask: "How should I design the user experience?"',
      'Ask: "What are the key technical requirements?"',
      'Ask: "What are potential implementation challenges?"'
    ]
  },
  Deliver: {
    title: 'Implementation',
    description: 'Plan the development roadmap and execution strategy',
    actions: [
      'Create a development roadmap',
      'Define sprint planning and milestones',
      'Identify risks and mitigation strategies',
      'Plan for testing and quality assurance'
    ],
    aiTips: [
      'Ask: "How should I structure my development roadmap?"',
      'Ask: "What are the key milestones I should target?"',
      'Ask: "What risks should I plan for?"',
      'Ask: "How should I approach testing and QA?"'
    ]
  },
  Live: {
    title: 'Launch & Learn',
    description: 'Launch the product and analyze results',
    actions: [
      'Track post-launch metrics and results',
      'Compare actuals to original success metrics',
      'Analyze user feedback and behavior',
      'Plan next steps and iterations'
    ],
    aiTips: [
      'Ask: "What do my launch results tell me?"',
      'Ask: "How do my actuals compare to predictions?"',
      'Ask: "What should I focus on next?"',
      'Ask: "Should I pivot or iterate?"'
    ]
  }
};

export const WorkspaceGuidance = ({ className = '' }: WorkspaceGuidanceProps) => {
  const { stage } = usePRD();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAITips, setShowAITips] = useState(false);

  const currentGuidance = STAGE_GUIDANCE[stage];

  return (
    <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            🎯 {currentGuidance.title}
          </h3>
          <p className="text-sm text-gray-600">
            {currentGuidance.description}
          </p>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </button>
      </div>

      {/* Quick Actions */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">🚀 Quick Actions</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {currentGuidance.actions.slice(0, 4).map((action, index) => (
            <div key={index} className="flex items-start gap-2 text-sm text-gray-600">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>{action}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="space-y-4 pt-4 border-t border-blue-200">
          {/* AI Tips Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-gray-700">🤖 AI Conversation Starters</h4>
              <button
                onClick={() => setShowAITips(!showAITips)}
                className="text-blue-600 hover:text-blue-700 text-xs"
              >
                {showAITips ? 'Hide' : 'Show'} Tips
              </button>
            </div>
            
            {showAITips && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {currentGuidance.aiTips.map((tip, index) => (
                  <div key={index} className="bg-white border border-blue-200 rounded p-3">
                    <p className="text-sm text-gray-700 italic">"{tip}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Workspace Features */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">🛠️ Workspace Features</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="bg-white border border-blue-200 rounded p-3">
                <h5 className="font-medium text-gray-900 mb-1">📝 PRD Editor</h5>
                <p className="text-gray-600 text-xs">
                  Use the tabbed editor to organize your problem statement, metrics, trade-offs, and learnings
                </p>
              </div>
              <div className="bg-white border border-blue-200 rounded p-3">
                <h5 className="font-medium text-gray-900 mb-1">💬 AI Chat</h5>
                <p className="text-gray-600 text-xs">
                  Chat with our AI squad for guidance, analysis, and recommendations
                </p>
              </div>
              <div className="bg-white border border-blue-200 rounded p-3">
                <h5 className="font-medium text-gray-900 mb-1">👥 Agent Debate</h5>
                <p className="text-gray-600 text-xs">
                  See how different AI agents analyze your project from various perspectives
                </p>
              </div>
            </div>
          </div>

          {/* Stage Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">🧭 Stage Navigation</h4>
            <p className="text-sm text-gray-600 mb-2">
              Use the left sidebar to navigate between stages. Each stage builds upon the previous one:
            </p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(STAGE_GUIDANCE).map(([stageKey, guidance]) => (
                <div
                  key={stageKey}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    stageKey === stage
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {stageKey}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Progress Indicator */}
      <div className="mt-4 pt-4 border-t border-blue-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Stage Progress</span>
          <span className="text-blue-600 font-medium">
            {Object.keys(STAGE_GUIDANCE).indexOf(stage) + 1} of {Object.keys(STAGE_GUIDANCE).length}
          </span>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((Object.keys(STAGE_GUIDANCE).indexOf(stage) + 1) / Object.keys(STAGE_GUIDANCE).length) * 100}%`
            }}
          />
        </div>
      </div>
    </div>
  );
}; 
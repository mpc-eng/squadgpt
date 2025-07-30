'use client';

import { useParams } from 'next/navigation';
import { StageSidebar } from '../../../components/StageSidebar';
import { SquadJourneyMap } from '../../../components/SquadJourneyMap';
import { PRDEditorPanel } from '../../../components/PRDEditorPanel';
import { LiveStagePanel } from '../../../components/LiveStagePanel';
import { ChatInterface } from '../../../components/ChatInterface';
import { AgentDebatePanel } from '../../../components/AgentDebatePanel';
import { StageRecommendationBanner } from '../../../components/StageRecommendationBanner';
import { ProjectHeader } from '../../../components/ProjectHeader';
import { OnboardingTour, useOnboarding } from '../../../components/OnboardingTour';
import { WorkspaceGuidance } from '../../../components/WorkspaceGuidance';
import { usePRD } from '../../../contexts/PRDContext';
import { useState } from 'react';

interface AgentResult {
  userStories: string;
  prd: string;
  architecture: string;
  devTasks: string;
}

interface AgentStatus {
  businessAnalyst: 'idle' | 'processing' | 'completed' | 'error';
  productManager: 'idle' | 'processing' | 'completed' | 'error';
  solutionArchitect: 'idle' | 'processing' | 'completed' | 'error';
  scrumMaster: 'idle' | 'processing' | 'completed' | 'error';
}

export default function WorkspacePage() {
  const params = useParams();
  const workspaceId = params.id as string;
  const { stage, title, setTitle, sections } = usePRD();
  const { isOnboardingActive, hasCompletedOnboarding, completeOnboarding, skipOnboarding } = useOnboarding();
  const [formData, setFormData] = useState({
    idea: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [result, setResult] = useState<AgentResult | null>(null);
  const [agentStatus, setAgentStatus] = useState<AgentStatus>({
    businessAnalyst: 'idle',
    productManager: 'idle',
    solutionArchitect: 'idle',
    scrumMaster: 'idle'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const simulateAgentProgress = () => {
    const agents = ['businessAnalyst', 'productManager', 'solutionArchitect', 'scrumMaster'] as const;
    
    agents.forEach((agent, index) => {
      setTimeout(() => {
        setAgentStatus(prev => ({ ...prev, [agent]: 'processing' }));
      }, index * 1000);
      
      setTimeout(() => {
        setAgentStatus(prev => ({ ...prev, [agent]: 'completed' }));
      }, (index + 1) * 2000);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    setResult(null);
    
    // Reset agent status
    setAgentStatus({
      businessAnalyst: 'idle',
      productManager: 'idle',
      solutionArchitect: 'idle',
      scrumMaster: 'idle'
    });

    // Start progress simulation
    simulateAgentProgress();

    try {
      // Format PRD context for backend
      const prdContext = [
        title && `Project Title: ${title}`,
        sections.problemStatement && `Problem Statement: ${sections.problemStatement}`,
        sections.successMetrics.length > 0 && `Success Metrics: ${sections.successMetrics.join(', ')}`,
        sections.tradeOffs.length > 0 && `Trade-offs: ${sections.tradeOffs.join(', ')}`,
        sections.learnings && `Learnings: ${sections.learnings}`
      ].filter(Boolean).join('\n');

      const response = await fetch('http://localhost:3001/api/idea/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          stage,
          prdContext
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({ type: 'success', text: 'Project idea processed successfully!' });
        setResult(data);
        setFormData({ idea: '' });
        
        // Mark all agents as completed
        setAgentStatus({
          businessAnalyst: 'completed',
          productManager: 'completed',
          solutionArchitect: 'completed',
          scrumMaster: 'completed'
        });
      } else {
        setMessage({ 
          type: 'error', 
          text: data.error || 'Failed to process project idea. Please try again.' 
        });
        
        // Mark all agents as error
        setAgentStatus({
          businessAnalyst: 'error',
          productManager: 'error',
          solutionArchitect: 'error',
          scrumMaster: 'error'
        });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Network error. Please check your connection and try again.' 
      });
      
      // Mark all agents as error
      setAgentStatus({
        businessAnalyst: 'error',
        productManager: 'error',
        solutionArchitect: 'error',
        scrumMaster: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-blue-600">Processing...</span>
          </div>
        );
      case 'completed':
        return (
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="ml-2 text-green-600">Completed</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="ml-2 text-red-600">Error</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
            <span className="ml-2 text-gray-500">Waiting</span>
          </div>
        );
    }
  };

  const AgentCard = ({ title, content, status, icon }: { title: string; content: string; status: string; icon: string }) => (
    <div className="bg-white rounded-lg shadow-xl p-8 border-l-4 border-blue-500">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
            <span className="text-blue-600 text-lg">{icon}</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        </div>
        {getStatusIcon(status)}
      </div>
      <div className="prose max-w-none">
        <div className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded-md overflow-auto max-h-96 border">
          {content}
        </div>
      </div>
    </div>
  );

  const formatAgentResponses = () => {
    if (!result) return [];
    
    return [
      {
        name: 'Business Analyst',
        role: 'User Story Specialist',
        response: result.userStories,
        icon: '👥'
      },
      {
        name: 'Product Manager',
        role: 'PRD Developer',
        response: result.prd,
        icon: '📋'
      },
      {
        name: 'Solution Architect',
        role: 'Technical Designer',
        response: result.architecture,
        icon: '🏗️'
      },
      {
        name: 'Scrum Master',
        role: 'Development Planner',
        response: result.devTasks,
        icon: '📅'
      }
    ];
  };

  // Format agent responses for the recommendation banner
  const formatAgentResponsesForBanner = () => {
    if (!result) return [];
    
    return [
      { agent: 'Business Analyst', response: result.userStories },
      { agent: 'Product Manager', response: result.prd },
      { agent: 'Solution Architect', response: result.architecture },
      { agent: 'Scrum Master', response: result.devTasks }
    ];
  };

  const agentResponses = formatAgentResponsesForBanner();

  return (
    <div className="flex h-screen bg-background">
      {/* Onboarding Tour */}
      <OnboardingTour 
        isActive={isOnboardingActive} 
        onComplete={completeOnboarding} 
        onSkip={skipOnboarding} 
      />
      
      {/* Stage Recommendation Banner */}
      <StageRecommendationBanner agentResponses={agentResponses} />
      
      {/* Sidebar */}
      <StageSidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Project Header */}
        <ProjectHeader />
        
        {/* Squad Journey Map */}
        <SquadJourneyMap />
        
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">

            {/* Workspace Guidance - Show when no results yet */}
            {!result && (
              <div className="mb-8">
                <WorkspaceGuidance />
              </div>
            )}

            {/* PRD Editor Panel - Show when in Define stage or when results are available */}
            {(stage === 'Define' || result) && (
              <div className="mb-8">
                <PRDEditorPanel className="w-full" />
              </div>
            )}

            {/* Live Stage Panel - Show when in Live stage */}
            {stage === 'Live' && (
              <div className="mb-8">
                <LiveStagePanel />
              </div>
            )}

            {/* Chat Interface - Show in all stages */}
            <div className="mb-8">
              <ChatInterface />
            </div>

            {/* Agent Debate Panel - Show when results are available */}
            {result && (
              <div className="mb-8">
                <AgentDebatePanel agentResponses={formatAgentResponses()} />
              </div>
            )}

            {/* Results Display */}
            {result && (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Development Plan Generated!</h2>
                  <p className="text-gray-600">Your AI squad has created a comprehensive development plan</p>
                </div>

                {/* User Stories */}
                <AgentCard
                  title="User Stories"
                  content={result.userStories}
                  status={agentStatus.businessAnalyst}
                  icon="👥"
                />

                {/* PRD */}
                <AgentCard
                  title="Product Requirements Document"
                  content={result.prd}
                  status={agentStatus.productManager}
                  icon="📋"
                />

                {/* Technical Architecture */}
                <AgentCard
                  title="Technical Architecture"
                  content={result.architecture}
                  status={agentStatus.solutionArchitect}
                  icon="🏗️"
                />

                {/* Development Tasks */}
                <AgentCard
                  title="Development Tasks"
                  content={result.devTasks}
                  status={agentStatus.scrumMaster}
                  icon="📅"
                />
              </div>
            )}

            {/* Footer */}
            <div className="text-center mt-12 text-sm text-gray-500">
              <p>Powered by LangChain and OpenAI - Your AI-powered development planning assistant</p>
              <p className="mt-2">Business Analyst • Product Manager • Solution Architect • Scrum Master</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 
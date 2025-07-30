'use client';

import { useState } from 'react';
import { AgentSummaryCard } from './AgentSummaryCard';

interface AgentResponse {
  name: string;
  role: string;
  response: string;
  confidence?: number;
  icon: string;
}

interface AgentDebatePanelProps {
  agentResponses: AgentResponse[];
  className?: string;
}

export const AgentDebatePanel = ({ agentResponses, className = '' }: AgentDebatePanelProps) => {
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<string>('');
  const [tradeOffs, setTradeOffs] = useState<string[]>([]);

  const handleSummarizeOpinions = async () => {
    if (agentResponses.length === 0) {
      alert('No agent responses to summarize.');
      return;
    }

    setIsSummarizing(true);
    setSummary('');
    setTradeOffs([]);

    try {
      const response = await fetch('http://localhost:3001/api/agents/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentResponses: agentResponses.map(agent => ({
            name: agent.name,
            role: agent.role,
            response: agent.response,
            confidence: agent.confidence
          }))
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSummary(data.summary);
        // Extract trade-offs if available in the response
        if (data.tradeOffs && Array.isArray(data.tradeOffs)) {
          setTradeOffs(data.tradeOffs);
        }
      } else {
        alert('Failed to generate summary. Please try again.');
      }
    } catch (error) {
      console.error('Error summarizing agent opinions:', error);
      alert('Error generating summary. Please check your connection and try again.');
    } finally {
      setIsSummarizing(false);
    }
  };

  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) return 'bg-gray-200 text-gray-600';
    if (confidence >= 80) return 'bg-green-100 text-green-800';
    if (confidence >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getConfidenceText = (confidence?: number) => {
    if (!confidence) return 'Not specified';
    if (confidence >= 80) return 'High';
    if (confidence >= 60) return 'Medium';
    return 'Low';
  };

  if (agentResponses.length === 0) {
    return (
      <div className={`bg-card rounded-2xl shadow-md border p-8 ${className}`}>
        <h2 className="text-2xl font-semibold text-foreground mb-4">Agent Debate Panel</h2>
        <p className="text-muted-foreground">No agent responses available yet. Generate a development plan to see the debate.</p>
      </div>
    );
  }

  return (
    <div className={`bg-card rounded-2xl shadow-md border p-8 ${className}`}>
      <h2 className="text-2xl font-semibold text-foreground mb-6">Agent Debate Panel</h2>
      
      {/* Agent Response Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {agentResponses.map((agent, index) => (
          <div key={index} className="bg-muted rounded-xl p-6 border">
            {/* Agent Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-primary text-lg">{agent.icon}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{agent.name}</h3>
                  <p className="text-sm text-muted-foreground">{agent.role}</p>
                </div>
              </div>
              {agent.confidence && (
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${getConfidenceColor(agent.confidence)}`}>
                  {getConfidenceText(agent.confidence)} Confidence
                </div>
              )}
            </div>

            {/* Agent Response */}
            <div className="bg-background rounded-md p-4 border">
              <div className="max-h-64 overflow-y-auto">
                <div className="whitespace-pre-wrap text-sm text-foreground leading-relaxed">
                  {agent.response}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summarize Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={handleSummarizeOpinions}
          disabled={isSummarizing || agentResponses.length === 0}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isSummarizing ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
              Analyzing Agent Opinions...
            </div>
          ) : (
            'Summarize Agent Opinions'
          )}
        </button>
      </div>

      {/* Summary Result */}
      {summary && (
        <AgentSummaryCard 
          summary={summary} 
          tradeOffs={tradeOffs}
          className="mt-6"
        />
      )}
    </div>
  );
}; 
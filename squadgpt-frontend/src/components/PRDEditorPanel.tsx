'use client';

import { useState } from 'react';
import { usePRD } from '../contexts/PRDContext';
import { VersionHistoryDropdown } from './VersionHistoryDropdown';
import { HelpTooltip, HELP_CONTENT } from './HelpTooltip';

interface PRDEditorPanelProps {
  className?: string;
}

type EditorTab = 'overview' | 'problem' | 'metrics' | 'tradeoffs' | 'learnings' | 'live';

export const PRDEditorPanel = ({ className = '' }: PRDEditorPanelProps) => {
  const { stage, sections, updateSection } = usePRD();
  const [activeTab, setActiveTab] = useState<EditorTab>('overview');
  const [isSummarizing, setIsSummarizing] = useState<{
    problemStatement: boolean;
    successMetrics: boolean;
    tradeOffs: boolean;
    learnings: boolean;
    userFeedback: boolean;
    hypothesisValidation: boolean;
    nextSteps: boolean;
  }>({
    problemStatement: false,
    successMetrics: false,
    tradeOffs: false,
    learnings: false,
    userFeedback: false,
    hypothesisValidation: false,
    nextSteps: false
  });

  const handleSummarize = async (section: keyof typeof sections, content: string | string[]) => {
    setIsSummarizing(prev => ({ ...prev, [section]: true }));

    try {
      const response = await fetch('http://localhost:3001/api/prd/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          section,
          content: Array.isArray(content) ? content.join('\n') : content,
          stage
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        updateSection(section, data.summary);
      } else {
        alert('Failed to summarize section. Please try again.');
      }
    } catch (error) {
      console.error('Error summarizing section:', error);
      alert('Error summarizing section. Please check your connection and try again.');
    } finally {
      setIsSummarizing(prev => ({ ...prev, [section]: false }));
    }
  };

  const addArrayItem = (section: 'successMetrics' | 'tradeOffs' | 'postLaunchMetrics') => {
    const currentItems = sections[section];
    updateSection(section, [...currentItems, '']);
  };

  const updateArrayItem = (section: 'successMetrics' | 'tradeOffs' | 'postLaunchMetrics', index: number, value: string) => {
    const currentItems = [...sections[section]];
    currentItems[index] = value;
    updateSection(section, currentItems);
  };

  const removeArrayItem = (section: 'successMetrics' | 'tradeOffs' | 'postLaunchMetrics', index: number) => {
    const currentItems = sections[section].filter((_, i) => i !== index);
    updateSection(section, currentItems);
  };

  const tabs: { id: EditorTab; label: string; icon: string; description: string }[] = [
    { id: 'overview', label: 'Overview', icon: '📋', description: 'Quick summary of all sections' },
    { id: 'problem', label: 'Problem', icon: '🎯', description: 'Problem statement and context' },
    { id: 'metrics', label: 'Metrics', icon: '📊', description: 'Success metrics and KPIs' },
    { id: 'tradeoffs', label: 'Trade-offs', icon: '⚖️', description: 'Decisions and compromises' },
    { id: 'learnings', label: 'Learnings', icon: '🧠', description: 'Insights and research findings' },
    ...(stage === 'Live' ? [{ id: 'live' as EditorTab, label: 'Live Data', icon: '🚀', description: 'Post-launch results' }] : [])
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Problem Statement Summary */}
              <div className="bg-card border rounded-lg p-4">
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  🎯 Problem Statement
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  {sections.problemStatement || 'No problem statement defined yet.'}
                </p>
                <button
                  onClick={() => setActiveTab('problem')}
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Edit →
                </button>
              </div>

              {/* Success Metrics Summary */}
              <div className="bg-card border rounded-lg p-4">
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  📊 Success Metrics
                </h4>
                <div className="space-y-1 mb-3">
                  {sections.successMetrics.length > 0 ? (
                    sections.successMetrics.map((metric, index) => (
                      <div key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                        {metric}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No metrics defined yet.</p>
                  )}
                </div>
                <button
                  onClick={() => setActiveTab('metrics')}
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Edit →
                </button>
              </div>

              {/* Trade-offs Summary */}
              <div className="bg-card border rounded-lg p-4">
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  ⚖️ Trade-offs
                </h4>
                <div className="space-y-1 mb-3">
                  {sections.tradeOffs.length > 0 ? (
                    sections.tradeOffs.map((tradeoff, index) => (
                      <div key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                        {tradeoff}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No trade-offs identified yet.</p>
                  )}
                </div>
                <button
                  onClick={() => setActiveTab('tradeoffs')}
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Edit →
                </button>
              </div>

              {/* Learnings Summary */}
              <div className="bg-card border rounded-lg p-4">
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  🧠 Learnings
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  {sections.learnings || 'No learnings captured yet.'}
                </p>
                <button
                  onClick={() => setActiveTab('learnings')}
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Edit →
                </button>
              </div>
            </div>
          </div>
        );

      case 'problem':
        return (
          <div className="space-y-6">
            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold text-foreground">Problem Statement</h3>
                  <HelpTooltip {...HELP_CONTENT.PROBLEM_STATEMENT} />
                </div>
                <div className="flex items-center gap-2">
                  <VersionHistoryDropdown section="problemStatement" />
                  <button
                    onClick={() => handleSummarize('problemStatement', sections.problemStatement)}
                    disabled={isSummarizing.problemStatement}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSummarizing.problemStatement ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                        Summarizing...
                      </div>
                    ) : (
                      'AI Summarize'
                    )}
                  </button>
                </div>
              </div>
              <textarea
                value={sections.problemStatement}
                onChange={(e) => updateSection('problemStatement', e.target.value)}
                rows={8}
                className="w-full bg-background border border-input rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring text-foreground resize-none"
                placeholder="Describe the problem you're trying to solve, including the context, stakeholders, and impact..."
              />
            </div>
          </div>
        );

      case 'metrics':
        return (
          <div className="space-y-6">
            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold text-foreground">Success Metrics</h3>
                  <HelpTooltip {...HELP_CONTENT.SUCCESS_METRICS} />
                </div>
                <div className="flex items-center gap-2">
                  <VersionHistoryDropdown section="successMetrics" />
                  <button
                    onClick={() => addArrayItem('successMetrics')}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
                  >
                    Add Metric
                  </button>
                  <button
                    onClick={() => handleSummarize('successMetrics', sections.successMetrics)}
                    disabled={isSummarizing.successMetrics}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSummarizing.successMetrics ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                        Summarizing...
                      </div>
                    ) : (
                      'AI Summarize'
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                {sections.successMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground w-8">{index + 1}.</span>
                    <input
                      type="text"
                      value={metric}
                      onChange={(e) => updateArrayItem('successMetrics', index, e.target.value)}
                      className="flex-1 bg-background border border-input rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring text-foreground"
                      placeholder={`Define success metric ${index + 1}...`}
                    />
                    <button
                      onClick={() => removeArrayItem('successMetrics', index)}
                      className="px-3 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {sections.successMetrics.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No success metrics defined yet. Click "Add Metric" to get started.
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 'tradeoffs':
        return (
          <div className="space-y-6">
            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold text-foreground">Trade-offs</h3>
                  <HelpTooltip {...HELP_CONTENT.TRADE_OFFS} />
                </div>
                <div className="flex items-center gap-2">
                  <VersionHistoryDropdown section="tradeOffs" />
                  <button
                    onClick={() => addArrayItem('tradeOffs')}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
                  >
                    Add Trade-off
                  </button>
                  <button
                    onClick={() => handleSummarize('tradeOffs', sections.tradeOffs)}
                    disabled={isSummarizing.tradeOffs}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSummarizing.tradeOffs ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                        Summarizing...
                      </div>
                    ) : (
                      'AI Summarize'
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                {sections.tradeOffs.map((tradeoff, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground w-8">{index + 1}.</span>
                    <input
                      type="text"
                      value={tradeoff}
                      onChange={(e) => updateArrayItem('tradeOffs', index, e.target.value)}
                      className="flex-1 bg-background border border-input rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring text-foreground"
                      placeholder={`Describe trade-off ${index + 1}...`}
                    />
                    <button
                      onClick={() => removeArrayItem('tradeOffs', index)}
                      className="px-3 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {sections.tradeOffs.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No trade-offs identified yet. Click "Add Trade-off" to get started.
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 'learnings':
        return (
          <div className="space-y-6">
            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold text-foreground">Learnings & Insights</h3>
                  <HelpTooltip {...HELP_CONTENT.LEARNINGS} />
                </div>
                <div className="flex items-center gap-2">
                  <VersionHistoryDropdown section="learnings" />
                  <button
                    onClick={() => handleSummarize('learnings', sections.learnings)}
                    disabled={isSummarizing.learnings}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSummarizing.learnings ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                        Summarizing...
                      </div>
                    ) : (
                      'AI Summarize'
                    )}
                  </button>
                </div>
              </div>
              <textarea
                value={sections.learnings}
                onChange={(e) => updateSection('learnings', e.target.value)}
                rows={10}
                className="w-full bg-background border border-input rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring text-foreground resize-none"
                placeholder="Capture your learnings, research findings, customer insights, and key takeaways..."
              />
            </div>
          </div>
        );

      case 'live':
        return (
          <div className="space-y-6">
            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">Post-Launch Results</h3>
              <p className="text-sm text-muted-foreground mb-6">
                This section is only available in the Live stage. Track your actual results and compare them to your original success metrics.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`w-full bg-background border rounded-lg shadow-sm ${className}`}>
      {/* Header */}
      <div className="border-b border-border p-6">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-2xl font-semibold text-foreground">PRD Editor</h2>
          <HelpTooltip {...HELP_CONTENT.PRD_EDITOR} />
        </div>
        <p className="text-sm text-muted-foreground">Edit your product requirements document</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {renderTabContent()}
      </div>
    </div>
  );
}; 
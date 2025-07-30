'use client';

import { useState } from 'react';
import { usePRD } from '../contexts/PRDContext';
import { useRouter } from 'next/navigation';

interface LiveStagePanelProps {
  className?: string;
}

export const LiveStagePanel = ({ className = '' }: LiveStagePanelProps) => {
  const { sections, updateSection, title } = usePRD();
  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCreatingFollowUp, setIsCreatingFollowUp] = useState(false);

  const addPostLaunchMetric = () => {
    const currentMetrics = sections.postLaunchMetrics;
    updateSection('postLaunchMetrics', [...currentMetrics, '']);
  };

  const updatePostLaunchMetric = (index: number, value: string) => {
    const currentMetrics = [...sections.postLaunchMetrics];
    currentMetrics[index] = value;
    updateSection('postLaunchMetrics', currentMetrics);
  };

  const removePostLaunchMetric = (index: number) => {
    const currentMetrics = sections.postLaunchMetrics.filter((_, i) => i !== index);
    updateSection('postLaunchMetrics', currentMetrics);
  };

  const handleAnalyzeResults = async () => {
    if (!sections.postLaunchMetrics.length && !sections.userFeedback) {
      alert('Please add some post-launch metrics or user feedback before analyzing.');
      return;
    }

    setIsAnalyzing(true);

    try {
      const analysisPrompt = `Analyze the post-launch results for the project "${title}".

Original Success Metrics:
${sections.successMetrics.join('\n')}

Post-Launch Metrics:
${sections.postLaunchMetrics.join('\n')}

User Feedback:
${sections.userFeedback}

Please provide:
1. Did the feature validate our hypothesis?
2. What should we do next?
3. Key insights and recommendations

Focus on comparing actual results to original success metrics and providing actionable next steps.`;

      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: analysisPrompt,
          stage: 'Live',
          prdContext: `Project: ${title}\nOriginal Success Metrics: ${sections.successMetrics.join(', ')}`,
          conversationHistory: []
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        updateSection('hypothesisValidation', data.response);
      } else {
        alert('Failed to analyze results. Please try again.');
      }
    } catch (error) {
      console.error('Error analyzing results:', error);
      alert('Error analyzing results. Please check your connection and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleStartFollowUpPRD = async () => {
    setIsCreatingFollowUp(true);

    try {
      // Generate insights for the follow-up PRD
      const followUpPrompt = `Based on the post-launch results for "${title}", generate insights for a follow-up PRD.

Original Success Metrics:
${sections.successMetrics.join('\n')}

Post-Launch Metrics:
${sections.postLaunchMetrics.join('\n')}

User Feedback:
${sections.userFeedback}

Hypothesis Validation:
${sections.hypothesisValidation}

Please provide:
1. Key learnings from the launch
2. Identified opportunities for improvement
3. Suggested next steps or new features
4. Updated hypothesis based on results

Format this as insights that can be used to start a new PRD.`;

      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: followUpPrompt,
          stage: 'Live',
          prdContext: `Project: ${title}\nResults: ${sections.hypothesisValidation}`,
          conversationHistory: []
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store the insights for the follow-up PRD
        updateSection('nextSteps', data.response);
        
        // Generate a new workspace ID
        const newWorkspaceId = Date.now().toString();
        
        // Redirect to the new workspace
        router.push(`/workspace/${newWorkspaceId}`);
      } else {
        alert('Failed to create follow-up PRD. Please try again.');
      }
    } catch (error) {
      console.error('Error creating follow-up PRD:', error);
      alert('Error creating follow-up PRD. Please check your connection and try again.');
    } finally {
      setIsCreatingFollowUp(false);
    }
  };

  const compareMetrics = () => {
    if (!sections.successMetrics.length || !sections.postLaunchMetrics.length) {
      return null;
    }

    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Metrics Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Original Success Metrics:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              {sections.successMetrics.map((metric, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  {metric}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Post-Launch Results:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              {sections.postLaunchMetrics.map((metric, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  {metric}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-lg shadow-xl p-8 ${className}`}>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Live Stage - Post-Launch Analysis</h2>
      
      <div className="space-y-8">
        {/* Post-Launch Metrics */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-lg font-semibold text-gray-700">
              Post-Launch Metrics
            </label>
            <button
              onClick={addPostLaunchMetric}
              className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            >
              Add Metric
            </button>
          </div>
          <div className="space-y-2">
            {sections.postLaunchMetrics.map((metric, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={metric}
                  onChange={(e) => updatePostLaunchMetric(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={`Post-launch metric ${index + 1}...`}
                />
                <button
                  onClick={() => removePostLaunchMetric(index)}
                  className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
            {sections.postLaunchMetrics.length === 0 && (
              <p className="text-gray-500 text-sm">No post-launch metrics added yet. Click "Add Metric" to get started.</p>
            )}
          </div>
        </div>

        {/* User Feedback */}
        <div className="space-y-4">
          <label className="block text-lg font-semibold text-gray-700">
            User Feedback
          </label>
          <textarea
            value={sections.userFeedback}
            onChange={(e) => updateSection('userFeedback', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter user feedback, reviews, or qualitative insights from the launch..."
          />
        </div>

        {/* Metrics Comparison */}
        {compareMetrics()}

        {/* Analysis Button */}
        <div className="flex justify-center">
          <button
            onClick={handleAnalyzeResults}
            disabled={isAnalyzing || (!sections.postLaunchMetrics.length && !sections.userFeedback)}
            className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isAnalyzing ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Analyzing Results...
              </div>
            ) : (
              'Analyze Results & Validate Hypothesis'
            )}
          </button>
        </div>

        {/* Hypothesis Validation Results */}
        {sections.hypothesisValidation && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-purple-900 mb-3">Hypothesis Validation & Next Steps</h3>
            <div className="whitespace-pre-wrap text-purple-800 leading-relaxed">
              {sections.hypothesisValidation}
            </div>
          </div>
        )}

        {/* Start Follow-up PRD Button */}
        <div className="flex justify-center">
          <button
            onClick={handleStartFollowUpPRD}
            disabled={isCreatingFollowUp || !sections.hypothesisValidation}
            className="px-6 py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isCreatingFollowUp ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Follow-up PRD...
              </div>
            ) : (
              'Start Follow-up PRD'
            )}
          </button>
        </div>

        {/* Next Steps (for follow-up PRD) */}
        {sections.nextSteps && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-orange-900 mb-3">Follow-up PRD Insights</h3>
            <div className="whitespace-pre-wrap text-orange-800 leading-relaxed">
              {sections.nextSteps}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 
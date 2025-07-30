'use client';

import { useState, useEffect } from 'react';
import { usePRD } from '../contexts/PRDContext';
import { getRecommendedNextStage, StageRecommendation, PRDStage } from '../utils/stageRecommendation';

interface StageRecommendationBannerProps {
  className?: string;
  agentResponses?: Array<{
    agent: string;
    response: string;
  }>;
}

export const StageRecommendationBanner = ({ className = '', agentResponses = [] }: StageRecommendationBannerProps) => {
  const { stage, title, sections, setStage } = usePRD();
  const [recommendation, setRecommendation] = useState<StageRecommendation | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Analyze PRD state and get recommendation
    const prdState = {
      stage,
      title,
      sections,
      agentResponses
    };
    
    const newRecommendation = getRecommendedNextStage(prdState);
    
    // Only show recommendation if it's different from current stage or suggests review
    if (newRecommendation.recommendedStage !== stage || newRecommendation.action === 'review') {
      setRecommendation(newRecommendation);
      setIsVisible(true);
      setIsDismissed(false);
    } else {
      setIsVisible(false);
    }
  }, [stage, title, sections, agentResponses]);

  const handleAdvance = () => {
    if (recommendation) {
      setStage(recommendation.recommendedStage);
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  const getBannerStyles = (rec: StageRecommendation) => {
    const baseStyles = "fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-2xl w-full mx-4 rounded-lg shadow-lg border p-4 transition-all duration-300";
    
    switch (rec.action) {
      case 'advance':
        return `${baseStyles} bg-green-50 border-green-200 text-green-800`;
      case 'review':
        return `${baseStyles} bg-yellow-50 border-yellow-200 text-yellow-800`;
      case 'stay':
        return `${baseStyles} bg-blue-50 border-blue-200 text-blue-800`;
      default:
        return `${baseStyles} bg-gray-50 border-gray-200 text-gray-800`;
    }
  };

  const getConfidenceIcon = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return '🎯';
      case 'medium':
        return '🤔';
      case 'low':
        return '❓';
      default:
        return '💡';
    }
  };

  const getActionButton = (rec: StageRecommendation) => {
    if (rec.action === 'advance' && rec.recommendedStage !== stage) {
      return (
        <button
          onClick={handleAdvance}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium"
        >
          Move to {rec.recommendedStage}
        </button>
      );
    } else if (rec.action === 'review') {
      return (
        <button
          onClick={() => setStage(rec.recommendedStage)}
          className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors font-medium"
        >
          Review {rec.recommendedStage}
        </button>
      );
    }
    return null;
  };

  if (!isVisible || isDismissed || !recommendation) {
    return null;
  }

  return (
    <div className={getBannerStyles(recommendation)}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="flex-shrink-0 text-2xl">
            {getConfidenceIcon(recommendation.confidence)}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="font-semibold text-lg">
                Stage Recommendation
              </h3>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-white bg-opacity-50">
                {recommendation.confidence} confidence
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-3">
              {recommendation.reason}
            </p>
            <div className="flex items-center space-x-3">
              {getActionButton(recommendation)}
              <button
                onClick={handleDismiss}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}; 
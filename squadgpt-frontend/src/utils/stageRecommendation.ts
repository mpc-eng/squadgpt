export type PRDStage = 'Aperture' | 'Discovery' | 'Define' | 'Design' | 'Deliver' | 'Live';

export interface PRDState {
  stage: PRDStage;
  title: string;
  sections: {
    problemStatement: string;
    tradeOffs: string[];
    successMetrics: string[];
    learnings: string;
    postLaunchMetrics: string[];
    userFeedback: string;
    hypothesisValidation: string;
    nextSteps: string;
  };
  agentResponses?: Array<{
    agent: string;
    response: string;
  }>;
}

export interface StageRecommendation {
  recommendedStage: PRDStage;
  reason: string;
  confidence: 'high' | 'medium' | 'low';
  action: 'advance' | 'review' | 'stay';
}

// Helper function to analyze text quality
const analyzeTextQuality = (text: string): number => {
  if (!text || text.trim().length === 0) return 0;
  
  const words = text.trim().split(/\s+/).length;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const hasStructure = /^(.*\n){2,}/.test(text) || /^[•\-\*]/.test(text);
  
  // Score based on length, structure, and content
  let score = Math.min(words / 10, 1); // Normalize by expected length
  if (sentences >= 3) score += 0.2;
  if (hasStructure) score += 0.2;
  if (words > 50) score += 0.1;
  
  return Math.min(score, 1);
};

// Helper function to analyze array quality
const analyzeArrayQuality = (items: string[]): number => {
  if (!items || items.length === 0) return 0;
  
  const nonEmptyItems = items.filter(item => item.trim().length > 0);
  const avgLength = nonEmptyItems.reduce((sum, item) => sum + item.length, 0) / nonEmptyItems.length;
  
  let score = nonEmptyItems.length / Math.max(items.length, 1);
  if (avgLength > 20) score += 0.2;
  if (nonEmptyItems.length >= 3) score += 0.2;
  
  return Math.min(score, 1);
};

// Helper function to analyze agent responses
const analyzeAgentResponses = (responses?: Array<{ agent: string; response: string }>): number => {
  if (!responses || responses.length === 0) return 0;
  
  const validResponses = responses.filter(r => r.response && r.response.trim().length > 50);
  return Math.min(validResponses.length / responses.length, 1);
};

export const getRecommendedNextStage = (prd: PRDState): StageRecommendation => {
  const { stage, sections, agentResponses } = prd;
  
  // Analyze current stage completion
  const stageAnalysis = {
    Aperture: () => {
      const titleQuality = prd.title.length > 5 ? 1 : 0;
      const problemQuality = analyzeTextQuality(sections.problemStatement);
      const learningsQuality = analyzeTextQuality(sections.learnings);
      
      const avgQuality = (titleQuality + problemQuality + learningsQuality) / 3;
      
      if (avgQuality >= 0.7) {
        return {
          recommendedStage: 'Discovery' as PRDStage,
          reason: 'Aperture stage is well-defined with clear problem statement and learnings. Ready to move to Discovery.',
          confidence: 'high' as const,
          action: 'advance' as const
        };
      } else {
        return {
          recommendedStage: 'Aperture' as PRDStage,
          reason: 'Aperture stage needs more detail. Please complete the problem statement and document key learnings.',
          confidence: 'high' as const,
          action: 'review' as const
        };
      }
    },
    
    Discovery: () => {
      const problemQuality = analyzeTextQuality(sections.problemStatement);
      const tradeOffsQuality = analyzeArrayQuality(sections.tradeOffs);
      const successMetricsQuality = analyzeArrayQuality(sections.successMetrics);
      const learningsQuality = analyzeTextQuality(sections.learnings);
      const agentQuality = analyzeAgentResponses(agentResponses);
      
      const avgQuality = (problemQuality + tradeOffsQuality + successMetricsQuality + learningsQuality + agentQuality) / 5;
      
      if (avgQuality >= 0.6) {
        return {
          recommendedStage: 'Define' as PRDStage,
          reason: 'Discovery stage is comprehensive with well-defined metrics, trade-offs, and agent insights. Ready to define the solution.',
          confidence: 'high' as const,
          action: 'advance' as const
        };
      } else {
        return {
          recommendedStage: 'Discovery' as PRDStage,
          reason: 'Discovery stage needs more detail. Please add more trade-offs, success metrics, or get agent feedback.',
          confidence: 'medium' as const,
          action: 'review' as const
        };
      }
    },
    
    Define: () => {
      const problemQuality = analyzeTextQuality(sections.problemStatement);
      const tradeOffsQuality = analyzeArrayQuality(sections.tradeOffs);
      const successMetricsQuality = analyzeArrayQuality(sections.successMetrics);
      const learningsQuality = analyzeTextQuality(sections.learnings);
      
      const avgQuality = (problemQuality + tradeOffsQuality + successMetricsQuality + learningsQuality) / 4;
      
      if (avgQuality >= 0.7) {
        return {
          recommendedStage: 'Design' as PRDStage,
          reason: 'Define stage is well-structured with clear requirements. Ready to move to Design phase.',
          confidence: 'high' as const,
          action: 'advance' as const
        };
      } else {
        return {
          recommendedStage: 'Discovery' as PRDStage,
          reason: 'Define stage is sparse. Consider going back to Discovery to gather more requirements and insights.',
          confidence: 'medium' as const,
          action: 'review' as const
        };
      }
    },
    
    Design: () => {
      // For Design stage, we'll recommend moving to Deliver if we have good definition
      const problemQuality = analyzeTextQuality(sections.problemStatement);
      const successMetricsQuality = analyzeArrayQuality(sections.successMetrics);
      
      if (problemQuality >= 0.6 && successMetricsQuality >= 0.6) {
        return {
          recommendedStage: 'Deliver' as PRDStage,
          reason: 'Design phase is ready. Proceed to Deliver to start implementation.',
          confidence: 'medium' as const,
          action: 'advance' as const
        };
      } else {
        return {
          recommendedStage: 'Define' as PRDStage,
          reason: 'Design phase needs better definition. Review the problem statement and success metrics.',
          confidence: 'medium' as const,
          action: 'review' as const
        };
      }
    },
    
    Deliver: () => {
      // For Deliver stage, recommend moving to Live for post-launch analysis
      return {
        recommendedStage: 'Live' as PRDStage,
        reason: 'Implementation is complete. Move to Live stage to analyze post-launch results.',
        confidence: 'high' as const,
        action: 'advance' as const
      };
    },
    
    Live: () => {
      const postLaunchQuality = analyzeArrayQuality(sections.postLaunchMetrics);
      const feedbackQuality = analyzeTextQuality(sections.userFeedback);
      
      if (postLaunchQuality >= 0.5 || feedbackQuality >= 0.5) {
        return {
          recommendedStage: 'Aperture' as PRDStage,
          reason: 'Post-launch analysis complete. Consider starting a follow-up PRD based on learnings.',
          confidence: 'medium' as const,
          action: 'advance' as const
        };
      } else {
        return {
          recommendedStage: 'Live' as PRDStage,
          reason: 'Live stage needs post-launch data. Add metrics and user feedback for analysis.',
          confidence: 'high' as const,
          action: 'review' as const
        };
      }
    }
  };
  
  return stageAnalysis[stage]();
};

// Helper function to get stage-specific requirements
export const getStageRequirements = (stage: PRDStage): string[] => {
  const requirements = {
    Aperture: [
      'Clear project title',
      'Well-defined problem statement',
      'Documented learnings and insights'
    ],
    Discovery: [
      'Comprehensive problem analysis',
      'Multiple trade-offs identified',
      'Clear success metrics',
      'Agent feedback and insights'
    ],
    Define: [
      'Detailed problem statement',
      'Well-analyzed trade-offs',
      'Specific success metrics',
      'Comprehensive learnings'
    ],
    Design: [
      'Clear requirements from Define stage',
      'Well-defined success metrics'
    ],
    Deliver: [
      'Implementation based on Design',
      'Ready for launch'
    ],
    Live: [
      'Post-launch metrics',
      'User feedback',
      'Results analysis'
    ]
  };
  
  return requirements[stage] || [];
}; 
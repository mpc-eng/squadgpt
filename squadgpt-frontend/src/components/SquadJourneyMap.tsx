'use client';

import { usePRD } from '../contexts/PRDContext';

const PRD_STAGES = [
  { id: 'Aperture', label: 'Aperture', description: 'Initial idea exploration' },
  { id: 'Discovery', label: 'Discovery', description: 'Research and validation' },
  { id: 'Define', label: 'Define', description: 'Problem definition' },
  { id: 'Design', label: 'Design', description: 'Solution design' },
  { id: 'Deliver', label: 'Deliver', description: 'Development and launch' },
  { id: 'Live', label: 'Live', description: 'Post-launch analysis' }
];

export const SquadJourneyMap = () => {
  const { stage, setStage } = usePRD();

  const getStageStatus = (stageId: string) => {
    const currentIndex = PRD_STAGES.findIndex(s => s.id === stage);
    const stageIndex = PRD_STAGES.findIndex(s => s.id === stageId);
    
    if (stageIndex < currentIndex) return 'completed';
    if (stageIndex === currentIndex) return 'current';
    return 'pending';
  };

  const getStageStyles = (stageId: string) => {
    const status = getStageStatus(stageId);
    const isCurrent = stageId === stage;
    
    const baseStyles = "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer";
    
    if (isCurrent) {
      return `${baseStyles} bg-primary text-primary-foreground shadow-sm`;
    }
    
    switch (status) {
      case 'completed':
        return `${baseStyles} bg-green-100 text-green-800 hover:bg-green-200`;
      case 'current':
        return `${baseStyles} bg-muted hover:bg-accent text-foreground`;
      case 'pending':
        return `${baseStyles} bg-muted hover:bg-accent text-muted-foreground`;
      default:
        return `${baseStyles} bg-muted hover:bg-accent text-muted-foreground`;
    }
  };

  return (
    <div className="bg-card border-b border-border">
      <div className="flex space-x-6 overflow-x-auto px-4 py-2 scrollbar-hide">
        {PRD_STAGES.map((stageItem) => {
          const status = getStageStatus(stageItem.id);
          
          return (
            <div
              key={stageItem.id}
              className="flex-shrink-0"
            >
              <button
                onClick={() => setStage(stageItem.id as any)}
                className={getStageStyles(stageItem.id)}
                title={stageItem.description}
              >
                <div className="flex items-center gap-2">
                  {/* Status Icon */}
                  <div className="w-2 h-2 rounded-full">
                    {status === 'completed' && (
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    )}
                    {status === 'current' && (
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    )}
                    {status === 'pending' && (
                      <div className="w-2 h-2 bg-muted-foreground/30 rounded-full"></div>
                    )}
                  </div>
                  
                  {/* Stage Label */}
                  <span>{stageItem.label}</span>
                </div>
              </button>
            </div>
          );
        })}
      </div>
      
      {/* Progress Indicator */}
      <div className="px-4 pb-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Journey Progress</span>
          <span>{Math.round((PRD_STAGES.findIndex(s => s.id === stage) + 1) / PRD_STAGES.length * 100)}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-1 mt-1">
          <div 
            className="bg-primary h-1 rounded-full transition-all duration-300"
            style={{ 
              width: `${((PRD_STAGES.findIndex(s => s.id === stage) + 1) / PRD_STAGES.length) * 100}%` 
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}; 
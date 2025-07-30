'use client';

import { usePRD } from '../contexts/PRDContext';

const PRD_STAGES = [
  { id: 'Aperture', label: 'Aperture', description: 'Problem Discovery' },
  { id: 'Discovery', label: 'Discovery', description: 'Research & Insights' },
  { id: 'Define', label: 'Define', description: 'Requirements & Scope' },
  { id: 'Design', label: 'Design', description: 'Solution Design' },
  { id: 'Deliver', label: 'Deliver', description: 'Development & Testing' },
  { id: 'Live', label: 'Live', description: 'Launch & Monitor' }
] as const;

export const StageSidebar = () => {
  const { stage, setStage } = usePRD();

  const getStageStatus = (stageId: string) => {
    const stageIndex = PRD_STAGES.findIndex(s => s.id === stageId);
    const currentIndex = PRD_STAGES.findIndex(s => s.id === stage);
    
    if (stageIndex < currentIndex) return 'completed';
    if (stageIndex === currentIndex) return 'current';
    return 'pending';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">✅</span>
          </div>
        );
      case 'current':
        return (
          <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">🔄</span>
          </div>
        );
      case 'pending':
        return (
          <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
            <span className="text-muted-foreground text-sm">⏳</span>
          </div>
        );
      default:
        return null;
    }
  };

  const getStageStyles = (stageId: string) => {
    const isCurrent = stageId === stage;
    
    const baseStyles = "flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all duration-150 ease-in-out hover:bg-accent hover:text-accent-foreground";
    
    if (isCurrent) {
      return `${baseStyles} bg-muted font-semibold text-primary`;
    }
    
    return `${baseStyles} text-muted-foreground`;
  };

  return (
    <div className="w-64 bg-background border-r border-border sticky top-0 h-screen overflow-y-auto" data-tour="stage-nav">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-2">PRD Stages</h2>
          <p className="text-sm text-muted-foreground">Track your product development progress</p>
        </div>
        
        <nav className="space-y-2">
          {PRD_STAGES.map((stageItem) => {
            const status = getStageStatus(stageItem.id);
            
            return (
              <div
                key={stageItem.id}
                className={getStageStyles(stageItem.id)}
                onClick={() => setStage(stageItem.id as any)}
              >
                {getStatusIcon(status)}
                <div className="flex-1 min-w-0">
                  <div className="text-base font-medium">{stageItem.label}</div>
                  <div className="text-sm text-muted-foreground">{stageItem.description}</div>
                </div>
              </div>
            );
          })}
        </nav>
        
        {/* Progress indicator */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Progress</span>
            <span>{Math.round((PRD_STAGES.findIndex(s => s.id === stage) + 1) / PRD_STAGES.length * 100)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${((PRD_STAGES.findIndex(s => s.id === stage) + 1) / PRD_STAGES.length) * 100}%` 
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}; 
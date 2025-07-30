'use client';

import { usePRD } from '../contexts/PRDContext';
import { useOnboarding } from './OnboardingTour';

// Simple date formatting function
const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} days ago`;
};

interface ProjectHeaderProps {
  className?: string;
}

export const ProjectHeader = ({ className = '' }: ProjectHeaderProps) => {
  const { title, stage, setTitle } = usePRD();
  const { hasCompletedOnboarding, startOnboarding } = useOnboarding();
  
  // Mock last saved time - in real app this would come from context
  const lastSaved = new Date();

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving project...');
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Exporting PRD...');
  };

  const handleTitleEdit = () => {
    const newTitle = prompt('Enter project title:', title);
    if (newTitle && newTitle.trim()) {
      setTitle(newTitle.trim());
    }
  };

  return (
    <header className={`sticky top-0 z-40 bg-background border-b border-border ${className}`}>
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          {/* Project Title */}
          <div className="min-w-0 flex-1">
            <h1 
              className="text-xl font-semibold text-foreground truncate cursor-pointer hover:text-primary transition-colors"
              onClick={handleTitleEdit}
              title="Click to edit project title"
              data-tour="project-title"
            >
              {title || 'Untitled Project'}
            </h1>
          </div>
          
          {/* Stage Badge */}
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm font-medium">
              {stage} Stage
            </span>
          </div>
          
          {/* Last Saved */}
          <span className="text-sm text-muted-foreground hidden md:block">
            Last saved {formatRelativeTime(lastSaved)}
          </span>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-3 ml-4">
          {hasCompletedOnboarding && (
            <button
              onClick={startOnboarding}
              className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
              title="Restart onboarding tour"
            >
              Tour
            </button>
          )}
          <button
            onClick={handleSave}
            className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
          >
            Save Draft
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Export PRD
          </button>
        </div>
      </div>
    </header>
  );
}; 
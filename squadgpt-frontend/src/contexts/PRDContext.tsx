'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SectionVersion {
  content: string | string[];
  timestamp: number;
  id: string;
}

interface SectionVersions {
  problemStatement: SectionVersion[];
  tradeOffs: SectionVersion[];
  successMetrics: SectionVersion[];
  learnings: SectionVersion[];
}

interface PRDContextType {
  stage: 'Aperture' | 'Discovery' | 'Define' | 'Design' | 'Deliver' | 'Live';
  setStage: (stage: PRDContextType['stage']) => void;
  title: string;
  setTitle: (title: string) => void;
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
  updateSection: (section: keyof PRDContextType['sections'], content: string | string[]) => void;
  restoreSection: (section: keyof SectionVersions, versionId: string) => void;
  getSectionVersions: (section: keyof SectionVersions) => SectionVersion[];
  version: string;
}

const PRDContext = createContext<PRDContextType | undefined>(undefined);

interface PRDProviderProps {
  children: ReactNode;
}

export const PRDProvider: React.FC<PRDProviderProps> = ({ children }) => {
  const [stage, setStage] = useState<PRDContextType['stage']>('Aperture');
  const [title, setTitle] = useState<string>('');
  const [sections, setSections] = useState<PRDContextType['sections']>({
    problemStatement: '',
    tradeOffs: [],
    successMetrics: [],
    learnings: '',
    postLaunchMetrics: [],
    userFeedback: '',
    hypothesisValidation: '',
    nextSteps: ''
  });
  const [version] = useState<string>('1.0.0');

  // Initialize section versions from localStorage or empty arrays
  const [sectionVersions, setSectionVersions] = useState<SectionVersions>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('prd-section-versions');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.warn('Failed to parse stored section versions:', e);
        }
      }
    }
    return {
      problemStatement: [],
      tradeOffs: [],
      successMetrics: [],
      learnings: []
    };
  });

  // Save versions to localStorage whenever they change
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('prd-section-versions', JSON.stringify(sectionVersions));
    }
  }, [sectionVersions]);

  const addVersion = (section: keyof SectionVersions, content: string | string[]) => {
    const newVersion: SectionVersion = {
      content,
      timestamp: Date.now(),
      id: `${section}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    setSectionVersions(prev => {
      const currentVersions = prev[section];
      const updatedVersions = [newVersion, ...currentVersions].slice(0, 5); // Keep only last 5 versions
      
      return {
        ...prev,
        [section]: updatedVersions
      };
    });
  };

  const updateSection = (section: keyof PRDContextType['sections'], content: string | string[]) => {
    setSections(prev => ({
      ...prev,
      [section]: content
    }));

    // Add version for versioned sections
    if (section === 'problemStatement' || section === 'tradeOffs' || 
        section === 'successMetrics' || section === 'learnings') {
      addVersion(section as keyof SectionVersions, content);
    }
  };

  const restoreSection = (section: keyof SectionVersions, versionId: string) => {
    const versions = sectionVersions[section];
    const versionToRestore = versions.find(v => v.id === versionId);
    
    if (versionToRestore) {
      setSections(prev => ({
        ...prev,
        [section]: versionToRestore.content
      }));
    }
  };

  const getSectionVersions = (section: keyof SectionVersions): SectionVersion[] => {
    return sectionVersions[section] || [];
  };

  const value: PRDContextType = {
    stage,
    setStage,
    title,
    setTitle,
    sections,
    updateSection,
    restoreSection,
    getSectionVersions,
    version
  };

  return (
    <PRDContext.Provider value={value}>
      {children}
    </PRDContext.Provider>
  );
};

export const usePRD = (): PRDContextType => {
  const context = useContext(PRDContext);
  if (context === undefined) {
    throw new Error('usePRD must be used within a PRDProvider');
  }
  return context;
}; 
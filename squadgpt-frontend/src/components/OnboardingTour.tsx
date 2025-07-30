'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  target: string; // CSS selector
  position: 'top' | 'bottom' | 'left' | 'right';
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'project-title',
    title: 'Your Project',
    description: 'This is your project title. Click to edit it anytime.',
    target: '[data-tour="project-title"]',
    position: 'bottom'
  },
  {
    id: 'stage-navigation',
    title: 'PRD Stages',
    description: 'Navigate through the 6 stages of product development.',
    target: '[data-tour="stage-nav"]',
    position: 'right'
  },
  {
    id: 'ai-chat',
    title: 'AI Assistant',
    description: 'Chat with our AI squad for guidance and insights.',
    target: '[data-tour="ai-chat"]',
    position: 'left'
  },
  {
    id: 'prd-editor',
    title: 'PRD Editor',
    description: 'Edit your product requirements and get AI-powered summaries.',
    target: '[data-tour="prd-editor"]',
    position: 'left'
  },
  {
    id: 'agent-debate',
    title: 'AI Squad',
    description: 'See how our AI team analyzes your project from different perspectives.',
    target: '[data-tour="agent-debate"]',
    position: 'top'
  }
];

interface OnboardingTourProps {
  isActive: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export const OnboardingTour = ({ isActive, onComplete, onSkip }: OnboardingTourProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const currentStepData = ONBOARDING_STEPS[currentStep];
    const element = document.querySelector(currentStepData.target) as HTMLElement;
    
    if (element) {
      setHighlightedElement(element);
      
      // Scroll element into view
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      });
    }
  }, [currentStep, isActive]);

  const nextStep = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeTour = () => {
    localStorage.setItem('onboarding-completed', 'true');
    onComplete();
  };

  const skipTour = () => {
    localStorage.setItem('onboarding-completed', 'true');
    onSkip();
  };

  if (!isActive) return null;

  const currentStepData = ONBOARDING_STEPS[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50"
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50" />
        
        {/* Highlight overlay */}
        {highlightedElement && (
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute border-2 border-primary rounded-lg shadow-lg"
              style={{
                top: highlightedElement.offsetTop - 8,
                left: highlightedElement.offsetLeft - 8,
                width: highlightedElement.offsetWidth + 16,
                height: highlightedElement.offsetHeight + 16,
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
              }}
            />
          </div>
        )}
        
        {/* Tour tooltip */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4 pointer-events-auto"
            style={{
              position: 'absolute',
              top: highlightedElement ? highlightedElement.offsetTop + highlightedElement.offsetHeight + 20 : '50%',
              left: highlightedElement ? highlightedElement.offsetLeft : '50%',
              transform: highlightedElement ? 'translateX(-50%)' : 'translate(-50%, -50%)'
            }}
          >
            {/* Progress indicator */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span className="text-sm text-muted-foreground">
                  Step {currentStep + 1} of {ONBOARDING_STEPS.length}
                </span>
              </div>
              <button
                onClick={skipTour}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Skip tour
              </button>
            </div>

            {/* Content */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {currentStepData.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {currentStepData.description}
              </p>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={previousStep}
                disabled={isFirstStep}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              <button
                onClick={nextStep}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                {isLastStep ? 'Finish' : 'Next'}
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Hook to manage onboarding state
export const useOnboarding = () => {
  const [isOnboardingActive, setIsOnboardingActive] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem('onboarding-completed') === 'true';
    setHasCompletedOnboarding(completed);
  }, []);

  const startOnboarding = () => {
    setIsOnboardingActive(true);
  };

  const completeOnboarding = () => {
    setIsOnboardingActive(false);
    setHasCompletedOnboarding(true);
  };

  const skipOnboarding = () => {
    setIsOnboardingActive(false);
    setHasCompletedOnboarding(true);
  };

  return {
    isOnboardingActive,
    hasCompletedOnboarding,
    startOnboarding,
    completeOnboarding,
    skipOnboarding
  };
}; 
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePRD } from '../../contexts/PRDContext';

const PERSONAS = [
  { value: '', label: 'Select a persona (optional)' },
  { value: 'startup-founder', label: 'Startup Founder' },
  { value: 'product-manager', label: 'Product Manager' },
  { value: 'designer', label: 'UX/UI Designer' },
  { value: 'developer', label: 'Software Developer' },
  { value: 'business-analyst', label: 'Business Analyst' },
  { value: 'marketing-manager', label: 'Marketing Manager' },
  { value: 'customer-success', label: 'Customer Success Manager' },
  { value: 'other', label: 'Other' }
];

const WORKFLOW_STEPS = [
  {
    stage: 'Aperture',
    title: 'Initial Exploration',
    description: 'Start with your hypothesis and gather initial insights',
    aiHelp: 'AI will help you explore your idea and identify key areas to investigate'
  },
  {
    stage: 'Discovery',
    title: 'Deep Research',
    description: 'Conduct user research, market analysis, and competitive research',
    aiHelp: 'AI will analyze your findings and suggest additional research areas'
  },
  {
    stage: 'Define',
    title: 'Problem Definition',
    description: 'Clearly define the problem, success metrics, and trade-offs',
    aiHelp: 'AI will help refine your problem statement and suggest relevant metrics'
  },
  {
    stage: 'Design',
    title: 'Solution Design',
    description: 'Design the solution architecture and user experience',
    aiHelp: 'AI will provide design insights and help validate your approach'
  },
  {
    stage: 'Deliver',
    title: 'Implementation',
    description: 'Plan the development roadmap and execution strategy',
    aiHelp: 'AI will help create development plans and identify potential risks'
  },
  {
    stage: 'Live',
    title: 'Launch & Learn',
    description: 'Launch the product and analyze results',
    aiHelp: 'AI will analyze launch data and suggest next steps'
  }
];

export default function StartPRDPage() {
  const router = useRouter();
  const { setTitle, updateSection } = usePRD();
  const [formData, setFormData] = useState({
    title: '',
    hypothesis: '',
    signals: '',
    persona: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showWorkflowGuide, setShowWorkflowGuide] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.title.trim()) {
      newErrors.title = 'PRD Title is required';
    }

    if (!formData.hypothesis.trim()) {
      newErrors.hypothesis = 'Hypothesis is required';
    }

    if (!formData.signals.trim()) {
      newErrors.signals = 'Signals or customer insights are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Set PRD title in context
      setTitle(formData.title);

      // Update PRD sections with form data
      updateSection('problemStatement', formData.hypothesis);
      
      // Add signals to learnings section
      let learningsContent = `Customer Insights & Signals:\n${formData.signals}`;
      if (formData.persona) {
        learningsContent += `\n\nTarget Persona: ${PERSONAS.find(p => p.value === formData.persona)?.label}`;
      }
      updateSection('learnings', learningsContent);

      // Generate a unique ID for the workspace
      const workspaceId = Date.now().toString();

      // Redirect to workspace
      router.push(`/workspace/${workspaceId}`);
    } catch (error) {
      console.error('Error creating PRD:', error);
      alert('Error creating PRD. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Start New PRD
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Define your product hypothesis and let our AI squad guide you through the complete product development process
          </p>
          
          {/* AI Squad Introduction */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">🤖 Meet Your AI Squad</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <span className="text-blue-600 font-semibold">👔</span>
                <div>
                  <strong>Business Analyst:</strong> Analyzes market opportunities and business viability
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-600 font-semibold">📋</span>
                <div>
                  <strong>Product Manager:</strong> Guides product strategy and feature prioritization
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-purple-600 font-semibold">🏗️</span>
                <div>
                  <strong>Solution Architect:</strong> Designs technical architecture and implementation approach
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-orange-600 font-semibold">⚡</span>
                <div>
                  <strong>Scrum Master:</strong> Plans development roadmap and execution strategy
                </div>
              </div>
            </div>
          </div>

          {/* Workflow Guide Toggle */}
          <button
            onClick={() => setShowWorkflowGuide(!showWorkflowGuide)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {showWorkflowGuide ? 'Hide' : 'Show'} Complete Workflow Guide
            <span className="text-sm">{showWorkflowGuide ? '▼' : '▶'}</span>
          </button>
        </div>

        {/* Workflow Guide */}
        {showWorkflowGuide && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">📋 Complete PRD Workflow</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {WORKFLOW_STEPS.map((step, index) => (
                <div key={step.stage} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                      {index + 1}
                    </span>
                    <h3 className="font-semibold text-gray-900">{step.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                  <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                    <strong>AI Help:</strong> {step.aiHelp}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">🚀 Start Your PRD</h2>
            <p className="text-gray-600">
              Fill out the form below to create your PRD. Our AI squad will help you develop each section and guide you through the entire product development process.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* PRD Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                PRD Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., Mobile App for Remote Team Collaboration"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Hypothesis */}
            <div>
              <label htmlFor="hypothesis" className="block text-sm font-medium text-gray-700 mb-2">
                Product Hypothesis *
              </label>
              <textarea
                id="hypothesis"
                name="hypothesis"
                value={formData.hypothesis}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.hypothesis ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Describe your product hypothesis. What problem are you trying to solve? What is your proposed solution? What value will it provide to users?"
              />
              <p className="mt-1 text-xs text-gray-500">
                💡 Tip: Be specific about the problem, solution, and expected outcome
              </p>
              {errors.hypothesis && (
                <p className="mt-1 text-sm text-red-600">{errors.hypothesis}</p>
              )}
            </div>

            {/* Signals or Customer Insights */}
            <div>
              <label htmlFor="signals" className="block text-sm font-medium text-gray-700 mb-2">
                Supporting Evidence *
              </label>
              <textarea
                id="signals"
                name="signals"
                value={formData.signals}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.signals ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="What evidence supports your hypothesis? Include customer feedback, market research, competitive analysis, or any data that validates your idea."
              />
              <p className="mt-1 text-xs text-gray-500">
                💡 Tip: Include specific data points, user quotes, or market trends
              </p>
              {errors.signals && (
                <p className="mt-1 text-sm text-red-600">{errors.signals}</p>
              )}
            </div>

            {/* Persona */}
            <div>
              <label htmlFor="persona" className="block text-sm font-medium text-gray-700 mb-2">
                Your Role (Optional)
              </label>
              <select
                id="persona"
                name="persona"
                value={formData.persona}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {PERSONAS.map((persona) => (
                  <option key={persona.value} value={persona.value}>
                    {persona.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                💡 Tip: This helps our AI tailor recommendations to your role
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Creating PRD...' : '🚀 Create PRD & Open Workspace'}
              </button>
            </div>
          </form>
        </div>

        {/* What Happens Next */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🎯 What Happens Next?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Workspace Opens</h3>
              <p className="text-gray-600">Your PRD workspace will open with your initial content pre-filled</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">AI Analysis</h3>
              <p className="text-gray-600">Our AI squad will analyze your input and provide initial insights</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Guided Development</h3>
              <p className="text-gray-600">Work through each stage with AI assistance and recommendations</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Ready to build something amazing? Let's get started! 🚀</p>
        </div>
      </div>
    </div>
  );
} 
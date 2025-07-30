'use client';

import { useState, useRef, useEffect } from 'react';
import { usePRD } from '../contexts/PRDContext';

interface SectionVersion {
  content: string | string[];
  timestamp: number;
  id: string;
}

interface VersionHistoryDropdownProps {
  section: 'problemStatement' | 'tradeOffs' | 'successMetrics' | 'learnings';
  className?: string;
}

export const VersionHistoryDropdown = ({ section, className = '' }: VersionHistoryDropdownProps) => {
  const { getSectionVersions, restoreSection } = usePRD();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<SectionVersion | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const versions = getSectionVersions(section);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const formatContent = (content: string | string[]) => {
    if (Array.isArray(content)) {
      return content.length > 0 ? content.join(', ') : 'Empty';
    }
    return content.length > 50 ? content.substring(0, 50) + '...' : content || 'Empty';
  };

  const handleRestore = () => {
    if (selectedVersion) {
      restoreSection(section, selectedVersion.id);
      setIsOpen(false);
      setSelectedVersion(null);
    }
  };

  const handleVersionSelect = (version: SectionVersion) => {
    setSelectedVersion(version);
  };

  if (versions.length === 0) {
    return null;
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-sm font-medium flex items-center space-x-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Version History ({versions.length})</span>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Version History - {section.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </h3>
            <p className="text-sm text-gray-600">
              Select a version to preview and restore
            </p>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {versions.map((version, index) => (
              <div
                key={version.id}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                  selectedVersion?.id === version.id
                    ? 'bg-blue-50 border-blue-200'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleVersionSelect(version)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">
                      Version {versions.length - index}
                    </span>
                    {index === 0 && (
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatTimestamp(version.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {formatContent(version.content)}
                </p>
              </div>
            ))}
          </div>

          {selectedVersion && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Selected:</span> Version {versions.findIndex(v => v.id === selectedVersion.id) + 1}
                </div>
                <button
                  onClick={handleRestore}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-sm font-medium"
                >
                  Restore Version
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 
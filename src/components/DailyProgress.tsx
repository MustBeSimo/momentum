'use client';

import { useState, useEffect } from 'react';
import { Domain } from '@/types';
import { cn } from '@/lib/utils';
import { Calendar, Plus, Minus, Target, Sparkles } from 'lucide-react';
import { generateCustomFocusQuestions } from '@/lib/together-ai';

interface DailyProgressProps {
  domains: Domain[];
  onSaveProgress: (progress: DailyProgressData) => void;
}

export interface DailyProgressData {
  date: string;
  domainScores: Record<Domain, number>;
  notes: string;
  mood: number;
  energy: number;
  focus: number;
}

const domainQuestions = {
  Health: [
    "How many hours did you sleep?",
    "Did you exercise today?",
    "How healthy was your diet?",
    "Did you take breaks/stretch?"
  ],
  Focus: [
    "How focused were you during deep work?",
    "How many distractions did you handle?",
    "Did you complete your most important task?",
    "How was your environment?"
  ],
  Output: [
    "How much did you accomplish today?",
    "Did you ship something?",
    "How productive were your meetings?",
    "Did you make progress on key projects?"
  ],
  Learning: [
    "What did you learn today?",
    "Did you read or study?",
    "Did you practice a new skill?",
    "How much time did you spend learning?"
  ],
  Mood: [
    "How was your overall mood?",
    "Did you connect with others?",
    "Were you grateful today?",
    "Did you do something you enjoy?"
  ]
};

export default function DailyProgress({ domains, onSaveProgress }: DailyProgressProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDomain, setCurrentDomain] = useState<Domain>('Health');
  const [domainScores, setDomainScores] = useState<Record<Domain, number>>({
    Health: 7,
    Focus: 7,
    Output: 7,
    Learning: 7,
    Mood: 7
  });
  const [notes, setNotes] = useState('');
  const [mood, setMood] = useState(7);
  const [energy, setEnergy] = useState(7);
  const [focus, setFocus] = useState(7);
  const [customQuestions, setCustomQuestions] = useState<Record<string, string[]>>({});
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState<Record<string, boolean>>({});

  const handleScoreChange = (domain: Domain, score: number) => {
    setDomainScores(prev => ({
      ...prev,
      [domain]: Math.max(1, Math.min(10, score))
    }));
  };

  const generateQuestionsForCustomDomain = async (domainName: string) => {
    if (customQuestions[domainName]) return; // Already generated
    
    setIsGeneratingQuestions(prev => ({ ...prev, [domainName]: true }));
    
    try {
      const questions = await generateCustomFocusQuestions(domainName, `Track your ${domainName.toLowerCase()} progress`);
      setCustomQuestions(prev => ({ ...prev, [domainName]: questions }));
    } catch (error) {
      console.error('Failed to generate questions for', domainName, error);
      // Use fallback questions
      setCustomQuestions(prev => ({ 
        ...prev, 
        [domainName]: [
          `How did you progress in ${domainName} today?`,
          `What was your biggest win in ${domainName}?`,
          `What challenges did you face in ${domainName}?`,
          `How can you improve ${domainName} tomorrow?`
        ]
      }));
    } finally {
      setIsGeneratingQuestions(prev => ({ ...prev, [domainName]: false }));
    }
  };

  const getQuestionsForDomain = (domain: string) => {
    // Check if it's a standard domain
    if (domainQuestions[domain as keyof typeof domainQuestions]) {
      return domainQuestions[domain as keyof typeof domainQuestions];
    }
    
    // Check if it's a custom domain
    if (customQuestions[domain]) {
      return customQuestions[domain];
    }
    
    // Generate questions for custom domain if not already done
    if (!isGeneratingQuestions[domain]) {
      generateQuestionsForCustomDomain(domain);
    }
    
    // Return loading questions
    return [
      "Loading questions...",
      "Please wait...",
      "Generating personalized questions...",
      "Almost ready..."
    ];
  };

  const handleSave = () => {
    const progress: DailyProgressData = {
      date: new Date().toISOString().split('T')[0],
      domainScores,
      notes,
      mood,
      energy,
      focus
    };
    onSaveProgress(progress);
    setIsOpen(false);
    // Reset form
    setDomainScores({
      Health: 7,
      Focus: 7,
      Output: 7,
      Learning: 7,
      Mood: 7
    });
    setNotes('');
    setMood(7);
    setEnergy(7);
    setFocus(7);
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-50';
    if (score >= 6) return 'text-blue-600 bg-blue-50';
    if (score >= 4) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="w-full">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all text-left"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Log Today&apos;s Progress</h3>
              <p className="text-sm text-gray-500">Record your daily metrics and track momentum</p>
            </div>
            <Plus className="w-5 h-5 text-gray-400 ml-auto" />
          </div>
        </button>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Daily Progress Log</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <Minus className="w-5 h-5" />
            </button>
          </div>

          {/* Domain Tabs */}
          <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
            {domains.map((domain) => (
              <button
                key={domain}
                onClick={() => setCurrentDomain(domain)}
                className={cn(
                  "flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  currentDomain === domain
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                {domain}
              </button>
            ))}
          </div>

          {/* Current Domain Score */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">{currentDomain} Score</h4>
              <span className={cn(
                "px-3 py-1 rounded-full text-sm font-medium",
                getScoreColor(domainScores[currentDomain])
              )}>
                {domainScores[currentDomain]}/10
              </span>
            </div>
            
            {/* Score Slider */}
            <div className="space-y-3">
              <input
                type="range"
                min="1"
                max="10"
                value={domainScores[currentDomain]}
                onChange={(e) => handleScoreChange(currentDomain, parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Poor</span>
                <span>Good</span>
                <span>Excellent</span>
              </div>
            </div>

            {/* Domain-specific questions */}
            <div className="mt-4 space-y-2">
              {isGeneratingQuestions[currentDomain] && (
                <div className="flex items-center space-x-2 text-sm text-purple-600 mb-2">
                  <Sparkles className="w-3 h-3 animate-pulse" />
                  <span>Generating personalized questions...</span>
                </div>
              )}
              {getQuestionsForDomain(currentDomain).map((question, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                  <Target className="w-3 h-3 text-gray-400" />
                  <span>{question}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Overall Metrics */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mood</label>
              <input
                type="range"
                min="1"
                max="10"
                value={mood}
                onChange={(e) => setMood(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-center text-sm font-medium mt-1">{mood}/10</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Energy</label>
              <input
                type="range"
                min="1"
                max="10"
                value={energy}
                onChange={(e) => setEnergy(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-center text-sm font-medium mt-1">{energy}/10</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Focus</label>
              <input
                type="range"
                min="1"
                max="10"
                value={focus}
                onChange={(e) => setFocus(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-center text-sm font-medium mt-1">{focus}/10</div>
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional thoughts about today..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleSave}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Save Progress
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

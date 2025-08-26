'use client';

import { useState } from 'react';
import { Domain } from '@/types';
import { cn } from '@/lib/utils';
import { 
  Zap, 
  Target, 
  TrendingUp, 
  Heart, 
  Brain, 
  Users, 
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  Plus
} from 'lucide-react';
import { generateMomentumLoops, generateCustomFocusArea } from '@/lib/together-ai';

interface OnboardingProps {
  onComplete: (config: UserConfig) => void;
}

export interface UserConfig {
  momentumDefinition: 'speed' | 'direction' | 'consistency' | 'energy' | 'compound';
  energyAnchors: {
    physical: string[];
    mental: string[];
    cultural: string[];
  };
  momentumLoops: {
    career: string;
    culture: string;
    growth: string;
  };
  currentPhase: 'early' | 'sustained' | 'transition';
  focusAreas: (Domain | string)[];
  customFocusAreas: Array<{
    name: string;
    description: string;
    metrics: string[];
    color: string;
  }>;
  goals: {
    shortTerm: string;
    mediumTerm: string;
    longTerm: string;
  };
  energyDrains: string[];
}

const momentumDefinitions = [
  {
    id: 'speed',
    title: 'Speed of Change',
    description: 'Fast-paced progress and rapid shifts',
    icon: Zap,
    color: 'text-orange-600'
  },
  {
    id: 'direction',
    title: 'Direction & Purpose',
    description: 'Clear path toward meaningful goals',
    icon: Target,
    color: 'text-blue-600'
  },
  {
    id: 'consistency',
    title: 'Consistency & Rhythm',
    description: 'Steady progress through daily habits',
    icon: TrendingUp,
    color: 'text-green-600'
  },
  {
    id: 'energy',
    title: 'Energy & Vitality',
    description: 'What energizes and sustains you',
    icon: Heart,
    color: 'text-red-600'
  },
  {
    id: 'compound',
    title: 'Compound Effects',
    description: 'Small actions that multiply over time',
    icon: TrendingUp,
    color: 'text-purple-600'
  }
];

const energyAnchorOptions = {
  physical: [
    'Daily training/exercise',
    'Morning light walks',
    'Quality nutrition',
    'Sleep optimization',
    'Movement breaks',
    'Outdoor activities'
  ],
  mental: [
    'Journaling wins',
    'Weekly momentum check',
    'Meditation/mindfulness',
    'Reading time',
    'Creative expression',
    'Learning new skills'
  ],
  cultural: [
    'New café/restaurant weekly',
    'Art galleries/museums',
    'Local events/meetups',
    'Travel experiences',
    'Cultural activities',
    'Social connections'
  ]
};

const phaseDescriptions = {
  early: {
    title: 'Early Stage Momentum',
    description: 'Novelty, adrenaline, rapid change',
    characteristics: ['New environments', 'Learning curves', 'High energy', 'Exploration']
  },
  sustained: {
    title: 'Sustained Momentum',
    description: 'Structure, habits, compound effects',
    characteristics: ['Established routines', 'Deep focus', 'Consistent progress', 'Mastery building']
  },
  transition: {
    title: 'Transition Phase',
    description: 'Between peaks, recalibrating',
    characteristics: ['Reflection', 'Planning', 'Energy conservation', 'Next phase prep']
  }
};

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<UserConfig>({
    momentumDefinition: 'consistency',
    energyAnchors: {
      physical: [],
      mental: [],
      cultural: []
    },
    momentumLoops: {
      career: '',
      culture: '',
      growth: ''
    },
    currentPhase: 'sustained',
    focusAreas: ['Health', 'Focus', 'Output'],
    customFocusAreas: [],
    goals: {
      shortTerm: '',
      mediumTerm: '',
      longTerm: ''
    },
    energyDrains: []
  });

  const [isGeneratingLoops, setIsGeneratingLoops] = useState(false);
  const [showCustomFocusArea, setShowCustomFocusArea] = useState(false);
  const [customFocusDescription, setCustomFocusDescription] = useState('');
  const [isGeneratingCustomArea, setIsGeneratingCustomArea] = useState(false);

  const updateConfig = (updates: Partial<UserConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const toggleEnergyAnchor = (category: keyof UserConfig['energyAnchors'], item: string) => {
    setConfig(prev => ({
      ...prev,
      energyAnchors: {
        ...prev.energyAnchors,
        [category]: prev.energyAnchors[category].includes(item)
          ? prev.energyAnchors[category].filter(i => i !== item)
          : [...prev.energyAnchors[category], item]
      }
    }));
  };

  const toggleFocusArea = (domain: Domain) => {
    setConfig(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(domain)
        ? prev.focusAreas.filter(d => d !== domain)
        : [...prev.focusAreas, domain]
    }));
  };

  const generateAILoops = async () => {
    setIsGeneratingLoops(true);
    try {
      const allEnergyAnchors = [
        ...config.energyAnchors.physical,
        ...config.energyAnchors.mental,
        ...config.energyAnchors.cultural
      ];
      
      const loops = await generateMomentumLoops(
        config.momentumDefinition,
        allEnergyAnchors,
        config.currentPhase,
        config.focusAreas.map(f => f.toString())
      );
      
      setConfig(prev => ({
        ...prev,
        momentumLoops: loops
      }));
    } catch (error) {
      console.error('Failed to generate loops:', error);
    } finally {
      setIsGeneratingLoops(false);
    }
  };

  const generateCustomArea = async () => {
    if (!customFocusDescription.trim()) return;
    
    setIsGeneratingCustomArea(true);
    try {
      const customArea = await generateCustomFocusArea(
        customFocusDescription,
        config.focusAreas.map(f => f.toString())
      );
      
      setConfig(prev => ({
        ...prev,
        focusAreas: [...prev.focusAreas, customArea.name],
        customFocusAreas: [...prev.customFocusAreas, customArea]
      }));
      
      setCustomFocusDescription('');
      setShowCustomFocusArea(false);
    } catch (error) {
      console.error('Failed to generate custom area:', error);
    } finally {
      setIsGeneratingCustomArea(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">How do you define momentum?</h2>
              <p className="text-gray-600">Choose the definition that resonates most with your current phase</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {momentumDefinitions.map((def) => {
                const Icon = def.icon;
                return (
                  <button
                    key={def.id}
                    onClick={() => updateConfig({ momentumDefinition: def.id as UserConfig['momentumDefinition'] })}
                    className={cn(
                      "p-6 border-2 rounded-lg text-left transition-all",
                      config.momentumDefinition === def.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <Icon className={cn("w-6 h-6", def.color)} />
                      <h3 className="font-semibold text-gray-900">{def.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{def.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">What energizes you?</h2>
              <p className="text-gray-600">Select activities that give you energy and sustain momentum</p>
            </div>
            
            <div className="space-y-6">
              {Object.entries(energyAnchorOptions).map(([category, options]) => (
                <div key={category}>
                  <h3 className="font-semibold text-gray-900 mb-3 capitalize flex items-center space-x-2">
                    {category === 'physical' && <Heart className="w-5 h-5 text-red-500" />}
                    {category === 'mental' && <Brain className="w-5 h-5 text-blue-500" />}
                    {category === 'cultural' && <Users className="w-5 h-5 text-green-500" />}
                    <span>{category} Anchors</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {options.map((option) => (
                      <button
                        key={option}
                        onClick={() => toggleEnergyAnchor(category as keyof UserConfig['energyAnchors'], option)}
                        className={cn(
                          "p-3 text-sm border rounded-md transition-all text-left",
                          config.energyAnchors[category as keyof UserConfig['energyAnchors']].includes(option)
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-200 hover:border-gray-300"
                        )}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Create your momentum loops</h2>
              <p className="text-gray-600">Design small systems that feed back into each other</p>
            </div>

            {/* AI Generation Button */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    <span>AI-Powered Loop Generation</span>
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Let AI create personalized momentum loops based on your preferences
                  </p>
                </div>
                <button
                  onClick={generateAILoops}
                  disabled={isGeneratingLoops}
                  className={cn(
                    "px-4 py-2 rounded-md font-medium transition-colors",
                    isGeneratingLoops
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  )}
                >
                  {isGeneratingLoops ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Generating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Loops</span>
                    </div>
                  )}
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Career & Money Loop
                </label>
                <textarea
                  value={config.momentumLoops.career}
                  onChange={(e) => updateConfig({ 
                    momentumLoops: { ...config.momentumLoops, career: e.target.value }
                  })}
                  placeholder="e.g., Weekly review of 1 new AI tool → test in work → share insight internally"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Culture & People Loop
                </label>
                <textarea
                  value={config.momentumLoops.culture}
                  onChange={(e) => updateConfig({ 
                    momentumLoops: { ...config.momentumLoops, culture: e.target.value }
                  })}
                  placeholder="e.g., One new café per week → post reflection → connect with locals"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Self-Growth Loop
                </label>
                <textarea
                  value={config.momentumLoops.growth}
                  onChange={(e) => updateConfig({ 
                    momentumLoops: { ...config.momentumLoops, growth: e.target.value }
                  })}
                  placeholder="e.g., Weekly skill-up hour → document → share learnings"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">What phase are you in?</h2>
              <p className="text-gray-600">Understanding your current phase helps tailor momentum strategies</p>
            </div>
            
            <div className="space-y-4">
              {Object.entries(phaseDescriptions).map(([phase, desc]) => (
                <button
                  key={phase}
                  onClick={() => updateConfig({ currentPhase: phase as UserConfig['currentPhase'] })}
                  className={cn(
                    "w-full p-6 border-2 rounded-lg text-left transition-all",
                    config.currentPhase === phase
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <h3 className="font-semibold text-gray-900 mb-2">{desc.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{desc.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {desc.characteristics.map((char) => (
                      <span key={char} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {char}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Focus Areas</h2>
              <p className="text-gray-600">Select the domains that matter most to your momentum right now</p>
            </div>
            
            {/* Standard Focus Areas */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {(['Health', 'Focus', 'Output', 'Learning', 'Mood'] as Domain[]).map((domain) => (
                <button
                  key={domain}
                  onClick={() => toggleFocusArea(domain)}
                  className={cn(
                    "p-4 border-2 rounded-lg text-center transition-all",
                    config.focusAreas.includes(domain)
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <div className="font-medium text-gray-900">{domain}</div>
                  {config.focusAreas.includes(domain) && (
                    <Check className="w-5 h-5 text-blue-500 mx-auto mt-2" />
                  )}
                </button>
              ))}
            </div>

            {/* Custom Focus Areas */}
            {config.customFocusAreas.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Custom Focus Areas</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {config.customFocusAreas.map((customArea) => (
                    <div
                      key={customArea.name}
                      className="p-4 border-2 rounded-lg text-center transition-all border-purple-500 bg-purple-50"
                    >
                      <div className="font-medium text-gray-900">{customArea.name}</div>
                      <div className="text-xs text-gray-600 mt-1">{customArea.description}</div>
                      <Check className="w-5 h-5 text-purple-500 mx-auto mt-2" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add Custom Focus Area */}
            {!showCustomFocusArea ? (
              <button
                onClick={() => setShowCustomFocusArea(true)}
                className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors text-center"
              >
                <div className="flex items-center justify-center space-x-2">
                  <Plus className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">Add Custom Focus Area</span>
                </div>
              </button>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-medium text-gray-900 mb-3">Create Custom Focus Area</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Describe what you want to track
                    </label>
                    <textarea
                      value={customFocusDescription}
                      onChange={(e) => setCustomFocusDescription(e.target.value)}
                      placeholder="e.g., I want to track my creative projects and artistic growth"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={generateCustomArea}
                      disabled={isGeneratingCustomArea || !customFocusDescription.trim()}
                      className={cn(
                        "flex-1 px-4 py-2 rounded-md font-medium transition-colors",
                        isGeneratingCustomArea || !customFocusDescription.trim()
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-purple-600 text-white hover:bg-purple-700"
                      )}
                    >
                      {isGeneratingCustomArea ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Generating...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <Sparkles className="w-4 h-4" />
                          <span>Generate with AI</span>
                        </div>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setShowCustomFocusArea(false);
                        setCustomFocusDescription('');
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Goals</h2>
              <p className="text-gray-600">Define your momentum milestones</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short-term (30 days)
                </label>
                <input
                  type="text"
                  value={config.goals.shortTerm}
                  onChange={(e) => updateConfig({ 
                    goals: { ...config.goals, shortTerm: e.target.value }
                  })}
                  placeholder="e.g., Establish morning routine"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medium-term (3 months)
                </label>
                <input
                  type="text"
                  value={config.goals.mediumTerm}
                  onChange={(e) => updateConfig({ 
                    goals: { ...config.goals, mediumTerm: e.target.value }
                  })}
                  placeholder="e.g., Launch side project beta"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Long-term (1 year)
                </label>
                <input
                  type="text"
                  value={config.goals.longTerm}
                  onChange={(e) => updateConfig({ 
                    goals: { ...config.goals, longTerm: e.target.value }
                  })}
                  placeholder="e.g., Career transition complete"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Step {step} of 6</span>
            <span>{Math.round((step / 6) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 6) * 100}%` }}
            />
          </div>
        </div>

        {/* Step content */}
        {renderStep()}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className={cn(
              "flex items-center space-x-2 px-4 py-2 rounded-md transition-colors",
              step === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          {step < 6 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => onComplete(config)}
              className="flex items-center space-x-2 bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              <span>Complete Setup</span>
              <Check className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

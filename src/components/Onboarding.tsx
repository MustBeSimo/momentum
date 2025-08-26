'use client';

import { useState } from 'react';
import { Domain, Phase } from '@/types';
import { cn } from '@/lib/utils';
import { 
  Zap, 
  Target, 
  TrendingUp, 
  Heart, 
  Brain, 
  Users, 
  DollarSign, 
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Check
} from 'lucide-react';

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
  focusAreas: Domain[];
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
    goals: {
      shortTerm: '',
      mediumTerm: '',
      longTerm: ''
    },
    energyDrains: []
  });

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
                    onClick={() => updateConfig({ momentumDefinition: def.id as any })}
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
                        onClick={() => toggleEnergyAnchor(category as any, option)}
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
                  onClick={() => updateConfig({ currentPhase: phase as any })}
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

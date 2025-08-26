'use client';


import { UserConfig } from './Onboarding';

import { 
  Zap, 
  Target, 
  TrendingUp, 
  Heart, 
  Users, 
  ArrowRight,
  CheckCircle,
  Clock,
  Star
} from 'lucide-react';

interface PersonalizedDashboardProps {
  userConfig: UserConfig;
  onViewChange?: (view: string) => void;
}

const momentumDefinitionIcons = {
  speed: Zap,
  direction: Target,
  consistency: TrendingUp,
  energy: Heart,
  compound: TrendingUp
};

const phaseInsights = {
  early: {
    title: 'Early Stage Momentum',
    focus: 'Exploration & Learning',
    tips: [
      'Embrace the learning curve',
      'Try new things quickly',
      'Build foundational habits',
      'Connect with new communities'
    ]
  },
  sustained: {
    title: 'Sustained Momentum',
    focus: 'Consistency & Mastery',
    tips: [
      'Deepen existing practices',
      'Optimize your systems',
      'Build compound effects',
      'Mentor others'
    ]
  },
  transition: {
    title: 'Transition Phase',
    focus: 'Reflection & Planning',
    tips: [
      'Review what&apos;s working',
      'Plan your next phase',
      'Conserve energy',
      'Prepare for new challenges'
    ]
  }
};

export default function PersonalizedDashboard({ 
  userConfig, 
  onViewChange 
}: PersonalizedDashboardProps) {


  const getMomentumDefinitionIcon = () => {
    const Icon = momentumDefinitionIcons[userConfig.momentumDefinition];
    return <Icon className="w-5 h-5" />;
  };

  const getPhaseInsight = () => {
    return phaseInsights[userConfig.currentPhase];
  };

  const getPersonalizedInsights = () => {
    const insights = [];
    
    // Based on momentum definition
    if (userConfig.momentumDefinition === 'energy') {
      insights.push({
        type: 'energy',
        title: 'Energy-First Approach',
        message: 'Focus on activities that energize you rather than drain you',
        action: 'Review your energy anchors',
        onClick: () => onViewChange?.('progress')
      });
    }
    
    if (userConfig.momentumDefinition === 'consistency') {
      insights.push({
        type: 'consistency',
        title: 'Consistency Over Intensity',
        message: 'Small daily actions compound more than occasional big pushes',
        action: 'Check your streaks',
        onClick: () => onViewChange?.('streaks')
      });
    }

    // Add phase-specific insight
    insights.push({
      type: 'phase',
      title: getPhaseInsight().title,
      message: `Focus: ${getPhaseInsight().focus}`,
      action: 'View phase-specific tips',
      onClick: () => onViewChange?.('tips')
    });

    // Add momentum loop insights (only if not empty)
    if (userConfig.momentumLoops.career && userConfig.momentumLoops.career.trim()) {
      insights.push({
        type: 'loop',
        title: 'Career Loop Active',
        message: userConfig.momentumLoops.career,
        action: 'Track progress',
        onClick: () => onViewChange?.('daily-progress-log')
      });
    }

    if (userConfig.momentumLoops.culture && userConfig.momentumLoops.culture.trim()) {
      insights.push({
        type: 'loop',
        title: 'Culture Loop Active',
        message: userConfig.momentumLoops.culture,
        action: 'Track progress',
        onClick: () => onViewChange?.('daily-progress-log')
      });
    }

    if (userConfig.momentumLoops.growth && userConfig.momentumLoops.growth.trim()) {
      insights.push({
        type: 'loop',
        title: 'Growth Loop Active',
        message: userConfig.momentumLoops.growth,
        action: 'Track progress',
        onClick: () => onViewChange?.('daily-progress-log')
      });
    }

    return insights;
  };

  const getEnergyAnchorSummary = () => {
    const total = Object.values(userConfig.energyAnchors).flat().length;
    const categories = Object.keys(userConfig.energyAnchors).filter(
      cat => userConfig.energyAnchors[cat as keyof typeof userConfig.energyAnchors].length > 0
    );
    
    return {
      total,
      categories,
      primaryCategory: categories[0] || 'physical'
    };
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Momentum Flow Infographic */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Your Momentum Flow</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Energy Input */}
          <div className="bg-white rounded-lg p-4 border border-blue-200 shadow-sm">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Energy Input</div>
                <div className="text-sm text-blue-600 font-medium">{getEnergyAnchorSummary().total} anchors</div>
              </div>
            </div>
            <div className="space-y-2">
              {Object.entries(userConfig.energyAnchors).map(([category, anchors]) => 
                anchors.length > 0 ? (
                  <div key={category} className="text-xs text-gray-600">
                    <span className="font-medium capitalize">{category}:</span> {anchors.slice(0, 2).join(', ')}
                    {anchors.length > 2 && ` +${anchors.length - 2} more`}
                  </div>
                ) : null
              )}
            </div>
          </div>

          {/* Focus Areas */}
          <div className="bg-white rounded-lg p-4 border border-green-200 shadow-sm">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Focus Areas</div>
                <div className="text-sm text-green-600 font-medium">{userConfig.focusAreas.length} domains</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {userConfig.focusAreas.slice(0, 4).map((area, index) => (
                <span key={index} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  {area}
                </span>
              ))}
              {userConfig.focusAreas.length > 4 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{userConfig.focusAreas.length - 4}
                </span>
              )}
            </div>
          </div>

          {/* Momentum Output */}
          <div className="bg-white rounded-lg p-4 border border-purple-200 shadow-sm">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Momentum Output</div>
                <div className="text-sm text-purple-600 font-medium">{Object.values(userConfig.momentumLoops).filter(loop => loop.trim()).length} loops</div>
              </div>
            </div>
            <div className="space-y-2">
              {Object.entries(userConfig.momentumLoops).map(([type, loop]) => 
                loop.trim() ? (
                  <div key={type} className="text-xs text-gray-600">
                    <span className="font-medium capitalize">{type}:</span> {loop.split('→')[0].trim()}
                  </div>
                ) : null
              )}
            </div>
          </div>
        </div>
        
        {/* Flow Visualization */}
        <div className="mt-6 flex justify-center">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-green-500 rounded-full"></div>
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
            <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-purple-500 rounded-full"></div>
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Personalized Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-center space-x-3 mb-4">
          {getMomentumDefinitionIcon()}
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Your Momentum: {userConfig.momentumDefinition.charAt(0).toUpperCase() + userConfig.momentumDefinition.slice(1)}
            </h2>
            <p className="text-gray-600">
              Phase: {getPhaseInsight().title}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-2 mb-2">
              <Heart className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-gray-700">Energy Anchors</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {getEnergyAnchorSummary().total}
            </div>
            <div className="text-xs text-gray-500">
              {getEnergyAnchorSummary().categories.join(', ')}
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-700">Focus Areas</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {userConfig.focusAreas.length}
            </div>
            <div className="text-xs text-gray-500">
              Active domains
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-gray-700">Momentum Loops</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {Object.values(userConfig.momentumLoops).filter(loop => loop.trim()).length}
            </div>
            <div className="text-xs text-gray-500">
              Active systems
            </div>
          </div>
        </div>
      </div>

      {/* Personalized Insights */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Personalized Insights</h3>
          <button
            onClick={() => onViewChange?.('tips')}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            View All Tips
          </button>
        </div>
        
        <div className="space-y-3">
          {getPersonalizedInsights().map((insight, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                {insight.type === 'energy' && <Heart className="w-4 h-4 text-red-500" />}
                {insight.type === 'consistency' && <TrendingUp className="w-4 h-4 text-green-500" />}
                {insight.type === 'phase' && <Target className="w-4 h-4 text-blue-500" />}
                {insight.type === 'loop' && <ArrowRight className="w-4 h-4 text-purple-500" />}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 text-sm">{insight.title}</h4>
                <p className="text-xs text-gray-600 mt-1">{insight.message}</p>
                <button 
                  onClick={insight.onClick}
                  className="text-xs text-blue-600 hover:text-blue-800 mt-2"
                >
                  {insight.action} →
                </button>
              </div>
            </div>
          ))}
        </div>


      </div>

      {/* Goals Progress */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Goals</h3>
        <div className="space-y-4">
          {Object.entries(userConfig.goals).map(([period, goal]) => {
            if (!goal.trim()) return null;
            
            const periodLabels = {
              shortTerm: '30 Days',
              mediumTerm: '3 Months',
              longTerm: '1 Year'
            };
            
            return (
              <div key={period} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Clock className="w-4 h-4 text-gray-400" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{goal}</div>
                  <div className="text-xs text-gray-500">{periodLabels[period as keyof typeof periodLabels]}</div>
                </div>
                <button 
                  onClick={() => onViewChange?.('daily-progress-log')}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Track →
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prominent Daily Progress Check-in */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-200 p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to Log Your Progress?</h3>
          <p className="text-gray-600 mb-6">Track your momentum across {userConfig.focusAreas.length} focus areas and keep your flow going</p>
                          <button 
                  onClick={() => onViewChange?.('daily-progress-log')}
                  className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg shadow-lg"
                >
            📊 Log Today&apos;s Progress
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {userConfig.focusAreas.slice(0, 4).map((area, index) => (
            <div key={index} className="bg-white rounded-lg p-3 border border-green-100 shadow-sm">
              <div className="text-sm font-semibold text-gray-900">{area}</div>
              <div className="text-xs text-gray-500">Ready to track</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions Based on Config */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button 
            onClick={() => onViewChange?.('tasks')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-4 h-4 text-blue-500" />
              <span className="font-medium text-gray-900">Add Task</span>
            </div>
            <div className="text-sm text-gray-500">Create new tracking goal</div>
          </button>
          
          <button 
            onClick={() => onViewChange?.('review')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center space-x-2 mb-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="font-medium text-gray-900">Weekly Review</span>
            </div>
            <div className="text-sm text-gray-500">AI-generated insights</div>
          </button>
          
          <button 
            onClick={() => onViewChange?.('career')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-4 h-4 text-green-500" />
              <span className="font-medium text-gray-900">Career Progress</span>
            </div>
            <div className="text-sm text-gray-500">Track your transition</div>
          </button>
        </div>
      </div>
    </div>
  );
}


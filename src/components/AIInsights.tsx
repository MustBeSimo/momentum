'use client';

import { MomentumScore } from '@/types';
import { analyzeMomentum } from '@/lib/ai';
import { Sparkles, TrendingUp, TrendingDown, Target } from 'lucide-react';

interface AIInsightsProps {
  momentumData: MomentumScore[];
}

export default function AIInsights({ momentumData }: AIInsightsProps) {
  const insights = analyzeMomentum(momentumData);
  
  if (insights.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">AI Insights</h2>
        </div>
        <p className="text-gray-500 text-sm">No insights available yet. Keep tracking your momentum to get personalized recommendations!</p>
      </div>
    );
  }

  const getInsightIcon = (type: 'positive' | 'negative' | 'neutral') => {
    switch (type) {
      case 'positive':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'negative':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Target className="w-4 h-4 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-green-500 bg-green-50';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Sparkles className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">AI Insights</h2>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
          {insights.length} insight{insights.length !== 1 ? 's' : ''}
        </span>
      </div>
      
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`border-l-4 p-3 rounded-r-md ${getPriorityColor(insight.priority)}`}
          >
            <div className="flex items-start space-x-2">
              {getInsightIcon(insight.type)}
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 text-sm">{insight.title}</h3>
                <p className="text-gray-600 text-xs mt-1">{insight.description}</p>
                {insight.action && (
                  <div className="mt-2">
                    <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                      {insight.action} →
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <Sparkles className="w-3 h-3" />
          <span>AI analyzes your momentum patterns to provide personalized insights</span>
        </div>
      </div>
    </div>
  );
}

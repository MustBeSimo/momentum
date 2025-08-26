'use client';

import { CareerFunnel } from '@/types';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus, ArrowRight, Users, MessageSquare, Calendar, Award } from 'lucide-react';

interface CareerBoardProps {
  funnelData: CareerFunnel[];
}

const stageIcons = {
  Outreach: Users,
  Replies: MessageSquare,
  Interviews: Calendar,
  Offers: Award,
};

const stageColors = {
  Outreach: 'bg-blue-500',
  Replies: 'bg-green-500',
  Interviews: 'bg-yellow-500',
  Offers: 'bg-purple-500',
};

export default function CareerBoard({ funnelData }: CareerBoardProps) {
  const stages = ['Outreach', 'Replies', 'Interviews', 'Offers'];
  
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Career Board</h2>
        <div className="text-sm text-gray-500">Funnel Velocity</div>
      </div>

      <div className="space-y-4">
        {stages.map((stage, index) => {
          const data = funnelData.find(d => d.stage === stage);
          const Icon = stageIcons[stage as keyof typeof stageIcons];
          const color = stageColors[stage as keyof typeof stageColors];
          
          if (!data) return null;
          
          const { count, velocity, conversionToNext } = data;
          const nextStage = stages[index + 1];
          
          return (
            <div key={stage} className="relative">
              {/* Stage Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  {/* Stage Info */}
                  <div className="flex items-center space-x-3">
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", color)}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{stage}</h3>
                      <p className="text-sm text-gray-500">
                        {count} {stage.toLowerCase()}
                      </p>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="flex items-center space-x-6">
                    {/* Velocity */}
                    <div className="text-center">
                      <div className="flex items-center space-x-1">
                        {velocity > 0.1 ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : velocity < -0.1 ? (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        ) : (
                          <Minus className="w-4 h-4 text-gray-400" />
                        )}
                        <span className="text-sm font-medium text-gray-900">
                          {velocity > 0 ? '+' : ''}{velocity.toFixed(1)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">per week</div>
                    </div>

                    {/* Conversion Rate */}
                    {nextStage && (
                      <div className="text-center">
                        <div className="text-sm font-medium text-gray-900">
                          {(conversionToNext * 100).toFixed(0)}%
                        </div>
                        <div className="text-xs text-gray-500">to {nextStage}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{count} total</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={cn("h-2 rounded-full transition-all duration-300", color)}
                      style={{ width: `${Math.min(100, (count / 50) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Arrow to next stage */}
              {index < stages.length - 1 && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <ArrowRight className="w-6 h-6 text-gray-400 rotate-90" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">
            {funnelData.reduce((sum, d) => sum + d.count, 0)}
          </div>
          <div className="text-xs text-gray-500">Total Activity</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">
            {funnelData.filter(d => d.velocity > 0).length}
          </div>
          <div className="text-xs text-gray-500">Growing Stages</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">
            {funnelData
              .filter(d => d.stage !== 'Offers')
              .reduce((avg, d) => avg + d.conversionToNext, 0) / 
              Math.max(1, funnelData.filter(d => d.stage !== 'Offers').length) * 100
            }
          </div>
          <div className="text-xs text-gray-500">Avg Conversion %</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex space-x-2">
        <button className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
          Add Outreach
        </button>
        <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors">
          View Analytics
        </button>
      </div>
    </div>
  );
}

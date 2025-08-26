'use client';

import { MomentumScore, Domain } from '@/types';
import { getDomainColor, getPhaseColor, formatMomentumScore } from '@/lib/momentum';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus, MoreVertical, Target, BarChart3 } from 'lucide-react';

interface LeaderboardProps {
  momentumData: MomentumScore[];
  onDomainClick?: (domain: Domain) => void;
  onViewDetails?: (domain: Domain) => void;
}

export default function Leaderboard({ momentumData, onDomainClick, onViewDetails }: LeaderboardProps) {
  // Sort by velocity descending
  const sortedData = [...momentumData].sort((a, b) => b.velocity - a.velocity);
  
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Leaderboard</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <TrendingUp className="w-4 h-4" />
          <span>Sorted by Velocity</span>
        </div>
      </div>
      
      <div className="space-y-2">
        {sortedData.map((data, index) => {
          const { domain, ema, velocity, acceleration, streak, momentumScore, phase } = data;
          const domainColor = getDomainColor(domain);
          const phaseColor = getPhaseColor(phase);
          
          return (
            <div
              key={domain}
              className={cn(
                "group relative bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-all",
                "flex items-center justify-between"
              )}
            >
              {/* Rank and Domain */}
              <div className="flex items-center space-x-3">
                <div className="flex flex-col items-center">
                  <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: domainColor }}
                  />
                </div>
                
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">{domain}</span>
                  <div className="flex items-center space-x-2">
                    <span 
                      className="text-xs px-2 py-1 rounded-full text-white font-medium"
                      style={{ backgroundColor: phaseColor }}
                    >
                      {phase}
                    </span>
                    <span className="text-xs text-gray-500">
                      {streak} day{streak !== 1 ? 's' : ''} streak
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Metrics */}
              <div className="flex items-center space-x-6">
                {/* EMA */}
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-900">
                    {ema.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-500">EMA</div>
                </div>
                
                {/* Velocity */}
                <div className="text-center">
                  <div className="flex items-center space-x-1">
                    {velocity > 0.05 ? (
                      <TrendingUp className="w-3 h-3 text-green-500" />
                    ) : velocity < -0.05 ? (
                      <TrendingDown className="w-3 h-3 text-red-500" />
                    ) : (
                      <Minus className="w-3 h-3 text-gray-400" />
                    )}
                    <span className="text-sm font-medium text-gray-900">
                      {velocity > 0 ? '+' : ''}{velocity.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">Velocity</div>
                </div>
                
                {/* Acceleration */}
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-900">
                    {acceleration > 0 ? '+' : ''}{acceleration.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">Accel</div>
                </div>
                
                {/* Momentum Score */}
                <div className="text-center">
                  <div className="flex items-center space-x-1">
                    <span className="text-lg">{formatMomentumScore(momentumScore)}</span>
                    <span className="text-sm font-bold text-gray-900">
                      {momentumScore.toFixed(0)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">Score</div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onViewDetails?.(domain)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  title="View Details"
                >
                  <BarChart3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDomainClick?.(domain)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Quick Actions"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">
            {sortedData.filter(d => d.velocity > 0).length}
          </div>
          <div className="text-xs text-gray-500">Ramping</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">
            {sortedData.filter(d => d.phase === 'Cruise').length}
          </div>
          <div className="text-xs text-gray-500">Cruising</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">
            {sortedData.filter(d => d.phase === 'Drift' || d.phase === 'Archive').length}
          </div>
          <div className="text-xs text-gray-500">Needs Attention</div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { Domain, MomentumScore } from '@/types';
import { getDomainColor, getPhaseColor, formatMomentumScore } from '@/lib/momentum';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MomentumRibbonProps {
  momentumData: MomentumScore[];
  onDomainClick?: (domain: Domain) => void;
}

export default function MomentumRibbon({ momentumData, onDomainClick }: MomentumRibbonProps) {
  const domains: Domain[] = ['Health', 'Focus', 'Output', 'Learning', 'Mood'];
  
  return (
    <div className="w-full space-y-2">
      <h2 className="text-lg font-semibold text-gray-900">Momentum Ribbon</h2>
      <div className="space-y-3">
        {domains.map((domain) => {
          const data = momentumData.find(d => d.domain === domain);
          if (!data) return null;
          
          const { velocity, momentumScore, phase } = data;
          const domainColor = getDomainColor(domain);
          const phaseColor = getPhaseColor(phase);
          
          return (
            <div
              key={domain}
              className={cn(
                "group relative h-16 rounded-lg border-2 border-gray-200 bg-white p-4 cursor-pointer transition-all hover:shadow-md",
                "flex items-center justify-between"
              )}
              onClick={() => onDomainClick?.(domain)}
              style={{ borderLeftColor: domainColor, borderLeftWidth: '4px' }}
            >
              {/* Domain Info */}
              <div className="flex items-center space-x-3">
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">{domain}</span>
                  <div className="flex items-center space-x-2">
                    <span 
                      className="text-xs px-2 py-1 rounded-full text-white font-medium"
                      style={{ backgroundColor: phaseColor }}
                    >
                      {phase}
                    </span>
                    <span className="text-2xl">{formatMomentumScore(momentumScore)}</span>
                  </div>
                </div>
              </div>
              
              {/* Momentum Indicators */}
              <div className="flex items-center space-x-4">
                {/* Velocity Indicator */}
                <div className="flex items-center space-x-1">
                  {velocity > 0.05 ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : velocity < -0.05 ? (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  ) : (
                    <Minus className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="text-sm text-gray-600">
                    {velocity > 0 ? '+' : ''}{velocity.toFixed(2)}
                  </span>
                </div>
                
                {/* Momentum Score */}
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">
                    {momentumScore.toFixed(0)}
                  </div>
                  <div className="text-xs text-gray-500">momentum</div>
                </div>
              </div>
              
              {/* Hover Effect */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

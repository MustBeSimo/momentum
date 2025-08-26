'use client';

import { WeeklyReview as WeeklyReviewType, Domain, Phase } from '@/types';
import { generateWeeklyReview } from '@/lib/ai';
import { Calendar, TrendingUp, TrendingDown, Target, Download, Share2, Sparkles } from 'lucide-react';

interface WeeklyReviewProps {
  review: WeeklyReviewType;
  onExport?: (format: 'pdf' | 'png') => void;
  onShare?: () => void;
}

export default function WeeklyReview({ review, onExport, onShare }: WeeklyReviewProps) {
  const { week, domains, career, topDrivers, goalsNextWeek } = review;
  
  // Generate AI insights for this week
  const aiInsights = generateWeeklyReview(
    domains.map(d => ({
      domain: d.name as Domain,
      ema: d.ema,
      velocity: d.velocity,
      acceleration: d.acceleration,
      streak: d.streak,
      momentumScore: d.ema,
      phase: 'Cruise' as Phase
    })),
    [], // tasks would be passed here in a real implementation
    1 // week number
  );
  
  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Weekly Review</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onExport?.('pdf')}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Export PDF"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={onShare}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Week Info */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="font-medium text-blue-900">Week of {week}</h3>
        <p className="text-sm text-blue-700">AI-generated momentum analysis</p>
      </div>

      {/* AI Summary */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
        <div className="flex items-center space-x-2 mb-3">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h3 className="font-medium text-purple-900">AI Summary</h3>
        </div>
        <p className="text-sm text-purple-800 mb-3">{aiInsights.summary}</p>
        
        {aiInsights.highlights.length > 0 && (
          <div className="mb-3">
            <h4 className="text-xs font-medium text-purple-700 mb-1">Highlights:</h4>
            <ul className="text-xs text-purple-600 space-y-1">
              {aiInsights.highlights.map((highlight, index) => (
                <li key={index} className="flex items-start space-x-1">
                  <span>•</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {aiInsights.recommendations.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-purple-700 mb-1">Recommendations:</h4>
            <ul className="text-xs text-purple-600 space-y-1">
              {aiInsights.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start space-x-1">
                  <span>→</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Momentum Summary */}
      <div className="space-y-4">
        <h3 className="text-md font-semibold text-gray-900">Momentum</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {domains.map((domain) => (
            <div
              key={domain.name}
              className="bg-white rounded-lg border border-gray-200 p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{domain.name}</span>
                <div className="flex items-center space-x-1">
                  {domain.velocity > 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-sm text-gray-600">
                    {domain.velocity > 0 ? '+' : ''}{domain.velocity.toFixed(2)}
                  </span>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 space-y-1">
                <div>EMA: {domain.ema.toFixed(1)}</div>
                <div>Acceleration: {domain.acceleration > 0 ? '+' : ''}{domain.acceleration.toFixed(2)}</div>
                <div>Streak: {domain.streak} days</div>
              </div>

              {/* Highlights/Issues */}
              {domain.highlights && domain.highlights.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="text-xs font-medium text-green-700 mb-1">Highlights:</div>
                  <ul className="text-xs text-green-600 space-y-1">
                    {domain.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start space-x-1">
                        <span>•</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {domain.issues && domain.issues.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="text-xs font-medium text-red-700 mb-1">Issues:</div>
                  <ul className="text-xs text-red-600 space-y-1">
                    {domain.issues.map((issue, index) => (
                      <li key={index} className="flex items-start space-x-1">
                        <span>•</span>
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Career Progress */}
      {career && (
        <div className="space-y-4">
          <h3 className="text-md font-semibold text-gray-900">Career Progress</h3>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-blue-600">{career.outreach}</div>
                <div className="text-xs text-gray-500">Outreach</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-600">{career.replies}</div>
                <div className="text-xs text-gray-500">Replies</div>
              </div>
              <div>
                <div className="text-lg font-bold text-yellow-600">{career.interviews}</div>
                <div className="text-xs text-gray-500">Interviews</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Drivers */}
      <div className="space-y-4">
        <h3 className="text-md font-semibold text-gray-900">What Drove It</h3>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <ul className="space-y-2">
            {topDrivers.map((driver, index) => (
              <li key={index} className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span className="text-gray-700">{driver}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Next Week Goals */}
      <div className="space-y-4">
        <h3 className="text-md font-semibold text-gray-900">Next Week</h3>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <ul className="space-y-3">
            {goalsNextWeek.map((goal, index) => (
              <li key={index} className="flex items-start space-x-3">
                <Target className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{goal}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
          Update Goals
        </button>
        <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors">
          Schedule Review
        </button>
      </div>
    </div>
  );
}

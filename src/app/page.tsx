'use client';

import { useState, useEffect } from 'react';
import { 
  MomentumScore, 
  CareerFunnel, 
  WeeklyReview as WeeklyReviewType,
  Domain,
  Task
} from '@/types';
import Layout from '@/components/Layout';
import MomentumRibbon from '@/components/MomentumRibbon';
import Leaderboard from '@/components/Leaderboard';
import TaskInbox from '@/components/TaskInbox';
import CareerBoard from '@/components/CareerBoard';
import WeeklyReview from '@/components/WeeklyReview';
import AIInsights from '@/components/AIInsights';
import DailyProgress, { DailyProgressData } from '@/components/DailyProgress';
import Onboarding, { UserConfig } from '@/components/Onboarding';
import PersonalizedDashboard from '@/components/PersonalizedDashboard';

// Sample data for demonstration
const sampleMomentumData: MomentumScore[] = [
  {
    domain: 'Health',
    ema: 0.8,
    velocity: 0.15,
    acceleration: 0.03,
    streak: 7,
    momentumScore: 85,
    phase: 'Cruise'
  },
  {
    domain: 'Focus',
    ema: 0.6,
    velocity: 0.25,
    acceleration: 0.08,
    streak: 3,
    momentumScore: 92,
    phase: 'Ramp'
  },
  {
    domain: 'Output',
    ema: 0.4,
    velocity: -0.05,
    acceleration: -0.02,
    streak: 1,
    momentumScore: 35,
    phase: 'Drift'
  },
  {
    domain: 'Learning',
    ema: 0.7,
    velocity: 0.12,
    acceleration: 0.01,
    streak: 5,
    momentumScore: 78,
    phase: 'Cruise'
  },
  {
    domain: 'Mood',
    ema: 0.9,
    velocity: 0.08,
    acceleration: -0.01,
    streak: 12,
    momentumScore: 88,
    phase: 'Cruise'
  }
];

const sampleCareerData: CareerFunnel[] = [
  {
    stage: 'Outreach',
    count: 24,
    velocity: 3.2,
    conversionToNext: 0.25
  },
  {
    stage: 'Replies',
    count: 6,
    velocity: 0.8,
    conversionToNext: 0.33
  },
  {
    stage: 'Interviews',
    count: 2,
    velocity: 0.3,
    conversionToNext: 0.5
  },
  {
    stage: 'Offers',
    count: 1,
    velocity: 0.1,
    conversionToNext: 0
  }
];

const sampleWeeklyReview: WeeklyReviewType = {
  week: 'August 18, 2025',
  domains: [
    {
      name: 'Output',
      ema: 0.8,
      velocity: 0.18,
      acceleration: 0.03,
      streak: 5,
      highlights: ['Launched case study', '3 posts shipped']
    },
    {
      name: 'Health',
      ema: -0.2,
      velocity: -0.09,
      acceleration: -0.02,
      streak: 2,
      issues: ['Late screens', 'Inconsistent bedtime']
    }
  ],
  career: {
    outreach: 14,
    replies: 4,
    interviews: 2
  },
  topDrivers: ['Deep-work +42m', 'Social scroll −27m'],
  goalsNextWeek: ['2 interviews booked', 'sleep ≥7h 5/7']
};

const domains: Domain[] = ['Health', 'Focus', 'Output', 'Learning', 'Mood'];

export default function Home() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userConfig, setUserConfig] = useState<UserConfig | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(true);

  const handleAddTask = (taskData: Omit<Task, 'id' | 'userId' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Math.random().toString(36).substr(2, 9),
      userId: 'user-1',
      createdAt: new Date()
    };
    setTasks([...tasks, newTask]);
  };

  const handleDomainClick = (domain: Domain) => {
    console.log('Domain clicked:', domain);
    // In a real app, this would navigate to domain detail view
  };

  const handleViewDetails = (domain: Domain) => {
    console.log('View details for:', domain);
    // In a real app, this would open a detailed view
  };

  const handleSaveProgress = (progress: DailyProgressData) => {
    console.log('Progress saved:', progress);
    // In a real app, this would save to a database
    // and update momentum calculations
  };

  const handleOnboardingComplete = (config: UserConfig) => {
    setUserConfig(config);
    setShowOnboarding(false);
    // In a real app, this would save to localStorage or database
    localStorage.setItem('userConfig', JSON.stringify(config));
  };

  // Load user config from localStorage on app start
  useEffect(() => {
    const savedConfig = localStorage.getItem('userConfig');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        setUserConfig(config);
        setShowOnboarding(false);
      } catch (error) {
        console.error('Failed to load user config:', error);
      }
    }
  }, []);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            {userConfig ? (
              <PersonalizedDashboard 
                userConfig={userConfig}
                momentumData={sampleMomentumData}
                onViewChange={setCurrentView}
              />
            ) : (
              <>
                {/* Header */}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                  <p className="text-gray-600 mt-2">Track your momentum across all life domains</p>
                </div>

                {/* Main content grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
                  {/* Left column - Momentum Ribbon */}
                  <div className="xl:col-span-2">
                    <MomentumRibbon 
                      momentumData={sampleMomentumData}
                      onDomainClick={handleDomainClick}
                    />
                  </div>

                  {/* Right column - Leaderboard */}
                  <div className="xl:col-span-1">
                    <Leaderboard 
                      momentumData={sampleMomentumData}
                      onDomainClick={handleDomainClick}
                      onViewDetails={handleViewDetails}
                    />
                  </div>
                </div>

                {/* AI Insights */}
                <AIInsights momentumData={sampleMomentumData} />
                
                {/* Daily Progress Input */}
                <DailyProgress 
                  domains={domains}
                  onSaveProgress={handleSaveProgress}
                />
                
                {/* Quick Actions */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <button 
                      onClick={() => setCurrentView('tasks')}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="font-medium text-gray-900">Add New Task</div>
                      <div className="text-sm text-gray-500">Create a new tracking goal</div>
                    </button>
                    <button 
                      onClick={() => setCurrentView('review')}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="font-medium text-gray-900">View Weekly Review</div>
                      <div className="text-sm text-gray-500">See your AI-generated summary</div>
                    </button>
                    <button 
                      onClick={() => setCurrentView('career')}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="font-medium text-gray-900">Career Progress</div>
                      <div className="text-sm text-gray-500">Track your career transition</div>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        );

      case 'tasks':
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Task Inbox</h1>
              <p className="text-gray-600 mt-2">Add and classify new tasks to track</p>
            </div>
            <TaskInbox onAddTask={handleAddTask} domains={domains} />
          </div>
        );

      case 'career':
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Career Board</h1>
              <p className="text-gray-600 mt-2">Track your career transition progress</p>
            </div>
            <CareerBoard funnelData={sampleCareerData} />
          </div>
        );

      case 'review':
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Weekly Review</h1>
              <p className="text-gray-600 mt-2">AI-generated insights and next steps</p>
            </div>
            <WeeklyReview 
              review={sampleWeeklyReview}
              onExport={(format) => console.log('Export:', format)}
              onShare={() => console.log('Share review')}
            />
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600 mt-2">Configure your Upraze experience</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-gray-500">Settings page coming soon...</p>
            </div>
          </div>
        );

      default:
        return <div>Page not found</div>;
    }
  };

  // Show onboarding if not completed
  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      {renderCurrentView()}
    </Layout>
  );
}

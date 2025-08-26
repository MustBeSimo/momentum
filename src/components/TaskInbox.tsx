'use client';

import { useState } from 'react';
import { Task, TaskType, Domain } from '@/types';
import { cn } from '@/lib/utils';
import { Plus, Target, Clock, Repeat, Search, CheckCircle, Sparkles } from 'lucide-react';
import { classifyTask, TaskClassification } from '@/lib/ai';

interface TaskInboxProps {
  onAddTask: (task: Omit<Task, 'id' | 'userId' | 'createdAt'>) => void;
  domains: Domain[];
}

const taskTypeIcons = {
  Compounding: Target,
  Milestone: CheckCircle,
  Maintenance: Repeat,
  Cyclical: Clock,
  Exploration: Search,
};



export default function TaskInbox({ onAddTask, domains }: TaskInboxProps) {
  const [taskText, setTaskText] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<Domain>('Output');
  const [selectedTaskType, setSelectedTaskType] = useState<TaskType>('Compounding');
  const [dueDate, setDueDate] = useState('');
  const [aiClassification, setAiClassification] = useState<TaskClassification | null>(null);
  const [isClassifying, setIsClassifying] = useState(false);

  const handleTaskTextChange = async (text: string) => {
    setTaskText(text);
    
    // Auto-classify when user stops typing
    if (text.trim().length > 10) {
      setIsClassifying(true);
      try {
        const classification = await classifyTask(text);
        setAiClassification(classification);
        setSelectedDomain(classification.domain);
        setSelectedTaskType(classification.taskType);
      } catch (error) {
        console.error('AI classification failed:', error);
      } finally {
        setIsClassifying(false);
      }
    } else {
      setAiClassification(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskText.trim()) return;

    const newTask: Omit<Task, 'id' | 'userId' | 'createdAt'> = {
      text: taskText.trim(),
      domainId: selectedDomain,
      taskType: selectedTaskType,
      dueAt: dueDate ? new Date(dueDate) : undefined,
    };

    onAddTask(newTask);
    setTaskText('');
    setDueDate('');
    setAiClassification(null);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Task Inbox</h2>
        <div className="text-sm text-gray-500">AI Classified</div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Task Input */}
        <div className="space-y-2">
          <label htmlFor="taskText" className="block text-sm font-medium text-gray-700">
            What do you want to track?
          </label>
          <div className="relative">
            <textarea
              id="taskText"
              value={taskText}
              onChange={(e) => handleTaskTextChange(e.target.value)}
              placeholder="e.g., Write 200 words daily about Spatial AI"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
            {isClassifying && (
              <div className="absolute top-2 right-2 flex items-center space-x-1 text-blue-600">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span className="text-xs">AI analyzing...</span>
              </div>
            )}
          </div>
          
          {/* AI Classification Results */}
          {aiClassification && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">AI Suggestion</span>
                <span className="text-xs text-blue-600">({(aiClassification.confidence * 100).toFixed(0)}% confidence)</span>
              </div>
              <div className="text-sm text-blue-800 space-y-1">
                <div><strong>Domain:</strong> {aiClassification.domain}</div>
                <div><strong>Type:</strong> {aiClassification.taskType}</div>
                {aiClassification.difficulty && (
                  <div><strong>Difficulty:</strong> {aiClassification.difficulty}</div>
                )}
                {aiClassification.estimatedHours && (
                  <div><strong>Est. Time:</strong> {aiClassification.estimatedHours}h</div>
                )}
                <div className="text-xs text-blue-600 mt-2">{aiClassification.reasoning}</div>
              </div>
            </div>
          )}
        </div>

        {/* Domain Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Domain</label>
          <div className="grid grid-cols-5 gap-2">
            {domains.map((domain) => (
              <button
                key={domain}
                type="button"
                onClick={() => setSelectedDomain(domain)}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md border transition-colors",
                  selectedDomain === domain
                    ? "bg-blue-50 border-blue-200 text-blue-700"
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                )}
              >
                {domain}
              </button>
            ))}
          </div>
        </div>

        {/* Task Type Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Task Type</label>
          <div className="grid grid-cols-5 gap-2">
            {Object.entries(taskTypeIcons).map(([type, Icon]) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedTaskType(type as TaskType)}
                className={cn(
                  "flex flex-col items-center px-3 py-2 text-sm font-medium rounded-md border transition-colors",
                  selectedTaskType === type
                    ? "bg-blue-50 border-blue-200 text-blue-700"
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                )}
              >
                <Icon className="w-4 h-4 mb-1" />
                <span className="text-xs">{type}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Due Date */}
        <div className="space-y-2">
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
            Due Date (optional)
          </label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!taskText.trim()}
          className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </button>
      </form>

      {/* Task Type Explanations */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Task Types Explained</h3>
        <div className="space-y-2 text-xs text-gray-600">
          <div className="flex items-center space-x-2">
            <Target className="w-3 h-3 text-blue-600" />
            <span><strong>Compounding:</strong> Daily habits that build over time</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-3 h-3 text-green-600" />
            <span><strong>Milestone:</strong> One-time goals with clear completion</span>
          </div>
          <div className="flex items-center space-x-2">
            <Repeat className="w-3 h-3 text-yellow-600" />
            <span><strong>Maintenance:</strong> Ongoing upkeep and standards</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-3 h-3 text-purple-600" />
            <span><strong>Cyclical:</strong> Recurring events and planning</span>
          </div>
          <div className="flex items-center space-x-2">
            <Search className="w-3 h-3 text-gray-600" />
            <span><strong>Exploration:</strong> Research and discovery activities</span>
          </div>
        </div>
      </div>
    </div>
  );
}

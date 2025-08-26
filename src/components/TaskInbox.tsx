'use client';

import { useState } from 'react';
import { Task, TaskType, Domain } from '@/types';
import { cn } from '@/lib/utils';
import { Plus, Target, Clock, Repeat, Search, Archive, CheckCircle } from 'lucide-react';

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

const taskTypeColors = {
  Compounding: 'bg-blue-100 text-blue-800',
  Milestone: 'bg-green-100 text-green-800',
  Maintenance: 'bg-yellow-100 text-yellow-800',
  Cyclical: 'bg-purple-100 text-purple-800',
  Exploration: 'bg-gray-100 text-gray-800',
};

export default function TaskInbox({ onAddTask, domains }: TaskInboxProps) {
  const [taskText, setTaskText] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<Domain>('Output');
  const [selectedTaskType, setSelectedTaskType] = useState<TaskType>('Compounding');
  const [dueDate, setDueDate] = useState('');

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
          <textarea
            id="taskText"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            placeholder="e.g., Write 200 words daily about Spatial AI"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
          />
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

'use client';

// Example of using shared types and utilities in frontend
import { useState, useEffect } from 'react';
import {
  SessionId,
  ExperienceLevel,
  API_ENDPOINTS,
  BUSINESS_RULES,
  ApiResponse,
  SkillCategory
} from '@skillara/shared';
import { formatDate, truncate } from '@skillara/shared/utils';

export default function ExampleSharedUsage() {
  const [sessionId, setSessionId] = useState<string>('');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('entry');

  useEffect(() => {
    // Generate a new session ID when component mounts
    const newSession = SessionId.generate();
    setSessionId(newSession.value);
  }, []);

  const handleApiCall = async (): Promise<void> => {
    try {
      const response = await fetch(API_ENDPOINTS.CAREER_ANALYSIS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          experienceLevel,
          timestamp: formatDate(new Date(), 'ISO')
        }),
      });

      const data: ApiResponse<{ message: string }> = await response.json();

      if (data.success) {
        console.log('Success:', data.data?.message);
      } else {
        console.error('API Error:', data.error?.message);
      }
    } catch (error) {
      console.error('Network Error:', error);
    }
  };

  const skillCategories: SkillCategory[] = [
    'frontend',
    'backend',
    'database',
    'devops',
    'design'
  ];

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Shared Package Usage Example</h1>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Session ID (Generated using shared SessionId):
          </label>
          <input
            type="text"
            value={sessionId}
            readOnly
            className="w-full p-2 border rounded bg-gray-50 font-mono text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Experience Level (Shared Type):
          </label>
          <select
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value as ExperienceLevel)}
            className="w-full p-2 border rounded"
          >
            <option value="entry">Entry</option>
            <option value="junior">Junior</option>
            <option value="mid">Mid-level</option>
            <option value="senior">Senior</option>
            <option value="lead">Lead</option>
            <option value="executive">Executive</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Skill Categories (Shared Types):
          </label>
          <div className="flex flex-wrap gap-2">
            {skillCategories.map((category) => (
              <span
                key={category}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {category}
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Business Rules (Shared Constants):
          </label>
          <div className="text-sm space-y-1 p-3 bg-gray-50 rounded">
            <p>Max File Size: {BUSINESS_RULES.MAX_FILE_SIZE_MB} MB</p>
            <p>Session Duration: {BUSINESS_RULES.DEFAULT_SESSION_DURATION_HOURS} hours</p>
            <p>Max Skills per Profile: {BUSINESS_RULES.MAX_SKILLS_PER_PROFILE}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Utility Functions (Shared Utils):
          </label>
          <div className="text-sm space-y-1 p-3 bg-gray-50 rounded">
            <p>Current Time: {formatDate(new Date(), 'long')}</p>
            <p>Truncated Text: {truncate('This is a very long text that will be truncated', 30)}</p>
          </div>
        </div>

        <button
          onClick={() => void handleApiCall()}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Test API Call (using shared endpoints)
        </button>
      </div>

      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
        <h3 className="font-medium text-green-800 mb-2">✅ Shared Package Features Used:</h3>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• SessionId value object for type-safe session management</li>
          <li>• ExperienceLevel and SkillCategory union types</li>
          <li>• API_ENDPOINTS constants for consistent API calls</li>
          <li>• BUSINESS_RULES constants for configuration</li>
          <li>• ApiResponse generic type for type-safe API responses</li>
          <li>• formatDate and truncate utility functions</li>
        </ul>
      </div>
    </div>
  );
}

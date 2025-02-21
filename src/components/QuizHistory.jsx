import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { History } from 'lucide-react';

export function QuizHistory({ attempts }) {
  if (attempts.length === 0) {
    return (
      <div className="text-center text-gray-500">
        No attempts yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <History className="w-5 h-5" />
        <h2 className="text-xl font-semibold">Previous Attempts</h2>
      </div>
      {attempts.map((attempt) => (
        <div
          key={attempt.id}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {formatDistanceToNow(attempt.timestamp, { addSuffix: true })}
            </div>
            <div className="text-lg font-semibold">
              Score: {attempt.score} / {attempt.totalQuestions}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
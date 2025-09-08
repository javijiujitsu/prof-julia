'use client';

import { ChevronRight, BookOpen, MessageCircle } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  scenario: string;
  targetPhrase: string;
  vocabulary: string[];
  grammar: string;
}

interface LessonCardProps {
  lesson: Lesson;
  onNext: () => void;
}

export function LessonCard({ lesson, onNext }: LessonCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold text-gray-800">{lesson.title}</h2>
        <button
          onClick={onNext}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      
      <div className="space-y-4">
        {/* Scenario */}
        <div className="flex items-start gap-3">
          <MessageCircle className="w-5 h-5 text-blue-500 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-700">Scenario</h3>
            <p className="text-gray-600">{lesson.scenario}</p>
          </div>
        </div>

        {/* Grammar Focus */}
        <div className="flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-purple-500 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-700">Grammar Focus</h3>
            <p className="text-gray-600">{lesson.grammar}</p>
          </div>
        </div>

        {/* Vocabulary */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Key Vocabulary</h3>
          <div className="flex flex-wrap gap-2">
            {lesson.vocabulary.map((word, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                {word}
              </span>
            ))}
          </div>
        </div>

        {/* Target Phrase Preview */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border-l-4 border-green-400">
          <h3 className="font-semibold text-gray-700 mb-2">Target Phrase</h3>
          <p className="text-lg font-medium text-gray-800 italic">
            &quot;{lesson.targetPhrase}&quot;
          </p>
        </div>
      </div>
    </div>
  );
}
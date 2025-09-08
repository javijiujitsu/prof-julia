'use client';

import { useState } from 'react';
import { VoiceTutor } from '@/components/VoiceTutor';
import { Avatar } from '@/components/Avatar';
import { LessonCard } from '@/components/LessonCard';

const LESSON_CARDS = [
  {
    id: 'cafe-order',
    title: 'Commander au Café',
    scenario: 'Order a croissant and coffee',
    targetPhrase: 'Bonjour, je voudrais un croissant et un café, s\'il vous plaît.',
    vocabulary: ['croissant', 'café', 's\'il vous plaît', 'bonjour'],
    grammar: 'Conditional (je voudrais)'
  },
  {
    id: 'metro-directions',
    title: 'Demander le Chemin',
    scenario: 'Ask for directions to the metro',
    targetPhrase: 'Excusez-moi, où est la station de métro la plus proche?',
    vocabulary: ['excusez-moi', 'station', 'métro', 'proche'],
    grammar: 'Question formation (où est...?)'
  },
  {
    id: 'bakery-shopping',
    title: 'À la Boulangerie',
    scenario: 'Buy bread at the bakery',
    targetPhrase: 'Une baguette bien cuite, s\'il vous plaît.',
    vocabulary: ['baguette', 'bien cuite', 'boulangerie'],
    grammar: 'Adjective agreement (bien cuite)'
  }
];

export default function Home() {
  const [currentCard, setCurrentCard] = useState(0);
  const [sessionActive, setSessionActive] = useState(false);
  const [tutorResponse, setTutorResponse] = useState('');
  const [tutorTranslation, setTutorTranslation] = useState('');

  const handleStartSession = () => {
    setSessionActive(true);
  };

  const handleEndSession = () => {
    setSessionActive(false);
  };

  const handleNextCard = () => {
    setCurrentCard((prev) => (prev + 1) % LESSON_CARDS.length);
  };

  const handleTutorResponse = (frenchText: string, englishTranslation?: string) => {
    setTutorResponse(frenchText);
    if (englishTranslation) {
      setTutorTranslation(englishTranslation);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Prof Julia</h1>
          <p className="text-xl text-gray-600 mb-4">Your Interactive French Tutor</p>
          
          {/* Beginner-friendly Instructions */}
          {!sessionActive && (
            <div className="max-w-2xl mx-auto bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
              <h3 className="font-semibold text-blue-800 mb-3 text-center">🌟 New to French? No problem!</h3>
              <div className="space-y-2 text-blue-700 text-sm">
                <p><strong>How it works:</strong></p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Choose a scenario below (café, metro, or bakery)</li>
                  <li>Click "Start Session" to meet Prof Julia</li>
                  <li>She&apos;ll speak in French first, then you try to repeat it</li>
                  <li>Get instant feedback with English translations</li>
                  <li>Practice until you feel confident!</li>
                </ol>
                <p className="mt-3 text-center font-medium">✨ Don&apos;t worry about making mistakes - that&apos;s how you learn!</p>
              </div>
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Avatar Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <Avatar 
              isActive={sessionActive}
              currentText={tutorResponse}
              currentTranslation={tutorTranslation}
            />
          </div>

          {/* Lesson Interface */}
          <div className="space-y-6">
            {/* Current Lesson Card */}
            <LessonCard 
              lesson={LESSON_CARDS[currentCard]}
              onNext={handleNextCard}
            />

            {/* Voice Controls */}
            <VoiceTutor
              isActive={sessionActive}
              onStart={handleStartSession}
              onEnd={handleEndSession}
              onResponse={handleTutorResponse}
              currentLesson={LESSON_CARDS[currentCard]}
            />
          </div>
        </div>

        {/* Session Status */}
        {sessionActive && (
          <div className="mt-8 bg-green-100 border border-green-300 rounded-lg p-4 text-center">
            <p className="text-green-800 font-medium">
              Session Active - Speak in French!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

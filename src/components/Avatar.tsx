'use client';

import { useState, useEffect } from 'react';
import { User, Volume2, VolumeX } from 'lucide-react';

interface AvatarProps {
  isActive: boolean;
  currentText: string;
  currentTranslation?: string;
}

export function Avatar({ isActive, currentText, currentTranslation }: AvatarProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  useEffect(() => {
    if (currentText && isActive) {
      setIsSpeaking(true);
      // Simulate speaking animation duration
      const timer = setTimeout(() => {
        setIsSpeaking(false);
      }, Math.max(2000, currentText.length * 100));
      
      return () => clearTimeout(timer);
    }
  }, [currentText, isActive]);

  return (
    <div className="flex flex-col items-center">
      {/* Avatar Container */}
      <div className="relative mb-6">
        {/* Basic Avatar Display */}
        <div 
          className={`w-48 h-48 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center transition-all duration-300 ${
            isSpeaking ? 'scale-105 shadow-lg' : 'scale-100 shadow-md'
          } ${isActive ? 'ring-4 ring-green-300' : 'ring-2 ring-gray-200'}`}
        >
          {/* Simple avatar icon - will be replaced with actual video avatar */}
          <User className="w-24 h-24 text-white" />
          
          {/* Speaking indicator */}
          {isSpeaking && (
            <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2">
              <Volume2 className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        {/* Status indicator */}
        <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full border-4 border-white ${
          isActive ? 'bg-green-500' : 'bg-gray-400'
        }`} />
      </div>

      {/* Avatar Info */}
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Prof Julia</h3>
        <p className="text-gray-600 mb-4">Votre tutrice de français</p>
        
        {/* Status */}
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
          isActive 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-600'
        }`}>
          <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
          {isActive ? 'Active' : 'Offline'}
        </div>
      </div>

      {/* Current Speech Display */}
      {currentText && isActive && (
        <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 max-w-sm">
          <h4 className="font-medium text-green-800 mb-3 flex items-center gap-2">
            <Volume2 className="w-4 h-4" />
            Prof Julia&apos;s Response
          </h4>
          
          <div className="space-y-3">
            {/* French (what she said) */}
            <div className="bg-white p-3 rounded-lg border-l-4 border-green-400">
              <p className="text-sm font-medium text-green-800 mb-1">🇫🇷 French:</p>
              <p className="text-green-700 italic font-medium">&quot;{currentText}&quot;</p>
            </div>
            
            {/* English translation */}
            {currentTranslation && (
              <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                <p className="text-sm font-medium text-blue-800 mb-1">🇺🇸 English Translation:</p>
                <p className="text-blue-700">{currentTranslation}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Audio Controls */}
      <div className="mt-4">
        <button
          onClick={() => setIsAudioEnabled(!isAudioEnabled)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            isAudioEnabled 
              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {isAudioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          {isAudioEnabled ? 'Audio On' : 'Audio Off'}
        </button>
      </div>

    </div>
  );
}
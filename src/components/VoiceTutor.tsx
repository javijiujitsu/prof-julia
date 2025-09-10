'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, Star, Target, AlertTriangle } from 'lucide-react';
import { FrenchTutorEngine } from '@/lib/frenchTutor';

interface Lesson {
  id: string;
  title: string;
  scenario: string;
  targetPhrase: string;
  vocabulary: string[];
  grammar: string;
}

interface VoiceTutorProps {
  isActive: boolean;
  onStart: () => void;
  onEnd: () => void;
  onResponse: (frenchText: string, englishTranslation?: string) => void;
  currentLesson: Lesson;
}

export function VoiceTutor({ isActive, onStart, onEnd, onResponse, currentLesson }: VoiceTutorProps) {
  const [isListening, setIsListening] = useState(false);
  const [userSpeech, setUserSpeech] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pronunciationResult, setPronunciationResult] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [englishTranslation, setEnglishTranslation] = useState('');
  const [frenchResponse, setFrenchResponse] = useState('');
  const [systemStatus, setSystemStatus] = useState('Ready to start');
  const [tutorEngine] = useState(() => new FrenchTutorEngine());
  const [isMobile, setIsMobile] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Detect mobile and speech support
  useEffect(() => {
    const checkMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsMobile(checkMobile);
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setSpeechSupported(!!SpeechRecognition);
    
    if (!SpeechRecognition) {
      setSystemStatus('Speech recognition not supported on this browser. Please try Chrome or Edge.');
    }
  }, []);

  // Handle session start greeting
  useEffect(() => {
    if (isActive && !frenchResponse) {
      const greeting = "Bonjour! Je suis Prof Julia, votre tutrice de français. Commençons par le premier exercice!";
      const translation = "Hello! I am Prof Julia, your French tutor. Let's start with the first exercise!";
      setFrenchResponse(greeting);
      setEnglishTranslation(translation);
      
      // On mobile, wait for user interaction before playing audio
      if (isMobile && !hasUserInteracted) {
        setSystemStatus('Tap "Speak" or any button to enable audio and start learning');
        onResponse(greeting, translation);
      } else {
        generateTutorResponse(greeting, translation);
        // Play the target phrase example after the greeting
        setTimeout(() => {
          playTargetPhrase();
        }, 4000); // Wait 4 seconds after greeting
      }
    }
  }, [isActive]);

  useEffect(() => {
    // Check for both webkit and standard Speech Recognition APIs
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (typeof window !== 'undefined' && SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'fr-FR';
      recognition.continuous = false;
      recognition.interimResults = false;
      
      // Mobile-specific settings
      if (recognition.maxAlternatives) {
        recognition.maxAlternatives = 1;
      }
      
      recognition.onstart = () => {
        setIsListening(true);
        setSystemStatus('Listening for your French speech...');
      };
      
      recognition.onresult = (event: any) => {
        console.log('Speech recognition result event:', event);
        const transcript = event.results[0][0].transcript;
        console.log('Transcript received:', transcript);
        setUserSpeech(transcript);
        setSystemStatus('Processing your pronunciation...');
        handleUserSpeech(transcript);
      };
      
      recognition.onend = () => {
        console.log('Speech recognition ended, isProcessing:', isProcessing);
        setIsListening(false);
        // Don't override status if we're processing speech
        if (!isProcessing) {
          setSystemStatus('Ready to listen again');
        }
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        console.log('Speech recognition error:', event.error);
        
        // Mobile-specific error messages
        if (event.error === 'not-allowed') {
          setSystemStatus('Microphone access denied. Please enable microphone permissions.');
        } else if (event.error === 'no-speech') {
          setSystemStatus('No speech detected. Please speak clearly and try again.');
        } else if (event.error === 'audio-capture') {
          setSystemStatus('Microphone not available. Please check your device settings.');
        } else if (event.error === 'network') {
          setSystemStatus('Network error. Please check your internet connection.');
        } else {
          setSystemStatus('Speech recognition error. Please try again.');
        }
      };
      
      recognitionRef.current = recognition;
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    // Mark user interaction for mobile audio
    if (!hasUserInteracted) {
      setHasUserInteracted(true);
    }
    
    if (!speechSupported) {
      setSystemStatus('Speech recognition not supported. Please use Chrome or Edge browser.');
      return;
    }
    
    if (recognitionRef.current && !isListening) {
      try {
        // Mobile-specific: Ensure microphone permission
        if (isMobile) {
          setSystemStatus('Requesting microphone access...');
        }
        recognitionRef.current.start();
      } catch (error) {
        console.error('Speech recognition start error:', error);
        setSystemStatus('Could not start voice recognition. Please check browser permissions.');
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const handleUserSpeech = async (transcript: string) => {
    setIsProcessing(true);
    console.log('Processing speech:', transcript);
    
    try {
      // Simulate pronunciation and grammar checking
      const response = await analyzeUserSpeech(transcript, currentLesson);
      console.log('Analysis result:', response);
      setFeedback(response.feedback);
      
      // Generate tutor response using ElevenLabs
      await generateTutorResponse(response.tutorResponse, response.tutorResponseTranslation);
      
      setSystemStatus('Ready for your next attempt');
    } catch (error) {
      console.error('Error processing speech:', error);
      setSystemStatus('Error processing speech. Please try again.');
      setFeedback('Sorry, there was an error analyzing your pronunciation. Please try speaking again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const analyzeUserSpeech = async (transcript: string, lesson: Lesson) => {
    setSystemStatus('Analyzing your pronunciation...');
    
    // Use the French tutor engine for sophisticated analysis
    const result = tutorEngine.analyzeUserSpeech(transcript, lesson);
    setPronunciationResult(result);
    setSuggestions(result.suggestions);
    setEnglishTranslation(result.tutorResponseTranslation);
    setFrenchResponse(result.tutorResponse);
    
    setSystemStatus('Prof Julia is responding...');
    
    return { 
      feedback: result.feedback, 
      tutorResponse: result.tutorResponse, 
      tutorResponseTranslation: result.tutorResponseTranslation,
      accuracy: result.accuracy 
    };
  };

  const generateTutorResponse = async (text: string, translation?: string) => {
    try {
      // Call ElevenLabs API
      const response = await fetch('/api/elevenlabs/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice: 'french-female' })
      });
      
      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          
          // Handle mobile autoplay restrictions
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              // Mobile browsers block autoplay - require user interaction
              if (isMobile && !hasUserInteracted) {
                setSystemStatus('Tap anywhere to enable audio, then try again');
              } else {
                setSystemStatus('Audio blocked by browser. Click to enable audio.');
              }
            });
          }
        }
      }
      
      onResponse(text, translation || englishTranslation);
      setSystemStatus('Ready for your next attempt');
    } catch (error) {
      console.error('TTS Error:', error);
      setSystemStatus('Audio error, but feedback is ready');
      onResponse(text, translation || englishTranslation);
    }
  };

  const enableMobileAudio = () => {
    if (isMobile && !hasUserInteracted) {
      setHasUserInteracted(true);
      // Try to play a brief silent audio to unlock audio context
      if (audioRef.current) {
        const originalSrc = audioRef.current.src;
        audioRef.current.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LBdSECJoDM8tmIMwU=';
        audioRef.current.play().catch(() => {});
        audioRef.current.src = originalSrc;
      }
      setSystemStatus('Audio enabled! Ready to start learning.');
    }
  };

  const playTargetPhrase = () => {
    // Get English translation for the target phrase
    const getTargetPhraseTranslation = (lesson: Lesson): string => {
      const translations: Record<string, string> = {
        "Bonjour, je voudrais un croissant et un café, s'il vous plaît.": "Hello, I would like a croissant and a coffee, please.",
        "Excusez-moi, où est la station de métro la plus proche?": "Excuse me, where is the nearest metro station?",
        "Une baguette bien cuite, s'il vous plaît.": "One well-baked baguette, please."
      };
      return translations[lesson.targetPhrase] || `Translation for: ${lesson.targetPhrase}`;
    };

    const translation = getTargetPhraseTranslation(currentLesson);
    setEnglishTranslation(translation);
    setFrenchResponse(currentLesson.targetPhrase);
    generateTutorResponse(currentLesson.targetPhrase, translation);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6" onClick={enableMobileAudio}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Voice Practice</h3>
        <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
          {systemStatus}
        </div>
      </div>
      
      {/* Voice Controls */}
      <div className="flex gap-4 mb-6">
        {!isActive ? (
          <button
            onClick={onStart}
            className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Mic className="w-5 h-5" />
            Start Session
          </button>
        ) : (
          <>
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={isProcessing}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                isListening 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-green-500 text-white hover:bg-green-600'
              } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              {isListening ? 'Stop' : 'Speak'}
            </button>
            
            <button
              onClick={playTargetPhrase}
              className="flex items-center gap-2 bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors"
            >
              <Volume2 className="w-5 h-5" />
              Play Example
            </button>
            
            <button
              onClick={onEnd}
              className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
            >
              End Session
            </button>
          </>
        )}
      </div>

      {/* Mobile Browser Compatibility Notice */}
      {isMobile && !speechSupported && (
        <div className="bg-orange-100 border border-orange-300 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <h4 className="font-medium text-orange-800">Browser Compatibility</h4>
          </div>
          <p className="text-orange-700 text-sm">
            For the best experience on mobile, please use:
          </p>
          <ul className="text-orange-700 text-sm mt-1 ml-4">
            <li>• Chrome on Android</li>
            <li>• Safari on iOS (limited support)</li>
            <li>• Edge browser</li>
          </ul>
        </div>
      )}

      {/* Mobile Audio Instructions */}
      {isMobile && !hasUserInteracted && isActive && (
        <div className="bg-blue-100 border border-blue-300 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Volume2 className="w-5 h-5 text-blue-600" />
            <h4 className="font-medium text-blue-800">Mobile Audio Setup</h4>
          </div>
          <p className="text-blue-700 text-sm">
            Tap any button to enable audio and start learning with Prof Julia!
          </p>
        </div>
      )}

      {/* Status Display */}
      {isProcessing && (
        <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 mb-4">
          <p className="text-yellow-800">Processing your speech...</p>
        </div>
      )}

      {/* User Speech */}
      {userSpeech && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 mb-2">You said:</h4>
          <p className="bg-gray-100 p-3 rounded-lg text-gray-800">"{userSpeech}"</p>
        </div>
      )}

      {/* Pronunciation Analysis */}
      {pronunciationResult && (
        <div className="mb-4 space-y-4">
          {/* Accuracy Score */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
            <Target className="w-6 h-6 text-blue-600" />
            <div className="flex-1">
              <h4 className="font-medium text-gray-700">Pronunciation Accuracy</h4>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${
                      pronunciationResult.accuracy >= 85 ? 'bg-green-500' :
                      pronunciationResult.accuracy >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${pronunciationResult.accuracy}%` }}
                  />
                </div>
                <span className="font-bold text-lg text-gray-700">
                  {pronunciationResult.accuracy}%
                </span>
              </div>
            </div>
          </div>

          {/* Word-level Feedback */}
          {(pronunciationResult.correctWords.length > 0 || pronunciationResult.incorrectWords.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Correct Words */}
              {pronunciationResult.correctWords.length > 0 && (
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <h5 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Well Pronounced
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {pronunciationResult.correctWords.map((word: string, index: number) => (
                      <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Incorrect Words */}
              {pronunciationResult.incorrectWords.length > 0 && (
                <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                  <h5 className="font-medium text-red-800 mb-2">Needs Practice</h5>
                  <div className="flex flex-wrap gap-2">
                    {pronunciationResult.incorrectWords.slice(0, 5).map((word: string, index: number) => (
                      <span key={index} className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Feedback */}
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-2">Feedback:</h4>
            <p className="text-blue-700">{feedback}</p>
          </div>
        </div>
      )}

      {/* Prof Julia's Response with Translation */}
      {englishTranslation && (
        <div className="mb-4 bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
          <h4 className="font-medium text-green-800 mb-3 flex items-center gap-2">
            <Volume2 className="w-4 h-4" />
            Prof Julia's Response
          </h4>
          
          <div className="space-y-3">
            {/* French (what she said) */}
            <div className="bg-white p-3 rounded-lg border-l-4 border-green-400">
              <p className="text-sm font-medium text-green-800 mb-1">🇫🇷 French:</p>
              <p className="text-green-700 italic font-medium">"{frenchResponse}"</p>
            </div>
            
            {/* English translation */}
            <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
              <p className="text-sm font-medium text-blue-800 mb-1">🇺🇸 English Translation:</p>
              <p className="text-blue-700">{englishTranslation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Pronunciation Suggestions */}
      {suggestions.length > 0 && (
        <div className="mb-4 bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h4 className="font-medium text-purple-800 mb-3 flex items-center gap-2">
            <Volume2 className="w-4 h-4" />
            Pronunciation Tips
          </h4>
          <ul className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="text-purple-700 text-sm flex items-start gap-2">
                <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Target Phrase */}
      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="font-medium text-green-800 mb-2">Target Phrase:</h4>
        <p className="text-lg text-green-700 font-medium">"{currentLesson.targetPhrase}"</p>
        <p className="text-sm text-green-600 mt-1">{currentLesson.scenario}</p>
      </div>

      <audio ref={audioRef} className="hidden" />
    </div>
  );
}
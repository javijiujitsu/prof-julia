// French language tutoring logic and pronunciation analysis

export interface Lesson {
  id: string;
  title: string;
  scenario: string;
  targetPhrase: string;
  vocabulary: string[];
  grammar: string;
}

export interface PronunciationFeedback {
  accuracy: number;
  correctWords: string[];
  incorrectWords: string[];
  feedback: string;
  tutorResponse: string;
  tutorResponseTranslation: string;
  suggestions: string[];
}

export interface TutorSession {
  currentStep: 'listen' | 'repeat' | 'correct' | 'roleplay' | 'reward';
  attempts: number;
  score: number;
  completedLessons: string[];
}

// Common French pronunciation patterns and corrections
const FRENCH_PRONUNCIATION_PATTERNS = {
  // Silent letters
  silentE: /e$/,
  silentS: /s$/,
  silentT: /t$/,
  
  // Nasal sounds
  nasal_an: /an|en/g,
  nasal_on: /on/g,
  nasal_in: /in|ain|ein/g,
  
  // R sound (French uvular R)
  frenchR: /r/g,
  
  // Common mispronunciations
  th_sound: /th/g, // English speakers often add 'th'
  h_sound: /^h/, // French H is usually silent
};

// French politeness and register detection
const POLITENESS_MARKERS = {
  formal: ['vous', 'monsieur', 'madame', 'mademoiselle', 's\'il vous plaît', 'veuillez'],
  informal: ['tu', 's\'il te plaît'],
  greetings: ['bonjour', 'bonsoir', 'salut', 'au revoir'],
  thanks: ['merci', 'merci beaucoup', 'je vous remercie'],
};

export class FrenchTutorEngine {
  private session: TutorSession;

  constructor() {
    this.session = {
      currentStep: 'listen',
      attempts: 0,
      score: 0,
      completedLessons: []
    };
  }

  public analyzeUserSpeech(userTranscript: string, lesson: Lesson): PronunciationFeedback {
    const cleanTranscript = this.cleanTranscript(userTranscript);
    const targetWords = this.extractWords(lesson.targetPhrase);
    const spokenWords = this.extractWords(cleanTranscript);

    // Calculate pronunciation accuracy
    const accuracy = this.calculateAccuracy(spokenWords, targetWords);
    
    // Identify correct and incorrect words
    const { correctWords, incorrectWords } = this.identifyWordAccuracy(spokenWords, targetWords);
    
    // Generate feedback based on accuracy and common errors
    const feedback = this.generateFeedback(accuracy, correctWords, incorrectWords, lesson);
    
    // Create appropriate tutor response with translation
    const tutorResponseObj = this.generateTutorResponse(accuracy, lesson, this.session.currentStep);
    
    // Provide specific pronunciation suggestions
    const suggestions = this.generateSuggestions(incorrectWords, lesson);

    // Update session state
    this.updateSession(accuracy);

    return {
      accuracy,
      correctWords,
      incorrectWords,
      feedback,
      tutorResponse: tutorResponseObj.french,
      tutorResponseTranslation: tutorResponseObj.english,
      suggestions
    };
  }

  private cleanTranscript(transcript: string): string {
    return transcript
      .toLowerCase()
      .replace(/[.,!?;]/g, '') // Remove punctuation
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }

  private extractWords(text: string): string[] {
    return this.cleanTranscript(text).split(' ').filter(word => word.length > 0);
  }

  private calculateAccuracy(spoken: string[], target: string[]): number {
    if (target.length === 0) return 0;
    
    let matches = 0;
    const targetCopy = [...target];
    
    for (const spokenWord of spoken) {
      const index = targetCopy.findIndex(targetWord => 
        this.wordsMatch(spokenWord, targetWord)
      );
      if (index !== -1) {
        matches++;
        targetCopy.splice(index, 1); // Remove matched word
      }
    }
    
    return Math.round((matches / target.length) * 100);
  }

  private wordsMatch(spoken: string, target: string): boolean {
    // Exact match
    if (spoken === target) return true;
    
    // Phonetic similarity (simplified)
    const spokenPhonetic = this.phoneticApproximation(spoken);
    const targetPhonetic = this.phoneticApproximation(target);
    
    // Allow for minor variations
    const similarity = this.calculateStringSimilarity(spokenPhonetic, targetPhonetic);
    return similarity > 0.8;
  }

  private phoneticApproximation(word: string): string {
    return word
      .replace(FRENCH_PRONUNCIATION_PATTERNS.silentE, '') // Remove silent e
      .replace(FRENCH_PRONUNCIATION_PATTERNS.silentS, '') // Remove silent s
      .replace(FRENCH_PRONUNCIATION_PATTERNS.silentT, '') // Remove silent t
      .replace(/qu/g, 'k') // qu -> k sound
      .replace(/ch/g, 'sh') // ch -> sh sound
      .replace(/j/g, 'zh') // j -> zh sound
      .replace(/gn/g, 'ny') // gn -> ny sound
      .replace(/ç/g, 's') // ç -> s sound
      .replace(/é|è|ê|ë/g, 'e') // Normalize e variants
      .replace(/à|â|ä/g, 'a') // Normalize a variants
      .replace(/ô|ö/g, 'o') // Normalize o variants
      .replace(/ù|û|ü/g, 'u'); // Normalize u variants
  }

  private calculateStringSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1, // deletion
          matrix[j - 1][i] + 1, // insertion
          matrix[j - 1][i - 1] + indicator // substitution
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  private identifyWordAccuracy(spoken: string[], target: string[]): { correctWords: string[], incorrectWords: string[] } {
    const correctWords: string[] = [];
    const incorrectWords: string[] = [];
    const targetCopy = [...target];
    
    for (const spokenWord of spoken) {
      const matchIndex = targetCopy.findIndex(targetWord => 
        this.wordsMatch(spokenWord, targetWord)
      );
      
      if (matchIndex !== -1) {
        correctWords.push(targetCopy[matchIndex]);
        targetCopy.splice(matchIndex, 1);
      } else {
        incorrectWords.push(spokenWord);
      }
    }
    
    // Add unspoken target words as incorrect
    incorrectWords.push(...targetCopy);
    
    return { correctWords, incorrectWords };
  }

  private generateFeedback(accuracy: number, correctWords: string[], incorrectWords: string[], lesson: Lesson): string {
    if (accuracy >= 90) {
      return "Excellent! Votre pronunciation est parfaite! 🎉";
    } else if (accuracy >= 75) {
      return `Très bien! Correct words: ${correctWords.join(', ')}. Let's practice: ${incorrectWords.slice(0, 2).join(', ')}`;
    } else if (accuracy >= 50) {
      return `Bon effort! Focus on these words: ${incorrectWords.slice(0, 3).join(', ')}. Remember: ${lesson.grammar}`;
    } else {
      return `Essayons encore! Listen carefully to the target phrase and repeat slowly.`;
    }
  }

  private generateTutorResponse(accuracy: number, lesson: Lesson, currentStep: string): { french: string, english: string } {
    const responses = {
      excellent: [
        { 
          french: "Parfait! Vous maîtrisez très bien cette phrase!",
          english: "Perfect! You master this phrase very well!"
        },
        { 
          french: "Magnifique! Votre accent s'améliore beaucoup!",
          english: "Magnificent! Your accent is improving a lot!"
        },
        { 
          french: "Très bien! Passons au prochain exercice!",
          english: "Very good! Let's move on to the next exercise!"
        }
      ],
      good: [
        { 
          french: "Bien! Répétons encore une fois: " + lesson.targetPhrase,
          english: "Good! Let's repeat once more: " + lesson.targetPhrase
        },
        { 
          french: "Pas mal! Écoutez la pronunciation: " + lesson.targetPhrase,
          english: "Not bad! Listen to the pronunciation: " + lesson.targetPhrase
        },
        { 
          french: "Bon travail! Essayez de prononcer plus clairement.",
          english: "Good work! Try to pronounce more clearly."
        }
      ],
      needsWork: [
        { 
          french: "Écoutez attentivement et répétez: " + lesson.targetPhrase,
          english: "Listen carefully and repeat: " + lesson.targetPhrase
        },
        { 
          french: "Prenez votre temps. Répétez après moi: " + lesson.targetPhrase,
          english: "Take your time. Repeat after me: " + lesson.targetPhrase
        },
        { 
          french: "N'hésitez pas! Essayons syllabe par syllabe.",
          english: "Don't hesitate! Let's try syllable by syllable."
        }
      ]
    };

    let responseCategory: keyof typeof responses;
    if (accuracy >= 85) responseCategory = 'excellent';
    else if (accuracy >= 60) responseCategory = 'good';
    else responseCategory = 'needsWork';

    const categoryResponses = responses[responseCategory];
    return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
  }

  private generateSuggestions(incorrectWords: string[], lesson: Lesson): string[] {
    const suggestions: string[] = [];
    
    for (const word of incorrectWords.slice(0, 3)) { // Limit to 3 suggestions
      if (word.includes('r')) {
        suggestions.push(`For '${word}': Practice the French 'R' sound from the back of your throat`);
      }
      if (word.includes('u')) {
        suggestions.push(`For '${word}': French 'u' is pronounced with rounded lips, like 'ü'`);
      }
      if (word.includes('j')) {
        suggestions.push(`For '${word}': French 'j' sounds like 'zh' in 'measure'`);
      }
      if (word.includes('ch')) {
        suggestions.push(`For '${word}': French 'ch' sounds like 'sh' in 'shoe'`);
      }
    }
    
    return suggestions;
  }

  private updateSession(accuracy: number): void {
    this.session.attempts++;
    this.session.score += accuracy;
    
    // Progress through tutoring steps based on accuracy
    if (accuracy >= 85) {
      this.advanceStep();
    }
  }

  private advanceStep(): void {
    const steps: TutorSession['currentStep'][] = ['listen', 'repeat', 'correct', 'roleplay', 'reward'];
    const currentIndex = steps.indexOf(this.session.currentStep);
    if (currentIndex < steps.length - 1) {
      this.session.currentStep = steps[currentIndex + 1];
    }
  }

  public getSessionState(): TutorSession {
    return { ...this.session };
  }

  public resetSession(): void {
    this.session = {
      currentStep: 'listen',
      attempts: 0,
      score: 0,
      completedLessons: []
    };
  }

  // Politeness and register coaching
  public analyzePoliteness(text: string): { level: 'formal' | 'informal' | 'mixed', suggestions: string[] } {
    const words = this.extractWords(text);
    let formalCount = 0;
    let informalCount = 0;
    
    words.forEach(word => {
      if (POLITENESS_MARKERS.formal.includes(word)) formalCount++;
      if (POLITENESS_MARKERS.informal.includes(word)) informalCount++;
    });
    
    const suggestions: string[] = [];
    let level: 'formal' | 'informal' | 'mixed' = 'mixed';
    
    if (formalCount > informalCount) {
      level = 'formal';
      suggestions.push("Perfect! You're using formal register appropriately.");
    } else if (informalCount > formalCount) {
      level = 'informal';
      suggestions.push("Good use of informal register. Remember to use 'vous' in formal situations.");
    } else {
      suggestions.push("Consider the context: use 'vous' for formal situations, 'tu' for informal ones.");
    }
    
    return { level, suggestions };
  }
}
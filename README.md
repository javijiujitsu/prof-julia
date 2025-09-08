# Prof Julia - Interactive French Tutor 🇫🇷

An intelligent conversational French tutor prototype showcasing ElevenLabs TTS technology with real-time voice interaction and pronunciation feedback.

## 🎯 Demo Features

- **Real-time French conversation** with ElevenLabs streaming TTS
- **Advanced pronunciation analysis** with detailed feedback
- **Interactive lesson cards** for café, metro, and bakery scenarios
- **Web Speech API integration** for speech recognition
- **Smart tutoring engine** with French-specific correction logic
- **Visual feedback** for pronunciation accuracy and suggestions

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- ElevenLabs API account ([sign up here](https://elevenlabs.io/))

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd prof-simone
npm install
```

2. **Set up environment variables:**
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your ElevenLabs API key:
```env
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

3. **Start the development server:**
```bash
npm run dev
```

4. **Open your browser:** Navigate to `http://localhost:3000`

## 🎮 How to Use

1. **Start a Session:** Click "Start Session" to activate Prof Julia
2. **Listen:** Prof Julia will greet you and introduce the lesson
3. **Speak:** Click "Speak" and say the target phrase in French
4. **Get Feedback:** Receive instant pronunciation analysis and tips
5. **Practice:** Use "Play Example" to hear the correct pronunciation
6. **Advance:** Move through different scenarios (café, metro, bakery)

## 🏗️ Architecture

### Core Components

- **`VoiceTutor.tsx`** - Main voice interaction interface
- **`Avatar.tsx`** - Prof Julia's visual representation
- **`LessonCard.tsx`** - Interactive lesson display
- **`FrenchTutorEngine`** - Advanced pronunciation analysis

### API Routes

- **`/api/elevenlabs/tts`** - ElevenLabs text-to-speech integration
- Support for both standard and streaming TTS

### Tutoring Engine Features

- **Phonetic analysis** with French-specific pronunciation patterns
- **Word-level accuracy** tracking with visual feedback
- **Context-aware corrections** based on lesson content
- **Politeness detection** (tu/vous usage)
- **Progressive difficulty** through lesson steps

## 🎯 Lesson Structure

Each lesson follows a 60-90 second loop:

1. **Listen** - Introduction to scenario and target phrase
2. **Repeat** - Practice pronunciation with feedback
3. **Correct** - Address specific pronunciation issues
4. **Role-play** - Apply skills in realistic scenarios
5. **Reward** - Positive reinforcement and progress

### Built-in Scenarios

- **Café Ordering** - "Bonjour, je voudrais un croissant et un café, s'il vous plaît."
- **Metro Directions** - "Excusez-moi, où est la station de métro la plus proche?"
- **Bakery Shopping** - "Une baguette bien cuite, s'il vous plaît."

## 🤖 ElevenLabs Integration

Prof Julia uses ElevenLabs' multilingual voices for natural French pronunciation:

- **Primary Voice:** Bella (multilingual, excellent French accent)
- **Backup Voice:** Josh (multilingual)
- **Model:** `eleven_multilingual_v2` for optimal French pronunciation
- **Real-time streaming** for low-latency responses

## 🔧 Development

### Project Structure
```
src/
├── app/                    # Next.js app directory
│   ├── api/elevenlabs/    # TTS API routes
│   └── page.tsx           # Main app page
├── components/            # React components
│   ├── VoiceTutor.tsx    # Voice interaction
│   ├── Avatar.tsx        # Prof Julia avatar
│   └── LessonCard.tsx    # Lesson display
└── lib/
    └── frenchTutor.ts    # Tutoring engine
```

### Key Technologies

- **Next.js 15** with App Router
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **ElevenLabs SDK** for TTS
- **Web Speech API** for STT
- **Lucide Icons** for UI

## 🚧 Future Enhancements

### Advanced Features
- Speech-to-Speech pronunciation modeling
- LiveKit voice rooms for multi-user sessions
- Advanced phonetic analysis with IPA notation
- Progress tracking and adaptive difficulty

## 🎬 Demo Script

**Perfect for ElevenLabs interviews:**

1. **Show real-time voice generation** - Natural French accent
2. **Demonstrate pronunciation feedback** - Visual accuracy scores
3. **Highlight context awareness** - Different scenarios and grammar
4. **Showcase streaming capabilities** - Low-latency responses
5. **Display practical application** - Real learning scenarios

## 📝 API Usage

### ElevenLabs TTS Example
```typescript
const response = await fetch('/api/elevenlabs/tts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    text: 'Bonjour! Comment allez-vous?', 
    voice: 'french-female' 
  })
});
```

## 🔐 Environment Variables

```env
# Required
ELEVENLABS_API_KEY=your_api_key

# Optional (for future enhancements)
# DID_API_KEY=your_did_api_key
```

## 🤝 Contributing

This is a prototype project. For production use, consider:

- Error handling and fallbacks
- User authentication and progress storage
- Mobile responsiveness optimization
- Offline mode capabilities
- Analytics and learning metrics

## 📄 License

MIT License - Built for demonstration purposes

---

**Prof Julia** - Bringing French learning to life with AI! 🗣️🇫🇷

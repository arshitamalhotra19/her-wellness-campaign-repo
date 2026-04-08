import { useState } from 'react';
import { motion } from 'framer-motion';
import { storage } from '@/lib/storage';
import { Heart, Sun, Moon, Music, BookOpen, Flower2 } from 'lucide-react';

const moods = [
  { emoji: '😊', label: 'Great', color: 'bg-success/20 text-success' },
  { emoji: '🙂', label: 'Good', color: 'bg-info/20 text-info' },
  { emoji: '😐', label: 'Okay', color: 'bg-warning/20 text-warning' },
  { emoji: '😟', label: 'Worried', color: 'bg-warning/20 text-warning' },
  { emoji: '😢', label: 'Sad', color: 'bg-destructive/20 text-destructive' },
  { emoji: '😰', label: 'Anxious', color: 'bg-destructive/20 text-destructive' },
];

const suggestions: Record<string, { icon: typeof Heart; title: string; desc: string }[]> = {
  Great: [
    { icon: Sun, title: 'Keep the energy!', desc: 'Do something kind for yourself today — you deserve it! 🌸' },
    { icon: Heart, title: 'Spread the love', desc: 'Share your positivity with someone who needs it today.' },
  ],
  Good: [
    { icon: Flower2, title: 'Nature walk', desc: 'A short walk in nature can boost your mood even more.' },
    { icon: Music, title: 'Enjoy your tunes', desc: 'Put on your favorite playlist and enjoy the moment.' },
  ],
  Okay: [
    { icon: BookOpen, title: 'Journaling', desc: 'Write down 3 things you\'re grateful for today.' },
    { icon: Sun, title: 'Get some sun', desc: '10 minutes of sunlight can make a big difference.' },
  ],
  Worried: [
    { icon: Heart, title: 'Deep breathing', desc: 'Try 4-7-8 breathing: Inhale 4s, hold 7s, exhale 8s. Repeat 3 times.' },
    { icon: Moon, title: 'Guided meditation', desc: 'A 5-minute meditation can help calm anxious thoughts.' },
    { icon: BookOpen, title: 'Talk it out', desc: 'Reach out to a friend, family member, or our AI assistant.' },
  ],
  Sad: [
    { icon: Heart, title: 'Self-care time', desc: 'Take a warm bath, make your favorite tea, or do something comforting.' },
    { icon: Music, title: 'Uplifting music', desc: 'Music has the power to lift your spirits. Try something cheerful.' },
    { icon: Moon, title: 'Rest', desc: 'It\'s okay to rest. Your feelings are valid. 💕' },
  ],
  Anxious: [
    { icon: Heart, title: 'Ground yourself', desc: 'Try the 5-4-3-2-1 technique: 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste.' },
    { icon: Flower2, title: 'Progressive relaxation', desc: 'Tense and release each muscle group from toes to head.' },
    { icon: Moon, title: 'It\'s okay', desc: 'Remember: you\'re taking care of yourself, and that\'s brave. 💕' },
  ],
};

export default function MoodPage() {
  const savedMood = storage.get<string>('detecther_mood', '');
  const [selectedMood, setSelectedMood] = useState(savedMood);

  const handleSelect = (label: string) => {
    setSelectedMood(label);
    storage.set('detecther_mood', label);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-heading font-bold text-foreground mb-1">How are you feeling today?</h1>
        <p className="text-sm text-muted-foreground mb-6">Your emotional health matters. Let us support you. 💕</p>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-8">
          {moods.map(m => (
            <button
              key={m.label}
              onClick={() => handleSelect(m.label)}
              className={`rounded-xl p-4 text-center transition-all border-2 ${
                selectedMood === m.label ? 'border-primary bg-accent scale-105' : 'border-border hover:border-primary/40'
              }`}
            >
              <span className="text-3xl block mb-1">{m.emoji}</span>
              <span className="text-xs font-medium text-foreground">{m.label}</span>
            </button>
          ))}
        </div>

        {selectedMood && suggestions[selectedMood] && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <h2 className="font-heading font-bold text-foreground">Suggestions for you</h2>
            {suggestions[selectedMood].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                className="glass-card rounded-xl p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
                  <s.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-foreground text-sm">{s.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

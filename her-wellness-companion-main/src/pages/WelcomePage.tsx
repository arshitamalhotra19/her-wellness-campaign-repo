import { useState } from 'react';
import { motion } from 'framer-motion';
import { storage } from '@/lib/storage';

interface Props {
  onComplete: (name: string) => void;
}

export default function WelcomePage({ onComplete }: Props) {
  const [name, setName] = useState('');
  const [step, setStep] = useState<'ask' | 'greet'>('ask');

  const handleSubmit = () => {
    if (!name.trim()) return;
    storage.set('detecther_name', name.trim());
    setStep('greet');
    setTimeout(() => onComplete(name.trim()), 2000);
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <motion.div
        key={step}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-lg"
      >
        {step === 'ask' ? (
          <div className="glass-card rounded-2xl p-10 shadow-xl">
            <div className="text-5xl mb-6">🌸</div>
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Welcome to DetectHer</h1>
            <p className="text-muted-foreground mb-8">What should we call you?</p>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-center text-lg focus:outline-none focus:ring-2 focus:ring-ring mb-6"
              placeholder="Enter your name"
              autoFocus
            />
            <button
              onClick={handleSubmit}
              disabled={!name.trim()}
              className="gradient-primary text-primary-foreground rounded-xl px-8 py-3 font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-10 shadow-xl">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="text-6xl mb-6"
            >
              💕
            </motion.div>
            <h1 className="text-3xl font-heading font-bold text-foreground mb-3">
              Hello {name}!
            </h1>
            <p className="text-muted-foreground text-lg">
              I'm your cervical health assistant. Let's take care of your health together.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

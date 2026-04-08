import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { assessmentQuestions, calculateRiskScore } from '@/lib/ml-engine';
import { storage, type Assessment } from '@/lib/storage';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function AssessmentPage() {
  const navigate = useNavigate();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const categories = [...new Set(assessmentQuestions.map(q => q.category))];
  const q = assessmentQuestions[currentQ];
  const progress = ((currentQ + 1) / assessmentQuestions.length) * 100;

  const handleAnswer = (value: number) => {
    setAnswers(prev => ({ ...prev, [`q${currentQ}`]: value }));
  };

  const handleNext = () => {
    if (currentQ < assessmentQuestions.length - 1) {
      setCurrentQ(c => c + 1);
    } else {
      // Calculate and save
      const result = calculateRiskScore(answers);
      const assessment: Assessment = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        score: result.score,
        riskLevel: result.riskLevel,
        answers,
        factors: result.factors,
      };
      const existing = storage.get<Assessment[]>('detecther_assessments', []);
      storage.set('detecther_assessments', [...existing, assessment]);

      // Award badge
      const badges = storage.get<string[]>('detecther_badges', []);
      if (!badges.includes('🏅 Health Warrior')) {
        storage.set('detecther_badges', [...badges, '🏅 Health Warrior']);
      }

      navigate('/results', { state: { assessment } });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>{q.category}</span>
            <span>{currentQ + 1} of {assessmentQuestions.length}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div className="h-full gradient-primary rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
          </div>
          <div className="flex gap-1 mt-3 flex-wrap">
            {categories.map(cat => (
              <span key={cat} className={`text-[10px] px-2 py-0.5 rounded-full ${q.category === cat ? 'gradient-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-card rounded-2xl p-8"
          >
            <h2 className="text-xl font-heading font-bold text-foreground mb-6">{q.question}</h2>
            <div className="space-y-3">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt.value)}
                  className={`w-full text-left rounded-xl border-2 px-5 py-4 transition-all ${
                    answers[`q${currentQ}`] === opt.value
                      ? 'border-primary bg-accent'
                      : 'border-border hover:border-primary/40 hover:bg-muted/50'
                  }`}
                >
                  <span className="text-sm font-medium text-foreground">{opt.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => setCurrentQ(c => Math.max(0, c - 1))}
            disabled={currentQ === 0}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </button>
          <button
            onClick={handleNext}
            disabled={answers[`q${currentQ}`] === undefined}
            className="flex items-center gap-1 gradient-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 hover:opacity-90 transition-opacity"
          >
            {currentQ === assessmentQuestions.length - 1 ? 'Get Results' : 'Next'} <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

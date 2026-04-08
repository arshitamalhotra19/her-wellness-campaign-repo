import { useState } from 'react';
import { motion } from 'framer-motion';
import { symptomsList, quickSymptomScore } from '@/lib/ml-engine';
import { CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';

export default function SymptomCheckerPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [result, setResult] = useState<{ score: number; riskLevel: string } | null>(null);

  const toggle = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
    setResult(null);
  };

  const handleCheck = () => {
    setResult(quickSymptomScore(selected));
  };

  const colorClass = result?.riskLevel === 'low' ? 'text-success' : result?.riskLevel === 'moderate' ? 'text-warning' : 'text-destructive';
  const Icon = result?.riskLevel === 'low' ? CheckCircle : result?.riskLevel === 'moderate' ? AlertCircle : AlertTriangle;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-heading font-bold text-foreground mb-1">Symptom Checker</h1>
        <p className="text-sm text-muted-foreground mb-6">Select any symptoms you're currently experiencing for a quick risk assessment.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {symptomsList.map(s => (
            <button
              key={s.id}
              onClick={() => toggle(s.id)}
              className={`text-left rounded-xl border-2 px-4 py-3 transition-all text-sm ${
                selected.includes(s.id)
                  ? 'border-primary bg-accent font-semibold'
                  : 'border-border hover:border-primary/40'
              }`}
            >
              <span className="mr-2">{selected.includes(s.id) ? '✓' : '○'}</span>
              {s.label}
            </button>
          ))}
        </div>

        <button
          onClick={handleCheck}
          disabled={selected.length === 0}
          className="w-full mt-6 gradient-primary text-primary-foreground rounded-xl py-3 font-semibold text-sm disabled:opacity-50 hover:opacity-90 transition-opacity"
        >
          Check Risk Level
        </button>

        {result && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 glass-card rounded-xl p-6 text-center">
            <Icon className={`h-10 w-10 mx-auto mb-3 ${colorClass}`} />
            <p className={`text-4xl font-bold ${colorClass}`}>{result.score}/50</p>
            <p className={`text-lg font-heading font-bold capitalize mt-1 ${colorClass}`}>{result.riskLevel} Risk</p>
            <p className="text-xs text-muted-foreground mt-3">This is a simplified check. For a comprehensive assessment, please use our full Assessment tool.</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { storage, type Assessment } from '@/lib/storage';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Activity, Salad, Droplets, Dumbbell, Ban, Pill } from 'lucide-react';

interface SimToggle {
  id: string;
  label: string;
  desc: string;
  icon: typeof Sparkles;
  reduction: number; // percentage of score that gets reduced
}

const simToggles: SimToggle[] = [
  { id: 'hygiene', label: 'Improve Hygiene', desc: 'Adopt regular intimate hygiene routine', icon: Droplets, reduction: 12 },
  { id: 'diet', label: 'Better Diet', desc: 'Eat 5+ servings of fruits & vegetables daily', icon: Salad, reduction: 8 },
  { id: 'exercise', label: 'Regular Exercise', desc: 'At least 30 min of activity 5 days/week', icon: Dumbbell, reduction: 6 },
  { id: 'smoking', label: 'Quit Smoking', desc: 'Stop all tobacco and nicotine products', icon: Ban, reduction: 15 },
  { id: 'screening', label: 'Regular Screenings', desc: 'Annual Pap smear and HPV testing', icon: Activity, reduction: 18 },
  { id: 'supplements', label: 'Take Supplements', desc: 'Vitamin C, D, and folic acid daily', icon: Pill, reduction: 5 },
];

export default function BehaviorSimulatorPage() {
  const assessments = storage.get<Assessment[]>('detecther_assessments', []);
  const latest = assessments[assessments.length - 1];
  const [active, setActive] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setActive(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const { newScore, reduction } = useMemo(() => {
    if (!latest) return { newScore: 0, reduction: 0 };
    const totalReduction = simToggles
      .filter(t => active.has(t.id))
      .reduce((sum, t) => sum + t.reduction, 0);
    const reductionPoints = Math.round((latest.score * Math.min(totalReduction, 60)) / 100);
    return { newScore: Math.max(0, latest.score - reductionPoints), reduction: reductionPoints };
  }, [latest, active]);

  const getRiskLevel = (s: number) => s <= 15 ? 'low' : s <= 30 ? 'moderate' : 'high';
  const getColor = (l: string) => l === 'low' ? 'text-success' : l === 'moderate' ? 'text-warning' : 'text-destructive';

  if (!latest) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-heading font-bold text-foreground mb-2">No Assessment Data</h2>
        <p className="text-muted-foreground text-sm mb-4">Complete an assessment first to simulate lifestyle changes.</p>
        <Link to="/assessment" className="gradient-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-semibold inline-block">Take Assessment</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-heading font-bold text-foreground mb-1">🔁 Behavior Impact Simulator</h1>
        <p className="text-sm text-muted-foreground">See how lifestyle changes could lower your risk score</p>
      </motion.div>

      {/* Score comparison */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-center gap-6 flex-wrap">
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Current Score</p>
            <p className={`text-5xl font-bold ${getColor(latest.riskLevel)}`}>{latest.score}</p>
            <p className={`text-sm font-semibold capitalize ${getColor(latest.riskLevel)}`}>{latest.riskLevel} Risk</p>
          </div>
          <motion.div animate={{ scale: active.size > 0 ? [1, 1.2, 1] : 1 }} transition={{ duration: 0.3 }}>
            <ArrowRight className="h-8 w-8 text-primary" />
          </motion.div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Projected Score</p>
            <motion.p key={newScore} initial={{ scale: 0.8 }} animate={{ scale: 1 }}
              className={`text-5xl font-bold ${getColor(getRiskLevel(newScore))}`}>
              {newScore}
            </motion.p>
            <p className={`text-sm font-semibold capitalize ${getColor(getRiskLevel(newScore))}`}>{getRiskLevel(newScore)} Risk</p>
          </div>
        </div>
        {reduction > 0 && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center mt-4 text-sm font-semibold text-success">
            ✨ Your risk could reduce by {reduction} points!
          </motion.p>
        )}
      </motion.div>

      {/* Toggle Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {simToggles.map((item, i) => {
          const isActive = active.has(item.id);
          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              onClick={() => toggle(item.id)}
              className={`text-left rounded-2xl border-2 p-5 transition-all ${
                isActive
                  ? 'border-primary bg-accent shadow-md'
                  : 'border-border glass-card hover:border-primary/40'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isActive ? 'gradient-primary' : 'bg-muted'
                }`}>
                  <item.icon className={`h-5 w-5 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-heading font-bold text-sm text-foreground">{item.label}</h3>
                    <span className={`text-xs font-bold ${isActive ? 'text-success' : 'text-muted-foreground'}`}>
                      -{item.reduction}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </div>
              {/* Toggle indicator */}
              <div className={`mt-3 h-1.5 rounded-full transition-all ${isActive ? 'bg-primary' : 'bg-border'}`}>
                <motion.div animate={{ width: isActive ? '100%' : '0%' }}
                  className="h-full rounded-full bg-success" />
              </div>
            </motion.button>
          );
        })}
      </div>

      <p className="text-center text-[10px] text-muted-foreground">Simulations are estimates and do not guarantee outcomes. Consult a doctor for personalized advice.</p>
    </div>
  );
}

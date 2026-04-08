import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { type Assessment } from '@/lib/storage';
import { assessmentQuestions } from '@/lib/ml-engine';
import { AlertTriangle, CheckCircle, AlertCircle, ArrowLeft, UserCheck, TrendingUp, Sparkles } from 'lucide-react';

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const assessment = (location.state as { assessment?: Assessment })?.assessment;

  if (!assessment) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">No results to display.</p>
        <Link to="/assessment" className="text-primary font-semibold mt-2 inline-block">Take Assessment →</Link>
      </div>
    );
  }

  const { score, riskLevel, factors, answers } = assessment;
  const colorClass = riskLevel === 'low' ? 'text-success' : riskLevel === 'moderate' ? 'text-warning' : 'text-destructive';
  const bgClass = riskLevel === 'low' ? 'bg-success/10 border-success/30' : riskLevel === 'moderate' ? 'bg-warning/10 border-warning/30' : 'bg-destructive/10 border-destructive/30';
  const Icon = riskLevel === 'low' ? CheckCircle : riskLevel === 'moderate' ? AlertCircle : AlertTriangle;

  const explanations: Record<string, string> = {
    low: "Great news! Your responses suggest a low risk level. Continue maintaining healthy habits and keep up with regular screenings.",
    moderate: "Your results indicate a moderate risk level. Consider scheduling a cervical screening and discussing your health with a doctor.",
    high: "Your results indicate a higher risk level. We strongly recommend consulting with a healthcare professional as soon as possible.",
  };

  // Calculate category contributions for Explainable AI
  const categoryContributions: { category: string; contribution: number; maxContribution: number }[] = [];
  const categoryMap = new Map<string, { raw: number; max: number }>();
  assessmentQuestions.forEach((q, i) => {
    const val = answers[`q${i}`] ?? 0;
    const weighted = val * q.weight;
    const maxW = 4 * q.weight;
    const existing = categoryMap.get(q.category) || { raw: 0, max: 0 };
    categoryMap.set(q.category, { raw: existing.raw + weighted, max: existing.max + maxW });
  });
  const totalRaw = Array.from(categoryMap.values()).reduce((s, v) => s + v.raw, 0);
  categoryMap.forEach((v, cat) => {
    const pct = totalRaw > 0 ? Math.round((v.raw / totalRaw) * 100) : 0;
    categoryContributions.push({ category: cat, contribution: pct, maxContribution: Math.round((v.max / Array.from(categoryMap.values()).reduce((s, x) => s + x.max, 0)) * 100) });
  });
  categoryContributions.sort((a, b) => b.contribution - a.contribution);

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </button>

        {/* Score Card */}
        <div className={`rounded-2xl border p-8 text-center ${bgClass}`}>
          <Icon className={`h-12 w-12 mx-auto mb-4 ${colorClass}`} />
          <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wide">Your Risk Score</p>
          <p className={`text-6xl font-bold ${colorClass}`}>{score}<span className="text-2xl text-muted-foreground">/50</span></p>
          <p className={`text-xl font-heading font-bold capitalize mt-2 ${colorClass}`}>{riskLevel} Risk</p>
        </div>

        {/* Explanation */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="font-heading font-bold text-foreground mb-2">What does this mean?</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{explanations[riskLevel]}</p>
        </div>

        {/* Explainable AI - Category Breakdown */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="font-heading font-bold text-foreground mb-1">🧬 AI Risk Breakdown</h3>
          <p className="text-xs text-muted-foreground mb-4">Percentage contribution of each category to your risk score</p>
          <div className="space-y-3">
            {categoryContributions.map(cat => (
              <div key={cat.category}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-foreground font-medium">{cat.category}</span>
                  <span className="font-bold text-primary">{cat.contribution}%</span>
                </div>
                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.contribution}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="h-full rounded-full gradient-primary"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contributing Factors */}
        {factors.length > 0 && (
          <div className="glass-card rounded-xl p-6">
            <h3 className="font-heading font-bold text-foreground mb-3">Why this result?</h3>
            <p className="text-xs text-muted-foreground mb-3">Top contributing factors based on your answers:</p>
            <ul className="space-y-2">
              {factors.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <span className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center text-xs text-primary-foreground font-bold">{i + 1}</span>
                  <span className="text-foreground">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link to="/doctors" className="flex items-center justify-center gap-2 gradient-primary text-primary-foreground rounded-xl py-3 font-semibold text-xs hover:opacity-90 transition-opacity">
            <UserCheck className="h-4 w-4" /> Find Doctor
          </Link>
          <Link to="/prediction" className="flex items-center justify-center gap-2 border border-primary text-primary rounded-xl py-3 font-semibold text-xs hover:bg-accent transition-colors">
            <TrendingUp className="h-4 w-4" /> Prediction
          </Link>
          <Link to="/simulator" className="flex items-center justify-center gap-2 border border-primary text-primary rounded-xl py-3 font-semibold text-xs hover:bg-accent transition-colors">
            <Sparkles className="h-4 w-4" /> Simulator
          </Link>
          <Link to="/history" className="flex items-center justify-center gap-2 bg-muted text-foreground rounded-xl py-3 font-semibold text-xs hover:bg-muted/80 transition-colors">
            History
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

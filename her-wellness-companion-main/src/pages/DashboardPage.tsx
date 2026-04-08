import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ClipboardCheck, Stethoscope, MessageCircle, UserCheck,
  History, BookOpen, Shield, Bell, Heart, AlertTriangle,
  TrendingUp, Sparkles, TrendingDown, Minus,
} from 'lucide-react';
import { storage, type Assessment } from '@/lib/storage';

const cards = [
  { title: 'Start Assessment', desc: 'Comprehensive health risk assessment', icon: ClipboardCheck, url: '/assessment', color: 'from-primary to-pink-400' },
  { title: 'Symptom Checker', desc: 'Quick symptom-based risk check', icon: Stethoscope, url: '/symptoms', color: 'from-pink-400 to-rose-300' },
  { title: 'Risk Prediction', desc: 'AI-powered future risk forecast', icon: TrendingUp, url: '/prediction', color: 'from-rose-300 to-orange-300' },
  { title: 'Behavior Simulator', desc: 'See how changes lower your risk', icon: Sparkles, url: '/simulator', color: 'from-orange-300 to-amber-300' },
  { title: 'AI Assistant', desc: 'Chat about cervical health', icon: MessageCircle, url: '/chatbot', color: 'from-pink-300 to-rose-200' },
  { title: 'Doctor Connect', desc: 'Find and book appointments', icon: UserCheck, url: '/doctors', color: 'from-rose-200 to-pink-200' },
  { title: 'Health History', desc: 'View past assessments', icon: History, url: '/history', color: 'from-pink-200 to-rose-100' },
  { title: 'Awareness Hub', desc: 'Learn about cervical cancer', icon: BookOpen, url: '/awareness', color: 'from-rose-100 to-pink-50' },
];

function getTrend(assessments: Assessment[]): 'increasing' | 'decreasing' | 'stable' {
  if (assessments.length < 2) return 'stable';
  const scores = assessments.map(a => a.score);
  const n = scores.length;
  const xMean = (n - 1) / 2;
  const yMean = scores.reduce((a, b) => a + b, 0) / n;
  let num = 0, den = 0;
  scores.forEach((y, x) => { num += (x - xMean) * (y - yMean); den += (x - xMean) ** 2; });
  const slope = den !== 0 ? num / den : 0;
  return slope > 0.5 ? 'increasing' : slope < -0.5 ? 'decreasing' : 'stable';
}

export default function DashboardPage() {
  const name = storage.get<string>('detecther_name', 'User');
  const assessments = storage.get<Assessment[]>('detecther_assessments', []);
  const latest = assessments[assessments.length - 1];
  const badges = storage.get<string[]>('detecther_badges', []);
  const trend = getTrend(assessments);
  const TrendIcon = trend === 'increasing' ? TrendingUp : trend === 'decreasing' ? TrendingDown : Minus;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="gradient-soft rounded-2xl p-8">
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Welcome back, {name}! 💕</h1>
        <p className="text-muted-foreground">Your AI-powered cervical health intelligence dashboard.</p>
      </motion.div>

      {/* Quick Stats */}
      {latest && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-card rounded-xl p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Latest Risk Score</p>
            <p className={`text-3xl font-bold ${latest.riskLevel === 'low' ? 'text-success' : latest.riskLevel === 'moderate' ? 'text-warning' : 'text-destructive'}`}>
              {latest.score}/50
            </p>
          </div>
          <div className="glass-card rounded-xl p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Risk Level</p>
            <p className={`text-lg font-bold capitalize ${latest.riskLevel === 'low' ? 'text-success' : latest.riskLevel === 'moderate' ? 'text-warning' : 'text-destructive'}`}>
              {latest.riskLevel}
            </p>
          </div>
          <div className="glass-card rounded-xl p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Assessments</p>
            <p className="text-3xl font-bold text-foreground">{assessments.length}</p>
          </div>
          <div className="glass-card rounded-xl p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Risk Trend</p>
            <div className="flex items-center gap-2">
              <TrendIcon className={`h-5 w-5 ${trend === 'increasing' ? 'text-destructive' : trend === 'decreasing' ? 'text-success' : 'text-warning'}`} />
              <p className={`text-lg font-bold capitalize ${trend === 'increasing' ? 'text-destructive' : trend === 'decreasing' ? 'text-success' : 'text-warning'}`}>
                {trend}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Early Warning */}
      {trend === 'increasing' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-destructive/10 border border-destructive/30 rounded-xl p-5 flex items-start gap-3">
          <AlertTriangle className="h-6 w-6 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-destructive">⚠️ Early Warning: Rising Risk Trend</h3>
            <p className="text-sm text-destructive/80">Your risk score has been increasing across assessments. Please consult a healthcare professional.</p>
            <div className="flex gap-3 mt-2">
              <Link to="/doctors" className="text-sm font-semibold text-destructive underline">Find a Doctor →</Link>
              <Link to="/prediction" className="text-sm font-semibold text-destructive underline">View Prediction →</Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* High Risk Alert */}
      {latest?.riskLevel === 'high' && trend !== 'increasing' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-destructive/10 border border-destructive/30 rounded-xl p-5 flex items-start gap-3">
          <AlertTriangle className="h-6 w-6 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-destructive">Please consult a doctor immediately</h3>
            <p className="text-sm text-destructive/80">Your latest assessment indicates a high risk.</p>
            <Link to="/doctors" className="inline-block mt-2 text-sm font-semibold text-destructive underline">Find a Doctor →</Link>
          </div>
        </motion.div>
      )}

      {/* Badges */}
      {badges.length > 0 && (
        <div className="glass-card rounded-xl p-5">
          <h3 className="font-heading font-bold text-foreground mb-3 flex items-center gap-2">
            <Heart className="h-4 w-4 text-primary" /> Your Badges
          </h3>
          <div className="flex gap-3 flex-wrap">
            {badges.map((b, i) => (
              <span key={i} className="gradient-primary text-primary-foreground text-xs px-3 py-1.5 rounded-full font-semibold">{b}</span>
            ))}
          </div>
        </div>
      )}

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.url}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link to={card.url} className="group block glass-card rounded-xl p-5 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center mb-3`}>
                <card.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="font-heading font-bold text-foreground group-hover:text-primary transition-colors">{card.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{card.desc}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground py-4">
        ⚠️ This app does not provide medical diagnosis. Please consult a doctor for professional advice.
      </p>
    </div>
  );
}

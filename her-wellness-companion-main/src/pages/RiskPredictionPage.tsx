import { motion } from 'framer-motion';
import { storage, type Assessment } from '@/lib/storage';
import { TrendingUp, TrendingDown, Minus, Calendar, AlertTriangle, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function predictFutureRisk(assessments: Assessment[]): { sixMonth: number; oneYear: number; trend: 'increasing' | 'decreasing' | 'stable' } {
  if (assessments.length === 0) return { sixMonth: 0, oneYear: 0, trend: 'stable' };
  if (assessments.length === 1) {
    const s = assessments[0].score;
    return { sixMonth: Math.min(50, Math.round(s * 1.05)), oneYear: Math.min(50, Math.round(s * 1.1)), trend: 'stable' };
  }

  const scores = assessments.map(a => a.score);
  const n = scores.length;
  const xMean = (n - 1) / 2;
  const yMean = scores.reduce((a, b) => a + b, 0) / n;
  let num = 0, den = 0;
  scores.forEach((y, x) => { num += (x - xMean) * (y - yMean); den += (x - xMean) ** 2; });
  const slope = den !== 0 ? num / den : 0;
  const intercept = yMean - slope * xMean;

  const sixMonth = Math.min(50, Math.max(0, Math.round(intercept + slope * (n + 2))));
  const oneYear = Math.min(50, Math.max(0, Math.round(intercept + slope * (n + 5))));
  const trend = slope > 0.5 ? 'increasing' : slope < -0.5 ? 'decreasing' : 'stable';

  return { sixMonth, oneYear, trend };
}

function getRiskLevel(score: number): 'low' | 'moderate' | 'high' {
  return score <= 15 ? 'low' : score <= 30 ? 'moderate' : 'high';
}

export default function RiskPredictionPage() {
  const assessments = storage.get<Assessment[]>('detecther_assessments', []);
  const { sixMonth, oneYear, trend } = predictFutureRisk(assessments);
  const latest = assessments[assessments.length - 1];

  const chartData = [
    ...assessments.map((a, i) => ({
      name: `Assessment ${i + 1}`,
      score: a.score,
      type: 'actual',
    })),
    { name: '6 Months', score: sixMonth, type: 'predicted' },
    { name: '1 Year', score: oneYear, type: 'predicted' },
  ];

  const TrendIcon = trend === 'increasing' ? TrendingUp : trend === 'decreasing' ? TrendingDown : Minus;
  const trendColor = trend === 'increasing' ? 'text-destructive' : trend === 'decreasing' ? 'text-success' : 'text-warning';

  if (assessments.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-heading font-bold text-foreground mb-2">No Data Yet</h2>
        <p className="text-muted-foreground text-sm mb-4">Complete at least one assessment to see your risk predictions.</p>
        <Link to="/assessment" className="gradient-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-semibold inline-block">Take Assessment</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-heading font-bold text-foreground mb-1">🔮 Risk Prediction</h1>
        <p className="text-sm text-muted-foreground">AI-powered future risk analysis based on your health trends</p>
      </motion.div>

      {/* Trend Overview */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass-card rounded-2xl p-6 flex items-center gap-4">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${trend === 'increasing' ? 'bg-destructive/10' : trend === 'decreasing' ? 'bg-success/10' : 'bg-warning/10'}`}>
          <TrendIcon className={`h-7 w-7 ${trendColor}`} />
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Overall Trend</p>
          <p className={`text-lg font-bold capitalize ${trendColor}`}>{trend}</p>
          <p className="text-xs text-muted-foreground">Based on {assessments.length} assessment{assessments.length > 1 ? 's' : ''}</p>
        </div>
      </motion.div>

      {/* Prediction Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="glass-card rounded-2xl p-6 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Current Score</p>
          <p className={`text-4xl font-bold ${latest.riskLevel === 'low' ? 'text-success' : latest.riskLevel === 'moderate' ? 'text-warning' : 'text-destructive'}`}>
            {latest.score}<span className="text-lg text-muted-foreground">/50</span>
          </p>
          <p className={`text-sm font-semibold capitalize mt-1 ${latest.riskLevel === 'low' ? 'text-success' : latest.riskLevel === 'moderate' ? 'text-warning' : 'text-destructive'}`}>
            {latest.riskLevel} Risk
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-6 text-center border-2 border-primary/20">
          <div className="flex items-center justify-center gap-1 mb-2">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <p className="text-xs text-muted-foreground uppercase tracking-wide">6-Month Prediction</p>
          </div>
          <p className={`text-4xl font-bold ${getRiskLevel(sixMonth) === 'low' ? 'text-success' : getRiskLevel(sixMonth) === 'moderate' ? 'text-warning' : 'text-destructive'}`}>
            {sixMonth}<span className="text-lg text-muted-foreground">/50</span>
          </p>
          <p className={`text-sm font-semibold capitalize mt-1 ${getRiskLevel(sixMonth) === 'low' ? 'text-success' : getRiskLevel(sixMonth) === 'moderate' ? 'text-warning' : 'text-destructive'}`}>
            {getRiskLevel(sixMonth)} Risk
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="glass-card rounded-2xl p-6 text-center border-2 border-primary/20">
          <div className="flex items-center justify-center gap-1 mb-2">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <p className="text-xs text-muted-foreground uppercase tracking-wide">1-Year Prediction</p>
          </div>
          <p className={`text-4xl font-bold ${getRiskLevel(oneYear) === 'low' ? 'text-success' : getRiskLevel(oneYear) === 'moderate' ? 'text-warning' : 'text-destructive'}`}>
            {oneYear}<span className="text-lg text-muted-foreground">/50</span>
          </p>
          <p className={`text-sm font-semibold capitalize mt-1 ${getRiskLevel(oneYear) === 'low' ? 'text-success' : getRiskLevel(oneYear) === 'moderate' ? 'text-warning' : 'text-destructive'}`}>
            {getRiskLevel(oneYear)} Risk
          </p>
        </motion.div>
      </div>

      {/* Trend Chart */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="glass-card rounded-2xl p-6">
        <h3 className="font-heading font-bold text-foreground mb-4">Risk Trajectory</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(340, 75%, 55%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(340, 75%, 55%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
              <YAxis domain={[0, 50]} tick={{ fontSize: 11 }} className="fill-muted-foreground" />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid hsl(340,20%,90%)', fontSize: 12 }} />
              <Area type="monotone" dataKey="score" stroke="hsl(340, 75%, 55%)" fill="url(#riskGrad)" strokeWidth={2.5} dot={{ r: 4, fill: 'hsl(340, 75%, 55%)' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-primary" /> Actual</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-primary/40 border border-primary border-dashed" /> Predicted</span>
        </div>
      </motion.div>

      {/* Warning */}
      {trend === 'increasing' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
          className="bg-destructive/10 border border-destructive/30 rounded-xl p-5 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-destructive text-sm">⚠️ Rising Risk Trend Detected</h3>
            <p className="text-xs text-destructive/80 mt-1">Your risk score has been increasing. Please consult a healthcare professional and consider lifestyle changes.</p>
            <Link to="/doctors" className="text-xs font-semibold text-destructive underline mt-2 inline-block">Find a Doctor →</Link>
          </div>
        </motion.div>
      )}

      <p className="text-center text-[10px] text-muted-foreground">Predictions are based on trend analysis and are not medical diagnoses.</p>
    </div>
  );
}

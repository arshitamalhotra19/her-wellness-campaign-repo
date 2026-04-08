import { motion } from 'framer-motion';
import { storage, type Assessment } from '@/lib/storage';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function HealthHistoryPage() {
  const assessments = storage.get<Assessment[]>('detecther_assessments', []);

  const chartData = assessments.map((a, i) => ({
    name: `#${i + 1}`,
    score: a.score,
    date: new Date(a.date).toLocaleDateString(),
  }));

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-heading font-bold text-foreground mb-1">Health History</h1>
        <p className="text-sm text-muted-foreground mb-6">Track your assessment history over time.</p>

        {assessments.length === 0 ? (
          <div className="glass-card rounded-xl p-10 text-center">
            <p className="text-muted-foreground mb-4">No assessments yet. Take your first assessment to start tracking!</p>
            <Link to="/assessment" className="gradient-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity inline-block">
              Start Assessment
            </Link>
          </div>
        ) : (
          <>
            {/* Chart */}
            {assessments.length > 1 && (
              <div className="glass-card rounded-xl p-5">
                <h3 className="font-heading font-bold text-foreground mb-4">Score Trend</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(340, 20%, 90%)" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(340, 10%, 50%)" />
                      <YAxis domain={[0, 50]} tick={{ fontSize: 12 }} stroke="hsl(340, 10%, 50%)" />
                      <Tooltip
                        contentStyle={{ borderRadius: '12px', border: '1px solid hsl(340, 20%, 90%)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        formatter={(value: number) => [`${value}/50`, 'Score']}
                      />
                      <Line type="monotone" dataKey="score" stroke="hsl(340, 75%, 55%)" strokeWidth={2.5} dot={{ fill: 'hsl(340, 75%, 55%)', r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* List */}
            <div className="space-y-3">
              {[...assessments].reverse().map((a, i) => {
                const colorClass = a.riskLevel === 'low' ? 'text-success' : a.riskLevel === 'moderate' ? 'text-warning' : 'text-destructive';
                return (
                  <motion.div key={a.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                    className="glass-card rounded-xl p-5 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{new Date(a.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      <p className="text-xs text-muted-foreground mt-1">{a.factors.slice(0, 3).join(' · ')}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${colorClass}`}>{a.score}/50</p>
                      <p className={`text-xs font-semibold capitalize ${colorClass}`}>{a.riskLevel}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

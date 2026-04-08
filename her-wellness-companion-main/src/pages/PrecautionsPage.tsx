import { motion } from 'framer-motion';
import { storage, type Assessment } from '@/lib/storage';
import { Link } from 'react-router-dom';
import { Shield, Heart, Utensils, Activity, Stethoscope } from 'lucide-react';

const basePrecautions = [
  { icon: Shield, title: 'Get Vaccinated', desc: 'Ensure you are up to date with the HPV vaccine for maximum protection.' },
  { icon: Stethoscope, title: 'Regular Screenings', desc: 'Schedule Pap smears every 3 years (ages 21-29) or every 5 years with HPV co-testing (ages 30-65).' },
  { icon: Heart, title: 'Practice Safe Sex', desc: 'Use protection and limit number of sexual partners to reduce HPV transmission risk.' },
  { icon: Utensils, title: 'Healthy Diet', desc: 'Eat plenty of fruits, vegetables, and foods rich in antioxidants to support your immune system.' },
  { icon: Activity, title: 'Stay Active', desc: 'Regular exercise boosts your immune system and overall well-being.' },
];

const riskPrecautions: Record<string, { title: string; desc: string }[]> = {
  'No HPV vaccination': [{ title: 'Schedule HPV Vaccination', desc: 'Talk to your doctor about getting the HPV vaccine as soon as possible.' }],
  'Irregular cervical screening': [{ title: 'Book a Screening Now', desc: 'Schedule a Pap smear or HPV test. Regular screening is your best defense.' }],
  'Smoking/tobacco use': [{ title: 'Quit Smoking', desc: 'Smoking weakens your immune system. Seek support programs to help you quit.' }],
  'Abnormal bleeding patterns': [{ title: 'See a Doctor', desc: 'Unusual bleeding should always be evaluated by a healthcare professional.' }],
  'Unusual vaginal discharge': [{ title: 'Medical Evaluation', desc: 'Persistent unusual discharge warrants a medical check-up.' }],
  'Multiple sexual partners': [{ title: 'Regular STI Testing', desc: 'Get regular STI screenings and always practice safe sex.' }],
  'History of STIs': [{ title: 'Follow-up Care', desc: 'Ensure all STIs are properly treated and schedule regular follow-up screenings.' }],
  'Pelvic pain': [{ title: 'Medical Assessment', desc: 'Persistent pelvic pain should be evaluated. Schedule an appointment with your gynecologist.' }],
  'Family history of cancer': [{ title: 'Enhanced Monitoring', desc: 'With a family history, more frequent screenings may be recommended. Discuss with your doctor.' }],
};

export default function PrecautionsPage() {
  const assessments = storage.get<Assessment[]>('detecther_assessments', []);
  const latest = assessments[assessments.length - 1];
  const personalizedTips = latest?.factors.flatMap(f => riskPrecautions[f] || []) || [];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-heading font-bold text-foreground mb-1">Precautions</h1>
        <p className="text-sm text-muted-foreground mb-6">Personalized health tips based on your profile.</p>

        {personalizedTips.length > 0 && (
          <div className="mb-8">
            <h2 className="font-heading font-bold text-foreground mb-3 text-lg flex items-center gap-2">
              🎯 Personalized for You
            </h2>
            <div className="space-y-3">
              {personalizedTips.map((tip, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="bg-accent/50 border border-primary/20 rounded-xl p-5">
                  <h3 className="font-heading font-bold text-foreground text-sm">{tip.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{tip.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {!latest && (
          <div className="glass-card rounded-xl p-6 mb-6 text-center">
            <p className="text-sm text-muted-foreground mb-3">Take an assessment to get personalized precautions!</p>
            <Link to="/assessment" className="gradient-primary text-primary-foreground px-6 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity inline-block">
              Start Assessment
            </Link>
          </div>
        )}

        <h2 className="font-heading font-bold text-foreground mb-3 text-lg">General Precautions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {basePrecautions.map((p, i) => (
            <motion.div key={p.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass-card rounded-xl p-5">
              <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center mb-3">
                <p.icon className="h-4 w-4 text-primary-foreground" />
              </div>
              <h3 className="font-heading font-bold text-foreground text-sm">{p.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

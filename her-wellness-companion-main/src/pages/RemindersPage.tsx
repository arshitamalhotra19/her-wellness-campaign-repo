import { useState } from 'react';
import { motion } from 'framer-motion';
import { storage, type Reminder } from '@/lib/storage';
import { Plus, Trash2, Check, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>(storage.get<Reminder[]>('detecther_reminders', []));
  const [showAdd, setShowAdd] = useState(false);
  const [newReminder, setNewReminder] = useState({ title: '', date: '', type: 'checkup' as 'period' | 'checkup' });

  const save = (updated: Reminder[]) => {
    setReminders(updated);
    storage.set('detecther_reminders', updated);
  };

  const handleAdd = () => {
    if (!newReminder.title || !newReminder.date) return;
    const reminder: Reminder = { id: Date.now().toString(), ...newReminder, completed: false };
    save([...reminders, reminder]);
    setNewReminder({ title: '', date: '', type: 'checkup' });
    setShowAdd(false);
    toast.success('Reminder added!');
  };

  const toggleComplete = (id: string) => {
    save(reminders.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
  };

  const handleDelete = (id: string) => {
    save(reminders.filter(r => r.id !== id));
    toast.success('Reminder deleted');
  };

  const upcoming = reminders.filter(r => !r.completed).sort((a, b) => a.date.localeCompare(b.date));
  const completed = reminders.filter(r => r.completed);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">Reminders</h1>
            <p className="text-sm text-muted-foreground">Keep track of your health appointments and cycles.</p>
          </div>
          <button onClick={() => setShowAdd(!showAdd)} className="gradient-primary text-primary-foreground rounded-xl px-4 py-2.5 text-sm font-semibold flex items-center gap-1 hover:opacity-90 transition-opacity">
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>

        {showAdd && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-5 mb-6">
            <div className="space-y-3">
              <input
                value={newReminder.title}
                onChange={e => setNewReminder(r => ({ ...r, title: e.target.value }))}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Reminder title (e.g., Period due, Pap smear appointment)"
              />
              <input
                type="date"
                value={newReminder.date}
                onChange={e => setNewReminder(r => ({ ...r, date: e.target.value }))}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <div className="flex gap-2">
                {(['period', 'checkup'] as const).map(t => (
                  <button key={t} onClick={() => setNewReminder(r => ({ ...r, type: t }))}
                    className={`text-xs px-4 py-2 rounded-lg border capitalize transition-all ${newReminder.type === t ? 'border-primary bg-accent font-semibold' : 'border-border'}`}>
                    {t === 'period' ? '🩸 Period' : '🏥 Health Check'}
                  </button>
                ))}
              </div>
              <button onClick={handleAdd} disabled={!newReminder.title || !newReminder.date}
                className="gradient-primary text-primary-foreground rounded-xl px-6 py-2.5 text-sm font-semibold disabled:opacity-50 hover:opacity-90 transition-opacity">
                Save Reminder
              </button>
            </div>
          </motion.div>
        )}

        {upcoming.length > 0 && (
          <div>
            <h3 className="font-heading font-bold text-foreground mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" /> Upcoming
            </h3>
            <div className="space-y-2">
              {upcoming.map(r => (
                <motion.div key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-xl px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button onClick={() => toggleComplete(r.id)} className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center hover:bg-accent transition-colors" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{r.title}</p>
                      <p className="text-xs text-muted-foreground">{new Date(r.date).toLocaleDateString()} · {r.type === 'period' ? '🩸' : '🏥'} {r.type}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(r.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {completed.length > 0 && (
          <div className="mt-6">
            <h3 className="font-heading font-bold text-muted-foreground mb-3">Completed</h3>
            <div className="space-y-2">
              {completed.map(r => (
                <div key={r.id} className="glass-card rounded-xl px-4 py-3 flex items-center justify-between opacity-60">
                  <div className="flex items-center gap-3">
                    <button onClick={() => toggleComplete(r.id)} className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </button>
                    <p className="text-sm text-foreground line-through">{r.title}</p>
                  </div>
                  <button onClick={() => handleDelete(r.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {reminders.length === 0 && !showAdd && (
          <div className="glass-card rounded-xl p-10 text-center">
            <Calendar className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground">No reminders yet. Add your first one!</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

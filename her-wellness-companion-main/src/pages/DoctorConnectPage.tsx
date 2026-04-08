import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { doctors, type Doctor } from '@/lib/doctors-data';
import { storage, type Appointment } from '@/lib/storage';
import { Star, MapPin, Phone, Clock, X, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function DoctorConnectPage() {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [booking, setBooking] = useState<{ day: string; time: string; notes: string }>({ day: '', time: '', notes: '' });
  const [askQuestion, setAskQuestion] = useState<{ doctor: Doctor; question: string } | null>(null);

  const handleBook = () => {
    if (!selectedDoctor || !booking.day || !booking.time) return;
    const appt: Appointment = {
      id: Date.now().toString(),
      doctorName: selectedDoctor.name,
      doctorSpecialty: selectedDoctor.specialty,
      date: booking.day,
      time: booking.time,
      notes: booking.notes,
    };
    const existing = storage.get<Appointment[]>('detecther_appointments', []);
    storage.set('detecther_appointments', [...existing, appt]);
    toast.success(`Appointment booked with ${selectedDoctor.name}!`);
    setSelectedDoctor(null);
    setBooking({ day: '', time: '', notes: '' });
  };

  const handleAskQuestion = () => {
    if (!askQuestion?.question.trim()) return;
    toast.success("Your question has been submitted! The doctor will respond shortly.");
    setAskQuestion(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-heading font-bold text-foreground mb-1">Doctor Connect</h1>
        <p className="text-sm text-muted-foreground mb-6">Find and book appointments with cervical health specialists.</p>

        {/* Appointments */}
        {(() => {
          const appts = storage.get<Appointment[]>('detecther_appointments', []);
          if (appts.length === 0) return null;
          return (
            <div className="glass-card rounded-xl p-5 mb-6">
              <h3 className="font-heading font-bold text-foreground mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" /> Your Appointments
              </h3>
              <div className="space-y-2">
                {appts.map(a => (
                  <div key={a.id} className="flex items-center justify-between bg-accent/50 rounded-lg px-4 py-3 text-sm">
                    <div>
                      <span className="font-semibold text-foreground">{a.doctorName}</span>
                      <span className="text-muted-foreground ml-2">{a.date} at {a.time}</span>
                    </div>
                    <Check className="h-4 w-4 text-success" />
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Doctor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {doctors.map(doc => (
            <motion.div key={doc.id} whileHover={{ y: -2 }} className="glass-card rounded-xl p-5">
              <div className="flex items-start gap-4">
                <div className="text-4xl">{doc.image}</div>
                <div className="flex-1">
                  <h3 className="font-heading font-bold text-foreground">{doc.name}</h3>
                  <p className="text-xs text-primary font-medium">{doc.specialty}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Star className="h-3 w-3 text-warning fill-warning" />{doc.rating}</span>
                    <span>{doc.experience}</span>
                  </div>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground mt-1"><MapPin className="h-3 w-3" />{doc.location}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3 line-clamp-2">{doc.bio}</p>
              <div className="flex gap-2 mt-4">
                <button onClick={() => setSelectedDoctor(doc)} className="flex-1 gradient-primary text-primary-foreground text-xs py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                  Book Appointment
                </button>
                <button onClick={() => setAskQuestion({ doctor: doc, question: '' })} className="flex-1 border border-primary text-primary text-xs py-2 rounded-lg font-semibold hover:bg-accent transition-colors">
                  Ask Question
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Booking Modal */}
      <AnimatePresence>
        {selectedDoctor && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-foreground/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-card rounded-2xl p-6 w-full max-w-md shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-bold text-foreground">Book with {selectedDoctor.name}</h3>
                <button onClick={() => setSelectedDoctor(null)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Select Day</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedDoctor.availableDays.map(day => (
                      <button key={day} onClick={() => setBooking(b => ({ ...b, day }))}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${booking.day === day ? 'border-primary bg-accent font-semibold' : 'border-border hover:border-primary/40'}`}>
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Select Time</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedDoctor.availableTimes.map(time => (
                      <button key={time} onClick={() => setBooking(b => ({ ...b, time }))}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${booking.time === time ? 'border-primary bg-accent font-semibold' : 'border-border hover:border-primary/40'}`}>
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Notes (optional)</label>
                  <textarea value={booking.notes} onChange={e => setBooking(b => ({ ...b, notes: e.target.value }))}
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" rows={3}
                    placeholder="Any concerns or symptoms to mention..." />
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Phone className="h-3 w-3" /> {selectedDoctor.phone}
                </div>
                <button onClick={handleBook} disabled={!booking.day || !booking.time}
                  className="w-full gradient-primary text-primary-foreground rounded-xl py-3 font-semibold text-sm disabled:opacity-50 hover:opacity-90 transition-opacity">
                  Confirm Booking
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ask Question Modal */}
      <AnimatePresence>
        {askQuestion && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-foreground/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-card rounded-2xl p-6 w-full max-w-md shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-bold text-foreground">Ask {askQuestion.doctor.name}</h3>
                <button onClick={() => setAskQuestion(null)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
              </div>
              <textarea
                value={askQuestion.question}
                onChange={e => setAskQuestion(prev => prev ? { ...prev, question: e.target.value } : null)}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none mb-4"
                rows={4}
                placeholder="Type your question here..."
              />
              <button onClick={handleAskQuestion} disabled={!askQuestion.question.trim()}
                className="w-full gradient-primary text-primary-foreground rounded-xl py-3 font-semibold text-sm disabled:opacity-50 hover:opacity-90 transition-opacity">
                Submit Question
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

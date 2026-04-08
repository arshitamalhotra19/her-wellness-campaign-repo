// Local storage helpers
export const storage = {
  get: <T>(key: string, fallback: T): T => {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : fallback;
    } catch { return fallback; }
  },
  set: (key: string, value: unknown) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove: (key: string) => localStorage.removeItem(key),
  clearAll: () => {
    const keys = ['detecther_name', 'detecther_assessments', 'detecther_reminders', 'detecther_appointments', 'detecther_mood', 'detecther_badges'];
    keys.forEach(k => localStorage.removeItem(k));
  },
};

export interface Assessment {
  id: string;
  date: string;
  score: number;
  riskLevel: 'low' | 'moderate' | 'high';
  answers: Record<string, number>;
  factors: string[];
}

export interface Reminder {
  id: string;
  title: string;
  date: string;
  type: 'period' | 'checkup';
  completed: boolean;
}

export interface Appointment {
  id: string;
  doctorName: string;
  doctorSpecialty: string;
  date: string;
  time: string;
  notes: string;
}

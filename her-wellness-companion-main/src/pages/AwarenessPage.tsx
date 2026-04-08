import { motion } from 'framer-motion';
import { ShieldCheck, Syringe, Search, AlertTriangle } from 'lucide-react';

const sections = [
  {
    title: 'What is Cervical Cancer?',
    icon: AlertTriangle,
    content: "Cervical cancer develops in the cells of the cervix — the lower part of the uterus that connects to the vagina. It is most often caused by persistent infection with high-risk types of Human Papillomavirus (HPV). When detected early, cervical cancer is one of the most treatable cancers.",
  },
  {
    title: 'Common Symptoms',
    icon: Search,
    content: "Early-stage cervical cancer may not show symptoms. As it progresses, symptoms may include:\n\n• Unusual vaginal bleeding (between periods, after sex, or post-menopause)\n• Watery, bloody, or foul-smelling vaginal discharge\n• Pelvic pain or pain during intercourse\n• Unexplained weight loss and fatigue\n• Leg swelling or lower back pain",
  },
  {
    title: 'Prevention Tips',
    icon: ShieldCheck,
    content: "You can significantly reduce your risk by:\n\n🌸 Getting the HPV vaccine (recommended ages 9-26)\n🌸 Regular Pap smears starting at age 21\n🌸 Practicing safe sex and limiting sexual partners\n🌸 Not smoking — smoking weakens your immune system\n🌸 Eating a balanced, nutrient-rich diet\n🌸 Maintaining good intimate hygiene\n🌸 Strengthening your immune system",
  },
  {
    title: 'HPV Vaccine',
    icon: Syringe,
    content: "The HPV vaccine is one of the most effective tools against cervical cancer. Key facts:\n\n💉 Prevents infection from the most dangerous HPV strains\n💉 Most effective when given before sexual activity begins\n💉 Recommended for ages 9-14, can be given up to age 45\n💉 Two or three doses depending on age\n💉 Safe with minor side effects (soreness at injection site)\n💉 Can prevent up to 90% of HPV-related cancers",
  },
];

export default function AwarenessPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-heading font-bold text-foreground mb-1">Awareness Hub</h1>
        <p className="text-sm text-muted-foreground mb-6">Learn about cervical cancer, prevention, and the HPV vaccine.</p>

        <div className="space-y-4">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                  <section.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <h2 className="font-heading font-bold text-lg text-foreground">{section.title}</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{section.content}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

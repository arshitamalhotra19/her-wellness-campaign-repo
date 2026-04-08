// Simple weighted scoring ML engine for cervical cancer risk assessment

interface QuestionWeight {
  question: string;
  category: string;
  options: { label: string; value: number }[];
  weight: number;
  factorLabel: string;
}

export const assessmentQuestions: QuestionWeight[] = [
  // Reproductive Health
  {
    question: "At what age did you first become sexually active?",
    category: "Reproductive Health",
    options: [
      { label: "Not applicable", value: 0 },
      { label: "After 21", value: 1 },
      { label: "18-21", value: 2 },
      { label: "Before 18", value: 4 },
    ],
    weight: 1.5,
    factorLabel: "Early sexual activity",
  },
  {
    question: "How many sexual partners have you had?",
    category: "Reproductive Health",
    options: [
      { label: "0-1", value: 0 },
      { label: "2-3", value: 1 },
      { label: "4-6", value: 3 },
      { label: "More than 6", value: 4 },
    ],
    weight: 1.3,
    factorLabel: "Multiple sexual partners",
  },
  {
    question: "Have you received the HPV vaccine?",
    category: "Reproductive Health",
    options: [
      { label: "Yes, fully vaccinated", value: 0 },
      { label: "Partially vaccinated", value: 1 },
      { label: "No", value: 3 },
      { label: "Not sure", value: 2 },
    ],
    weight: 1.8,
    factorLabel: "No HPV vaccination",
  },
  {
    question: "When was your last Pap smear/cervical screening?",
    category: "Reproductive Health",
    options: [
      { label: "Within last year", value: 0 },
      { label: "1-3 years ago", value: 1 },
      { label: "More than 3 years ago", value: 3 },
      { label: "Never had one", value: 4 },
    ],
    weight: 1.6,
    factorLabel: "Irregular cervical screening",
  },
  // Period & Hormonal
  {
    question: "How regular are your menstrual periods?",
    category: "Period & Hormonal",
    options: [
      { label: "Very regular (every 25-35 days)", value: 0 },
      { label: "Somewhat irregular", value: 1 },
      { label: "Very irregular", value: 2 },
      { label: "Post-menopausal / N/A", value: 1 },
    ],
    weight: 0.8,
    factorLabel: "Irregular menstrual cycles",
  },
  {
    question: "Do you experience unusual bleeding between periods or after intercourse?",
    category: "Period & Hormonal",
    options: [
      { label: "Never", value: 0 },
      { label: "Rarely", value: 1 },
      { label: "Sometimes", value: 3 },
      { label: "Frequently", value: 4 },
    ],
    weight: 2.0,
    factorLabel: "Abnormal bleeding patterns",
  },
  // Hygiene
  {
    question: "How would you describe your intimate hygiene routine?",
    category: "Hygiene & Lifestyle",
    options: [
      { label: "Regular and thorough", value: 0 },
      { label: "Moderate", value: 1 },
      { label: "Inconsistent", value: 2 },
      { label: "Minimal", value: 3 },
    ],
    weight: 0.7,
    factorLabel: "Hygiene habits",
  },
  {
    question: "Do you smoke or use tobacco products?",
    category: "Hygiene & Lifestyle",
    options: [
      { label: "Never", value: 0 },
      { label: "Former smoker (quit >5 years)", value: 1 },
      { label: "Former smoker (quit <5 years)", value: 2 },
      { label: "Current smoker", value: 4 },
    ],
    weight: 1.4,
    factorLabel: "Smoking/tobacco use",
  },
  // Diet
  {
    question: "How often do you eat fruits and vegetables?",
    category: "Diet & Nutrition",
    options: [
      { label: "5+ servings daily", value: 0 },
      { label: "3-4 servings daily", value: 1 },
      { label: "1-2 servings daily", value: 2 },
      { label: "Rarely", value: 3 },
    ],
    weight: 0.6,
    factorLabel: "Low fruit/vegetable intake",
  },
  {
    question: "Do you take any immune-boosting supplements (Vitamin C, D, etc.)?",
    category: "Diet & Nutrition",
    options: [
      { label: "Regularly", value: 0 },
      { label: "Sometimes", value: 1 },
      { label: "Rarely", value: 2 },
      { label: "Never", value: 2 },
    ],
    weight: 0.5,
    factorLabel: "Low supplement intake",
  },
  // Symptoms
  {
    question: "Have you noticed any unusual vaginal discharge?",
    category: "Symptoms",
    options: [
      { label: "No", value: 0 },
      { label: "Occasional mild changes", value: 1 },
      { label: "Persistent unusual discharge", value: 3 },
      { label: "Foul-smelling or bloody discharge", value: 4 },
    ],
    weight: 1.9,
    factorLabel: "Unusual vaginal discharge",
  },
  {
    question: "Do you experience pelvic pain unrelated to periods?",
    category: "Symptoms",
    options: [
      { label: "Never", value: 0 },
      { label: "Occasionally mild", value: 1 },
      { label: "Moderate and recurring", value: 3 },
      { label: "Severe and persistent", value: 4 },
    ],
    weight: 1.7,
    factorLabel: "Pelvic pain",
  },
  {
    question: "Do you have a family history of cervical or reproductive cancers?",
    category: "Symptoms",
    options: [
      { label: "No known history", value: 0 },
      { label: "Distant relative", value: 1 },
      { label: "Close relative (aunt, grandmother)", value: 2 },
      { label: "Immediate family (mother, sister)", value: 4 },
    ],
    weight: 1.5,
    factorLabel: "Family history of cancer",
  },
  {
    question: "Have you been diagnosed with any STIs (e.g., HPV, chlamydia)?",
    category: "Symptoms",
    options: [
      { label: "Never", value: 0 },
      { label: "Once, fully treated", value: 1 },
      { label: "Multiple times", value: 3 },
      { label: "Currently have an active STI", value: 4 },
    ],
    weight: 1.8,
    factorLabel: "History of STIs",
  },
];

export function calculateRiskScore(answers: Record<string, number>): {
  score: number;
  riskLevel: 'low' | 'moderate' | 'high';
  factors: string[];
  maxScore: number;
} {
  let rawScore = 0;
  let maxPossible = 0;
  const contributingFactors: { label: string; contribution: number }[] = [];

  assessmentQuestions.forEach((q, i) => {
    const answerValue = answers[`q${i}`] ?? 0;
    const weighted = answerValue * q.weight;
    rawScore += weighted;
    maxPossible += 4 * q.weight;

    if (answerValue >= 2) {
      contributingFactors.push({ label: q.factorLabel, contribution: weighted });
    }
  });

  // Normalize to 0-50
  const normalizedScore = Math.round((rawScore / maxPossible) * 50);
  const score = Math.min(50, Math.max(0, normalizedScore));

  const riskLevel: 'low' | 'moderate' | 'high' =
    score <= 15 ? 'low' : score <= 30 ? 'moderate' : 'high';

  // Sort factors by contribution descending
  contributingFactors.sort((a, b) => b.contribution - a.contribution);
  const factors = contributingFactors.slice(0, 5).map(f => f.label);

  return { score, riskLevel, factors, maxScore: 50 };
}

// Quick symptom check scoring
export const symptomsList = [
  { id: 'bleeding', label: 'Unusual vaginal bleeding', weight: 4 },
  { id: 'discharge', label: 'Abnormal vaginal discharge', weight: 3.5 },
  { id: 'pelvic_pain', label: 'Pelvic pain', weight: 3 },
  { id: 'pain_intercourse', label: 'Pain during intercourse', weight: 3 },
  { id: 'back_pain', label: 'Lower back pain', weight: 2 },
  { id: 'leg_swelling', label: 'Leg swelling', weight: 2.5 },
  { id: 'weight_loss', label: 'Unexplained weight loss', weight: 2.5 },
  { id: 'fatigue', label: 'Persistent fatigue', weight: 1.5 },
  { id: 'urinary', label: 'Urinary problems', weight: 2 },
  { id: 'appetite', label: 'Loss of appetite', weight: 1.5 },
];

export function quickSymptomScore(selectedIds: string[]): {
  score: number;
  riskLevel: 'low' | 'moderate' | 'high';
} {
  const maxTotal = symptomsList.reduce((s, item) => s + item.weight, 0);
  const total = symptomsList
    .filter(s => selectedIds.includes(s.id))
    .reduce((s, item) => s + item.weight, 0);
  const score = Math.round((total / maxTotal) * 50);
  const riskLevel: 'low' | 'moderate' | 'high' =
    score <= 15 ? 'low' : score <= 30 ? 'moderate' : 'high';
  return { score, riskLevel };
}

interface ChatResponse {
  keywords: string[];
  response: string;
}

const responses: ChatResponse[] = [
  {
    keywords: ['hpv', 'human papillomavirus'],
    response: "HPV (Human Papillomavirus) is a very common virus. Most sexually active people will get HPV at some point. While most HPV infections go away on their own, some high-risk strains can lead to cervical cancer over time. The good news? The HPV vaccine is highly effective at preventing the most dangerous strains. 💕"
  },
  {
    keywords: ['vaccine', 'vaccination', 'vaccinated'],
    response: "The HPV vaccine is recommended for ages 9-26 and can be given up to age 45. It's most effective when given before exposure to HPV. The vaccine protects against the HPV strains most likely to cause cervical cancer. Talk to your doctor about getting vaccinated — it's one of the best ways to protect yourself! 🌸"
  },
  {
    keywords: ['symptom', 'symptoms', 'sign', 'signs'],
    response: "Early cervical cancer often has no symptoms, which is why regular screening is so important. Later symptoms may include: unusual vaginal bleeding, abnormal discharge, pelvic pain, or pain during intercourse. If you notice any changes, please don't hesitate to see a doctor. Early detection saves lives! 💪"
  },
  {
    keywords: ['prevent', 'prevention', 'protect'],
    response: "Here are key ways to reduce your risk:\n\n🌸 Get the HPV vaccine\n🌸 Regular Pap smears/cervical screenings\n🌸 Practice safe sex\n🌸 Don't smoke\n🌸 Eat a balanced diet rich in fruits & vegetables\n🌸 Maintain good intimate hygiene\n\nYou're already taking a great step by learning about prevention! 💕"
  },
  {
    keywords: ['pap', 'smear', 'screening', 'test'],
    response: "A Pap smear is a simple test where cells are collected from your cervix to check for abnormalities. It's recommended every 3 years for ages 21-29, and every 5 years (with HPV co-testing) for ages 30-65. It's quick, usually painless, and can catch changes early. Don't skip your screenings! 🌺"
  },
  {
    keywords: ['scared', 'afraid', 'worried', 'anxious', 'fear'],
    response: "It's completely natural to feel worried. Remember, you're being proactive by learning and checking — that takes courage! 💕 Most cervical changes are treatable when caught early. Take a deep breath. You're not alone in this journey, and we're here to support you every step of the way. 🤗"
  },
  {
    keywords: ['bleeding', 'blood', 'spotting'],
    response: "Unusual bleeding (between periods, after sex, or post-menopause) can have many causes — most are not cancer. However, it's always worth getting checked by a healthcare provider to be safe. Don't ignore persistent changes in your bleeding patterns. Your health matters! 💕"
  },
  {
    keywords: ['discharge'],
    response: "Some vaginal discharge is normal. However, if you notice changes in color, smell, or consistency — especially if it's watery, bloody, or foul-smelling — it's a good idea to see your doctor. Most causes are easily treatable, but it's important to get checked. 🌸"
  },
  {
    keywords: ['diet', 'food', 'eat', 'nutrition'],
    response: "A healthy diet supports your immune system, which helps fight HPV:\n\n🥦 Eat plenty of fruits and vegetables\n🐟 Include omega-3 rich foods\n🍊 Get enough Vitamin C and E\n🥕 Eat folate-rich foods\n💧 Stay hydrated\n\nA strong immune system is your best defense! 🌸"
  },
  {
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good evening'],
    response: "Hello! 💕 I'm your DetectHer health assistant. I'm here to help answer your questions about cervical health, HPV, prevention, and more. Feel free to ask me anything — no question is too small or silly. I'm here for you! 🌸"
  },
  {
    keywords: ['thank', 'thanks'],
    response: "You're welcome! 💕 Remember, taking care of your health is an act of self-love. I'm always here if you have more questions. Stay healthy and stay strong! 🌸"
  },
  {
    keywords: ['treatment', 'treat', 'cure'],
    response: "Cervical cancer treatment depends on the stage and may include surgery, radiation, chemotherapy, or a combination. Pre-cancerous changes can often be treated with simple outpatient procedures. The earlier it's detected, the more treatment options are available. Regular screening is key! 💪🌸"
  },
  {
    keywords: ['risk', 'factor', 'cause'],
    response: "Key risk factors include:\n\n• HPV infection (most important)\n• Smoking\n• Weakened immune system\n• Multiple sexual partners\n• Early sexual activity\n• Not getting screened regularly\n• Family history\n\nKnowing your risks helps you take action! 💕"
  },
  {
    keywords: ['age', 'young', 'old'],
    response: "Cervical cancer can affect women of any age after they become sexually active, but it's most common between ages 35-44. Regular screening should start at age 21. The HPV vaccine is most effective when given at ages 9-14, but can be given up to 45. It's never too late to start protecting yourself! 🌸"
  },
];

export function getChatbotResponse(input: string): string {
  const lower = input.toLowerCase();
  
  for (const item of responses) {
    if (item.keywords.some(kw => lower.includes(kw))) {
      return item.response;
    }
  }
  
  return "That's a great question! While I may not have the specific answer, I'd encourage you to discuss it with your healthcare provider. In the meantime, you can explore our Awareness Hub for reliable information about cervical health. Remember, no question is too small when it comes to your health! 💕🌸";
}

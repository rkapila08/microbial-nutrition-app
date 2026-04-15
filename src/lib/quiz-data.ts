export type AxisKey = "diversity" | "inflammation" | "resilience" | "fiber";
export type AxisChoice = "a" | "b" | "c" | "d";

export interface QuizQuestion {
  id: number;
  axis: AxisKey;
  text: string;
  /** a = most positive trait, d = most negative trait */
  options: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
}

export interface GutProfile {
  code: string;
  name: string;
  tagline: string;
  description: string;
  recommendations: string[];
  color: string;
}

/** Points awarded per choice (a = fully positive, d = fully negative) */
const CHOICE_WEIGHTS: Record<AxisChoice, number> = { a: 3, b: 2, c: 1, d: 0 };

export const AXIS_LABELS: Record<
  AxisKey,
  { positive: string; negative: string; label: string }
> = {
  diversity: {
    positive: "D — Diverse",
    negative: "S — Sensitive",
    label: "Microbiome Diversity",
  },
  inflammation: {
    positive: "B — Balanced",
    negative: "I — Inflamed",
    label: "Inflammation Balance",
  },
  resilience: {
    positive: "R — Resilient",
    negative: "V — Variable",
    label: "Gut Resilience",
  },
  fiber: {
    positive: "H — High-fiber",
    negative: "L — Low-fiber",
    label: "Dietary Fiber",
  },
};

export const GUT_PROFILES: GutProfile[] = [
  {
    code: "DBRH",
    name: "The Cultivator",
    tagline: "Diverse · Balanced · Resilient · High-fiber",
    description:
      "Your gut is a thriving ecosystem. You naturally gravitate toward variety and your microbiome rewards you with steady energy and strong immunity. You're in an excellent position — the goal now is maintenance and optimization.",
    recommendations: [
      "Aim for 30+ different plant foods per week to sustain your exceptional diversity",
      "Continue your fermented food intake to keep beneficial bacteria flourishing",
      "Experiment with prebiotic cycling (garlic, leeks, green banana) to challenge your microbiome",
      "Your resilience means you can safely try new fermented foods and probiotic-rich cuisines",
    ],
    color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  },
  {
    code: "DBRL",
    name: "The Optimizer",
    tagline: "Diverse · Balanced · Resilient · Low-fiber",
    description:
      "You have an impressively diverse and resilient microbiome, but fiber is your missing puzzle piece. Your gut bacteria are waiting for more fuel. A targeted fiber upgrade could unlock the next level of your already strong gut health.",
    recommendations: [
      "Gradually increase daily fiber toward 30g — add one high-fiber food per meal",
      "Prioritize prebiotic fibers: oats, chicory root, Jerusalem artichoke, and green banana",
      "Add legumes 3–4 times per week — your resilient gut will adapt quickly",
      "Try a 'fiber challenge week' monthly to build the habit sustainably",
    ],
    color: "bg-teal-500/10 text-teal-700 dark:text-teal-400",
  },
  {
    code: "DBVH",
    name: "The Naturalist",
    tagline: "Diverse · Balanced · Variable · High-fiber",
    description:
      "You feed your gut beautifully — diverse, balanced, and fiber-rich. But your recovery fluctuates. External factors like stress or travel knock you off course. Building gut resilience is your next chapter.",
    recommendations: [
      "Establish a 'gut anchor' routine: consistent sleep times, meal schedule, and a daily probiotic",
      "Practice pre-meal breathing (5 deep breaths) to reduce cortisol's impact on digestion",
      "Add gut-lining-supportive foods: bone broth, collagen peptides, and zinc-rich foods",
      "Keep a disruption log — is it stress, sleep, or specific foods that derail your gut?",
    ],
    color: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400",
  },
  {
    code: "DBVL",
    name: "The Warrior",
    tagline: "Diverse · Balanced · Variable · Low-fiber",
    description:
      "You're resilient at your core, but running on fumes. Your microbiome is solid, but inconsistency in diet and low fiber keeps you from reaching your full potential. Small, consistent upgrades will make a big difference.",
    recommendations: [
      "Build a daily fiber ritual: overnight oats, chia pudding, or a high-fiber smoothie",
      "Batch-cook legumes weekly so fiber-rich meals are always accessible",
      "Create a gut recovery protocol for disruption periods — know what you'll eat to reset",
      "Focus on meal timing consistency to reduce your variable recovery patterns",
    ],
    color: "bg-sky-500/10 text-sky-700 dark:text-sky-400",
  },
  {
    code: "DIRH",
    name: "The Overcomer",
    tagline: "Diverse · Inflamed · Resilient · High-fiber",
    description:
      "You have the building blocks of exceptional gut health — variety, resilience, and a fiber-rich diet. But chronic low-grade inflammation is holding you back. The good news: you already have the tools to overcome it.",
    recommendations: [
      "Add anti-inflammatory foods daily: fatty fish, extra virgin olive oil, and turmeric",
      "Audit your diet for hidden inflammatory drivers — alcohol, refined oils, and processed foods",
      "Increase fermented foods (kefir, kimchi, sauerkraut) to support the gut lining",
      "Consider omega-3 supplementation and track symptoms over 6 weeks",
    ],
    color: "bg-lime-500/10 text-lime-700 dark:text-lime-400",
  },
  {
    code: "DIRL",
    name: "The Phoenix",
    tagline: "Diverse · Inflamed · Resilient · Low-fiber",
    description:
      "Your microbiome is diverse and bounces back well — qualities that give you a great foundation. But inflammation and low fiber are creating a ceiling on your health. Address these two areas and you'll experience a remarkable transformation.",
    recommendations: [
      "Double your vegetable servings to address both fiber and inflammation simultaneously",
      "Eliminate the biggest inflammatory culprits for 4 weeks: alcohol, refined seed oils, ultra-processed foods",
      "Add polyphenol-rich foods: blueberries, dark chocolate (70%+), green tea, and walnuts",
      "Your resilience means you'll see results quickly — commit to a 30-day gut reset",
    ],
    color: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  },
  {
    code: "DIVH",
    name: "The Explorer",
    tagline: "Diverse · Inflamed · Variable · High-fiber",
    description:
      "You eat impressively well — diverse and fiber-rich — but inflammation and inconsistent recovery suggest something deeper is at play. Stress, sleep, or hidden food sensitivities may be the missing link in your gut story.",
    recommendations: [
      "Try a structured elimination protocol to identify hidden inflammatory triggers",
      "Prioritize sleep quality — gut inflammation is significantly worsened by poor sleep",
      "Add anti-inflammatory herbs to your daily routine: ginger, turmeric, and boswellia",
      "Consider working with a functional nutritionist to investigate root-cause inflammation",
    ],
    color: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
  },
  {
    code: "DIVL",
    name: "The Drifter",
    tagline: "Diverse · Inflamed · Variable · Low-fiber",
    description:
      "You have the microbiome variety that many lack, but inflammation, inconsistency, and low fiber are creating a challenging gut environment. Your diversity is your greatest asset — use it as the foundation for rebuilding.",
    recommendations: [
      "Start with a 'gut reset week': whole foods only, no processed foods, abundant vegetables",
      "Build fiber intake gradually — too much too fast can worsen existing inflammation",
      "Establish a daily gut routine: same wake time, probiotic, and prebiotic-rich breakfast",
      "Track meals and symptoms for 2 weeks to identify your personal gut disruptors",
    ],
    color: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  },
  {
    code: "SBRH",
    name: "The Sensitive",
    tagline: "Sensitive · Balanced · Resilient · High-fiber",
    description:
      "Your gut is attentive to every signal. You eat well and recover well, but your nervous system and microbiome are tightly coupled — stress hits you in the gut first. Managing your gut-brain axis is the key to your wellbeing.",
    recommendations: [
      "Prioritize the gut-brain connection: daily meditation or breathwork to reduce vagal tension",
      "Eat in calm environments — stress eating bypasses the gut-brain communication loop",
      "Keep a gut-mood diary to map your emotional and digestive patterns",
      "Magnesium glycinate at night can support both gut motility and nervous system regulation",
    ],
    color: "bg-violet-500/10 text-violet-700 dark:text-violet-400",
  },
  {
    code: "SBRL",
    name: "The Minimalist",
    tagline: "Sensitive · Balanced · Resilient · Low-fiber",
    description:
      "You've found a careful balance with a limited food range, and your gut is stable. But restricted diversity and low fiber mean your microbiome is operating on a narrow bandwidth. Gentle, gradual expansion will unlock hidden potential.",
    recommendations: [
      "Introduce one new high-fiber food per week — slow and steady avoids sensitivity reactions",
      "Start with soluble fiber sources (oat bran, psyllium) which are gentler on sensitive guts",
      "Cook vegetables rather than eating raw to reduce fermentation and gas",
      "Work toward 25+ plant foods per week over 3 months — track the journey",
    ],
    color: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
  },
  {
    code: "SBVH",
    name: "The Nurturer",
    tagline: "Sensitive · Balanced · Variable · High-fiber",
    description:
      "You feed your gut generously, and it shows in your balanced environment. But your sensitivity and variable recovery mean disruptions hit harder and last longer. Building resilience while respecting your sensitive nature is key.",
    recommendations: [
      "Build a 'disruption recovery kit': specific foods and routines to deploy when your gut gets knocked off",
      "Prioritize consistent meal timing — your sensitive gut thrives on routine",
      "Add gut-lining-supportive foods weekly: bone broth, collagen, and zinc-rich foods",
      "Stress resilience practices (yoga, walking in nature) will also measurably improve gut resilience",
    ],
    color: "bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-400",
  },
  {
    code: "SBVL",
    name: "The Seeker",
    tagline: "Sensitive · Balanced · Variable · Low-fiber",
    description:
      "Your gut has a stable, balanced foundation but needs more fuel and consistency. Sensitivity means you need to move carefully, but your calm inflammation gives you a manageable starting point for meaningful improvement.",
    recommendations: [
      "Increase fiber slowly and consistently — 2–3g more per week until you reach 25–30g daily",
      "Focus on gentle fiber sources: cooked oats, ripe bananas, well-cooked lentils, and steamed veg",
      "Establish consistent meal and sleep timing — your variable recovery is closely linked to routine",
      "Consider a low-FODMAP approach short-term to identify your specific fiber sensitivities",
    ],
    color: "bg-pink-500/10 text-pink-700 dark:text-pink-400",
  },
  {
    code: "SIRH",
    name: "The Transformer",
    tagline: "Sensitive · Inflamed · Resilient · High-fiber",
    description:
      "You're doing the hard work — eating fiber-rich foods and bouncing back reasonably well — but underlying sensitivity and inflammation mean your gut is in a constant low-level battle. Targeted anti-inflammatory strategies will help you break through.",
    recommendations: [
      "Focus on anti-inflammatory, gut-healing foods: fatty fish, turmeric, ginger, and bone broth",
      "Temporarily reduce high-FODMAP foods to give your inflamed, sensitive gut a rest",
      "Increase fermented foods gradually — they'll help both inflammation and sensitivity over time",
      "Test for H. pylori, SIBO, or food intolerances as potential root causes of ongoing symptoms",
    ],
    color: "bg-rose-500/10 text-rose-700 dark:text-rose-400",
  },
  {
    code: "SIRL",
    name: "The Rebuilder",
    tagline: "Sensitive · Inflamed · Resilient · Low-fiber",
    description:
      "Your gut is sensitive and dealing with inflammation, but your resilience is a real asset — you bounce back when you apply the right approach. Target the inflammation, add fiber strategically, and let your natural resilience do the rest.",
    recommendations: [
      "Start with a gut-healing protocol: bone broth, cooked vegetables, and fermented foods",
      "Eliminate the top gut disruptors for 3 weeks: alcohol, processed foods, and refined sugar",
      "Introduce fiber very slowly (1–2g per week) to avoid aggravating existing inflammation",
      "Consider working with a gut health practitioner for a structured elimination and reintroduction protocol",
    ],
    color: "bg-red-500/10 text-red-700 dark:text-red-400",
  },
  {
    code: "SIVH",
    name: "The Healer",
    tagline: "Sensitive · Inflamed · Variable · High-fiber",
    description:
      "Your diet shows real commitment — the fiber is there — but sensitivity, inflammation, and variable recovery suggest your gut is in an active healing phase. The nutrition foundation is solid; now it's time to address the inflammatory environment and build resilience.",
    recommendations: [
      "Audit your fiber sources — some high-fiber foods may worsen inflammation in a sensitive gut",
      "Prioritize polyphenol-rich anti-inflammatory foods alongside your fiber intake",
      "Build post-disruption recovery routines: specific meals and practices after stressful periods",
      "Explore the gut-brain axis — your variable recovery may be closely tied to stress and nervous system state",
    ],
    color: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400",
  },
  {
    code: "SIVL",
    name: "The Wanderer",
    tagline: "Sensitive · Inflamed · Variable · Low-fiber",
    description:
      "You're at the most challenging starting point — but also the one with the most transformative potential. Every single improvement — more fiber, less inflammation, better recovery — creates a compound effect on your gut health and overall wellbeing.",
    recommendations: [
      "Start with the fundamentals: remove the top 3 inflammatory foods from your diet this week",
      "Add one new gut-supporting food each week: kimchi, kefir, oats, or flaxseeds",
      "Focus on sleep and stress management first — both have an outsized impact on your gut type",
      "Give yourself a 90-day horizon — meaningful gut transformation takes consistent effort, and you'll get there",
    ],
    color: "bg-slate-500/10 text-slate-700 dark:text-slate-400",
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // ── Diversity (D vs S) ──────────────────────────────────
  {
    id: 1,
    axis: "diversity",
    text: "When planning your meals each week, you tend to...",
    options: {
      a: "Actively seek out at least 8 different vegetables and rotate proteins, grains, and cuisines",
      b: "Eat a fairly varied diet — around 5–7 veg types — and mix things up most weeks",
      c: "Rely on a core set of go-to meals, occasionally trying something new",
      d: "Stick to a tight rotation of 3–4 familiar foods your gut reliably tolerates",
    },
  },
  {
    id: 2,
    axis: "inflammation",
    text: "How often do you experience bloating or abdominal discomfort after meals?",
    options: {
      a: "Rarely or never — it's genuinely not something I deal with",
      b: "Occasionally after unusually heavy or rich meals only",
      c: "Fairly often, several times per week after regular meals",
      d: "Almost daily — bloating and discomfort are a constant presence",
    },
  },
  {
    id: 3,
    axis: "resilience",
    text: "When you travel internationally or shift time zones, your digestion...",
    options: {
      a: "Is completely unaffected — travel just doesn't bother my gut",
      b: "Needs a day or two to adjust, then normalises quickly",
      c: "Is disrupted for about a week before returning to normal",
      d: "Goes significantly off track and takes weeks to fully recover",
    },
  },
  {
    id: 4,
    axis: "fiber",
    text: "How many portions of fruit and vegetables do you eat daily?",
    options: {
      a: "7 or more — plants anchor every single meal",
      b: "5–6 servings — I'm consistent about including them",
      c: "3–4 servings — I include some but it's not always a priority",
      d: "1–2 or fewer — plants are a small part of my diet",
    },
  },

  {
    id: 5,
    axis: "diversity",
    text: "When you eat a completely new cuisine or unfamiliar ingredient...",
    options: {
      a: "My gut handles it without issue — I can eat virtually anything",
      b: "I handle new foods well most of the time, with only occasional mild reactions",
      c: "New cuisines sometimes cause issues, so I'm cautious with unfamiliar dishes",
      d: "Unfamiliar foods reliably cause discomfort — my gut prefers the known",
    },
  },
  {
    id: 6,
    axis: "inflammation",
    text: "How would you describe your typical bowel movements?",
    options: {
      a: "Very regular — once or twice daily, comfortable, and predictable",
      b: "Mostly regular with occasional minor variation",
      c: "Irregular, with frequent episodes of discomfort or urgency",
      d: "Frequently painful, highly unpredictable, and inconsistent",
    },
  },
  {
    id: 7,
    axis: "resilience",
    text: "After a week of poor eating (holiday, illness, celebrations), your gut...",
    options: {
      a: "Resets within 1–2 days of eating well again — almost immediately",
      b: "Takes 3–4 days of good eating to normalise",
      c: "Needs about a week of consistent effort to fully recover",
      d: "Can take 2+ weeks — slow recovery even with the best intentions",
    },
  },
  {
    id: 8,
    axis: "fiber",
    text: "How consistently do you choose whole grains over refined ones?",
    options: {
      a: "Always — white or refined grains are the rare exception",
      b: "Mostly — I choose whole grains around 70–80% of the time",
      c: "Sometimes — roughly half and half, depending on what's available",
      d: "Rarely — white and refined carbs dominate my meals",
    },
  },

  {
    id: 9,
    axis: "diversity",
    text: "How many different vegetables do you eat in a typical week?",
    options: {
      a: "10 or more — variety is a core principle of how I eat",
      b: "6–9 types — I make a real point of mixing it up",
      c: "3–5 types — mostly the same familiar ones each week",
      d: "1–2 types — I eat the same vegetables that I know agree with me",
    },
  },
  {
    id: 10,
    axis: "inflammation",
    text: "How often do you eat fermented foods (yogurt, kimchi, kefir, sauerkraut, kombucha)?",
    options: {
      a: "Daily — fermented foods are a staple at most meals",
      b: "3–4 times per week — a consistent regular habit",
      c: "Once a week or so — occasional but not routine",
      d: "Rarely or never — not part of my eating at all",
    },
  },
  {
    id: 11,
    axis: "resilience",
    text: "How does stress affect your digestion?",
    options: {
      a: "No connection at all — my gut is unaffected by stress",
      b: "Mild effects only during periods of extreme or prolonged stress",
      c: "Noticeable gut changes whenever I go through a stressful period",
      d: "Strong and immediate — I can track my stress levels through my gut",
    },
  },
  {
    id: 12,
    axis: "fiber",
    text: "How often do legumes (beans, lentils, chickpeas, soybeans) appear in your diet?",
    options: {
      a: "Daily — beans or lentils feature in most of my meals",
      b: "3–4 times per week — a regular protein and fiber source",
      c: "Once a week or so — occasional but not routine",
      d: "Rarely or never — legumes aren't part of my eating pattern",
    },
  },

  {
    id: 13,
    axis: "diversity",
    text: "After a course of antibiotics, how does your gut typically respond?",
    options: {
      a: "Bounces back fully within 5–7 days with no noticeable lasting effects",
      b: "Normalises within 2 weeks with minor changes along the way",
      c: "Takes 3–4 weeks and some effort (probiotics, diet changes) to feel normal",
      d: "Disrupted for months — antibiotics are a significant gut event for me",
    },
  },
  {
    id: 14,
    axis: "inflammation",
    text: "How do you feel in the hour after a large or rich meal?",
    options: {
      a: "Energised and comfortable — I feel great after eating",
      b: "Satisfied and settled, back to normal within 30 minutes",
      c: "Sometimes bloated or sluggish for 1–2 hours",
      d: "Heavy and uncomfortable for several hours after most meals",
    },
  },
  {
    id: 15,
    axis: "resilience",
    text: "After food poisoning or a stomach bug, your recovery typically takes...",
    options: {
      a: "About 24 hours — I'm basically fine the next day",
      b: "2–3 days to feel fully back to normal",
      c: "Around a week before I feel like myself again",
      d: "2+ weeks, and sometimes my gut never quite returns to baseline",
    },
  },
  {
    id: 16,
    axis: "fiber",
    text: "Which best describes a typical day of eating for you?",
    options: {
      a: "Predominantly plants — 5+ vegetables, fruit, legumes, and whole grains at most meals",
      b: "Balanced — good vegetables and whole grains alongside protein",
      c: "Moderate veg alongside mostly refined carbs and protein",
      d: "Mostly protein and refined carbs — plants and fiber are minimal",
    },
  },

  {
    id: 17,
    axis: "diversity",
    text: "How much of a factor are food intolerances in your daily life?",
    options: {
      a: "None at all — I can eat anything without restriction",
      b: "One mild sensitivity I manage easily (e.g., large amounts of dairy)",
      c: "A few sensitivities that limit my food choices and require planning",
      d: "Multiple significant intolerances that substantially restrict my diet",
    },
  },
  {
    id: 18,
    axis: "inflammation",
    text: "How stable are your energy levels after meals?",
    options: {
      a: "Rock-solid — I never experience crashes or brain fog after eating",
      b: "Generally stable with minor dips on very rare occasions",
      c: "Noticeable afternoon slumps or fog after meals a few times a week",
      d: "Persistent crashes and brain fog after eating are a frequent issue",
    },
  },
  {
    id: 19,
    axis: "resilience",
    text: "How consistent is your digestion from week to week?",
    options: {
      a: "Completely consistent — I can predict exactly how my gut will behave",
      b: "Mostly consistent, with minor and short-lived variation",
      c: "Noticeably variable — some weeks are significantly better or worse",
      d: "Highly unpredictable — I genuinely never know what to expect",
    },
  },
  {
    id: 20,
    axis: "fiber",
    text: "How often do you eat nuts or seeds (almonds, walnuts, chia, flax, pumpkin seeds)?",
    options: {
      a: "Daily — a handful of nuts or seeds is part of almost every day",
      b: "4–5 times per week — a regular snack or meal topping",
      c: "Once or twice a week — occasional inclusion",
      d: "Rarely or never — not part of my regular eating",
    },
  },

  {
    id: 21,
    axis: "diversity",
    text: "Thinking about the past month, how varied has your diet been?",
    options: {
      a: "Very varied — I tried multiple new foods and rotated ingredients frequently",
      b: "Moderately varied — mixed it up several times but kept a core range",
      c: "Fairly routine — a few dishes on rotation with occasional variation",
      d: "Very consistent — the same foods appeared almost every single day",
    },
  },
  {
    id: 22,
    axis: "inflammation",
    text: "How often do you eat ultra-processed foods (fast food, packaged snacks, ready meals)?",
    options: {
      a: "Virtually never — I cook from whole ingredients and avoid processed foods",
      b: "Rarely — once every 1–2 weeks at most as a treat",
      c: "A few times per week — convenience foods are part of my regular routine",
      d: "Most days — fast food, snacks, and ready meals are common for me",
    },
  },
  {
    id: 23,
    axis: "resilience",
    text: "How do sleep disruptions (late nights, jet lag, shift work) affect your digestion?",
    options: {
      a: "No effect at all — my gut doesn't notice schedule changes",
      b: "Slight changes only when seriously sleep-deprived, nothing significant",
      c: "Poor sleep noticeably affects my digestion the following day",
      d: "Even minor sleep disruptions reliably upset my gut for days",
    },
  },
  {
    id: 24,
    axis: "fiber",
    text: "When given the choice between white and whole grain options, you...",
    options: {
      a: "Always choose whole grain — it's become completely automatic",
      b: "Usually choose whole grain, with occasional exceptions",
      c: "Sometimes choose whole grain, but often end up with refined",
      d: "Almost always choose white or refined — it's not a decision I make",
    },
  },

  {
    id: 25,
    axis: "diversity",
    text: "How does your gut handle trying very different cuisines (Thai, Ethiopian, Japanese, Mexican)?",
    options: {
      a: "Wonderfully — variety in cuisine excites rather than upsets my gut",
      b: "Generally well — I enjoy variety with only rare exceptions",
      c: "Selectively — some cuisines are fine, others consistently cause issues",
      d: "I mostly avoid unusual cuisines because the outcome is too unpredictable",
    },
  },
  {
    id: 26,
    axis: "inflammation",
    text: "Skin issues (acne, eczema, rashes, psoriasis) in your experience...",
    options: {
      a: "Are not a factor — my skin is clear and shows no food connection",
      b: "Occasionally appear but don't seem connected to what I eat",
      c: "Noticeably flare up and sometimes correlate with certain foods",
      d: "Are chronic and clearly worsen with diet — food is a major trigger",
    },
  },
  {
    id: 27,
    axis: "resilience",
    text: "After a gut disruption, how long does it take to return to your normal baseline?",
    options: {
      a: "1–2 days maximum — I bounce back very quickly",
      b: "4–5 days of normal eating and I'm back",
      c: "Around 1–2 weeks before I feel fully myself again",
      d: "A month or more — I rarely feel I've fully recovered",
    },
  },
  {
    id: 28,
    axis: "fiber",
    text: "How often do prebiotic foods (garlic, onion, leeks, asparagus, oats, bananas) feature in your meals?",
    options: {
      a: "Multiple times daily — they're in almost every meal without thinking",
      b: "Once or twice a day — prebiotics are a regular part of my cooking",
      c: "A few times per week — present but not consistent",
      d: "Rarely — prebiotic foods are not a regular feature of my diet",
    },
  },

  {
    id: 29,
    axis: "diversity",
    text: "How would you describe your gut's overall tolerance for new or challenging foods?",
    options: {
      a: "Remarkably robust — I can eat almost anything without a reaction",
      b: "Generally good — handles most foods well with occasional exceptions",
      c: "Moderately sensitive — I need to be somewhat mindful with new foods",
      d: "Quite sensitive — new foods need to be introduced very carefully",
    },
  },
  {
    id: 30,
    axis: "inflammation",
    text: "Would you say your gut feels comfortable on a typical day?",
    options: {
      a: "Completely comfortable — gut issues are simply not part of my daily experience",
      b: "Mostly comfortable with infrequent and mild discomfort",
      c: "Regular discomfort, bloating, or urgency that I work around",
      d: "Constant symptoms that noticeably impact my day-to-day life",
    },
  },
  {
    id: 31,
    axis: "resilience",
    text: "When you change your diet significantly (new eating plan, holiday, elimination), your gut...",
    options: {
      a: "Adapts smoothly and quickly — within a few days",
      b: "Takes about a week to settle into the new pattern",
      c: "Needs 2–3 weeks before it properly adjusts",
      d: "Resists change strongly — it can take months, if it ever fully adapts",
    },
  },
  {
    id: 32,
    axis: "fiber",
    text: "If you had to give an honest rating of your daily fiber intake...",
    options: {
      a: "Very high — I consistently hit 30g+ through abundant plants and legumes",
      b: "Good — around 25g daily, I prioritise fiber-rich foods",
      c: "Moderate — around 15g, I include some fiber but fall short",
      d: "Low — under 10g daily, fiber-rich foods are not a priority",
    },
  },
];

export function calculateResult(answers: Record<number, AxisChoice>): string {
  const scores: Record<AxisKey, number> = {
    diversity: 0,
    inflammation: 0,
    resilience: 0,
    fiber: 0,
  };
  const maxScores: Record<AxisKey, number> = {
    diversity: 0,
    inflammation: 0,
    resilience: 0,
    fiber: 0,
  };

  for (const question of QUIZ_QUESTIONS) {
    const answer = answers[question.id];
    if (answer !== undefined) {
      maxScores[question.axis] += 3;
      scores[question.axis] += CHOICE_WEIGHTS[answer];
    }
  }

  const d =
    maxScores.diversity > 0 && scores.diversity / maxScores.diversity >= 0.5
      ? "D"
      : "S";
  const b =
    maxScores.inflammation > 0 &&
    scores.inflammation / maxScores.inflammation >= 0.5
      ? "B"
      : "I";
  const r =
    maxScores.resilience > 0 && scores.resilience / maxScores.resilience >= 0.5
      ? "R"
      : "V";
  const h =
    maxScores.fiber > 0 && scores.fiber / maxScores.fiber >= 0.5 ? "H" : "L";

  return `${d}${b}${r}${h}`;
}

export function getAxisScores(
  answers: Record<number, AxisChoice>,
): Record<AxisKey, { score: number; max: number }> {
  const scores: Record<AxisKey, number> = {
    diversity: 0,
    inflammation: 0,
    resilience: 0,
    fiber: 0,
  };
  const maxScores: Record<AxisKey, number> = {
    diversity: 0,
    inflammation: 0,
    resilience: 0,
    fiber: 0,
  };

  for (const question of QUIZ_QUESTIONS) {
    const answer = answers[question.id];
    if (answer !== undefined) {
      maxScores[question.axis] += 3;
      scores[question.axis] += CHOICE_WEIGHTS[answer];
    }
  }

  return {
    diversity: { score: scores.diversity, max: maxScores.diversity },
    inflammation: {
      score: scores.inflammation,
      max: maxScores.inflammation,
    },
    resilience: { score: scores.resilience, max: maxScores.resilience },
    fiber: { score: scores.fiber, max: maxScores.fiber },
  };
}

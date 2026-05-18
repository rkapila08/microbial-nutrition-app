export interface StarterKitItem {
  icon: string;
  label: string;
  description: string;
}

export interface ClassStarterKit {
  code: string;
  className: string;
  items: StarterKitItem[];
}

export interface SkillNode {
  level: 1 | 2 | 3 | 4;
  unlockDay: 0 | 2 | 4 | 6;
  icon: string;
  title: string;
  description: string;
}

export interface SkillBranchVariant {
  branchLabel: string;
  nodes: SkillNode[];
}

export interface SkillBranch {
  branch: "fiber" | "rhythm" | "stress";
  icon: string;
  label: string;
  positive: SkillBranchVariant;
  negative: SkillBranchVariant;
}

export interface ResolvedSkillNode extends SkillNode {
  isUnlocked: boolean;
  isNew: boolean;
}

export interface ResolvedSkillBranch {
  branch: string;
  icon: string;
  branchLabel: string;
  nodes: ResolvedSkillNode[];
}

export const CLASS_STARTER_KITS: ClassStarterKit[] = [
  {
    code: "DBRH",
    className: "The Cultivator",
    items: [
      {
        icon: "🫙",
        label: "Fermented Ritual",
        description:
          "Add one fermented food daily — kefir, kimchi, miso, or sauerkraut.",
      },
      {
        icon: "🌱",
        label: "30-Plant Tracker",
        description:
          "Log 30 different plant foods per week in a dedicated journal.",
      },
      {
        icon: "🧅",
        label: "Prebiotic Cycling",
        description:
          "Rotate prebiotics weekly: garlic → leeks → green banana → chicory.",
      },
    ],
  },
  {
    code: "DBRL",
    className: "The Optimizer",
    items: [
      {
        icon: "🌾",
        label: "Fiber Foundation",
        description: "Add one high-fiber food to every meal starting today.",
      },
      {
        icon: "🥜",
        label: "Prebiotic Priority",
        description:
          "Prioritize oats, chicory root, and legumes as your daily fiber sources.",
      },
      {
        icon: "🥦",
        label: "Batch Prep Sunday",
        description:
          "Cook legumes on Sunday for effortless fiber access all week.",
      },
    ],
  },
  {
    code: "DBVH",
    className: "The Naturalist",
    items: [
      {
        icon: "⏰",
        label: "Anchor Breakfast",
        description:
          "Set a consistent breakfast time and protect it 7 days a week.",
      },
      {
        icon: "🧘",
        label: "Pre-Meal Breath",
        description:
          "Take 5 deep breaths before each meal to reduce cortisol's impact on digestion.",
      },
      {
        icon: "📓",
        label: "Disruption Log",
        description:
          "Track what knocks your gut off-course: stress, sleep shifts, or specific foods.",
      },
    ],
  },
  {
    code: "DBVL",
    className: "The Warrior",
    items: [
      {
        icon: "🥣",
        label: "Fiber Ritual",
        description:
          "Build a daily fiber-forward breakfast: overnight oats or chia pudding.",
      },
      {
        icon: "⏰",
        label: "Meal Timing Lock",
        description:
          "Set consistent meal times — especially dinner — to stabilize your gut.",
      },
      {
        icon: "🔄",
        label: "Reset Protocol",
        description:
          "Create a personal gut reset plan to deploy after periods of disruption.",
      },
    ],
  },
  {
    code: "DIRH",
    className: "The Overcomer",
    items: [
      {
        icon: "🐟",
        label: "Anti-Inflammatory Daily",
        description:
          "Add fatty fish or extra virgin olive oil to at least one meal today.",
      },
      {
        icon: "🫐",
        label: "Omega-3 Twice Weekly",
        description:
          "Eat walnuts or sardines twice per week as a dedicated omega-3 ritual.",
      },
      {
        icon: "🔍",
        label: "Trigger Audit",
        description:
          "Check one product label and remove it if it contains refined seed oils.",
      },
    ],
  },
  {
    code: "DIRL",
    className: "The Phoenix",
    items: [
      {
        icon: "🥬",
        label: "Double Your Veg",
        description:
          "Fill half your plate with vegetables at every meal this week.",
      },
      {
        icon: "🫐",
        label: "Polyphenol Protocol",
        description:
          "Add blueberries, dark chocolate (70%+), or green tea to your daily routine.",
      },
      {
        icon: "🚫",
        label: "4-Week Elimination",
        description:
          "Remove alcohol, refined seed oils, and ultra-processed foods for 4 weeks.",
      },
    ],
  },
  {
    code: "DIVH",
    className: "The Explorer",
    items: [
      {
        icon: "🗓️",
        label: "Two-Week Elimination",
        description:
          "Remove one suspected inflammatory trigger food for 14 days.",
      },
      {
        icon: "😴",
        label: "Sleep Anchor",
        description:
          "Set a consistent bedtime — poor sleep is amplifying your inflammation.",
      },
      {
        icon: "🌿",
        label: "Daily Anti-Inflammatory",
        description:
          "Add turmeric and black pepper to one meal every day this week.",
      },
    ],
  },
  {
    code: "DIVL",
    className: "The Drifter",
    items: [
      {
        icon: "🧹",
        label: "Reset Week",
        description:
          "Whole foods only, abundant vegetables, zero processed food for 7 days.",
      },
      {
        icon: "📊",
        label: "Symptom Log",
        description:
          "Track meals and symptoms for 2 weeks to find your personal gut disruptors.",
      },
      {
        icon: "⏰",
        label: "Daily Gut Ritual",
        description:
          "Choose one consistent gut practice: same breakfast at the same time every day.",
      },
    ],
  },
  {
    code: "SBRH",
    className: "The Sensitive",
    items: [
      {
        icon: "🧠",
        label: "Gut-Brain Journal",
        description:
          "Keep a daily gut-mood diary to map your emotional and digestive patterns.",
      },
      {
        icon: "🌿",
        label: "Calm Eating Zone",
        description:
          "Create a phone-free spot at home dedicated solely to eating your meals.",
      },
      {
        icon: "🥄",
        label: "One New Food",
        description:
          "Add one new plant food per week without pressure or expectation.",
      },
    ],
  },
  {
    code: "SBRL",
    className: "The Minimalist",
    items: [
      {
        icon: "🌾",
        label: "One New Food Weekly",
        description:
          "Introduce one high-fiber plant food each week — slow and steady wins.",
      },
      {
        icon: "🥣",
        label: "Soluble Fiber Start",
        description:
          "Begin with oat bran or psyllium — the gentlest fiber sources for sensitive guts.",
      },
      {
        icon: "🔥",
        label: "Cook Your Veg",
        description:
          "Steam or roast vegetables to reduce fermentation, gas, and bloating.",
      },
    ],
  },
  {
    code: "SBVH",
    className: "The Nurturer",
    items: [
      {
        icon: "🛟",
        label: "Recovery Kit",
        description:
          "Prepare your gut recovery meal plan for high-stress or travel days in advance.",
      },
      {
        icon: "⏰",
        label: "Meal Rhythm",
        description:
          "Protect consistent breakfast timing — your sensitive gut thrives on routine.",
      },
      {
        icon: "🍖",
        label: "Gut Lining Stack",
        description:
          "Add bone broth or collagen peptides to your diet 3 times per week.",
      },
    ],
  },
  {
    code: "SBVL",
    className: "The Seeker",
    items: [
      {
        icon: "🌾",
        label: "Slow Fiber Build",
        description:
          "Add 2–3g more fiber per week: start with ripe bananas and cooked oats.",
      },
      {
        icon: "⏰",
        label: "Two Time Anchors",
        description:
          "Set consistent wake and dinner times this week — your gut will feel the difference.",
      },
      {
        icon: "📝",
        label: "Safe Foods List",
        description:
          "Write down 5 fiber-rich foods your gut currently tolerates well.",
      },
    ],
  },
  {
    code: "SIRH",
    className: "The Transformer",
    items: [
      {
        icon: "🐟",
        label: "Gut-Healing Foods",
        description:
          "Add fatty fish, turmeric, or bone broth to your daily meals starting now.",
      },
      {
        icon: "🌱",
        label: "Gradual Ferments",
        description:
          "Start with small amounts of kefir or sauerkraut 3 times per week.",
      },
      {
        icon: "🔬",
        label: "Root Cause Check",
        description:
          "Ask your doctor about testing for H. pylori or SIBO as a potential root cause.",
      },
    ],
  },
  {
    code: "SIRL",
    className: "The Rebuilder",
    items: [
      {
        icon: "🍲",
        label: "Healing Trio Daily",
        description:
          "Eat bone broth, cooked vegetables, and one fermented food every single day.",
      },
      {
        icon: "🚫",
        label: "3-Week Clean Slate",
        description:
          "Cut alcohol, processed foods, and refined sugar for 21 consecutive days.",
      },
      {
        icon: "🌾",
        label: "Slow Fiber Build",
        description:
          "Add 1–2g fiber per week starting with well-cooked lentils and soft oats.",
      },
    ],
  },
  {
    code: "SIVH",
    className: "The Healer",
    items: [
      {
        icon: "🔍",
        label: "Fiber Audit",
        description:
          "Identify which high-fiber foods help vs. worsen your specific symptoms.",
      },
      {
        icon: "🫐",
        label: "Polyphenol First",
        description:
          "Lead each day with anti-inflammatory foods: berries, EVOO, and turmeric.",
      },
      {
        icon: "🔄",
        label: "Recovery Ritual",
        description:
          "Create a specific post-stress meal and practice to deploy on tough days.",
      },
    ],
  },
  {
    code: "SIVL",
    className: "The Wanderer",
    items: [
      {
        icon: "🚫",
        label: "Top 3 Out",
        description:
          "Identify and remove your three biggest inflammatory foods this week.",
      },
      {
        icon: "🥣",
        label: "One New Gut Food",
        description:
          "Add one gut-supporting food weekly: kimchi, kefir, oats, or flaxseeds.",
      },
      {
        icon: "😴",
        label: "Sleep + Stress First",
        description:
          "Address sleep and stress before diet changes — they drive your gut type most.",
      },
    ],
  },
];

export const SKILL_BRANCHES: SkillBranch[] = [
  {
    branch: "fiber",
    icon: "🌾",
    label: "Fiber",
    positive: {
      branchLabel: "Diversity Path",
      nodes: [
        {
          level: 1,
          unlockDay: 0,
          icon: "🥗",
          title: "Diversity Plate",
          description: "Build a meal today with 5+ different plant foods.",
        },
        {
          level: 2,
          unlockDay: 2,
          icon: "🧅",
          title: "Prebiotic Power",
          description:
            "Add a prebiotic food daily: garlic, oats, or chicory root.",
        },
        {
          level: 3,
          unlockDay: 4,
          icon: "🫙",
          title: "Fermented Synergy",
          description:
            "Pair a fermented food with your main meal 5 days this week.",
        },
        {
          level: 4,
          unlockDay: 6,
          icon: "🌱",
          title: "30-Plant Challenge",
          description: "Track 30 distinct plant foods eaten across this week.",
        },
      ],
    },
    negative: {
      branchLabel: "Gentle Build Path",
      nodes: [
        {
          level: 1,
          unlockDay: 0,
          icon: "🥣",
          title: "Gentle Start",
          description:
            "Swap one low-fiber item for a soluble fiber option today.",
        },
        {
          level: 2,
          unlockDay: 2,
          icon: "🥦",
          title: "Swap & Upgrade",
          description: "Replace one refined carb with a whole grain or legume.",
        },
        {
          level: 3,
          unlockDay: 4,
          icon: "🫘",
          title: "Legume Introduction",
          description:
            "Eat a small portion of well-cooked legumes 3 times this week.",
        },
        {
          level: 4,
          unlockDay: 6,
          icon: "📈",
          title: "Fiber Habit Stack",
          description:
            "Start every day with a 10g fiber breakfast — oats, seeds, or fruit.",
        },
      ],
    },
  },
  {
    branch: "rhythm",
    icon: "🕐",
    label: "Rhythm",
    positive: {
      branchLabel: "Chrono-Eating Path",
      nodes: [
        {
          level: 1,
          unlockDay: 0,
          icon: "⏰",
          title: "Anchor Meal",
          description:
            "Eat breakfast within the same 30-minute window every morning.",
        },
        {
          level: 2,
          unlockDay: 2,
          icon: "🌙",
          title: "Wind-Down Window",
          description:
            "Stop eating 2–3 hours before bed for 3 consecutive nights.",
        },
        {
          level: 3,
          unlockDay: 4,
          icon: "🍽️",
          title: "Sleep Nutrition Stack",
          description:
            "Add magnesium-rich foods at dinner: pumpkin seeds or leafy greens.",
        },
        {
          level: 4,
          unlockDay: 6,
          icon: "🌅",
          title: "Chrono-Eating Protocol",
          description:
            "Eat your largest meal before 2pm for 3 days to align with your circadian peak.",
        },
      ],
    },
    negative: {
      branchLabel: "Consistency Path",
      nodes: [
        {
          level: 1,
          unlockDay: 0,
          icon: "🌅",
          title: "Same Wake Time",
          description:
            "Set an alarm for the same time tomorrow — consistency starts here.",
        },
        {
          level: 2,
          unlockDay: 2,
          icon: "🫖",
          title: "Pre-Sleep Ritual",
          description:
            "Create a 20-min wind-down: no screens, herbal tea, and light stretching.",
        },
        {
          level: 3,
          unlockDay: 4,
          icon: "🛟",
          title: "Recovery Meal Plan",
          description:
            "Prep your go-to recovery meal for disruption days — know it before you need it.",
        },
        {
          level: 4,
          unlockDay: 6,
          icon: "✈️",
          title: "Travel Gut Protocol",
          description:
            "Build a portable gut kit: probiotic capsules, fiber bar, and your anchor routine.",
        },
      ],
    },
  },
  {
    branch: "stress",
    icon: "🧘",
    label: "Stress",
    positive: {
      branchLabel: "Gut-Brain Path",
      nodes: [
        {
          level: 1,
          unlockDay: 0,
          icon: "🌬️",
          title: "Pre-Meal Breath",
          description:
            "Take 5 slow breaths before every meal to activate rest-and-digest.",
        },
        {
          level: 2,
          unlockDay: 2,
          icon: "🫐",
          title: "Polyphenol Daily",
          description:
            "Add one polyphenol source daily: green tea, dark berries, or dark chocolate.",
        },
        {
          level: 3,
          unlockDay: 4,
          icon: "🐟",
          title: "Omega-3 Boost",
          description:
            "Eat fatty fish twice this week or add a daily omega-3 supplement.",
        },
        {
          level: 4,
          unlockDay: 6,
          icon: "📓",
          title: "Gut-Brain Log",
          description:
            "Track mood and gut symptoms daily to map your personal gut-brain connection.",
        },
      ],
    },
    negative: {
      branchLabel: "Anti-Inflammatory Path",
      nodes: [
        {
          level: 1,
          unlockDay: 0,
          icon: "🚫",
          title: "Remove One Trigger",
          description:
            "Identify and remove one inflammatory food from your diet this week.",
        },
        {
          level: 2,
          unlockDay: 2,
          icon: "🐟",
          title: "Anti-Inflammatory Stack",
          description:
            "Build your daily base: extra virgin olive oil, omega-3s, and turmeric.",
        },
        {
          level: 3,
          unlockDay: 4,
          icon: "🛡️",
          title: "Gut Lining Protocol",
          description:
            "Add gut lining foods 3 times this week: bone broth, zinc, or collagen.",
        },
        {
          level: 4,
          unlockDay: 6,
          icon: "📅",
          title: "28-Day Reset Review",
          description:
            "Log your inflammation reset progress: where you started, now, and your goal.",
        },
      ],
    },
  },
];

function parseProfileAxes(code: string) {
  return {
    diversity: code[0] ?? "",
    inflammation: code[1] ?? "",
    resilience: code[2] ?? "",
    fiber: code[3] ?? "",
  };
}

export function getStarterKit(code: string): ClassStarterKit | undefined {
  return CLASS_STARTER_KITS.find((k) => k.code === code);
}

export function resolveSkillTree(
  code: string,
  completedDays: number,
): ResolvedSkillBranch[] {
  const axes = parseProfileAxes(code);
  return SKILL_BRANCHES.map((branch) => {
    let variant: SkillBranchVariant;
    if (branch.branch === "fiber") {
      variant = axes.fiber === "H" ? branch.positive : branch.negative;
    } else if (branch.branch === "rhythm") {
      variant = axes.resilience === "R" ? branch.positive : branch.negative;
    } else {
      variant = axes.inflammation === "B" ? branch.positive : branch.negative;
    }
    const nodes: ResolvedSkillNode[] = variant.nodes.map((node) => ({
      ...node,
      isUnlocked: completedDays >= node.unlockDay,
      isNew: completedDays === node.unlockDay && node.unlockDay > 0,
    }));
    return {
      branch: branch.branch,
      icon: branch.icon,
      branchLabel: variant.branchLabel,
      nodes,
    };
  });
}

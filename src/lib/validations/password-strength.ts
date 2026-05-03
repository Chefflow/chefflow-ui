export interface PasswordStrength {
  score: number;
  labelKey: string;
  color: string;
  percentage: number;
  feedbackKeys: string[];
}

export function calculatePasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return {
      score: 0,
      labelKey: "enterPassword",
      color: "bg-gray-300",
      percentage: 0,
      feedbackKeys: [],
    };
  }

  let score = 0;
  const feedbackKeys: string[] = [];

  if (password.length >= 8) {
    score += 1;
  } else {
    feedbackKeys.push("length");
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedbackKeys.push("uppercase");
  }

  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedbackKeys.push("lowercase");
  }

  if (/[0-9]/.test(password)) {
    score += 1;
  } else {
    feedbackKeys.push("number");
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1;
  } else {
    feedbackKeys.push("special");
  }

  const configs = [
    {
      score: 0,
      labelKey: "enterPassword",
      color: "bg-gray-300",
      percentage: 0,
    },
    { score: 1, labelKey: "veryWeak", color: "bg-red-500", percentage: 20 },
    { score: 2, labelKey: "weak", color: "bg-orange-500", percentage: 40 },
    { score: 3, labelKey: "fair", color: "bg-yellow-500", percentage: 60 },
    { score: 4, labelKey: "good", color: "bg-blue-500", percentage: 80 },
    { score: 5, labelKey: "strong", color: "bg-green-500", percentage: 100 },
  ];

  const config = configs.find((c) => c.score === score) || configs[0];

  return {
    score,
    labelKey: config.labelKey,
    color: config.color,
    percentage: config.percentage,
    feedbackKeys,
  };
}

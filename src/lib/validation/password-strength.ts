export interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  percentage: number;
  feedback: string[];
}

export function calculatePasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return {
      score: 0,
      label: "Enter password",
      color: "bg-gray-300",
      percentage: 0,
      feedback: [],
    };
  }

  let score = 0;
  const feedback: string[] = [];

  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push("At least 8 characters");
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push("One uppercase letter");
  }

  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push("One lowercase letter");
  }

  if (/[0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push("One number");
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push("One special character (!@#$%^&*)");
  }

  const configs = [
    {
      score: 0,
      label: "Enter password",
      color: "bg-gray-300",
      percentage: 0,
    },
    {
      score: 1,
      label: "Very Weak",
      color: "bg-red-500",
      percentage: 20,
    },
    {
      score: 2,
      label: "Weak",
      color: "bg-orange-500",
      percentage: 40,
    },
    {
      score: 3,
      label: "Fair",
      color: "bg-yellow-500",
      percentage: 60,
    },
    {
      score: 4,
      label: "Good",
      color: "bg-blue-500",
      percentage: 80,
    },
    {
      score: 5,
      label: "Strong",
      color: "bg-green-500",
      percentage: 100,
    },
  ];

  const config = configs.find((c) => c.score === score) || configs[0];

  return {
    score,
    label: config.label,
    color: config.color,
    percentage: config.percentage,
    feedback,
  };
}

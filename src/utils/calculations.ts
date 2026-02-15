export interface UserInputs {
  age: number;
  sex: 'male' | 'female';
  height: number; // cm
  weight: number; // kg
  waistCircumference?: number; // cm
  restingHeartRate: number; // bpm
  sleepHours: number; // hrs/night
  weeklyStrengthSessions: number;
  weeklyCardioSessions: number;
  stepsPerDay: number;
  alcoholFrequency: 'never' | 'monthly' | 'weekly' | 'daily';
  smokingStatus: 'never' | 'former' | 'current';
  bodyFatPercentage?: number; // %
}

export interface UserMetrics {
  bmi: number;
  bmr: number;
  tdee: number;
  leanBodyMass: number | null;
  vo2MaxEstimate: number;
  biologicalAge: number;
  healthIndex: number;
  riskTier: 'Low' | 'Moderate' | 'Elevated' | 'High';
}

export const calculateBMI = (weight: number, height: number): number => {
  if (height <= 0) return 0;
  return weight / ((height / 100) * (height / 100));
};

export const calculateBMR = (
  weight: number,
  height: number,
  age: number,
  sex: 'male' | 'female'
): number => {
  // Mifflin-St Jeor Equation
  let bmr = (10 * weight) + (6.25 * height) - (5 * age);
  if (sex === 'male') {
    bmr += 5;
  } else {
    bmr -= 161;
  }
  return bmr;
};

export const calculateTDEE = (bmr: number, steps: number, strength: number, cardio: number): number => {
  // Determine activity multiplier based on steps and weekly sessions
  let activityLevel = 1.2; // Sedentary
  const weeklyActivity = strength + cardio;

  if (steps > 12000 || weeklyActivity > 6) {
    activityLevel = 1.725; // Very Active
  } else if (steps > 10000 || weeklyActivity > 4) {
    activityLevel = 1.55; // Moderately Active
  } else if (steps > 7000 || weeklyActivity > 2) {
    activityLevel = 1.375; // Lightly Active
  }

  return bmr * activityLevel;
};

export const calculateLeanBodyMass = (weight: number, bodyFatPercentage?: number): number | null => {
  if (bodyFatPercentage !== undefined) {
    return weight * (1 - bodyFatPercentage / 100);
  }
  return null;
};

export const calculateVO2Max = (age: number, restingHeartRate: number): number => {
  // Uth-Sørensen-Overgaard-Pedersen estimation
  // VO2max = 15.3 * (MHR / RHR)
  const maxHeartRate = 220 - age;
  if (restingHeartRate <= 0) return 0;
  return 15.3 * (maxHeartRate / restingHeartRate);
};

export const calculateBiologicalAge = (inputs: UserInputs, bmi: number): number => {
  let bioAge = inputs.age;

  // Smoking
  if (inputs.smokingStatus === 'current') bioAge += 8;
  if (inputs.smokingStatus === 'former') bioAge += 3;

  // Sleep
  if (inputs.sleepHours < 6) bioAge += 3;
  else if (inputs.sleepHours > 7 && inputs.sleepHours < 9) bioAge -= 2;

  // Activity
  const weeklyExercise = inputs.weeklyCardioSessions + inputs.weeklyStrengthSessions;
  if (weeklyExercise < 1) bioAge += 2;
  else if (weeklyExercise > 4) bioAge -= 3;

  // BMI (general health proxy)
  if (bmi > 30) bioAge += 4;
  else if (bmi > 25) bioAge += 2;
  else if (bmi >= 18.5 && bmi <= 25) bioAge -= 1;

  // Alcohol
  if (inputs.alcoholFrequency === 'daily') bioAge += 4;
  if (inputs.alcoholFrequency === 'weekly') bioAge += 1;

  // Resting Heart Rate
  if (inputs.restingHeartRate > 80) bioAge += 3;
  else if (inputs.restingHeartRate < 60) bioAge -= 3;

  // Cap the difference to avoid unrealistic values
  const diff = bioAge - inputs.age;
  const maxDiff = 15;
  const clampedDiff = Math.max(-maxDiff, Math.min(maxDiff, diff));

  return inputs.age + clampedDiff;
};

export const calculateHealthIndex = (inputs: UserInputs, bmi: number, vo2Max: number): number => {
  let score = 0; // Base score

  // 1. Body Composition (BMI) - 20 pts
  if (bmi >= 18.5 && bmi <= 24.9) score += 20;
  else if (bmi >= 25 && bmi <= 29.9) score += 10;
  else if (bmi < 18.5) score += 10;
  else score += 0; // Obese

  // 2. Cardiovascular Health (VO2 Max & RHR) - 25 pts
  // VO2 Max norms (very rough averages)
  // > 45 (excellent) -> +15, 35-45 (good) -> +10, < 35 -> +0
  if (vo2Max > 45) score += 15;
  else if (vo2Max > 35) score += 10;
  else if (vo2Max > 28) score += 5;

  // RHR
  if (inputs.restingHeartRate < 60) score += 10;
  else if (inputs.restingHeartRate < 70) score += 7;
  else if (inputs.restingHeartRate < 80) score += 3;

  // 3. Lifestyle (Sleep, Smoking, Alcohol) - 30 pts
  // Sleep
  if (inputs.sleepHours >= 7 && inputs.sleepHours <= 9) score += 10;
  else if (inputs.sleepHours >= 6) score += 5;

  // Smoking
  if (inputs.smokingStatus === 'never') score += 10;
  else if (inputs.smokingStatus === 'former') score += 5;

  // Alcohol
  if (inputs.alcoholFrequency === 'never') score += 10;
  else if (inputs.alcoholFrequency === 'monthly') score += 8;
  else if (inputs.alcoholFrequency === 'weekly') score += 5;

  // 4. Activity (Steps, Exercise) - 25 pts
  const weeklyExercise = inputs.weeklyCardioSessions + inputs.weeklyStrengthSessions;
  if (weeklyExercise >= 5) score += 15;
  else if (weeklyExercise >= 3) score += 10;
  else if (weeklyExercise >= 1) score += 5;

  // Steps
  if (inputs.stepsPerDay >= 10000) score += 10;
  else if (inputs.stepsPerDay >= 7000) score += 7;
  else if (inputs.stepsPerDay >= 5000) score += 3;

  return Math.min(100, Math.max(0, score));
};

export const calculateRiskTier = (healthIndex: number): 'Low' | 'Moderate' | 'Elevated' | 'High' => {
  if (healthIndex >= 80) return 'Low';
  if (healthIndex >= 60) return 'Moderate';
  if (healthIndex >= 40) return 'Elevated';
  return 'High';
};

export const getPercentile = (metric: 'bmi' | 'vo2Max' | 'healthIndex', value: number): number => {
  // Mock distribution logic based on normal distribution approximation
  // This is a simplified simulation

  let mean = 0;
  let stdDev = 1;

  switch (metric) {
    case 'bmi':
      mean = 26; // Approx US average
      stdDev = 5;
      break;
    case 'vo2Max':
      mean = 35;
      stdDev = 7;
      break;
    case 'healthIndex':
      mean = 55;
      stdDev = 15;
      break;
  }

  // Error function approximation for CDF
  const z = (value - mean) / stdDev;
  let p = 0.5 * (1 + Math.sign(z) * Math.sqrt(1 - Math.exp(-2 * z * z / Math.PI)));

  if (metric === 'bmi') {
      // Custom logic for BMI: optimal is ~21-22.
      // Deviation from 22 is what matters.
      const distFromOptimal = Math.abs(value - 22);
      // Map dist 0 -> 99%, dist 15 -> 1%
      p = Math.max(1, 100 - (distFromOptimal * 6));
      return Math.round(p);
  }

  return Math.round(p * 100);
};

export const calculateAllMetrics = (inputs: UserInputs): UserMetrics => {
  const bmi = calculateBMI(inputs.weight, inputs.height);
  const bmr = calculateBMR(inputs.weight, inputs.height, inputs.age, inputs.sex);
  const tdee = calculateTDEE(bmr, inputs.stepsPerDay, inputs.weeklyStrengthSessions, inputs.weeklyCardioSessions);
  const vo2Max = calculateVO2Max(inputs.age, inputs.restingHeartRate);
  const leanBodyMass = calculateLeanBodyMass(inputs.weight, inputs.bodyFatPercentage);
  const biologicalAge = calculateBiologicalAge(inputs, bmi);
  const healthIndex = calculateHealthIndex(inputs, bmi, vo2Max);
  const riskTier = calculateRiskTier(healthIndex);

  return {
    bmi,
    bmr,
    tdee,
    leanBodyMass,
    vo2MaxEstimate: vo2Max,
    biologicalAge,
    healthIndex,
    riskTier
  };
};

export const calculateProjectedMetrics = (currentInputs: UserInputs, modification: Partial<UserInputs>): UserMetrics => {
  const projectedInputs = { ...currentInputs, ...modification };
  return calculateAllMetrics(projectedInputs);
};

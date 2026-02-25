import React from 'react';
import { motion } from 'framer-motion';
import { Utensils, Dumbbell, ChevronRight } from 'lucide-react';
import type { UserInputs, UserMetrics } from '../utils/calculations';

interface RecommendationsProps {
  inputs: UserInputs;
  metrics: UserMetrics;
}

export const Recommendations: React.FC<RecommendationsProps> = ({ inputs, metrics }) => {
  // Simple rule-based generation
  const getDietPlan = () => {
    if (metrics.bmi > 25) {
      return {
        title: "Metabolic Reset & Fat Loss",
        calories: Math.round(metrics.tdee - 500),
        macros: "High Protein (40%), Moderate Fat (30%), Low Carb (30%)",
        meals: [
          "Breakfast: Egg white omelet with spinach & avocado",
          "Lunch: Grilled chicken breast salad with olive oil",
          "Dinner: Baked salmon with asparagus",
          "Snack: Greek yogurt with berries"
        ]
      };
    } else if (metrics.bmi < 18.5) {
      return {
        title: "Lean Mass Builder",
        calories: Math.round(metrics.tdee + 300),
        macros: "High Carb (50%), Moderate Protein (30%), Moderate Fat (20%)",
        meals: [
          "Breakfast: Oatmeal with peanut butter, banana & protein powder",
          "Lunch: Turkey wrap with hummus and sweet potato",
          "Dinner: Steak with quinoa and roasted vegetables",
          "Snack: Protein shake + handful of almonds"
        ]
      };
    } else {
      return {
        title: "Performance Maintenance",
        calories: Math.round(metrics.tdee),
        macros: "Balanced (33% / 33% / 33%)",
        meals: [
          "Breakfast: Avocado toast with poached eggs",
          "Lunch: Quinoa bowl with grilled tofu/chicken",
          "Dinner: White fish with brown rice and broccoli",
          "Snack: Apple with almond butter"
        ]
      };
    }
  };

  const getWorkoutPlan = () => {
    if (metrics.vo2MaxEstimate < 35) {
      return {
        title: "Cardiovascular Engine",
        focus: "Aerobic Capacity",
        frequency: "4x / week",
        routine: [
          "Day 1: 30min Zone 2 Jog",
          "Day 2: HIIT Intervals (20min)",
          "Day 3: Active Recovery (Walk/Swim)",
          "Day 4: Long steady run (45min+)"
        ]
      };
    } else if (inputs.weeklyStrengthSessions < 2) {
      return {
        title: "Strength Foundation",
        focus: "Hypertrophy & Strength",
        frequency: "3x / week",
        routine: [
          "Day 1: Full Body (Squat, Pushups, Rows)",
          "Day 2: Rest / Light Mobility",
          "Day 3: Upper Body Focus (Press, Pullups)",
          "Day 4: Lower Body Focus (Lunges, Deadlifts)"
        ]
      };
    } else {
      return {
        title: "Hybrid Athlete",
        focus: "Power & Endurance",
        frequency: "5x / week",
        routine: [
          "Day 1: Heavy Compound Lifts (5x5)",
          "Day 2: Tempo Run (5km)",
          "Day 3: Plyometrics & Core",
          "Day 4: Zone 2 Recovery Cardio",
          "Day 5: Metcon / Circuit Training"
        ]
      };
    }
  };

  const diet = getDietPlan();
  const workout = getWorkoutPlan();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Diet Plan */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-panel p-6 rounded-2xl"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-emerald-500/20 rounded-lg">
            <Utensils className="text-emerald-400" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Daily Fuel</h3>
            <p className="text-xs text-gray-400">{diet.title}</p>
          </div>
        </div>

        <div className="mb-4 p-3 bg-white/5 rounded-xl border border-white/5">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-300">Target Calories</span>
                <span className="text-lg font-bold text-emerald-400">{diet.calories}</span>
            </div>
            <div className="text-xs text-gray-500">{diet.macros}</div>
        </div>

        <ul className="space-y-3">
            {diet.meals.map((meal, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <ChevronRight size={14} className="mt-1 text-gray-500 flex-shrink-0" />
                    {meal}
                </li>
            ))}
        </ul>
      </motion.div>

      {/* Workout Plan */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-panel p-6 rounded-2xl"
      >
        <div className="flex items-center gap-3 mb-4">
           <div className="p-2 bg-blue-500/20 rounded-lg">
            <Dumbbell className="text-blue-400" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Training Protocol</h3>
            <p className="text-xs text-gray-400">{workout.title}</p>
          </div>
        </div>

        <div className="mb-4 p-3 bg-white/5 rounded-xl border border-white/5">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-300">Primary Focus</span>
                <span className="text-sm font-bold text-blue-400">{workout.focus}</span>
            </div>
             <div className="text-xs text-gray-500">{workout.frequency}</div>
        </div>

        <ul className="space-y-3">
            {workout.routine.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <ChevronRight size={14} className="mt-1 text-gray-500 flex-shrink-0" />
                    {item}
                </li>
            ))}
        </ul>
      </motion.div>
    </div>
  );
};

import React from 'react';
import type { UserInputs, UserMetrics } from '../utils/calculations';
import { Utensils, Dumbbell, Flame, Salad, Battery, Activity } from 'lucide-react';

interface RecommendationsProps {
  inputs: UserInputs;
  metrics: UserMetrics;
}

export const Recommendations: React.FC<RecommendationsProps> = ({ inputs, metrics }) => {
  const getDietRecommendations = () => {
    const recs = [];

    if (metrics.bmi > 25) {
      recs.push({ title: "Calorie Deficit", desc: "Aim for a 300-500 kcal deficit.", icon: Salad, color: "text-green-400" });
      recs.push({ title: "Low Glycemic Index", desc: "Focus on complex carbs.", icon: Utensils, color: "text-blue-400" });
    } else if (metrics.bmi < 18.5) {
      recs.push({ title: "Calorie Surplus", desc: "Increase intake by 300-500 kcal.", icon: Utensils, color: "text-yellow-400" });
      recs.push({ title: "Protein Focus", desc: "1.6g - 2.2g protein per kg of bodyweight.", icon: Flame, color: "text-red-400" });
    } else {
      recs.push({ title: "Maintenance", desc: "Keep current intake, focus on quality.", icon: Utensils, color: "text-blue-400" });
    }

    if (inputs.weeklyStrengthSessions > 2) {
      recs.push({ title: "Post-Workout Fuel", desc: "Carbs + Protein within 2h of training.", icon: Battery, color: "text-purple-400" });
    }

    if (metrics.riskTier === 'High' || metrics.riskTier === 'Elevated') {
       recs.push({ title: "Anti-Inflammatory", desc: "More berries, fatty fish, and greens.", icon: Salad, color: "text-green-400" });
    }

    return recs.slice(0, 3);
  };

  const getWorkoutRecommendations = () => {
    const recs = [];

    if (metrics.vo2MaxEstimate < 35 || inputs.restingHeartRate > 75) {
      recs.push({ title: "Zone 2 Cardio", desc: "45-60 mins at conversational pace, 3x/week.", icon: Activity, color: "text-rose-400" });
    }

    if (inputs.stepsPerDay < 6000) {
      recs.push({ title: "NEAT Increase", desc: "Aim for 8k steps. Take stairs, walk during calls.", icon: Activity, color: "text-yellow-400" });
    }

    if (inputs.weeklyStrengthSessions < 2) {
      recs.push({ title: "Strength Foundation", desc: "2x Full Body sessions per week.", icon: Dumbbell, color: "text-blue-400" });
    } else {
       recs.push({ title: "Progressive Overload", desc: "Increase weight or reps every session.", icon: Dumbbell, color: "text-purple-400" });
    }

    if (metrics.riskTier === 'High') {
       recs.push({ title: "Low Impact", desc: "Swimming or Cycling to protect joints.", icon: Activity, color: "text-teal-400" });
    }

    return recs.slice(0, 3);
  };

  const dietRecs = getDietRecommendations();
  const workoutRecs = getWorkoutRecommendations();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
      {/* Diet Section */}
      <div className="glass-panel p-5 rounded-xl border border-white/5 bg-white/5 h-full">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Utensils size={20} className="text-emerald-400" /> Nutrition Plan
        </h3>
        <div className="space-y-3">
          {dietRecs.map((rec, i) => (
            <div key={i} className="flex gap-3 items-start p-3 rounded-lg bg-black/20 border border-white/5 hover:bg-white/5 transition-colors">
              <rec.icon size={18} className={`mt-0.5 ${rec.color}`} />
              <div>
                <h4 className="text-sm font-semibold text-gray-200">{rec.title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{rec.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Workout Section */}
      <div className="glass-panel p-5 rounded-xl border border-white/5 bg-white/5 h-full">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Dumbbell size={20} className="text-blue-400" /> Training Protocol
        </h3>
        <div className="space-y-3">
          {workoutRecs.map((rec, i) => (
            <div key={i} className="flex gap-3 items-start p-3 rounded-lg bg-black/20 border border-white/5 hover:bg-white/5 transition-colors">
              <rec.icon size={18} className={`mt-0.5 ${rec.color}`} />
              <div>
                <h4 className="text-sm font-semibold text-gray-200">{rec.title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{rec.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { TrendingUp, Moon, Zap, Scale } from 'lucide-react';

export interface ProjectionState {
  loseWeight: boolean;
  gainMuscle: boolean;
  moreCardio: boolean;
  moreSleep: boolean;
}

interface ProjectionsPanelProps {
  projections: ProjectionState;
  setProjections: React.Dispatch<React.SetStateAction<ProjectionState>>;
}

export const ProjectionsPanel: React.FC<ProjectionsPanelProps> = ({ projections, setProjections }) => {
  const toggle = (key: keyof ProjectionState) => {
    setProjections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="glass-panel p-6 rounded-2xl">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="text-purple-400" size={18} />
        <h3 className="text-sm font-semibold text-white/90">Smart Projections</h3>
      </div>
      <p className="text-xs text-gray-400 mb-4">
        Toggle scenarios to visualize potential health impact.
      </p>

      <div className="space-y-3">
        <button
          onClick={() => toggle('loseWeight')}
          className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
            projections.loseWeight
              ? 'bg-blue-500/20 border-blue-500/50 text-white'
              : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'
          }`}
        >
          <div className="flex items-center gap-3">
            <Scale size={16} />
            <span className="text-sm">Lose 10 lbs</span>
          </div>
          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${projections.loseWeight ? 'border-blue-400 bg-blue-400' : 'border-gray-600'}`}>
            {projections.loseWeight && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
          </div>
        </button>

        <button
          onClick={() => toggle('gainMuscle')}
          className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
            projections.gainMuscle
              ? 'bg-emerald-500/20 border-emerald-500/50 text-white'
              : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'
          }`}
        >
          <div className="flex items-center gap-3">
            <TrendingUp size={16} />
            <span className="text-sm">Gain 5 lbs Muscle</span>
          </div>
          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${projections.gainMuscle ? 'border-emerald-400 bg-emerald-400' : 'border-gray-600'}`}>
            {projections.gainMuscle && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
          </div>
        </button>

        <button
          onClick={() => toggle('moreCardio')}
          className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
            projections.moreCardio
              ? 'bg-orange-500/20 border-orange-500/50 text-white'
              : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'
          }`}
        >
          <div className="flex items-center gap-3">
            <Zap size={16} />
            <span className="text-sm">+3 Cardio Sessions</span>
          </div>
          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${projections.moreCardio ? 'border-orange-400 bg-orange-400' : 'border-gray-600'}`}>
            {projections.moreCardio && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
          </div>
        </button>

        <button
          onClick={() => toggle('moreSleep')}
          className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
            projections.moreSleep
              ? 'bg-indigo-500/20 border-indigo-500/50 text-white'
              : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'
          }`}
        >
          <div className="flex items-center gap-3">
            <Moon size={16} />
            <span className="text-sm">+1 Hour Sleep</span>
          </div>
          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${projections.moreSleep ? 'border-indigo-400 bg-indigo-400' : 'border-gray-600'}`}>
            {projections.moreSleep && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
          </div>
        </button>
      </div>
    </div>
  );
};

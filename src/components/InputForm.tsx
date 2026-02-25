import React from 'react';
import type { UserInputs } from '../utils/calculations';
import { User, Heart, Zap, Wine, Scale, Ruler } from 'lucide-react';

interface InputFormProps {
  inputs: UserInputs;
  setInputs: React.Dispatch<React.SetStateAction<UserInputs>>;
  unitSystem: 'metric' | 'imperial';
  setUnitSystem: React.Dispatch<React.SetStateAction<'metric' | 'imperial'>>;
}

export const InputForm: React.FC<InputFormProps> = ({ inputs, setInputs, unitSystem, setUnitSystem }) => {
  const isMetric = unitSystem === 'metric';

  const handleChange = (field: keyof UserInputs, value: any) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  // Conversions
  const toLbs = (kg: number) => Math.round(kg * 2.20462);
  const toKg = (lbs: number) => lbs / 2.20462;

  const toFtIn = (cm: number) => {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return { feet, inches };
  };

  const toCm = (ft: number, inc: number) => (ft * 12 + inc) * 2.54;

  const toInches = (cm: number) => Math.round(cm / 2.54);
  const inchToCm = (inc: number) => inc * 2.54;

  const handleWeightChange = (val: number) => {
    if (isMetric) handleChange('weight', val);
    else handleChange('weight', toKg(val));
  };

  const handleHeightChangeFt = (ft: number) => {
    const { inches } = toFtIn(inputs.height);
    handleChange('height', toCm(ft, inches));
  };

  const handleHeightChangeIn = (inc: number) => {
    const { feet } = toFtIn(inputs.height);
    handleChange('height', toCm(feet, inc));
  };

  const handleWaistChange = (val: number) => {
    if (isMetric) handleChange('waistCircumference', val);
    else handleChange('waistCircumference', inchToCm(val));
  };

  return (
    <div className="glass-panel p-6 rounded-2xl h-full overflow-y-auto max-h-[calc(100vh-140px)] custom-scrollbar">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Your Metrics
          </h2>
          <p className="text-gray-500 text-xs mt-1">
            Input your data to generate your performance profile.
          </p>
        </div>

        {/* Unit Toggle */}
        <button
          onClick={() => setUnitSystem(prev => prev === 'metric' ? 'imperial' : 'metric')}
          className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
        >
          <Ruler size={14} className="text-blue-400" />
          <span className="text-xs font-medium text-gray-300">
            {isMetric ? 'Metric' : 'Imperial'}
          </span>
        </button>
      </div>

      <div className="space-y-8">
        {/* Personal Details */}
        <section>
          <h3 className="text-sm font-semibold text-white/80 mb-4 flex items-center gap-2">
            <User size={16} className="text-blue-400" /> Personal Details
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Age</label>
              <input
                type="number"
                value={inputs.age}
                onChange={(e) => handleChange('age', Number(e.target.value))}
                className="w-full glass-input rounded-lg p-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Sex</label>
              <select
                value={inputs.sex}
                onChange={(e) => handleChange('sex', e.target.value)}
                className="w-full glass-input rounded-lg p-2.5 text-sm appearance-none cursor-pointer"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            {/* Height Input */}
            {isMetric ? (
              <div>
                <label className="block text-xs text-gray-400 mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={Math.round(inputs.height)}
                  onChange={(e) => handleChange('height', Number(e.target.value))}
                  className="w-full glass-input rounded-lg p-2.5 text-sm"
                />
              </div>
            ) : (
              <div className="col-span-1">
                <label className="block text-xs text-gray-400 mb-1">Height (ft / in)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Ft"
                    value={toFtIn(inputs.height).feet}
                    onChange={(e) => handleHeightChangeFt(Number(e.target.value))}
                    className="w-full glass-input rounded-lg p-2.5 text-sm"
                  />
                  <input
                    type="number"
                    placeholder="In"
                    value={toFtIn(inputs.height).inches}
                    onChange={(e) => handleHeightChangeIn(Number(e.target.value))}
                    className="w-full glass-input rounded-lg p-2.5 text-sm"
                  />
                </div>
              </div>
            )}

            {/* Weight Input */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">Weight ({isMetric ? 'kg' : 'lbs'})</label>
              <input
                type="number"
                value={isMetric ? Math.round(inputs.weight) : toLbs(inputs.weight)}
                onChange={(e) => handleWeightChange(Number(e.target.value))}
                className="w-full glass-input rounded-lg p-2.5 text-sm"
              />
            </div>
          </div>
        </section>

        {/* Body Composition */}
        <section>
          <h3 className="text-sm font-semibold text-white/80 mb-4 flex items-center gap-2">
            <Scale size={16} className="text-emerald-400" /> Composition
          </h3>
          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-xs text-gray-400 mb-1">Body Fat % <span className="text-gray-600">(opt)</span></label>
              <input
                type="number"
                value={inputs.bodyFatPercentage || ''}
                placeholder="Ex: 15"
                onChange={(e) => handleChange('bodyFatPercentage', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full glass-input rounded-lg p-2.5 text-sm"
              />
            </div>
             <div>
              <label className="block text-xs text-gray-400 mb-1">Waist ({isMetric ? 'cm' : 'in'}) <span className="text-gray-600">(opt)</span></label>
              <input
                type="number"
                value={inputs.waistCircumference ? (isMetric ? inputs.waistCircumference : toInches(inputs.waistCircumference)) : ''}
                 placeholder={isMetric ? "Ex: 80" : "Ex: 32"}
                onChange={(e) => handleWaistChange(Number(e.target.value))}
                className="w-full glass-input rounded-lg p-2.5 text-sm"
              />
            </div>
          </div>
        </section>

        {/* Health & Recovery */}
        <section>
          <h3 className="text-sm font-semibold text-white/80 mb-4 flex items-center gap-2">
            <Heart size={16} className="text-rose-400" /> Health & Recovery
          </h3>
          <div className="grid grid-cols-2 gap-4">
             <div className="col-span-1">
              <label className="block text-xs text-gray-400 mb-1">Resting HR (bpm)</label>
              <input
                type="number"
                value={inputs.restingHeartRate}
                onChange={(e) => handleChange('restingHeartRate', Number(e.target.value))}
                className="w-full glass-input rounded-lg p-2.5 text-sm"
              />
            </div>
             <div className="col-span-1">
              <label className="block text-xs text-gray-400 mb-1">Sleep (hrs)</label>
              <input
                type="number"
                step="0.5"
                value={inputs.sleepHours}
                onChange={(e) => handleChange('sleepHours', Number(e.target.value))}
                className="w-full glass-input rounded-lg p-2.5 text-sm"
              />
            </div>
          </div>
        </section>

        {/* Activity */}
        <section>
          <h3 className="text-sm font-semibold text-white/80 mb-4 flex items-center gap-2">
            <Zap size={16} className="text-yellow-400" /> Activity Level
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Steps per Day</label>
              <input
                type="range"
                min="0"
                max="25000"
                step="500"
                value={inputs.stepsPerDay}
                onChange={(e) => handleChange('stepsPerDay', Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span className="text-blue-400 font-medium">{inputs.stepsPerDay.toLocaleString()}</span>
                <span>25k+</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Strength / Wk</label>
                <input
                  type="number"
                  value={inputs.weeklyStrengthSessions}
                  onChange={(e) => handleChange('weeklyStrengthSessions', Number(e.target.value))}
                  className="w-full glass-input rounded-lg p-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Cardio / Wk</label>
                <input
                  type="number"
                  value={inputs.weeklyCardioSessions}
                  onChange={(e) => handleChange('weeklyCardioSessions', Number(e.target.value))}
                  className="w-full glass-input rounded-lg p-2.5 text-sm"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Lifestyle */}
        <section>
           <h3 className="text-sm font-semibold text-white/80 mb-4 flex items-center gap-2">
            <Wine size={16} className="text-purple-400" /> Lifestyle
          </h3>
          <div className="space-y-3">
             <div>
              <label className="block text-xs text-gray-400 mb-1">Alcohol Intake</label>
              <select
                value={inputs.alcoholFrequency}
                onChange={(e) => handleChange('alcoholFrequency', e.target.value)}
                className="w-full glass-input rounded-lg p-2.5 text-sm appearance-none cursor-pointer"
              >
                <option value="never">Never</option>
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
                <option value="daily">Daily</option>
              </select>
            </div>
             <div>
              <label className="block text-xs text-gray-400 mb-1">Smoking Status</label>
              <select
                value={inputs.smokingStatus}
                onChange={(e) => handleChange('smokingStatus', e.target.value)}
                className="w-full glass-input rounded-lg p-2.5 text-sm appearance-none cursor-pointer"
              >
                <option value="never">Never</option>
                <option value="former">Former Smoker</option>
                <option value="current">Current Smoker</option>
              </select>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts';
import { calculateAllMetrics } from '../utils/calculations';
import type { UserInputs, UserMetrics } from '../utils/calculations';

interface ChartsProps {
  metrics: UserMetrics;
  inputs: UserInputs;
}

export const HealthRadar: React.FC<ChartsProps> = ({ metrics, inputs }) => {
  // Normalize metrics to 0-100 scale for Radar
  const data = [
    { subject: 'Sleep', A: Math.min(100, (inputs.sleepHours / 8) * 100), fullMark: 100 },
    { subject: 'Cardio', A: Math.min(100, (metrics.vo2MaxEstimate / 45) * 100), fullMark: 100 }, // rough max vo2 45
    { subject: 'Strength', A: Math.min(100, (inputs.weeklyStrengthSessions / 5) * 100), fullMark: 100 },
    { subject: 'Composition', A: Math.min(100, (22 / metrics.bmi) * 100), fullMark: 100 }, // optimal bmi ~22
    { subject: 'Recovery', A: Math.min(100, (60 / inputs.restingHeartRate) * 100), fullMark: 100 }, // optimal RHR ~60
    { subject: 'Activity', A: Math.min(100, (inputs.stepsPerDay / 10000) * 100), fullMark: 100 },
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.1)" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Current"
            dataKey="A"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="#3b82f6"
            fillOpacity={0.3}
          />
          <Tooltip
            contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
            itemStyle={{ color: '#fff' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const ProjectionLineChart: React.FC<ChartsProps> = ({ metrics }) => {
  // Simulate projection over 6 months based on current trajectory
  // If healthIndex > 80, stable/improving. If < 50, declining.
  // This is a rough simulation.

  const currentScore = metrics.healthIndex;
  const trend = (currentScore - 50) / 10; // monthly change

  const data = Array.from({ length: 7 }, (_, i) => ({
    month: `M${i}`,
    score: Math.min(100, Math.max(0, currentScore + (trend * i))),
    optimal: Math.min(100, currentScore + (2 * i)) // Ideal scenario
  }));

  return (
    <div className="h-48 w-full mt-4">
      <h4 className="text-xs text-gray-400 mb-2 uppercase tracking-wide">6-Month Trajectory</h4>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 100]} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} width={20} />
          <Tooltip
             contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
          />
          <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
          <Line type="monotone" dataKey="optimal" stroke="rgba(255,255,255,0.1)" strokeDasharray="5 5" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const ImpactBarChart: React.FC<ChartsProps> = ({ metrics, inputs }) => {
  // Calculate potential gains from top 3 levers
  // 1. Sleep -> 8h
  // 2. Steps -> 10k
  // 3. Weight -> -5kg (if BMI > 25)
  // 4. Cardio -> +2 sessions

  const calcGain = (mod: Partial<UserInputs>) => {
    const newM = calculateAllMetrics({ ...inputs, ...mod });
    return Math.max(0, newM.healthIndex - metrics.healthIndex);
  };

  const levers = [
    { name: '+1h Sleep', gain: calcGain({ sleepHours: Math.min(9, inputs.sleepHours + 1) }) },
    { name: '+3k Steps', gain: calcGain({ stepsPerDay: inputs.stepsPerDay + 3000 }) },
    { name: '+Cardio', gain: calcGain({ weeklyCardioSessions: inputs.weeklyCardioSessions + 2 }) },
    { name: '-5kg Weight', gain: calcGain({ weight: Math.max(50, inputs.weight - 5) }) },
  ].sort((a, b) => b.gain - a.gain).slice(0, 3); // Top 3

  return (
    <div className="h-40 w-full mt-4">
      <h4 className="text-xs text-gray-400 mb-2 uppercase tracking-wide">High Impact Levers</h4>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart layout="vertical" data={levers} margin={{ left: 0, right: 20 }}>
          <XAxis type="number" hide />
          <YAxis dataKey="name" type="category" width={80} tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#000', border: 'none' }} />
          <Bar dataKey="gain" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={12} background={{ fill: 'rgba(255,255,255,0.05)' }} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

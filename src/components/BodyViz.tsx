import React from 'react';
import type { UserInputs, UserMetrics } from '../utils/calculations';

interface BodyVizProps {
  inputs: UserInputs;
  metrics: UserMetrics;
}

export const BodyViz: React.FC<BodyVizProps> = ({ inputs, metrics }) => {
  const { bmi, riskTier } = metrics;

  // Calculate body width modifier based on BMI
  // Base width is for BMI ~22
  // BMI 15 -> 0.7x width
  // BMI 40 -> 1.5x width
  const widthMod = Math.min(1.6, Math.max(0.7, 0.7 + ((bmi - 15) / 25) * 0.8));

  const getColor = (val: number, min: number, max: number, inverse = false) => {
    let normalized = (val - min) / (max - min);
    if (inverse) normalized = 1 - normalized;
    normalized = Math.min(1, Math.max(0, normalized));
    const hue = normalized * 120; // 0 (red) -> 120 (green)
    return `hsla(${hue}, 70%, 50%, 0.6)`;
  };

  const heartColor = getColor(inputs.restingHeartRate, 40, 90, true);
  const activityScore = inputs.weeklyCardioSessions + inputs.weeklyStrengthSessions;
  const lungsColor = getColor(activityScore, 0, 7);
  const compColor = inputs.waistCircumference ? getColor(inputs.waistCircumference, 70, 120, true) : 'rgba(255,255,255,0.1)';

  // Facial Expression based on Risk
  // Smile (d attribute for path)
  let mouthPath = "M46,32 Q50,35 54,32"; // Neutral/Slight smile
  if (riskTier === 'Low') mouthPath = "M46,31 Q50,36 54,31"; // Big Smile
  else if (riskTier === 'Moderate') mouthPath = "M46,32 L54,32"; // Neutral
  else if (riskTier === 'Elevated') mouthPath = "M46,33 Q50,30 54,33"; // Frown
  else if (riskTier === 'High') mouthPath = "M46,34 Q50,28 54,34"; // Big Frown

  // Body Dimensions
  const shoulderWidth = 35 * widthMod;
  const waistWidth = 25 * widthMod;
  const hipWidth = 28 * widthMod;

  const cx = 50;

  // Torso Path Construction
  const torsoPath = `
    M${cx - shoulderWidth/2},45
    L${cx + shoulderWidth/2},45
    L${cx + waistWidth/2},85
    L${cx + hipWidth/2},100
    L${cx - hipWidth/2},100
    L${cx - waistWidth/2},85
    Z
  `;

  // Limb Thickness
  const limbWidth = 6 * widthMod;

  return (
    <div className="relative h-64 w-full flex items-center justify-center">
      <svg viewBox="0 0 100 200" className="h-full w-auto drop-shadow-lg overflow-visible">
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <g fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="1">
          {/* Head */}
          <circle cx="50" cy="25" r="14" />

          {/* Face */}
          <g stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none">
            {/* Eyes */}
            <circle cx="45" cy="22" r="1" fill="rgba(255,255,255,0.6)" stroke="none" />
            <circle cx="55" cy="22" r="1" fill="rgba(255,255,255,0.6)" stroke="none" />
            {/* Mouth */}
            <path d={mouthPath} strokeLinecap="round" />
          </g>

          {/* Torso */}
          <path d={torsoPath} />

          {/* Arms */}
          <path d={`M${cx - shoulderWidth/2},48 L${cx - shoulderWidth/2 - 10},75`} strokeWidth={limbWidth} strokeLinecap="round" />
          <path d={`M${cx + shoulderWidth/2},48 L${cx + shoulderWidth/2 + 10},75`} strokeWidth={limbWidth} strokeLinecap="round" />

          {/* Legs */}
          <path d={`M${cx - hipWidth/3},100 L${cx - hipWidth/2},160`} strokeWidth={limbWidth * 1.2} strokeLinecap="round" />
          <path d={`M${cx + hipWidth/3},100 L${cx + hipWidth/2},160`} strokeWidth={limbWidth * 1.2} strokeLinecap="round" />
        </g>

        {/* Highlights/Glows */}
        {/* Heart */}
        <circle cx="53" cy="55" r="4" fill={heartColor} filter="url(#glow)">
           <animate attributeName="opacity" values="0.6;1;0.6" dur={`${60/inputs.restingHeartRate}s`} repeatCount="indefinite" />
        </circle>

        {/* Lungs */}
        <ellipse cx="50" cy="50" rx="12" ry="8" fill={lungsColor} opacity="0.3" filter="url(#glow)" />

        {/* Waist/Visceral Fat Indicator */}
        <ellipse cx="50" cy="85" rx={waistWidth/2} ry="6" fill={compColor} opacity="0.4" filter="url(#glow)" />

      </svg>

      {/* Labels */}
      <div className="absolute top-0 right-0 text-[10px] text-gray-500 flex flex-col items-end gap-1">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{background: heartColor}}></span> Heart</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{background: lungsColor}}></span> Lungs</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{background: compColor}}></span> Metab</span>
      </div>
    </div>
  );
};

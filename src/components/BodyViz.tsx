import React from 'react';
import type { UserInputs } from '../utils/calculations';

interface BodyVizProps {
  inputs: UserInputs;
}

export const BodyViz: React.FC<BodyVizProps> = ({ inputs }) => {
  // Simplified SVG paths for a human silhouette
  // This is a stylized abstract representation

  const getColor = (val: number, min: number, max: number, inverse = false) => {
    let normalized = (val - min) / (max - min);
    if (inverse) normalized = 1 - normalized;
    normalized = Math.min(1, Math.max(0, normalized));

    // Green (good) to Red (bad)
    // We want HSL: 120 (green) -> 0 (red)
    const hue = normalized * 120;
    return `hsla(${hue}, 70%, 50%, 0.6)`;
  };

  // Heart color based on RHR
  const heartColor = getColor(inputs.restingHeartRate, 40, 90, true);

  // Lungs (VO2 proxy) color based on Activity
  const activityScore = inputs.weeklyCardioSessions + inputs.weeklyStrengthSessions;
  const lungsColor = getColor(activityScore, 0, 7);

  // Body Composition (waist)
  const compColor = inputs.waistCircumference ? getColor(inputs.waistCircumference, 70, 120, true) : 'rgba(255,255,255,0.1)';

  return (
    <div className="relative h-64 w-full flex items-center justify-center">
      <svg viewBox="0 0 100 200" className="h-full w-auto drop-shadow-lg">
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Silhouette Base */}
        <g fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="1">
          {/* Head */}
          <circle cx="50" cy="25" r="12" />
          {/* Torso */}
          <path d="M35,40 L65,40 L60,100 L40,100 Z" />
          {/* Arms */}
          <path d="M35,42 L20,70" strokeWidth="6" strokeLinecap="round" />
          <path d="M65,42 L80,70" strokeWidth="6" strokeLinecap="round" />
          {/* Legs */}
          <path d="M40,100 L35,160" strokeWidth="7" strokeLinecap="round" />
          <path d="M60,100 L65,160" strokeWidth="7" strokeLinecap="round" />
        </g>

        {/* Highlights */}
        {/* Heart */}
        <circle cx="53" cy="55" r="4" fill={heartColor} filter="url(#glow)">
           <animate attributeName="opacity" values="0.6;1;0.6" dur={`${60/inputs.restingHeartRate}s`} repeatCount="indefinite" />
        </circle>

        {/* Lungs area glow */}
        <ellipse cx="50" cy="50" rx="12" ry="8" fill={lungsColor} opacity="0.3" filter="url(#glow)" />

        {/* Core/Waist glow */}
        <ellipse cx="50" cy="85" rx="10" ry="6" fill={compColor} opacity="0.4" filter="url(#glow)" />

        {/* Activity Glow (Legs) if steps high */}
        {inputs.stepsPerDay > 8000 && (
           <g stroke={getColor(inputs.stepsPerDay, 5000, 15000)} strokeWidth="7" opacity="0.3" strokeLinecap="round" filter="url(#glow)">
              <path d="M40,100 L35,160" />
              <path d="M60,100 L65,160" />
           </g>
        )}

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

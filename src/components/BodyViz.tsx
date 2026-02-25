import React, { useMemo } from 'react';
import type { UserInputs } from '../utils/calculations';
import { calculateAllMetrics } from '../utils/calculations';

interface BodyVizProps {
  inputs: UserInputs;
}

export const BodyViz: React.FC<BodyVizProps> = ({ inputs }) => {
  const metrics = useMemo(() => calculateAllMetrics(inputs), [inputs]);
  const { bmi, healthIndex } = metrics;

  // Scaling Factors
  // Base BMI ~22.
  const scaleFactor = Math.sqrt(bmi / 22);
  // Using sqrt to dampen the effect slightly so 40 BMI isn't 2x width immediately

  // Waist Width Calculation
  const baseWaistWidth = 20; // total width at waist
  const waistWidth = baseWaistWidth * scaleFactor;
  const waistX1 = 50 - (waistWidth / 2);
  const waistX2 = 50 + (waistWidth / 2);

  // Limb Thickness
  const baseLimbThick = 6;
  const limbThick = baseLimbThick * scaleFactor;

  // Face Expression (Mouth)
  // Health Index 0 -> Frown (cy < startY)
  // Health Index 100 -> Smile (cy > startY)
  // Mouth Y = 32.
  // Control Point Y Range: 24 (sad) to 40 (happy)
  const mouthControlY = 24 + ((healthIndex / 100) * 16);

  // Colors
  const getColor = (val: number, min: number, max: number, inverse = false) => {
    let normalized = (val - min) / (max - min);
    if (inverse) normalized = 1 - normalized;
    normalized = Math.min(1, Math.max(0, normalized));
    const hue = normalized * 120; // Red (0) to Green (120)
    return `hsla(${hue}, 70%, 50%, 0.6)`;
  };

  const heartColor = getColor(inputs.restingHeartRate, 40, 90, true);
  const lungsColor = getColor(inputs.weeklyCardioSessions + inputs.weeklyStrengthSessions, 0, 7);
  const compColor = inputs.waistCircumference ? getColor(inputs.waistCircumference, 70, 120, true) : 'rgba(255,255,255,0.1)';

  return (
    <div className="relative h-64 w-full flex items-center justify-center">
      <svg viewBox="0 0 100 200" className="h-full w-auto drop-shadow-lg transition-all duration-500">
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Silhouette Base */}
        <g stroke="rgba(255,255,255,0.2)" fill="rgba(255,255,255,0.1)">
          {/* Head */}
          <circle cx="50" cy="25" r="12" strokeWidth="1" />

          {/* Face */}
          <g fill="rgba(255,255,255,0.8)" stroke="none">
            {/* Eyes */}
            <circle cx="46" cy="23" r="1.5" />
            <circle cx="54" cy="23" r="1.5" />
          </g>
          {/* Mouth */}
          <path
            d={`M 45 32 Q 50 ${mouthControlY} 55 32`}
            fill="none"
            stroke="rgba(255,255,255,0.8)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Torso */}
          {/* Shoulders fixed at ~35, 65 (width 30). Waist dynamic. */}
          <path
            d={`M35,40 L65,40 L${waistX2},100 L${waistX1},100 Z`}
            strokeWidth="1"
          />

          {/* Arms */}
          <path d="M35,42 L20,70" strokeWidth={limbThick} strokeLinecap="round" />
          <path d="M65,42 L80,70" strokeWidth={limbThick} strokeLinecap="round" />

          {/* Legs */}
          {/* Start from waist bottom points */}
          {/* Using fixed hip separation of ~20% width at hip joint? No, use waist points */}
          {/* To prevent legs crossing if waist is very thin, ensure min separation */}
          <path d={`M${Math.max(45, waistX1 + 5)},100 L${Math.max(40, waistX1)},160`} strokeWidth={limbThick} strokeLinecap="round" />
          <path d={`M${Math.min(55, waistX2 - 5)},100 L${Math.min(60, waistX2)},160`} strokeWidth={limbThick} strokeLinecap="round" />
        </g>

        {/* Highlights (Organs) */}
        {/* Heart */}
        <circle cx="53" cy="55" r="4" fill={heartColor} filter="url(#glow)">
           <animate attributeName="opacity" values="0.6;1;0.6" dur={`${60/Math.max(1, inputs.restingHeartRate)}s`} repeatCount="indefinite" />
        </circle>

        {/* Lungs */}
        <ellipse cx="50" cy="50" rx="12" ry="8" fill={lungsColor} opacity="0.3" filter="url(#glow)" />

        {/* Waist/Metabolism */}
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

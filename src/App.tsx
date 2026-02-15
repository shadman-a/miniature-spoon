import { useState, useMemo } from 'react';
import { calculateAllMetrics } from './utils/calculations';
import type { UserInputs } from './utils/calculations';
import { InputForm } from './components/InputForm';
import { Dashboard } from './components/Dashboard';
import { ProjectionsPanel } from './components/ProjectionsPanel';
import type { ProjectionState } from './components/ProjectionsPanel';

function App() {
  const [inputs, setInputs] = useState<UserInputs>({
    age: 30,
    sex: 'male',
    height: 175,
    weight: 75,
    restingHeartRate: 70,
    sleepHours: 7.5,
    weeklyStrengthSessions: 3,
    weeklyCardioSessions: 2,
    stepsPerDay: 8000,
    alcoholFrequency: 'weekly',
    smokingStatus: 'never',
    bodyFatPercentage: 15,
  });

  const [projections, setProjections] = useState<ProjectionState>({
    loseWeight: false,
    gainMuscle: false,
    moreCardio: false,
    moreSleep: false,
  });

  const projectedInputs = useMemo(() => {
    let newInputs = { ...inputs };
    if (projections.loseWeight) newInputs.weight -= 4.5; // ~10 lbs
    if (projections.gainMuscle) newInputs.weight += 2.3; // ~5 lbs (simplification: assumes muscle gain adds to weight)
    if (projections.moreCardio) newInputs.weeklyCardioSessions += 3;
    if (projections.moreSleep) newInputs.sleepHours += 1;
    return newInputs;
  }, [inputs, projections]);

  const metrics = calculateAllMetrics(projectedInputs);

  return (
    <div className="min-h-screen bg-background text-gray-100 flex flex-col items-center">
      {/* Background Gradient Effect */}
      <div className="fixed inset-0 pointer-events-none z-[-1] bg-gradient-to-br from-blue-900/10 via-background to-purple-900/10" />

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto p-6 md:px-8 border-b border-white/5">
        <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
          Human Performance Index
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Understand your biological age, risk profile, and performance trajectory.
        </p>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-6 p-4 md:p-8 flex-1">

        {/* Left Column: Inputs */}
        <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-6">
          <InputForm inputs={inputs} setInputs={setInputs} />
          <ProjectionsPanel projections={projections} setProjections={setProjections} />
        </div>

        {/* Right Column: Dashboard */}
        <div className="w-full md:w-2/3 lg:w-3/4">
          <Dashboard metrics={metrics} inputs={projectedInputs} />
        </div>

      </main>
    </div>
  );
}

export default App;

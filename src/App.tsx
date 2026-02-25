import { useState, useEffect, useMemo } from 'react';
import { calculateAllMetrics } from './utils/calculations';
import type { UserInputs } from './utils/calculations';
import { InputForm } from './components/InputForm';
import { Dashboard } from './components/Dashboard';
import { ProjectionsPanel } from './components/ProjectionsPanel';
import type { ProjectionState } from './components/ProjectionsPanel';
import { useUser } from './context/UserContext';
import { Login } from './components/auth/Login';
import { Signup } from './components/auth/Signup';
import { AiLoader } from './components/ui/AiLoader';
import { Save, LogOut, Check, Activity } from 'lucide-react';

export type UnitSystem = 'metric' | 'imperial';

function App() {
  const { user, login, signup, logout, isLoading, error, updateMetrics, clearError } = useUser();
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');

  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');
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

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Sync inputs from user profile when loaded
  useEffect(() => {
    if (user && user.profile.metrics) {
      setInputs(user.profile.metrics);
    }
  }, [user]);

  const handleSave = async () => {
    setSaveStatus('saving');
    const success = await updateMetrics(inputs);
    if (success) {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } else {
      setSaveStatus('idle');
      alert("Failed to save. Check console for details.");
    }
  };

  const projectedInputs = useMemo(() => {
    let newInputs = { ...inputs };
    if (projections.loseWeight) newInputs.weight -= 4.5; // ~10 lbs
    if (projections.gainMuscle) newInputs.weight += 2.3; // ~5 lbs
    if (projections.moreCardio) newInputs.weeklyCardioSessions += 3;
    if (projections.moreSleep) newInputs.sleepHours += 1;
    return newInputs;
  }, [inputs, projections]);

  const metrics = calculateAllMetrics(projectedInputs);

  // Auth View
  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-900/20 via-black to-purple-900/20" />
        <div className="absolute inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>

        <AiLoader isLoading={isLoading} />

        <div className="relative z-10 w-full max-w-md">
          {authView === 'login' ? (
            <Login
              onLogin={login}
              onSwitchToSignup={() => { clearError(); setAuthView('signup'); }}
              isLoading={isLoading}
              error={error}
            />
          ) : (
            <Signup
              onSignup={signup}
              onSwitchToLogin={() => { clearError(); setAuthView('login'); }}
              isLoading={isLoading}
              error={error}
            />
          )}
        </div>
      </div>
    );
  }

  // Dashboard View
  return (
    <div className="min-h-screen bg-background text-gray-100 flex flex-col items-center relative">
      <AiLoader isLoading={false} /> {/* Keep loader mounted but hidden if needed for transitions, or just remove */}

      {/* Background Gradient Effect */}
      <div className="fixed inset-0 pointer-events-none z-[-1] bg-gradient-to-br from-blue-900/10 via-background to-purple-900/10" />

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto p-6 md:px-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 flex items-center gap-3">
            <Activity className="text-blue-400" /> Human Performance Index
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Welcome back, <span className="text-white font-semibold">{user.profile.displayName}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              saveStatus === 'saved'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
            }`}
          >
            {saveStatus === 'saving' ? (
               <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : saveStatus === 'saved' ? (
               <Check size={18} />
            ) : (
               <Save size={18} />
            )}
            {saveStatus === 'saved' ? 'Saved' : 'Save Sync'}
          </button>

          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all font-medium"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-6 p-4 md:p-8 flex-1">

        {/* Left Column: Inputs */}
        <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-6">
          <InputForm
            inputs={inputs}
            setInputs={setInputs}
            unitSystem={unitSystem}
            setUnitSystem={setUnitSystem}
          />
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

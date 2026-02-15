import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import type { UserInputs, UserMetrics } from '../utils/calculations';
import { BodyViz } from './BodyViz';
import { HealthRadar, ProjectionLineChart, ImpactBarChart } from './Charts';
import { Activity, Heart, Brain, TrendingUp } from 'lucide-react';

interface DashboardProps {
  metrics: UserMetrics;
  inputs: UserInputs;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};

export const Dashboard: React.FC<DashboardProps> = ({ metrics, inputs }) => {
  return (
    <motion.div
      className="h-full flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Top Row: Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Health Index (Hero) */}
        <motion.div variants={itemVariants} className="glass-panel p-6 rounded-2xl flex flex-col justify-center items-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <motion.h2
            key={metrics.healthIndex}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400"
          >
            {Math.round(metrics.healthIndex)}
          </motion.h2>
          <p className="text-sm text-gray-400 mt-2 uppercase tracking-widest font-medium">Health Index</p>
        </motion.div>

        {/* Bio Age */}
        <motion.div variants={itemVariants} className="glass-panel p-6 rounded-2xl flex flex-col justify-center relative overflow-hidden">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="text-emerald-400" size={18} />
            <span className="text-xs text-gray-400 uppercase tracking-wider">Bio Age</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-white">{Math.round(metrics.biologicalAge)}</span>
            <span className={`text-sm font-medium ${metrics.biologicalAge < inputs.age ? 'text-emerald-400' : 'text-rose-400'}`}>
              {metrics.biologicalAge - inputs.age > 0 ? '+' : ''}{Math.round(metrics.biologicalAge - inputs.age)} yrs
            </span>
          </div>
           <p className="text-xs text-gray-500 mt-2">
            {metrics.biologicalAge < inputs.age ? 'You are aging slower than average.' : 'Lifestyle factors accelerating aging.'}
          </p>
        </motion.div>

        {/* Risk Tier */}
        <motion.div variants={itemVariants} className="glass-panel p-6 rounded-2xl flex flex-col justify-center relative overflow-hidden">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="text-rose-400" size={18} />
            <span className="text-xs text-gray-400 uppercase tracking-wider">Risk Profile</span>
          </div>
          <div className="flex items-baseline gap-2">
             <span className={`text-3xl font-bold ${
                metrics.riskTier === 'Low' ? 'text-emerald-400' :
                metrics.riskTier === 'Moderate' ? 'text-yellow-400' :
                'text-rose-500'
             }`}>
              {metrics.riskTier}
            </span>
          </div>
           <p className="text-xs text-gray-500 mt-2">
            Based on metabolic & lifestyle factors.
          </p>
        </motion.div>
      </div>

      {/* Main Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[400px]">
        {/* Left: Radar & Body */}
        <motion.div variants={itemVariants} className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 glass-panel rounded-2xl p-6">
           <div className="flex flex-col">
              <h3 className="text-sm font-semibold text-white/80 mb-4 flex items-center gap-2">
                <Brain size={16} className="text-purple-400" /> Performance Drivers
              </h3>
              <HealthRadar metrics={metrics} inputs={inputs} />
           </div>
           <div className="flex flex-col border-l border-white/5 pl-0 md:pl-6 pt-6 md:pt-0 border-t md:border-t-0">
               <h3 className="text-sm font-semibold text-white/80 mb-4 text-center">Physiological Map</h3>
               <BodyViz inputs={inputs} />
           </div>
        </motion.div>

        {/* Right: Projections */}
        <motion.div variants={itemVariants} className="glass-panel rounded-2xl p-6 flex flex-col gap-6">
           <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="text-blue-400" size={18} />
              <h3 className="text-sm font-semibold text-white/80">Trajectory</h3>
           </div>

           <div className="flex-1 flex flex-col justify-between">
              <div>
                 <p className="text-xs text-gray-500 mb-4">
                    Projected health score over next 6 months based on current habits.
                 </p>
                 <ProjectionLineChart metrics={metrics} inputs={inputs} />
              </div>
              <div className="mt-6 pt-6 border-t border-white/5">
                 <ImpactBarChart metrics={metrics} inputs={inputs} />
              </div>
           </div>
        </motion.div>
      </div>

    </motion.div>
  );
};

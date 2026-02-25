import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, User, Lock, AlertCircle, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLogin: (username: string, password: string) => Promise<void>;
  onSwitchToSignup: () => void;
  isLoading: boolean;
  error?: string | null;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onSwitchToSignup, isLoading, error }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    onLogin(username, password);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto p-8 rounded-2xl glass-panel shadow-2xl"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-500/20 rounded-2xl mx-auto flex items-center justify-center mb-4 border border-blue-500/30">
          <Key className="text-blue-400 w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
        <p className="text-gray-400 text-sm">Access your secure performance profile.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3.5 text-gray-500 w-5 h-5 pointer-events-none" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="glass-input w-full rounded-xl py-3 pl-10 pr-4 placeholder-gray-500"
              disabled={isLoading}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-500 w-5 h-5 pointer-events-none" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="glass-input w-full rounded-xl py-3 pl-10 pr-4 placeholder-gray-500"
              disabled={isLoading}
            />
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20"
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </motion.div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {isLoading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={onSwitchToSignup}
          className="text-gray-400 hover:text-white text-sm transition-colors"
          disabled={isLoading}
        >
          Don't have an account? <span className="text-blue-400 font-medium">Create Profile</span>
        </button>
      </div>
    </motion.div>
  );
};

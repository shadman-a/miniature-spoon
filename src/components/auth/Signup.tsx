import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, User, Lock, AlertCircle, ArrowRight, Type, FileText } from 'lucide-react';

interface SignupProps {
  onSignup: (data: { username: string; displayName: string; bio: string; password: string }) => Promise<void>;
  onSwitchToLogin: () => void;
  isLoading: boolean;
  error?: string | null;
}

export const Signup: React.FC<SignupProps> = ({ onSignup, onSwitchToLogin, isLoading, error }) => {
  const [formData, setFormData] = useState({
    username: '',
    displayName: '',
    bio: '',
    password: '',
    confirmPassword: ''
  });
  const [localError, setLocalError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (localError) setLocalError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password || !formData.displayName) {
        setLocalError("Please fill in all required fields.");
        return;
    }
    if (formData.password !== formData.confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }
    if (formData.password.length < 6) {
        setLocalError("Password must be at least 6 characters.");
        return;
    }

    onSignup({
        username: formData.username,
        displayName: formData.displayName,
        bio: formData.bio,
        password: formData.password
    });
  };

  const displayError = localError || error;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto p-8 rounded-2xl glass-panel shadow-2xl"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl mx-auto flex items-center justify-center mb-4 border border-emerald-500/30">
          <UserPlus className="text-emerald-400 w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Create Profile</h2>
        <p className="text-gray-400 text-sm">Join the network and track your evolution.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Username */}
        <div className="relative">
          <User className="absolute left-3 top-3.5 text-gray-500 w-5 h-5 pointer-events-none" />
          <input
            type="text"
            name="username"
            placeholder="Username (unique ID)"
            value={formData.username}
            onChange={handleChange}
            className="glass-input w-full rounded-xl py-3 pl-10 pr-4 placeholder-gray-500"
            disabled={isLoading}
          />
        </div>

        {/* Display Name */}
        <div className="relative">
          <Type className="absolute left-3 top-3.5 text-gray-500 w-5 h-5 pointer-events-none" />
          <input
            type="text"
            name="displayName"
            placeholder="Display Name"
            value={formData.displayName}
            onChange={handleChange}
            className="glass-input w-full rounded-xl py-3 pl-10 pr-4 placeholder-gray-500"
            disabled={isLoading}
          />
        </div>

        {/* Bio (Optional) */}
        <div className="relative">
          <FileText className="absolute left-3 top-3.5 text-gray-500 w-5 h-5 pointer-events-none" />
          <textarea
            name="bio"
            placeholder="Bio (optional)"
            value={formData.bio}
            onChange={handleChange}
            className="glass-input w-full rounded-xl py-3 pl-10 pr-4 placeholder-gray-500 min-h-[80px] resize-none"
            disabled={isLoading}
          />
        </div>

        {/* Passwords */}
        <div className="grid grid-cols-2 gap-4">
            <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-500 w-5 h-5 pointer-events-none" />
            <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="glass-input w-full rounded-xl py-3 pl-10 pr-4 placeholder-gray-500"
                disabled={isLoading}
            />
            </div>
            <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-500 w-5 h-5 pointer-events-none" />
            <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="glass-input w-full rounded-xl py-3 pl-10 pr-4 placeholder-gray-500"
                disabled={isLoading}
            />
            </div>
        </div>

        {displayError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20"
          >
            <AlertCircle size={16} />
            <span>{displayError}</span>
          </motion.div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {isLoading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Create Account <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={onSwitchToLogin}
          className="text-gray-400 hover:text-white text-sm transition-colors"
          disabled={isLoading}
        >
          Already have an account? <span className="text-emerald-400 font-medium">Sign In</span>
        </button>
      </div>
    </motion.div>
  );
};

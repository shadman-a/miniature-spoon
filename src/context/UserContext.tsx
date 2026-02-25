import React, { createContext, useContext, useState, useEffect } from 'react';
import { DatabaseUser, UserProfile, UserAuth } from '../types/db';
import { fetchUserFile, saveUserFile } from '../services/github';
import { hashPassword, verifyPassword, generateSalt } from '../services/auth';
import { UserInputs } from '../utils/calculations';

interface UserContextType {
  user: DatabaseUser | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (data: { username: string; password: string; displayName: string; bio: string }) => Promise<boolean>;
  logout: () => void;
  updateMetrics: (metrics: UserInputs) => Promise<boolean>;
  clearError: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Default initial metrics
const DEFAULT_METRICS: UserInputs = {
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
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<DatabaseUser | null>(null);
  const [fileSha, setFileSha] = useState<string | undefined>(undefined); // Store SHA for updates
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchUserFile(username);

      if (!result) {
        setError("User not found.");
        setIsLoading(false);
        return false;
      }

      const { data, sha } = result;

      const isValid = await verifyPassword(password, data.auth.passwordHash, data.auth.salt);
      if (!isValid) {
        setError("Invalid password.");
        setIsLoading(false);
        return false;
      }

      setUser(data);
      setFileSha(sha);
      setIsLoading(false);
      return true;
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Login failed due to network error.");
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (data: { username: string; password: string; displayName: string; bio: string }): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      // Check if user exists
      const existing = await fetchUserFile(data.username);
      if (existing) {
        setError("Username already exists.");
        setIsLoading(false);
        return false;
      }

      const salt = generateSalt();
      const passwordHash = await hashPassword(data.password, salt);

      const newUser: DatabaseUser = {
        auth: {
          username: data.username,
          salt,
          passwordHash,
        },
        profile: {
          username: data.username,
          displayName: data.displayName,
          bio: data.bio,
          joinedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          metrics: DEFAULT_METRICS,
        }
      };

      const result = await saveUserFile(data.username, newUser);

      if (result.success) {
        setUser(newUser);
        setFileSha(result.sha);
        setIsLoading(false);
        return true;
      } else {
        throw new Error("Failed to create user file.");
      }
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.message || "Signup failed.");
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setFileSha(undefined);
    setError(null);
  };

  const updateMetrics = async (metrics: UserInputs): Promise<boolean> => {
    if (!user) return false;

    // Optimistic update
    const updatedUser: DatabaseUser = {
      ...user,
      profile: {
        ...user.profile,
        updatedAt: new Date().toISOString(),
        metrics: metrics
      }
    };

    // Don't set loading true for background saves, just return status
    // Or maybe we want a "Syncing..." indicator?
    // For now, let's keep it simple.

    try {
      const result = await saveUserFile(user.auth.username, updatedUser, fileSha);
      if (result.success) {
        setUser(updatedUser);
        setFileSha(result.sha);
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error("Update metrics error:", err);
      return false;
    }
  };

  return (
    <UserContext.Provider value={{ user, isLoading, error, login, signup, logout, updateMetrics, clearError }}>
      {children}
    </UserContext.Provider>
  );
};

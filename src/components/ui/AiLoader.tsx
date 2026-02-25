import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Cpu, Database, Fingerprint, Lock, Network } from 'lucide-react';

interface AiLoaderProps {
  isLoading: boolean;
  messages?: string[];
  onComplete?: () => void;
}

const DEFAULT_MESSAGES = [
  "Initializing neural handshake...",
  "Encrypting biometric signature...",
  "Establishing secure uplink...",
  "Synchronizing with decentralized node...",
  "Verifying identity constraints...",
  "Provisioning secure storage...",
];

export const AiLoader: React.FC<AiLoaderProps> = ({
  isLoading,
  messages = DEFAULT_MESSAGES,
  onComplete
}) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 1500);

    return () => clearInterval(interval);
  }, [isLoading, messages]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md"
        >
          <div className="relative">
            {/* Spinning Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-32 h-32 rounded-full border-t-2 border-b-2 border-blue-500/50"
            />

            {/* Inner Ring */}
             <motion.div
              animate={{ rotate: -180 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 m-auto w-24 h-24 rounded-full border-r-2 border-l-2 border-purple-500/50"
            />

            {/* Pulsing Icon */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 m-auto flex items-center justify-center text-white/80"
            >
              <Cpu size={40} />
            </motion.div>
          </div>

          <motion.div
            key={currentMessageIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-8 text-blue-200 font-mono text-sm tracking-wider flex items-center gap-2"
          >
             <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            {messages[currentMessageIndex]}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

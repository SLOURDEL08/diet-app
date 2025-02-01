'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Mail, Loader2, Edit2, ArrowRight } from 'lucide-react';
import StepLayout from '@/app/onboarding/StepLayout';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useAuth } from '@/contexts/AuthContext';
import { useThemeConfig } from '@/hooks/useTheme';
import { IUser } from '@/types/user';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function Step5() {
  const { user } = useAuth() as { user: IUser | null };
  const { saveStepData, handleNextStep } = useOnboarding();
  const [email, setEmail] = useState(user?.email || '');
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [isVerified, setIsVerified] = useState(user?.emailVerified || false);
  const [isLoading, setIsLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  useThemeConfig();

  const handleVerificationLink = useCallback((token: string) => {
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    window.open(
      `/verify-email/${token}`,
      'EmailVerification',
      `width=${width},height=${height},left=${left},top=${top}`
    );
  }, []);

  const sendVerificationEmail = useCallback(async () => {
   try {
  setIsLoading(true);
  setStatus('pending');
  
  const response = await fetch('/api/auth/verify-email', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (response.ok) {
    if (data.verificationToken) {
      handleVerificationLink(data.verificationToken);
    }
    setMessage('Consultez vos emails pour valider votre adresse.');
    setStatus('success');
  } else {
    throw new Error(data.error || 'Erreur d\'envoi');
  }
} catch {
  setMessage('Erreur lors de l\'envoi. Veuillez réessayer.');
  setStatus('error');
} finally {
  setIsLoading(false);
}
  }, [email, handleVerificationLink]);

  const checkVerificationStatus = useCallback(async () => {
    try {
  setCheckingStatus(true);
  const response = await fetch('/api/auth/check-verification', { 
    method: 'GET',
    headers: { 
      'Accept': 'application/json',
      'Cache-Control': 'no-cache'
    }
  });
  
  const data = await response.json();
  
  if (data.verified) {
    setIsVerified(true);
    setStatus('success');
    await saveStepData({ emailVerified: true });
  }
} catch {
  console.error('Erreur de vérification');
} finally {
  setCheckingStatus(false);
}
  }, [saveStepData]);

  const updateEmail = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    try {
  setIsLoading(true);
  const response = await fetch('/api/auth/update-email', {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({ email: email.trim().toLowerCase() }),
  });

  const data = await response.json();

  if (response.ok) {
    setMessage('Email mis à jour. Vérifiez vos nouveaux emails.');
    setStatus('success');
    setIsEditing(false);
    setIsVerified(false);
    await sendVerificationEmail();
  } else {
    throw new Error(data.error || 'Erreur de mise à jour');
  }
} catch (error) {
  setMessage(error instanceof Error ? error.message : 'Erreur de mise à jour. Veuillez réessayer.');
  setStatus('error');
} finally {
  setIsLoading(false);
}
  }, [email, sendVerificationEmail]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin === window.location.origin && event.data === 'emailVerified') {
        checkVerificationStatus();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [checkVerificationStatus]);

  useEffect(() => {
    if (user && !user.emailVerified) {
      sendVerificationEmail();
    }
  }, [user, sendVerificationEmail]);

  useEffect(() => {
    if (!isVerified) {
      const interval = setInterval(checkVerificationStatus, 5000);
      return () => clearInterval(interval);
    }
  }, [isVerified, checkVerificationStatus]);

  return (
    <StepLayout
      title="Validation de votre email"
      description="Une dernière étape pour sécuriser votre compte"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md mx-auto space-y-8"
      >
        {/* Status Indicator */}
        <motion.div 
          variants={itemVariants}
          className={`
            w-full p-6 rounded-3xl border backdrop-blur-md
            ${isVerified 
              ? 'bg-primary/10 border-primary' 
              : 'bg-white dark:bg-white/10 border-slate-200 dark:border-white/10'}
          `}
        >
          <div className="flex items-center gap-4">
            <div className={`
              p-4 rounded-xl
              ${isVerified 
                ? 'bg-primary text-slate-900 dark:text-[#170312]' 
                : checkingStatus 
                  ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white' 
                  : 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white'}
            `}>
              {isVerified ? (
                <CheckCircle className="w-6 h-6" />
              ) : checkingStatus ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Mail className="w-6 h-6" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">
                {isVerified ? 'Email Validé' : 'En attente de validation'}
              </h3>
              <p className="text-slate-600 dark:text-white/60">
                {isVerified 
                  ? 'Votre email est maintenant vérifié' 
                  : 'Veuillez cliquer sur le lien envoyé par email'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Email Form */}
        {!isVerified && (
          <motion.div variants={itemVariants} className="space-y-6">
            {!isEditing ? (
              <div className="flex items-center justify-between p-6 rounded-3xl bg-white dark:bg-white/10 backdrop-blur-md border border-slate-200 dark:border-white/10">
                <div>
                  <p className="text-sm text-slate-600 dark:text-white/60">Adresse email</p>
                  <p className="text-slate-900 dark:text-white mt-1">{email}</p>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  disabled={isLoading}
                  className="p-2 text-slate-600 dark:text-white/60 hover:text-primary transition-colors"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <form onSubmit={updateEmail} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-900 dark:text-white">
                    Nouvelle adresse email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-white/10 backdrop-blur-md 
                      border border-slate-200 dark:border-white/10 
                      text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 
                      focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-6 py-4 rounded-2xl bg-primary text-slate-900 dark:text-[#170312] font-medium 
                      hover:opacity-90 disabled:opacity-50 transition-all duration-200"
                  >
                    {isLoading ? 'Mise à jour...' : 'Mettre à jour'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    disabled={isLoading}
                    className="px-6 py-4 rounded-2xl bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white font-medium 
                      hover:bg-slate-200 dark:hover:bg-white/20 disabled:opacity-50 transition-all duration-200"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            )}

            {/* Action Buttons */}
            <motion.div variants={itemVariants} className="space-y-4">
              <button
                onClick={sendVerificationEmail}
                disabled={isLoading}
                className="w-full px-6 py-4 rounded-2xl bg-slate-100 dark:bg-white/10 backdrop-blur-md 
                  border border-slate-200 dark:border-white/10 
                  text-slate-900 dark:text-white font-medium 
                  hover:bg-slate-200 dark:hover:bg-white/20 disabled:opacity-50 transition-all duration-200"
              >
                {isLoading ? 'Envoi en cours...' : 'Renvoyer l\'email'}
              </button>

              {message && (
                <div className={`
                  p-4 rounded-2xl backdrop-blur-md
                  ${status === 'success' 
                    ? 'bg-primary/10 text-primary border border-primary/20' 
                    : status === 'error'
                    ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                    : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white/60 border border-slate-200 dark:border-white/10'}
                `}>
                  {message}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}

        {/* Continue Button */}
        {isVerified && (
          <motion.button
            variants={itemVariants}
            onClick={handleNextStep}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl 
              bg-primary text-slate-900 dark:text-[#170312] font-medium hover:opacity-90 transition-all duration-200"
          >
            <span>Continuer</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        )}
      </motion.div>
    </StepLayout>
  );
}
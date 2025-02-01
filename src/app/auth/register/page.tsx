'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { UserPlus, AlertCircle, Loader2, Mail, Lock, User, ArrowRight, Check } from 'lucide-react';
import { useThemeConfig } from '@/hooks/useTheme';

// Optimisation des variants d'animation
const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 }
};

interface FormField {
  value: string;
  valid: boolean;
  touched: boolean;
}

type FormData = Record<string, FormField>;

const initialFormData: FormData = {
  name: { value: '', valid: false, touched: false },
  email: { value: '', valid: false, touched: false },
  password: { value: '', valid: false, touched: false },
};

const validators = {
  name: (value: string) => value.length >= 2,
  email: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  password: (value: string) => value.length >= 8,
};

export default function Register() {
  const router = useRouter();
  const { isDarkMode } = useThemeConfig();
  
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Optimisation de la validation avec useCallback
  const validateField = useCallback((name: string, value: string): boolean => {
    return validators[name as keyof typeof validators]?.(value) ?? false;
  }, []);

  // Optimisation du handleChange avec useCallback
  const handleChange = useCallback((name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: {
        value,
        valid: validateField(name, value),
        touched: true
      }
    }));
  }, [validateField]);

  // Optimisation de la validation du formulaire avec useMemo
  const isFormValid = useMemo(() => {
    return Object.values(formData).every(field => field.valid);
  }, [formData]);

  // Optimisation du handleSubmit avec useCallback
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          Object.entries(formData).reduce((acc, [key, field]) => ({
            ...acc,
            [key]: field.value
          }), {})
        ),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Une erreur est survenue');
      
      router.push('/auth/login');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  }, [formData, isFormValid, router]);

  // Composant de champ de formulaire optimisé
  const FormField = useCallback(({ 
    name, 
    type, 
    label, 
    placeholder,
    Icon 
  }: { 
    name: string; 
    type: string; 
    label: string; 
    placeholder: string;
    Icon: typeof User;
  }) => {
    const field = formData[name];
    
    return (
      <div className="relative">
        <label htmlFor={name} className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
          {label}
        </label>
        <div className="relative">
          <input
            id={name}
            type={type}
            required
            className={`w-full pl-12 pr-6 py-4 rounded-2xl bg-white dark:bg-white/10 backdrop-blur-md border
              text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 
              shadow-sm transition-all duration-200
              ${field.touched
                ? field.valid
                  ? 'border-primary/50 focus:border-primary'
                  : 'border-red-500/50 focus:border-red-500'
                : 'border-slate-200 dark:border-white/10 focus:border-primary/50'}
              focus:ring-2 focus:ring-primary/20`}
            placeholder={placeholder}
            value={field.value}
            onChange={(e) => handleChange(name, e.target.value)}
          />
          <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5
            ${field.touched
              ? field.valid
                ? 'text-primary'
                : 'text-red-500'
              : 'text-slate-400 dark:text-white/40'}`}
          />
          {field.touched && field.valid && (
            <Check className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
          )}
        </div>
        {field.touched && !field.valid && (
          <p className="mt-1 text-xs text-red-500 dark:text-red-400">
            {name === 'name' && 'Le nom doit contenir au moins 2 caractères'}
            {name === 'email' && 'Veuillez entrer un email valide'}
            {name === 'password' && 'Le mot de passe doit contenir au moins 8 caractères'}
          </p>
        )}
      </div>
    );
  }, [formData, handleChange]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#170312] py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <motion.div {...pageTransition} className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Créer un compte
          </h2>
          <p className="mt-2 text-slate-600 dark:text-white/60">
            Rejoignez-nous pour commencer votre expérience
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="space-y-4">
            <FormField 
              name="name" 
              type="text" 
              label="Nom" 
              placeholder="Votre nom"
              Icon={User}
            />
            <FormField 
              name="email" 
              type="email" 
              label="Email" 
              placeholder="Votre email"
              Icon={Mail}
            />
            <FormField 
              name="password" 
              type="password" 
              label="Mot de passe" 
              placeholder="Votre mot de passe"
              Icon={Lock}
            />
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="group relative w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl 
                bg-primary text-white font-medium shadow-sm hover:shadow-md transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Inscription en cours...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                    <span>{"S'inscrire"}</span>
                  <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </>
              )}
            </button>

            <p className="text-center text-slate-600 dark:text-white/60">
              Déjà un compte ?{' '}
              <Link
                href="/auth/login"
                className="text-primary hover:opacity-80 transition-opacity font-medium"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </form>

        <div className="text-center text-sm text-slate-500 dark:text-white/40">
          En vous inscrivant, vous acceptez nos{' '}
          <Link href="/conditions" className="text-primary hover:text-primary/80 transition-colors">
            {"conditions d'utilisation"}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
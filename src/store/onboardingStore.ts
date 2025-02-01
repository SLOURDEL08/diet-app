

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OnboardingStore, OnboardingStep } from '@/types/onboarding';
import { Types } from 'mongoose';

const TOTAL_STEPS = 6;

const initialSteps: OnboardingStep[] = [
  {
    id: 1,
    title: "Bienvenue",
    description: "Commençons par quelques informations de base",
    isCompleted: false,
  },
  {
    id: 2,
    title: "Profil Professionnel",
    description: "Parlez-nous de votre activité",
    isCompleted: false,
  },
  {
    id: 3,
    title: "Centres d'intérêt",
    description: "Sélectionnez vos domaines d'intérêt",
    isCompleted: false,
  },
  {
    id: 4,
    title: "Préférences",
    description: "Personnalisez votre expérience",
    isCompleted: false,
  },
  {
    id: 5,
    title: "Email Vérification",
    description: "Vérifiez votre adresse email pour sécuriser votre compte",
    isCompleted: false,
  },
  {
    id: 6,
    title: "Onboarding Terminé",
    description: "Votre onboarding est maintenant terminé.",
    isCompleted: false,
  },
];

// Fonction utilitaire pour créer un ObjectId vide
const createEmptyObjectId = () => new Types.ObjectId();

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      currentStep: 1,
      steps: initialSteps,
      data: {
        userId: createEmptyObjectId(), // Utilisation d'un ObjectId au lieu d'une chaîne vide
        profession: '',
        interests: [],
        preferences: {
          theme: 'light',
          notifications: true,
          language: 'fr'
        },
      },
      isCompleted: false,

      setCurrentStep: (step: number) => {
        const validStep = Math.min(Math.max(1, step), TOTAL_STEPS);
        set({ currentStep: validStep });

        set((state) => ({
          steps: state.steps.map((s) => ({
            ...s,
            isCompleted: s.id < validStep
          }))
        }));
      },

      setStepCompleted: (stepId: number) => {
        set((state) => ({
          steps: state.steps.map((step) =>
            step.id === stepId ? { ...step, isCompleted: true } : step
          ),
        }));
      },

      updateData: (newData) => {
        set((state) => ({
          data: {
            ...state.data,
            ...newData,
          },
        }));
      },

      updateEmailVerification: (verified: boolean) => {
        set((state) => ({
          data: {
            ...state.data,
            preferences: {
              ...state.data.preferences,
              emailValidated: verified
            }
          },
          steps: state.steps.map((step) =>
            step.id === 5 ? { ...step, isCompleted: verified } : step
          )
        }));
      },

      resetOnboarding: () => {
        set({
          currentStep: 1,
          steps: initialSteps.map(step => ({ ...step, isCompleted: false })),
          data: {
            userId: createEmptyObjectId(), // Utilisation d'un ObjectId au lieu d'une chaîne vide
            profession: '',
            interests: [],
            preferences: {
              theme: 'light',
              notifications: true,
              language: 'fr'
            }
          },
          isCompleted: false,
        });
      },

      completeOnboarding: () => {
        set({
          isCompleted: true,
          currentStep: TOTAL_STEPS,
          steps: initialSteps.map(step => ({ ...step, isCompleted: true })),
        });
      },
    }),
    {
      name: 'onboarding-storage',
      skipHydration: true,
    }
  )
);
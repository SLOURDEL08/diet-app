import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useOnboardingStore } from '@/store/onboardingStore';
import { IOnboardingData } from '@/types/common';

export const useOnboarding = () => {
  const router = useRouter();
  const { user } = useAuth();
  
  const {
    currentStep,
    steps,
    data,
    isCompleted,
    setCurrentStep,
    setStepCompleted,
    updateData,
    completeOnboarding
  } = useOnboardingStore();

  // Vérifier si toutes les étapes jusqu'à la courante sont complétées
  const isCurrentStepValid = () => {
    const previousSteps = steps.filter(step => step.id < currentStep);
    return previousSteps.every(step => step.isCompleted);
  };

  // Sauvegarder les données d'une étape
  const saveStepData = async (stepData: Partial<IOnboardingData>) => {
    try {
      // Mettre à jour le store local d'abord
      updateData(stepData);
      
      // Sauvegarder dans la base de données
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...stepData,
          currentStep,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde');
      }

      // Marquer l'étape comme complétée
      setStepCompleted(currentStep);
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      return false;
    }
  };

  // Gérer la progression de l'onboarding
  const handleNextStep = async () => {
    if (!isCurrentStepValid()) {
      console.error('Les étapes précédentes ne sont pas complétées');
      return;
    }

    const nextStep = currentStep + 1;
    
    try {
      if (nextStep > steps.length) {
        await completeOnboarding();
        router.push('/dashboard');
      } else {
        setCurrentStep(nextStep);
        router.push(`/onboarding/step-${nextStep}`);
      }
    } catch (error) {
      console.error('Erreur lors du passage à l\'étape suivante:', error);
    }
  };

  // Gérer le retour en arrière
  const handlePreviousStep = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      router.push(`/onboarding/step-${prevStep}`);
    }
  };

  // Vérifier l'authentification et rediriger si nécessaire
  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
    } else if (user.onboardingCompleted) {
      router.push('/dashboard');
    }
  }, [user, router]);

  // Synchroniser l'étape courante avec l'URL
  useEffect(() => {
    const path = window.location.pathname;
    const stepMatch = path.match(/\/onboarding\/step-(\d+)/);
    if (stepMatch) {
      const urlStep = parseInt(stepMatch[1]);
      if (urlStep !== currentStep) {
        setCurrentStep(urlStep);
      }
    }
  }, []);

  return {
    currentStep,
    steps,
    data,
    isCompleted,
    isCurrentStepValid,
    handleNextStep,
    handlePreviousStep,
    saveStepData,
  };
};
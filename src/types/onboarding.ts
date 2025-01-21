import { IOnboardingData } from './common';

export interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
}

export interface OnboardingStore {
  currentStep: number;
  steps: OnboardingStep[];
  data: IOnboardingData;
  isCompleted: boolean;
  setCurrentStep: (step: number) => void;
  setStepCompleted: (stepId: number) => void;
  updateData: (data: Partial<IOnboardingData>) => void;
  resetOnboarding: () => void;
  completeOnboarding: () => void;
}
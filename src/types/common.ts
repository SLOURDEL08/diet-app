import { Types } from 'mongoose';

export interface IOnboardingData {
  userId: Types.ObjectId;
  profession?: string;
  interests?: string[];
  preferences?: {
    theme?: 'light' | 'dark';
    notifications?: boolean;
    language?: string;
    emailFrequency?: 'daily' | 'weekly' | 'monthly' | 'never';
        emailValidated?: boolean;  // Ajout de cette propriété
  };
  createdAt?: Date;
  updatedAt?: Date;
}
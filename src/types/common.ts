export interface IOnboardingData {
  userId: string;
  profession?: string;
  interests?: string[];
  preferences?: {
    theme?: 'light' | 'dark';
    notifications?: boolean;
    language?: string;
  };
  emailVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
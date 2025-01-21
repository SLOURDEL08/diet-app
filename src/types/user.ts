
export interface IUser {
  _id?: string;
  email: string;
  password: string;
  name: string;
  onboardingStep: number;
  onboardingCompleted: boolean;
  emailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

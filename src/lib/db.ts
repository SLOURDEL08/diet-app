import { User, OnboardingDataModel } from '@/models/User';
import { IUser } from '@/types/user';
import { IOnboardingData } from '@/types/common';
import connectDB from './mongodb';

export async function getUserByEmail(email: string): Promise<IUser | null> {
  await connectDB();
  return User.findOne({ email });
}

export async function getUserById(id: string): Promise<IUser | null> {
  await connectDB();
  return User.findById(id);
}

export async function createUser(userData: Partial<IUser>): Promise<IUser> {
  await connectDB();
  return User.create(userData);
}

export async function getOnboardingData(userId: string): Promise<IOnboardingData | null> {
  await connectDB();
  return OnboardingDataModel.findOne({ userId });
}

export async function updateOnboardingData(
  userId: string,
  data: Partial<IOnboardingData>
): Promise<IOnboardingData | null> {
  await connectDB();
  return OnboardingDataModel.findOneAndUpdate(
    { userId },
    { $set: data },
    { new: true, upsert: true }
  );
}

export async function isOnboardingComplete(userId: string): Promise<boolean> {
  await connectDB();
  const user = await User.findById(userId);
  return user?.onboardingCompleted || false;
}
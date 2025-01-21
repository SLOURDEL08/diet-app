import mongoose, { Schema } from 'mongoose';
import { IUser } from '@/types/user';
import { IOnboardingData} from '@/types/common'

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  onboardingStep: {
    type: Number,
    default: 1,
    min: 1,
    max: 6
  },
  onboardingCompleted: {
    type: Boolean,
    default: false
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String,
    select: false
  },
  emailVerificationExpires: {
    type: Date,
    select: false
  }
}, {
  timestamps: true
});

const onboardingDataSchema = new Schema<IOnboardingData>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  profession: {
    type: String,
    trim: true
  },
  interests: [{
    type: String,
    trim: true
  }],
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    },
    notifications: {
      type: Boolean,
      default: true
    },
    language: {
      type: String,
      default: 'fr'
    },
    emailFrequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'never'],
      default: 'weekly'
    }
  }
}, {
  timestamps: true
});

// Fonction utilitaire pour la mise à jour de l'étape d'onboarding
export async function updateOnboardingStep(userId: string, step: number): Promise<IUser | null> {
  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        onboardingStep: step,
        onboardingCompleted: step >= 6
      }
    },
    { 
      new: true,
      runValidators: true 
    }
  );
  return user;
}

// Fonction utilitaire pour la vérification de l'email
export async function verifyEmail(userId: string): Promise<IUser | null> {
  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        emailVerified: true,
        emailVerificationToken: undefined,
        emailVerificationExpires: undefined
      }
    },
    { 
      new: true,
      runValidators: true 
    }
  );
  return user;
}

// Export des modèles
export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
export const OnboardingDataModel = mongoose.models.OnboardingData || mongoose.model<IOnboardingData>('OnboardingData', onboardingDataSchema);
'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ArrowRight, Sparkles, User, Mail, Settings } from 'lucide-react';
import StepLayout from '@/app/onboarding/StepLayout';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useAuth } from '@/contexts/AuthContext';
import { loadFull } from "tsparticles";
import Particles from "react-tsparticles";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const completedSteps = [
  {
    title: 'Profil créé',
    icon: User,
    description: 'Votre profil est configuré avec vos préférences'
  },
  {
    title: 'Email vérifié',
    icon: Mail,
    description: 'Votre adresse email a été validée'
  },
  {
    title: 'Configuration terminée',
    icon: Settings,
    description: 'Vos préférences sont enregistrées'
  }
];

export default function Step6() {
  const router = useRouter();
  const { user } = useAuth();
  const { saveStepData } = useOnboarding();

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  useEffect(() => {
    saveStepData({ onboardingCompleted: true });
  }, []);

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <StepLayout
      title="Félicitations !"
      description="Votre compte est maintenant configuré"
    >
      {/* Confetti Animation */}
      <Particles
        id="confetti"
        init={particlesInit}
        options={{
          fullScreen: false,
          particles: {
            number: {
              value: 0
            },
            color: {
              value: ["#C7EF00", "#ffffff", "#170312"]
            },
            shape: {
              type: ["circle", "square"]
            },
            opacity: {
              value: 1,
              animation: {
                enable: true,
                minimumValue: 0,
                speed: 2,
                startValue: "max",
                destroy: "min"
              }
            },
            size: {
              value: 4,
              random: {
                enable: true,
                minimumValue: 2
              }
            },
            life: {
              duration: {
                sync: true,
                value: 5
              },
              count: 1
            },
            move: {
              enable: true,
              gravity: {
                enable: true,
                acceleration: 10
              },
              speed: 20,
              direction: "none",
              random: false,
              straight: false,
              outModes: {
                default: "destroy",
                top: "none"
              }
            }
          },
          emitters: {
            position: {
              x: 50,
              y: 25
            },
            rate: {
              quantity: 5,
              delay: 0.15
            }
          }
        }}
        className="absolute inset-0 pointer-events-none"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl mx-auto space-y-12 relative z-10"
      >
        {/* Success Icon */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col items-center"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
            <motion.div
              className="relative bg-primary/10 backdrop-blur-md w-32 h-32 rounded-full flex items-center justify-center border border-primary"
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <CheckCircle className="w-16 h-16 text-primary" />
            </motion.div>
            <motion.div
              className="absolute -top-2 -right-2"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-8 h-8 text-primary" />
            </motion.div>
          </div>

          {/* Welcome Message */}
          <motion.div 
            variants={itemVariants}
            className="text-center mt-8 space-y-3"
          >
            <h3 className="text-3xl font-bold text-white">
              Bienvenue {user?.name} !
            </h3>
            <p className="text-lg text-white/60">
              Votre espace de travail est prêt à être utilisé.
            </p>
          </motion.div>
        </motion.div>

        {/* Completed Steps */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {completedSteps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/10
                hover:border-primary/50 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium text-white">
                    {step.title}
                  </h4>
                  <p className="text-sm text-white/60">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Dashboard Button */}
        <motion.div variants={itemVariants} className="flex justify-center">
          <motion.button
            onClick={handleGoToDashboard}
            className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary 
              text-[#170312] font-medium hover:opacity-90 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>Accéder au tableau de bord</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </motion.div>
    </StepLayout>
  );
}
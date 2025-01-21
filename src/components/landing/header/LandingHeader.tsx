'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { 
  RocketIcon, 
  PlayCircleIcon, 
  PauseCircleIcon,
  ChevronRightIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import LandingCards from './LandingCards';

export default function LandingHeader() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  useEffect(() => {
    setIsClient(true);

    // Gestion du scroll indicator
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollIndicator(false);
      } else {
        setShowScrollIndicator(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const togglePlayback = () => {
    const gifContainer = document.getElementById('background-gif');
    if (gifContainer) {
      if (isPlaying) {
        // Pour mettre en pause, on cache le GIF et on affiche la première frame
        gifContainer.style.opacity = '0';
      } else {
        // Pour reprendre, on réaffiche le GIF
        gifContainer.style.opacity = '1';
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <header className="relative min-h-screen h-full pt-40 pb-10 w-full overflow-hidden">
      {isClient && (
        <>
          {/* GIF en arrière-plan */}
          <div 
            id="background-gif"
            className="absolute top-0 left-0 w-full h-full transition-opacity duration-300"
            style={{ opacity: isPlaying ? 1 : 0 }}
          >
            <Image
              src="/videos/hero-background.gif"
              alt="Animation d'arrière-plan"
              fill
              className="object-cover"
              priority
            />
          </div>



          {/* Overlay gradient */}
          <div className="absolute inset-0 "></div>
          
          {/* Contrôle de lecture */}
          <div className="absolute bottom-8 right-8 z-20 flex items-center">
            <div className={`mr-3 text-sm text-white/60 bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm ${
              isPlaying ? 'opacity-100' : 'opacity-0'
            } transition-opacity duration-300`}>
              En lecture
            </div>
            <button
              onClick={togglePlayback}
              className="text-white/80 hover:text-white transition-colors bg-[#170312]/40 rounded-full p-2 backdrop-blur-sm hover:bg-[#170312]/60"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <PauseCircleIcon className="h-12 w-12" />
              ) : (
                <PlayCircleIcon className="h-12 w-12" />
              )}
            </button>
          </div>
        </>
      )}

      <div className="relative z-10 h-full flex items-center">
        <div className=" px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-left">
            {/* Badge */}
            <div className="inline-block mb-8">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-[#C7EF00]/10 text-[#C7EF00] border border-[#C7EF00]/20">
                ✨ Nouveau : Découvrez notre plateforme repensée
                <ChevronRightIcon className="ml-1 h-4 w-4" />
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-8 text-white leading-tight">
              Transformez Votre<br className="hidden md:block" />
              Expérience Digitale
            </h1>

            <div className="flex flex-col sm:flex-row justify-start items-center gap-4 sm:gap-6 mb-16">
              <Button 
                href="/auth/register" 
                variant="primary"
                size="lg"
                icon={RocketIcon}
                iconPosition="right"
                className="w-full sm:w-auto"
              >
                Commencer Gratuitement
              </Button>
              <Button 
                href="#features" 
                variant="outline"
                size="lg"
                className="w-full sm:w-auto group"
              >
                Découvrir les Fonctionnalités
              </Button>
            </div>

                     <LandingCards/>
          </div>
        </div>
      </div>

   
    </header>
  );
}
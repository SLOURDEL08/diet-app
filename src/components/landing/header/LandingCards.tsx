'use client';

import { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, ArrowUpRight, StarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const reviews = [
  {
    name: 'Sophie Martin',
    role: 'Designer UI/UX',
    avatar: '/avatars/avatar1.png',
    text: 'Une interface intuitive qui a transformé notre workflow quotidien.',
    rating: 5
  },
  {
    name: 'Thomas Dubois',
    role: 'Chef de Projet',
    avatar: '/avatars/avatar2.png',
    text: 'Excellent outil, simple et efficace.',
    rating: 5
  },
  {
    name: 'Marie Laurent',
    role: 'Développeuse',
    avatar: '/avatars/avatar3.png',
    text: 'La meilleure solution que nous ayons utilisée.',
    rating: 5
  },
  {
    name: 'Lucas Bernard',
    role: 'Product Owner',
    avatar: '/avatars/avatar4.png',
    text: 'Parfait pour notre équipe !',
    rating: 5
  }
];

const services = [
  {
    title: 'Analytics Avancés',
    description: 'Visualisez et analysez vos données en temps réel',
  },
  {
    title: 'Gestion de Projet',
    description: 'Organisez et suivez vos projets efficacement',
  },
  {
    title: 'Collaboration',
    description: 'Travaillez en équipe de manière fluide',
  },
  {
    title: 'Automatisation',
    description: 'Simplifiez vos tâches répétitives',
  }
];

export default function LandingCards() {
  const [currentService, setCurrentService] = useState(0);
  const [currentReview, setCurrentReview] = useState(0);
  const [isHoveredCTA, setIsHoveredCTA] = useState(false);

  const nextService = () => {
    setCurrentService((prev) => (prev + 1) % services.length);
  };

  const prevService = () => {
    setCurrentService((prev) => (prev - 1 + services.length) % services.length);
  };

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length);
  };

  useEffect(() => {
    const timer = setInterval(nextService, 5000);
    const reviewTimer = setInterval(nextReview, 7000);
    return () => {
      clearInterval(timer);
      clearInterval(reviewTimer);
    };
  }, []);

  return (
    <div className="flex flex-col lg:flex-row w-full gap-10 px-4 lg:px-0">
      {/* Review Card */}
      <div className="w-full lg:w-1/3 bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-semibold text-gray-800">Avis Clients</h3>
          <div className="flex items-center bg-gray-50 px-3 py-1 rounded-full">
            <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
            <span className="text-sm font-medium">4.9/5</span>
          </div>
        </div>

        <div className="flex -space-x-4 mb-6">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="relative w-14 h-14 rounded-full border-2 border-white overflow-hidden transition-all duration-300 hover:scale-110 hover:z-10 cursor-pointer"
              style={{ zIndex: reviews.length - index }}
              onClick={() => setCurrentReview(index)}
            >
              <Image
                src={review.avatar}
                alt={review.name}
                width={56}
                height={56}
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <p className="text-base text-gray-600 italic leading-relaxed">
            "{reviews[currentReview].text}"
          </p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-800">{reviews[currentReview].name}</p>
              <p className="text-xs text-gray-500">{reviews[currentReview].role}</p>
            </div>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className="w-4 h-4 text-yellow-400 fill-current" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Services Slider Card */}
      <div className="w-full lg:w-1/3 bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-semibold text-white">Nos Services</h3>
          <div className="flex gap-2">
            <button
              onClick={prevService}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronLeftIcon className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={nextService}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronRightIcon className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden h-full">
          <div
            className="transition-all duration-500 ease-out absolute w-full"
            style={{ transform: `translateX(-${currentService * 100}%)` }}
          >
            <div className="flex">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="min-w-full px-4"
                >
                  <h4 className="text-xl font-semibold text-white mb-3">
                    {service.title}
                  </h4>
                  <p className="text-white/80">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-6 gap-2">
          {services.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                currentService === index ? 'bg-white' : 'bg-white/30'
              }`}
              onClick={() => setCurrentService(index)}
            />
          ))}
        </div>
      </div>

      {/* CTA Card */}
      <div 
        className="w-full lg:w-1/3 bg-primary rounded-3xl p-8 relative overflow-hidden group transition-all duration-300 hover:shadow-xl"
        onMouseEnter={() => setIsHoveredCTA(true)}
        onMouseLeave={() => setIsHoveredCTA(false)}
      >
        <div className="absolute top-6 right-6">
          <Button
            href="/auth/register"
            variant="outline"
            className="!bg-black !text-primary hover:!bg-black/80 transition-all"
            icon={ArrowUpRight}
          >
            Commencer
          </Button>
        </div>

        <div className="mt-16 relative z-10">
          <h3 className="text-2xl font-semibold text-black mb-4">
            Prêt à Commencer ?
          </h3>
          <p className="text-black/80 text-lg mb-8 leading-relaxed">
            Rejoignez des milliers d'utilisateurs et transformez votre façon de travailler dès aujourd'hui.
          </p>
          
        </div>

        <div 
          className={`absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform translate-x-[-100%] transition-transform duration-1000 ${
            isHoveredCTA ? 'translate-x-[100%]' : ''
          }`}
        />
      </div>
    </div>
  );
}
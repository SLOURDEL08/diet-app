'use client';

import { useState } from 'react';
import { 
  RocketIcon, 
  ShieldIcon, 
  SparklesIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  MenuIcon,

} from 'lucide-react';
import { Button } from '@/components/ui/button';
import LandingHeader from '@/components/landing/header/LandingHeader';
import ScrollSeparator from '@/components/landing/ScrollSeparator';
import { useThemeConfig } from '@/hooks/useTheme';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  useThemeConfig();

 

  const features = [
    {
      title: "Design Intuitif",
      description: "Une interface épurée qui s'adapte naturellement à vos besoins.",
      icon: SparklesIcon,
      bgColor: "bg-white/10 dark:bg-white/10",
      iconColor: "text-primary dark:text-primary"
    },
    {
      title: "Performance",
      description: "Rapidité et fluidité au cœur de votre expérience.",
      icon: RocketIcon,
      bgColor: "bg-white/10 dark:bg-white/10",
      iconColor: "text-primary dark:text-primary"
    },
    {
      title: "Sécurité",
      description: "Protection de vos données en toute simplicité.",
      icon: ShieldIcon,
      bgColor: "bg-white/10 dark:bg-white/10",
      iconColor: "text-primary dark:text-primary"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#170312] transition-colors duration-300">
      {/* Navigation minimaliste */}
      <nav className="fixed mx-6 rounded-3xl mt-6 top-0 left-0 right-0 z-50 bg-white dark:bg-white/10 backdrop-blur-md border border-slate-200 dark:border-white/5 shadow-sm">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between h-16">
            <span className="text-2xl text-slate-900 dark:text-white font-medium">MonApp</span>
            
            <div className="flex items-center gap-4">
              {/* Thème toggle */}
              <ThemeToggle isExpanded/>

              {/* Menu mobile */}
              <button 
                className="md:hidden p-2 text-slate-900 dark:text-white hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <MenuIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Menu desktop */}
            <div className="hidden md:flex items-center space-x-6">
              <Button 
                href="/auth/login" 
                variant="ghost"
                className="text-slate-900 dark:text-white hover:text-primary transition-colors"
              >
                Connexion
              </Button>
              <Button 
                href="/auth/register" 
                variant="primary"
                icon={ArrowUpRightIcon}
              >
                Démarrer
              </Button>
            </div>
          </div>

          {/* Menu mobile expanded */}
          <div 
            className={`md:hidden transition-all duration-300 ${
              isMenuOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
            } overflow-hidden`}
          >
            <div className="py-4 space-y-4">
              <Button 
                href="/auth/login" 
                variant="ghost"
                className="w-full text-left text-slate-900 dark:text-white hover:text-primary"
              >
                Connexion
              </Button>
              <Button 
                href="/auth/register" 
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary/10"
              >
                Démarrer
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <LandingHeader />
      <ScrollSeparator />

      {/* Features Section */}
      <section id="features" className="py-32 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20 mb-6">
              Découvrez nos fonctionnalités
            </div>
            <h2 className="text-4xl font-medium mb-6 text-slate-900 dark:text-white">
              Simplicité et Efficacité
            </h2>
            <p className="text-slate-600 dark:text-white/60 max-w-2xl mx-auto text-lg">
              {"Nous avons repensé chaque aspect de l'expérience pour vous offrir l'essentiel."}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`${feature.bgColor} backdrop-blur-md p-8 rounded-3xl 
                  border border-slate-200 dark:border-white/10
                  bg-white dark:bg-white/10
                  transform transition-all duration-300 hover:scale-105
                  ${activeFeature === index ? 'border-primary' : ''}
                  shadow-sm hover:shadow-md
                `}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <feature.icon className={`h-10 w-10 mb-6 ${feature.iconColor}`} />
                <h3 className="text-xl font-medium mb-4 text-slate-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-white/60">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-white dark:bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-slate-200 dark:border-white/10 shadow-sm">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl font-medium mb-6 text-slate-900 dark:text-white">
                Prêt à Transformer Votre Expérience ?
              </h2>
              <p className="text-slate-600 dark:text-white/60 mb-10 text-lg">
                Rejoignez les utilisateurs qui ont déjà simplifié leur workflow.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button 
                  href="/auth/register" 
                  variant="outline"
                  size="lg"
                  icon={ArrowRightIcon}
                  className="border-primary text-primary hover:bg-primary/10 w-full sm:w-auto"
                >
                  Commencer Maintenant
                </Button>
                <Button 
                  href="#features" 
                  variant="ghost"
                  size="lg"
                  className="text-slate-900 dark:text-white hover:text-primary w-full sm:w-auto"
                >
                  En Savoir Plus
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-slate-200 dark:border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <span className="text-xl font-medium text-primary">MonApp</span>
              <p className="text-slate-500 dark:text-white/40 text-sm">
                © {new Date().getFullYear()} MonApp.<br />
                Tous droits réservés.
              </p>
            </div>

            {[
              {
                title: "Produit",
                links: [
                  { name: "Fonctionnalités", href: "#features" },
                  { name: "Tarifs", href: "#pricing" },
                  { name: "Guide", href: "#guide" }
                ]
              },
              {
                title: "Support",
                links: [
                  { name: "Contact", href: "/contact" },
                  { name: "FAQ", href: "/faq" }
                ]
              },
              {
                title: "Légal",
                links: [
                  { name: "Confidentialité", href: "/privacy" },
                  { name: "Conditions", href: "/terms" }
                ]
              }
            ].map((section, index) => (
              <div key={index}>
                <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-4">
                  {section.title}
                </h4>
                <div className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <a
                      key={linkIndex}
                      href={link.href}
                      className="block text-sm text-slate-500 dark:text-white/40 hover:text-primary transition-colors"
                    >
                      {link.name}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
'use client';

import { Star, Zap, Shield } from 'lucide-react';

const achievements = [
  { 
    icon: Star,
    label: "Satisfaction Client",
    value: "98%" 
  },
  { 
    icon: Zap,
    label: "Performance",
    value: "2x" 
  },
  { 
    icon: Shield,
    label: "Sécurité",
    value: "100%" 
  }
];


export default function EnhancedSeparator() {





  return (
    <div className="relative">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-primary backdrop-blur-sm" />
      
      <div className="relative max-w-7xl mx-auto">
        {/* Top gradient separator */}

        {/* Main content */}
        <div className="px-6 py-10">
          {/* Upper section with achievements */}
          <div className="flex text-black flex-wrap justify-center gap-8 md:gap-16">
            {achievements.map((item, index) => {
              const Icon = item.icon;
              return (
                <div 
                  key={index}
                  className="flex items-center space-x-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-black/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-black">
                      {item.value}
                    </div>
                    <div className="text-xs text-black/60">
                      {item.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

      
        </div>

     </div>
    </div>
  );
}

import React from 'react';
import * as Icons from 'lucide-react';

export const LandingHero: React.FC<{ onCtaClick: () => void }> = ({ onCtaClick }) => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-10 pb-20 groow-hero-gradient">
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
            <h1 className="text-5xl md:text-7xl font-medium text-white tracking-tight mb-8 leading-[1.1]">
              Scopri quanto ti costa <br className="hidden md:block" />
              <span className="text-gradient">non automatizzare</span> <br className="hidden md:block" />
              i tuoi processi
            </h1>

            <p className="text-lg md:text-xl font-normal text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Inserisci i dati, l'IA calcola in tempo reale tempo e denaro che stai perdendo.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={onCtaClick}
                  className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-electric-pulse text-white rounded-full text-lg font-medium hover:scale-105 transition-all duration-300 w-full sm:w-auto"
                >
                    Calcola il tuo risparmio
                    <Icons.ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
      </section>
  );
};

export const LandingHowItWorks: React.FC = () => {
    return (
        <section className="py-24 bg-midnight-silicon border-y border-white/5 relative">
             <div className="max-w-5xl mx-auto px-4 text-center">
                 <h2 className="text-3xl md:text-5xl font-medium text-white mb-12 leading-tight">
                     Il calcolatore Groow ti aiuta a stimare <br className="hidden md:block"/>
                     quanto stai spendendo oggi in attività:
                 </h2>

                 <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-16 mb-12">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-aqua-byte"></div>
                        <span className="text-3xl md:text-4xl font-medium text-white tracking-tight">ripetitive</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-electric-pulse"></div>
                        <span className="text-3xl md:text-4xl font-medium text-white tracking-tight">manuali</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-cobalto-futuro"></div>
                        <span className="text-3xl md:text-4xl font-medium text-white tracking-tight">a basso valore</span>
                    </div>
                 </div>

                 <p className="text-xl md:text-2xl text-gray-400 mb-20 font-light max-w-2xl mx-auto">
                    che possono essere automatizzate e monitorate 24/7.
                 </p>
             </div>
        </section>
    );
};

export const LandingCapabilities: React.FC = () => {
    return (
        <section className="py-20 px-4 bg-midnight-silicon">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-medium text-white mb-4">Cosa puoi automatizzare</h2>
                <p className="text-gray-400 font-normal">Dall'amministrazione alle vendite, dalla produzione al supporto clienti.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
                {[
                    { label: 'Vendite', icon: Icons.ShoppingCart },
                    { label: 'Assistenza', icon: Icons.Headphones },
                    { label: 'Amministrazione', icon: Icons.Banknote },
                    { label: 'Risorse Umane', icon: Icons.Users },
                    { label: 'Produzione', icon: Icons.Factory },
                    { label: 'Operatività', icon: Icons.Settings },
                ].map((cap, i) => (
                    <div key={i} className="groow-card p-6 flex flex-col items-center gap-4 text-gray-300 hover:border-electric-pulse transition-all group">
                        <cap.icon size={32} className="text-electric-pulse" />
                        <span className="font-medium text-white text-sm">{cap.label}</span>
                    </div>
                ))}
            </div>
        </section>
    );
};

export const LandingSocial: React.FC = () => {
    return (
        <section className="py-20 max-w-6xl mx-auto px-4 font-sans bg-midnight-silicon">
            <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                    <div className="text-5xl md:text-6xl font-medium text-white mb-2">300+</div>
                    <div className="text-gray-400 font-medium">Processi automatizzati</div>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                    <div className="text-5xl md:text-6xl font-medium text-white mb-2">10k+</div>
                    <div className="text-gray-400 font-medium">Ore risparmiate</div>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                    <div className="text-5xl md:text-6xl font-medium text-white mb-2">97%</div>
                    <div className="text-gray-400 font-medium">Clienti fidelizzati</div>
                </div>
            </div>
        </section>
    );
};

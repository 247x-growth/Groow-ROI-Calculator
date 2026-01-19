
import React from 'react';
import { EconomicParameters } from '../types';
import * as Icons from 'lucide-react';

interface Props {
  data: EconomicParameters;
  onChange: (data: EconomicParameters) => void;
}

const Step3Economics: React.FC<Props> = ({ data, onChange }) => {
  
  const updateField = (field: keyof EconomicParameters, value: number) => {
    onChange({ ...data, [field]: value });
  };

  // Helper to generate gradient style
  const getSliderStyle = (val: number, min: number, max: number, colorHex: string) => {
    const percent = ((val - min) / (max - min)) * 100;
    return {
      background: `linear-gradient(to right, ${colorHex} 0%, ${colorHex} ${percent}%, #374151 ${percent}%, #374151 100%)`
    };
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Parametri Economici</h2>
        <p className="text-gray-400 font-normal">Inserisci una stima dei costi per calcolare il ritorno sull'investimento.</p>
      </div>

      <div className="bg-bg-card border border-white/10 rounded-xl p-8 space-y-8">
        
        {/* Average Hourly Cost */}
        <div>
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="text-lg font-bold text-white">Costo Orario Medio</h3>
                    <p className="text-xs font-light text-gray-400">Media lorda (RAL + Contributi) per dipendente</p>
                </div>
                <div className="text-2xl font-bold text-primary">€{data.averageHourlyCost}/h</div>
            </div>
            
            <input 
                type="range" min="15" max="100" step="1"
                value={data.averageHourlyCost} 
                onChange={(e) => updateField('averageHourlyCost', parseInt(e.target.value))}
                style={getSliderStyle(data.averageHourlyCost, 15, 100, '#3348F6')}
                className="w-full h-3 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs font-light text-gray-500 mt-2">
                <span>€15 (Junior)</span>
                <span>€50+ (Senior/Manager)</span>
                <span>€100 (Dirigente)</span>
            </div>
        </div>

        <div className="h-px bg-white/5 w-full"></div>

        {/* Improvement Margin */}
        <div>
             <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="text-lg font-bold text-white">Margine di Miglioramento</h3>
                    <p className="text-xs font-light text-gray-400">Potenziale di efficienza con l'automazione</p>
                </div>
                <div className="text-2xl font-bold text-accent">{data.inefficiencyFactor.toFixed(2)}x</div>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex-1">
                    <input 
                        type="range" min="100" max="200" step="5"
                        value={data.inefficiencyFactor * 100} 
                        onChange={(e) => updateField('inefficiencyFactor', parseInt(e.target.value) / 100)}
                        style={getSliderStyle(data.inefficiencyFactor * 100, 100, 200, '#32D9F6')}
                        className="w-full h-3 rounded-lg appearance-none cursor-pointer accent-accent"
                    />
                    <div className="flex justify-between text-xs font-light text-gray-500 mt-2">
                        <span>1.0x (Nessun margine)</span>
                        <span>1.5x (Margine moderato)</span>
                        <span>2.0x (Ampio margine)</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Step3Economics;

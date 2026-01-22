import React from 'react';
import { DepartmentState } from '../types';
import { DEPARTMENTS } from '../constants';
import * as Icons from 'lucide-react';

interface Props {
  data: Record<string, DepartmentState>;
  onChange: (data: Record<string, DepartmentState>) => void;
}

const Step2Departments: React.FC<Props> = ({ data, onChange }) => {

  const toggleDept = (deptId: string) => {
    const newData = { ...data };
    if (newData[deptId]) {
      newData[deptId] = {
        ...newData[deptId],
        isSelected: !newData[deptId].isSelected
      };
      onChange(newData);
    }
  };

  const hasSelection = Object.values(data).some((d: DepartmentState) => d.isSelected);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-4 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold font-sans text-white mb-2">Quali reparti vuoi automatizzare?</h2>
        <p className="text-gray-400 text-sm md:text-base">Seleziona le aree aziendali dove senti maggiore carico di lavoro manuale.</p>
        {!hasSelection && (
          <p className="text-xs text-amber-400 flex items-center justify-center gap-1 mt-2">
            <Icons.AlertCircle size={12} /> Seleziona almeno un reparto per continuare
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 md:gap-4">
        {DEPARTMENTS.map((dept) => {
          // Safe icon access
          const IconComponent = (Icons as any)[dept.icon] || Icons.Circle;
          const isSelected = data[dept.id]?.isSelected;

          return (
            <button
              key={dept.id}
              onClick={() => toggleDept(dept.id)}
              className={`relative group p-3 md:p-6 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-2 md:gap-4 text-center overflow-hidden ${isSelected
                ? 'bg-primary/10 border-primary shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                : 'bg-bg-card border-white/10 hover:border-white/30 hover:bg-white/5'
                }`}
            >
              {isSelected && (
                <div className="absolute top-1.5 right-1.5 md:top-3 md:right-3 text-primary animate-scale-in">
                  <Icons.CheckCircle2 size={16} className="md:w-[18px] md:h-[18px] bg-bg-card rounded-full" />
                </div>
              )}

              <div className={`p-2 md:p-4 rounded-xl transition-colors ${isSelected ? 'bg-primary text-white' : 'bg-white/5 text-gray-400 group-hover:text-white'}`}>
                <IconComponent size={20} className="md:w-8 md:h-8" />
              </div>

              <div className="w-full overflow-hidden">
                <h3 className={`font-bold text-sm md:text-lg mb-0.5 md:mb-1 truncate ${isSelected ? 'text-white' : 'text-gray-300'}`}>{dept.name}</h3>
                <p className="text-[9px] md:text-xs text-gray-500 line-clamp-2 leading-tight px-1">
                  {dept.id === 'sales' && 'Contatti, preventivi, clienti'}
                  {dept.id === 'customer_care' && 'Risposte, FAQ, supporto'}
                  {dept.id === 'finance' && 'Fatture, pagamenti, report'}
                  {dept.id === 'hr' && 'Inserimento, ferie, selezione'}
                  {dept.id === 'ops' && 'Ordini, magazzino, logistica'}
                  {dept.id === 'it' && 'Integrazioni, accessi, IT'}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Step2Departments;
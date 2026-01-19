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

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold font-sans text-white mb-2">Quali reparti vuoi automatizzare?</h2>
        <p className="text-gray-400">Seleziona le aree aziendali dove senti maggiore carico di lavoro manuale.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {DEPARTMENTS.map((dept) => {
          // Safe icon access
          const IconComponent = (Icons as any)[dept.icon] || Icons.Circle;
          const isSelected = data[dept.id]?.isSelected;

          return (
            <button
              key={dept.id}
              onClick={() => toggleDept(dept.id)}
              className={`relative group p-6 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-4 text-center ${
                isSelected
                  ? 'bg-primary/10 border-primary shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                  : 'bg-bg-card border-white/10 hover:border-white/30 hover:bg-white/5'
              }`}
            >
               {isSelected && (
                <div className="absolute top-3 right-3 text-primary animate-scale-in">
                    <Icons.CheckCircle2 size={20} className="bg-bg-card rounded-full" />
                </div>
               )}

              <div className={`p-4 rounded-xl transition-colors ${isSelected ? 'bg-primary text-white' : 'bg-white/5 text-gray-400 group-hover:text-white'}`}>
                <IconComponent size={32} />
              </div>
              
              <div>
                <h3 className={`font-bold text-lg mb-1 ${isSelected ? 'text-white' : 'text-gray-300'}`}>{dept.name}</h3>
                <p className="text-xs text-gray-500 line-clamp-2">
                    {dept.id === 'sales' && 'Gestione contatti, preventivi e clienti'}
                    {dept.id === 'customer_care' && 'Risposte, domande frequenti e supporto'}
                    {dept.id === 'finance' && 'Fatturazione, pagamenti e report'}
                    {dept.id === 'hr' && 'Inserimento, ferie e selezione'}
                    {dept.id === 'ops' && 'Ordini, magazzino e logistica'}
                    {dept.id === 'it' && 'Integrazioni, accessi e manutenzione'}
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
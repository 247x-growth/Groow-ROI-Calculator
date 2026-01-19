import { DepartmentDefinition, ProcessDefinition } from './types';

export const INDUSTRIES = [
  { id: 'manufacturing', label: 'Manifatturiero', icon: 'Factory' },
  { id: 'retail', label: 'Commercio', icon: 'ShoppingBag' },
  { id: 'services', label: 'Servizi professionali', icon: 'Briefcase' },
  { id: 'tech', label: 'Informatica', icon: 'Cpu' },
  { id: 'food', label: 'Ristorazione', icon: 'Utensils' },
  { id: 'healthcare', label: 'Sanità', icon: 'HeartPulse' },
  { id: 'construction', label: 'Edilizia', icon: 'HardHat' },
  { id: 'logistics', label: 'Logistica', icon: 'Truck' },
  { id: 'other', label: 'Altro', icon: 'MoreHorizontal' },
];

export const REVENUE_RANGES = [
  '< €500K',
  '€500K - €2M',
  '€2M - €10M',
  '€10M - €50M',
  '> €50M'
];

export const HOURLY_COSTS = {
  junior: 22,
  middle: 32,
  senior: 45,
  executive: 65,
};

// Automation Factors based on prompt description:
// Rule-based: 0.85, Semi-structured: 0.65, Simple decisions: 0.50, Supervision needed: 0.35

export const DEPARTMENTS: DepartmentDefinition[] = [
  {
    id: 'sales',
    name: 'Vendite',
    icon: 'ShoppingCart',
    defaultStaffCount: 1,
    processes: [
      { id: 'sales_followup', name: 'Ricontatto automatico clienti', defaultHours: 8, automationFactor: 0.85 },
      { id: 'sales_quote', name: 'Creazione preventivi', defaultHours: 6, automationFactor: 0.65 },
      { id: 'sales_qualify', name: 'Qualificazione contatti', defaultHours: 5, automationFactor: 0.50 },
      { id: 'sales_crm', name: 'Aggiornamento dati clienti', defaultHours: 4, automationFactor: 0.85 },
      { id: 'sales_report', name: 'Reportistica vendite', defaultHours: 3, automationFactor: 0.85 },
    ]
  },
  {
    id: 'customer_care',
    name: 'Assistenza Clienti',
    icon: 'MessageCircle',
    defaultStaffCount: 1,
    processes: [
      { id: 'cc_tickets', name: 'Risposte email ripetitive', defaultHours: 12, automationFactor: 0.65 },
      { id: 'cc_faq', name: 'Gestione domande frequenti', defaultHours: 4, automationFactor: 0.50 },
      { id: 'cc_triage', name: 'Smistamento richieste', defaultHours: 3, automationFactor: 0.85 },
      { id: 'cc_followup', name: 'Contatto post-vendita', defaultHours: 5, automationFactor: 0.85 },
      { id: 'cc_survey', name: 'Sondaggi soddisfazione', defaultHours: 2, automationFactor: 0.85 },
    ]
  },
  {
    id: 'finance',
    name: 'Amministrazione',
    icon: 'Euro',
    defaultStaffCount: 1,
    processes: [
      { id: 'fin_recon', name: 'Riconciliazione bancaria', defaultHours: 6, automationFactor: 0.85 },
      { id: 'fin_chase', name: 'Solleciti pagamenti', defaultHours: 4, automationFactor: 0.85 },
      { id: 'fin_invoice', name: 'Creazione fatture ricorrenti', defaultHours: 3, automationFactor: 0.85 },
      { id: 'fin_report', name: 'Reportistica finanziaria', defaultHours: 5, automationFactor: 0.65 },
      { id: 'fin_expense', name: 'Gestione note spese', defaultHours: 3, automationFactor: 0.65 },
      { id: 'fin_tax', name: 'Controllo scadenze fiscali', defaultHours: 2, automationFactor: 0.85 },
    ]
  },
  {
    id: 'hr',
    name: 'Risorse Umane',
    icon: 'Users',
    defaultStaffCount: 1,
    processes: [
      { id: 'hr_screen', name: 'Valutazione CV', defaultHours: 8, automationFactor: 0.50 },
      { id: 'hr_onboard', name: 'Inserimento nuovi dipendenti', defaultHours: 6, automationFactor: 0.50 },
      { id: 'hr_leave', name: 'Gestione ferie e permessi', defaultHours: 4, automationFactor: 0.85 },
      { id: 'hr_time', name: 'Registro ore e presenze', defaultHours: 5, automationFactor: 0.85 },
      { id: 'hr_comms', name: 'Comunicazioni interne', defaultHours: 2, automationFactor: 0.50 },
    ]
  },
  {
    id: 'ops',
    name: 'Produzione & Magazzino',
    icon: 'Package',
    defaultStaffCount: 1,
    processes: [
      { id: 'ops_orders', name: 'Gestione ordini fornitori', defaultHours: 6, automationFactor: 0.65 },
      { id: 'ops_track', name: 'Tracciamento spedizioni', defaultHours: 4, automationFactor: 0.85 },
      { id: 'ops_inv', name: 'Inventario e riordino', defaultHours: 5, automationFactor: 0.65 },
      { id: 'ops_plan', name: 'Pianificazione produzione', defaultHours: 4, automationFactor: 0.35 },
      { id: 'ops_qa', name: 'Controllo qualità documentale', defaultHours: 3, automationFactor: 0.50 },
    ]
  },
  {
    id: 'it',
    name: 'Sistemi & IT',
    icon: 'Server',
    defaultStaffCount: 1,
    processes: [
      { id: 'it_sync', name: 'Sincronizzazione dati', defaultHours: 5, automationFactor: 0.85 },
      { id: 'it_backup', name: 'Salvataggi e manutenzione', defaultHours: 3, automationFactor: 0.85 },
      { id: 'it_access', name: 'Gestione accessi', defaultHours: 2, automationFactor: 0.85 },
      { id: 'it_report', name: 'Reportistica operativa', defaultHours: 4, automationFactor: 0.85 },
      { id: 'it_alert', name: 'Monitoraggio e avvisi', defaultHours: 3, automationFactor: 0.85 },
    ]
  }
];
import { ServiceRecord, ServiceType, WeekendStat } from './types';
import { calculateDuration } from './utils';

// Data derived from the OCR text provided in the prompt
export const MOCK_DATA: ServiceRecord[] = [
  // Page 1: Alunos
  { id: '1', type: ServiceType.ALUNO, date: '28/09/2025', startTime: '06:30', endTime: '19:00', durationHours: 12.5, personnel: 'AL SD OLÍVIA' },
  { id: '2', type: ServiceType.ALUNO, date: '01/11/2025', startTime: '18:30', endTime: '07:00', durationHours: 12.5, personnel: 'AL SD OLÍVIA' },
  { id: '3', type: ServiceType.ALUNO, date: '27/09/2025', startTime: '18:30', endTime: '07:00', durationHours: 12.5, personnel: 'AL SD LÉLLIS' },
  { id: '4', type: ServiceType.ALUNO, date: '27/10/2025', startTime: '18:30', endTime: '07:00', durationHours: 12.5, personnel: 'AL SD LÉLLIS' },
  { id: '5', type: ServiceType.ALUNO, date: '27/09/2025', startTime: '18:30', endTime: '07:00', durationHours: 12.5, personnel: 'AL SD NAARA' },
  { id: '6', type: ServiceType.ALUNO, date: '28/09/2025', startTime: '07:00', endTime: '12:30', durationHours: 5.5, personnel: 'AL SD NAARA' },
  { id: '7', type: ServiceType.ALUNO, date: '28/09/2025', startTime: '18:30', endTime: '07:00', durationHours: 12.5, personnel: 'AL SD MATHEUS ANTÔNIO' },
  
  // Page 22: Serviço Interno & REDS
  { id: '8', type: ServiceType.INTERNO, date: '24/09/2025', startTime: '06:00', endTime: '10:00', durationHours: 4, personnel: 'GENERICO' },
  { id: '9', type: ServiceType.INTERNO, date: '25/09/2025', startTime: '06:00', endTime: '10:00', durationHours: 4, personnel: 'GENERICO' },
  { id: '10', type: ServiceType.REDS, date: '25/11/2025', startTime: '18:00', endTime: '00:00', durationHours: 6, personnel: 'GENERICO' },
  { id: '11', type: ServiceType.REDS, date: '10/11/2025', startTime: '17:30', endTime: '00:00', durationHours: 6.5, personnel: 'GENERICO' },

  // Page 44: Sentinela
  { id: '12', type: ServiceType.SENTINELA, date: '18/11/2025', startTime: '19:00', endTime: '07:00', durationHours: 12, personnel: 'GENERICO' },
  { id: '13', type: ServiceType.SENTINELA, date: '05/12/2025', startTime: '18:30', endTime: '07:00', durationHours: 12.5, personnel: 'GENERICO' },
  { id: '14', type: ServiceType.SENTINELA, date: '20/11/2025', startTime: '19:00', endTime: '07:00', durationHours: 12, personnel: 'GENERICO' },

  // Page 66: Prado Seguro
  { id: '15', type: ServiceType.PRADO_SEGURO, date: '09/11/2025', startTime: '08:30', endTime: '15:20', durationHours: 6.83, personnel: 'GENERICO' },
  { id: '16', type: ServiceType.PRADO_SEGURO, date: '29/11/2025', startTime: '14:00', endTime: '20:00', durationHours: 6, personnel: 'GENERICO' },
  { id: '17', type: ServiceType.PRADO_SEGURO, date: '02/12/2025', startTime: '17:30', endTime: '00:00', durationHours: 6.5, personnel: 'GENERICO' },

  // Page 88: SAT & Feira Hippie
  { id: '18', type: ServiceType.SAT, date: '01/12/2025', startTime: '17:30', endTime: '00:00', durationHours: 6.5, personnel: 'GENERICO' },
  { id: '19', type: ServiceType.SAT, date: '08/11/2025', startTime: '07:00', endTime: '22:00', durationHours: 15, personnel: 'GENERICO' },
  { id: '20', type: ServiceType.FEIRA_HIPPIE, date: '08/11/2025', startTime: '07:00', endTime: '21:40', durationHours: 14.6, personnel: 'GENERICO' },
  { id: '21', type: ServiceType.FEIRA_HIPPIE, date: '09/11/2025', startTime: '07:00', endTime: '21:00', durationHours: 14, personnel: 'GENERICO' },
];

// Based on Page 132-133 stats
export const WEEKEND_STATS: WeekendStat[] = [
  { week: 1, total: 2, new: 1 },
  { week: 2, total: 0, new: 0 },
  { week: 3, total: 3, new: 1 },
  { week: 4, total: 3, new: 2 },
  { week: 5, total: 1, new: 1 },
  { week: 6, total: 4, new: 2 },
  { week: 7, total: 3, new: 2 },
  { week: 8, total: 3, new: 2 },
  { week: 9, total: 2, new: 1 },
  { week: 10, total: 5, new: 3 },
];
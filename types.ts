export enum ServiceType {
  ALUNO = 'Escala Alunos',
  INTERNO = 'Serviço Interno',
  REDS = 'REDS',
  SENTINELA = 'Sentinela',
  PRADO_SEGURO = 'Prado Seguro',
  SAT = 'SAT',
  FEIRA_HIPPIE = 'Feira Hippie'
}

export interface ServiceRecord {
  id: string;
  type: ServiceType | string;
  date: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  personnel?: string; // Optional name like "AL SD OLÍVIA"
}

export interface WeekendStat {
  week: number;
  total: number;
  new: number;
}

export interface FilterState {
  search: string;
  type: string; // 'ALL' or specific ServiceType
  startDate: string;
  endDate: string;
}
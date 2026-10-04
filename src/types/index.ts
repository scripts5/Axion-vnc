import { LucideIcon } from 'lucide-react';

export interface FeatureItem {
  id: string;
  title: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  status: 'Planejado' | 'Em Modelagem' | 'Em Desenvolvimento' | 'Em Teste Interno';
  statusColor: string;
  highlights: string[];
  iconName: string;
}

export interface RoadmapStep {
  phase: string;
  title: string;
  period: string;
  status: 'Concluído' | 'Em Andamento' | 'Próximo' | 'Futuro';
  description: string;
  items: string[];
}

export interface PillarItem {
  key: 'SITE' | 'APK' | 'BACKEND';
  title: string;
  role: string;
  description: string;
  techStack: string;
  status: string;
  iconName: string;
}

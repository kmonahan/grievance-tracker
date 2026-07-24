import type { ReactNode } from "react";

export type User = {
  id: number;
  is_active: boolean;
  name: string;
};

export type Escalation = {
  id: number;
  date: string;
  step: string;
  status: string;
  date_due: string | null;
  hearing_date: string | null;
  deadline_missed: boolean;
  user: User;
};

export type Grievance = {
  id: number;
  name: string;
  date: string;
  description: string;
  category: string;
  point_person: string;
  secondary?: string | null;
  escalations: Escalation[];
};

export type StepStatus = {
  stepEnum: string;
  stepDisplay: string;
  statusEnum: string;
  statusDisplay: string;
};

export type OptionStyle = {
  backgroundClass: string;
  textClass: string;
  borderClass: string;
  hoverClasses: string;
  iconClass: string;
  selectedClasses: string;
  icon: ReactNode;
  badgeClasses: string;
};

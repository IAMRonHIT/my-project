export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface CarePlanGoal {
  goal_description: string;
  goal_target_date?: string;
  goal_outcomes?: string[];
  goal_rationale?: string;
}

export interface CarePlanIntervention {
  intervention_action: string;
  intervention_rationale?: string;
  intervention_is_pending?: boolean;
}

export interface CarePlanEvaluation {
  evaluation_goal_description_ref: string;
  evaluation_date?: string;
  evaluation_status?: TaskStatus;
  evaluation_evidence?: string;
  evaluation_revision?: string;
  evaluation_rationale?: string;
}

export interface NursingDiagnosis {
  diagnosis_nanda: string;
  diagnosis_related_to?: string;
  diagnosis_evidence?: string[];
  diagnosis_is_risk?: boolean;
  diagnosis_risk_factors?: string[];
  goals: CarePlanGoal[];
  interventions: CarePlanIntervention[];
}

export interface CarePlanDataForKanban {
  nursingDiagnoses?: NursingDiagnosis[];
  evaluations?: CarePlanEvaluation[];
  assessment_subjective_chief_complaint?: string;
  assessment_subjective_hpi?: string;
  assessment_objective_vitals_summary?: string;
  assessment_objective_physical_exam?: string;
  assessment_objective_diagnostics?: string;
}

export interface KanbanEpic {
  id: string;
  title: string;
}

export interface KanbanTask {
  id: string;
  epicId?: string;
  title: string;
  type: 'assessment' | 'intervention' | 'evaluation';
  status: TaskStatus;
  priority: string;
  assignee?: string;
}

export const generateKanbanData = (_data: CarePlanDataForKanban): { epics: KanbanEpic[]; tasks: KanbanTask[] } => {
  return { epics: [], tasks: [] }; // simple stub
};

export const updateTaskStatus = (tasks: KanbanTask[], id: string, status: TaskStatus): KanbanTask[] => {
  return tasks.map(t => t.id === id ? { ...t, status } : t);
};

export const assignTaskToAgent = (tasks: KanbanTask[], id: string, assignee: string): KanbanTask[] => {
  return tasks.map(t => t.id === id ? { ...t, assignee } : t);
};

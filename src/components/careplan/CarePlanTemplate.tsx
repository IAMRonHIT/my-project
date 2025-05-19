import React, { useState, ReactNode, useEffect, useCallback } from 'react';
import {
  Shield, User, Calendar, Activity, FileText, Clock, AlertCircle,
  CheckCircle, X, ChevronDown, ChevronUp, Zap, Info,
  Star, Check, ArrowRight, MessageCircle, Clipboard, BarChart2,
  Settings, Download, RefreshCw, Filter, Bell, FileCheck, Plus, Target, TrendingUp, ListChecks, Edit3, Repeat,
  Link, BookOpen, ImageIcon, PlayCircle, Send, ThumbsUp, ThumbsDown, Archive, AlertTriangle, Loader2, Palette, Users, MessageSquare
} from 'lucide-react';
import KanbanBoard from './KanbanBoard';
import ChatInterface, { ChatMessage } from './ChatInterface';
import ReasoningDisplay, { ReasoningStage } from './ReasoningDisplay';
import {
  generateKanbanData,
  updateTaskStatus as updateTask,
  assignTaskToAgent as assignTask,
  TaskStatus,
  KanbanEpic,
  KanbanTask,
  CarePlanDataForKanban,
  NursingDiagnosis,
  CarePlanIntervention,
  CarePlanGoal,
  CarePlanEvaluation
} from './kanban-helpers';

// --- Data Types ---
type SectionType = 'assessment' | 'diagnosis' | 'implementation' | 'evaluation' | 'sources' | 'kanban' | 'chat' | 'summary_coordination_sources' | 'prior_authorizations';
type ActiveTabType = 'overview' | SectionType;

interface VitalSigns {
  vital_bp?: string;
  vital_pulse?: string;
  vital_resp_rate?: string;
  vital_temp?: string;
  vital_o2sat?: string;
  vital_pain_score?: string;
}

interface PatientData {
  patient_full_name?: string;
  patient_age?: string | number;
  patient_gender?: string;
  patient_mrn?: string;
  patient_dob?: string;
  patient_insurance_plan?: string;
  patient_policy_number?: string;
  patient_primary_provider?: string;
  patient_admission_date?: string;
  allergies?: string[];
  vitalSigns?: VitalSigns;
  nyha_class_description?: string;
}

interface LabResult {
  lab_n_name?: string;
  lab_n_value?: string;
  lab_n_flag?: string;
  lab_n_trend?: string;
}

interface Medication {
  med_n_name?: string;
  med_n_dosage?: string;
  med_n_route?: string;
  med_n_frequency?: string;
  med_n_status?: string;
  med_n_pa_required?: boolean | string;
}

interface Treatment {
  treatment_n_name?: string;
  treatment_n_status?: string;
  treatment_n_details?: string;
  treatment_n_date?: string;
  treatment_n_pa_required?: boolean | string;
}

interface ClinicalData {
  primary_diagnosis_text?: string;
  secondaryDiagnoses?: string[];
  labs?: LabResult[];
  medications?: Medication[];
  treatments?: Treatment[];
  last_imaging_summary?: string;
  last_ecg_summary?: string;
}

interface AgentType {
  name?: string;
  specialty?: string;
  confidenceScore?: number;
  insights?: string[];
  assessmentContribution?: string;
  planningContribution?: string;
  implementationContribution?: string;
  evaluationContribution?: string;
}

interface RecommendedAssessmentItem {
  item: string;
  rationale: string;
  status: 'pending' | 'in_progress' | 'completed' | 'deferred';
}

export interface InterventionType {
  interventionText: string;
  interventionType: 'general' | 'health_teaching' | 'monitoring' | 'psychosocial';
  rationale: string;
}

export interface EvaluationType {
  evaluationText: string;
  evaluationMethod: string;
  evaluationTargetDate?: string;
  evaluationStatus: 'met' | 'partially_met' | 'not_met' | 'ongoing';
}

interface PriorAuthCriterion {
  name?: string; // This seems to be part of pa_n_criteria_met_details now
  met?: boolean | string; // This seems to be part of pa_n_criteria_met_details now
  notes?: string; // This seems to be part of pa_n_criteria_met_details now
}

interface PriorAuthItem {
  pa_n_id?: string;
  pa_n_item_name?: string;
  pa_n_type?: 'Medication' | 'Outpatient Service' | 'Outpatient Procedure' | 'Inpatient Admission Potential';
  pa_n_status?: string;
  pa_n_cpt_code?: string;
  pa_n_description?: string;
  pa_n_pos_code?: string;
  pa_n_units?: string;
  pa_n_dates_of_service?: string;
  pa_n_criteria_met_details?: string; // This will contain text and inline citations like [S1]
  pa_n_estimated_response?: string;
  pa_n_approval_confidence?: string; // Should be number, but schema says string. Will parse.
  // Adding back date fields for simulation logic, prefixed
  pa_n_submitted_date?: string;
  pa_n_approved_date?: string;
  pa_n_expiration_date?: string;
  pa_n_estimated_submission?: string; // This was in the old schema, might be useful for mock
  [key: string]: any; // Keep for flexibility if backend sends extra fields
}

interface SourceData {
  source_n_id?: string;
  source_n_title?: string;
  source_n_type?: string;
  source_n_url?: string;
  source_n_snippet?: string;
  source_n_retrieval_date?: string;
  source_n_agent_source?: string;
  [key: string]: any;
}

export interface CarePlanJsonData {
  patientData?: PatientData;
  clinicalData?: ClinicalData;
  aiAgents?: AgentType[];
  priorAuthItems?: PriorAuthItem[]; // Uses the new PriorAuthItem interface
  sourcesData?: SourceData[]; // Uses the new SourceData interface
  assessment_subjective_chief_complaint?: string;
  assessment_subjective_hpi?: string;
  assessment_subjective_goals?: string;
  assessment_subjective_other?: string;
  assessment_objective_vitals_summary?: string;
  assessment_objective_physical_exam?: string;
  assessment_objective_diagnostics?: string;
  assessment_objective_meds_reviewed?: string;
  assessment_objective_other?: string;
  recommendedAssessmentsList?: RecommendedAssessmentItem[];
  nursingDiagnoses?: {
    diagnosis_nanda: string;
    diagnosis_related_to?: string;
    diagnosis_evidence: string[];
    diagnosis_is_risk?: boolean;
    diagnosis_risk_factors?: string[];
    goals: {
      goal_description: string;
      goal_target_date?: string;
      goal_outcomes: string[];
      goal_rationale?: string;
      interventions: InterventionType[];
      evaluation: EvaluationType;
    }[];
  }[];
  interdisciplinaryPlan?: {
      discipline: string;
      plan_item: string;
  }[];
  overall_plan_summary?: string;
  next_steps: string[];
  notification_title?: string;
  notification_message?: string;
  notification_detail_1?: string;
  notification_detail_2?: string;
}

interface CarePlanTemplateProps {
  data: CarePlanJsonData | null;
  enableSimulations?: boolean;
  sectionReasoning?: { [sectionId: string]: ReasoningStage };
  sectionUiStates?: { [sectionId: string]: { isReady: boolean; displayName: string; } };
  onSectionToggle?: (sectionKey: string) => void;
  expandedSectionsFromParent?: Record<string, boolean>;
}

interface InfoCardProps {
  icon: ReactNode;
  label: string;
  value: string | number | null | undefined;
  color?: string;
}

interface StatusBadgeProps {
  status: string;
}

const randomDate = (start = new Date(2023, 0, 1), end = new Date()) => {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
};

const generateMockCarePlanData = (): CarePlanJsonData => {
  // ... (mock data generation remains the same) ...
  const createMockInterventions = (goalDesc: string, count: number = 20): InterventionType[] => {
    const interventions: InterventionType[] = [];
    const commonActions = [
      "Monitor vital signs q4h and PRN", "Assess pain level using 0-10 scale", "Educate patient on medication purpose, dosage, side effects",
      "Provide emotional support and active listening", "Encourage deep breathing and coughing exercises", "Maintain strict intake and output records",
      "Administer prescribed medications as ordered", "Turn and reposition patient q2h", "Assess for signs of infection",
      "Collaborate with physical therapy for mobility plan", "Consult dietitian for nutritional needs", "Reinforce adherence to treatment plan",
      "Provide comfort measures", "Document patient response to interventions", "Prepare patient for discharge (education, follow-up)"
    ];
    const teachingActions = [
        "Educate on signs and symptoms of worsening condition", "Teach proper medication administration technique", "Review dietary restrictions and recommendations",
        "Instruct on self-monitoring techniques (e.g., daily weights)", "Provide information on community resources"
    ];

    for (let i = 0; i < count; i++) {
      const isHealthTeaching = i >= (count - 5); // Last 5 are health teaching
      const actionList = isHealthTeaching ? teachingActions : commonActions;
      const actionIndex = isHealthTeaching ? i - (count - 5) : i;
      
      interventions.push({
        interventionText: `${actionList[actionIndex % actionList.length]} (for goal: ${goalDesc.substring(0,30)}...)`,
        interventionType: isHealthTeaching ? 'health_teaching' : 'general',
        rationale: `To support achievement of '${goalDesc.substring(0,30)}...' by ${isHealthTeaching ? 'enhancing patient knowledge and self-management skills' : 'providing direct care and monitoring'}. Rationale snippet ${i+1}.`,
      });
    }
    return interventions;
  };

  const createMockEvaluation = (goalDesc: string): EvaluationType => {
    const statuses: EvaluationType['evaluationStatus'][] = ['met', 'partially_met', 'not_met', 'ongoing'];
    return {
      evaluationText: `Assess patient's progress towards: ${goalDesc.substring(0,50)}...`,
      evaluationMethod: "Patient report, observation, and review of vital signs/lab data.",
      evaluationTargetDate: randomDate(new Date(Date.now() + 86400000 * 7), new Date(Date.now() + 86400000 * 14)),
      evaluationStatus: statuses[Math.floor(Math.random() * statuses.length)],
    };
  };
  
  const createGoals = (numGoals: number, diagnosisName: string) => {
    const goals = [];
    for (let i = 0; i < numGoals; i++) {
      const goalDesc = `Patient will demonstrate understanding of ${diagnosisName.toLowerCase()} management by ${randomDate(new Date(Date.now() + 86400000 * (i+1)))}. Goal ${i+1}.`;
      goals.push({
        goal_description: goalDesc,
        goal_target_date: randomDate(new Date(Date.now() + 86400000 * (i+2)), new Date(Date.now() + 86400000 * (i+7))),
        goal_outcomes: [
          `Outcome 1 for goal ${i+1} (e.g., verbalizes 3 key self-care strategies).`,
          `Outcome 2 for goal ${i+1} (e.g., demonstrates correct technique for X).`,
          `Outcome 3 for goal ${i+1} (e.g., identifies 2 reportable symptoms).`,
        ],
        goal_rationale: `This goal is crucial for ${diagnosisName.toLowerCase()} because it empowers the patient towards self-management and reduces risk of readmission. Rationale ${i+1}.`,
        interventions: createMockInterventions(goalDesc, 20), // 15 general, 5 health teaching
        evaluation: createMockEvaluation(goalDesc), 
      });
    }
    return goals;
  };
  
  const diagnosisNames = [
    "Fluid Volume Excess", "Activity Intolerance", "Ineffective Airway Clearance", "Anxiety", "Risk for Impaired Skin Integrity"
  ];

  const assessmentStatuses: RecommendedAssessmentItem['status'][] = ['pending', 'in_progress', 'completed', 'deferred'];
  const mockRecommendedAssessments: RecommendedAssessmentItem[] = Array.from({ length: 10 }, (_, i) => ({
    item: `Recommended Assessment Item ${i + 1} (e.g., Daily weight monitoring)`,
    rationale: `Rationale for assessment ${i + 1}: To monitor fluid status and early signs of decompensation.`,
    status: assessmentStatuses[Math.floor(Math.random() * assessmentStatuses.length)],
  }));

  return {
    patientData: {
      patient_full_name: "Sarah Connor", patient_age: 45, patient_gender: "Female", patient_mrn: "MRN789012", patient_dob: "1979-05-10",
      patient_insurance_plan: "United HealthCare PPO", patient_policy_number: "UHC123456789", patient_primary_provider: "Dr. Eliza Marcus",
      patient_admission_date: randomDate(new Date(2024, 0, 1)), allergies: ["Penicillin (Rash)", "Shellfish (Anaphylaxis)"],
      vitalSigns: { vital_bp: "122/78 mmHg", vital_pulse: "72 bpm", vital_resp_rate: "16/min", vital_temp: "37.0°C", vital_o2sat: "98%", vital_pain_score: "2/10" },
      nyha_class_description: "NYHA Class II (Mild symptoms)",
    },
    clinicalData: {
      primary_diagnosis_text: "Congestive Heart Failure, exacerbation",
      secondaryDiagnoses: ["Hypertension", "Type 2 Diabetes Mellitus"],
      labs: [
        { lab_n_name: "BNP", lab_n_value: "450 pg/mL", lab_n_flag: "HIGH", lab_n_trend: "increasing" },
        { lab_n_name: "Potassium", lab_n_value: "3.8 mEq/L", lab_n_flag: "NORMAL", lab_n_trend: "stable" },
      ],
      medications: [
        { med_n_name: "Lisinopril", med_n_dosage: "10mg", med_n_route: "PO", med_n_frequency: "Daily", med_n_status: "Active", med_n_pa_required: false },
        { med_n_name: "Entresto", med_n_dosage: "49/51mg", med_n_route: "PO", med_n_frequency: "BID", med_n_status: "Pending Submission", med_n_pa_required: true },
      ],
      treatments: [
        { treatment_n_name: "Cardiac Diet Education", treatment_n_status: "Scheduled", treatment_n_details: "Consult with dietitian", treatment_n_date: randomDate(), treatment_n_pa_required: false },
        { treatment_n_name: "Echocardiogram", treatment_n_status: "Pending Submission", treatment_n_details: "Assess LV function", treatment_n_date: randomDate(new Date(Date.now() + 86400000*2)), treatment_n_pa_required: true },
      ],
      last_imaging_summary: "Chest X-ray (2024-01-15): Mild pulmonary congestion, consistent with CHF.",
      last_ecg_summary: "ECG (2024-01-15): Normal Sinus Rhythm, LVH noted.",
    },
    aiAgents: [
      { name: "Clinical Insight Agent", specialty: "Cardiology Focus", confidenceScore: 0.92, assessmentContribution: "Suggests monitoring fluid balance closely due to CHF exacerbation and potential impact of comorbidities. Review NYHA classification.", planningContribution: "Confirms CHF as primary, highlights risk of renal impairment with diuretics. Suggests NANDA diagnoses related to fluid balance and activity. Recommends daily weights, strict I/O monitoring.", implementationContribution: "Flags potential Lisinopril-Furosemide interaction (monitor potassium). Suggests specific patient education points for CHF self-management.", evaluationContribution: "Advises reassessment of NYHA class post-diuresis and evaluation of patient's understanding of discharge medications.", insights: ["BNP trend indicates response to initial therapy may be slow.", "Consider echocardiogram if symptoms worsen despite treatment."] },
      { name: "Authorization & Benefits Agent", specialty: "Prior Auth & Formulary Compliance", confidenceScore: 0.85, planningContribution: "Identified Entresto as requiring PA; initiated process. Verified formulary status and co-pay estimation.", implementationContribution: "Prepared documentation packet for Entresto PA submission, including relevant clinical notes and lab values.", insights: ["Entresto PA typically requires documentation of Lisinopril trial/failure or intolerance. Expedited review possible with peer-to-peer.", "Alternative ARNI, Sacubitril/Valsartan, may have similar PA requirements. Estimated approval timeline for Entresto is 3-5 days."] },
      { name: "Discharge Coordination Agent", specialty: "Continuity of Care & Readmission Prevention", confidenceScore: 0.78, planningContribution: "Suggests home health referral for medication management and CHF education post-discharge. Identifies need for follow-up PCP appointment within 7 days.", evaluationContribution: "Recommends assessing patient's ability to obtain medications and transportation for follow-up. Confirms DME needs (e.g., walker, scale).", insights: ["Patient has strong family support, which is beneficial for home care. Identified local pharmacy for medication synchronization.", "Flagged patient for telephonic follow-up 48 hours post-discharge by care manager to address any early issues."] }
    ],
    recommendedAssessmentsList: mockRecommendedAssessments,
    priorAuthItems: [
      { 
        pa_n_id: "PA-RX-001", 
        pa_n_item_name: "Entresto 49/51mg", 
        pa_n_type: "Medication", 
        pa_n_status: "Pending Submission", 
        pa_n_cpt_code: "J0123 (example NDC)", 
        pa_n_description: "Sacubitril/valsartan for HFrEF",
        pa_n_pos_code: "11", // Office
        pa_n_units: "60 tablets",
        pa_n_dates_of_service: `${randomDate()} - ${randomDate(new Date(Date.now() + 30 * 86400000))}`,
        pa_n_criteria_met_details: "Patient has symptomatic HFrEF with LVEF < 40% on recent echo [S2]. Currently on Lisinopril, but per guidelines [S1], Entresto is preferred for further risk reduction. Meets payer criteria for ACEi trial.",
        pa_n_estimated_response: "3-5 business days", 
        pa_n_approval_confidence: "0.75"
      },
      { 
        pa_n_id: "PA-OUTPT-001", 
        pa_n_item_name: "Echocardiogram, complete", 
        pa_n_type: "Outpatient Procedure", 
        pa_n_status: "Requires Submission", 
        pa_n_cpt_code: "93306",
        pa_n_description: "Comprehensive echocardiogram to assess LV function and valvular status.",
        pa_n_pos_code: "22", // Outpatient Hospital
        pa_n_units: "1 procedure",
        pa_n_dates_of_service: randomDate(new Date(Date.now() + 2 * 86400000)),
        pa_n_criteria_met_details: "Patient presenting with CHF exacerbation symptoms (dyspnea, edema) [S2]. Necessary to evaluate current cardiac function to guide therapy adjustments as per AHA/ACC guidelines [S1].",
        pa_n_estimated_response: "1-2 business days", 
        pa_n_approval_confidence: "0.90" 
      },
      // Add 3 more outpatient and 1 inpatient potential mock PAs
      {
        pa_n_id: "PA-OUTPT-002",
        pa_n_item_name: "Cardiac Rehabilitation Program",
        pa_n_type: "Outpatient Service",
        pa_n_status: "Pending Review",
        pa_n_cpt_code: "93798",
        pa_n_description: "Physician-supervised cardiac rehabilitation program, 36 sessions.",
        pa_n_pos_code: "22",
        pa_n_units: "36 sessions",
        pa_n_dates_of_service: `${randomDate(new Date(Date.now() + 7 * 86400000))} - ${randomDate(new Date(Date.now() + 90 * 86400000))}`,
        pa_n_criteria_met_details: "Post-CHF exacerbation, to improve functional capacity and reduce readmission risk [S1, S3]. Patient motivated.",
        pa_n_estimated_response: "5-7 business days",
        pa_n_approval_confidence: "0.80"
      },
      {
        pa_n_id: "PA-OUTPT-003",
        pa_n_item_name: "Sleep Study (Polysomnography)",
        pa_n_type: "Outpatient Procedure", // Changed to "Outpatient Procedure"
        pa_n_status: "Requires Submission",
        pa_n_cpt_code: "95810",
        pa_n_description: "Overnight sleep study to evaluate for obstructive sleep apnea, a common cocat > src/components/careplan/CarePlanTemplate.tsx<<'EOF'
import React, { useState, ReactNode, useEffect, useCallback } from 'react';
import {
  Shield, User, Clock, AlertCircle, ChevronDown, ChevronUp, MessageSquare, BarChart2
} from 'lucide-react';
import KanbanBoard, { KanbanEpic, KanbanTask, TaskStatus } from './KanbanBoard';
import ChatInterface, { ChatMessage } from './ChatInterface';
import ReasoningDisplay, { ReasoningStage } from './ReasoningDisplay';
import {
  generateKanbanData,
  updateTaskStatus as updateTask,
  assignTaskToAgent as assignTask,
  CarePlanDataForKanban,
  NursingDiagnosis,
} from './kanban-helpers';

export interface CarePlanJsonData {
  patientData?: {
    patient_full_name?: string;
    patient_age?: number;
    patient_gender?: string;
    patient_mrn?: string;
    patient_admission_date?: string;
    allergies?: string[];
  };
  clinicalData?: {
    primary_diagnosis_text?: string;
  };
  aiAgents?: { name?: string; specialty?: string; confidenceScore?: number; insights?: string[] }[];
  priorAuthItems?: { pa_n_id?: string; pa_n_item_name?: string; pa_n_status?: string }[];
}

interface CarePlanTemplateProps {
  data: CarePlanJsonData | null;
}

const Section: React.FC<{ title: string; children: ReactNode }> = ({ title, children }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="mb-6 border border-slate-700 rounded">
      <button onClick={() => setOpen(!open)} className="w-full flex justify-between items-center bg-slate-800 px-4 py-2">
        <span className="font-semibold text-slate-100">{title}</span>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {open && <div className="p-4 bg-slate-900">{children}</div>}
    </div>
  );
};

const CarePlanTemplate: React.FC<CarePlanTemplateProps> = ({ data }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [epics, setEpics] = useState<KanbanEpic[]>([]);
  const [tasks, setTasks] = useState<KanbanTask[]>([]);

  useEffect(() => {
    if (data) {
      const kanban: CarePlanDataForKanban = { nursingDiagnoses: [] as NursingDiagnosis[] };
      const { epics: e, tasks: t } = generateKanbanData(kanban);
      setEpics(e);
      setTasks(t);
    }
  }, [data]);

  const updateStatus = (id: string, status: TaskStatus) => {
    setTasks(prev => updateTask(prev, id, status));
  };

  const assign = (id: string, assignee: string) => {
    setTasks(prev => assignTask(prev, id, assignee));
  };

  const sendMessage = (m: string) => {
    const msg: ChatMessage = { id: String(Date.now()), role: 'user', content: m };
    setMessages(prev => [...prev, msg, { id: msg.id + '-r', role: 'assistant', content: `Echo: ${m}` }]);
  };

  if (!data) return <div>No data</div>;
  const { patientData = {}, clinicalData = {} } = data;

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 p-4 rounded border border-slate-700">
        <h2 className="text-xl font-bold text-slate-100">{patientData.patient_full_name}</h2>
        <p className="text-sm text-slate-400">MRN: {patientData.patient_mrn}</p>
        <p className="text-sm text-slate-400">Diagnosis: {clinicalData.primary_diagnosis_text}</p>
      </div>

      <Section title="Chat with Ron AI">
        <ChatInterface messages={messages} onSendMessage={sendMessage} />
      </Section>

      <Section title="Task Board">
        <KanbanBoard tasks={tasks} epics={epics} onTaskStatusChange={updateStatus} onTaskAssign={assign} />
      </Section>

      <Section title="AI Agents">
        {data.aiAgents?.map((a, i) => (
          <div key={i} className="mb-2 p-2 bg-slate-800 rounded">
            <div className="font-semibold text-slate-100">{a.name}</div>
            <div className="text-xs text-slate-400">{a.specialty} ({Math.round((a.confidenceScore || 0) * 100)}%)</div>
            <ul className="list-disc list-inside text-sm text-slate-300 mt-1">
              {a.insights?.map((ins, j) => <li key={j}>{ins}</li>)}
            </ul>
          </div>
        )) || <div>No agents</div>}
      </Section>

      <Section title="Prior Authorizations">
        {data.priorAuthItems?.map((pa, i) => (
          <div key={i} className="mb-2 p-2 bg-slate-800 rounded">
            <div className="font-semibold text-slate-100">{pa.pa_n_item_name}</div>
            <div className="text-xs text-slate-400">Status: {pa.pa_n_status}</div>
          </div>
        )) || <div>No PA items</div>}
      </Section>
    </div>
  );
};

export default CarePlanTemplate;

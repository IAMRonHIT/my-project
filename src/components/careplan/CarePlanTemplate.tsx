import React, { useState, ReactNode, useEffect } from 'react';
import {
  ChevronDown, ChevronUp
} from 'lucide-react';
import KanbanBoard, { KanbanEpic, KanbanTask, TaskStatus } from './KanbanBoard';
import ChatInterface, { ChatMessage } from './ChatInterface';
import {
  generateKanbanData,
  updateTaskStatus as updateTask,
  assignTaskToAgent as assignTask,
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
      const { epics: e, tasks: t } = generateKanbanData();
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

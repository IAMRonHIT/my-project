import React from 'react';

export interface ReasoningStage {
  title: string;
  text: string;
  isComplete?: boolean;
  isLoading?: boolean;
}

interface ReasoningDisplayProps {
  reasoningStages: ReasoningStage[];
  overallIsLoading?: boolean;
}

const ReasoningDisplay: React.FC<ReasoningDisplayProps> = ({ reasoningStages }) => {
  return (
    <div className="space-y-2">
      {reasoningStages.map((stage, idx) => (
        <div key={idx} className="bg-slate-900 p-3 rounded border border-slate-700">
          <div className="font-semibold text-slate-100">{stage.title}</div>
          <div className="text-sm text-slate-300">{stage.text}</div>
        </div>
      ))}
    </div>
  );
};

export default ReasoningDisplay;

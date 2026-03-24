import { User, ArrowRight } from "lucide-react";

export interface VoteRecord {
  id: string;
  voterName: string;
  candidateName: string;
  timestamp: Date;
}

interface VoterLogProps {
  records: VoteRecord[];
}

const VoterLog = ({ records }: VoterLogProps) => {
  if (records.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <User className="w-12 h-12 mx-auto mb-3 opacity-40" />
        <p>No votes cast yet. Be the first to vote!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
      {records.map((record) => (
        <div
          key={record.id}
          className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border"
        >
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
            <User className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-medium text-sm text-foreground">{record.voterName}</span>
          <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
          <span className="font-semibold text-sm text-accent">{record.candidateName}</span>
          <span className="ml-auto text-xs text-muted-foreground whitespace-nowrap">
            {record.timestamp.toLocaleTimeString()}
          </span>
        </div>
      ))}
    </div>
  );
};

export default VoterLog;

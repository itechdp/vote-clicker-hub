import { CheckCircle } from "lucide-react";

interface CandidateCardProps {
  id: string;
  name: string;
  party: string;
  image: string;
  votes: number;
  isSelected: boolean;
  hasVoted: boolean;
  onVote: (id: string) => void;
}

const CandidateCard = ({ id, name, party, image, votes, isSelected, hasVoted, onVote }: CandidateCardProps) => {
  return (
    <div
      className={`vote-card bg-card p-4 ${isSelected ? "voted" : ""} ${hasVoted && !isSelected ? "opacity-60" : ""}`}
      onClick={() => !hasVoted && onVote(id)}
    >
      {isSelected && (
        <div className="absolute top-3 right-3 z-10">
          <CheckCircle className="w-8 h-8 text-accent fill-accent/20" />
        </div>
      )}
      <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-4">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          width={512}
          height={512}
        />
        {isSelected && (
          <div className="absolute inset-0 bg-accent/10 backdrop-blur-[1px]" />
        )}
      </div>
      <h3 className="text-lg font-bold text-card-foreground">{name}</h3>
      <p className="text-sm text-muted-foreground mb-2">{party}</p>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-accent">{votes}</span>
        <span className="text-xs text-muted-foreground uppercase tracking-wider">votes</span>
      </div>
    </div>
  );
};

export default CandidateCard;

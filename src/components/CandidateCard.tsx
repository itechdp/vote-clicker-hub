import { Check } from "lucide-react";

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

const CandidateCard = ({
  id,
  name,
  party,
  image,
  votes,
  isSelected,
  hasVoted,
  onVote,
}: CandidateCardProps) => {
  const disabled = hasVoted && !isSelected;

  return (
    <div
      onClick={() => !disabled && onVote(id)}
      className={[
        "relative bg-white rounded-2xl overflow-hidden border-2 transition-all duration-200 group select-none",
        disabled
          ? "opacity-45 cursor-not-allowed pointer-events-none"
          : "cursor-pointer",
        isSelected
          ? "border-red-500 shadow-xl shadow-red-500/10 ring-2 ring-red-500/10"
          : !disabled
          ? "border-slate-200 hover:border-slate-300 hover:shadow-lg hover:-translate-y-0.5"
          : "border-slate-200",
      ].join(" ")}
    >
      {/* ── Selection badge ── */}
      {isSelected && (
        <div className="absolute top-2.5 right-2.5 z-10 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center shadow-md">
          <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
        </div>
      )}

      {/* ── Photo ── */}
      <div className="aspect-[4/3] overflow-hidden bg-slate-100 relative">
        <img
          src={image}
          alt={name}
          className={[
            "w-full h-full object-cover object-top transition-transform duration-500",
            !disabled ? "group-hover:scale-[1.04]" : "",
          ].join(" ")}
        />
        {isSelected && (
          <div className="absolute inset-0 bg-red-600/8" />
        )}
      </div>

      {/* ── Info ── */}
      <div className={`p-4 border-t ${isSelected ? "border-red-100 bg-gradient-to-b from-red-50/60 to-white" : "border-slate-100"}`}>
        <h3 className="font-bold text-slate-900 text-sm leading-tight truncate">{name}</h3>
        <p className="text-[11px] text-slate-500 mt-0.5 truncate">{party}</p>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
          <div className="flex items-baseline gap-1">
            <span className={`text-[22px] font-bold tabular-nums leading-none ${isSelected ? "text-red-600" : "text-slate-800"}`}>
              {votes}
            </span>
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">votes</span>
          </div>

          {isSelected ? (
            <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
              Selected
            </span>
          ) : !hasVoted ? (
            <span className="text-[10px] text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
              Click to select
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;

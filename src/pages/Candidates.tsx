import { useState, useCallback } from "react";
import {
  Vote,
  RotateCcw,
  CheckCircle2,
  UserPlus,
  Info,
  Sparkles,
} from "lucide-react";
import { useVoting } from "@/context/VotingContext";
import CandidateCard from "@/components/CandidateCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const C = ["#dc2626", "#1d4ed8", "#d97706", "#16a34a"];

export default function Candidates() {
  const { candidates, castVote } = useVoting();

  const [voterName, setVoterName]       = useState("");
  const [selectedId, setSelectedId]     = useState<string | null>(null);
  const [hasVoted, setHasVoted]         = useState(false);
  const [votedFor, setVotedFor]         = useState<string | null>(null);

  const handleSelect = useCallback(
    (id: string) => { if (!hasVoted) setSelectedId(id); },
    [hasVoted],
  );

  const handleCast = () => {
    if (!voterName.trim()) { toast.error("Please enter your name before voting"); return; }
    if (!selectedId)       { toast.error("Please select a candidate first"); return; }
    const c = candidates.find((c) => c.id === selectedId)!;
    castVote(voterName, selectedId);
    setVotedFor(c.name);
    setHasVoted(true);
    toast.success(`Vote successfully cast for ${c.name}!`);
  };

  const handleReset = () => {
    setVoterName(""); setSelectedId(null); setHasVoted(false); setVotedFor(null);
  };

  const selectedObj  = candidates.find((c) => c.id === selectedId);
  const selectedIdx  = selectedObj ? candidates.indexOf(selectedObj) : -1;
  const totalVotes   = candidates.reduce((s, c) => s + c.votes, 0);

  return (
    <div className="px-6 lg:px-8 py-7 space-y-6 max-w-[1440px] mx-auto">

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Candidates</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Select a candidate and submit your vote for the 2026 General Election
          </p>
        </div>
        <span className="text-[11px] font-semibold text-slate-500 border border-slate-200 bg-white rounded-full px-3 py-1.5 self-start sm:self-auto">
          4 candidates running · {totalVotes} votes cast
        </span>
      </div>

      {/* ── Success banner ── */}
      {hasVoted && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <div className="w-10 h-10 bg-emerald-100 border border-emerald-200 rounded-xl flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-emerald-800 text-[15px]">Vote recorded successfully!</p>
            <p className="text-emerald-600 text-sm mt-0.5">
              <span className="font-semibold">{voterName}</span>
              {" → "}
              <span className="font-semibold">{votedFor}</span>
            </p>
          </div>
          <Button
            onClick={handleReset}
            variant="outline"
            className="gap-2 shrink-0 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300"
          >
            <RotateCcw className="w-4 h-4" />
            Another Voter
          </Button>
        </div>
      )}

      {/* ── Voter form ── */}
      {!hasVoted && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.05)] p-6">
          <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-4">
            <UserPlus className="w-4 h-4 text-red-500" />
            Voter Information
          </h2>

          <div className="flex flex-col sm:flex-row items-end gap-3">
            <div className="flex-1 w-full">
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Enter your full name..."
                value={voterName}
                onChange={(e) => setVoterName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCast()}
                className="border-slate-200 focus-visible:ring-red-500/30 focus-visible:border-red-400 text-slate-800"
              />
            </div>
            <Button
              onClick={handleCast}
              disabled={!selectedId || !voterName.trim()}
              className="gap-2 bg-red-600 text-white hover:bg-red-700 disabled:opacity-40 shrink-0 px-5 shadow-sm shadow-red-600/20"
            >
              <Vote className="w-4 h-4" />
              Cast Vote
            </Button>
          </div>

          {/* Inline status hint */}
          <p className="flex items-center gap-1.5 mt-3 text-xs">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {selectedObj && voterName.trim() ? (
              <span className="text-emerald-600 font-medium">
                Ready to vote for{" "}
                <span className="font-bold" style={{ color: C[selectedIdx] }}>
                  {selectedObj.name}
                </span>{" "}
                — click <strong>Cast Vote</strong> to confirm
              </span>
            ) : !selectedId ? (
              <span className="text-slate-400">
                Select a candidate below, then enter your name to vote
              </span>
            ) : (
              <span className="text-slate-400">
                Enter your name above to proceed
              </span>
            )}
          </p>
        </div>
      )}

      {/* ── Candidate grid ── */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-slate-400" />
          <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.12em]">
            {hasVoted ? "Election Candidates" : "Choose Your Candidate"}
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-5">
          {candidates.map((c) => (
            <CandidateCard
              key={c.id}
              {...c}
              isSelected={selectedId === c.id}
              hasVoted={hasVoted}
              onVote={handleSelect}
            />
          ))}
        </div>
      </div>

      {/* ── Footer info ── */}
      <div className="bg-[#0f172a] rounded-2xl px-6 py-5 flex items-start gap-3.5">
        <Vote className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-white text-[13px] font-semibold">2026 General Election</p>
          <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">
            Your vote is securely recorded. Each session allows one vote per voter name.
          </p>
        </div>
      </div>

    </div>
  );
}

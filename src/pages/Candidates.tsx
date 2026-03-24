import { useState, useCallback } from "react";
import {
  Vote,
  Users,
  RotateCcw,
  CheckCircle2,
  UserPlus,
  ArrowRight,
} from "lucide-react";
import { useVoting } from "@/context/VotingContext";
import CandidateCard from "@/components/CandidateCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const COLORS = ["#dc2626", "#1e40af", "#d97706", "#16a34a"];

export default function Candidates() {
  const { candidates, castVote } = useVoting();
  const [voterName, setVoterName] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [votedFor, setVotedFor] = useState<string | null>(null);

  const handleSelect = useCallback(
    (id: string) => {
      if (hasVoted) return;
      setSelectedCandidate(id);
    },
    [hasVoted],
  );

  const handleCastVote = () => {
    if (!voterName.trim()) {
      toast.error("Please enter your name before voting");
      return;
    }
    if (!selectedCandidate) {
      toast.error("Please select a candidate first");
      return;
    }
    const candidate = candidates.find((c) => c.id === selectedCandidate)!;
    castVote(voterName, selectedCandidate);
    setVotedFor(candidate.name);
    setHasVoted(true);
    toast.success(`Vote cast for ${candidate.name}!`);
  };

  const handleReset = () => {
    setVoterName("");
    setSelectedCandidate(null);
    setHasVoted(false);
    setVotedFor(null);
  };

  const selectedCandidateObj = candidates.find((c) => c.id === selectedCandidate);
  const selectedIdx = selectedCandidateObj
    ? candidates.indexOf(selectedCandidateObj)
    : -1;

  return (
    <div className="p-6 lg:p-8 space-y-7 max-w-[1400px] mx-auto">
      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-2">
            <Users className="w-7 h-7 text-accent" />
            Candidates
          </h1>
          <p className="text-muted-foreground mt-0.5 text-sm">
            Select a candidate and submit your vote for the 2026 General Election
          </p>
        </div>
        <div className="text-sm font-semibold text-muted-foreground border border-border rounded-full px-3 py-1.5">
          {candidates.length} candidates running
        </div>
      </div>

      {/* ── Vote success banner ── */}
      {hasVoted && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-green-100 border border-green-200 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-black text-green-800">Vote recorded successfully!</p>
            <p className="text-green-600 text-sm mt-0.5">
              <span className="font-semibold">{voterName}</span> voted for{" "}
              <span className="font-semibold">{votedFor}</span>
            </p>
          </div>
          <Button
            onClick={handleReset}
            variant="outline"
            className="gap-2 shrink-0 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300"
          >
            <RotateCcw className="w-4 h-4" />
            Another Voter
          </Button>
        </div>
      )}

      {/* ── Voter input card ── */}
      {!hasVoted && (
        <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-accent" />
            Voter Information
          </h2>
          <div className="flex flex-col sm:flex-row items-end gap-4">
            <div className="flex-1 w-full">
              <label className="text-sm font-semibold text-foreground mb-1.5 block">
                Full Name <span className="text-accent">*</span>
              </label>
              <Input
                placeholder="Enter your full name to vote..."
                value={voterName}
                onChange={(e) => setVoterName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCastVote()}
                className="text-base"
              />
            </div>
            <Button
              onClick={handleCastVote}
              disabled={!selectedCandidate || !voterName.trim()}
              className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90 px-6 shrink-0"
            >
              <Vote className="w-4 h-4" />
              Cast Vote
            </Button>
          </div>

          {/* Status hint */}
          <div className="mt-3">
            {selectedCandidateObj && voterName.trim() ? (
              <p className="text-sm text-green-600 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Ready to vote for{" "}
                <span
                  className="font-bold"
                  style={{ color: COLORS[selectedIdx] ?? undefined }}
                >
                  {selectedCandidateObj.name}
                </span>
                — click "Cast Vote" to confirm
              </p>
            ) : !selectedCandidate ? (
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <ArrowRight className="w-4 h-4" />
                Select a candidate from the cards below to continue
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Enter your name above to proceed
              </p>
            )}
          </div>
        </section>
      )}

      {/* ── Candidate cards ── */}
      <section>
        <h2 className="text-xl font-bold text-foreground mb-5">
          {hasVoted ? "Election Candidates" : "Select Your Candidate"}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {candidates.map((c) => (
            <CandidateCard
              key={c.id}
              {...c}
              isSelected={selectedCandidate === c.id}
              hasVoted={hasVoted}
              onVote={handleSelect}
            />
          ))}
        </div>
      </section>

      {/* ── Election info strip ── */}
      <div className="election-gradient rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Vote className="w-8 h-8 text-white/50 shrink-0" />
        <div>
          <p className="text-white font-bold text-sm">2026 General Election</p>
          <p className="text-white/50 text-xs mt-0.5">
            Your vote is anonymous and securely recorded. Each person may cast one vote
            per session.
          </p>
        </div>
      </div>
    </div>
  );
}

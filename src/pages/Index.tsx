import { useState, useCallback } from "react";
import { Vote, BarChart3, Users, RotateCcw } from "lucide-react";
import CandidateCard from "@/components/CandidateCard";
import ResultsChart from "@/components/ResultsChart";
import VoterLog, { VoteRecord } from "@/components/VoterLog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import candidate1 from "@/assets/candidate1.jpg";
import candidate2 from "@/assets/candidate2.jpg";
import candidate3 from "@/assets/candidate3.jpg";
import candidate4 from "@/assets/candidate4.jpg";

const INITIAL_CANDIDATES = [
  { id: "1", name: "Robert Martinez", party: "Progressive Alliance", image: candidate1, votes: 0 },
  { id: "2", name: "Elena Fischer", party: "Democratic Front", image: candidate2, votes: 0 },
  { id: "3", name: "James Carter", party: "Unity Party", image: candidate3, votes: 0 },
  { id: "4", name: "William Hughes", party: "Reform Coalition", image: candidate4, votes: 0 },
];

const Index = () => {
  const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);
  const [voterName, setVoterName] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [voteRecords, setVoteRecords] = useState<VoteRecord[]>([]);
  const [hasVoted, setHasVoted] = useState(false);

  const handleSelectCandidate = useCallback((id: string) => {
    if (hasVoted) return;
    setSelectedCandidate(id);
  }, [hasVoted]);

  const handleCastVote = () => {
    if (!voterName.trim()) {
      toast.error("Please enter your name before voting");
      return;
    }
    if (!selectedCandidate) {
      toast.error("Please select a candidate");
      return;
    }

    const candidate = candidates.find((c) => c.id === selectedCandidate)!;

    setCandidates((prev) =>
      prev.map((c) => (c.id === selectedCandidate ? { ...c, votes: c.votes + 1 } : c))
    );

    setVoteRecords((prev) => [
      {
        id: crypto.randomUUID(),
        voterName: voterName.trim(),
        candidateName: candidate.name,
        timestamp: new Date(),
      },
      ...prev,
    ]);

    setHasVoted(true);
    toast.success(`Vote cast for ${candidate.name}!`);
  };

  const handleReset = () => {
    setVoterName("");
    setSelectedCandidate(null);
    setHasVoted(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="election-gradient py-8 px-4">
        <div className="container max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Vote className="w-8 h-8 text-accent" />
            <h1 className="text-3xl md:text-4xl font-black text-primary-foreground tracking-tight">
              Election Portal 2026
            </h1>
          </div>
          <p className="text-primary-foreground/70 text-lg">Cast your vote. Shape the future.</p>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-8 space-y-10">
        {/* Voter Input */}
        <section className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 w-full">
              <label className="text-sm font-semibold text-foreground mb-1.5 block">Your Name</label>
              <Input
                placeholder="Enter your name to vote..."
                value={voterName}
                onChange={(e) => setVoterName(e.target.value)}
                disabled={hasVoted}
                className="text-base"
              />
            </div>
            {hasVoted ? (
              <Button onClick={handleReset} variant="outline" className="mt-auto gap-2">
                <RotateCcw className="w-4 h-4" /> Vote as Another User
              </Button>
            ) : (
              <Button
                onClick={handleCastVote}
                disabled={!selectedCandidate || !voterName.trim()}
                className="mt-auto gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <Vote className="w-4 h-4" /> Cast Vote
              </Button>
            )}
          </div>
        </section>

        {/* Candidates */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-accent" /> Candidates
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {candidates.map((candidate) => (
              <CandidateCard
                key={candidate.id}
                {...candidate}
                isSelected={selectedCandidate === candidate.id}
                hasVoted={hasVoted}
                onVote={handleSelectCandidate}
              />
            ))}
          </div>
        </section>

        {/* Dashboard */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Results */}
          <section className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <h2 className="text-xl font-bold text-foreground mb-5 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-accent" /> Live Results
            </h2>
            <ResultsChart candidates={candidates} />
          </section>

          {/* Voter Log */}
          <section className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <h2 className="text-xl font-bold text-foreground mb-5 flex items-center gap-2">
              <Users className="w-5 h-5 text-accent" /> Vote Log
            </h2>
            <VoterLog records={voteRecords} />
          </section>
        </div>
      </main>
    </div>
  );
};

export default Index;

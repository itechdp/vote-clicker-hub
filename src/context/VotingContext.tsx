import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import type { VoteRecord } from "@/components/VoterLog";
import candidate1 from "@/assets/candidate1.jpg";
import candidate2 from "@/assets/candidate2.jpg";
import candidate3 from "@/assets/candidate3.jpg";
import candidate4 from "@/assets/candidate4.jpg";

export interface Candidate {
  id: string;
  name: string;
  party: string;
  image: string;
  votes: number;
}

interface VotingContextType {
  candidates: Candidate[];
  voteRecords: VoteRecord[];
  castVote: (voterName: string, candidateId: string) => void;
}

const VotingContext = createContext<VotingContextType | null>(null);

export const useVoting = () => {
  const ctx = useContext(VotingContext);
  if (!ctx) throw new Error("useVoting must be used within VotingProvider");
  return ctx;
};

const INITIAL_CANDIDATES: Candidate[] = [
  { id: "1", name: "Robert Martinez", party: "Progressive Alliance", image: candidate1, votes: 0 },
  { id: "2", name: "Elena Fischer",   party: "Democratic Front",    image: candidate2, votes: 0 },
  { id: "3", name: "James Carter",    party: "Unity Party",         image: candidate3, votes: 0 },
  { id: "4", name: "William Hughes",  party: "Reform Coalition",    image: candidate4, votes: 0 },
];

export const VotingProvider = ({ children }: { children: ReactNode }) => {
  const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES);
  const [voteRecords, setVoteRecords] = useState<VoteRecord[]>([]);

  const castVote = useCallback(
    (voterName: string, candidateId: string) => {
      const candidate = candidates.find((c) => c.id === candidateId);
      if (!candidate) return;

      setCandidates((prev) =>
        prev.map((c) => (c.id === candidateId ? { ...c, votes: c.votes + 1 } : c)),
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
    },
    [candidates],
  );

  return (
    <VotingContext.Provider value={{ candidates, voteRecords, castVote }}>
      {children}
    </VotingContext.Provider>
  );
};

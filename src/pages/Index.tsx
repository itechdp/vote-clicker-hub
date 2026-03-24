import { useState, useCallback } from "react";
import {
  Vote,
  BarChart3,
  Users,
  RotateCcw,
  Trophy,
  Activity,
  Shield,
  CheckCircle2,
} from "lucide-react";
import CandidateCard from "@/components/CandidateCard";
import VoterLog, { VoteRecord } from "@/components/VoterLog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import candidate1 from "@/assets/candidate1.jpg";
import candidate2 from "@/assets/candidate2.jpg";
import candidate3 from "@/assets/candidate3.jpg";
import candidate4 from "@/assets/candidate4.jpg";

const CANDIDATE_COLORS = ["#dc2626", "#1e40af", "#d97706", "#16a34a"];

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

  const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0);
  const leader = [...candidates].sort((a, b) => b.votes - a.votes)[0];

  const handleSelectCandidate = useCallback(
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
      toast.error("Please select a candidate");
      return;
    }
    const candidate = candidates.find((c) => c.id === selectedCandidate)!;
    setCandidates((prev) =>
      prev.map((c) => (c.id === selectedCandidate ? { ...c, votes: c.votes + 1 } : c)),
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

  const barData = candidates.map((c, i) => ({
    name: c.name.split(" ").slice(-1)[0],
    fullName: c.name,
    votes: c.votes,
    fill: CANDIDATE_COLORS[i],
  }));

  const pieData = candidates
    .filter((c) => c.votes > 0)
    .map((c) => ({
      name: c.name,
      value: c.votes,
      fill: CANDIDATE_COLORS[candidates.indexOf(c)],
    }));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ── Header ── */}
      <header className="election-gradient shadow-lg">
        <div className="container max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
              <Vote className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
                Election Portal 2026
              </h1>
              <p className="text-white/55 text-xs mt-0.5">General Election · March 24, 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-green-500/20 border border-green-400/30 text-green-300 text-xs font-semibold px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
              LIVE
            </div>
            <div className="text-white/55 border border-white/20 text-xs font-medium px-3 py-1.5 rounded-full">
              {totalVotes} total vote{totalVotes !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 py-8 space-y-8 flex-1">
        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Votes */}
          <div className="bg-card rounded-xl border border-border p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
              <Vote className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Votes</p>
              <p className="text-2xl font-black text-foreground">{totalVotes}</p>
              <p className="text-xs text-muted-foreground">Registered</p>
            </div>
          </div>
          {/* Leading */}
          <div className="bg-card rounded-xl border border-border p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
              <Trophy className="w-6 h-6 text-amber-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Leading</p>
              <p className="text-2xl font-black text-foreground truncate">
                {leader.votes > 0 ? leader.name.split(" ")[1] : "—"}
              </p>
              <p className="text-xs text-muted-foreground">
                {leader.votes > 0 ? `${leader.votes} vote${leader.votes !== 1 ? "s" : ""}` : "No votes yet"}
              </p>
            </div>
          </div>
          {/* Candidates */}
          <div className="bg-card rounded-xl border border-border p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6 text-blue-700" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Candidates</p>
              <p className="text-2xl font-black text-foreground">{candidates.length}</p>
              <p className="text-xs text-muted-foreground">Running</p>
            </div>
          </div>
          {/* Status */}
          <div className="bg-card rounded-xl border border-border p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</p>
              <p className="text-2xl font-black text-green-600">Active</p>
              <p className="text-xs text-muted-foreground">Voting open</p>
            </div>
          </div>
        </div>

        {/* ── Current Leader Banner ── */}
        {leader.votes > 0 && (
          <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Current Leader</p>
              <p className="text-base font-bold text-amber-900 truncate">
                {leader.name}{" "}
                <span className="font-normal text-amber-700">— {leader.party}</span>
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-2xl font-black text-amber-700">
                {((leader.votes / totalVotes) * 100).toFixed(1)}%
              </p>
              <p className="text-xs text-amber-600">{leader.votes} vote{leader.votes !== 1 ? "s" : ""}</p>
            </div>
          </div>
        )}

        {/* ── Cast Vote Section ── */}
        <section className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-accent" />
            Cast Your Vote
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
                disabled={hasVoted}
                className="text-base"
              />
            </div>
            {hasVoted ? (
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-sm text-green-600 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Vote Recorded!
                </span>
                <Button onClick={handleReset} variant="outline" className="gap-2">
                  <RotateCcw className="w-4 h-4" /> Another Voter
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleCastVote}
                disabled={!selectedCandidate || !voterName.trim()}
                className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90 shrink-0"
              >
                <Vote className="w-4 h-4" /> Cast Vote
              </Button>
            )}
          </div>
        </section>

        {/* ── Candidates Grid ── */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Users className="w-6 h-6 text-accent" /> Candidates
            </h2>
            {!hasVoted && selectedCandidate && (
              <span className="text-sm font-medium text-accent bg-red-50 border border-red-100 px-3 py-1 rounded-full">
                1 selected — enter your name &amp; cast vote
              </span>
            )}
          </div>
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

        {/* ── Live Tally + Activity Log ── */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Bar Chart */}
          <section className="lg:col-span-2 bg-card rounded-xl border border-border p-6 shadow-sm">
            <h2 className="text-xl font-bold text-foreground mb-5 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-accent" /> Live Vote Tally
            </h2>
            {totalVotes === 0 ? (
              <div className="flex flex-col items-center justify-center h-44 text-muted-foreground">
                <BarChart3 className="w-12 h-12 mb-3 opacity-20" />
                <p className="text-sm">No votes yet — be the first to vote!</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={barData} barSize={48} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,88%)" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12, fill: "hsl(220,10%,46%)", fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "hsl(220,10%,46%)" }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                    width={28}
                  />
                  <Tooltip
                    cursor={{ fill: "hsl(220,15%,94%)", radius: 4 } as object}
                    contentStyle={{
                      background: "#ffffff",
                      border: "1px solid hsl(220,15%,88%)",
                      borderRadius: "8px",
                      fontSize: "13px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0/0.08)",
                    }}
                    formatter={(value: number) => [
                      `${value} vote${value !== 1 ? "s" : ""}`,
                      "Votes",
                    ]}
                  />
                  <Bar dataKey="votes" radius={[6, 6, 0, 0]}>
                    {barData.map((entry, index) => (
                      <Cell key={`bar-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}

            {/* Progress rows */}
            <div className="mt-5 space-y-2.5">
              {candidates.map((c, i) => {
                const pct = totalVotes > 0 ? (c.votes / totalVotes) * 100 : 0;
                return (
                  <div key={c.id} className="flex items-center gap-3 text-sm">
                    <div className="w-3 h-3 rounded-sm shrink-0" style={{ background: CANDIDATE_COLORS[i] }} />
                    <span className="w-28 truncate font-medium text-foreground">{c.name}</span>
                    <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${pct}%`, background: CANDIDATE_COLORS[i] }}
                      />
                    </div>
                    <span className="w-10 text-right text-muted-foreground tabular-nums">
                      {pct.toFixed(0)}%
                    </span>
                    <span className="w-6 text-right font-bold text-foreground tabular-nums">{c.votes}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Activity Log */}
          <section className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <h2 className="text-xl font-bold text-foreground mb-5 flex items-center gap-2">
              <Activity className="w-5 h-5 text-accent" /> Vote Activity
            </h2>
            <VoterLog records={voteRecords} />
          </section>
        </div>

        {/* ── Vote Distribution (Donut) — shown only after first vote ── */}
        {totalVotes > 0 && (
          <section className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <h2 className="text-xl font-bold text-foreground mb-5 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-600" /> Vote Distribution
            </h2>
            <div className="grid sm:grid-cols-2 gap-6 items-center">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={105}
                    paddingAngle={3}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`pie-${index}`} fill={entry.fill} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#ffffff",
                      border: "1px solid hsl(220,15%,88%)",
                      borderRadius: "8px",
                      fontSize: "13px",
                    }}
                    formatter={(value: number, name: string) => [
                      `${value} vote${value !== 1 ? "s" : ""}`,
                      name,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="space-y-3">
                {candidates.map((c, i) => {
                  const pct = totalVotes > 0 ? (c.votes / totalVotes) * 100 : 0;
                  const isLeader = c.id === leader.id && leader.votes > 0;
                  return (
                    <div
                      key={c.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                        isLeader
                          ? "bg-amber-50 border-amber-200"
                          : "bg-secondary/40 border-transparent"
                      }`}
                    >
                      <div className="w-4 h-4 rounded-sm shrink-0" style={{ background: CANDIDATE_COLORS[i] }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{c.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{c.party}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-foreground">{pct.toFixed(1)}%</p>
                        <p className="text-xs text-muted-foreground">{c.votes} votes</p>
                      </div>
                      {isLeader && <Trophy className="w-4 h-4 text-amber-500 shrink-0" />}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="election-gradient mt-8 py-4">
        <div className="container max-w-7xl mx-auto px-4 text-center">
          <p className="text-white/40 text-sm">
            Election Portal 2026 · Secure &amp; Transparent Voting System
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

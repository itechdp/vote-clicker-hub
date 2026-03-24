import { useState } from "react";
import { ClipboardList, Search, Users, Vote, ArrowRight, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { useVoting } from "@/context/VotingContext";
import { Input } from "@/components/ui/input";

const COLORS = ["#dc2626", "#1e40af", "#d97706", "#16a34a"];

export default function Voters() {
  const { candidates, voteRecords } = useVoting();
  const [search, setSearch] = useState("");

  const totalVotes = voteRecords.length;

  const filtered = voteRecords.filter(
    (r) =>
      r.voterName.toLowerCase().includes(search.toLowerCase()) ||
      r.candidateName.toLowerCase().includes(search.toLowerCase()),
  );

  const getCandidateColor = (name: string) => {
    const idx = candidates.findIndex((c) => c.name === name);
    return COLORS[idx] ?? "#6b7280";
  };

  const leadingCandidate = [...candidates].sort((a, b) => b.votes - a.votes)[0];

  return (
    <div className="p-6 lg:p-8 space-y-7 max-w-[1400px] mx-auto">
      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-2">
            <ClipboardList className="w-7 h-7 text-accent" />
            Voters
          </h1>
          <p className="text-muted-foreground mt-0.5 text-sm">
            Complete voter activity log · {totalVotes} vote{totalVotes !== 1 ? "s" : ""} recorded
          </p>
        </div>
        <span className="bg-accent/10 text-accent border border-accent/20 text-sm font-bold px-4 py-1.5 rounded-full self-start sm:self-auto">
          {totalVotes} vote{totalVotes !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Per-candidate summary cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {candidates.map((c, i) => {
          const pct = totalVotes > 0 ? (c.votes / totalVotes) * 100 : 0;
          const isLeader = c.id === leadingCandidate.id && leadingCandidate.votes > 0;
          return (
            <div
              key={c.id}
              className={`bg-card border rounded-xl p-4 shadow-sm flex items-center gap-3 transition-all ${
                isLeader ? "border-amber-200 bg-amber-50/50" : "border-border"
              }`}
            >
              <div
                className="w-1.5 h-12 rounded-full shrink-0"
                style={{ background: COLORS[i] }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground truncate font-medium">
                  {c.name.split(" ").slice(-1)[0]}
                </p>
                <p className="text-2xl font-black text-foreground leading-tight">{c.votes}</p>
                <p className="text-xs text-muted-foreground">{pct.toFixed(1)}%</p>
              </div>
              {isLeader && <Trophy className="w-4 h-4 text-amber-500 shrink-0" />}
            </div>
          );
        })}
      </div>

      {/* ── Voter table ── */}
      <section className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        {/* Table toolbar */}
        <div className="px-6 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="font-bold text-foreground flex items-center gap-2">
            <Users className="w-5 h-5 text-accent" />
            All Voters
            {search && (
              <span className="text-xs font-normal text-muted-foreground ml-1">
                ({filtered.length} of {totalVotes} shown)
              </span>
            )}
          </h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search voters or candidates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-sm"
            />
          </div>
        </div>

        {/* Empty state — no votes at all */}
        {voteRecords.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">
            <Vote className="w-14 h-14 mx-auto mb-4 opacity-10" />
            <p className="font-bold text-base text-foreground">No votes recorded yet</p>
            <p className="text-sm mt-1">Head to the Candidates page to cast the first vote</p>
            <Link
              to="/candidates"
              className="inline-flex items-center gap-1.5 mt-4 text-sm text-accent font-bold hover:underline"
            >
              Go to Candidates <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Empty state — search no results */}
        {voteRecords.length > 0 && filtered.length === 0 && (
          <div className="py-16 text-center text-muted-foreground">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-15" />
            <p className="font-semibold">No results for "{search}"</p>
            <button
              onClick={() => setSearch("")}
              className="mt-2 text-sm text-accent font-semibold hover:underline"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Table */}
        {filtered.length > 0 && (
          <>
            {/* Column headers */}
            <div className="hidden sm:grid grid-cols-[3rem_1fr_1fr_7rem] gap-4 px-6 py-2.5 bg-muted/60 border-b border-border">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">#</div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Voter Name</div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Voted For</div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Time</div>
            </div>

            <div className="divide-y divide-border">
              {filtered.map((r) => {
                const rowNum = voteRecords.length - voteRecords.indexOf(r);
                const color = getCandidateColor(r.candidateName);
                return (
                  <div
                    key={r.id}
                    className="flex sm:grid sm:grid-cols-[3rem_1fr_1fr_7rem] gap-3 sm:gap-4 px-6 py-3.5 items-center hover:bg-muted/30 transition-colors"
                  >
                    {/* # */}
                    <div className="hidden sm:block text-xs font-bold text-muted-foreground tabular-nums">
                      {rowNum}
                    </div>

                    {/* Voter */}
                    <div className="flex items-center gap-2.5 min-w-0 flex-1 sm:flex-none">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                        <span className="text-xs font-black text-primary-foreground uppercase">
                          {r.voterName.charAt(0)}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-foreground truncate">
                        {r.voterName}
                      </span>
                    </div>

                    {/* Voted for */}
                    <div className="flex items-center gap-1.5 min-w-0">
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <span
                        className="text-sm font-semibold truncate"
                        style={{ color }}
                      >
                        {r.candidateName}
                      </span>
                    </div>

                    {/* Time */}
                    <div className="text-xs text-muted-foreground whitespace-nowrap sm:text-right ml-auto sm:ml-0">
                      {r.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Table footer */}
            <div className="px-6 py-3 border-t border-border bg-muted/30 flex justify-between items-center">
              <p className="text-xs text-muted-foreground">
                Showing{" "}
                <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
                voter{filtered.length !== 1 ? "s" : ""}
              </p>
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="text-xs text-accent font-semibold hover:underline"
                >
                  Clear filter
                </button>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

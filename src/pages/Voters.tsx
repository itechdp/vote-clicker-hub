import { useState } from "react";
import { Search, Vote, ArrowRight, Trophy, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useVoting } from "@/context/VotingContext";
import { Input } from "@/components/ui/input";

const C = ["#dc2626", "#1d4ed8", "#d97706", "#16a34a"];

export default function Voters() {
  const { candidates, voteRecords } = useVoting();
  const [search, setSearch] = useState("");

  const total    = voteRecords.length;
  const filtered = voteRecords.filter(
    (r) =>
      r.voterName.toLowerCase().includes(search.toLowerCase()) ||
      r.candidateName.toLowerCase().includes(search.toLowerCase()),
  );
  const getColor = (name: string) => C[candidates.findIndex((c) => c.name === name)] ?? "#94a3b8";
  const leader   = [...candidates].sort((a, b) => b.votes - a.votes)[0];

  return (
    <div className="px-6 lg:px-8 py-7 space-y-6 max-w-[1440px] mx-auto">

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Voters</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {total} vote{total !== 1 ? "s" : ""} recorded · Live activity log
          </p>
        </div>
        <span className="bg-red-50 text-red-600 border border-red-100 text-[11px] font-bold px-3.5 py-1.5 rounded-full self-start sm:self-auto uppercase tracking-wide">
          {total} Total Votes
        </span>
      </div>

      {/* ── Per-candidate summary ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {candidates.map((c, i) => {
          const pct      = total > 0 ? (c.votes / total) * 100 : 0;
          const isLeader = c.id === leader.id && leader.votes > 0;
          return (
            <div
              key={c.id}
              className={[
                "bg-white border rounded-xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)]",
                isLeader ? "border-amber-200 ring-1 ring-amber-100/80" : "border-slate-200",
              ].join(" ")}
            >
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: C[i] }} />
                <p className="text-xs font-medium text-slate-500 truncate flex-1">
                  {c.name.split(" ").slice(-1)[0]}
                </p>
                {isLeader && <Trophy className="w-3 h-3 text-amber-500 shrink-0" />}
              </div>
              <p className="text-[28px] font-bold text-slate-900 leading-none tabular-nums">
                {c.votes}
              </p>
              <div className="mt-2 h-1 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${pct}%`, background: C[i] }}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 tabular-nums">{pct.toFixed(1)}%</p>
            </div>
          );
        })}
      </div>

      {/* ── Voter table ── */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.05)] overflow-hidden">

        {/* Toolbar */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-[13px] font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-4 h-4 text-red-500" />
            All Voters
            {search && (
              <span className="text-xs font-normal text-slate-400 ml-0.5">
                ({filtered.length} of {total} shown)
              </span>
            )}
          </h2>
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <Input
              placeholder="Search name or candidate…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-sm border-slate-200 h-9 focus-visible:ring-red-500/30 focus-visible:border-red-400"
            />
          </div>
        </div>

        {/* Empty — no votes */}
        {total === 0 && (
          <div className="py-20 flex flex-col items-center gap-3 text-center">
            <Vote className="w-10 h-10 text-slate-200" />
            <div>
              <p className="font-semibold text-slate-700">No votes recorded yet</p>
              <p className="text-sm text-slate-400 mt-0.5">
                Head to Candidates to cast the first vote
              </p>
            </div>
            <Link
              to="/candidates"
              className="inline-flex items-center gap-1.5 mt-1 text-sm text-red-600 font-semibold hover:underline"
            >
              Go to Candidates <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Empty — search */}
        {total > 0 && filtered.length === 0 && (
          <div className="py-16 flex flex-col items-center gap-2 text-center">
            <Search className="w-8 h-8 text-slate-200" />
            <p className="text-slate-500 font-medium text-sm">No results for "{search}"</p>
            <button
              onClick={() => setSearch("")}
              className="text-xs text-red-600 font-semibold hover:underline mt-0.5"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Table */}
        {filtered.length > 0 && (
          <>
            {/* Header row */}
            <div className="hidden sm:grid grid-cols-[52px_1fr_1fr_80px] px-6 py-2.5 bg-slate-50 border-b border-slate-100">
              {["#", "Voter Name", "Voted For", "Time"].map((h, i) => (
                <span
                  key={h}
                  className={`text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] ${i === 3 ? "text-right" : ""}`}
                >
                  {h}
                </span>
              ))}
            </div>

            <div className="divide-y divide-slate-50">
              {filtered.map((r) => {
                const num = voteRecords.indexOf(r) + 1;
                return (
                  <div
                    key={r.id}
                    className="grid grid-cols-1 sm:grid-cols-[52px_1fr_1fr_80px] px-6 py-3.5 items-center gap-2 sm:gap-0 hover:bg-slate-50/70 transition-colors"
                  >
                    {/* # */}
                    <span className="hidden sm:block text-[11px] text-slate-300 font-mono tabular-nums">
                      {num}
                    </span>

                    {/* Voter */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-slate-900 flex items-center justify-center shrink-0 text-[10px] font-bold text-white uppercase">
                        {r.voterName.charAt(0)}
                      </div>
                      <span className="text-[13px] font-semibold text-slate-800 truncate">
                        {r.voterName}
                      </span>
                    </div>

                    {/* Voted for */}
                    <div className="flex items-center gap-1.5 min-w-0 sm:pl-1">
                      <ArrowRight className="w-3 h-3 text-slate-300 shrink-0" />
                      <span
                        className="text-[13px] font-semibold truncate"
                        style={{ color: getColor(r.candidateName) }}
                      >
                        {r.candidateName}
                      </span>
                    </div>

                    {/* Time */}
                    <time className="text-xs text-slate-400 sm:text-right tabular-nums">
                      {r.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
              <p className="text-xs text-slate-400">
                Showing{" "}
                <span className="font-semibold text-slate-700">{filtered.length}</span>{" "}
                voter{filtered.length !== 1 ? "s" : ""}
              </p>
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="text-xs text-red-600 font-semibold hover:underline"
                >
                  Clear filter
                </button>
              )}
            </div>
          </>
        )}
      </div>

    </div>
  );
}

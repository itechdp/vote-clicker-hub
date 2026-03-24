import { Vote, Trophy, Users, ShieldCheck, BarChart3, Activity, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useVoting } from "@/context/VotingContext";
import type { Candidate } from "@/context/VotingContext";
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

const COLORS = ["#dc2626", "#1e40af", "#d97706", "#16a34a"];

// ── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  icon,
  iconBg,
  label,
  value,
  sub,
  valueClass,
  highlight,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
  sub: string;
  valueClass?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm flex items-center gap-4 transition-all ${
        highlight
          ? "bg-gradient-to-br from-amber-50 to-white border-amber-200"
          : "bg-card border-border"
      }`}
    >
      <div
        className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          {label}
        </p>
        <p className={`text-2xl font-black truncate mt-0.5 ${valueClass ?? "text-foreground"}`}>
          {value}
        </p>
        <p className="text-xs text-muted-foreground truncate mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

// ── Empty Chart Placeholder ───────────────────────────────────────────────────
function EmptyState({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
      <Icon className="w-12 h-12 mb-3 opacity-15" />
      <p className="text-sm">{text}</p>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { candidates, voteRecords } = useVoting();

  const totalVotes = candidates.reduce((s, c) => s + c.votes, 0);
  const sortedCandidates = [...candidates].sort((a, b) => b.votes - a.votes);
  const leader = sortedCandidates[0];

  const barData = candidates.map((c, i) => ({
    name: c.name.split(" ").slice(-1)[0],
    votes: c.votes,
    fill: COLORS[i],
  }));

  const pieData = candidates
    .filter((c) => c.votes > 0)
    .map((c) => ({
      name: c.name,
      value: c.votes,
      fill: COLORS[candidates.indexOf(c)],
    }));

  const recentVotes = voteRecords.slice(0, 6);

  return (
    <div className="p-6 lg:p-8 space-y-7 max-w-[1400px] mx-auto">
      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">
            General Election 2026 · Real-time vote tracking
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1.5 bg-green-500/10 border border-green-400/25 text-green-600 text-xs font-bold px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            LIVE
          </span>
          <span className="text-sm text-muted-foreground border border-border rounded-full px-3 py-1.5 font-medium">
            {totalVotes} vote{totalVotes !== 1 ? "s" : ""} cast
          </span>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={<Vote className="w-5 h-5 text-red-600" />}
          iconBg="bg-red-50"
          label="Total Votes"
          value={String(totalVotes)}
          sub="All recorded votes"
        />
        <StatCard
          icon={<Trophy className="w-5 h-5 text-amber-600" />}
          iconBg="bg-amber-50"
          label="Current Leader"
          value={leader.votes > 0 ? leader.name.split(" ").slice(-1)[0] : "—"}
          sub={
            leader.votes > 0
              ? `${leader.votes} vote${leader.votes !== 1 ? "s" : ""} · ${((leader.votes / totalVotes) * 100).toFixed(1)}%`
              : "No votes yet"
          }
          highlight={leader.votes > 0}
        />
        <StatCard
          icon={<Users className="w-5 h-5 text-blue-700" />}
          iconBg="bg-blue-50"
          label="Candidates"
          value={String(candidates.length)}
          sub="Running this election"
        />
        <StatCard
          icon={<ShieldCheck className="w-5 h-5 text-green-600" />}
          iconBg="bg-green-50"
          label="Poll Status"
          value="Active"
          sub="March 24, 2026"
          valueClass="text-green-600"
        />
      </div>

      {/* ── Leader banner ── */}
      {leader.votes > 0 && (
        <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0">
            <Trophy className="w-6 h-6 text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold text-amber-500 uppercase tracking-widest">
              Leading Candidate
            </p>
            <p className="text-[17px] font-black text-amber-900 mt-0.5">
              {leader.name}
              <span className="font-normal text-amber-600 text-base ml-2">— {leader.party}</span>
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-3xl font-black text-amber-700">
              {((leader.votes / totalVotes) * 100).toFixed(1)}%
            </p>
            <p className="text-sm text-amber-600">
              {leader.votes} vote{leader.votes !== 1 ? "s" : ""}
            </p>
          </div>
          <Link
            to="/candidates"
            className="text-amber-600 hover:text-amber-700 text-sm font-bold flex items-center gap-1 shrink-0 group"
          >
            Vote now
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      )}

      {/* ── Charts + Activity ── */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Bar chart */}
        <section className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-accent" />
              Vote Tally
            </h2>
            <span className="text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-full font-medium">
              {totalVotes} total
            </span>
          </div>

          {totalVotes === 0 ? (
            <EmptyState icon={BarChart3} text="Charts will appear once votes are cast" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData} barSize={46} barCategoryGap="28%">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(220,15%,91%)"
                  vertical={false}
                />
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
                  width={26}
                />
                <Tooltip
                  cursor={{ fill: "hsl(220,15%,95%)", radius: 6 } as object}
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid hsl(220,15%,88%)",
                    borderRadius: "10px",
                    fontSize: "13px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                  formatter={(v: number) => [
                    `${v} vote${v !== 1 ? "s" : ""}`,
                    "Votes",
                  ]}
                />
                <Bar dataKey="votes" radius={[8, 8, 0, 0]}>
                  {barData.map((_, i) => (
                    <Cell key={i} fill={barData[i].fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}

          {/* Progress rows */}
          <div className="mt-4 pt-4 border-t border-border space-y-2.5">
            {candidates.map((c, i) => {
              const pct = totalVotes > 0 ? (c.votes / totalVotes) * 100 : 0;
              return (
                <div key={c.id} className="flex items-center gap-3">
                  <div
                    className="w-2.5 h-2.5 rounded-sm shrink-0"
                    style={{ background: COLORS[i] }}
                  />
                  <span className="w-28 truncate text-xs font-medium text-foreground">
                    {c.name}
                  </span>
                  <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${pct}%`, background: COLORS[i] }}
                    />
                  </div>
                  <span className="w-9 text-right text-xs text-muted-foreground tabular-nums">
                    {pct.toFixed(0)}%
                  </span>
                  <span className="w-5 text-right text-xs font-bold text-foreground tabular-nums">
                    {c.votes}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Recent Activity */}
        <section className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-5">
            <Activity className="w-5 h-5 text-accent" />
            Recent Activity
          </h2>

          {recentVotes.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground py-8">
              <Activity className="w-10 h-10 mb-3 opacity-15" />
              <p className="text-sm font-medium">No votes yet</p>
              <Link
                to="/candidates"
                className="mt-3 text-sm text-accent font-bold hover:underline"
              >
                Cast the first vote →
              </Link>
            </div>
          ) : (
            <div className="space-y-2 flex-1 overflow-y-auto">
              {recentVotes.map((r) => {
                const idx = candidates.findIndex((c) => c.name === r.candidateName);
                const color = COLORS[idx] ?? "#6b7280";
                return (
                  <div
                    key={r.id}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-secondary/50 border border-border/50"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <span className="text-xs font-black text-primary-foreground uppercase">
                        {r.voterName.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">
                        {r.voterName}
                      </p>
                      <p className="text-xs font-medium truncate" style={{ color }}>
                        → {r.candidateName.split(" ").slice(-1)[0]}
                      </p>
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {r.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {voteRecords.length > 0 && (
            <Link
              to="/voters"
              className="mt-4 text-center text-sm text-accent font-bold hover:underline block"
            >
              View all {voteRecords.length} voter{voteRecords.length !== 1 ? "s" : ""} →
            </Link>
          )}
        </section>
      </div>

      {/* ── Vote Distribution Donut ── */}
      {totalVotes > 0 && (
        <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-6">
            <Trophy className="w-5 h-5 text-amber-500" />
            Vote Distribution
          </h2>
          <div className="grid sm:grid-cols-2 gap-6 items-center">
            <ResponsiveContainer width="100%" height={230}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={pieData[i].fill} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid hsl(220,15%,88%)",
                    borderRadius: "10px",
                    fontSize: "13px",
                  }}
                  formatter={(v: number, name: string) => [
                    `${v} vote${v !== 1 ? "s" : ""}`,
                    name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="space-y-3">
              {sortedCandidates.map((c: Candidate) => {
                const pct = (c.votes / totalVotes) * 100;
                const i = candidates.indexOf(c);
                const isLeader = c.id === leader.id;
                return (
                  <div
                    key={c.id}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
                      isLeader
                        ? "bg-amber-50 border-amber-200"
                        : "bg-secondary/40 border-transparent"
                    }`}
                  >
                    <div
                      className="w-4 h-4 rounded-sm shrink-0"
                      style={{ background: COLORS[i] }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{c.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{c.party}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-foreground">{pct.toFixed(1)}%</p>
                      <p className="text-xs text-muted-foreground">
                        {c.votes} vote{c.votes !== 1 ? "s" : ""}
                      </p>
                    </div>
                    {isLeader && <Trophy className="w-4 h-4 text-amber-500 shrink-0" />}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

import {
  Vote,
  Trophy,
  Users,
  ShieldCheck,
  BarChart3,
  Activity,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
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

const C = ["#dc2626", "#1d4ed8", "#d97706", "#16a34a"];

// ── Stat Card ──────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  iconCls,
  valueCls,
  accent,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ElementType;
  iconCls: string;
  valueCls?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={[
        "bg-white rounded-2xl border p-5 flex items-start gap-4 shadow-[0_1px_4px_rgba(0,0,0,0.05)]",
        accent ? "border-amber-200 ring-1 ring-amber-100/80" : "border-slate-200",
      ].join(" ")}
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconCls}`}>
        <Icon className="w-[18px] h-[18px]" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          {label}
        </p>
        <p className={`text-[26px] font-bold leading-tight mt-0.5 truncate tracking-tight ${valueCls ?? "text-slate-900"}`}>
          {value}
        </p>
        <p className="text-xs text-slate-400 mt-0.5 truncate">{sub}</p>
      </div>
    </div>
  );
}

// ── Dashboard ──────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { candidates, voteRecords } = useVoting();

  const totalVotes = candidates.reduce((s, c) => s + c.votes, 0);
  const sorted = [...candidates].sort((a, b) => b.votes - a.votes);
  const leader = sorted[0];

  const barData = candidates.map((c, i) => ({
    name: c.name.split(" ").slice(-1)[0],
    votes: c.votes,
    fill: C[i],
  }));

  const pieData = candidates
    .filter((c) => c.votes > 0)
    .map((c) => ({
      name: c.name,
      value: c.votes,
      fill: C[candidates.indexOf(c)],
    }));

  const recent = voteRecords.slice(0, 7);

  return (
    <div className="px-6 lg:px-8 py-7 space-y-6 max-w-[1440px] mx-auto">

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Overview</h1>
          <p className="text-slate-500 text-sm mt-0.5">General Election 2026 · Live vote tracking</p>
        </div>
        <Link
          to="/candidates"
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm shadow-red-700/20 self-start sm:self-auto"
        >
          <Vote className="w-4 h-4" />
          Cast a Vote
        </Link>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={Vote}
          iconCls="bg-red-50 text-red-600"
          label="Total Votes"
          value={String(totalVotes)}
          sub="All recorded votes"
        />
        <StatCard
          icon={Trophy}
          iconCls="bg-amber-50 text-amber-500"
          label="Current Leader"
          value={leader.votes > 0 ? (leader.name.split(" ")[1] ?? leader.name) : "—"}
          sub={
            leader.votes > 0
              ? `${leader.votes} votes · ${((leader.votes / totalVotes) * 100).toFixed(1)}%`
              : "No votes yet"
          }
          valueCls={leader.votes > 0 ? "text-amber-700" : undefined}
          accent={leader.votes > 0}
        />
        <StatCard
          icon={Users}
          iconCls="bg-blue-50 text-blue-600"
          label="Candidates"
          value="4"
          sub="Running this election"
        />
        <StatCard
          icon={ShieldCheck}
          iconCls="bg-emerald-50 text-emerald-600"
          label="Poll Status"
          value="Active"
          sub="Polls open · March 24"
          valueCls="text-emerald-600"
        />
      </div>

      {/* ── Leader banner ── */}
      {leader.votes > 0 && (
        <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border border-amber-200 rounded-2xl px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <div className="w-10 h-10 bg-amber-100 border border-amber-200 rounded-xl flex items-center justify-center shrink-0">
            <Trophy className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.12em]">
              Current Leader
            </p>
            <p className="text-[17px] font-bold text-amber-900 mt-0.5 truncate">
              {leader.name}
              <span className="font-normal text-amber-600 text-sm ml-2">· {leader.party}</span>
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-3xl font-bold text-amber-700 tabular-nums tracking-tight">
              {((leader.votes / totalVotes) * 100).toFixed(1)}%
            </p>
            <p className="text-xs text-amber-500 mt-0.5">
              {leader.votes} vote{leader.votes !== 1 ? "s" : ""}
            </p>
          </div>
          <Link
            to="/candidates"
            className="shrink-0 inline-flex items-center gap-1 text-sm font-semibold text-amber-700 hover:text-amber-900 transition-colors group"
          >
            Vote now
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      )}

      {/* ── Bar chart + Activity ── */}
      <div className="grid lg:grid-cols-3 gap-5">

        {/* Bar chart */}
        <section className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.05)] p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-[15px] font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-red-500" />
                Vote Tally
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {totalVotes} total votes cast
              </p>
            </div>
            <span className="text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full font-medium">
              Live
            </span>
          </div>

          {totalVotes === 0 ? (
            <div className="flex flex-col items-center justify-center h-44 text-slate-300 gap-2">
              <BarChart3 className="w-10 h-10" />
              <p className="text-sm text-slate-400">Charts appear once votes are cast</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={barData} barSize={44} barCategoryGap="28%">
                <CartesianGrid strokeDasharray="2 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "#94a3b8", fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                  width={24}
                />
                <Tooltip
                  cursor={{ fill: "#f8fafc", radius: 6 } as object}
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "10px",
                    fontSize: "13px",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
                  }}
                  formatter={(v: number) => [`${v} vote${v !== 1 ? "s" : ""}`, "Votes"]}
                />
                <Bar dataKey="votes" radius={[6, 6, 0, 0]}>
                  {barData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}

          {/* Progress rows */}
          <div className="mt-4 pt-4 border-t border-slate-100 space-y-2.5">
            {candidates.map((c, i) => {
              const pct = totalVotes > 0 ? (c.votes / totalVotes) * 100 : 0;
              return (
                <div key={c.id} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: C[i] }} />
                  <span className="w-24 text-xs font-medium text-slate-600 truncate">
                    {c.name.split(" ").slice(-1)[0]}
                  </span>
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${pct}%`, background: C[i] }}
                    />
                  </div>
                  <span className="w-8 text-right text-xs text-slate-400 tabular-nums">
                    {pct.toFixed(0)}%
                  </span>
                  <span className="w-4 text-right text-xs font-bold text-slate-700 tabular-nums">
                    {c.votes}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Recent Activity */}
        <section className="bg-white border border-slate-200 rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.05)] p-6 flex flex-col">
          <h2 className="text-[15px] font-bold text-slate-900 flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-red-500" />
            Recent Activity
          </h2>

          {voteRecords.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-10 text-center gap-2">
              <Activity className="w-8 h-8 text-slate-200" />
              <p className="text-sm text-slate-500 font-medium">No votes yet</p>
              <Link
                to="/candidates"
                className="text-xs text-red-600 font-semibold hover:underline mt-1"
              >
                Cast the first vote →
              </Link>
            </div>
          ) : (
            <div className="flex-1 divide-y divide-slate-50 overflow-y-auto">
              {recent.map((r) => {
                const idx = candidates.findIndex((c) => c.name === r.candidateName);
                return (
                  <div key={r.id} className="flex items-center gap-3 py-2.5 first:pt-0">
                    <div className="w-7 h-7 rounded-full bg-slate-900 flex items-center justify-center shrink-0 text-[10px] font-bold text-white uppercase">
                      {r.voterName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">{r.voterName}</p>
                      <p
                        className="text-[11px] font-medium truncate"
                        style={{ color: C[idx] ?? "#64748b" }}
                      >
                        → {r.candidateName.split(" ").slice(-1)[0]}
                      </p>
                    </div>
                    <time className="text-[10px] text-slate-400 shrink-0 tabular-nums">
                      {r.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </time>
                  </div>
                );
              })}
            </div>
          )}

          {voteRecords.length > 0 && (
            <Link
              to="/voters"
              className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 transition-colors group"
            >
              View all {voteRecords.length} voter{voteRecords.length !== 1 ? "s" : ""}
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </section>
      </div>

      {/* ── Donut distribution ── */}
      {totalVotes > 0 && (
        <section className="bg-white border border-slate-200 rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.05)] p-6">
          <h2 className="text-[15px] font-bold text-slate-900 flex items-center gap-2 mb-6">
            <Trophy className="w-4 h-4 text-amber-500" />
            Vote Distribution
          </h2>
          <div className="grid sm:grid-cols-2 gap-6 items-center">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={96}
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
                    border: "1px solid #e2e8f0",
                    borderRadius: "10px",
                    fontSize: "12px",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
                  }}
                  formatter={(v: number, name: string) => [
                    `${v} vote${v !== 1 ? "s" : ""}`,
                    name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="space-y-2.5">
              {sorted.map((c: Candidate) => {
                const pct = (c.votes / totalVotes) * 100;
                const i = candidates.indexOf(c);
                const isLeader = c.id === leader.id;
                return (
                  <div
                    key={c.id}
                    className={[
                      "flex items-center gap-3 p-3.5 rounded-xl border transition-colors",
                      isLeader
                        ? "bg-amber-50 border-amber-200"
                        : "bg-slate-50 border-slate-100",
                    ].join(" ")}
                  >
                    <div className="w-3 h-3 rounded-sm shrink-0" style={{ background: C[i] }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{c.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{c.party}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-slate-800 tabular-nums">{pct.toFixed(1)}%</p>
                      <p className="text-[11px] text-slate-400">{c.votes} votes</p>
                    </div>
                    {isLeader && (
                      <Trophy className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    )}
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

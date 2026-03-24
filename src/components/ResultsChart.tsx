interface Candidate {
  id: string;
  name: string;
  votes: number;
}

interface ResultsChartProps {
  candidates: Candidate[];
}

const COLORS = [
  "bg-accent",
  "bg-primary",
  "bg-election-gold",
  "bg-election-success",
];

const ResultsChart = ({ candidates }: ResultsChartProps) => {
  const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0);

  return (
    <div className="space-y-4">
      {candidates.map((candidate, i) => {
        const percentage = totalVotes > 0 ? (candidate.votes / totalVotes) * 100 : 0;
        return (
          <div key={candidate.id} className="space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-foreground">{candidate.name}</span>
              <span className="text-sm font-bold text-muted-foreground">
                {percentage.toFixed(1)}%
              </span>
            </div>
            <div className="h-3 bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${COLORS[i % COLORS.length]}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
      <p className="text-center text-sm text-muted-foreground pt-2">
        Total votes: <span className="font-bold text-foreground">{totalVotes}</span>
      </p>
    </div>
  );
};

export default ResultsChart;

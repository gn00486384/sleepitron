
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { SleepRecord } from "../../contexts/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PersonalityDistributionChartProps {
  sleepRecords: SleepRecord[];
}

const PersonalityDistributionChart = ({
  sleepRecords,
}: PersonalityDistributionChartProps) => {
  // Count personalities
  const personalityCount: Record<string, number> = {};

  sleepRecords.forEach((record) => {
    record.personalities?.forEach((p) => {
      personalityCount[p.personality] = (personalityCount[p.personality] || 0) + 1;
    });
  });

  // Prepare data for chart
  const chartData = Object.entries(personalityCount).map(([name, value]) => ({
    name,
    value,
  }));

  // Colors for each personality
  const COLORS = ["#9b87f5", "#f87171", "#fbbf24", "#60a5fa"];

  // If no data, show placeholder
  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">人格分布</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-72">
          <p className="text-muted-foreground">目前沒有人格數據</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">人格分布</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`出現 ${value} 次`, name]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalityDistributionChart;

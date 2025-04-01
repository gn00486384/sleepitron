
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { SleepRecord } from "../../contexts/DataContext";
import { format, parseISO } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SleepQualityChartProps {
  sleepRecords: SleepRecord[];
}

const SleepQualityChart = ({ sleepRecords }: SleepQualityChartProps) => {
  // Sort records by date
  const sortedRecords = [...sleepRecords].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Prepare data for chart
  const chartData = sortedRecords.map((record) => ({
    date: format(parseISO(record.date), "MM/dd"),
    quality: record.quality,
    fullDate: record.date,
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">睡眠質量趨勢</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#efefef" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 10]} />
              <Tooltip
                formatter={(value, name) => [`${value}`, "睡眠質量"]}
                labelFormatter={(label) => `日期: ${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="quality"
                stroke="#9b87f5"
                activeDot={{ r: 8 }}
                strokeWidth={2}
                name="睡眠質量"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SleepQualityChart;

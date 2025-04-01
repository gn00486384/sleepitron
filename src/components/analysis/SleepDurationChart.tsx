
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { SleepRecord } from "../../contexts/DataContext";
import { format, parseISO } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateSleepDurationMinutes } from "../../utils/dateUtils";

interface SleepDurationChartProps {
  sleepRecords: SleepRecord[];
}

const SleepDurationChart = ({ sleepRecords }: SleepDurationChartProps) => {
  // Sort records by date
  const sortedRecords = [...sleepRecords].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Prepare data for chart
  const chartData = sortedRecords.map((record) => {
    const durationMinutes = calculateSleepDurationMinutes(record.sleepTime, record.wakeTime, record.date);
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    
    return {
      date: format(parseISO(record.date), "MM/dd"),
      duration: parseFloat((durationMinutes / 60).toFixed(1)),
      fullDate: record.date,
      label: `${hours}小時${minutes > 0 ? ` ${minutes}分鐘` : ''}`,
    };
  });

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">睡眠時長趨勢</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#efefef" />
              <XAxis dataKey="date" />
              <YAxis 
                label={{ 
                  value: '小時', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle' }
                }} 
              />
              <Tooltip 
                formatter={(value, name) => [`${value} 小時`, "睡眠時長"]}
                labelFormatter={(label) => `日期: ${label}`}
              />
              <Legend />
              <Bar 
                dataKey="duration" 
                fill="#4299e1" 
                name="睡眠時長"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SleepDurationChart;

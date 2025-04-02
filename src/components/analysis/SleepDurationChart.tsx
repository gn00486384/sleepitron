
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import { SleepRecord } from "../../contexts/DataContext";
import { format, parseISO } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateSleepDurationMinutes, formatTime } from "../../utils/dateUtils";

interface SleepDurationChartProps {
  sleepRecords: SleepRecord[];
}

const SleepDurationChart = ({ sleepRecords }: SleepDurationChartProps) => {
  // Sort records by date
  const sortedRecords = [...sleepRecords].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Group sleep records by date
  const groupedByDate = sortedRecords.reduce<Record<string, SleepRecord[]>>((acc, record) => {
    const date = format(parseISO(record.date), "MM/dd");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(record);
    return acc;
  }, {});

  // Colors for different sleep segments
  const colors = ["#4299e1", "#48bb78", "#9f7aea", "#ed8936", "#f56565"];

  // Prepare data for chart
  const chartData = Object.entries(groupedByDate).map(([date, records]) => {
    // Sort records for each date by sleep time
    const sortedDateRecords = [...records].sort((a, b) => {
      const aTime = new Date(`2000-01-01T${a.sleepTime}`);
      const bTime = new Date(`2000-01-01T${b.sleepTime}`);
      return aTime.getTime() - bTime.getTime();
    });

    const segments = sortedDateRecords.map((record, index) => {
      const durationMinutes = calculateSleepDurationMinutes(record.sleepTime, record.wakeTime, record.date);
      const hours = Math.floor(durationMinutes / 60);
      const minutes = durationMinutes % 60;
      
      return {
        id: record.id,
        duration: parseFloat((durationMinutes / 60).toFixed(1)),
        sleepTime: formatTime(record.sleepTime),
        wakeTime: formatTime(record.wakeTime),
        label: `${hours}小時${minutes > 0 ? ` ${minutes}分鐘` : ''}`,
        color: colors[index % colors.length],
      };
    });
    
    // Calculate total duration for the day
    const totalDuration = segments.reduce((sum, segment) => sum + segment.duration, 0);
    
    return {
      date,
      fullDate: records[0].date,
      segments,
      totalDuration: parseFloat(totalDuration.toFixed(1)),
    };
  });

  // Custom tooltip to show all segments for a date
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background p-3 border rounded-md shadow-md">
          <p className="font-medium">{`日期: ${data.date}`}</p>
          <p className="text-sm text-muted-foreground mb-1">總睡眠時長: {data.totalDuration} 小時</p>
          <div className="space-y-1 mt-2">
            {data.segments.map((segment: any, index: number) => (
              <div key={segment.id} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: segment.color }} 
                />
                <span className="text-xs">
                  {segment.sleepTime}-{segment.wakeTime}: {segment.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

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
              barGap={0}
              barCategoryGap={10}
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
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="totalDuration" 
                name="睡眠時長" 
                fill="#4299e1"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`}
                    fill={entry.segments.length > 1 ? "#9f7aea" : "#4299e1"} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-sm text-muted-foreground text-center">
          <p>提示: 紫色條表示當日有多段睡眠記錄</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SleepDurationChart;

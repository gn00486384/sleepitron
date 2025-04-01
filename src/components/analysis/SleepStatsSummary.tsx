
import { SleepRecord } from "../../contexts/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bed, Clock, User, Calendar } from "lucide-react";
import {
  calculateAverageSleepQuality,
  getMostFrequentPersonality,
} from "../../utils/dateUtils";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface SleepStatsSummaryProps {
  sleepRecords: SleepRecord[];
  startDate: Date;
  endDate: Date;
}

const SleepStatsSummary = ({
  sleepRecords,
  startDate,
  endDate,
}: SleepStatsSummaryProps) => {
  const averageQuality = calculateAverageSleepQuality(sleepRecords);
  const mostFrequentPersonality = getMostFrequentPersonality(sleepRecords);

  const getQualityColor = (quality: number) => {
    if (quality >= 8) return "text-green-500";
    if (quality >= 5) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Calendar className="mr-2 h-4 w-4" />
          {format(startDate, "yyyy/MM/dd")} 至 {format(endDate, "yyyy/MM/dd")} 的統計
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
          <div className="flex items-center space-x-4 p-4 rounded-lg bg-secondary/50">
            <div className="p-2 rounded-full bg-sleep text-white">
              <Bed className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">記錄數</p>
              <p className="text-2xl font-semibold">{sleepRecords.length}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 rounded-lg bg-secondary/50">
            <div className="p-2 rounded-full bg-sleep text-white">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">平均睡眠質量</p>
              <p
                className={cn(
                  "text-2xl font-semibold",
                  getQualityColor(averageQuality)
                )}
              >
                {averageQuality.toFixed(1)}/10
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 rounded-lg bg-secondary/50">
            <div className="p-2 rounded-full bg-sleep text-white">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">主要人格</p>
              <p className="text-2xl font-semibold">{mostFrequentPersonality}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SleepStatsSummary;


import { useState, useEffect } from "react";
import { useData } from "../contexts/DataContext";
import AnalysisDateRangePicker from "../components/analysis/AnalysisDateRangePicker";
import SleepQualityChart from "../components/analysis/SleepQualityChart";
import SleepDurationChart from "../components/analysis/SleepDurationChart";
import PersonalityDistributionChart from "../components/analysis/PersonalityDistributionChart";
import SleepStatsSummary from "../components/analysis/SleepStatsSummary";
import { subDays } from "date-fns";
import { SleepRecord } from "../contexts/DataContext";
import { getSleepRecordsInRange } from "../utils/dateUtils";

const AnalysisPage = () => {
  const { sleepRecords } = useData();
  
  // Default to last 30 days
  const [startDate, setStartDate] = useState<Date>(() => subDays(new Date(), 29));
  const [endDate, setEndDate] = useState<Date>(new Date());
  
  const [filteredRecords, setFilteredRecords] = useState<SleepRecord[]>([]);

  useEffect(() => {
    // Filter records based on date range
    setFilteredRecords(getSleepRecordsInRange(sleepRecords, startDate, endDate));
  }, [sleepRecords, startDate, endDate]);

  const handleDateRangeChange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-6">睡眠數據分析</h1>
        <AnalysisDateRangePicker
          startDate={startDate}
          endDate={endDate}
          onDateRangeChange={handleDateRangeChange}
        />
      </div>

      <SleepStatsSummary
        sleepRecords={filteredRecords}
        startDate={startDate}
        endDate={endDate}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SleepDurationChart sleepRecords={filteredRecords} />
        <SleepQualityChart sleepRecords={filteredRecords} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <PersonalityDistributionChart sleepRecords={filteredRecords} />
      </div>

      {filteredRecords.length === 0 && (
        <div className="text-center p-8 bg-muted/20 rounded-lg">
          <p className="text-muted-foreground">
            所選時間範圍內沒有找到睡眠記錄
          </p>
        </div>
      )}
    </div>
  );
};

export default AnalysisPage;

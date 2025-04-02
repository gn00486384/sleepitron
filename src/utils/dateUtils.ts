
import { format, parseISO, differenceInMinutes, addDays, subDays, isWithinInterval } from "date-fns";
import { SleepRecord, DoctorVisit } from "../contexts/DataContext";

// Format a date string (YYYY-MM-DD) to a more readable format
export const formatDate = (dateString: string, formatStr: string = "yyyy/MM/dd") => {
  try {
    return format(parseISO(dateString), formatStr);
  } catch (e) {
    console.error("Invalid date format:", dateString);
    return dateString;
  }
};

// Calculate sleep duration from sleep and wake times
export const calculateSleepDuration = (sleepTime: string, wakeTime: string, date: string) => {
  try {
    const durationMinutes = calculateSleepDurationMinutes(sleepTime, wakeTime, date);
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    
    return `${hours}小時 ${minutes}分鐘`;
  } catch (e) {
    console.error("Error calculating sleep duration:", e);
    return "計算錯誤";
  }
};

// Calculate sleep duration in minutes
export const calculateSleepDurationMinutes = (sleepTime: string, wakeTime: string, date: string): number => {
  try {
    const sleepDate = new Date(`${date}T${sleepTime}:00`);
    let wakeDate = new Date(`${date}T${wakeTime}:00`);
    
    // If wake time is before sleep time, assume it's the next day
    if (wakeDate < sleepDate) {
      wakeDate = new Date(wakeDate.setDate(wakeDate.getDate() + 1));
    }
    
    return differenceInMinutes(wakeDate, sleepDate);
  } catch (e) {
    console.error("Error calculating sleep duration minutes:", e);
    return 0;
  }
};

// Calculate average sleep duration in minutes
export const calculateAverageSleepDuration = (sleepRecords: SleepRecord[]): number => {
  if (sleepRecords.length === 0) return 0;
  
  const totalMinutes = sleepRecords.reduce((acc, record) => {
    return acc + calculateSleepDurationMinutes(record.sleepTime, record.wakeTime, record.date);
  }, 0);
  
  return totalMinutes / sleepRecords.length;
};

// Format duration in minutes to hours and minutes
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  
  if (mins === 0) {
    return `${hours}小時`;
  }
  return `${hours}小時${mins}分鐘`;
};

// Get sleep records within a date range
export const getSleepRecordsInRange = (
  sleepRecords: SleepRecord[], 
  startDate: Date, 
  endDate: Date
) => {
  return sleepRecords.filter(record => {
    const recordDate = parseISO(record.date);
    return isWithinInterval(recordDate, { start: startDate, end: endDate });
  });
};

// Calculate total sleep duration for a specific date (across all segments)
export const calculateTotalSleepDurationForDate = (
  sleepRecords: SleepRecord[],
  date: string
): number => {
  const recordsForDate = sleepRecords.filter(record => record.date === date);
  
  if (recordsForDate.length === 0) return 0;
  
  return recordsForDate.reduce((total, record) => {
    return total + calculateSleepDurationMinutes(record.sleepTime, record.wakeTime, record.date);
  }, 0);
};

// Get sleep records since the last doctor visit
export const getSleepRecordsSinceLastVisit = (
  sleepRecords: SleepRecord[],
  doctorVisits: DoctorVisit[]
) => {
  if (doctorVisits.length === 0) return sleepRecords;
  
  // Sort doctor visits by date (newest first)
  const sortedVisits = [...doctorVisits].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const lastVisitDate = parseISO(sortedVisits[0].date);
  
  return sleepRecords.filter(record => {
    const recordDate = parseISO(record.date);
    return recordDate >= lastVisitDate;
  });
};

// Calculate average sleep quality
export const calculateAverageSleepQuality = (sleepRecords: SleepRecord[]) => {
  if (sleepRecords.length === 0) return 0;
  
  const sum = sleepRecords.reduce((acc, record) => acc + record.quality, 0);
  return sum / sleepRecords.length;
};

// Calculate the most frequent personality
export const getMostFrequentPersonality = (sleepRecords: SleepRecord[]) => {
  const personalityCount: Record<string, number> = {};
  
  sleepRecords.forEach(record => {
    record.personalities?.forEach(p => {
      personalityCount[p.personality] = (personalityCount[p.personality] || 0) + 1;
    });
  });
  
  if (Object.keys(personalityCount).length === 0) return "無數據";
  
  return Object.entries(personalityCount)
    .sort((a, b) => b[1] - a[1])
    [0][0];
};

// Get last n days date range
export const getLastNDaysRange = (days: number) => {
  const endDate = new Date();
  const startDate = subDays(endDate, days - 1); // -1 because we include today
  return { startDate, endDate };
};

// Format time for display (HH:MM) - 24-hour format
export const formatTime = (time: string) => {
  return time;
};

// Parse time strings to Date objects
export const parseTime = (time: string, date: string) => {
  return new Date(`${date}T${time}:00`);
};

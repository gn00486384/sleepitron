
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useData } from "../../contexts/DataContext";
import { getLastNDaysRange } from "../../utils/dateUtils";

interface AnalysisDateRangePickerProps {
  startDate: Date;
  endDate: Date;
  onDateRangeChange: (startDate: Date, endDate: Date) => void;
}

const AnalysisDateRangePicker = ({
  startDate,
  endDate,
  onDateRangeChange,
}: AnalysisDateRangePickerProps) => {
  const { doctorVisits } = useData();
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isEndOpen, setIsEndOpen] = useState(false);

  // Get the latest doctor visit
  const getLastDoctorVisitDate = () => {
    if (doctorVisits.length === 0) return null;

    const sortedVisits = [...doctorVisits].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return new Date(sortedVisits[0].date);
  };

  // Preset date ranges
  const handlePresetRange = (days: number) => {
    const { startDate: newStart, endDate: newEnd } = getLastNDaysRange(days);
    onDateRangeChange(newStart, newEnd);
  };

  // Since last doctor visit
  const handleSinceLastVisit = () => {
    const lastVisitDate = getLastDoctorVisitDate();
    if (lastVisitDate) {
      onDateRangeChange(lastVisitDate, new Date());
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="flex gap-2">
        <Popover open={isStartOpen} onOpenChange={setIsStartOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "justify-start text-left font-normal w-[150px]",
                !startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, "yyyy/MM/dd") : "選擇開始日期"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={(date) => {
                if (date) {
                  onDateRangeChange(date, endDate);
                  setIsStartOpen(false);
                }
              }}
              initialFocus
              disabled={(date) => date > endDate || date > new Date()}
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>

        <span className="flex items-center">至</span>

        <Popover open={isEndOpen} onOpenChange={setIsEndOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "justify-start text-left font-normal w-[150px]",
                !endDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, "yyyy/MM/dd") : "選擇結束日期"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={(date) => {
                if (date) {
                  onDateRangeChange(startDate, date);
                  setIsEndOpen(false);
                }
              }}
              initialFocus
              disabled={(date) => date < startDate || date > new Date()}
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">快速選擇</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handlePresetRange(7)}>
              最近7天
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handlePresetRange(14)}>
              最近14天
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handlePresetRange(30)}>
              最近30天
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSinceLastVisit()}>
              自上次看醫生以來
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default AnalysisDateRangePicker;

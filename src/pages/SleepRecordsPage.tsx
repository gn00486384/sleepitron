
import { useState } from "react";
import { useData } from "../contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, Clock } from "lucide-react";
import SleepRecordForm from "../components/sleep/SleepRecordForm";
import SleepRecordCard from "../components/sleep/SleepRecordCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const SleepRecordsPage = () => {
  const { sleepRecords } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Sort records by date (newest first)
  const sortedRecords = [...sleepRecords].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Filter records by search query
  const filteredRecords = sortedRecords.filter(
    (record) =>
      record.date.includes(searchQuery) ||
      record.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (record.medications && 
        record.medications.toLowerCase().includes(searchQuery.toLowerCase())) ||
      record.personalities?.some(
        (p) =>
          p.personality.includes(searchQuery) ||
          p.notes.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  // Group records by date
  const recordsByDate = filteredRecords.reduce((acc, record) => {
    if (!acc[record.date]) {
      acc[record.date] = [];
    }
    acc[record.date].push(record);
    return acc;
  }, {} as Record<string, typeof sleepRecords>);

  // Get unique dates
  const dates = Object.keys(recordsByDate).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  const handleAddSleepRecord = (date?: string) => {
    setSelectedDate(date || null);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">睡眠記錄</h1>
        <div className="flex w-full sm:w-auto gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜尋記錄..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            onClick={() => handleAddSleepRecord()}
            className="bg-sleep hover:bg-sleep-dark whitespace-nowrap"
          >
            <PlusCircle className="mr-1 h-4 w-4" />
            新增記錄
          </Button>
        </div>
      </div>

      {dates.length > 0 ? (
        <Accordion type="multiple" defaultValue={[dates[0]]} className="space-y-4">
          {dates.map((date) => (
            <AccordionItem key={date} value={date} className="border rounded-lg">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex justify-between items-center w-full">
                  <span className="font-semibold">{date}</span>
                  <Button
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddSleepRecord(date);
                    }}
                    className="text-xs flex items-center gap-1"
                  >
                    <Clock className="h-3.5 w-3.5" />
                    新增時段
                  </Button>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-2 pb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recordsByDate[date].map((record) => (
                    <SleepRecordCard key={record.id} record={record} />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-muted/20 rounded-lg">
          <p className="text-muted-foreground mb-2">沒有找到睡眠記錄</p>
          <Button
            variant="outline"
            onClick={() => setModalOpen(true)}
          >
            添加第一條記錄
          </Button>
        </div>
      )}

      <SleepRecordForm 
        open={modalOpen} 
        onOpenChange={setModalOpen} 
        initialDate={selectedDate || undefined}
      />
    </div>
  );
};

export default SleepRecordsPage;

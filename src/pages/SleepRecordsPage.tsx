
import { useState } from "react";
import { useData } from "../contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search } from "lucide-react";
import SleepRecordForm from "../components/sleep/SleepRecordForm";
import SleepRecordCard from "../components/sleep/SleepRecordCard";

const SleepRecordsPage = () => {
  const { sleepRecords } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
            onClick={() => setModalOpen(true)}
            className="bg-sleep hover:bg-sleep-dark whitespace-nowrap"
          >
            <PlusCircle className="mr-1 h-4 w-4" />
            新增記錄
          </Button>
        </div>
      </div>

      {filteredRecords.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecords.map((record) => (
            <SleepRecordCard key={record.id} record={record} />
          ))}
        </div>
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

      <SleepRecordForm open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
};

export default SleepRecordsPage;

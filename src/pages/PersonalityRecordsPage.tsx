
import { useState } from "react";
import { useData } from "../contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, Edit, Trash2, User } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import PersonalityForm from "../components/sleep/PersonalityForm";
import { formatDate } from "../utils/dateUtils";

const PersonalityRecordsPage = () => {
  const { sleepRecords, deletePersonalityRecord } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [editRecord, setEditRecord] = useState<{id: string, sleepRecordId: string} | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Flatten personality records from all sleep records
  const allPersonalityRecords = sleepRecords.flatMap(sleepRecord => 
    (sleepRecord.personalities || []).map(personality => ({
      ...personality,
      sleepDate: sleepRecord.date
    }))
  );

  // Sort records by date (newest first) and then by start time
  const sortedRecords = [...allPersonalityRecords].sort((a, b) => {
    // First compare by sleep record date (descending)
    const dateComparison = new Date(b.sleepDate).getTime() - new Date(a.sleepDate).getTime();
    if (dateComparison !== 0) return dateComparison;
    
    // Then compare by start time
    return a.startTime.localeCompare(b.startTime);
  });

  // Filter records by search query
  const filteredRecords = sortedRecords.filter(
    record =>
      record.sleepDate?.includes(searchQuery) ||
      record.personality.includes(searchQuery) ||
      record.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.startTime.includes(searchQuery) ||
      record.endTime.includes(searchQuery)
  );

  const handleEdit = (id: string, sleepRecordId: string) => {
    setEditRecord({ id, sleepRecordId });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditRecord(null);
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">人格紀錄明細</h1>
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
        </div>
      </div>

      {filteredRecords.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>日期</TableHead>
                <TableHead>人格</TableHead>
                <TableHead>時間</TableHead>
                <TableHead>備註</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{formatDate(record.sleepDate)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="flex w-fit items-center gap-1 px-2 py-1">
                      <User className="h-3 w-3" />
                      <span>{record.personality}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>{record.startTime} - {record.endTime}</TableCell>
                  <TableCell className="max-w-xs truncate">{record.notes}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(record.id, record.sleepRecordId)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>確認刪除</AlertDialogTitle>
                            <AlertDialogDescription>
                              您確定要刪除此人格記錄嗎？此操作不可逆轉。
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>取消</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deletePersonalityRecord(record.id)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              刪除
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-muted/20 rounded-lg">
          <p className="text-muted-foreground mb-2">沒有找到人格紀錄</p>
        </div>
      )}

      {editRecord && (
        <PersonalityForm
          open={modalOpen}
          onOpenChange={handleCloseModal}
          sleepRecordId={editRecord.sleepRecordId}
          editRecord={allPersonalityRecords.find(p => p.id === editRecord.id)}
        />
      )}
    </div>
  );
};

export default PersonalityRecordsPage;

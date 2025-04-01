
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Bed,
  Clock,
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  Plus,
  User,
  Pill,
} from "lucide-react";
import { format } from "date-fns";
import { useData, SleepRecord, PersonalityRecord } from "../../contexts/DataContext";
import SleepRecordForm from "./SleepRecordForm";
import PersonalityForm from "./PersonalityForm";
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
import { formatDate, calculateSleepDuration } from "../../utils/dateUtils";

interface SleepRecordCardProps {
  record: SleepRecord;
}

const SleepRecordCard = ({ record }: SleepRecordCardProps) => {
  const { deleteSleepRecord } = useData();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [personalityModalOpen, setPersonalityModalOpen] = useState(false);
  const [editPersonality, setEditPersonality] = useState<PersonalityRecord | undefined>(undefined);

  const getQualityColor = (quality: number) => {
    if (quality >= 8) return "bg-green-100 text-green-800";
    if (quality >= 5) return "bg-amber-100 text-amber-800";
    return "bg-red-100 text-red-800";
  };

  const handleEditPersonality = (personality: PersonalityRecord) => {
    setEditPersonality(personality);
    setPersonalityModalOpen(true);
  };

  const handleClosePersonalityModal = () => {
    setEditPersonality(undefined);
    setPersonalityModalOpen(false);
  };

  return (
    <>
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(record.date)}
                {record.edited && (
                  <Badge variant="outline" className="ml-2 text-xs">
                    已編輯
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="mt-1">
                <div className="flex items-center text-sm">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  <span>
                    {record.sleepTime} - {record.wakeTime}（
                    {calculateSleepDuration(
                      record.sleepTime,
                      record.wakeTime,
                      record.date
                    )}
                    ）
                  </span>
                </div>
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={getQualityColor(record.quality)}>
                質量: {record.quality}/10
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setEditModalOpen(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    編輯記錄
                  </DropdownMenuItem>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem
                        className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                        onSelect={(e) => e.preventDefault()}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        刪除記錄
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>確認刪除</AlertDialogTitle>
                        <AlertDialogDescription>
                          您確定要刪除此睡眠記錄嗎？此操作不可逆轉。
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteSleepRecord(record.id)}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          刪除
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          {record.medications && (
            <div className="mb-3 flex items-center">
              <Badge variant="outline" className="flex items-center gap-1 px-2 py-1">
                <Pill className="h-3 w-3" />
                <span>{record.medications}</span>
              </Badge>
            </div>
          )}
          
          {record.notes && <p className="text-sm text-muted-foreground">{record.notes}</p>}

          {record.personalities && record.personalities.length > 0 && (
            <div className="mt-3">
              <h4 className="text-sm font-medium mb-2">人格出現記錄：</h4>
              <div className="space-y-2">
                {record.personalities.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between bg-secondary rounded-md p-2 text-sm"
                  >
                    <div className="flex items-center">
                      <User className="h-3.5 w-3.5 mr-1" />
                      <span className="font-medium mr-2">{p.personality}</span>
                      <span className="text-muted-foreground">
                        {p.startTime} - {p.endTime}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleEditPersonality(p)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPersonalityModalOpen(true)}
            className="text-xs w-full"
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> 添加人格記錄
          </Button>
        </CardFooter>
      </Card>

      <SleepRecordForm
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        editRecord={record}
      />

      <PersonalityForm
        open={personalityModalOpen}
        onOpenChange={handleClosePersonalityModal}
        sleepRecordId={record.id}
        editRecord={editPersonality}
      />
    </>
  );
};

export default SleepRecordCard;

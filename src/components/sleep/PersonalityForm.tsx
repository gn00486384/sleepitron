import { useState, useEffect } from "react";
import { useData } from "../../contexts/DataContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PersonalityFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sleepRecordId: string;
  editRecord?: PersonalityRecord;
}

const personalities = ["宇辰", "空", "貓咪", "昕儀"] as const;

const PersonalityForm = ({
  open,
  onOpenChange,
  sleepRecordId,
  editRecord,
}: PersonalityFormProps) => {
  const { addPersonalityRecord, updatePersonalityRecord } = useData();
  const [personality, setPersonality] = useState<"宇辰" | "空" | "貓咪" | "昕儀">("宇辰");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editRecord) {
      setPersonality(editRecord.personality);
      setStartTime(editRecord.startTime);
      setEndTime(editRecord.endTime);
      setNotes(editRecord.notes);
    } else {
      resetForm();
    }
  }, [editRecord, open]);

  const resetForm = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const currentTime = `${hours}:${minutes}`;

    setPersonality("宇辰");
    setStartTime(currentTime);
    setEndTime(currentTime);
    setNotes("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const recordData = {
      sleepRecordId,
      personality,
      startTime,
      endTime,
      notes,
    };

    try {
      if (editRecord) {
        await updatePersonalityRecord(editRecord.id, recordData);
      } else {
        await addPersonalityRecord(recordData);
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving personality record:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isSubmitting) {
        onOpenChange(isOpen);
      }
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editRecord ? "編輯人格記錄" : "添加人格記錄"}
          </DialogTitle>
          <DialogDescription>
            請記錄人格出現的時間和細節
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="personality">人格</Label>
            <Select
              value={personality}
              onValueChange={(value: "宇辰" | "空" | "貓咪" | "昕儀") => setPersonality(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="選擇人格" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {personalities.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">開始時間 (24小時制)</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">結束時間 (24小時制)</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">備註</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="關於此人格狀態的備註..."
              className="min-h-[80px]"
            />
          </div>

          <DialogFooter>
            <Button 
              type="submit" 
              className="bg-sleep hover:bg-sleep-dark"
              disabled={isSubmitting}
            >
              {isSubmitting ? "處理中..." : (editRecord ? "更新" : "儲存")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PersonalityForm;

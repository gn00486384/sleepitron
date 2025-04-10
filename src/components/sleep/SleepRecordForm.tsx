import { useState, useEffect } from "react";
import { useData, SleepRecord } from "../../contexts/DataContext";
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
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";

interface SleepRecordFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editRecord?: SleepRecord;
  initialDate?: string;
}

const SleepRecordForm = ({
  open,
  onOpenChange,
  editRecord,
  initialDate,
}: SleepRecordFormProps) => {
  const { addSleepRecord, updateSleepRecord } = useData();
  const [date, setDate] = useState("");
  const [sleepTime, setSleepTime] = useState("");
  const [wakeTime, setWakeTime] = useState("");
  const [quality, setQuality] = useState(5);
  const [notes, setNotes] = useState("");
  const [medications, setMedications] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editRecord) {
      setDate(editRecord.date);
      setSleepTime(editRecord.sleepTime);
      setWakeTime(editRecord.wakeTime);
      setQuality(editRecord.quality);
      setNotes(editRecord.notes);
      setMedications(editRecord.medications || "");
    } else if (initialDate) {
      setDate(initialDate);
      resetTimeFields();
    } else {
      resetForm();
    }
  }, [editRecord, open, initialDate]);

  const resetTimeFields = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const currentTime = `${hours}:${minutes}`;

    setSleepTime(currentTime);
    setWakeTime(currentTime);
  };

  const resetForm = () => {
    setDate("");
    resetTimeFields();
    setQuality(5);
    setNotes("");
    setMedications("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const recordData = {
      date,
      sleepTime,
      wakeTime,
      quality,
      notes,
      medications,
    };

    try {
      if (editRecord) {
        await updateSleepRecord(editRecord.id, recordData);
      } else {
        await addSleepRecord(recordData);
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving sleep record:", error);
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
          <DialogTitle>{editRecord ? "編輯睡眠記錄" : "添加睡眠記錄"}</DialogTitle>
          <DialogDescription>
            請填寫您的睡眠記錄
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="date">日期</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sleepTime">入睡時間 (24小時制)</Label>
              <Input
                id="sleepTime"
                type="time"
                value={sleepTime}
                onChange={(e) => setSleepTime(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="wakeTime">起床時間 (24小時制)</Label>
              <Input
                id="wakeTime"
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quality">睡眠質量 (1-10)</Label>
            <Slider
              id="quality"
              defaultValue={[quality]}
              max={10}
              min={1}
              step={1}
              onValueChange={(value) => setQuality(value[0])}
            />
            <p className="text-sm text-muted-foreground">
              您選擇的睡眠質量: {quality}/10
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="medications">服用藥物</Label>
            <Input
              id="medications"
              type="text"
              value={medications}
              onChange={(e) => setMedications(e.target.value)}
              placeholder="若有，請填寫藥物名稱"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">備註</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="關於睡眠的備註..."
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

export default SleepRecordForm;

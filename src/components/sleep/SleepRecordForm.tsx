
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface SleepRecordFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editRecord?: SleepRecord;
}

const SleepRecordForm = ({ open, onOpenChange, editRecord }: SleepRecordFormProps) => {
  const { addSleepRecord, updateSleepRecord } = useData();
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [sleepTime, setSleepTime] = useState("22:00");
  const [wakeTime, setWakeTime] = useState("07:00");
  const [quality, setQuality] = useState(7);
  const [notes, setNotes] = useState("");
  const [medications, setMedications] = useState("");

  useEffect(() => {
    if (editRecord) {
      setDate(editRecord.date);
      setSleepTime(editRecord.sleepTime);
      setWakeTime(editRecord.wakeTime);
      setQuality(editRecord.quality);
      setNotes(editRecord.notes);
      setMedications(editRecord.medications || "");
    }
  }, [editRecord]);

  const resetForm = () => {
    setDate(new Date().toISOString().split("T")[0]);
    setSleepTime("22:00");
    setWakeTime("07:00");
    setQuality(7);
    setNotes("");
    setMedications("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const sleepRecord = {
      date,
      sleepTime,
      wakeTime,
      quality,
      notes,
      medications,
    };
    
    if (editRecord) {
      updateSleepRecord(editRecord.id, sleepRecord);
    } else {
      addSleepRecord(sleepRecord);
    }
    
    onOpenChange(false);
    if (!editRecord) {
      resetForm();
    }
  };

  const qualityLabels = ["很差", "差", "一般", "好", "很好"];
  const getQualityLabel = () => {
    const index = Math.min(Math.floor(quality / 2), 4);
    return qualityLabels[index];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editRecord ? "編輯睡眠記錄" : "添加睡眠記錄"}
          </DialogTitle>
          <DialogDescription>
            請填寫您的睡眠記錄詳情
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-1 gap-4">
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
                <Label htmlFor="sleepTime">入睡時間</Label>
                <Input
                  id="sleepTime"
                  type="time"
                  value={sleepTime}
                  onChange={(e) => setSleepTime(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="wakeTime">醒來時間</Label>
                <Input
                  id="wakeTime"
                  type="time"
                  value={wakeTime}
                  onChange={(e) => setWakeTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="quality">睡眠質量</Label>
                <span className="text-sm font-medium">
                  {quality}/10 ({getQualityLabel()})
                </span>
              </div>
              <Slider
                id="quality"
                min={1}
                max={10}
                step={1}
                value={[quality]}
                onValueChange={(value) => setQuality(value[0])}
                className="py-2"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="medications">用藥信息</Label>
              <Input
                id="medications"
                value={medications}
                onChange={(e) => setMedications(e.target.value)}
                placeholder="服用的藥物和劑量"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">備註</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="任何其他相關信息..."
                className="min-h-[80px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" className="bg-sleep hover:bg-sleep-dark">
              {editRecord ? "更新" : "儲存"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SleepRecordForm;

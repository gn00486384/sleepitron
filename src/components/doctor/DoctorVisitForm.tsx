
import { useState, useEffect } from "react";
import { useData, DoctorVisit } from "../../contexts/DataContext";
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

interface DoctorVisitFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editVisit?: DoctorVisit;
}

const DoctorVisitForm = ({
  open,
  onOpenChange,
  editVisit,
}: DoctorVisitFormProps) => {
  const { addDoctorVisit, updateDoctorVisit } = useData();
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const [prescriptions, setPrescriptions] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");

  useEffect(() => {
    if (editVisit) {
      setDate(editVisit.date);
      setNotes(editVisit.notes);
      setPrescriptions(editVisit.prescriptions);
      setFollowUpDate(editVisit.followUpDate || "");
    } else {
      resetForm();
    }
  }, [editVisit, open]);

  const resetForm = () => {
    setDate(new Date().toISOString().split("T")[0]);
    setNotes("");
    setPrescriptions("");
    setFollowUpDate("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const visitData = {
      date,
      notes,
      prescriptions,
      followUpDate: followUpDate || undefined,
    };

    if (editVisit) {
      updateDoctorVisit(editVisit.id, visitData);
    } else {
      addDoctorVisit(visitData);
    }

    onOpenChange(false);
    if (!editVisit) {
      resetForm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editVisit ? "編輯醫生訪問記錄" : "添加醫生訪問記錄"}
          </DialogTitle>
          <DialogDescription>
            記錄您的醫生訪問詳情和處方
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">訪問日期</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">醫生備註</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="醫生的診斷和建議..."
                className="min-h-[100px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prescriptions">處方</Label>
              <Textarea
                id="prescriptions"
                value={prescriptions}
                onChange={(e) => setPrescriptions(e.target.value)}
                placeholder="開具的藥物和劑量..."
                className="min-h-[80px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="followUpDate">下次訪問日期</Label>
              <Input
                id="followUpDate"
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" className="bg-sleep hover:bg-sleep-dark">
              {editVisit ? "更新" : "保存"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DoctorVisitForm;

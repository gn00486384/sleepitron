
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  Pill,
  CalendarClock,
  Loader2,
} from "lucide-react";
import { useData, DoctorVisit } from "../../contexts/DataContext";
import DoctorVisitForm from "./DoctorVisitForm";
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
import { formatDate } from "../../utils/dateUtils";

interface DoctorVisitCardProps {
  visit: DoctorVisit;
}

const DoctorVisitCard = ({ visit }: DoctorVisitCardProps) => {
  const { deleteDoctorVisit } = useData();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteDoctorVisit(visit.id);
    } catch (error) {
      console.error("Error deleting doctor visit:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(visit.date)}
              </CardTitle>
            </div>
            <div className="flex space-x-2">
              {visit.followUpDate && (
                <Badge variant="outline" className="flex items-center">
                  <CalendarClock className="mr-1 h-3 w-3" />
                  下次訪問: {formatDate(visit.followUpDate)}
                </Badge>
              )}
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
                          您確定要刪除此醫生訪問記錄嗎？此操作不可逆轉。
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          className="bg-destructive hover:bg-destructive/90"
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                              處理中...
                            </>
                          ) : (
                            "刪除"
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-3 space-y-3">
          <div>
            <h4 className="text-sm font-medium mb-1">醫生備註：</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {visit.notes}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-1 flex items-center">
              <Pill className="h-3.5 w-3.5 mr-1" />
              處方：
            </h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {visit.prescriptions}
            </p>
          </div>
        </CardContent>
      </Card>

      <DoctorVisitForm
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        editVisit={visit}
      />
    </>
  );
};

export default DoctorVisitCard;

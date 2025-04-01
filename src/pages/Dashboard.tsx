
import { useEffect, useState } from "react";
import { useData } from "../contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bed, Calendar, Stethoscope, PlusCircle, ClipboardList } from "lucide-react";
import SleepRecordForm from "../components/sleep/SleepRecordForm";
import DoctorVisitForm from "../components/doctor/DoctorVisitForm";
import { formatDate } from "../utils/dateUtils";
import { getLastNDaysRange } from "../utils/dateUtils";
import SleepQualityChart from "../components/analysis/SleepQualityChart";

const Dashboard = () => {
  const { sleepRecords, doctorVisits } = useData();
  const [sleepModalOpen, setSleepModalOpen] = useState(false);
  const [doctorModalOpen, setDoctorModalOpen] = useState(false);

  // Get recent sleep records (last 7 days)
  const { startDate, endDate } = getLastNDaysRange(7);
  const recentSleepRecords = sleepRecords
    .filter((record) => {
      const recordDate = new Date(record.date);
      return recordDate >= startDate && recordDate <= endDate;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Get most recent doctor visit
  const lastDoctorVisit = [...doctorVisits]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    [0];

  // Get upcoming doctor visit
  const upcomingDoctorVisit = doctorVisits
    .filter((visit) => visit.followUpDate && new Date(visit.followUpDate) >= new Date())
    .sort(
      (a, b) =>
        new Date(a.followUpDate!).getTime() - new Date(b.followUpDate!).getTime()
    )[0];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">儀表板</h1>
        <div className="space-x-2">
          <Button
            onClick={() => setSleepModalOpen(true)}
            className="bg-sleep hover:bg-sleep-dark"
          >
            <PlusCircle className="mr-1 h-4 w-4" /> 新增睡眠記錄
          </Button>
          <Button
            onClick={() => setDoctorModalOpen(true)}
            variant="outline"
          >
            <PlusCircle className="mr-1 h-4 w-4" /> 新增醫生訪問
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Bed className="mr-2 h-5 w-5" />
              最近睡眠記錄
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentSleepRecords.length > 0 ? (
              <div className="space-y-3">
                {recentSleepRecords.slice(0, 5).map((record) => (
                  <div
                    key={record.id}
                    className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{formatDate(record.date)}</p>
                      <p className="text-xs text-muted-foreground">
                        {record.sleepTime} - {record.wakeTime}
                      </p>
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        record.quality >= 7
                          ? "text-green-500"
                          : record.quality >= 5
                          ? "text-amber-500"
                          : "text-red-500"
                      }`}
                    >
                      {record.quality}/10
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                沒有最近的睡眠記錄
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Stethoscope className="mr-2 h-5 w-5" />
              醫生訪問信息
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {lastDoctorVisit ? (
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium">最近訪問</p>
                  <p className="text-lg">{formatDate(lastDoctorVisit.date)}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {lastDoctorVisit.notes}
                  </p>
                </div>

                {upcomingDoctorVisit && (
                  <div>
                    <p className="text-sm font-medium">下次預約</p>
                    <p className="text-lg">
                      {formatDate(upcomingDoctorVisit.followUpDate!)}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                沒有醫生訪問記錄
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <ClipboardList className="mr-2 h-5 w-5" />
              統計摘要
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <p className="text-muted-foreground">總睡眠記錄</p>
                <p className="font-medium">{sleepRecords.length}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-muted-foreground">總醫生訪問</p>
                <p className="font-medium">{doctorVisits.length}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-muted-foreground">平均睡眠質量</p>
                <p className="font-medium">
                  {sleepRecords.length > 0
                    ? (
                        sleepRecords.reduce((sum, record) => sum + record.quality, 0) /
                        sleepRecords.length
                      ).toFixed(1)
                    : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <SleepQualityChart sleepRecords={recentSleepRecords} />
      </div>

      <SleepRecordForm
        open={sleepModalOpen}
        onOpenChange={setSleepModalOpen}
      />

      <DoctorVisitForm
        open={doctorModalOpen}
        onOpenChange={setDoctorModalOpen}
      />
    </div>
  );
};

export default Dashboard;

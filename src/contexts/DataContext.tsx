
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

// Types
export interface SleepRecord {
  id: string;
  date: string;
  sleepTime: string;
  wakeTime: string;
  quality: number;
  notes: string;
  personalities?: PersonalityRecord[];
  medications?: string;
  edited?: boolean;
}

export interface PersonalityRecord {
  id: string;
  sleepRecordId: string;
  personality: "宇辰" | "空" | "貓咪" | "欣怡";
  startTime: string;
  endTime: string;
  notes: string;
}

export interface DoctorVisit {
  id: string;
  date: string;
  notes: string;
  prescriptions: string;
  followUpDate?: string;
}

// Data context type
interface DataContextType {
  sleepRecords: SleepRecord[];
  doctorVisits: DoctorVisit[];
  addSleepRecord: (record: Omit<SleepRecord, "id">) => void;
  updateSleepRecord: (id: string, record: Partial<SleepRecord>) => void;
  deleteSleepRecord: (id: string) => void;
  addPersonalityRecord: (record: Omit<PersonalityRecord, "id">) => void;
  updatePersonalityRecord: (id: string, record: Partial<PersonalityRecord>) => void;
  deletePersonalityRecord: (id: string) => void;
  addDoctorVisit: (visit: Omit<DoctorVisit, "id">) => void;
  updateDoctorVisit: (id: string, visit: Partial<DoctorVisit>) => void;
  deleteDoctorVisit: (id: string) => void;
  loading: boolean;
}

// Create the context
export const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock initial data
const MOCK_SLEEP_RECORDS: SleepRecord[] = [
  {
    id: "1",
    date: "2023-09-10",
    sleepTime: "22:30",
    wakeTime: "07:15",
    quality: 8,
    notes: "安眠藥服用後很快入睡",
    personalities: [
      {
        id: "p1",
        sleepRecordId: "1",
        personality: "宇辰",
        startTime: "19:00",
        endTime: "22:00",
        notes: "情緒穩定",
      }
    ],
    medications: "安眠藥 5mg",
  },
  {
    id: "2",
    date: "2023-09-11",
    sleepTime: "23:00",
    wakeTime: "06:45",
    quality: 6,
    notes: "睡眠中醒來一次",
    personalities: [
      {
        id: "p2",
        sleepRecordId: "2",
        personality: "空",
        startTime: "18:00",
        endTime: "23:00",
        notes: "有些焦慮",
      }
    ],
    medications: "安眠藥 5mg",
  },
];

const MOCK_DOCTOR_VISITS: DoctorVisit[] = [
  {
    id: "1",
    date: "2023-09-01",
    notes: "患者報告睡眠不佳，有焦慮症狀",
    prescriptions: "安眠藥 5mg，每晚睡前服用",
    followUpDate: "2023-10-01",
  }
];

// Create the data provider
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [sleepRecords, setSleepRecords] = useState<SleepRecord[]>([]);
  const [doctorVisits, setDoctorVisits] = useState<DoctorVisit[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // In a real app, this would fetch from an API
      const storedSleepRecords = localStorage.getItem("sleepitron_sleep_records");
      const storedDoctorVisits = localStorage.getItem("sleepitron_doctor_visits");
      
      setSleepRecords(storedSleepRecords ? JSON.parse(storedSleepRecords) : MOCK_SLEEP_RECORDS);
      setDoctorVisits(storedDoctorVisits ? JSON.parse(storedDoctorVisits) : MOCK_DOCTOR_VISITS);
    } else {
      setSleepRecords([]);
      setDoctorVisits([]);
    }
    setLoading(false);
  }, [isAuthenticated]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem("sleepitron_sleep_records", JSON.stringify(sleepRecords));
      localStorage.setItem("sleepitron_doctor_visits", JSON.stringify(doctorVisits));
    }
  }, [sleepRecords, doctorVisits, isAuthenticated]);

  // Sleep record functions
  const addSleepRecord = (record: Omit<SleepRecord, "id">) => {
    const newRecord: SleepRecord = {
      ...record,
      id: Math.random().toString(36).substring(2, 9),
      personalities: record.personalities || [],
    };
    setSleepRecords(prev => [...prev, newRecord]);
    toast.success("睡眠記錄已添加");
  };

  const updateSleepRecord = (id: string, record: Partial<SleepRecord>) => {
    setSleepRecords(prev => 
      prev.map(r => r.id === id ? { ...r, ...record, edited: true } : r)
    );
    toast.success("睡眠記錄已更新");
  };

  const deleteSleepRecord = (id: string) => {
    setSleepRecords(prev => prev.filter(r => r.id !== id));
    toast.success("睡眠記錄已刪除");
  };

  // Personality record functions
  const addPersonalityRecord = (record: Omit<PersonalityRecord, "id">) => {
    const newRecord: PersonalityRecord = {
      ...record,
      id: Math.random().toString(36).substring(2, 9),
    };
    
    setSleepRecords(prev => 
      prev.map(r => {
        if (r.id === record.sleepRecordId) {
          return { 
            ...r, 
            personalities: [...(r.personalities || []), newRecord],
          };
        }
        return r;
      })
    );
    toast.success("人格記錄已添加");
  };

  const updatePersonalityRecord = (id: string, record: Partial<PersonalityRecord>) => {
    setSleepRecords(prev => 
      prev.map(r => {
        if (r.personalities?.some(p => p.id === id)) {
          return {
            ...r,
            personalities: r.personalities.map(p => 
              p.id === id ? { ...p, ...record } : p
            ),
            edited: true
          };
        }
        return r;
      })
    );
    toast.success("人格記錄已更新");
  };

  const deletePersonalityRecord = (id: string) => {
    setSleepRecords(prev => 
      prev.map(r => {
        if (r.personalities?.some(p => p.id === id)) {
          return {
            ...r,
            personalities: r.personalities.filter(p => p.id !== id),
            edited: true
          };
        }
        return r;
      })
    );
    toast.success("人格記錄已刪除");
  };

  // Doctor visit functions
  const addDoctorVisit = (visit: Omit<DoctorVisit, "id">) => {
    const newVisit: DoctorVisit = {
      ...visit,
      id: Math.random().toString(36).substring(2, 9),
    };
    setDoctorVisits(prev => [...prev, newVisit]);
    toast.success("醫生訪問記錄已添加");
  };

  const updateDoctorVisit = (id: string, visit: Partial<DoctorVisit>) => {
    setDoctorVisits(prev => 
      prev.map(v => v.id === id ? { ...v, ...visit } : v)
    );
    toast.success("醫生訪問記錄已更新");
  };

  const deleteDoctorVisit = (id: string) => {
    setDoctorVisits(prev => prev.filter(v => v.id !== id));
    toast.success("醫生訪問記錄已刪除");
  };

  const value = {
    sleepRecords,
    doctorVisits,
    addSleepRecord,
    updateSleepRecord,
    deleteSleepRecord,
    addPersonalityRecord,
    updatePersonalityRecord,
    deletePersonalityRecord,
    addDoctorVisit,
    updateDoctorVisit,
    deleteDoctorVisit,
    loading,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

// Custom hook to use the data context
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

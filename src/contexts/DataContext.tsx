import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

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
  personality: "宇辰" | "空" | "貓咪" | "昕儀";
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
  addSleepRecord: (record: Omit<SleepRecord, "id">) => Promise<string | undefined>;
  updateSleepRecord: (id: string, record: Partial<SleepRecord>) => Promise<void>;
  deleteSleepRecord: (id: string) => Promise<void>;
  addPersonalityRecord: (record: Omit<PersonalityRecord, "id">) => Promise<string | undefined>;
  updatePersonalityRecord: (id: string, record: Partial<PersonalityRecord>) => Promise<void>;
  deletePersonalityRecord: (id: string) => Promise<void>;
  addDoctorVisit: (visit: Omit<DoctorVisit, "id">) => Promise<void>;
  updateDoctorVisit: (id: string, visit: Partial<DoctorVisit>) => Promise<void>;
  deleteDoctorVisit: (id: string) => Promise<void>;
  loading: boolean;
}

// Create the context
export const DataContext = createContext<DataContextType | undefined>(undefined);

// Create the data provider
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [sleepRecords, setSleepRecords] = useState<SleepRecord[]>([]);
  const [doctorVisits, setDoctorVisits] = useState<DoctorVisit[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data when mounted
  useEffect(() => {
    fetchSleepRecords();
    fetchDoctorVisits();
  }, []);

  // Fetch sleep records from Supabase
  const fetchSleepRecords = async () => {
    setLoading(true);
    try {
      const { data: sleepData, error: sleepError } = await supabase
        .from('sleep_records')
        .select('*');

      if (sleepError) {
        throw sleepError;
      }

      const { data: personalityData, error: personalityError } = await supabase
        .from('personality_records')
        .select('*');

      if (personalityError) {
        throw personalityError;
      }

      // Map personality records to their sleep records
      const sleepRecordsWithPersonalities = sleepData.map(sleep => {
        const personalities = personalityData
          .filter(p => p.sleep_record_id === sleep.id)
          .map(p => ({
            id: p.id,
            sleepRecordId: p.sleep_record_id,
            personality: p.personality === "欣怡" ? "昕儀" : p.personality as "宇辰" | "空" | "貓咪" | "昕儀",
            startTime: p.start_time,
            endTime: p.end_time,
            notes: p.notes || ''
          }));

        return {
          id: sleep.id,
          date: sleep.date,
          sleepTime: sleep.sleep_time,
          wakeTime: sleep.wake_time,
          quality: sleep.quality,
          notes: sleep.notes || '',
          medications: sleep.medications || '',
          personalities
        };
      });

      setSleepRecords(sleepRecordsWithPersonalities);
    } catch (error) {
      console.error('Error fetching sleep records:', error);
      toast.error('睡眠記錄載入失敗');
    } finally {
      setLoading(false);
    }
  };

  // Fetch doctor visits from Supabase
  const fetchDoctorVisits = async () => {
    try {
      // Use type assertion to tell TypeScript that this is a valid table
      const { data, error } = await supabase
        .from('doctor_visits' as any)
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        throw error;
      }

      // Transform the data to match our DoctorVisit interface
      const formattedVisits: DoctorVisit[] = data.map((visit: any) => ({
        id: visit.id,
        date: visit.date,
        notes: visit.notes,
        prescriptions: visit.prescriptions,
        followUpDate: visit.follow_up_date,
      }));

      setDoctorVisits(formattedVisits);
    } catch (error) {
      console.error('Error fetching doctor visits:', error);
      toast.error('醫生訪問記錄載入失敗');
    }
  };

  // Sleep record functions
  const addSleepRecord = async (record: Omit<SleepRecord, "id">) => {
    try {
      const { data, error } = await supabase
        .from('sleep_records')
        .insert({
          date: record.date,
          sleep_time: record.sleepTime,
          wake_time: record.wakeTime,
          quality: record.quality,
          notes: record.notes,
          medications: record.medications
        })
        .select('id')
        .single();

      if (error) {
        throw error;
      }

      const newRecord: SleepRecord = {
        ...record,
        id: data?.id || '',
        personalities: [],
      };
      
      setSleepRecords(prev => [newRecord, ...prev]);
      toast.success("睡眠記錄已添加");
      return data?.id;
    } catch (error) {
      console.error('Error adding sleep record:', error);
      toast.error('添加睡眠記錄失敗');
      return undefined;
    }
  };

  const updateSleepRecord = async (id: string, record: Partial<SleepRecord>) => {
    try {
      const { error } = await supabase
        .from('sleep_records')
        .update({
          date: record.date,
          sleep_time: record.sleepTime,
          wake_time: record.wakeTime,
          quality: record.quality,
          notes: record.notes,
          medications: record.medications,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

      setSleepRecords(prev => 
        prev.map(r => r.id === id ? { ...r, ...record, edited: true } : r)
      );
      toast.success("睡眠記錄已更新");
    } catch (error) {
      console.error('Error updating sleep record:', error);
      toast.error('更新睡眠記錄失敗');
    }
  };

  const deleteSleepRecord = async (id: string) => {
    try {
      const { error } = await supabase
        .from('sleep_records')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setSleepRecords(prev => prev.filter(r => r.id !== id));
      toast.success("睡眠記錄已刪除");
    } catch (error) {
      console.error('Error deleting sleep record:', error);
      toast.error('刪除睡眠記錄失敗');
    }
  };

  // Personality record functions
  const addPersonalityRecord = async (record: Omit<PersonalityRecord, "id">) => {
    try {
      const { data, error } = await supabase
        .from('personality_records')
        .insert({
          sleep_record_id: record.sleepRecordId,
          personality: record.personality,
          start_time: record.startTime,
          end_time: record.endTime,
          notes: record.notes
        })
        .select('id')
        .single();

      if (error) {
        throw error;
      }

      const newRecord: PersonalityRecord = {
        ...record,
        id: data?.id || '',
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
      return data?.id;
    } catch (error) {
      console.error('Error adding personality record:', error);
      toast.error('添加人格記錄失敗');
      return undefined;
    }
  };

  const updatePersonalityRecord = async (id: string, record: Partial<PersonalityRecord>) => {
    try {
      const { error } = await supabase
        .from('personality_records')
        .update({
          personality: record.personality,
          start_time: record.startTime,
          end_time: record.endTime,
          notes: record.notes
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

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
    } catch (error) {
      console.error('Error updating personality record:', error);
      toast.error('更新人格記錄失敗');
    }
  };

  const deletePersonalityRecord = async (id: string) => {
    try {
      const { error } = await supabase
        .from('personality_records')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

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
    } catch (error) {
      console.error('Error deleting personality record:', error);
      toast.error('刪除人格記錄失敗');
    }
  };

  // Doctor visit functions with Supabase integration (using type assertions to fix TypeScript errors)
  const addDoctorVisit = async (visit: Omit<DoctorVisit, "id">) => {
    try {
      // Use type assertion to handle the doctor_visits table
      const { data, error } = await (supabase
        .from('doctor_visits' as any)
        .insert({
          date: visit.date,
          notes: visit.notes,
          prescriptions: visit.prescriptions,
          follow_up_date: visit.followUpDate
        })
        .select('id')
        .single() as any);

      if (error) {
        throw error;
      }

      const newVisit: DoctorVisit = {
        ...visit,
        id: data?.id || '',
      };
      
      setDoctorVisits(prev => [newVisit, ...prev]);
      toast.success("醫生訪問記錄已添加");
    } catch (error) {
      console.error('Error adding doctor visit:', error);
      toast.error('添加醫生訪問記錄失敗');
    }
  };

  const updateDoctorVisit = async (id: string, visit: Partial<DoctorVisit>) => {
    try {
      // Use type assertion to handle the doctor_visits table
      const { error } = await (supabase
        .from('doctor_visits' as any)
        .update({
          date: visit.date,
          notes: visit.notes,
          prescriptions: visit.prescriptions,
          follow_up_date: visit.followUpDate,
          updated_at: new Date().toISOString()
        })
        .eq('id', id) as any);

      if (error) {
        throw error;
      }

      setDoctorVisits(prev => 
        prev.map(v => v.id === id ? { ...v, ...visit } : v)
      );
      toast.success("醫生訪問記錄已更新");
    } catch (error) {
      console.error('Error updating doctor visit:', error);
      toast.error('更新醫生訪問記錄失敗');
    }
  };

  const deleteDoctorVisit = async (id: string) => {
    try {
      // Use type assertion to handle the doctor_visits table
      const { error } = await (supabase
        .from('doctor_visits' as any)
        .delete()
        .eq('id', id) as any);

      if (error) {
        throw error;
      }

      setDoctorVisits(prev => prev.filter(v => v.id !== id));
      toast.success("醫生訪問記錄已刪除");
    } catch (error) {
      console.error('Error deleting doctor visit:', error);
      toast.error('刪除醫生訪問記錄失敗');
    }
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

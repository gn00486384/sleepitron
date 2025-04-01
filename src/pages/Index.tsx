
import { useAuth } from "../contexts/AuthContext";
import LoginForm from "../components/auth/LoginForm";
import Dashboard from "./Dashboard";

const Index = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse-gentle text-sleep">載入中...</div>
      </div>
    );
  }

  return isAuthenticated ? (
    <Dashboard />
  ) : (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-sleep-light dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-sleep mb-2">Sleepitron</h1>
          <p className="text-muted-foreground">您的睡眠和用藥管理助手</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default Index;

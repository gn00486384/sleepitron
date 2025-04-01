
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Moon } from "lucide-react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      // Error is handled in the auth context
      console.error("Login failed:", error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="space-y-1 flex items-center justify-center flex-col">
        <div className="w-12 h-12 rounded-full bg-sleep flex items-center justify-center mb-2">
          <Moon className="text-white" size={20} />
        </div>
        <CardTitle className="text-2xl font-bold text-center">歡迎回來</CardTitle>
        <CardDescription className="text-center">
          登入您的睡眠管理系統帳戶
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              電子郵件
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium">
                密碼
              </label>
              <a href="#" className="text-xs text-sleep">
                忘記密碼?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button 
            type="submit" 
            className="w-full bg-sleep hover:bg-sleep-dark"
            disabled={loading}
          >
            {loading ? "登入中..." : "登入"}
          </Button>
          <div className="text-center text-sm">
            <span className="text-muted-foreground">還沒有帳戶? </span>
            {/* This would link to registration in a real app */}
            <a href="#" className="text-sleep hover:underline">
              註冊
            </a>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LoginForm;

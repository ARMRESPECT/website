import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { LogIn } from 'lucide-react';
import { toast } from '../hooks/use-toast';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = login(username, password);
    
    if (result.success) {
      toast({
        title: 'تم تسجيل الدخول بنجاح',
        description: 'مرحباً بك في لوحة التحكم',
      });
      setTimeout(() => {
        navigate('/admin');
      }, 500);
    } else {
      toast({
        title: 'خطأ في تسجيل الدخول',
        description: result.error,
        variant: 'destructive',
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-slate-700 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-md">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-xl">
            <LogIn className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-white">تسجيل الدخول</CardTitle>
          <CardDescription className="text-base text-gray-300">
            لوحة تحكم جيش ريسبكت
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-base text-gray-200">اسم المستخدم</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="h-12 text-base bg-slate-700/50 border-slate-600 text-white placeholder-gray-400 focus:border-purple-500"
                placeholder="أدخل اسم المستخدم"
                dir="rtl"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-base text-gray-200">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 text-base bg-slate-700/50 border-slate-600 text-white placeholder-gray-400 focus:border-purple-500"
                placeholder="أدخل كلمة المرور"
                dir="rtl"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg"
              disabled={loading}
            >
              {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </Button>

            <div className="text-center pt-4">
              <Button
                type="button"
                variant="link"
                onClick={() => navigate('/')}
                className="text-gray-300 hover:text-white"
              >
                العودة للصفحة الرئيسية
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
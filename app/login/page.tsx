"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { Building2 } from "lucide-react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error } = isLogin 
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });
      
      if (error) throw error;
      router.push("/dashboard");
    } catch (err: any) {
      // Простой перевод частых ошибок
      const msg = err.message;
      if (msg.includes("Invalid login credentials")) setError("Неверный email или пароль");
      else if (msg.includes("User already registered")) setError("Пользователь уже зарегистрирован");
      else setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d1117] px-4 font-sans text-[#f0f6fc]">
      <div className="mb-6">
        <Building2 size={48} strokeWidth={1} className="text-[#f0f6fc]" />
      </div>
      
      <h1 className="text-[24px] font-light mb-6 tracking-tight text-center">
        {isLogin ? "Вход в StaySmart" : "Создать аккаунт"}
      </h1>

      <div className="w-full max-w-[308px]">
        <div className="bg-[#161b22] p-5 border border-[#30363d] rounded-md shadow-md">
          {error && (
            <div className="mb-4 p-3 bg-[#f851491a] border border-[#f8514966] text-[#f85149] rounded-md text-xs text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4 text-left">
            <div>
              <label className="block text-sm font-normal mb-2 text-[#f0f6fc]">Email адрес</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-1.5 text-sm bg-[#0d1117] border border-[#30363d] rounded-md focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] outline-none text-[#f0f6fc]"
                placeholder="vanya@example.com"
                required
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-normal text-[#f0f6fc]">Пароль</label>
                <a href="#" className="text-xs text-[#58a6ff] hover:underline">Забыли пароль?</a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-1.5 text-sm bg-[#0d1117] border border-[#30363d] rounded-md focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] outline-none text-[#f0f6fc]"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#238636] hover:bg-[#2ea043] text-white py-1.5 px-4 border border-[#f0f6fc1a] rounded-md text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? "Подождите..." : isLogin ? "Войти" : "Зарегистрироваться"}
            </button>
          </form>
        </div>

        <div className="mt-4 p-4 border border-[#30363d] rounded-md text-center">
          <p className="text-sm">
            {isLogin ? "Впервые у нас? " : "Уже есть аккаунт? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#58a6ff] hover:underline font-medium"
            >
              {isLogin ? "Создать аккаунт" : "Войти"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
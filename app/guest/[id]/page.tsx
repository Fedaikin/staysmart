"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useParams } from "next/navigation";
import { Wifi, MapPin, FileText, Copy, Check, Building2, Smartphone } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function GuestPage() {
  const { id } = useParams();
  const [prop, setProp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      const { data } = await supabase.from("properties").select("*").eq("id", id).single();
      if (data) setProp(data);
      setLoading(false);
    };
    fetchProperty();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-[#0d1117] flex items-center justify-center text-white italic">Загрузка цифрового консьержа...</div>;
  if (!prop) return <div className="min-h-screen bg-[#0d1117] flex items-center justify-center text-white">Объект не найден</div>;

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans pb-20 text-left">
      <div className="bg-[#161b22] border-b border-[#30363d] p-8 text-center shadow-lg">
        <div className="bg-[#238636] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-900/20">
            <Building2 size={32} className="text-white" />
        </div>
        <h1 className="text-2xl font-black text-[#f0f6fc] tracking-tight">{prop.name}</h1>
        <div className="flex items-center justify-center gap-2 mt-2 opacity-50">
            <Smartphone size={12} />
            <p className="text-[10px] uppercase tracking-widest font-bold">Цифровой консьерж StaySmart</p>
        </div>
      </div>

      <div className="max-w-md mx-auto p-6 space-y-6">
        {prop.address && (
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-sm">
            <h3 className="flex items-center gap-2 text-[#8b949e] text-[10px] uppercase tracking-widest font-black mb-4"><MapPin size={16} className="text-[#f85149]"/> Адрес объекта</h3>
            <p className="text-[#f0f6fc] text-xl font-bold leading-tight">{prop.address}</p>
          </div>
        )}

        {(prop.wifi_name || prop.wifi_password) && (
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-5">
                <Wifi size={100} />
            </div>
            <h3 className="flex items-center gap-2 text-[#8b949e] text-[10px] uppercase tracking-widest font-black mb-6"><Wifi size={16} className="text-[#3fb950]"/> Бесплатный Wi-Fi</h3>
            <div className="space-y-6">
              <div>
                <p className="text-[10px] text-[#8b949e] mb-2 uppercase font-bold opacity-50">Название сети:</p>
                <p className="text-[#f0f6fc] font-mono text-xl font-bold tracking-tight">{prop.wifi_name || "StaySmart_Guest"}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#8b949e] mb-2 uppercase font-bold opacity-50">Пароль:</p>
                <div className="flex items-center gap-2">
                  <p className="text-[#3fb950] font-mono text-2xl font-black flex-1 truncate bg-[#0d1117] p-3 rounded-xl border border-[#30363d] shadow-inner">{prop.wifi_password || "••••••••"}</p>
                  <button onClick={() => { navigator.clipboard.writeText(prop.wifi_password); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="p-4 bg-[#238636] rounded-xl shadow-lg active:scale-90 transition-all">
                    {copied ? <Check size={24} className="text-white" /> : <Copy size={24} className="text-white" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {prop.check_in_info && (
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-sm">
            <h3 className="flex items-center gap-2 text-[#8b949e] text-[10px] uppercase tracking-widest font-black mb-4"><FileText size={16} className="text-[#58a6ff]"/> Памятка для гостя</h3>
            <p className="text-[#f0f6fc] text-md leading-relaxed whitespace-pre-wrap font-light italic">{prop.check_in_info}</p>
          </div>
        )}

        <div className="text-center pt-10 opacity-20">
          <p className="text-[10px] uppercase tracking-[0.3em] font-black">StaySmart v1.0</p>
        </div>
      </div>
    </div>
  );
}
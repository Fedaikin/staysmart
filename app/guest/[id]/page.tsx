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
  const [lang, setLang] = useState<"ru" | "en">("ru");

  useEffect(() => {
    const fetchProperty = async () => {
      const { data } = await supabase.from("properties").select("*").eq("id", id).single();
      if (data) setProp(data);
      setLoading(false);
    };
    fetchProperty();
  }, [id]);

  // Словарик для перевода интерфейса
  const t = {
    ru: {
      subtitle: "Цифровой консьерж StaySmart",
      address: "Адрес объекта",
      wifi: "Бесплатный Wi-Fi",
      network: "Название сети:",
      password: "Пароль:",
      info: "Памятка для гостя",
      notFound: "Объект не найден",
      loading: "Загрузка цифрового консьержа..."
    },
    en: {
      subtitle: "StaySmart Digital Concierge",
      address: "Property Address",
      wifi: "Free Wi-Fi",
      network: "Network Name:",
      password: "Password:",
      info: "Guest Information",
      notFound: "Property not found",
      loading: "Loading digital concierge..."
    }
  }[lang];

  if (loading) return <div className="min-h-screen bg-[#0d1117] flex items-center justify-center text-white italic">{t.loading}</div>;
  if (!prop) return <div className="min-h-screen bg-[#0d1117] flex items-center justify-center text-white">{t.notFound}</div>;

  // Если английского текста нет, показываем русский
  const displayInfo = (lang === "en" && prop.check_in_info_en) ? prop.check_in_info_en : prop.check_in_info;

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans pb-20 text-left">
      <div className="bg-[#161b22] border-b border-[#30363d] p-8 text-center shadow-lg relative">
        
        {/* Переключатель языков */}
        <div className="absolute top-6 right-6 flex bg-[#0d1117] p-1 rounded-lg border border-[#30363d]">
          <button 
            onClick={() => setLang("ru")} 
            className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase transition-all ${lang === "ru" ? "bg-[#21262d] text-white shadow-sm" : "text-[#8b949e]"}`}
          >
            RU
          </button>
          <button 
            onClick={() => setLang("en")} 
            className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase transition-all ${lang === "en" ? "bg-[#21262d] text-white shadow-sm" : "text-[#8b949e]"}`}
          >
            EN
          </button>
        </div>

        <div className="bg-[#238636] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 mt-4 shadow-lg shadow-green-900/20">
            <Building2 size={32} className="text-white" />
        </div>
        <h1 className="text-2xl font-black text-[#f0f6fc] tracking-tight">{prop.name}</h1>
        <div className="flex items-center justify-center gap-2 mt-2 opacity-50">
            <Smartphone size={12} />
            <p className="text-[10px] uppercase tracking-widest font-bold">{t.subtitle}</p>
        </div>
      </div>

      <div className="max-w-md mx-auto p-6 space-y-6">
        {prop.address && (
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-sm">
            <h3 className="flex items-center gap-2 text-[#8b949e] text-[10px] uppercase tracking-widest font-black mb-4"><MapPin size={16} className="text-[#f85149]"/> {t.address}</h3>
            <p className="text-[#f0f6fc] text-xl font-bold leading-tight">{prop.address}</p>
          </div>
        )}

        {(prop.wifi_name || prop.wifi_password) && (
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-5">
                <Wifi size={100} />
            </div>
            <h3 className="flex items-center gap-2 text-[#8b949e] text-[10px] uppercase tracking-widest font-black mb-6"><Wifi size={16} className="text-[#3fb950]"/> {t.wifi}</h3>
            <div className="space-y-6">
              <div>
                <p className="text-[10px] text-[#8b949e] mb-2 uppercase font-bold opacity-50">{t.network}</p>
                <p className="text-[#f0f6fc] font-mono text-xl font-bold tracking-tight">{prop.wifi_name || "StaySmart_Guest"}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#8b949e] mb-2 uppercase font-bold opacity-50">{t.password}</p>
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

        {displayInfo && (
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-sm">
            <h3 className="flex items-center gap-2 text-[#8b949e] text-[10px] uppercase tracking-widest font-black mb-4"><FileText size={16} className="text-[#58a6ff]"/> {t.info}</h3>
            <p className="text-[#f0f6fc] text-md leading-relaxed whitespace-pre-wrap font-light italic">{displayInfo}</p>
          </div>
        )}
      </div>
    </div>
  );
}
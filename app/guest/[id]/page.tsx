"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useParams } from "next/navigation";
import { Wifi, MapPin, FileText, Copy, Check, Building2, Smartphone, Clock, MessageCircle, Phone, Star, ExternalLink, AlertTriangle } from "lucide-react";

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
  
  // Состояние для рейтинга (0 - не выбран, 1-5 звезды)
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      const { data } = await supabase.from("properties").select("*").eq("id", id).single();
      if (data) setProp(data);
      setLoading(false);
    };
    fetchProperty();
  }, [id]);

  const t = {
    ru: {
      subtitle: "Цифровой консьерж StaySmart",
      address: "Адрес объекта",
      checkIn: "Заезд",
      checkOut: "Выезд",
      wifi: "Бесплатный Wi-Fi",
      network: "Название сети:",
      password: "Пароль:",
      info: "Памятка для гостя",
      contactHost: "Связаться с владельцем",
      rateUs: "Оцените ваше проживание",
      rateBad: "Нам очень жаль! Пожалуйста, напишите нам напрямую, чтобы мы всё исправили:",
      rateGood: "Спасибо за высший балл! Будем очень признательны, если вы оставите отзыв:",
      btnBad: "Написать о проблеме",
      btnGood: "Оставить отзыв",
      notFound: "Объект не найден",
      loading: "Загрузка цифрового консьержа..."
    },
    en: {
      subtitle: "StaySmart Digital Concierge",
      address: "Property Address",
      checkIn: "Check-in",
      checkOut: "Check-out",
      wifi: "Free Wi-Fi",
      network: "Network Name:",
      password: "Password:",
      info: "Guest Information",
      contactHost: "Contact Host",
      rateUs: "Rate your stay",
      rateBad: "We are so sorry! Please text us directly so we can fix it:",
      rateGood: "Thank you for 5 stars! We would appreciate if you leave a review:",
      btnBad: "Report an issue",
      btnGood: "Leave a review",
      notFound: "Property not found",
      loading: "Loading digital concierge..."
    }
  }[lang];

  if (loading) return <div className="min-h-screen bg-[#0d1117] flex items-center justify-center text-white italic">{t.loading}</div>;
  if (!prop) return <div className="min-h-screen bg-[#0d1117] flex items-center justify-center text-white">{t.notFound}</div>;

  const displayInfo = (lang === "en" && prop.check_in_info_en) ? prop.check_in_info_en : prop.check_in_info;
  const cleanPhone = prop.host_phone ? prop.host_phone.replace(/\D/g, '') : '';
  const cleanTelegram = prop.host_telegram ? prop.host_telegram.replace('@', '') : '';

  // Текст для предзаполненного сообщения в WhatsApp при плохом отзыве
  const whatsappMsg = lang === "ru" 
    ? "Здравствуйте! У меня есть замечание по поводу проживания: " 
    : "Hello! I have an issue with my stay: ";

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans pb-24 text-left">
      <div className="bg-[#161b22] border-b border-[#30363d] p-8 text-center shadow-lg relative">
        <div className="absolute top-6 right-6 flex bg-[#0d1117] p-1 rounded-lg border border-[#30363d]">
          <button onClick={() => setLang("ru")} className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase transition-all ${lang === "ru" ? "bg-[#21262d] text-white shadow-sm" : "text-[#8b949e]"}`}>RU</button>
          <button onClick={() => setLang("en")} className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase transition-all ${lang === "en" ? "bg-[#21262d] text-white shadow-sm" : "text-[#8b949e]"}`}>EN</button>
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
        
        {(prop.check_in_time || prop.check_out_time) && (
          <div className="flex gap-4">
            {prop.check_in_time && (
              <div className="flex-1 bg-[#161b22] border border-[#30363d] rounded-2xl p-4 shadow-sm text-center">
                <Clock size={16} className="mx-auto mb-2 text-[#e3b341]" />
                <p className="text-[10px] text-[#8b949e] uppercase font-black tracking-widest mb-1">{t.checkIn}</p>
                <p className="text-[#f0f6fc] font-bold text-lg">{prop.check_in_time}</p>
              </div>
            )}
            {prop.check_out_time && (
              <div className="flex-1 bg-[#161b22] border border-[#30363d] rounded-2xl p-4 shadow-sm text-center">
                <Clock size={16} className="mx-auto mb-2 text-[#e3b341]" />
                <p className="text-[10px] text-[#8b949e] uppercase font-black tracking-widest mb-1">{t.checkOut}</p>
                <p className="text-[#f0f6fc] font-bold text-lg">{prop.check_out_time}</p>
              </div>
            )}
          </div>
        )}

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

        {(prop.host_phone || prop.host_telegram) && (
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-sm">
            <h3 className="flex items-center gap-2 text-[#8b949e] text-[10px] uppercase tracking-widest font-black mb-4"><MessageCircle size={16} className="text-[#58a6ff]"/> {t.contactHost}</h3>
            <div className="flex flex-col gap-3">
              {prop.host_phone && (
                <a href={`https://wa.me/${cleanPhone}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-[#238636] hover:bg-[#2ea043] text-white py-4 rounded-xl font-bold transition-all active:scale-95 shadow-md">
                  <Phone size={20} /> WhatsApp
                </a>
              )}
              {prop.host_telegram && (
                <a href={`https://t.me/${cleanTelegram}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-[#2AABEE] hover:bg-[#229ED9] text-white py-4 rounded-xl font-bold transition-all active:scale-95 shadow-md">
                  <MessageCircle size={20} /> Telegram
                </a>
              )}
            </div>
          </div>
        )}

        {/* НОВЫЙ БЛОК: Умные отзывы */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 shadow-sm text-center mt-8">
            <h3 className="text-[#f0f6fc] font-bold text-lg mb-6">{t.rateUs}</h3>
            
            <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                        key={star} 
                        onClick={() => setRating(star)}
                        className={`transition-all hover:scale-110 ${rating >= star ? 'text-[#e3b341]' : 'text-[#30363d]'}`}
                    >
                        <Star size={40} fill={rating >= star ? "currentColor" : "none"} strokeWidth={1.5} />
                    </button>
                ))}
            </div>

            {/* Логика показа кнопок в зависимости от оценки */}
            {rating > 0 && rating < 5 && prop.host_phone && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <p className="text-sm text-[#8b949e] mb-4 font-light">{t.rateBad}</p>
                    <a href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMsg)}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full bg-[#21262d] border border-[#30363d] hover:bg-[#30363d] text-white py-4 rounded-xl font-bold transition-all active:scale-95 shadow-md">
                        <AlertTriangle size={18} className="text-[#f85149]"/> {t.btnBad}
                    </a>
                </div>
            )}

            {rating === 5 && prop.review_link && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <p className="text-sm text-[#8b949e] mb-4 font-light">{t.rateGood}</p>
                    <a href={prop.review_link} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full bg-[#e3b341] hover:bg-[#d4a63c] text-[#0d1117] py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all active:scale-95 shadow-lg shadow-yellow-900/20">
                        <ExternalLink size={18}/> {t.btnGood}
                    </a>
                </div>
            )}
        </div>

      </div>
    </div>
  );
}
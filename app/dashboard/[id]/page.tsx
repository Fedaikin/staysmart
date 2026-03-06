"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Wifi, MapPin, FileText, Globe, Check, Printer } from "lucide-react";
import QRCode from "react-qr-code";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function EditProperty() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [prop, setProp] = useState({
    name: "",
    address: "",
    wifi_name: "",
    wifi_password: "",
    check_in_info: ""
  });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { data, error } = await supabase.from("properties").select("*").eq("id", id).single();
        if (data) setProp({
          name: data.name || "",
          address: data.address || "",
          wifi_name: data.wifi_name || "",
          wifi_password: data.wifi_password || "",
          check_in_info: data.check_in_info || ""
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from("properties").update(prop).eq("id", id);
    if (error) alert("Ошибка: " + error.message);
    else router.push("/dashboard");
    setSaving(false);
  };

  if (loading) return <div className="min-h-screen bg-[#0d1117] flex items-center justify-center text-white italic">Загрузка данных...</div>;

  const guestUrl = typeof window !== "undefined" ? `${window.location.origin}/guest/${id}` : "";

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans p-4 md:p-8 text-left">
      
      {/* === БЛОК ДЛЯ ПРИНТЕРА (Скрыт на экране, виден только при печати) === */}
      <div className="hidden print:flex flex-col items-center justify-center fixed inset-0 bg-white text-black z-50 p-10 text-center">
        <h1 className="text-5xl font-black mb-4 tracking-tight">{prop.name}</h1>
        <p className="text-2xl text-gray-500 mb-12 font-medium">Добро пожаловать!</p>
        
        <div className="p-8 border-8 border-black rounded-3xl shadow-2xl mb-12">
           {guestUrl && <QRCode size={400} value={guestUrl} viewBox={`0 0 256 256`} />}
        </div>
        
        <h2 className="text-3xl font-bold mb-4">Наведите камеру смартфона</h2>
        <p className="text-xl text-gray-600">чтобы подключиться к Wi-Fi и посмотреть инструкции по дому</p>
        
        <div className="absolute bottom-10 opacity-30 text-sm font-bold tracking-[0.3em] uppercase">
          Powered by StaySmart
        </div>
      </div>
      {/* =================================================================== */}


      {/* === ОСНОВНОЙ ИНТЕРФЕЙС (Скрыт при печати) === */}
      <div className="max-w-5xl mx-auto print:hidden">
        <button onClick={() => router.push("/dashboard")} className="flex items-center gap-2 text-[#8b949e] hover:text-[#f0f6fc] mb-8 text-sm font-medium transition-colors">
          <ArrowLeft size={16} /> Вернуться к списку
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 space-y-6 shadow-sm">
              <h3 className="text-[#f0f6fc] font-bold text-lg border-b border-[#30363d] pb-3">Основные данные</h3>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-[10px] text-[#8b949e] mb-2 uppercase font-black tracking-widest"><Globe size={14}/> Название объекта</label>
                  <input value={prop.name} onChange={(e) => setProp({...prop, name: e.target.value})} className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-3 text-white outline-none focus:border-[#58a6ff] transition-all" />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-[10px] text-[#8b949e] mb-2 uppercase font-black tracking-widest"><MapPin size={14}/> Точный адрес</label>
                  <input value={prop.address} onChange={(e) => setProp({...prop, address: e.target.value})} className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-3 text-white outline-none focus:border-[#58a6ff] transition-all" />
                </div>
              </div>
            </section>

            <section className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 space-y-6 shadow-sm">
              <h3 className="flex items-center gap-2 font-bold text-[#f0f6fc] border-b border-[#30363d] pb-3"><Wifi size={18} className="text-[#3fb950]"/> Данные Wi-Fi</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-[10px] text-[#8b949e] mb-2 uppercase font-black tracking-widest text-left">Сеть</label>
                    <input placeholder="Напр: StaySmart_Guest" value={prop.wifi_name} onChange={(e) => setProp({...prop, wifi_name: e.target.value})} className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-3 text-white outline-none focus:border-[#58a6ff]" />
                </div>
                <div>
                    <label className="block text-[10px] text-[#8b949e] mb-2 uppercase font-black tracking-widest text-left">Пароль</label>
                    <input placeholder="Напр: 12345678" value={prop.wifi_password} onChange={(e) => setProp({...prop, wifi_password: e.target.value})} className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-3 text-white outline-none focus:border-[#58a6ff]" />
                </div>
              </div>
            </section>

            <section className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 shadow-sm">
              <h3 className="flex items-center gap-2 font-bold text-[#f0f6fc] border-b border-[#30363d] pb-3 mb-6"><FileText size={18} className="text-[#58a6ff]"/> Памятка для гостя</h3>
              <textarea rows={6} value={prop.check_in_info} onChange={(e) => setProp({...prop, check_in_info: e.target.value})} className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-3 text-white outline-none focus:border-[#58a6ff] resize-none font-light" placeholder="Напишите здесь всё самое важное..." />
            </section>

            <button onClick={handleSave} disabled={saving} className="w-full bg-[#238636] hover:bg-[#2ea043] text-white py-4 rounded-xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-xl shadow-green-900/10 transition-all active:scale-[0.98] disabled:opacity-50">
              <Save size={20} /> {saving ? "Сохраняем..." : "Сохранить изменения"}
            </button>
          </div>

          <div className="lg:col-span-1">
            <section className="bg-[#161b22] border border-[#30363d] rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-4 sticky top-8">
              <h3 className="text-[#f0f6fc] font-black text-[10px] uppercase flex items-center gap-2 tracking-tight">
                <div className="bg-[#238636] p-1 rounded-sm"><Check size={10} className="text-white" /></div>
                QR-код для гостя
              </h3>
              
              <div className="p-4 bg-white rounded-2xl border-4 border-[#30363d]">
                 {guestUrl && <QRCode size={160} value={guestUrl} viewBox={`0 0 256 256`} />}
              </div>
              
              <p className="text-[10px] text-[#8b949e] font-bold uppercase text-center leading-tight tracking-tighter mb-2">
                Для размещения в квартире
              </p>

              {/* Кнопка печати */}
              <button 
                onClick={() => window.print()} 
                className="w-full bg-[#f0f6fc] hover:bg-white text-[#0d1117] py-3 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md"
              >
                <Printer size={14} /> Распечатать
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
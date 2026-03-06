"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Wifi, MapPin, FileText, Globe, Check, Printer, Clock, MessageCircle, Star, Map, Coffee, ShoppingCart, Pill, Image as ImageIcon, Loader2 } from "lucide-react";
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
  const [uploadingImg, setUploadingImg] = useState(false);
  
  const [prop, setProp] = useState({
    name: "", address: "", wifi_name: "", wifi_password: "", 
    check_in_info: "", check_in_info_en: "", check_in_time: "", check_out_time: "", 
    host_phone: "", host_telegram: "", review_link: "",
    guide_cafe: "", guide_shop: "", guide_pharmacy: "",
    guide_cafe_en: "", guide_shop_en: "", guide_pharmacy_en: "",
    guide_cafe_yandex: "", guide_cafe_google: "",
    guide_shop_yandex: "", guide_shop_google: "",
    guide_pharmacy_yandex: "", guide_pharmacy_google: "",
    image_url: "",
    address_yandex: "", address_google: ""
  });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { data, error } = await supabase.from("properties").select("*").eq("id", id).single();
        if (data) setProp({
          name: data.name || "", address: data.address || "", 
          wifi_name: data.wifi_name || "", wifi_password: data.wifi_password || "",
          check_in_info: data.check_in_info || "", check_in_info_en: data.check_in_info_en || "",
          check_in_time: data.check_in_time || "", check_out_time: data.check_out_time || "",
          host_phone: data.host_phone || "", host_telegram: data.host_telegram || "", review_link: data.review_link || "",
          guide_cafe: data.guide_cafe || "", guide_shop: data.guide_shop || "", guide_pharmacy: data.guide_pharmacy || "",
          guide_cafe_en: data.guide_cafe_en || "", guide_shop_en: data.guide_shop_en || "", guide_pharmacy_en: data.guide_pharmacy_en || "",
          guide_cafe_yandex: data.guide_cafe_yandex || "", guide_cafe_google: data.guide_cafe_google || "",
          guide_shop_yandex: data.guide_shop_yandex || "", guide_shop_google: data.guide_shop_google || "",
          guide_pharmacy_yandex: data.guide_pharmacy_yandex || "", guide_pharmacy_google: data.guide_pharmacy_google || "",
          image_url: data.image_url || "",
          address_yandex: data.address_yandex || "", address_google: data.address_google || ""
        });
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchProperty();
  }, [id]);

  const translateText = async (text: string) => {
    if (!text) return "";
    try {
      const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ru|en`);
      const data = await res.json();
      return data.responseData.translatedText;
    } catch (e) {
      console.error("Ошибка перевода", e);
      return text;
    }
  };

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploadingImg(true);
      if (!e.target.files || e.target.files.length === 0) return;
      
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('property_images').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('property_images').getPublicUrl(fileName);
      setProp({ ...prop, image_url: data.publicUrl });
      
    } catch (error: any) {
      alert('Ошибка при загрузке: ' + error.message);
    } finally {
      setUploadingImg(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const translated_check_in = await translateText(prop.check_in_info);
    const translated_cafe = await translateText(prop.guide_cafe);
    const translated_shop = await translateText(prop.guide_shop);
    const translated_pharmacy = await translateText(prop.guide_pharmacy);

    const payloadToSave = {
      ...prop,
      check_in_info_en: translated_check_in,
      guide_cafe_en: translated_cafe,
      guide_shop_en: translated_shop,
      guide_pharmacy_en: translated_pharmacy
    };

    const { error } = await supabase.from("properties").update(payloadToSave).eq("id", id);
    if (error) alert("Ошибка: " + error.message);
    else router.push("/dashboard");
    setSaving(false);
  };

  if (loading) return <div className="min-h-screen bg-[#0d1117] flex items-center justify-center text-white italic">Загрузка данных...</div>;

  const guestUrl = typeof window !== "undefined" ? `${window.location.origin}/guest/${id}` : "";

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans p-4 md:p-8 text-left">
      <div className="hidden print:flex flex-col items-center justify-center fixed inset-0 bg-white text-black z-50 p-10 text-center">
        <h1 className="text-5xl font-black mb-4 tracking-tight">{prop.name}</h1>
        <div className="p-8 border-8 border-black rounded-3xl shadow-2xl mb-12">
           {guestUrl && <QRCode size={400} value={guestUrl} viewBox={`0 0 256 256`} />}
        </div>
        <h2 className="text-3xl font-bold mb-4">Наведите камеру смартфона</h2>
      </div>

      <div className="max-w-5xl mx-auto print:hidden">
        <button onClick={() => router.push("/dashboard")} className="flex items-center gap-2 text-[#8b949e] hover:text-[#f0f6fc] mb-8 text-sm font-medium transition-colors">
          <ArrowLeft size={16} /> Вернуться к списку
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
          <div className="lg:col-span-2 space-y-6">
            
            <section className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 space-y-6 shadow-sm">
              <h3 className="text-[#f0f6fc] font-bold text-lg border-b border-[#30363d] pb-3">Основные данные</h3>
              
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-full md:w-1/3">
                  <label className="flex items-center gap-2 text-[10px] text-[#8b949e] mb-2 uppercase font-black tracking-widest"><ImageIcon size={14}/> Обложка</label>
                  <div className="relative group rounded-xl overflow-hidden border-2 border-dashed border-[#30363d] hover:border-[#58a6ff] transition-all bg-[#0d1117] aspect-video flex flex-col items-center justify-center cursor-pointer">
                    {prop.image_url ? (
                      <img src={prop.image_url} alt="Cover" className="w-full h-full object-cover opacity-80 group-hover:opacity-50 transition-opacity" />
                    ) : (
                      <div className="flex flex-col items-center p-4 text-[#8b949e] group-hover:text-[#58a6ff]">
                        <ImageIcon size={24} className="mb-2" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-center">Загрузить фото</span>
                      </div>
                    )}
                    {uploadingImg && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <Loader2 className="animate-spin text-white" size={24} />
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={uploadImage} disabled={uploadingImg} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  </div>
                </div>

                <div className="w-full md:w-2/3 space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-[10px] text-[#8b949e] mb-2 uppercase font-black tracking-widest"><Globe size={14}/> Название объекта</label>
                    <input value={prop.name} onChange={(e) => setProp({...prop, name: e.target.value})} className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-3 text-white outline-none focus:border-[#58a6ff]" />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-[10px] text-[#8b949e] mb-2 uppercase font-black tracking-widest"><MapPin size={14}/> Точный адрес</label>
                    <input placeholder="Напр: Невский проспект, 10" value={prop.address} onChange={(e) => setProp({...prop, address: e.target.value})} className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-3 text-white outline-none focus:border-[#58a6ff] mb-2" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input placeholder="Ссылка на Яндекс Карты..." value={prop.address_yandex} onChange={(e) => setProp({...prop, address_yandex: e.target.value})} className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-2 text-[#8b949e] focus:text-white outline-none focus:border-[#58a6ff] text-xs" />
                      <input placeholder="Ссылка на Google Карты..." value={prop.address_google} onChange={(e) => setProp({...prop, address_google: e.target.value})} className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-2 text-[#8b949e] focus:text-white outline-none focus:border-[#58a6ff] text-xs" />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 space-y-6 shadow-sm">
              <h3 className="flex items-center gap-2 font-bold text-[#f0f6fc] border-b border-[#30363d] pb-3"><Clock size={18} className="text-[#e3b341]"/> Время заезда и выезда</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-[10px] text-[#8b949e] mb-2 uppercase font-black tracking-widest text-left">Заезд (с 14:00)</label>
                    <input value={prop.check_in_time} onChange={(e) => setProp({...prop, check_in_time: e.target.value})} className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-3 text-white outline-none focus:border-[#58a6ff]" />
                </div>
                <div>
                    <label className="block text-[10px] text-[#8b949e] mb-2 uppercase font-black tracking-widest text-left">Выезд (до 12:00)</label>
                    <input value={prop.check_out_time} onChange={(e) => setProp({...prop, check_out_time: e.target.value})} className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-3 text-white outline-none focus:border-[#58a6ff]" />
                </div>
              </div>
            </section>

            <section className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 space-y-8 shadow-sm">
              <div className="border-b border-[#30363d] pb-3">
                <h3 className="flex items-center gap-2 font-bold text-[#f0f6fc]"><Map size={18} className="text-[#ff7b72]"/> Локальный гид</h3>
                <p className="text-[#8b949e] text-xs mt-1">Английский текст сгенерируется автоматически.</p>
              </div>
              
              <div className="space-y-4 bg-[#0d1117] p-5 rounded-xl border border-[#30363d]">
                <h4 className="flex items-center gap-2 text-[#c9d1d9] font-bold text-sm mb-4"><Coffee size={16} className="text-[#ff7b72]"/> Где выпить кофе / поесть</h4>
                <input placeholder="Текст (Напр: Кофейня 'Зерно' за углом)" value={prop.guide_cafe} onChange={(e) => setProp({...prop, guide_cafe: e.target.value})} className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#ff7b72] mb-2 text-sm" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input placeholder="https://yandex.ru/maps/..." value={prop.guide_cafe_yandex} onChange={(e) => setProp({...prop, guide_cafe_yandex: e.target.value})} className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-4 py-2 text-white outline-none focus:border-[#ff7b72] text-xs" />
                  <input placeholder="https://maps.google.com/..." value={prop.guide_cafe_google} onChange={(e) => setProp({...prop, guide_cafe_google: e.target.value})} className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-4 py-2 text-white outline-none focus:border-[#ff7b72] text-xs" />
                </div>
              </div>

              <div className="space-y-4 bg-[#0d1117] p-5 rounded-xl border border-[#30363d]">
                <h4 className="flex items-center gap-2 text-[#c9d1d9] font-bold text-sm mb-4"><ShoppingCart size={16} className="text-[#ff7b72]"/> Ближайший магазин</h4>
                <input placeholder="Текст (Напр: Пятерочка в соседнем доме)" value={prop.guide_shop} onChange={(e) => setProp({...prop, guide_shop: e.target.value})} className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#ff7b72] mb-2 text-sm" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input placeholder="https://yandex.ru/maps/..." value={prop.guide_shop_yandex} onChange={(e) => setProp({...prop, guide_shop_yandex: e.target.value})} className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-4 py-2 text-white outline-none focus:border-[#ff7b72] text-xs" />
                  <input placeholder="https://maps.google.com/..." value={prop.guide_shop_google} onChange={(e) => setProp({...prop, guide_shop_google: e.target.value})} className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-4 py-2 text-white outline-none focus:border-[#ff7b72] text-xs" />
                </div>
              </div>

              <div className="space-y-4 bg-[#0d1117] p-5 rounded-xl border border-[#30363d]">
                <h4 className="flex items-center gap-2 text-[#c9d1d9] font-bold text-sm mb-4"><Pill size={16} className="text-[#ff7b72]"/> Аптека</h4>
                <input placeholder="Текст (Напр: Аптека 24/7 через дорогу)" value={prop.guide_pharmacy} onChange={(e) => setProp({...prop, guide_pharmacy: e.target.value})} className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#ff7b72] mb-2 text-sm" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input placeholder="https://yandex.ru/maps/..." value={prop.guide_pharmacy_yandex} onChange={(e) => setProp({...prop, guide_pharmacy_yandex: e.target.value})} className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-4 py-2 text-white outline-none focus:border-[#ff7b72] text-xs" />
                  <input placeholder="https://maps.google.com/..." value={prop.guide_pharmacy_google} onChange={(e) => setProp({...prop, guide_pharmacy_google: e.target.value})} className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-4 py-2 text-white outline-none focus:border-[#ff7b72] text-xs" />
                </div>
              </div>
            </section>

            <section className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 space-y-6 shadow-sm">
              <h3 className="flex items-center gap-2 font-bold text-[#f0f6fc] border-b border-[#30363d] pb-3"><MessageCircle size={18} className="text-[#58a6ff]"/> Контакты для гостя</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-[10px] text-[#8b949e] mb-2 uppercase font-black tracking-widest text-left">Телефон (WhatsApp)</label>
                    <input value={prop.host_phone} onChange={(e) => setProp({...prop, host_phone: e.target.value})} className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-3 text-white outline-none focus:border-[#58a6ff]" />
                </div>
                <div>
                    <label className="block text-[10px] text-[#8b949e] mb-2 uppercase font-black tracking-widest text-left">Telegram (без @)</label>
                    <input value={prop.host_telegram} onChange={(e) => setProp({...prop, host_telegram: e.target.value})} className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-3 text-white outline-none focus:border-[#58a6ff]" />
                </div>
              </div>
            </section>

            <section className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 space-y-6 shadow-sm">
              <h3 className="flex items-center gap-2 font-bold text-[#f0f6fc] border-b border-[#30363d] pb-3"><Wifi size={18} className="text-[#3fb950]"/> Данные Wi-Fi</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-[10px] text-[#8b949e] mb-2 uppercase font-black tracking-widest text-left">Сеть</label>
                    <input value={prop.wifi_name} onChange={(e) => setProp({...prop, wifi_name: e.target.value})} className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-3 text-white outline-none focus:border-[#58a6ff]" />
                </div>
                <div>
                    <label className="block text-[10px] text-[#8b949e] mb-2 uppercase font-black tracking-widest text-left">Пароль</label>
                    <input value={prop.wifi_password} onChange={(e) => setProp({...prop, wifi_password: e.target.value})} className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-3 text-white outline-none focus:border-[#58a6ff]" />
                </div>
              </div>
            </section>

            <section className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 shadow-sm space-y-6">
              <div className="border-b border-[#30363d] pb-3">
                <h3 className="flex items-center gap-2 font-bold text-[#f0f6fc]"><FileText size={18} className="text-[#58a6ff]"/> Памятка для гостя</h3>
                <p className="text-[#8b949e] text-xs mt-1">Английский текст сгенерируется автоматически.</p>
              </div>
              <textarea rows={6} value={prop.check_in_info} onChange={(e) => setProp({...prop, check_in_info: e.target.value})} className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-3 text-white outline-none focus:border-[#58a6ff] resize-none font-light" placeholder="Напишите здесь всё самое важное..." />
            </section>

            <section className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 space-y-6 shadow-sm border-l-4 border-l-[#e3b341]">
              <h3 className="flex items-center gap-2 font-bold text-[#f0f6fc] border-b border-[#30363d] pb-3"><Star size={18} className="text-[#e3b341]" fill="currentColor"/> Умные отзывы</h3>
              <div>
                  <label className="block text-[10px] text-[#8b949e] mb-2 uppercase font-black tracking-widest text-left">Ссылка на профиль (Авито/Airbnb)</label>
                  <input placeholder="https://www.avito.ru/..." value={prop.review_link} onChange={(e) => setProp({...prop, review_link: e.target.value})} className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-3 text-white outline-none focus:border-[#e3b341]" />
              </div>
            </section>

            <button onClick={handleSave} disabled={saving} className="w-full bg-[#238636] hover:bg-[#2ea043] text-white py-4 rounded-xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-xl shadow-green-900/10 transition-all active:scale-[0.98] disabled:opacity-50">
              <Save size={20} /> {saving ? "Переводим и сохраняем..." : "Сохранить изменения"}
            </button>
          </div>

          <div className="lg:col-span-1">
            <section className="bg-[#161b22] border border-[#30363d] rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-4 sticky top-8">
              <h3 className="text-[#f0f6fc] font-black text-[10px] uppercase flex items-center gap-2 tracking-tight">
                <div className="bg-[#238636] p-1 rounded-sm"><Check size={10} className="text-white" /></div> QR-код для гостя
              </h3>
              <div className="p-4 bg-white rounded-2xl border-4 border-[#30363d]">
                 {guestUrl && <QRCode size={160} value={guestUrl} viewBox={`0 0 256 256`} />}
              </div>
              <button onClick={() => window.print()} className="w-full mt-2 bg-[#f0f6fc] hover:bg-white text-[#0d1117] py-3 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all active:scale-95">
                <Printer size={14} /> Распечатать плакат
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
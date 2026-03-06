"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { Building2, Plus, LogOut, ExternalLink, Settings, X, Trash2, Eye } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/login");
          return;
        }
        setUser(user);

        const { data, error } = await supabase
          .from("properties")
          .select("*")
          .eq("user_id", user.id) 
          .order("created_at", { ascending: false });
        
        if (error) throw error;
        setProperties(data || []);
      } catch (err) {
        console.error("Ошибка загрузки:", err);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [router]);

  const addProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !user) return;
    
    const { data, error } = await supabase
      .from("properties")
      .insert([{ name: newName, user_id: user.id }])
      .select();

    if (!error && data) {
      setProperties([data[0], ...properties]);
      setIsModalOpen(false);
      setNewName("");
    } else if (error) {
      alert("Ошибка при создании: " + error.message);
    }
  };

  const deleteProperty = async (id: string, name: string) => {
    const isConfirmed = window.confirm(`Вы уверены, что хотите удалить объект "${name}"? Это действие нельзя отменить.`);
    
    if (isConfirmed) {
      const { error } = await supabase.from("properties").delete().eq("id", id);
      if (error) alert("Ошибка при удалении: " + error.message);
      else setProperties(properties.filter(prop => prop.id !== id));
    }
  };

  if (loading) return <div className="min-h-screen bg-[#0d1117] flex items-center justify-center text-white italic text-sm">Загрузка ваших объектов...</div>;

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans">
      <nav className="border-b border-[#30363d] bg-[#161b22] px-6 py-3 flex justify-between items-center text-left">
        <div className="flex items-center gap-3 font-semibold text-[#f0f6fc]">
          <Building2 size={24} />
          <span className="italic tracking-tight text-lg font-bold">StaySmart</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-[#8b949e] hidden md:block">{user.email}</span>
          <button onClick={async () => { await supabase.auth.signOut(); router.push("/login"); }} className="text-[#8b949e] hover:text-[#f85149] p-2 transition-colors" title="Выйти">
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      <main className="max-w-[1200px] mx-auto p-8 text-left">
        <div className="flex justify-between items-center mb-8 border-b border-[#30363d] pb-4">
          <h2 className="text-2xl font-bold text-[#f0f6fc]">Мои объекты</h2>
          <button onClick={() => setIsModalOpen(true)} className="bg-[#238636] hover:bg-[#2ea043] text-white px-5 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all active:scale-95 shadow-sm shadow-green-900/20">
            <Plus size={18} /> Добавить
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((item) => (
            <div key={item.id} className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 hover:border-[#8b949e] transition-all flex flex-col shadow-sm group">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-[#58a6ff] font-bold text-xl truncate pr-2">{item.name}</h3>
                <div className="flex items-center gap-3">
                  
                  {/* НОВЫЙ БЛОК: Счетчик просмотров */}
                  <div className="flex items-center gap-1 text-[#8b949e] text-xs font-bold bg-[#0d1117] px-2 py-1 rounded-md border border-[#30363d]" title="Сканирований QR-кода">
                    <Eye size={14} /> {item.view_count || 0}
                  </div>

                  <span className="bg-[#2386361a] text-[#3fb950] text-[10px] px-2 py-0.5 border border-[#2386364d] rounded-full uppercase font-black">Активен</span>
                  <button onClick={() => deleteProperty(item.id, item.name)} className="text-[#8b949e] hover:text-[#f85149] opacity-0 group-hover:opacity-100 transition-all" title="Удалить объект">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <p className="text-xs text-[#8b949e] mb-2 italic truncate flex items-center gap-1">
                {item.address || "Адрес не указан"}
              </p>
              <p className="text-sm text-[#f0f6fc] mb-8 line-clamp-2 h-[40px] opacity-80">
                {item.check_in_info || "Инструкции для гостя не добавлены..."}
              </p>

              <div className="flex gap-3 mt-auto">
                <button onClick={() => router.push(`/dashboard/${item.id}`)} className="flex-1 flex items-center justify-center gap-2 bg-[#21262d] border border-[#30363d] py-2 rounded-md text-xs font-bold hover:bg-[#30363d] transition-colors text-white">
                  <Settings size={14} /> Настроить
                </button>
                <a href={`/guest/${item.id}`} target="_blank" className="flex-1 flex items-center justify-center gap-2 bg-[#21262d] border border-[#30363d] py-2 rounded-md text-xs font-bold text-[#58a6ff] hover:bg-[#30363d] transition-colors">
                  <ExternalLink size={14} /> Ссылка
                </a>
              </div>
            </div>
          ))}

          {properties.length === 0 && (
            <div onClick={() => setIsModalOpen(true)} className="border-2 border-dashed border-[#30363d] rounded-xl flex flex-col items-center justify-center p-8 hover:border-[#8b949e] cursor-pointer transition-colors min-h-[200px]">
              <Plus size={32} className="text-[#8b949e] mb-2" />
              <span className="text-sm text-[#8b949e] font-medium text-center">У вас пока нет объектов.<br/>Нажмите, чтобы добавить первую квартиру.</span>
            </div>
          )}
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-md">
          <div className="bg-[#161b22] border border-[#30363d] w-full max-w-md rounded-2xl p-8 shadow-2xl">
            <h3 className="text-xl font-bold text-[#f0f6fc] mb-6">Новый объект</h3>
            <form onSubmit={addProperty} className="space-y-6">
              <div className="text-left">
                <label className="block text-sm font-medium text-[#8b949e] mb-2 uppercase tracking-widest text-[10px]">Название</label>
                <input autoFocus value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-3 text-white outline-none focus:border-[#58a6ff] transition-all" placeholder="Напр: Студия на Невском" required />
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-[#8b949e] hover:text-white font-medium transition-colors">Отмена</button>
                <button type="submit" className="flex-1 bg-[#238636] hover:bg-[#2ea043] text-white py-3 rounded-lg font-bold shadow-lg shadow-green-900/20">Создать</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
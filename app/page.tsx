import Link from "next/link";
import { Building2, QrCode, Wifi, FileText, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans selection:bg-[#58a6ff] selection:text-white">
      
      {/* Шапка навигации */}
      <nav className="border-b border-[#30363d] bg-[#161b22]/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-[#238636] p-1.5 rounded-lg">
             <Building2 size={24} className="text-white" />
          </div>
          <span className="font-bold text-[#f0f6fc] text-xl tracking-tight">StaySmart</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-bold text-[#c9d1d9] hover:text-[#58a6ff] transition-colors">
            Войти
          </Link>
          <Link href="/login" className="bg-[#f0f6fc] hover:bg-white text-[#0d1117] px-5 py-2 rounded-lg text-sm font-bold transition-all active:scale-95 shadow-sm">
            Создать аккаунт
          </Link>
        </div>
      </nav>

      {/* Главный экран (Hero Section) */}
      <main className="flex flex-col items-center justify-center pt-32 pb-24 px-4 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#30363d] bg-[#21262d] text-xs font-bold text-[#8b949e] mb-8 uppercase tracking-widest shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-[#3fb950] animate-pulse"></span>
          StaySmart Beta доступен
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black text-[#f0f6fc] tracking-tighter mb-6 max-w-4xl leading-[1.1]">
          Идеальный <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#58a6ff] to-[#3fb950]">
            цифровой консьерж
          </span>
          <br /> для ваших гостей
        </h1>
        
        <p className="text-lg md:text-xl text-[#8b949e] max-w-2xl mb-12 font-light leading-relaxed">
          Создавайте красивые мобильные страницы для ваших квартир за 1 минуту. Wi-Fi в один клик, точные адреса и понятные инструкции по заселению.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link href="/login" className="bg-[#238636] hover:bg-[#2ea043] text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-green-900/20">
            Начать бесплатно <ArrowRight size={20} />
          </Link>
        </div>
      </main>

      {/* Блок преимуществ */}
      <section className="max-w-6xl mx-auto px-4 py-24 border-t border-[#30363d]">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#f0f6fc] mb-4">Всё, что нужно хосту</h2>
          <p className="text-[#8b949e]">Избавьтесь от рутины и повторяющихся вопросов гостей.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="bg-[#161b22] border border-[#30363d] p-8 rounded-2xl hover:border-[#8b949e] transition-all hover:-translate-y-1 shadow-lg">
            <div className="bg-[#21262d] w-14 h-14 rounded-xl flex items-center justify-center mb-6 border border-[#30363d]">
              <QrCode size={28} className="text-[#f0f6fc]" />
            </div>
            <h3 className="text-xl font-bold text-[#f0f6fc] mb-3">Умные QR-коды</h3>
            <p className="text-[#8b949e] leading-relaxed font-light">Готовые плакаты для печати. Гостю достаточно навести камеру смартфона, чтобы получить всю информацию о квартире.</p>
          </div>

          <div className="bg-[#161b22] border border-[#30363d] p-8 rounded-2xl hover:border-[#8b949e] transition-all hover:-translate-y-1 shadow-lg">
            <div className="bg-[#21262d] w-14 h-14 rounded-xl flex items-center justify-center mb-6 border border-[#30363d]">
              <Wifi size={28} className="text-[#3fb950]" />
            </div>
            <h3 className="text-xl font-bold text-[#f0f6fc] mb-3">Wi-Fi в один клик</h3>
            <p className="text-[#8b949e] leading-relaxed font-light">Больше никаких ошибок при вводе паролей. Гость копирует пароль от интернета одним касанием экрана.</p>
          </div>

          <div className="bg-[#161b22] border border-[#30363d] p-8 rounded-2xl hover:border-[#8b949e] transition-all hover:-translate-y-1 shadow-lg">
            <div className="bg-[#21262d] w-14 h-14 rounded-xl flex items-center justify-center mb-6 border border-[#30363d]">
              <FileText size={28} className="text-[#58a6ff]" />
            </div>
            <h3 className="text-xl font-bold text-[#f0f6fc] mb-3">Ясные инструкции</h3>
            <p className="text-[#8b949e] leading-relaxed font-light">Добавьте правила дома, коды от домофона и инструкции по бесконтактному заселению в удобном формате.</p>
          </div>
        </div>
      </section>

      {/* Подвал (Footer) */}
      <footer className="border-t border-[#30363d] bg-[#0d1117] py-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Building2 size={20} className="text-[#8b949e]" />
          <span className="font-bold text-[#8b949e] tracking-tight">StaySmart</span>
        </div>
        <p className="text-sm text-[#8b949e] font-light">© 2026 StaySmart. Все права защищены.</p>
      </footer>
    </div>
  );
}
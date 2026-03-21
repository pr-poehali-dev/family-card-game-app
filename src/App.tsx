import { useState } from "react";
import Icon from "@/components/ui/icon";

// ─── Types ───────────────────────────────────────────────────────────────────
type Tab = "home" | "mood" | "cards" | "events";
type Mood = "amazing" | "good" | "okay" | "bad" | "awful";
type MoodEntry = { mood: Mood; note: string };

// ─── Data ────────────────────────────────────────────────────────────────────
const MOODS: { key: Mood; emoji: string; label: string }[] = [
  { key: "amazing", emoji: "🌟", label: "Отлично" },
  { key: "good", emoji: "😊", label: "Хорошо" },
  { key: "okay", emoji: "😐", label: "Норм" },
  { key: "bad", emoji: "😔", label: "Плохо" },
  { key: "awful", emoji: "😰", label: "Ужасно" },
];

const MOOD_COLORS: Record<Mood, string> = {
  amazing: "#34d399",
  good: "#22d3ee",
  okay: "#fbbf24",
  bad: "#f97316",
  awful: "#ec4899",
};

const CARDS = [
  { q: "Что сделало тебя счастливым на этой неделе?", cat: "Чувства", color: "shine-purple" },
  { q: "Если бы ты мог стать суперегероем, какой силой обладал?", cat: "Фантазия", color: "shine-cyan" },
  { q: "Расскажи о своём самом смешном воспоминании из детства", cat: "Память", color: "shine-coral" },
  { q: "Чему ты хочешь научиться в этом году?", cat: "Мечты", color: "shine-lime" },
  { q: "Какое место на Земле ты хочешь посетить больше всего?", cat: "Путешествия", color: "shine-amber" },
  { q: "Если бы завтра не нужно было работать, что бы ты сделал?", cat: "Свобода", color: "shine-pink" },
  { q: "Назови три вещи, за которые ты благодарен сегодня", cat: "Благодарность", color: "shine-purple" },
  { q: "Кем ты хотел стать в детстве?", cat: "Мечты", color: "shine-cyan" },
  { q: "Какую суперспособность выбрал бы для всей семьи?", cat: "Фантазия", color: "shine-coral" },
  { q: "Расскажи о моменте, когда ты был по-настоящему горд собой", cat: "Достижения", color: "shine-lime" },
];

const GRADIENT_MAP: Record<string, string> = {
  "shine-purple": "linear-gradient(135deg, hsl(262 80% 55%), hsl(290 70% 60%))",
  "shine-cyan": "linear-gradient(135deg, hsl(188 90% 45%), hsl(200 80% 55%))",
  "shine-coral": "linear-gradient(135deg, hsl(15 90% 58%), hsl(340 85% 60%))",
  "shine-lime": "linear-gradient(135deg, hsl(142 70% 45%), hsl(160 65% 45%))",
  "shine-amber": "linear-gradient(135deg, hsl(42 95% 52%), hsl(25 90% 55%))",
  "shine-pink": "linear-gradient(135deg, hsl(330 85% 58%), hsl(310 70% 58%))",
};

const EVENTS_INIT = [
  { id: 1, title: "Кино всей семьёй", date: "22 марта", color: "shine-purple", icon: "Film" },
  { id: 2, title: "Пикник в парке", date: "29 марта", color: "shine-lime", icon: "TreePine" },
  { id: 3, title: "День рождения мамы", date: "5 апреля", color: "shine-coral", icon: "Cake" },
];

const DAYS_OF_WEEK = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function getMarchDays() {
  const days: { day: number; offset: boolean }[] = [];
  for (let i = 0; i < 6; i++) days.push({ day: 0, offset: true });
  for (let d = 1; d <= 31; d++) days.push({ day: d, offset: false });
  return days;
}

// ─── GeometricBg ─────────────────────────────────────────────────────────────
function GeometricBg() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full"
        style={{ background: "hsl(262 80% 68%)", filter: "blur(80px)", opacity: 0.12 }} />
      <div className="absolute top-1/3 -right-16 w-56 h-56 rounded-full"
        style={{ background: "hsl(188 90% 55%)", filter: "blur(60px)", opacity: 0.1 }} />
      <div className="absolute -bottom-16 left-1/4 w-64 h-64 rounded-full"
        style={{ background: "hsl(15 90% 65%)", filter: "blur(80px)", opacity: 0.08 }} />
      <svg className="absolute top-16 right-8" width="100" height="100" viewBox="0 0 100 100" style={{ opacity: 0.04 }}>
        <polygon points="50,5 95,90 5,90" fill="none" stroke="hsl(262 80% 68%)" strokeWidth="2" />
      </svg>
      <svg className="absolute bottom-40 left-4" width="72" height="72" viewBox="0 0 72 72" style={{ opacity: 0.04 }}>
        <rect x="4" y="4" width="64" height="64" fill="none" stroke="hsl(188 90% 55%)" strokeWidth="2" transform="rotate(20 36 36)" />
      </svg>
    </div>
  );
}

// ─── HomeScreen ──────────────────────────────────────────────────────────────
function HomeScreen({ onNav }: { onNav: (t: Tab) => void }) {
  return (
    <div className="flex flex-col h-full px-5 pt-10 pb-4 animate-fade-in">
      <div className="mb-8">
        <p className="text-xs font-golos text-muted-foreground uppercase tracking-widest mb-2">Семейная игра</p>
        <h1 className="font-unbounded text-2xl font-black leading-tight">
          Не все<br />
          <span style={{ background: "linear-gradient(90deg, hsl(262 80% 70%), hsl(188 90% 60%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Дома
          </span>
        </h1>
      </div>

      {/* Hero */}
      <div className="relative rounded-3xl p-5 mb-6 overflow-hidden animate-pulse-glow"
        style={{ background: "linear-gradient(135deg, hsl(262 80% 20% / 0.7) 0%, hsl(188 90% 20% / 0.5) 100%)", border: "1px solid hsl(262 80% 68% / 0.3)" }}>
        <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full" style={{ background: "hsl(262 80% 68% / 0.15)" }} />
        <div className="absolute bottom-0 right-0 w-20 h-20 opacity-20">
          <svg viewBox="0 0 80 80"><polygon points="40,5 75,70 5,70" fill="hsl(188 90% 55%)" /></svg>
        </div>
        <p className="text-xs font-golos mb-1" style={{ color: "hsl(262 80% 80%)" }}>Сегодня · 21 марта 2026</p>
        <p className="font-unbounded text-lg font-bold text-white mb-1">Суббота!</p>
        <p className="text-sm font-golos mb-4" style={{ color: "hsl(0 0% 80%)" }}>Отличный день для игры с семьёй</p>
        <button onClick={() => onNav("cards")}
          className="px-5 py-2.5 rounded-2xl text-sm font-golos font-semibold text-white active:scale-95 transition-transform"
          style={{ background: "linear-gradient(135deg, hsl(262 80% 68%), hsl(188 90% 55%))" }}>
          Начать игру →
        </button>
      </div>

      {/* Grid */}
      <p className="text-xs font-golos text-muted-foreground uppercase tracking-widest mb-3">Разделы</p>
      <div className="grid grid-cols-2 gap-3">
        {[
          { tab: "mood" as Tab, icon: "Heart", label: "Настроение", sub: "Как ты сегодня?", grad: "hsl(330 85% 65% / 0.15)", border: "hsl(330 85% 65% / 0.25)" },
          { tab: "cards" as Tab, icon: "Layers", label: "Карточки", sub: "Вопросы для семьи", grad: "hsl(262 80% 68% / 0.15)", border: "hsl(262 80% 68% / 0.25)" },
          { tab: "events" as Tab, icon: "CalendarDays", label: "События", sub: "Планы и мероприятия", grad: "hsl(188 90% 55% / 0.12)", border: "hsl(188 90% 55% / 0.25)" },
          { tab: "mood" as Tab, icon: "TrendingUp", label: "Статистика", sub: "История настроений", grad: "hsl(42 95% 60% / 0.15)", border: "hsl(42 95% 60% / 0.25)" },
        ].map((item) => (
          <button key={item.label} onClick={() => onNav(item.tab)}
            className="rounded-2xl p-4 text-left active:scale-95 transition-transform"
            style={{ background: item.grad, border: `1px solid ${item.border}` }}>
            <Icon name={item.icon} size={22} className="mb-2.5 text-foreground/80" />
            <p className="font-golos font-semibold text-sm">{item.label}</p>
            <p className="font-golos text-xs mt-0.5" style={{ color: "hsl(0 0% 55%)" }}>{item.sub}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── MoodScreen ──────────────────────────────────────────────────────────────
function MoodScreen() {
  const days = getMarchDays();
  const today = 21;
  const [moodMap, setMoodMap] = useState<Record<number, MoodEntry>>({
    5: { mood: "amazing", note: "" }, 8: { mood: "good", note: "" },
    10: { mood: "okay", note: "" }, 12: { mood: "bad", note: "" },
    14: { mood: "amazing", note: "" }, 15: { mood: "good", note: "" },
    17: { mood: "good", note: "" }, 19: { mood: "amazing", note: "" },
    20: { mood: "okay", note: "" },
  });
  const [selected, setSelected] = useState<number>(today);
  const [pickingMood, setPickingMood] = useState(false);

  const setMood = (m: Mood) => {
    setMoodMap(prev => ({ ...prev, [today]: { mood: m, note: "" } }));
    setPickingMood(false);
  };

  const selectedEntry = moodMap[selected];

  return (
    <div className="flex flex-col h-full px-5 pt-10 pb-4 animate-fade-in">
      <div className="mb-5">
        <p className="text-xs font-golos text-muted-foreground uppercase tracking-widest mb-1">Март 2026</p>
        <h2 className="font-unbounded text-xl font-bold">Настроение</h2>
      </div>

      {/* Legend */}
      <div className="flex gap-3 mb-4 flex-wrap">
        {MOODS.map(m => (
          <div key={m.key} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: MOOD_COLORS[m.key] }} />
            <span className="text-xs font-golos text-muted-foreground">{m.label}</span>
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div className="rounded-2xl p-4 mb-4" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS_OF_WEEK.map(d => (
            <div key={d} className="text-center text-xs font-golos text-muted-foreground font-semibold py-1">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((item, i) => {
            if (item.offset) return <div key={`off-${i}`} />;
            const entry = moodMap[item.day];
            const isToday = item.day === today;
            const isSel = selected === item.day;
            return (
              <button key={item.day}
                onClick={() => { setSelected(item.day); if (item.day === today) setPickingMood(false); }}
                className="relative aspect-square rounded-xl flex items-center justify-center text-xs font-golos font-medium transition-all active:scale-90"
                style={{
                  background: entry ? MOOD_COLORS[entry.mood] : isSel ? "hsl(262 80% 68% / 0.15)" : "transparent",
                  ring: isSel ? "2px solid hsl(262 80% 68%)" : undefined,
                  outline: isSel ? "2px solid hsl(262 80% 68%)" : isToday && !isSel ? "1px solid hsl(262 80% 68% / 0.4)" : "none",
                  transform: isSel ? "scale(1.1)" : undefined,
                  color: entry ? "white" : undefined,
                }}>
                {entry ? <span className="text-base leading-none">{MOODS.find(m => m.key === entry.mood)?.emoji}</span>
                  : <span style={{ color: "hsl(0 0% 70%)" }}>{item.day}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mood picker for today */}
      {selected === today && (
        <div className="animate-scale-in">
          <p className="text-sm font-golos text-muted-foreground mb-3">
            {selectedEntry ? "Твоё настроение сегодня:" : "Как твоё настроение?"}
          </p>
          {!selectedEntry || pickingMood ? (
            <div className="grid grid-cols-5 gap-2">
              {MOODS.map(m => (
                <button key={m.key} onClick={() => setMood(m.key)}
                  className="rounded-2xl p-2 flex flex-col items-center gap-1 active:scale-90 transition-transform"
                  style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
                  <span className="text-2xl">{m.emoji}</span>
                  <span className="text-xs font-golos" style={{ color: "hsl(0 0% 55%)" }}>{m.label}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl p-4 flex items-center gap-3"
              style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
              <span className="text-4xl">{MOODS.find(m => m.key === selectedEntry.mood)?.emoji}</span>
              <div className="flex-1">
                <p className="font-golos font-semibold">{MOODS.find(m => m.key === selectedEntry.mood)?.label}</p>
                <p className="text-xs font-golos text-muted-foreground">Сегодня, 21 марта</p>
              </div>
              <button onClick={() => setPickingMood(true)}
                className="text-xs font-golos font-medium" style={{ color: "hsl(262 80% 70%)" }}>
                Изменить
              </button>
            </div>
          )}
        </div>
      )}

      {/* Past day */}
      {selected !== today && selectedEntry && (
        <div className="rounded-2xl p-4 flex items-center gap-3 animate-scale-in"
          style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
          <span className="text-4xl">{MOODS.find(m => m.key === selectedEntry.mood)?.emoji}</span>
          <div>
            <p className="font-golos font-semibold">{MOODS.find(m => m.key === selectedEntry.mood)?.label}</p>
            <p className="text-xs font-golos text-muted-foreground">{selected} марта 2026</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CardsScreen ─────────────────────────────────────────────────────────────
function CardsScreen() {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  const card = CARDS[index % CARDS.length];
  const nextCard = CARDS[(index + 1) % CARDS.length];

  const handleNext = () => {
    setFlipped(false);
    setTimeout(() => { setIndex(i => i + 1); setAnimKey(k => k + 1); }, 150);
  };
  const handlePrev = () => {
    setFlipped(false);
    setTimeout(() => { setIndex(i => (i - 1 + CARDS.length) % CARDS.length); setAnimKey(k => k + 1); }, 150);
  };

  return (
    <div className="flex flex-col h-full px-5 pt-10 pb-4 animate-fade-in">
      <div className="mb-5">
        <p className="text-xs font-golos text-muted-foreground uppercase tracking-widest mb-1">
          {(index % CARDS.length) + 1} из {CARDS.length}
        </p>
        <h2 className="font-unbounded text-xl font-bold">Игра в вопросы</h2>
      </div>

      {/* Progress */}
      <div className="flex gap-1 mb-6">
        {CARDS.map((_, i) => (
          <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{ background: i <= index % CARDS.length ? "hsl(262 80% 68%)" : "hsl(240 10% 20%)" }} />
        ))}
      </div>

      {/* Card */}
      <div className="flex-1 flex flex-col items-center justify-center" style={{ perspective: "1000px" }}>
        <div key={animKey} className={`card-flip w-full animate-card-enter ${flipped ? "flipped" : ""}`}
          style={{ height: "260px" }} onClick={() => setFlipped(f => !f)}>

          {/* Front */}
          <div className="card-face absolute inset-0 rounded-3xl p-6 flex flex-col justify-between overflow-hidden"
            style={{ height: "260px", background: GRADIENT_MAP[card.color] }}>
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
            <div className="absolute bottom-0 right-0 w-20 h-20 opacity-15"
              style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)", background: "rgba(0,0,0,0.2)" }} />
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-black/25 text-white text-xs font-golos font-semibold mb-3">
                {card.cat}
              </span>
              <p className="font-golos font-semibold text-white text-lg leading-snug">{card.q}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-white/60 text-xs font-golos">Нажми, чтобы ответить</p>
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <Icon name="RotateCcw" size={15} className="text-white" />
              </div>
            </div>
          </div>

          {/* Back */}
          <div className="card-face card-back absolute inset-0 rounded-3xl p-6 flex flex-col justify-center items-center"
            style={{ height: "260px", background: "hsl(240 12% 14%)", border: "1px solid hsl(var(--border))" }}>
            <div className="w-14 h-14 rounded-2xl mb-4 flex items-center justify-center"
              style={{ background: "hsl(262 80% 68% / 0.2)", border: "1px solid hsl(262 80% 68% / 0.3)" }}>
              <Icon name="MessageCircle" size={26} className="text-primary" />
            </div>
            <p className="font-golos text-muted-foreground text-center text-sm leading-relaxed">
              Поделитесь своим ответом<br />со всей семьёй!
            </p>
            <p className="mt-3 text-xs font-golos" style={{ color: "hsl(0 0% 35%)" }}>Нажми снова, чтобы вернуться</p>
          </div>
        </div>

        {/* Preview next */}
        <div className="mt-3 w-full pointer-events-none" style={{ opacity: 0.25, transform: "scale(0.95)" }}>
          <div className="rounded-2xl px-5 py-2.5" style={{ background: GRADIENT_MAP[nextCard.color] }}>
            <span className="text-white/80 text-xs font-golos">{nextCard.cat} · следующая</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 mt-5">
        <button onClick={handlePrev}
          className="flex-1 py-3 rounded-2xl font-golos font-semibold text-sm active:scale-95 transition-transform"
          style={{ background: "hsl(var(--secondary))", color: "hsl(0 0% 75%)" }}>
          ← Назад
        </button>
        <button onClick={() => setFlipped(f => !f)}
          className="w-14 h-14 rounded-2xl flex items-center justify-center active:scale-90 transition-transform"
          style={{ background: "linear-gradient(135deg, hsl(262 80% 68%), hsl(188 90% 55%))" }}>
          <Icon name="RefreshCw" size={20} className="text-white" />
        </button>
        <button onClick={handleNext}
          className="flex-1 py-3 rounded-2xl font-golos font-semibold text-sm text-white active:scale-95 transition-transform"
          style={{ background: "linear-gradient(135deg, hsl(262 80% 68%), hsl(188 90% 55%))" }}>
          Далее →
        </button>
      </div>
    </div>
  );
}

// ─── EventsScreen ────────────────────────────────────────────────────────────
function EventsScreen() {
  const [events, setEvents] = useState(EVENTS_INIT);
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");

  const addEvent = () => {
    if (!newTitle.trim()) return;
    const colors = ["shine-purple", "shine-cyan", "shine-coral", "shine-lime", "shine-amber", "shine-pink"];
    const icons = ["Star", "Sparkles", "Gift", "Music", "Zap", "Heart"];
    const idx = events.length % colors.length;
    setEvents(prev => [...prev, {
      id: Date.now(), title: newTitle,
      date: newDate || "Скоро", color: colors[idx], icon: icons[idx],
    }]);
    setNewTitle(""); setNewDate(""); setShowForm(false);
  };

  return (
    <div className="flex flex-col h-full px-5 pt-10 pb-4 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-golos text-muted-foreground uppercase tracking-widest mb-1">Семья</p>
          <h2 className="font-unbounded text-xl font-bold">События</h2>
        </div>
        <button onClick={() => setShowForm(s => !s)}
          className="w-11 h-11 rounded-2xl flex items-center justify-center text-white active:scale-90 transition-transform"
          style={{ background: "linear-gradient(135deg, hsl(262 80% 68%), hsl(188 90% 55%))" }}>
          <Icon name={showForm ? "X" : "Plus"} size={20} />
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl p-4 mb-5 animate-scale-in"
          style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
          <p className="font-golos font-semibold text-sm mb-3">Новое событие</p>
          <input value={newTitle} onChange={e => setNewTitle(e.target.value)}
            placeholder="Название события"
            className="w-full rounded-xl px-3 py-2.5 text-sm font-golos mb-2 outline-none transition-colors"
            style={{ background: "hsl(240 10% 18%)", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }} />
          <input value={newDate} onChange={e => setNewDate(e.target.value)}
            placeholder="Дата (например: 1 апреля)"
            className="w-full rounded-xl px-3 py-2.5 text-sm font-golos mb-3 outline-none transition-colors"
            style={{ background: "hsl(240 10% 18%)", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }} />
          <button onClick={addEvent}
            className="w-full py-2.5 rounded-xl text-sm font-golos font-semibold text-white"
            style={{ background: "linear-gradient(135deg, hsl(262 80% 68%), hsl(188 90% 55%))" }}>
            Добавить
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="space-y-3 pb-2">
          {events.map((event, i) => (
            <div key={event.id} className="flex gap-4 animate-slide-up" style={{ animationDelay: `${i * 70}ms` }}>
              <div className="flex flex-col items-center">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                  style={{ background: GRADIENT_MAP[event.color] }}>
                  <Icon name={event.icon} size={18} />
                </div>
                {i < events.length - 1 && (
                  <div className="w-px mt-2 flex-1" style={{ background: "hsl(var(--border))", minHeight: "16px" }} />
                )}
              </div>
              <div className="rounded-2xl p-4 flex-1"
                style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
                <p className="font-golos font-semibold text-sm">{event.title}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Icon name="Calendar" size={11} className="text-muted-foreground" />
                  <p className="text-xs font-golos text-muted-foreground">{event.date}</p>
                </div>
              </div>
            </div>
          ))}
          {events.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-2xl mb-4 flex items-center justify-center"
                style={{ background: "hsl(262 80% 68% / 0.12)", border: "1px solid hsl(262 80% 68% / 0.2)" }}>
                <Icon name="CalendarPlus" size={28} className="text-primary" />
              </div>
              <p className="font-golos font-semibold mb-1">Пока нет событий</p>
              <p className="text-sm font-golos text-muted-foreground">Добавьте первое мероприятие</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── BottomNav ────────────────────────────────────────────────────────────────
const NAV_ITEMS: { tab: Tab; icon: string; label: string }[] = [
  { tab: "home", icon: "Home", label: "Главная" },
  { tab: "mood", icon: "Heart", label: "Настроение" },
  { tab: "cards", icon: "Layers", label: "Карточки" },
  { tab: "events", icon: "CalendarDays", label: "События" },
];

function BottomNav({ active, onNav }: { active: Tab; onNav: (t: Tab) => void }) {
  return (
    <div className="px-4 pb-6 pt-3" style={{ background: "linear-gradient(to top, hsl(var(--background)) 60%, transparent)" }}>
      <div className="flex items-center gap-1 p-1.5 rounded-2xl"
        style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        {NAV_ITEMS.map(item => {
          const isActive = active === item.tab;
          return (
            <button key={item.tab} onClick={() => onNav(item.tab)}
              className="nav-pill flex-1 flex flex-col items-center gap-0.5 py-2 px-1 rounded-xl transition-all"
              style={isActive ? {
                background: "linear-gradient(135deg, hsl(262 80% 68% / 0.2), hsl(188 90% 55% / 0.1))",
                border: "1px solid hsl(262 80% 68% / 0.3)",
              } : {}}>
              <Icon name={item.icon} size={20}
                className={isActive ? "text-primary" : "text-muted-foreground"} />
              <span className="text-xs font-golos"
                style={{ color: isActive ? "hsl(0 0% 95%)" : "hsl(0 0% 45%)", fontWeight: isActive ? 600 : 400 }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState<Tab>("home");

  const screen = {
    home: <HomeScreen onNav={setTab} />,
    mood: <MoodScreen />,
    cards: <CardsScreen />,
    events: <EventsScreen />,
  }[tab];

  return (
    <div className="geo-bg min-h-screen flex justify-center">
      <div className="w-full max-w-sm flex flex-col relative overflow-hidden" style={{ minHeight: "100dvh" }}>
        <GeometricBg />
        <div className="relative z-10 flex-1 overflow-y-auto scrollbar-hide">
          {screen}
        </div>
        <div className="relative z-10 flex-shrink-0">
          <BottomNav active={tab} onNav={setTab} />
        </div>
      </div>
    </div>
  );
}
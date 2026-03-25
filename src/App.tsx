import { useState } from "react";
import Icon from "@/components/ui/icon";

type Tab = "home" | "mood" | "cards" | "events" | "profile";
type Mood = "amazing" | "good" | "okay" | "bad" | "awful";
type MoodEntry = { mood: Mood; note: string };

const BRAND = {
  red: "#b61834",
  blue: "#5ebaf2",
  purple: "#cda8f2",
  amber: "#ec9e50",
};

const MOODS: { key: Mood; emoji: string; label: string; color: string }[] = [
  { key: "amazing", emoji: "🌟", label: "Отлично", color: BRAND.amber },
  { key: "good", emoji: "😊", label: "Хорошо", color: BRAND.blue },
  { key: "okay", emoji: "😐", label: "Норм", color: BRAND.purple },
  { key: "bad", emoji: "😔", label: "Плохо", color: BRAND.red },
  { key: "awful", emoji: "😰", label: "Ужасно", color: "#888" },
];

const MOOD_COLORS: Record<Mood, string> = {
  amazing: BRAND.amber,
  good: BRAND.blue,
  okay: BRAND.purple,
  bad: BRAND.red,
  awful: "#999",
};

const GRADIENT_MAP: Record<string, string> = {
  "shine-purple": `linear-gradient(135deg, ${BRAND.purple}, #b88ce8)`,
  "shine-cyan":   `linear-gradient(135deg, ${BRAND.blue}, #3aa3e8)`,
  "shine-coral":  `linear-gradient(135deg, ${BRAND.red}, #d4203f)`,
  "shine-lime":   `linear-gradient(135deg, ${BRAND.amber}, #e08530)`,
  "shine-amber":  `linear-gradient(135deg, ${BRAND.amber}, #e08530)`,
  "shine-pink":   `linear-gradient(135deg, ${BRAND.purple}, #b88ce8)`,
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

const EVENTS_INIT = [
  { id: 1, title: "Вечер кино", date: "22 марта", color: "shine-purple", icon: "Film" },
  { id: 2, title: "Пикник на природе", date: "27 марта", color: "shine-amber", icon: "TreePine" },
  { id: 3, title: "День рождения папы", date: "27 марта", color: "shine-coral", icon: "Cake" },
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
        style={{ background: BRAND.red, filter: "blur(90px)", opacity: 0.07 }} />
      <div className="absolute top-1/3 -right-16 w-56 h-56 rounded-full"
        style={{ background: BRAND.blue, filter: "blur(70px)", opacity: 0.08 }} />
      <div className="absolute -bottom-16 left-1/3 w-64 h-64 rounded-full"
        style={{ background: BRAND.purple, filter: "blur(90px)", opacity: 0.07 }} />
      <svg className="absolute top-16 right-8" width="100" height="100" viewBox="0 0 100 100" style={{ opacity: 0.06 }}>
        <polygon points="50,5 95,90 5,90" fill="none" stroke={BRAND.red} strokeWidth="2" />
      </svg>
      <svg className="absolute bottom-40 left-4" width="72" height="72" viewBox="0 0 72 72" style={{ opacity: 0.06 }}>
        <rect x="4" y="4" width="64" height="64" fill="none" stroke={BRAND.blue} strokeWidth="2" transform="rotate(20 36 36)" />
      </svg>
    </div>
  );
}

// ─── HomeScreen ──────────────────────────────────────────────────────────────
function HomeScreen({ onNav }: { onNav: (t: Tab) => void }) {
  return (
    <div className="flex flex-col px-5 pt-10 pb-4 animate-fade-in gap-6">
      {/* Заголовок */}
      <div>
        <p className="font-golos text-xs uppercase tracking-widest mb-1" style={{ color: "#999" }}>Добро пожаловать</p>
        <h1 className="font-unbounded font-black leading-[1.0]" style={{ fontSize: "3rem", color: "#111" }}>
          НЕ ВСЕ<br />ДОМА
        </h1>
      </div>

      {/* Hero карточка */}
      <div className="rounded-2xl p-5"
        style={{ border: "1.5px solid #e0e0e0", background: "#fff", boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
        <p className="font-golos text-sm mb-0.5" style={{ color: "#888" }}>Сегодня 21 марта 2026</p>
        <p className="font-golos font-bold text-xl mb-1 text-foreground">Суббота!</p>
        <p className="font-golos text-sm mb-4" style={{ color: "#888" }}>Отличный день для игры с семьёй</p>
        <button onClick={() => onNav("cards")}
          className="px-6 py-2.5 rounded-xl font-golos font-semibold text-sm text-white active:scale-95 transition-transform"
          style={{ background: BRAND.blue }}>
          Начать игру
        </button>
      </div>

      {/* Разделы */}
      <div>
        <p className="font-golos text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#111" }}>Разделы</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { tab: "mood" as Tab, label: "Настроение", sub: "История настроений", bg: BRAND.blue },
            { tab: "cards" as Tab, label: "Карточки", sub: "Вопросы для семьи", bg: BRAND.purple },
            { tab: "events" as Tab, label: "События", sub: "Планы и мероприятия", bg: BRAND.amber },
            { tab: "profile" as Tab, label: "Профиль", sub: "Члены семьи", bg: BRAND.red },
          ].map((item) => (
            <button key={item.label} onClick={() => onNav(item.tab)}
              className="rounded-2xl p-4 text-left active:scale-95 transition-transform"
              style={{ background: item.bg }}>
              <div className="w-8 h-8 rounded-full bg-white/30 mb-10" />
              <p className="font-golos font-bold text-sm text-white">{item.label}</p>
              <p className="font-golos text-xs mt-0.5 text-white/75">{item.sub}</p>
            </button>
          ))}
        </div>
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
        <p className="text-xs font-golos uppercase tracking-widest mb-1" style={{ color: "#999" }}>Март 2026</p>
        <h2 className="font-unbounded text-xl font-bold text-foreground">Настроение</h2>
      </div>

      {/* Legend */}
      <div className="flex gap-3 mb-4 flex-wrap">
        {MOODS.map(m => (
          <div key={m.key} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: m.color }} />
            <span className="text-xs font-golos" style={{ color: "#777" }}>{m.label}</span>
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div className="rounded-2xl p-4 mb-4" style={{ background: "#fff", border: "1.5px solid #e8e8e8", boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS_OF_WEEK.map(d => (
            <div key={d} className="text-center text-xs font-golos font-semibold py-1" style={{ color: "#aaa" }}>{d}</div>
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
                  background: entry ? MOOD_COLORS[entry.mood] : isSel ? `${BRAND.red}12` : "transparent",
                  outline: isSel ? `2px solid ${BRAND.red}` : isToday && !isSel ? `1.5px solid ${BRAND.red}50` : "none",
                  transform: isSel ? "scale(1.1)" : undefined,
                  color: entry ? "white" : "#333",
                }}>
                {entry ? <span className="text-base leading-none">{MOODS.find(m => m.key === entry.mood)?.emoji}</span>
                  : <span>{item.day}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {selected === today && (
        <div className="animate-scale-in">
          <p className="text-sm font-golos mb-3" style={{ color: "#666" }}>
            {selectedEntry ? "Твоё настроение сегодня:" : "Как твоё настроение?"}
          </p>
          {!selectedEntry || pickingMood ? (
            <div className="grid grid-cols-5 gap-2">
              {MOODS.map(m => (
                <button key={m.key} onClick={() => setMood(m.key)}
                  className="rounded-2xl p-2 flex flex-col items-center gap-1 active:scale-90 transition-transform"
                  style={{ background: `${m.color}15`, border: `1.5px solid ${m.color}35` }}>
                  <span className="text-2xl">{m.emoji}</span>
                  <span className="text-xs font-golos" style={{ color: "#666" }}>{m.label}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl p-4 flex items-center gap-3"
              style={{ background: "#fff", border: "1.5px solid #e8e8e8", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
              <span className="text-4xl">{MOODS.find(m => m.key === selectedEntry.mood)?.emoji}</span>
              <div className="flex-1">
                <p className="font-golos font-semibold text-foreground">{MOODS.find(m => m.key === selectedEntry.mood)?.label}</p>
                <p className="text-xs font-golos" style={{ color: "#888" }}>Сегодня, 21 марта</p>
              </div>
              <button onClick={() => setPickingMood(true)}
                className="text-xs font-golos font-semibold" style={{ color: BRAND.red }}>
                Изменить
              </button>
            </div>
          )}
        </div>
      )}

      {selected !== today && selectedEntry && (
        <div className="rounded-2xl p-4 flex items-center gap-3 animate-scale-in"
          style={{ background: "#fff", border: "1.5px solid #e8e8e8", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <span className="text-4xl">{MOODS.find(m => m.key === selectedEntry.mood)?.emoji}</span>
          <div>
            <p className="font-golos font-semibold text-foreground">{MOODS.find(m => m.key === selectedEntry.mood)?.label}</p>
            <p className="text-xs font-golos" style={{ color: "#888" }}>{selected} марта 2026</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CardsScreen ─────────────────────────────────────────────────────────────
const CARD_CAT_LABEL = "БОЛТАЙКА";

function CardsScreen() {
  const [index, setIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  const card = CARDS[index % CARDS.length];
  const current = (index % CARDS.length) + 1;
  const total = CARDS.length;

  const handleNext = () => {
    setTimeout(() => { setIndex(i => i + 1); setAnimKey(k => k + 1); }, 80);
  };
  const handlePrev = () => {
    setTimeout(() => { setIndex(i => (i - 1 + CARDS.length) % CARDS.length); setAnimKey(k => k + 1); }, 80);
  };

  return (
    <div className="flex flex-col h-full px-5 pt-10 pb-4 animate-fade-in">
      {/* Header */}
      <div className="mb-5">
        <p className="text-xs font-golos mb-1" style={{ color: "#999" }}>{current} из {total}</p>
        <h2 className="font-golos font-bold text-2xl text-foreground">Карточная игра</h2>
      </div>

      {/* Progress bar — дашами */}
      <div className="flex gap-1 mb-6">
        {CARDS.map((_, i) => (
          <div key={i} className="h-[3px] flex-1 rounded-full transition-all duration-300"
            style={{ background: i < current ? BRAND.blue : "#e0e0e0" }} />
        ))}
      </div>

      {/* Card */}
      <div className="flex-1 flex items-center">
        <div key={animKey} className="w-full rounded-3xl p-6 flex flex-col gap-4 animate-card-enter"
          style={{ background: BRAND.blue, minHeight: "240px" }}>
          {/* Категория */}
          <p className="font-golos font-bold text-sm tracking-widest uppercase"
            style={{ color: "rgba(255,255,255,0.65)", fontStyle: "italic" }}>
            {CARD_CAT_LABEL}
          </p>
          {/* Вопрос */}
          <p className="font-golos font-semibold text-white text-xl leading-snug flex-1">
            {card.q}
          </p>
        </div>
      </div>

      {/* Выполняю следующую — бледная кнопка-подсказка */}
      <div className="mt-3 mb-4">
        <div className="w-full py-3 rounded-2xl text-center font-golos text-sm"
          style={{ background: `${BRAND.blue}22`, color: `${BRAND.blue}99` }}>
          Выполняю следующую
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button onClick={handlePrev}
          className="flex-1 py-3.5 rounded-2xl font-golos font-semibold text-sm active:scale-95 transition-transform"
          style={{ background: "#ebebeb", color: "#555" }}>
          Назад
        </button>
        <button onClick={() => setAnimKey(k => k + 1)}
          className="w-14 h-14 rounded-2xl flex items-center justify-center active:scale-90 transition-transform flex-shrink-0"
          style={{ background: BRAND.blue }}>
          <Icon name="RefreshCw" size={20} className="text-white" />
        </button>
        <button onClick={handleNext}
          className="flex-1 py-3.5 rounded-2xl font-golos font-semibold text-sm text-white active:scale-95 transition-transform"
          style={{ background: BRAND.red }}>
          Далее
        </button>
      </div>
    </div>
  );
}

const EVENT_COLORS = [BRAND.purple, BRAND.amber, BRAND.red, BRAND.blue];

// ─── EventsScreen ────────────────────────────────────────────────────────────
function EventsScreen() {
  const [events, setEvents] = useState(EVENTS_INIT);
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");

  const addEvent = () => {
    if (!newTitle.trim()) return;
    const idx = events.length % EVENT_COLORS.length;
    setEvents(prev => [...prev, {
      id: Date.now(), title: newTitle,
      date: newDate || "Скоро", color: "shine-purple", icon: "Star",
      _color: EVENT_COLORS[idx],
    } as typeof EVENTS_INIT[0]]);
    setNewTitle(""); setNewDate(""); setShowForm(false);
  };

  return (
    <div className="flex flex-col h-full px-5 pt-10 pb-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-golos mb-0.5" style={{ color: "#999" }}>Семья</p>
          <h2 className="font-golos font-black text-3xl text-foreground">События</h2>
        </div>
        <button onClick={() => setShowForm(s => !s)}
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-white active:scale-90 transition-transform mt-1"
          style={{ background: BRAND.blue }}>
          <Icon name={showForm ? "X" : "Plus"} size={22} />
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl p-4 mb-4 animate-scale-in"
          style={{ background: "#fff", border: "1.5px solid #e8e8e8", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
          <p className="font-golos font-semibold text-sm mb-3 text-foreground">Новое событие</p>
          <input value={newTitle} onChange={e => setNewTitle(e.target.value)}
            placeholder="Название события"
            className="w-full rounded-xl px-3 py-2.5 text-sm font-golos mb-2 outline-none"
            style={{ background: "#f7f7f7", border: "1.5px solid #e0e0e0", color: "#111" }} />
          <input value={newDate} onChange={e => setNewDate(e.target.value)}
            placeholder="Дата (например: 1 апреля)"
            className="w-full rounded-xl px-3 py-2.5 text-sm font-golos mb-3 outline-none"
            style={{ background: "#f7f7f7", border: "1.5px solid #e0e0e0", color: "#111" }} />
          <button onClick={addEvent}
            className="w-full py-2.5 rounded-xl text-sm font-golos font-bold text-white"
            style={{ background: BRAND.red }}>
            Добавить
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="space-y-3 pb-2">
          {events.map((event, i) => {
            const dotColor = EVENT_COLORS[i % EVENT_COLORS.length];
            return (
              <div key={event.id} className="flex items-center gap-3 animate-slide-up"
                style={{ animationDelay: `${i * 60}ms` }}>
                {/* Цветной квадрат */}
                <div className="w-12 h-12 rounded-2xl flex-shrink-0"
                  style={{ background: dotColor }} />
                {/* Карточка */}
                <div className="rounded-2xl px-4 py-3 flex-1"
                  style={{ background: "#fff", border: "1.5px solid #eeeeee" }}>
                  <p className="font-golos font-semibold text-sm text-foreground">{event.title}</p>
                  <p className="text-xs font-golos mt-0.5" style={{ color: "#aaa" }}>· {event.date}</p>
                </div>
              </div>
            );
          })}
          {events.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="font-golos font-semibold text-foreground mb-1">Пока нет событий</p>
              <p className="text-sm font-golos" style={{ color: "#aaa" }}>Нажмите + чтобы добавить</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── ProfileScreen ───────────────────────────────────────────────────────────
const FAMILY_MEMBERS_INIT = [
  { id: 1, name: "Мама", role: "Организатор", emoji: "👩", color: BRAND.red },
  { id: 2, name: "Папа", role: "Участник", emoji: "👨", color: BRAND.blue },
  { id: 3, name: "Аня", role: "Участник", emoji: "👧", color: BRAND.purple },
  { id: 4, name: "Миша", role: "Участник", emoji: "👦", color: BRAND.amber },
];

const PROFILE_EMOJIS = ["👩","👨","👧","👦","👴","👵","🧑","👶","🐱","🐶","🦊","🐼","🐸","🦁","🐯","🦄"];
const PROFILE_COLORS = [BRAND.red, BRAND.blue, BRAND.purple, BRAND.amber, "#4caf7d", "#e67e7e", "#7eb8e6", "#a0a0a0"];

function ProfileScreen() {
  const [profile, setProfile] = useState({ name: "Мама", role: "Организатор игры", emoji: "👩", color: BRAND.red });
  const [members, setMembers] = useState(FAMILY_MEMBERS_INIT);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);
  const [addingMember, setAddingMember] = useState(false);
  const [newMember, setNewMember] = useState({ name: "", role: "Участник", emoji: "👦", color: BRAND.blue });

  const saveProfile = () => { setProfile(draft); setEditing(false); };

  const addMember = () => {
    if (!newMember.name.trim()) return;
    setMembers(prev => [...prev, { ...newMember, id: Date.now() }]);
    setNewMember({ name: "", role: "Участник", emoji: "👦", color: BRAND.blue });
    setAddingMember(false);
  };

  const removeMember = (id: number) => setMembers(prev => prev.filter(m => m.id !== id));

  return (
    <div className="flex flex-col h-full px-5 pt-10 pb-4 animate-fade-in overflow-y-auto scrollbar-hide">
      {/* Заголовок */}
      <div className="mb-5">
        <p className="font-golos text-xs mb-0.5" style={{ color: "#999" }}>Аккаунт</p>
        <h2 className="font-golos font-black text-3xl text-foreground">Профиль</h2>
      </div>

      {/* Карточка профиля */}
      <div className="rounded-2xl p-5 mb-4 flex items-center gap-4"
        style={{ background: profile.color }}>
        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl flex-shrink-0">
          {profile.emoji}
        </div>
        <div className="flex-1">
          <p className="font-golos font-black text-white text-xl leading-tight">{profile.name}</p>
          <p className="font-golos text-sm text-white/70 mt-0.5">{profile.role}</p>
        </div>
        <button onClick={() => { setDraft(profile); setEditing(true); }}
          className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center active:scale-90 transition-transform">
          <Icon name="Pencil" size={16} className="text-white" />
        </button>
      </div>

      {/* Форма редактирования */}
      {editing && (
        <div className="rounded-2xl p-4 mb-4 animate-scale-in"
          style={{ background: "#fff", border: "1.5px solid #e8e8e8", boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}>
          <p className="font-golos font-bold text-sm mb-3">Редактировать профиль</p>

          <input value={draft.name} onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
            placeholder="Имя"
            className="w-full rounded-xl px-3 py-2.5 text-sm font-golos mb-2 outline-none"
            style={{ background: "#f7f7f7", border: "1.5px solid #e0e0e0", color: "#111" }} />
          <input value={draft.role} onChange={e => setDraft(d => ({ ...d, role: e.target.value }))}
            placeholder="Роль (напр. Организатор игры)"
            className="w-full rounded-xl px-3 py-2.5 text-sm font-golos mb-3 outline-none"
            style={{ background: "#f7f7f7", border: "1.5px solid #e0e0e0", color: "#111" }} />

          <p className="font-golos text-xs font-semibold mb-2" style={{ color: "#999" }}>Аватар</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {PROFILE_EMOJIS.map(em => (
              <button key={em} onClick={() => setDraft(d => ({ ...d, emoji: em }))}
                className="w-9 h-9 rounded-xl text-xl flex items-center justify-center transition-transform active:scale-90"
                style={{ background: draft.emoji === em ? `${draft.color}20` : "#f5f5f5", border: draft.emoji === em ? `2px solid ${draft.color}` : "2px solid transparent" }}>
                {em}
              </button>
            ))}
          </div>

          <p className="font-golos text-xs font-semibold mb-2" style={{ color: "#999" }}>Цвет карточки</p>
          <div className="flex gap-2 mb-4">
            {PROFILE_COLORS.map(c => (
              <button key={c} onClick={() => setDraft(d => ({ ...d, color: c }))}
                className="w-7 h-7 rounded-full flex-shrink-0 transition-transform active:scale-90"
                style={{ background: c, border: draft.color === c ? "2.5px solid #111" : "2.5px solid transparent", outline: draft.color === c ? "2px solid white" : "none", outlineOffset: "-3px" }} />
            ))}
          </div>

          <div className="flex gap-2">
            <button onClick={() => setEditing(false)}
              className="flex-1 py-2.5 rounded-xl text-sm font-golos font-bold"
              style={{ background: "#f0f0f0", color: "#555" }}>
              Отмена
            </button>
            <button onClick={saveProfile}
              className="flex-1 py-2.5 rounded-xl text-sm font-golos font-bold text-white"
              style={{ background: profile.color }}>
              Сохранить
            </button>
          </div>
        </div>
      )}

      {/* Статистика */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        {[{ label: "Игр", value: "24" }, { label: "Дней", value: "18" }, { label: "Событий", value: "7" }].map(s => (
          <div key={s.label} className="rounded-2xl p-3 text-center"
            style={{ background: "#f5f5f5", border: "1.5px solid #eee" }}>
            <p className="font-golos font-black text-xl" style={{ color: "#111" }}>{s.value}</p>
            <p className="font-golos text-xs mt-0.5" style={{ color: "#999" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Члены семьи */}
      <p className="font-golos text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#999" }}>Моя семья</p>
      <div className="space-y-2">
        {members.map((m, i) => (
          <div key={m.id}
            className="flex items-center gap-3 rounded-2xl px-4 py-3 animate-slide-up"
            style={{ background: "#fff", border: "1.5px solid #e8e8e8", animationDelay: `${i * 50}ms` }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: `${m.color}18` }}>
              {m.emoji}
            </div>
            <div className="flex-1">
              <p className="font-golos font-semibold text-sm text-foreground">{m.name}</p>
              <p className="font-golos text-xs" style={{ color: "#aaa" }}>{m.role}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: m.color }} />
              <button onClick={() => removeMember(m.id)}
                className="w-7 h-7 rounded-lg flex items-center justify-center active:scale-90 transition-transform"
                style={{ background: "#f5f5f5" }}>
                <Icon name="X" size={13} style={{ color: "#bbb" }} />
              </button>
            </div>
          </div>
        ))}

        {/* Форма добавления */}
        {addingMember && (
          <div className="rounded-2xl p-4 animate-scale-in"
            style={{ background: "#fff", border: "1.5px solid #e8e8e8" }}>
            <input value={newMember.name} onChange={e => setNewMember(d => ({ ...d, name: e.target.value }))}
              placeholder="Имя участника"
              className="w-full rounded-xl px-3 py-2.5 text-sm font-golos mb-2 outline-none"
              style={{ background: "#f7f7f7", border: "1.5px solid #e0e0e0", color: "#111" }} />
            <input value={newMember.role} onChange={e => setNewMember(d => ({ ...d, role: e.target.value }))}
              placeholder="Роль"
              className="w-full rounded-xl px-3 py-2.5 text-sm font-golos mb-3 outline-none"
              style={{ background: "#f7f7f7", border: "1.5px solid #e0e0e0", color: "#111" }} />
            <div className="flex flex-wrap gap-1.5 mb-3">
              {PROFILE_EMOJIS.slice(0, 8).map(em => (
                <button key={em} onClick={() => setNewMember(d => ({ ...d, emoji: em }))}
                  className="w-9 h-9 rounded-xl text-xl flex items-center justify-center"
                  style={{ background: newMember.emoji === em ? "#f0f0f0" : "#fafafa", border: newMember.emoji === em ? "2px solid #333" : "2px solid transparent" }}>
                  {em}
                </button>
              ))}
            </div>
            <div className="flex gap-1.5 mb-3">
              {PROFILE_COLORS.map(c => (
                <button key={c} onClick={() => setNewMember(d => ({ ...d, color: c }))}
                  className="w-6 h-6 rounded-full flex-shrink-0"
                  style={{ background: c, border: newMember.color === c ? "2.5px solid #111" : "2.5px solid transparent" }} />
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setAddingMember(false)}
                className="flex-1 py-2 rounded-xl text-sm font-golos font-bold"
                style={{ background: "#f0f0f0", color: "#555" }}>
                Отмена
              </button>
              <button onClick={addMember}
                className="flex-1 py-2 rounded-xl text-sm font-golos font-bold text-white"
                style={{ background: BRAND.red }}>
                Добавить
              </button>
            </div>
          </div>
        )}

        {/* Кнопка добавить */}
        {!addingMember && (
          <button onClick={() => setAddingMember(true)}
            className="w-full flex items-center gap-3 rounded-2xl px-4 py-3 active:scale-95 transition-transform"
            style={{ border: "1.5px dashed #ddd", background: "transparent" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "#f5f5f5" }}>
              <Icon name="Plus" size={18} style={{ color: "#bbb" }} />
            </div>
            <p className="font-golos text-sm font-medium" style={{ color: "#bbb" }}>Добавить участника</p>
          </button>
        )}
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
  { tab: "profile", icon: "User", label: "Профиль" },
];

function BottomNav({ active, onNav }: { active: Tab; onNav: (t: Tab) => void }) {
  return (
    <div className="px-4 pb-6 pt-3"
      style={{ background: "linear-gradient(to top, #ffffff 60%, transparent)" }}>
      <div className="flex items-center gap-1 p-1.5 rounded-2xl"
        style={{ background: "#fff", border: "1.5px solid #e8e8e8", boxShadow: "0 -2px 20px rgba(0,0,0,0.06)" }}>
        {NAV_ITEMS.map(item => {
          const isActive = active === item.tab;
          return (
            <button key={item.tab} onClick={() => onNav(item.tab)}
              className="nav-pill flex-1 flex flex-col items-center gap-0.5 py-2 px-1 rounded-xl transition-all"
              style={isActive ? { background: `${BRAND.red}12`, border: `1.5px solid ${BRAND.red}25` } : {}}>
              <Icon name={item.icon} size={20}
                style={{ color: isActive ? BRAND.red : "#bbb" }} />
              <span className="text-xs font-golos"
                style={{ color: isActive ? "#111" : "#bbb", fontWeight: isActive ? 600 : 400 }}>
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
    profile: <ProfileScreen />,
  }[tab];

  return (
    <div style={{ background: "#ffffff", minHeight: "100vh" }} className="flex justify-center">
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
import { useState, useMemo } from "react";
import { Plus, Flame, Clock, CheckCircle2, X, Zap, ChevronRight, Mic } from "lucide-react";

// ---- helpers ----
const HOUR = 1000 * 60 * 60;

function hoursLeft(dueAt) {
  return (new Date(dueAt).getTime() - Date.now()) / HOUR;
}

function urgencyScore(task) {
  const h = hoursLeft(task.due);
  const weight = { low: 1, normal: 1.6, high: 2.4 }[task.weight] || 1.6;
  if (h <= 0) return 999;
  return (weight * 100) / Math.max(h, 0.5);
}

function fmtCountdown(due) {
  const h = hoursLeft(due);
  if (h <= 0) return "Overdue";
  const days = Math.floor(h / 24);
  const hrs = Math.floor(h % 24);
  if (days > 0) return `${days}d ${hrs}h left`;
  const mins = Math.floor((h % 1) * 60);
  return `${hrs}h ${mins}m left`;
}

function nextAction(task) {
  const h = hoursLeft(task.due);
  if (h <= 0) return `Send a status update on "${task.title}" now — it's overdue.`;
  if (h < 3) return `Open "${task.title}" and do one 15-minute push right now.`;
  if (h < 24) return `Block 30 minutes today for "${task.title}" before anything else slips in.`;
  if (!task.brokenDown) return `Split "${task.title}" into 3 smaller steps so it's easier to start.`;
  return `Do the first step of "${task.title}": ${task.firstStep || "outline what 'done' looks like."}`;
}

const seed = [
  {
    id: 1,
    title: "Submit grant application",
    due: new Date(Date.now() + 5 * HOUR).toISOString(),
    weight: "high",
    brokenDown: true,
    firstStep: "Finalize the budget section.",
    done: false,
  },
  {
    id: 2,
    title: "Prep for client interview",
    due: new Date(Date.now() + 26 * HOUR).toISOString(),
    weight: "high",
    brokenDown: false,
    done: false,
  },
  {
    id: 3,
    title: "Pay electricity bill",
    due: new Date(Date.now() + 50 * HOUR).toISOString(),
    weight: "low",
    brokenDown: true,
    firstStep: "Log into the utility portal.",
    done: false,
  },
  {
    id: 4,
    title: "Finish lab report draft",
    due: new Date(Date.now() - 2 * HOUR).toISOString(),
    weight: "normal",
    brokenDown: false,
    done: false,
  },
];

export default function LastMinuteLifeSaver() {
  const [tasks, setTasks] = useState(seed);
  const [title, setTitle] = useState("");
  const [dueIn, setDueIn] = useState("24");
  const [weight, setWeight] = useState("normal");
  const [listening, setListening] = useState(false);

  const active = useMemo(
    () => tasks.filter((t) => !t.done).sort((a, b) => urgencyScore(b) - urgencyScore(a)),
    [tasks]
  );
  const done = tasks.filter((t) => t.done);
  const top = active[0];

  function addTask(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setTasks((t) => [
      ...t,
      {
        id: Date.now(),
        title: title.trim(),
        due: new Date(Date.now() + Number(dueIn) * HOUR).toISOString(),
        weight,
        brokenDown: false,
        done: false,
      },
    ]);
    setTitle("");
    setDueIn("24");
    setWeight("normal");
  }

  function complete(id) {
    setTasks((t) => t.map((x) => (x.id === id ? { ...x, done: true } : x)));
  }

  function remove(id) {
    setTasks((t) => t.filter((x) => x.id !== id));
  }

  function breakDown(id) {
    setTasks((t) =>
      t.map((x) =>
        x.id === id
          ? { ...x, brokenDown: true, firstStep: "Write down what 'done' looks like, then start step one." }
          : x
      )
    );
  }

  function voiceCapture() {
    setListening(true);
    setTimeout(() => {
      setListening(false);
      setTitle((p) => p || "Follow up with mentor about thesis feedback");
    }, 1400);
  }

  return (
    <div style={styles.page}>
      <style>{fontImport}</style>

      <header style={styles.header}>
        <div style={styles.brandRow}>
          <Flame size={20} color="#FF8A3D" strokeWidth={2.4} />
          <span style={styles.brandText}>BURNDOWN</span>
        </div>
        <span style={styles.tagline}>One next action. Always visible.</span>
      </header>

      {/* HERO: the one thing to do right now */}
      <section style={styles.hero}>
        {top ? (
          <>
            <div style={styles.heroEyebrow}>
              <Zap size={14} color="#FF8A3D" />
              <span>NEXT ACTION</span>
            </div>
            <p style={styles.heroAction}>{nextAction(top)}</p>
            <div style={styles.heroMeta}>
              <span style={{ ...styles.countdown, color: hoursLeft(top.due) < 3 ? "#FF5A5A" : "#FF8A3D" }}>
                <Clock size={14} style={{ marginRight: 6, verticalAlign: "-2px" }} />
                {fmtCountdown(top.due)}
              </span>
              <span style={styles.heroTitle}>{top.title}</span>
            </div>
            <div style={styles.heroButtons}>
              {!top.brokenDown && hoursLeft(top.due) >= 24 && (
                <button style={styles.ghostBtn} onClick={() => breakDown(top.id)}>
                  Break it into steps
                </button>
              )}
              <button style={styles.primaryBtn} onClick={() => complete(top.id)}>
                <CheckCircle2 size={16} /> Mark done
              </button>
            </div>
          </>
        ) : (
          <p style={styles.heroAction}>Nothing burning. Add a task below to get started.</p>
        )}
      </section>

      {/* ADD TASK */}
      <form onSubmit={addTask} style={styles.form}>
        <div style={styles.formRow}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What do you need to get done?"
            style={styles.input}
            aria-label="Task title"
          />
          <button
            type="button"
            onClick={voiceCapture}
            style={{ ...styles.iconBtn, ...(listening ? styles.iconBtnActive : {}) }}
            aria-label="Dictate task"
            title="Voice input"
          >
            <Mic size={16} />
          </button>
        </div>
        <div style={styles.formRow}>
          <label style={styles.smallLabel}>
            Due in
            <select value={dueIn} onChange={(e) => setDueIn(e.target.value)} style={styles.select}>
              <option value="2">2 hours</option>
              <option value="6">6 hours</option>
              <option value="24">1 day</option>
              <option value="72">3 days</option>
              <option value="168">1 week</option>
            </select>
          </label>
          <label style={styles.smallLabel}>
            Stakes
            <select value={weight} onChange={(e) => setWeight(e.target.value)} style={styles.select}>
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
            </select>
          </label>
          <button type="submit" style={styles.addBtn}>
            <Plus size={16} /> Add
          </button>
        </div>
      </form>

      {/* QUEUE */}
      <section style={styles.queue}>
        <div style={styles.queueHeader}>
          <span>QUEUE</span>
          <span style={styles.queueCount}>{active.length} open</span>
        </div>
        {active.length === 0 && <p style={styles.emptyState}>Queue is clear. Add what's next.</p>}
        {active.map((t, i) => {
          const h = hoursLeft(t.due);
          const pct = Math.max(4, Math.min(100, 100 - (h / 72) * 100));
          const heat = h <= 0 ? "#FF5A5A" : h < 6 ? "#FF7A4D" : h < 24 ? "#FFA94D" : "#5C6470";
          return (
            <div key={t.id} style={{ ...styles.row, opacity: i === 0 ? 1 : 0.92 }}>
              <div style={styles.rowTop}>
                <span style={styles.rowTitle}>{t.title}</span>
                <span style={{ ...styles.rowCountdown, color: heat }}>{fmtCountdown(t.due)}</span>
              </div>
              <div style={styles.barTrack}>
                <div style={{ ...styles.barFill, width: `${pct}%`, background: heat }} />
              </div>
              <div style={styles.rowActions}>
                <span style={styles.weightTag}>{t.weight} stakes</span>
                <button style={styles.linkBtn} onClick={() => complete(t.id)}>
                  Done <ChevronRight size={13} />
                </button>
                <button style={styles.removeBtn} onClick={() => remove(t.id)} aria-label="Remove task">
                  <X size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </section>

      {done.length > 0 && (
        <section style={styles.doneSection}>
          <div style={styles.queueHeader}>
            <span>CLEARED</span>
            <span style={styles.queueCount}>{done.length}</span>
          </div>
          {done.map((t) => (
            <div key={t.id} style={styles.doneRow}>
              <CheckCircle2 size={14} color="#5FBF8F" />
              <span style={styles.doneTitle}>{t.title}</span>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

const fontImport = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Manrope:wght@400;600;700;800&display=swap');
`;

const styles = {
  page: {
    minHeight: "100%",
    background: "#15171C",
    color: "#E7E8EA",
    fontFamily: "'Manrope', sans-serif",
    padding: "28px 20px 60px",
    maxWidth: 560,
    margin: "0 auto",
    boxSizing: "border-box",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    marginBottom: 22,
  },
  brandRow: { display: "flex", alignItems: "center", gap: 8 },
  brandText: {
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 700,
    fontSize: 15,
    letterSpacing: "0.12em",
    color: "#F4F1EC",
  },
  tagline: { fontSize: 13, color: "#8A8F98" },

  hero: {
    background: "linear-gradient(165deg, #1E2129 0%, #191B20 100%)",
    border: "1px solid #2A2E37",
    borderRadius: 14,
    padding: "22px 20px",
    marginBottom: 18,
    boxShadow: "0 0 0 1px rgba(255,138,61,0.04), 0 12px 28px -16px rgba(0,0,0,0.6)",
  },
  heroEyebrow: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    letterSpacing: "0.14em",
    color: "#FF8A3D",
    marginBottom: 10,
  },
  heroAction: {
    fontSize: 19,
    lineHeight: 1.4,
    fontWeight: 700,
    color: "#F7F7F5",
    margin: "0 0 14px",
  },
  heroMeta: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  countdown: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 13,
    fontWeight: 600,
  },
  heroTitle: { fontSize: 12.5, color: "#7F8590" },
  heroButtons: { display: "flex", gap: 10, flexWrap: "wrap" },
  primaryBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "#FF8A3D",
    color: "#1A1300",
    border: "none",
    borderRadius: 8,
    padding: "9px 16px",
    fontWeight: 700,
    fontSize: 13.5,
    cursor: "pointer",
  },
  ghostBtn: {
    background: "transparent",
    border: "1px solid #3A3F4A",
    color: "#C9CCD2",
    borderRadius: 8,
    padding: "9px 14px",
    fontSize: 13.5,
    fontWeight: 600,
    cursor: "pointer",
  },

  form: { marginBottom: 24 },
  formRow: { display: "flex", gap: 10, marginBottom: 10, alignItems: "center" },
  input: {
    flex: 1,
    background: "#1E2129",
    border: "1px solid #2A2E37",
    borderRadius: 9,
    padding: "11px 13px",
    color: "#E7E8EA",
    fontSize: 14,
    fontFamily: "'Manrope', sans-serif",
    outline: "none",
  },
  iconBtn: {
    background: "#1E2129",
    border: "1px solid #2A2E37",
    borderRadius: 9,
    width: 40,
    height: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#C9CCD2",
    cursor: "pointer",
    flexShrink: 0,
  },
  iconBtnActive: { background: "#FF8A3D22", borderColor: "#FF8A3D", color: "#FF8A3D" },
  smallLabel: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    fontSize: 11,
    color: "#7F8590",
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: "0.04em",
  },
  select: {
    background: "#1E2129",
    border: "1px solid #2A2E37",
    borderRadius: 7,
    padding: "7px 8px",
    color: "#E7E8EA",
    fontSize: 13,
    fontFamily: "'Manrope', sans-serif",
  },
  addBtn: {
    marginLeft: "auto",
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "#2A2E37",
    border: "1px solid #3A3F4A",
    color: "#F0F1F3",
    borderRadius: 8,
    padding: "9px 14px",
    fontSize: 13.5,
    fontWeight: 700,
    cursor: "pointer",
  },

  queue: { marginBottom: 12 },
  queueHeader: {
    display: "flex",
    justifyContent: "space-between",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    letterSpacing: "0.12em",
    color: "#7F8590",
    marginBottom: 10,
    paddingBottom: 8,
    borderBottom: "1px solid #232730",
  },
  queueCount: { color: "#5C6470" },
  emptyState: { color: "#7F8590", fontSize: 13.5, padding: "8px 0" },

  row: {
    background: "#1A1C22",
    border: "1px solid #232730",
    borderRadius: 11,
    padding: "13px 14px",
    marginBottom: 9,
  },
  rowTop: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8, gap: 10 },
  rowTitle: { fontSize: 14.5, fontWeight: 600, color: "#E7E8EA" },
  rowCountdown: { fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" },
  barTrack: { height: 4, background: "#232730", borderRadius: 4, overflow: "hidden", marginBottom: 10 },
  barFill: { height: "100%", borderRadius: 4, transition: "width 0.3s ease" },
  rowActions: { display: "flex", alignItems: "center", gap: 12 },
  weightTag: {
    fontSize: 10.5,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: "#7F8590",
    fontFamily: "'JetBrains Mono', monospace",
  },
  linkBtn: {
    marginLeft: "auto",
    display: "flex",
    alignItems: "center",
    gap: 2,
    background: "transparent",
    border: "none",
    color: "#5FBF8F",
    fontSize: 12.5,
    fontWeight: 700,
    cursor: "pointer",
    padding: 0,
  },
  removeBtn: {
    background: "transparent",
    border: "none",
    color: "#5C6470",
    cursor: "pointer",
    display: "flex",
  },

  doneSection: { marginTop: 18 },
  doneRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "7px 2px",
    fontSize: 13.5,
  },
  doneTitle: { color: "#7F8590", textDecoration: "line-through" },
};

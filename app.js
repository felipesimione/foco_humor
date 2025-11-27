import React, { useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Vibration,
  Platform,
} from "react-native";

export default function App() {
  const [activeTab, setActiveTab] = useState("timer"); // "timer" | "humor"
  const [minutes, setMinutes] = useState(25);
  const [remaining, setRemaining] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [moodSelected, setMoodSelected] = useState(null);
  const [moodLog, setMoodLog] = useState([]);

  const intervalRef = useRef(null);

  useEffect(() => {
    setRemaining(minutes * 60);
  }, [minutes]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            setRunning(false);
            try {
              Vibration.vibrate(500);
            } catch {}
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [running]);

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  const adjustMinutes = (delta) => {
    if (running) return;
    const next = clamp(minutes + delta, 1, 120);
    setMinutes(next);
  };

  const startPause = () => setRunning((r) => !r);

  const resetTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setRunning(false);
    setRemaining(minutes * 60);
  };

  const formatTime = (totalSec) => {
    const mm = Math.floor(totalSec / 60);
    const ss = totalSec % 60;
    const mmStr = String(mm).padStart(2, "0");
    const ssStr = String(ss).padStart(2, "0");
    return ${mmStr}:${ssStr};
  };

  const progress = remaining > 0 ? 1 - remaining / (minutes * 60) : 1;

  const moods = [
    { key: "otimo", label: "😄 Ótimo" },
    { key: "bem", label: "🙂 Bem" },
    { key: "neutro", label: "😐 Neutro" },
    { key: "cansado", label: "😕 Cansado" },
    { key: "estressado", label: "😫 Estressado" },
  ];

  const registerMood = () => {
    if (!moodSelected) return;
    const now = new Date();
    const time = now.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const entry = {
      id: ${now.getTime()},
      mood: moodSelected,
      label: moods.find((m) => m.key === moodSelected)?.label || moodSelected,
      time,
    };
    setMoodLog((prev) => [entry, ...prev].slice(0, 20));
    setMoodSelected(null);
    try {
      Vibration.vibrate(50);
    } catch {}
  };

  const TabButton = ({ id, title }) => {
    const active = activeTab === id;
    return (
      <TouchableOpacity
        onPress={() => setActiveTab(id)}
        style={[styles.tabBtn, active && styles.tabBtnActive]}
      >
        <Text style={[styles.tabBtnText, active && styles.tabBtnTextActive]}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Foco & Humor</Text>

      <View style={styles.tabs}>
        <TabButton id="timer" title="Timer" />
        <TabButton id="humor" title="Humor" />
      </View>

      {activeTab === "timer" ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Ciclo de foco</Text>

          <View style={styles.clockBox}>
            <Text style={styles.clock}>{formatTime(remaining)}</Text>
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: ${progress * 100}% }]}
              />
            </View>
          </View>

          <View style={styles.controlsRow}>
            <TouchableOpacity
              style={[styles.ctrlBtn, running && styles.ctrlBtnDisabled]}
              onPress={() => adjustMinutes(-5)}
              disabled={running}
            >
              <Text style={styles.ctrlText}>-5</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.ctrlBtn, running && styles.ctrlBtnDisabled]}
              onPress={() => adjustMinutes(-1)}
              disabled={running}
            >
              <Text style={styles.ctrlText}>-1</Text>
            </TouchableOpacity>
            <View style={styles.durationBadge}>
              <Text style={styles.durationText}>{minutes} min</Text>
            </View>
            <TouchableOpacity
              style={[styles.ctrlBtn, running && styles.ctrlBtnDisabled]}
              onPress={() => adjustMinutes(+1)}
              disabled={running}
            >
              <Text style={styles.ctrlText}>+1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.ctrlBtn, running && styles.ctrlBtnDisabled]}
              onPress={() => adjustMinutes(+5)}
              disabled={running}
            >
              <Text style={styles.ctrlText}>+5</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.primaryBtn, running ? styles.pause : styles.start]}
              onPress={startPause}
            >
              <Text style={styles.primaryBtnText}>
                {running ? "Pausar" : "Iniciar"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryBtn} onPress={resetTimer}>
              <Text style={styles.secondaryBtnText}>Resetar</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.hint}>
            Dica: ajuste a duração antes de iniciar. Ao chegar em 00:00, o
            telefone vibra.
          </Text>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Como você está se sentindo?</Text>

          <View style={styles.moodGrid}>
            {moods.map((m) => {
              const active = moodSelected === m.key;
              return (
                <TouchableOpacity
                  key={m.key}
                  style={[styles.moodBtn, active && styles.moodBtnActive]}
                  onPress={() => setMoodSelected(m.key)}
                >
                  <Text style={[styles.moodText, active && styles.moodTextActive]}>
                    {m.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            onPress={registerMood}
            style={[
              styles.primaryBtn,
              !moodSelected && styles.primaryDisabled,
              styles.saveMoodBtn,
            ]}
            disabled={!moodSelected}
          >
            <Text style={styles.primaryBtnText}>Registrar humor</Text>
          </TouchableOpacity>

          <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Registros</Text>
          {moodLog.length === 0 ? (
            <Text style={styles.emptyText}>
              Nenhum registro ainda. Selecione um humor e toque em “Registrar”.
            </Text>
          ) : (
            <FlatList
              data={moodLog}
              keyExtractor={(item) => item.id}
              style={styles.list}
              renderItem={({ item }) => (
                <View style={styles.logItem}>
                  <Text style={styles.logMood}>{item.label}</Text>
                  <Text style={styles.logTime}>{item.time}</Text>
                </View>
              )}
            />
          )}
        </View>
      )}

      <Text style={styles.footer}>
        Sociedade 5.0 — Equilíbrio entre produtividade e bem‑estar
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a", // slate-900
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 32 : 8,
  },
  header: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 8,
  },
  tabs: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
    alignSelf: "center",
  },
  tabBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "#1f2937", // gray-800
    borderWidth: 1,
    borderColor: "transparent",
  },
  tabBtnActive: {
    backgroundColor: "#111827",
    borderColor: "#60a5fa",
  },
  tabBtnText: {
    color: "#d1d5db",
    fontWeight: "600",
  },
  tabBtnTextActive: {
    color: "#fff",
  },
  card: {
    backgroundColor: "#111827",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#374151",
    flex: 1,
  },
  sectionTitle: {
    color: "#f3f4f6",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  clockBox: {
    alignItems: "center",
    marginVertical: 10,
  },
  clock: {
    color: "#fff",
    fontSize: 56,
    fontVariant: ["tabular-nums"],
    fontWeight: "800",
    letterSpacing: 1,
  },
  progressBar: {
    height: 8,
    width: "100%",
    backgroundColor: "#1f2937",
    borderRadius: 999,
    marginTop: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#374151",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#60a5fa",
  },
  controlsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 12,
  },
  ctrlBtn: {
    backgroundColor: "#1f2937",
    borderColor: "#374151",
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  ctrlBtnDisabled: {
    opacity: 0.5,
  },
  ctrlText: {
    color: "#e5e7eb",
    fontSize: 16,
    fontWeight: "700",
  },
  durationBadge: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#0b1220",
    borderColor: "#374151",
    borderWidth: 1,
    borderRadius: 10,
  },
  durationText: {
    color: "#e5e7eb",
    fontSize: 16,
    fontWeight: "700",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6,
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryDisabled: {
    opacity: 0.5,
  },
  start: {
    backgroundColor: "#22c55e",
  },
  pause: {
    backgroundColor: "#f59e0b",
  },
  primaryBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "800",
  },
  secondaryBtn: {
    backgroundColor: "#1f2937",
    borderColor: "#374151",
    borderWidth: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    paddingHorizontal: 14,
  },
  secondaryBtnText: {
    color: "#e5e7eb",
    fontSize: 14,
    fontWeight: "700",
  },
  hint: {
    color: "#9ca3af",
    marginTop: 12,
    fontSize: 13,
  },
  moodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  moodBtn: {
    backgroundColor: "#1f2937",
    borderColor: "#374151",
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  moodBtnActive: {
    borderColor: "#60a5fa",
    backgroundColor: "#0b1220",
  },
  moodText: {
    color: "#e5e7eb",
    fontWeight: "700",
    fontSize: 15,
  },
  moodTextActive: {
    color: "#fff",
  },
  saveMoodBtn: {
    marginTop: 12,
  },
  list: {
    marginTop: 8,
  },
  logItem: {
    backgroundColor: "#0b1220",
    borderColor: "#374151",
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  logMood: {
    color: "#e5e7eb",
    fontWeight: "700",
  },
  logTime: {
    color: "#9ca3af",
  },
  footer: {
    textAlign: "center",
    color: "#94a3b8",
    marginVertical: 10,
  },
});
import { useEffect, useMemo, useState } from "react";
import Layout, { type TabId } from "./components/Layout";
import Hero from "./components/Hero";
import Dashboard from "./components/Dashboard";
import DemoCases from "./components/DemoCases";
import SOSNavigator from "./components/SOSNavigator";
import MetricsPanel from "./components/MetricsPanel";
import PitchDeck from "./components/PitchDeck";
import { demoCases } from "./data/demoCases";
import { sampleTasks } from "./data/sampleTasks";
import { clearStoredTasks, loadTasksFromStorage, saveTasksToStorage } from "./lib/storage";
import type { Task } from "./types";

function getHashTab(): TabId {
  const hash = window.location.hash.replace("#", "") as TabId;
  const validTabs: TabId[] = ["overview", "dashboard", "demo", "sos", "metrics", "deck"];
  return validTabs.includes(hash) ? hash : "overview";
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>(() => getHashTab());
  const [tasks, setTasks] = useState<Task[]>(() => loadTasksFromStorage() ?? sampleTasks);
  const [selectedWeek, setSelectedWeek] = useState(3);
  const [saveStamp, setSaveStamp] = useState("Saved locally");

  useEffect(() => {
    const onHashChange = () => setActiveTab(getHashTab());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    window.location.hash = activeTab;
  }, [activeTab]);

  useEffect(() => {
    saveTasksToStorage(tasks);
    const time = new Intl.DateTimeFormat("en", {
      hour: "numeric",
      minute: "2-digit"
    }).format(new Date());
    setSaveStamp(`Saved locally at ${time}`);
  }, [tasks]);

  const runDemo = (caseId: string) => {
    const selectedCase = demoCases.find((demoCase) => demoCase.id === caseId);
    if (!selectedCase) return;
    setTasks(selectedCase.tasks);
    setSelectedWeek(selectedCase.selectedWeek);
    setActiveTab("dashboard");
  };

  const resetDemoData = () => {
    setTasks(sampleTasks);
    setSelectedWeek(3);
  };

  const clearLocalData = () => {
    clearStoredTasks();
    setTasks(sampleTasks);
    setSelectedWeek(3);
    setSaveStamp("Local data cleared; demo data restored");
  };

  const content = useMemo(() => {
    if (activeTab === "dashboard") {
      return (
        <Dashboard
          tasks={tasks}
          setTasks={setTasks}
          selectedWeek={selectedWeek}
          setSelectedWeek={setSelectedWeek}
          saveStamp={saveStamp}
          onResetDemoData={resetDemoData}
          onClearLocalData={clearLocalData}
          onOpenSOS={() => setActiveTab("sos")}
        />
      );
    }

    if (activeTab === "demo") {
      return <DemoCases onRunDemo={runDemo} />;
    }

    if (activeTab === "sos") {
      return <SOSNavigator />;
    }

    if (activeTab === "metrics") {
      return <MetricsPanel />;
    }

    if (activeTab === "deck") {
      return <PitchDeck />;
    }

    return <Hero onOpenDashboard={() => setActiveTab("dashboard")} onOpenDeck={() => setActiveTab("deck")} />;
  }, [activeTab, tasks, selectedWeek, saveStamp]);

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {content}
    </Layout>
  );
}

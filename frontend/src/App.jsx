import { useEffect, useState, useCallback } from "react";
import ThreeOrbBackground from "./components/ThreeOrbBackground.jsx";
import Header from "./components/Header.jsx";
import StatsBar from "./components/StatsBar.jsx";
import TaskForm from "./components/TaskForm.jsx";
import TaskList from "./components/TaskList.jsx";
import Login from "./components/Login.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import * as api from "./api/taskApi.js";

export default function App() {
  const { user, ready, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  const loadTasks = useCallback(async () => {
    try {
      setError("");
      const data = await api.fetchTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadTasks();
    } else {
      setTasks([]);
      setLoading(false);
    }
  }, [user, loadTasks]);

  const handleCreate = async (payload) => {
    setCreating(true);
    try {
      const newTask = await api.createTask(payload);
      setTasks((prev) => [newTask, ...prev]);
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleToggle = async (id) => {
    // optimistic update so the UI (and the 3D core) reacts instantly
    setTasks((prev) =>
      prev.map((t) => (t._id === id ? { ...t, completed: !t.completed } : t))
    );
    try {
      const updated = await api.toggleTask(id);
      setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
    } catch (err) {
      setError(err.message);
      loadTasks(); // resync on failure
    }
  };

  const handleUpdate = async (id, updates) => {
    setTasks((prev) => prev.map((t) => (t._id === id ? { ...t, ...updates } : t)));
    try {
      const updated = await api.updateTask(id, updates);
      setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
    } catch (err) {
      setError(err.message);
      loadTasks();
    }
  };

  const handleDelete = async (id) => {
    const previous = tasks;
    setTasks((prev) => prev.filter((t) => t._id !== id));
    try {
      await api.deleteTask(id);
    } catch (err) {
      setError(err.message);
      setTasks(previous); // roll back on failure
    }
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const progress = tasks.length === 0 ? 0 : completedCount / tasks.length;

  // wait until we've checked localStorage for a saved session before
  // deciding whether to show the login screen, to avoid a login flash
  if (!ready) {
    return <div className="min-h-screen bg-void" />;
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="relative min-h-screen bg-void bg-grid-fade">
      <ThreeOrbBackground progress={progress} />

      <main className="relative mx-auto flex max-w-2xl flex-col gap-6 px-4 pb-20">
        <Header user={user} onLogout={logout} />

        {error && (
          <div className="glass-panel border border-ember/40 rounded-xl px-4 py-2 text-sm text-ember font-mono">
            {error}
          </div>
        )}

        <TaskForm onCreate={handleCreate} creating={creating} />

        <StatsBar total={tasks.length} completed={completedCount} />

        {loading ? (
          <p className="text-center text-mute font-mono text-sm py-10">
            Pulling tasks from orbit…
          </p>
        ) : (
          <TaskList
            tasks={tasks}
            filter={filter}
            onFilterChange={setFilter}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        )}
      </main>
    </div>
  );
}

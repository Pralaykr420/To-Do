import { useState } from "react";
import { motion } from "framer-motion";

const PRIORITIES = [
  { value: "low", label: "Low", color: "text-cyan" },
  { value: "medium", label: "Medium", color: "text-violet" },
  { value: "high", label: "High", color: "text-ember" },
];

export default function TaskForm({ onCreate, creating }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Give the task a title before launching it.");
      return;
    }

    setError("");

    await onCreate({
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate: dueDate || null,
    });

    setTitle("");
    setDescription("");
    setPriority("medium");
    setDueDate("");
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-panel rounded-2xl p-5 flex flex-col gap-3"
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs to get done?"
        className="w-full bg-transparent text-ink placeholder:text-mute text-lg font-display outline-none border-b border-edge pb-2 focus-visible:outline-none focus-visible:border-cyan transition-colors"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Add a note (optional)"
        rows={2}
        className="w-full resize-none bg-panel2/60 rounded-lg px-3 py-2 text-sm text-ink placeholder:text-mute outline-none border border-transparent focus-visible:border-cyan transition-colors"
      />

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1.5">
          {PRIORITIES.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setPriority(p.value)}
              className={`rounded-full px-3 py-1 text-xs font-mono border transition-colors ${
                priority === p.value
                  ? `border-current ${p.color} bg-white/5`
                  : "border-edge text-mute hover:text-ink"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="ml-auto bg-panel2/60 rounded-lg px-3 py-1.5 text-xs text-ink outline-none border border-transparent focus-visible:border-cyan [color-scheme:dark]"
        />

        <motion.button
          type="submit"
          disabled={creating}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="rounded-lg bg-gradient-to-r from-violet to-cyan px-4 py-1.5 text-sm font-medium text-void disabled:opacity-50"
        >
          {creating ? "Launching…" : "Add task"}
        </motion.button>
      </div>

      {error && <p className="text-xs text-ember font-mono">{error}</p>}
    </motion.form>
  );
}

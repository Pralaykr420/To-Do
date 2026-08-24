import { AnimatePresence, motion } from "framer-motion";
import TaskItem from "./TaskItem.jsx";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
];

export default function TaskList({
  tasks,
  filter,
  onFilterChange,
  onToggle,
  onDelete,
  onUpdate,
}) {
  const filtered = tasks.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-1.5 self-start">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => onFilterChange(f.value)}
            className={`font-mono text-xs px-3 py-1 rounded-full border transition-colors ${
              filter === f.value
                ? "border-cyan text-cyan bg-white/5"
                : "border-edge text-mute hover:text-ink"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-panel rounded-2xl px-6 py-10 text-center"
        >
          <p className="text-ink font-display text-lg">Nothing in orbit</p>
          <p className="text-mute text-sm mt-1">
            {filter === "all"
              ? "Add your first task above to launch it into the list."
              : "No tasks match this filter yet."}
          </p>
        </motion.div>
      ) : (
        <ul className="flex flex-col gap-2.5">
          <AnimatePresence initial={false}>
            {filtered.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                onToggle={onToggle}
                onDelete={onDelete}
                onUpdate={onUpdate}
              />
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}

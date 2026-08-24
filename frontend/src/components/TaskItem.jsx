import { useState } from "react";
import { motion } from "framer-motion";

const PRIORITY_STYLES = {
  low: "text-cyan border-cyan/40",
  medium: "text-violet border-violet/40",
  high: "text-ember border-ember/40",
};

function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function TaskItem({ task, onToggle, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(task.title);

  const saveEdit = async () => {
    const trimmed = draftTitle.trim();
    if (trimmed && trimmed !== task.title) {
      await onUpdate(task._id, { title: trimmed });
    } else {
      setDraftTitle(task.title);
    }
    setIsEditing(false);
  };

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.96, transition: { duration: 0.25 } }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="glass-panel group rounded-xl px-4 py-3 flex items-start gap-3"
    >
      <button
        onClick={() => onToggle(task._id)}
        aria-label={task.completed ? "Mark task as not done" : "Mark task as done"}
        className={`mt-0.5 h-5 w-5 shrink-0 rounded-full border flex items-center justify-center transition-colors ${
          task.completed
            ? "bg-cyan border-cyan"
            : "border-mute hover:border-cyan"
        }`}
      >
        {task.completed && (
          <motion.svg
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            viewBox="0 0 12 12"
            className="h-3 w-3 text-void"
            fill="none"
          >
            <path
              d="M2 6l2.5 2.5L10 3"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            autoFocus
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            onBlur={saveEdit}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveEdit();
              if (e.key === "Escape") {
                setDraftTitle(task.title);
                setIsEditing(false);
              }
            }}
            className="w-full bg-transparent text-ink outline-none border-b border-cyan pb-0.5"
          />
        ) : (
          <p
            onDoubleClick={() => setIsEditing(true)}
            className={`text-sm sm:text-base cursor-text ${
              task.completed ? "text-mute line-through" : "text-ink"
            }`}
            title="Double-click to edit"
          >
            {task.title}
          </p>
        )}

        {task.description && (
          <p className="mt-0.5 text-xs text-mute line-clamp-2">{task.description}</p>
        )}

        <div className="mt-2 flex items-center gap-2 flex-wrap">
          <span
            className={`font-mono text-[10px] uppercase tracking-wide rounded-full border px-2 py-0.5 ${PRIORITY_STYLES[task.priority]}`}
          >
            {task.priority}
          </span>
          {task.dueDate && (
            <span className="font-mono text-[10px] text-mute">
              due {formatDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={() => onDelete(task._id)}
        aria-label="Delete task"
        className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity text-mute hover:text-ember shrink-0 mt-0.5"
      >
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none">
          <path
            d="M5 5l10 10M15 5L5 15"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </motion.li>
  );
}

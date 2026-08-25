import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const PRIORITY_STYLES = {
  low: "text-cyan border-cyan/40",
  medium: "text-violet border-violet/40",
  high: "text-ember border-ember/40",
};

const PRIORITIES = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

function formatDate(dateStr) {
  if (!dateStr) return null;

  const d = new Date(dateStr);

  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getDateInputValue(dateStr) {
  if (!dateStr) return "";

  const date = new Date(dateStr);

  if (Number.isNaN(date.getTime())) return "";

  return date.toISOString().slice(0, 10);
}

export default function TaskItem({
  task,
  onToggle,
  onDelete,
  onUpdate,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [draftTitle, setDraftTitle] = useState(task.title);
  const [draftDescription, setDraftDescription] = useState(
    task.description || ""
  );
  const [draftPriority, setDraftPriority] = useState(
    task.priority || "medium"
  );
  const [draftDueDate, setDraftDueDate] = useState(
    getDateInputValue(task.dueDate)
  );

  // Keep the local editing state synchronized if the task changes
  // externally while this component is mounted.
  useEffect(() => {
    if (!isEditing) {
      setDraftTitle(task.title);
      setDraftDescription(task.description || "");
      setDraftPriority(task.priority || "medium");
      setDraftDueDate(getDateInputValue(task.dueDate));
    }
  }, [
    task.title,
    task.description,
    task.priority,
    task.dueDate,
    isEditing,
  ]);

  const startEditing = () => {
    setDraftTitle(task.title);
    setDraftDescription(task.description || "");
    setDraftPriority(task.priority || "medium");
    setDraftDueDate(getDateInputValue(task.dueDate));
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setDraftTitle(task.title);
    setDraftDescription(task.description || "");
    setDraftPriority(task.priority || "medium");
    setDraftDueDate(getDateInputValue(task.dueDate));
    setIsEditing(false);
  };

  const saveEdit = async () => {
    const title = draftTitle.trim();
    const description = draftDescription.trim();

    if (!title) {
      return;
    }

    const updates = {
      title,
      description,
      priority: draftPriority,
      dueDate: draftDueDate || null,
    };

    const hasChanges =
      title !== task.title ||
      description !== (task.description || "") ||
      draftPriority !== task.priority ||
      draftDueDate !== getDateInputValue(task.dueDate);

    if (!hasChanges) {
      setIsEditing(false);
      return;
    }

    setSaving(true);

    try {
      await onUpdate(task._id, updates);
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      cancelEditing();
    }
  };

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{
        opacity: 0,
        x: 40,
        scale: 0.96,
        transition: { duration: 0.25 },
      }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="glass-panel group rounded-xl px-4 py-3 flex items-start gap-3"
      onKeyDown={handleKeyDown}
    >
      {/* Complete button */}
      <button
        onClick={() => onToggle(task._id)}
        disabled={isEditing || saving}
        aria-label={
          task.completed
            ? "Mark task as not done"
            : "Mark task as done"
        }
        className={`mt-0.5 h-5 w-5 shrink-0 rounded-full border flex items-center justify-center transition-colors ${
          task.completed
            ? "bg-cyan border-cyan"
            : "border-mute hover:border-cyan"
        } disabled:opacity-50`}
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
          /* =========================
             EDIT MODE
             ========================= */
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex flex-col gap-3"
          >
            {/* Title */}
            <input
              autoFocus
              type="text"
              value={draftTitle}
              maxLength={200}
              onChange={(e) => setDraftTitle(e.target.value)}
              placeholder="Task title"
              disabled={saving}
              className="w-full bg-transparent text-ink text-base outline-none border-b border-cyan pb-1 placeholder:text-mute disabled:opacity-50"
            />

            {/* Description */}
            <textarea
              value={draftDescription}
              maxLength={1000}
              onChange={(e) => setDraftDescription(e.target.value)}
              placeholder="Add a note (optional)"
              rows={2}
              disabled={saving}
              className="w-full resize-none bg-panel2/60 rounded-lg px-3 py-2 text-sm text-ink placeholder:text-mute outline-none border border-transparent focus-visible:border-cyan disabled:opacity-50"
            />

            {/* Priority + Date */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex gap-1.5">
                {PRIORITIES.map((priority) => (
                  <button
                    key={priority.value}
                    type="button"
                    disabled={saving}
                    onClick={() =>
                      setDraftPriority(priority.value)
                    }
                    className={`rounded-full px-2.5 py-1 text-[11px] font-mono border transition-colors ${
                      draftPriority === priority.value
                        ? "border-cyan text-cyan bg-white/5"
                        : "border-edge text-mute hover:text-ink"
                    } disabled:opacity-50`}
                  >
                    {priority.label}
                  </button>
                ))}
              </div>

              <input
                type="date"
                value={draftDueDate}
                onChange={(e) => setDraftDueDate(e.target.value)}
                disabled={saving}
                className="ml-auto bg-panel2/60 rounded-lg px-3 py-1.5 text-xs text-ink outline-none border border-transparent focus-visible:border-cyan [color-scheme:dark] disabled:opacity-50"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={cancelEditing}
                disabled={saving}
                className="rounded-lg border border-edge px-3 py-1.5 text-xs font-mono text-mute hover:text-ink hover:border-mute transition-colors disabled:opacity-50"
              >
                Cancel
              </button>

              <motion.button
                type="button"
                onClick={saveEdit}
                disabled={saving || !draftTitle.trim()}
                whileHover={{ scale: saving ? 1 : 1.03 }}
                whileTap={{ scale: saving ? 1 : 0.97 }}
                className="rounded-lg bg-gradient-to-r from-violet to-cyan px-3.5 py-1.5 text-xs font-medium text-void disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save changes"}
              </motion.button>
            </div>
          </motion.div>
        ) : (
          /* =========================
             DISPLAY MODE
             ========================= */
          <>
            <p
              className={`text-sm sm:text-base ${
                task.completed
                  ? "text-mute line-through"
                  : "text-ink"
              }`}
            >
              {task.title}
            </p>

            {task.description && (
              <p className="mt-0.5 text-xs text-mute line-clamp-2">
                {task.description}
              </p>
            )}

            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <span
                className={`font-mono text-[10px] uppercase tracking-wide rounded-full border px-2 py-0.5 ${
                  PRIORITY_STYLES[task.priority]
                }`}
              >
                {task.priority}
              </span>

              {task.dueDate && (
                <span className="font-mono text-[10px] text-mute">
                  due {formatDate(task.dueDate)}
                </span>
              )}
            </div>
          </>
        )}
      </div>

      {/* Actions */}
      {!isEditing && (
        <div className="flex items-center gap-2 shrink-0 mt-0.5">
          {/* Edit */}
          <button
            onClick={startEditing}
            aria-label="Edit task"
            title="Edit task"
            className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 text-mute hover:text-cyan transition-opacity"
          >
            <svg
              viewBox="0 0 20 20"
              className="h-4 w-4"
              fill="none"
            >
              <path
                d="M13.5 4.5l2 2M4 16l.5-3.5L13 4l3 3-8.5 8.5L4 16z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Delete */}
          <button
            onClick={() => onDelete(task._id)}
            aria-label="Delete task"
            title="Delete task"
            className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 text-mute hover:text-ember transition-opacity"
          >
            <svg
              viewBox="0 0 20 20"
              className="h-4 w-4"
              fill="none"
            >
              <path
                d="M5 5l10 10M15 5L5 15"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      )}
    </motion.li>
  );
}
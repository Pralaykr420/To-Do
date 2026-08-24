import { motion } from "framer-motion";

export default function StatsBar({ total, completed }) {
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="glass-panel rounded-2xl px-5 py-4 flex items-center justify-between gap-4">
      <div className="flex items-baseline gap-3">
        <span className="font-display text-2xl text-ink">{percent}%</span>
        <span className="font-mono text-xs text-mute uppercase tracking-wide">
          {completed} / {total} complete
        </span>
      </div>
      <div className="relative h-2 flex-1 max-w-[220px] rounded-full bg-panel2 overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-violet to-cyan"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

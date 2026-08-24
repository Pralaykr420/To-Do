import { motion } from "framer-motion";

export default function Header({ user, onLogout }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center gap-2 pt-14 pb-8 text-center px-4 relative"
    >
      {user && (
        <button
          onClick={onLogout}
          className="absolute right-0 top-8 flex items-center gap-2 rounded-full glass-panel pl-1.5 pr-3 py-1.5 text-xs text-mute hover:text-ink transition-colors"
        >
          {user.avatar ? (
            <img
              src={user.avatar}
              alt=""
              referrerPolicy="no-referrer"
              className="h-6 w-6 rounded-full"
            />
          ) : (
            <span className="h-6 w-6 rounded-full bg-panel2 flex items-center justify-center font-mono text-[10px]">
              {user.name?.[0]?.toUpperCase() || "?"}
            </span>
          )}
          <span className="font-mono">Sign out</span>
        </button>
      )}

      <span className="font-mono text-xs tracking-[0.3em] text-cyan uppercase">
        Mission log
      </span>
      <h1 className="font-display text-4xl sm:text-5xl font-semibold text-ink tracking-tight">
        Orbit
      </h1>
      <p className="max-w-md text-sm text-mute">
        {user ? `Welcome back, ${user.name.split(" ")[0]}.` : ""} Every task you
        complete pulls the core a little tighter into focus.
      </p>
    </motion.header>
  );
}

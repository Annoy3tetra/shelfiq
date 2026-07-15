import { Inbox } from "lucide-react";
import { motion } from "framer-motion";

const EmptyState = ({
  title = "Nothing here yet",
  description = "New activity will appear here as soon as it is available.",
  action,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-900"
    >
      <div className="grid h-12 w-12 place-items-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        <Inbox size={22} />
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </motion.div>
  );
};

export default EmptyState;

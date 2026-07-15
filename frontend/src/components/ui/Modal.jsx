import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

const Modal = ({ open, title, description, children, onClose, width = "max-w-2xl" }) => {
  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
            aria-label="Close modal"
          />

          <motion.section
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className={`relative z-10 max-h-[90vh] w-full ${width} overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.22)] dark:border-slate-800 dark:bg-slate-900`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
              <div>
                <h2 id="modal-title" className="text-lg font-semibold text-slate-950 dark:text-slate-100">{title}</h2>
                {description ? (
                  <p className="mt-1 text-sm text-slate-500">{description}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
                aria-label="Close"
                title="Close"
              >
                <X size={18} />
              </button>
            </header>

            <div className="max-h-[calc(90vh-81px)] overflow-y-auto p-5">
              {children}
            </div>
          </motion.section>
        </div>
      ) : null}
    </AnimatePresence>
  );
};

export default Modal;

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { UNITS } from "../lib/constants";

type Ctx = { open: () => void };
const WhatsAppPickerCtx = createContext<Ctx | null>(null);

export function useWhatsAppPicker() {
  const ctx = useContext(WhatsAppPickerCtx);
  if (!ctx) throw new Error("useWhatsAppPicker must be used inside WhatsAppPickerProvider");
  return ctx;
}

export function WhatsAppPickerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const open = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, close]);

  return (
    <WhatsAppPickerCtx.Provider value={{ open }}>
      {children}
      <AnimatePresence>
        {isOpen && <PickerModal onClose={close} />}
      </AnimatePresence>
    </WhatsAppPickerCtx.Provider>
  );
}

function PickerModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="wa-picker-title"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      <motion.div
        className="w-full max-w-md bg-paper rounded-2xl p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        transition={{ duration: 0.18 }}
      >
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-teal-deep">
              WhatsApp
            </p>
            <h2
              id="wa-picker-title"
              className="text-xl font-semibold text-ink mt-1 leading-tight"
            >
              Escolha a unidade
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="p-1.5 -m-1.5 rounded-full text-ink-soft hover:bg-line/50 transition-colors"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {UNITS.map((u) => (
            <a
              key={u.slug}
              href={u.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="flex items-center justify-between gap-3 bg-[#25d366] text-white rounded-full pl-5 pr-4 py-3.5 hover:brightness-110 transition-all shadow-md"
            >
              <span className="flex items-center gap-3 min-w-0">
                <MessageCircle className="h-5 w-5 shrink-0" aria-hidden />
                <span className="text-left min-w-0">
                  <span className="block text-sm font-semibold leading-tight">{u.name}</span>
                  {u.mobile && (
                    <span className="block text-xs opacity-90 mt-0.5">{u.mobile}</span>
                  )}
                </span>
              </span>
              <span aria-hidden className="text-lg leading-none">→</span>
            </a>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

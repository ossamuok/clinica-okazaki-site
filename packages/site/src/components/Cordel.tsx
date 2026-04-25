import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Eyebrow } from "./Eyebrow";

const PAGES = Array.from(
  { length: 10 },
  (_, i) => `/assets/cordel-p${String(i + 1).padStart(2, "0")}.webp`
);

export function Cordel() {
  const [[page, dir], setState] = useState<[number, number]>([0, 0]);
  const touchStart = useRef<number | null>(null);

  const go = (delta: number) => {
    setState(([p]) => {
      const next = p + delta;
      if (next < 0 || next >= PAGES.length) return [p, 0];
      return [next, delta > 0 ? 1 : -1];
    });
  };

  const jump = (i: number) => {
    setState(([p]) => [i, i > p ? 1 : -1]);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    touchStart.current = null;
  };

  const variants = {
    enter: (d: number) => ({ rotateY: d > 0 ? -70 : 70, opacity: 0 }),
    center: { rotateY: 0, opacity: 1 },
    exit: (d: number) => ({ rotateY: d > 0 ? 70 : -70, opacity: 0 }),
  };

  return (
    <section id="historia" className="section bg-paper-2">
      <div className="container-page">
        <div className="max-w-3xl">
          <Eyebrow>Conheça nossa história</Eyebrow>
          <h2 className="text-h2-fluid mt-5 text-balance">
            Cordel Okazaki: raiz oriental traduzida pela cultura pernambucana
          </h2>
          <p className="mt-5 text-lg text-ink-soft max-w-prose leading-relaxed">
            De uma clínica nos fundos da casa de Dr. Masaichi e Naruko
            à sede no Derby e à filial em Boa Viagem — a história do
            Centro Clínico Okazaki, ilustrada em cordel.
          </p>
        </div>

        <div
          className="mt-12 perspective-book select-none"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="relative mx-auto aspect-[3/4] max-w-md md:max-w-lg">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.img
                key={page}
                src={PAGES[page]}
                alt={`Página ${page + 1} do cordel Clínica Okazaki`}
                loading="lazy"
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.55, ease: [0.645, 0.045, 0.355, 1] }}
                className="absolute inset-0 h-full w-full rounded-2xl shadow-book object-cover preserve-3d backface-hidden"
                style={{ transformOrigin: dir >= 0 ? "left center" : "right center" }}
                draggable={false}
              />
            </AnimatePresence>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => go(-1)}
              disabled={page === 0}
              aria-label="Página anterior"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-paper text-teal-deep transition-colors hover:bg-teal-wash hover:border-teal disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>

            <div className="flex items-center gap-2">
              {PAGES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => jump(i)}
                  aria-label={`Ir para página ${i + 1}`}
                  aria-current={page === i}
                  className={`h-2 rounded-full transition-all ${
                    page === i
                      ? "w-6 bg-teal-deep"
                      : "w-2 bg-muted/40 hover:bg-muted/70"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => go(1)}
              disabled={page === PAGES.length - 1}
              aria-label="Próxima página"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-paper text-teal-deep transition-colors hover:bg-teal-wash hover:border-teal disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
          </div>

          <p className="mt-4 text-center text-sm text-muted">
            {page + 1} / {PAGES.length} · use ← → ou arraste
          </p>
        </div>
      </div>
    </section>
  );
}

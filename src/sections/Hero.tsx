import { motion, type Variants } from "framer-motion";
import { MessageCircle, ArrowRight } from "lucide-react";
import { PHONE_DISPLAY, WHATSAPP_URL } from "../lib/constants";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

export function Hero() {
  return (
    <section className="relative pt-32 md:pt-40 pb-20 md:pb-28 overflow-hidden hero-gradient">
      <div className="absolute inset-0 dot-pattern opacity-70" aria-hidden />
      <div className="container-page relative">
        <motion.span
          custom={0}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="eyebrow"
        >
          Recife · desde 1987
        </motion.span>

        <motion.h1
          custom={1}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mt-6 text-h1-fluid font-semibold text-ink text-balance max-w-4xl leading-[1.02]"
        >
          Cuidado digestivo em Recife há{" "}
          <em className="not-italic relative inline-block text-teal-deep">
            <span className="relative z-10">{38} anos.</span>
            <span
              className="absolute bottom-1 left-0 right-0 h-2.5 bg-cream -z-0"
              aria-hidden
            />
          </em>
        </motion.h1>

        <motion.p
          custom={2}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mt-7 text-lg md:text-xl text-ink-soft max-w-2xl leading-relaxed text-pretty"
        >
          Endoscopia e colonoscopia com sedação por anestesista e aparelhos
          Olympus EVIS X1. Consultas em gastroenterologia, hepatologia,
          geriatria e cirurgia do aparelho digestivo. Nota 5.0 no Google, duas
          unidades em Recife.
        </motion.p>

        <motion.div
          custom={3}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            Agendar pelo WhatsApp
          </a>
          <a href="#servicos" className="btn-outline">
            Conhecer serviços
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
          <span className="hidden md:inline text-sm text-muted ml-2">
            ou ligue {PHONE_DISPLAY}
          </span>
        </motion.div>
      </div>
    </section>
  );
}

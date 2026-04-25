import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Seo } from "../lib/seo";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { WhatsAppFloat } from "../components/WhatsAppFloat";

export default function NotFound() {
  return (
    <>
      <Seo
        title="Página não encontrada · Clínica Okazaki"
        description="A página que você procura não existe ou foi movida. Voltar ao início."
        path="/404"
      />
      <Header />
      <main id="main" className="pt-20 md:pt-24">
        <section className="container-page min-h-[60vh] flex items-center py-20">
          <div className="max-w-xl">
            <p className="eyebrow mb-5">Erro 404</p>
            <h1 className="text-h1-fluid text-balance mb-6 tracking-tight">
              Página não encontrada
            </h1>
            <p className="text-lg text-ink-soft mb-8">
              O endereço que você acessou não existe ou foi movido. Volte ao
              início para conhecer nossos serviços.
            </p>
            <Link to="/" className="btn-primary">
              Ir para o início
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}

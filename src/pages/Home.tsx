import { Seo } from "../lib/seo";
import { HOME_SCHEMAS } from "../lib/schemas";
import { SITE } from "../lib/constants";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { WhatsAppFloat } from "../components/WhatsAppFloat";
import { Cordel } from "../components/Cordel";
import { CtaBand } from "../components/CtaBand";
import { Hero } from "../sections/Hero";
import { Stats } from "../sections/Stats";
import { Services } from "../sections/Services";
import { Differentials } from "../sections/Differentials";
import { GoogleReviews } from "../sections/GoogleReviews";
import { Insurance } from "../sections/Insurance";
import { Units } from "../sections/Units";
import { Team } from "../sections/Team";
import { HomeFaq } from "../sections/HomeFaq";
import { ComplianceBlock } from "../components/ComplianceBlock";

export default function Home() {
  const title = `${SITE.name} · Endoscopia, Colonoscopia e Gastroenterologia em Recife`;
  const description =
    "Clínica de endoscopia e colonoscopia em Recife há 38 anos. Sedação por anestesista, Olympus EVIS X1, CO₂, duas unidades (Derby e Boa Viagem). 2.500+ avaliações 5 estrelas.";
  const keywords =
    "endoscopia recife, colonoscopia recife, gastroenterologista recife, clínica endoscopia boa viagem, clínica endoscopia derby, endoscopia com sedação, colonoscopia com CO2, clínica okazaki";

  return (
    <>
      <Seo
        title={title}
        description={description}
        path="/"
        keywords={keywords}
        schemas={HOME_SCHEMAS}
      />
      <Header />
      <main id="main">
        <Hero />
        <Stats />
        <Services />
        <Differentials />
        <GoogleReviews />
        <Insurance />
        <Units />
        <Cordel />
        <Team />
        <HomeFaq />
        <CtaBand />
        <div className="container-page py-10">
          <ComplianceBlock />
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}

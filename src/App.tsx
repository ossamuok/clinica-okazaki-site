import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Endoscopia from "./pages/Endoscopia";
import Colonoscopia from "./pages/Colonoscopia";
import PreparoEndoscopia from "./pages/PreparoEndoscopia";
import PreparoColonoscopia from "./pages/PreparoColonoscopia";
import Gastroenterologia from "./pages/Gastroenterologia";
import Hepatologia from "./pages/Hepatologia";
import Geriatria from "./pages/Geriatria";
import NotFound from "./pages/NotFound";

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/endoscopia" element={<Endoscopia />} />
        <Route path="/colonoscopia" element={<Colonoscopia />} />
        <Route path="/preparo-endoscopia" element={<PreparoEndoscopia />} />
        <Route path="/preparo-colonoscopia" element={<PreparoColonoscopia />} />
        <Route path="/gastroenterologia" element={<Gastroenterologia />} />
        <Route path="/hepatologia" element={<Hepatologia />} />
        <Route path="/geriatria" element={<Geriatria />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

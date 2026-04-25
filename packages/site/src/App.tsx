import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

const Home = lazy(() => import("./pages/Home"));
const Endoscopia = lazy(() => import("./pages/Endoscopia"));
const Colonoscopia = lazy(() => import("./pages/Colonoscopia"));
const PreparoEndoscopia = lazy(() => import("./pages/PreparoEndoscopia"));
const PreparoColonoscopia = lazy(() => import("./pages/PreparoColonoscopia"));
const Gastroenterologia = lazy(() => import("./pages/Gastroenterologia"));
const Hepatologia = lazy(() => import("./pages/Hepatologia"));
const Geriatria = lazy(() => import("./pages/Geriatria"));
const BlogIndex = lazy(() => import("./pages/BlogIndex"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const NotFound = lazy(() => import("./pages/NotFound"));

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
      <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/endoscopia" element={<Endoscopia />} />
        <Route path="/colonoscopia" element={<Colonoscopia />} />
        <Route path="/preparo-endoscopia" element={<PreparoEndoscopia />} />
        <Route path="/preparo-colonoscopia" element={<PreparoColonoscopia />} />
        <Route path="/gastroenterologia" element={<Gastroenterologia />} />
        <Route path="/hepatologia" element={<Hepatologia />} />
        <Route path="/geriatria" element={<Geriatria />} />
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </Suspense>
    </>
  );
}

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./lib/auth-context";
import Login from "./pages/Login";
import Inbox from "./pages/Inbox";
import DraftEditor from "./pages/DraftEditor";
import { AppShell } from "./components/AppShell";

export default function App() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center text-muted text-sm">
        Carregando...
      </div>
    );
  }

  if (!session) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Navigate to="/inbox" replace />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/drafts/:id" element={<DraftEditor />} />
        <Route path="*" element={<Navigate to="/inbox" replace />} />
      </Routes>
    </AppShell>
  );
}

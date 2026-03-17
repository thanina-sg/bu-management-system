import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { HomePage } from "./pages/HomePage";
import { DetailsPage } from "./pages/DetailsPage";
import { LibrarianPage } from "./pages/LibrarianPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/book/:id" element={<DetailsPage />} />
        <Route path="/librarian" element={<LibrarianPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

import React, { useEffect } from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { CourtroomProvider, useCourtroom } from './context/CourtroomContext';
import { CaseArchivePage } from './pages/CaseArchivePage';
import { CasePlayPage } from './pages/CasePlayPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { DailyCasePage } from './pages/DailyCasePage';
import { DashboardPage } from './pages/DashboardPage';
import { JuryModePage } from './pages/JuryModePage';
import { LandingPage } from './pages/LandingPage';
import { LevelSelectionPage } from './pages/LevelSelectionPage';
import { ProfileSettingsPage } from './pages/ProfileSettingsPage';
import { ProfileSetupPage } from './pages/ProfileSetupPage';
import { ProgressPage } from './pages/ProgressPage';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

/**
 * Supports ?autostart=1 to jump directly to the dashboard with a default demo judge profile
 * when no profile has been configured yet.
 */
const AutostartHandler: React.FC = () => {
  const { state, saveProfile } = useCourtroom();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('autostart') === '1') {
      if (!state.profile) {
        saveProfile({
          name: 'Alex Rivera',
          avatar: 'scales',
          preferredDifficulty: 'Any',
        });
      }
      if (location.pathname === '/' || location.pathname === '/setup') {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [location.search, location.pathname, state.profile, saveProfile, navigate]);

  return null;
};

const RequireProfile: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = useCourtroom();
  const location = useLocation();

  if (!state.profile) {
    const next = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/setup?next=${next}`} replace />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <CourtroomProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AutostartHandler />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/setup" element={<ProfileSetupPage />} />

          <Route
            element={
              <RequireProfile>
                <AppLayout />
              </RequireProfile>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/cases" element={<CategoriesPage />} />
            <Route path="/cases/:categoryId" element={<LevelSelectionPage />} />
            <Route
              path="/case/:caseId/briefing"
              element={<CasePlayPage defaultStep="story" />}
            />
            <Route
              path="/case/:caseId/investigate"
              element={<CasePlayPage defaultStep="story" />}
            />
            <Route
              path="/case/:caseId/board"
              element={<CasePlayPage defaultStep="evidence" />}
            />
            <Route
              path="/case/:caseId/verdict"
              element={<CasePlayPage defaultStep="verdict" />}
            />
            <Route
              path="/case/:caseId/outcome"
              element={<CasePlayPage defaultStep="reveal" />}
            />
            <Route path="/daily" element={<DailyCasePage />} />
            <Route path="/jury" element={<JuryModePage />} />
            <Route path="/archive" element={<CaseArchivePage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/profile" element={<ProfileSettingsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </CourtroomProvider>
  );
}

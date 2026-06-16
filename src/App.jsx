import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WorkbenchProvider } from './context/WorkbenchContext';
import Layout from './components/layout/Layout';
import MediaDesk from './pages/MediaDesk';
import ComponentLibrary from './pages/ComponentLibrary';
import DesignStudio from './pages/DesignStudio';
import Recent from './pages/Recent';
import Favorites from './pages/Favorites';
import Storage from './pages/Storage';
import CustomCursor from './components/ui/CustomCursor';
import { NotificationProvider } from './context/NotificationContext';
import { AIProvider } from './context/AIContext';
export default function App() {
  return (
    <NotificationProvider>
      <WorkbenchProvider>
        <AIProvider>
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<MediaDesk />} />
                <Route path="/library" element={<ComponentLibrary />} />
                <Route path="/studio" element={<DesignStudio />} />
                <Route path="/recent" element={<Recent />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/storage" element={<Storage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </BrowserRouter>
          <CustomCursor />
        </AIProvider>
      </WorkbenchProvider>
    </NotificationProvider>
  );
}

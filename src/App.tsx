import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ScreeningProvider } from './contexts/ScreeningContext';
import { ScreeningPage } from './pages/ScreeningPage';
import { DemoPage } from './pages/DemoPage';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <ScreeningProvider>
        <Routes>
          <Route path="/s/:token" element={<ScreeningPage />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/" element={<Navigate to="/demo" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ScreeningProvider>
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-gray-600">Page not found</p>
      </div>
    </div>
  );
}

export default App;


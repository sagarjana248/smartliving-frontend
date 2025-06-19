// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SmartLivingDashboard from './components/SmartLivingDashboard';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SmartLivingDashboard />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;

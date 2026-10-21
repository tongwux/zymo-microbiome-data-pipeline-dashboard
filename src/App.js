import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import OngoingProjects from './components/OngoingProjects';
import Reports from './components/Reports';
import Services from './components/Services';
import FAQ from './components/FAQ';
import Account from './components/Account';
import Cart from './components/Cart';
import Login from './components/Login';
import IndividualLogin from './components/IndividualLogin';
import EnterpriseLogin from './components/EnterpriseLogin';
import Onboarding from './components/Onboarding';
import Settings from './components/Settings';
import ProjectDetail from './components/ProjectDetail';
import AmpliconSequencing from './components/AmpliconSequencing';
import AccountAuth from './components/AccountAuth';
import OrderSuccess from './components/OrderSuccess';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <p role="status">Restoring your session...</p>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function RecoveryRedirect() {
  const { recoveringPassword } = useAuth();
  const location = useLocation();
  return recoveringPassword && location.pathname !== '/reset-password' ? <Navigate to="/reset-password" replace /> : null;
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <RecoveryRedirect />
          <div className="app">
            <Routes>
              <Route path="/register" element={<AccountAuth mode="register" />} />
              <Route path="/forgot-password" element={<AccountAuth mode="forgot" />} />
              <Route path="/reset-password" element={<AccountAuth mode="reset" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/login/individual" element={<IndividualLogin />} />
              <Route path="/login/enterprise" element={<EnterpriseLogin />} />
              <Route
                path="/onboarding/step1"
                element={
                  <PrivateRoute>
                    <Onboarding />
                  </PrivateRoute>
                }
              />
              <Route
                path="/onboarding/step2"
                element={
                  <PrivateRoute>
                    <Onboarding />
                  </PrivateRoute>
                }
              />
              <Route
                path="/onboarding/step3"
                element={
                  <PrivateRoute>
                    <Onboarding />
                  </PrivateRoute>
                }
              />
              <Route
                path="/onboarding/step4"
                element={
                  <PrivateRoute>
                    <Onboarding />
                  </PrivateRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <div className="app-content">
                      <Sidebar />
                      <Dashboard />
                    </div>
                  </PrivateRoute>
                }
              />
              <Route
                path="/cart"
                element={
                  <PrivateRoute>
                    <div className="app-content">
                      <Sidebar />
                      <Cart />
                    </div>
                  </PrivateRoute>
                }
              />
              <Route
                path="/project/:id"
                element={
                  <PrivateRoute>
                    <div className="app-content">
                      <Sidebar />
                      <ProjectDetail />
                    </div>
                  </PrivateRoute>
                }
              />
              <Route
                path="/account"
                element={
                  <PrivateRoute>
                    <Account />
                  </PrivateRoute>
                }
              />
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/ongoing-projects" element={<PrivateRoute><OngoingProjects /></PrivateRoute>} />
              <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/amplicon-sequencing" element={<AmpliconSequencing />} />
              <Route path="/services/:id" element={<PrivateRoute><ProjectDetail /></PrivateRoute>} />
              <Route path="/projects/:id" element={<PrivateRoute><ProjectDetail /></PrivateRoute>} />
              <Route path="/order-success" element={<PrivateRoute><OrderSuccess /></PrivateRoute>} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App; 
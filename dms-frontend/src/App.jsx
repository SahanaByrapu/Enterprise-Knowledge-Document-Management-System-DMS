import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import DocumentsPage from "./pages/DocumentsPage";

const App = () => {
  const isAuthenticated = false; // Replace with authService check

  return (
    <Router>
      <Routes>
  
           <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} /> 
          <Route path="/documents" element={<DocumentsPage />} />\
      </Routes>
    </Router>
  );
};

export default App;


      //<Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} />
       // <Route path="/dashboard" element={isAuthenticated ? <DashboardPage /> : <Navigate to="/" />} />
       // <Route path="/documents" element={isAuthenticated ? <DocumentsPage /> : <Navigate to="/" />} />
     
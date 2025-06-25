import { HashRouter as Router, Routes, Route } from "react-router-dom";
//import Sidebar from "./components/Sidebar";
import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Projects from "./pages/Projects";
import Stats from "./pages/Stats";
import Calendar from "./pages/Calendar";


function App() {
  return (
    <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white">
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/zadania" element={<Tasks />} />
              <Route path="/projekty" element={<Projects />} />
              <Route path="/statystyki" element={<Stats />} />
              <Route path="/kalendarz" element={<Calendar/>} />
            </Routes>
          </Layout>
        </Router>
    </div>
  );
}

export default App;


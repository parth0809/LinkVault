import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import AuthPage from "./AuthPage";
import Share from "./share";
import ShareView from './sharepage'

function App() {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <BrowserRouter>
      <div className={darkMode ? "dark min-h-screen" : "min-h-screen"}>
        <div className="flex flex-col min-h-screen bg-slate-100 dark:bg-slate-900">
          
          <Header darkMode={darkMode} setDarkMode={setDarkMode} />

          <main className="flex-grow flex items-center justify-center">
            <Routes>
              <Route path="/" element={<AuthPage />} />
              <Route path="/share" element={<Share />} />
              <Route path="/share/:token" element={<ShareView />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;

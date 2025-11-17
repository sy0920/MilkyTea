import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TeaRecordForm from './components/TeaRecordForm';
import TeaRecordList from './components/TeaRecordList';
import Statistics from './components/Statistics';
import './App.css';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRecordAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>🧋 MilkyTea</h1>
          <p className="subtitle">今天你喝奶茶了吗</p>
        </header>
        
        <nav className="App-nav">
          <Link to="/" className="nav-link">添加记录</Link>
          <Link to="/list" className="nav-link">查看记录</Link>
          <Link to="/statistics" className="nav-link">统计</Link>
        </nav>

        <main className="App-main">
          <Routes>
            <Route path="/" element={<TeaRecordForm onRecordAdded={handleRecordAdded} />} />
            <Route path="/list" element={<TeaRecordList refreshTrigger={refreshTrigger} />} />
            <Route path="/statistics" element={<Statistics />} />
          </Routes>
        </main>

        <footer className="App-footer">
          <p>© 2025 MilkyTea - 记录每一杯美好的奶茶时光</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Hub from './Home/Components/Hub/Hub.jsx';
import AnimeMain from './Animes/Components/Main/AnimeMain.jsx';
import './App.css';
import './colors.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hub />} />
        <Route path="/animes" element={<AnimeMain />} />
      </Routes>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Plants from './pages/Plants';
import Employees from './pages/Employees';
import CareTips from './pages/CareTips';
import WishList from './pages/WishlistPage';
import Home from './pages/Home';
import { MessageProvider } from './context/MessageContext';
import GlobalMessage from './components/GlobalMessage';
import './styles/styles.css'; // Import global styles

function App() {
  return (
    <MessageProvider>
      <Router>
        <Navbar />
        <GlobalMessage />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/plants" element={<Plants />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/caretips" element={<CareTips />} />
          <Route path="/wishlist" element={<WishList />} />
        </Routes>
      </Router>
    </MessageProvider>
  );
}

export default App;

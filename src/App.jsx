import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './authentication/Login';
import Home from './pages/Home';
import Header from './Components/Header';
import Signup from './authentication/Signup';
import './App.css';
import Claim from './Cart/Claim';
import Team from './pages/Team';
function App() {
  const isLoggedIn = localStorage.getItem('isLoggedInClaimsEngineUser');

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}



        {/* Protected Route */}
        {isLoggedIn == "true" ? <>  <Route
          path="/"
          element={
            <>
              <Header />
              <Home />
            </>
          }

        />


          <Route path="/login" element={<Login />} />
          <Route path="/" element={<><Header /><Home /></>} />
          <Route path="/team" element={<><Header /><Team /></>} />
          <Route path="/claim" element={<Claim />} />
        </> : <> (
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          )</>}
      </Routes>
    </BrowserRouter>
  );
}

export default App;

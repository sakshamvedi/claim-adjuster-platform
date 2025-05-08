import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './authentication/Login';
import Home from './pages/Home';
import Header from './Components/Header';
import Signup from './authentication/Signup';
import './App.css';
import Claim from './Cart/Claim';
import Notification from './Cart/Notification';
import Team from './pages/Team';
import Individual_claim_login from './authentication/Individual_claim_login';
import Not_allowed from './Helpers/Not_allowed';
import Progress_Tracking_Page from './Helpers/Progress_Tracking_Page';
function App() {
  const isLoggedIn = localStorage.getItem('isLoggedInClaimsEngineUser');
  const isAdmin = localStorage.getItem('xxaabbxxttokenrightadsssdsdmkzzddd');

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}

        <Route path="/progress-tracking/:id" element={<Progress_Tracking_Page />} />

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
          <Route path="/team" element={isAdmin == "true" ? <><Header /><Team /></> : <> <Header /> <Not_allowed /> </>} />
          <Route path="/claim" element={<Claim />} />
          <Route path="/notification" element={<><Header /><Notification /></>} />

        </> : <> (
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/individual-claim-adjuster" element={<Individual_claim_login />} />

          )</>

        }



      </Routes>
    </BrowserRouter>
  );
}

export default App;

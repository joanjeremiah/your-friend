import './App.css';
import Form from './Components/Form'
import Homepage from "./Components/Homepage"
import Login from "./Components/Login"
import Register from "./Components/Register"
import SchoolDashboard from "./Components/SchoolDashboard"
import CollegeDashboard from "./Components/CollegeDashboard"
import AdminDashboard from "./Components/AdminDashboard"
import NotFound from "./Components/NotFound"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import UserContext from './Components/userContext';

import {useEffect} from 'react';
import axios from 'axios';


import {useState} from 'react';
function App() {
  const [ userData, setUserData] = useState({
    token: undefined,
    user: undefined
  });

  useEffect(() => {
    const checkLoggedIn = async () => {
      let token = localStorage.getItem("auth-token");
      if(token === null){
        localStorage.setItem("auth-token", "");
        token = "";
      }
      const tokenResponse = await axios.post('/api/users/tokenIsValid', null, {headers: {"x-auth-token": token}});
      if (tokenResponse.data) {
        const userRes = await axios.get("/api/users/", {
          headers: { "x-auth-token": token },
        });
        console.log(userRes.data)
        setUserData({
        token,
        user: userRes.data,
        });
      }
    }
    console.log('app')
    checkLoggedIn();
  }, []);
  return (
    <div className="App">
      <Router>
      <UserContext.Provider value={{ userData, setUserData }}>
        <Routes>
          <Route exact path="/" element={<Homepage />} />
          <Route exact path="/appointment" element={<Form />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/admin" element={<AdminDashboard/>} />
          <Route exact path="/college" element={<CollegeDashboard  />} />
          <Route exact path="/school" element={<SchoolDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </UserContext.Provider>
      </Router>
    </div>
  );
}

export default App;

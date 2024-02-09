import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';

const Navbar = () => {
  const [login, setLogin] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false); // New state variable
  const history = useHistory();

  axios.defaults.withCredentials = true;

  useEffect(() => {
    const fetchLoginStatus = async () => {
      try {
        const response = await axios.get("http://localhost:8000/login");
        setLogin(response.data.login);
        setIsLoaded(true); // Update isLoaded state when login status is fetched
      } catch (error) {
        console.error("Error checking login:", error);
        setIsLoaded(true); // Update isLoaded state even if there's an error
      }
    };

    fetchLoginStatus(); // Fetch login status when component mounts
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8000/logout");
      setLogin(false);
      history.push("/login"); // Redirect to the login page after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Render nothing if login status is not loaded yet
  if (!isLoaded) {
    return null;
  }

  return (
    <nav className="navbar navbar-expand-lg bg-dark">
      <div className="container">
        <NavLink className="navbar-brand text-white" to="/">Navbar</NavLink>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto ">
            <li className="nav-item active">
              <NavLink to="/" className="nav-link text-white" >Home</NavLink>
            </li>
            <li className="nav-item active">
              {login ? (
                <button onClick={handleLogout} className="btn btn-link nav-link text-white" >Logout</button>
              ) : (
                <NavLink to="/login" className="nav-link text-white" >Login</NavLink>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

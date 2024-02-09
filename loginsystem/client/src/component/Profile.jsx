import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

const Profile = () => {
  const [userName, setUserName] = useState("");
  const [login, setLogin] = useState(false);

  const history = useHistory();
  axios.defaults.withCredentials = true;

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await axios.get("http://localhost:8000/login");
        setLogin(response.data.login);
        if (response.data.user) {
          setUserName(response.data.user[0].Name); // Set user's name
        } else {
          history.push("/login");
        }
      } catch (error) {
        console.error("Error checking login:", error);
      }
    }
    checkLogin();
  }, [history]);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8000/logout");
      setLogin(false);
      setUserName("");
      history.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }

  return (
    <>
      <section style={{
        backgroundColor: 'grey',
        width: '100%',
        height: '90vh'
      }}>
        <div className="box">
          <h1>WELCOME TO G-Media</h1>
          {login && (
            <>
              <p>User Name: {userName}</p>
            </>
          )}
        </div>
      </section>
    </>
  )
}

export default Profile;

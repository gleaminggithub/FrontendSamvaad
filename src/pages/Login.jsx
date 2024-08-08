import React, { useState, useEffect } from "react";
import axios from "axios";
import {useNavigate, Link } from "react-router-dom";
import Logo from "../assets/images.jpeg";
import "../css/style.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from "../utils/APIRoutes";

const Login = () => {
    const navigate = useNavigate();

    const [values, setValues] = useState({
      username: "",
      password: "",
    });

    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      };
    useEffect(() => {
      if (localStorage.getItem("Users")) {
        navigate("/");
      }
    }, [navigate]);
    const validateForm = () => {
        const { username, password } = values;
        if (username === "") {
          toast.error("Email and Password is required.", toastOptions);
          return false;
        } else if (password === "") {
          toast.error("Email and Password is required.", toastOptions);
          return false;
        }
        return true;
      };
  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const { username, password } = values;
      const { data } = await axios.post(loginRoute, {
        username,
        password,
      });
      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        localStorage.setItem(
          "Users",
          JSON.stringify(data.user)
        );
        navigate("/");
      }
    }
}


  return(
  <>
    <div className="FormContainer">
      <form onSubmit={(event) => handleSubmit(event)} className="FormR">
        <div className="brand">
          <img src={Logo} alt="Logo" className="logo"/>
          <h1 className="logoHead">ChatApp</h1>
        </div>
        <input
          type="text"
          placeholder="username"
          name="username" 
          className="inputForm"
          onChange={(e) => handleChange(e)}
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          className="inputForm"
          onChange={(e) => handleChange(e)}
        />
        <button type="submit" className="Button">Log In</button>
        <span className="Link">
            Don't have an account ? <Link to="/register">Create One</Link>
          </span>
      </form>
      </div>
      <ToastContainer/>
  </>)
};

export default Login;

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SetAvatar from "./components/SetAvatar";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";
import welcome from "./components/Welcome";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/GroupList" element={<GroupList />} /> */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/setAvatar" element={<SetAvatar />} />
        <Route path="/" element={<Chat />} />
        <Route path="/welcome" element={<welcome />} />
      </Routes>
    </BrowserRouter>
  );
}

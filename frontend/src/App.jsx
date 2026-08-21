import { useState } from "react";
import Auth from "./components/Auth";
import Chat from "./components/Chat";

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  function handleLogin(newToken, newUser) {
    setToken(newToken);
    setUser(newUser);
  }

  function handleLogout() {
    setToken(null);
    setUser(null);
  }

  if (!token) {
    return <Auth onLogin={handleLogin} />;
  }

  return <Chat token={token} user={user} onLogout={handleLogout} />;
}

export default App;
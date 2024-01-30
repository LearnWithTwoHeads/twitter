import { useEffect, useState, createContext, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AuthContext = createContext(null);

// This component will encapsulate the logic to handle logging in and out
// of the twitter clone application.
// The actual functions will be called from another React component, and the state
// will be set here, and used elsewhere.
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const pageLocation = useLocation();

  const handleLogin = async (username, password) => {
    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (response.status !== 200) {
      const body = await response.json();

      toast.error(body["message"]);
      return;
    }

    const body = await response.json();

    setUser({
      username: body.username,
      firstName: body.firstName,
      lastName: body.lastName,
    });

    navigate("/home");
    return;
  };

  const handleSignup = async ({
    email,
    firstName,
    lastName,
    username,
    password,
    birthDate,
  }) => {
    const response = await fetch("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        firstName,
        lastName,
        username,
        password,
        birthDate,
      }),
    });

    if (response.status !== 200) {
      const body = await response.json();

      toast.error(body["message"]);
      return;
    }

    const body = await response.json();

    setUser({
      username: body.username,
      firstName: body.firstName,
      lastName: body.lastName,
    });

    navigate("/home");
    return;
  };

  const handleLogout = async () => {
    const response = await fetch("/logout", {
      method: "POST",
    });

    if (response.status === 200) {
      setUser({});

      navigate("/");
      return;
    }
  };

  // The useEffect hook here will check to see if the token that is contained within the cookie is still valid
  // for use, if not we should navigate to the Login/Sign up page.
  useEffect(() => {
    const loadSelf = async () => {
      const response = await fetch("/self", {
        method: "GET",
      });

      // If the response here is not 200, navigate to the home page
      // and let the user log in.
      if (response.status !== 200) {
        navigate("/");
        return;
      }

      const body = await response.json();

      setUser({
        username: body.username,
      });

      let pathname = pageLocation.pathname;
      if (pathname === "/") {
        pathname = "/home";
      }

      navigate(pathname);
    };

    loadSelf();
  }, []);

  const value = {
    user,
    handleLogin,
    handleLogout,
    handleSignup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

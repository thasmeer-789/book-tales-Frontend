import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "../api/api";
import toast from "react-hot-toast";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(true);

  // Restore login when page refreshes
  useEffect(() => {
    const token = localStorage.getItem("booktales_token");
    const storedUser = localStorage.getItem("booktales_user");

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);

        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem("booktales_token");
        localStorage.removeItem("booktales_user");
      }
    }

    setLoading(false);
  }, []);

  // =========================
  // REGISTER
  // =========================

  const register = async (userData) => {
    setAuthLoading(true);
    setAuthError("");

    try {
      const registerData = {
        firstName: userData.firstName?.trim() || "",
        lastName: userData.lastName?.trim() || "",
        email: userData.email?.trim() || "",
        phoneNumber: userData.phoneNumber?.trim() || "",
        password: userData.password,
        confirmPassword: userData.confirmPassword,
      };

      const { data } = await api.post(
        "/Auth/register",
        registerData
      );

      toast.success(
        data.message || "Registration successful!"
      );

      return {
        success: true,
        data,
      };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.title ||
        error.message ||
        "Registration failed.";

      setAuthError(message);
      toast.error(message);

      return {
        success: false,
        message,
      };
    } finally {
      setAuthLoading(false);
    }
  };

  // =========================
  // LOGIN
  // =========================

  const login = async (email, password) => {
    setAuthLoading(true);
    setAuthError("");

    try {
      const { data } = await api.post("/Auth/login", {
        email: email.trim(),
        password,
      });

      if (!data.success || !data.token) {
        throw new Error(
          data.message || "Login failed."
        );
      }

     const loggedUser = {
  id: data.userId,
  email: data.email,
  firstName: data.firstName,
  lastName: data.lastName,
  roles: data.roles || [],
};

      // Store JWT
      localStorage.setItem(
        "booktales_token",
        data.token
      );

      // Store user information
      localStorage.setItem(
        "booktales_user",
        JSON.stringify(loggedUser)
      );

      setUser(loggedUser);
      setIsAuthenticated(true);

      toast.success(
        "🎉 Welcome to the Book-Tales Universe!"
      );

      return {
        success: true,
        user: loggedUser,
        token: data.token,
      };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.title ||
        error.message ||
        "Invalid email or password.";

      setAuthError(message);
      toast.error(message);

      return {
        success: false,
        message,
      };
    } finally {
      setAuthLoading(false);
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const logout = () => {
    localStorage.removeItem("booktales_token");
    localStorage.removeItem("booktales_user");

    setUser(null);
    setIsAuthenticated(false);
    setAuthError("");

    toast.success("Logged out successfully.");
  };

  // =========================
  // UPDATE LOCAL USER
  // =========================

  const updateUser = (updatedUser) => {
    setUser(updatedUser);

    localStorage.setItem(
      "booktales_user",
      JSON.stringify(updatedUser)
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        authLoading,
        authError,
        loading,

        login,
        register,
        logout,

        updateUser,
        setAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
import {
  useContext,
  createContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { IUser } from "../types";
import axios from "axios";
import { handleFormError } from "../helpers/handleFormError";
import { jwtDecode } from "jwt-decode";

interface IAuthContext {
  currentUser: IUser | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<IUser | null>>;
  login: (data: ILoginData) => Promise<void>;
  logout: () => void;
  getCurrentUser: (id: string) => void;
}

interface IAuthProviderProps {
  children: ReactNode;
}

interface ILoginData {
  email: string;
  password: string;
}

interface IDecodedToken {
  id: string;
  role: string;
  exp: number;
}

const API_LOGIN_URL = "http://localhost:3000/login";
const API_USER_URL = "http://localhost:3000/users";

const AuthContext = createContext<IAuthContext | undefined>(undefined);

const AuthProvider: React.FC<IAuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [checkForUser, setCheckForUser] = useState<boolean>(false);

  const getCurrentUser = async (id: string) => {
    try {
      const response = await axios.get(API_USER_URL + `/${id}`);
      setCurrentUser(response.data);
      return response.data;
    } catch (error) {
      handleFormError(error);
    }
  };

  const getTokenAndGetUser = async () => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      return;
    }

    const decodedToken: IDecodedToken = jwtDecode(storedToken);

    if (isTokenExpired(decodedToken.exp)) {
      logout();
      return;
    }

    axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    await getCurrentUser(decodedToken.id);
  };

  const isTokenExpired = (exp: number): boolean => {
    const currentTime = Math.floor(Date.now() / 1000);
    return exp < currentTime;
  };

  useEffect(() => {
    getTokenAndGetUser().then(() => {
      setCheckForUser(true);
    });

    const interval = setInterval(() => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        const decodedToken: IDecodedToken = jwtDecode(storedToken);
        if (isTokenExpired(decodedToken.exp)) {
          logout();
        }
      }
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const login = async (data: ILoginData) => {
    try {
      const response = await axios.post(API_LOGIN_URL, data);
      if (response.status === 200) {
        alert(response.data.message);
        localStorage.setItem("token", response.data.token);
        getTokenAndGetUser();
      }
    } catch (error) {
      handleFormError(error);
    }
  };

  const logout = async () => {
    try {
      setCurrentUser(null);
      localStorage.removeItem("token");
      axios.defaults.headers.common["Authorization"] = "";
    } catch (error) {
      handleFormError(error);
    }
  };

  const value = {
    currentUser,
    setCurrentUser,
    getCurrentUser,
    login,
    logout,
  };

  if (!checkForUser) {
    return <div>Loading...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

export const useAuth = (): IAuthContext => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

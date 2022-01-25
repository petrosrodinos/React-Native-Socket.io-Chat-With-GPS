import { createContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  token: null,
  userPhone: null,
  pic: null,
  gps: false,
  toggleGpsAccess: () => {},
  login: () => {},
  logout: () => {},
});

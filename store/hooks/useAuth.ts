import { useAppSelector } from "./storeHooks";

export const useAuth = () => {
  const { user, isLoggedIn, token } = useAppSelector((state) => state.auth);
  return { user, isLoggedIn, token };
};
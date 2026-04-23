import { useAuth } from "@clerk/react";
import { useAuthStore } from "@/features/auth/store";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { CommonLoader } from "../common/Loader";

export function PublicOnlyLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const { isBootstrapped, status } = useAuthStore();
  const location = useLocation();

  if (!isLoaded) return null;

  if (isSignedIn && (!isBootstrapped || status === "loading")) {
    return <CommonLoader />;
  }

  if (
    isSignedIn &&
    (location.pathname === "/sign-in" || location.pathname === "sign-up")
  ) {
    return <Navigate to={"/"} replace />;
  }

  return <Outlet />;
}

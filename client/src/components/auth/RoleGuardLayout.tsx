import { useAuthStore } from "@/features/auth/store";
import type { UserRole } from "@/lib/types";
import { Navigate, Outlet } from "react-router-dom";
import { CommonLoader } from "../common/Loader";

type RoleGuardLayoutProps = {
  allow: UserRole[];
};

export function RoleGuardLayout({ allow }: RoleGuardLayoutProps) {
  const { isBootstrapped, status, user } = useAuthStore();

  if (!isBootstrapped || status === "loading") {
    return <CommonLoader />;
  }

  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  if (!allow.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

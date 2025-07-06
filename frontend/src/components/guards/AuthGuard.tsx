import { Navigate, useLocation } from "react-router-dom";
import { isExpired } from "react-jwt"

import useAuth from "@/hooks/useAuth";
import { NAVIGATION_PATH, ROLES } from "@/constants";
import Loader from "../Loader";
import { Suspense } from "react";
import useAppSelector from "@/hooks/useAppSelector";

interface AuthGuardType {
  belongsTo?: ROLES[]
  children: React.ReactNode;
}

function AuthGuard({ children, belongsTo }: AuthGuardType) {
  const { roles } = useAuth();
  const auth = useAppSelector(state => state.auth);
  const { pathname } = useLocation();

  if (belongsTo !== undefined && belongsTo.length > 0 && roles !== undefined && roles.length > 0) {
    const authorized = belongsTo.some((role) => roles.includes(role));
    if (!authorized) {
      return <Navigate to={NAVIGATION_PATH.ERROR_PAGES.PAGE_500} />;
    }
  }

  if ((!auth || auth.access_token == null || isExpired(auth.access_token))) {
    let route = `${NAVIGATION_PATH.AUTH.SIGN_IN.ABSOLUTE}`;
    if (pathname !== '/') {
      const searchParams = new URLSearchParams({ redirect_uri: pathname });
      route += `?${searchParams}`;
    }

    return <Navigate to={route} />
  }

  return (
    <Suspense fallback={<Loader />}>
      {children}
    </Suspense>
  );
}

export default AuthGuard;

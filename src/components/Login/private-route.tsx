import AuthContext from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

const PrivateRoute = ({
  children,
  allowedRoles = [], // Specify roles that can access this route
}: {
  children: React.ReactNode;
  allowedRoles?: string[]; // Array of allowed roles
}) => {
  const { isAuthenticated, loading, user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/auth"); // Redirect if not authenticated
      } else if (
        allowedRoles.length > 0 &&
        !allowedRoles.includes(user?.role || "")
      ) {
        router.push("/403"); // Redirect to a "Forbidden" page if the role is unauthorized
      }
    }
  }, [isAuthenticated, loading, user, allowedRoles, router]);

  if (loading) {
    return (
      <div className="flex h-screen justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (
    !isAuthenticated ||
    (allowedRoles.length > 0 && !allowedRoles.includes(user?.role || ""))
  ) {
    return null; // Prevent rendering protected content
  }

  return <>{children}</>;
};

export default PrivateRoute;

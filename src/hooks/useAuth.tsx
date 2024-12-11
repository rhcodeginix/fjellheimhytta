import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const email = localStorage.getItem("Iplot_email");

    if (email) {
      setIsAuthenticated(true);
      router.push("/");
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return isAuthenticated;
};

export default useAuth;

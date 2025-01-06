import { AppProps } from "next/app";
import "../styles/globals.css";
import ProtectedRoute from "@/components/Layout/protectedRoute";
import { useRouter } from "next/router";
import UserLayout from "@/components/Layout/userLayout";
import { isAuthenticated } from "@/utils/auth";
import { Toaster } from "react-hot-toast";

const publicRoutes = ["/login", "/register"];

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  if (isAuthenticated()) {
    if (publicRoutes.includes(router.pathname)) {
      if (typeof window !== "undefined") {
        window.location.href = "/";
        return null;
      }
    }
  }

  if (publicRoutes.includes(router.pathname)) {
    return <Component {...pageProps} />;
  }

  return (
    <ProtectedRoute>
      <UserLayout>
        <Component {...pageProps} />
        <Toaster />
      </UserLayout>
    </ProtectedRoute>
  );
}

export default MyApp;

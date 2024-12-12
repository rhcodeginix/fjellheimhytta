import "../styles/globals.css";
import UserLayout from "@/components/Layout/userLayout";
import { useRouter } from "next/router";
import { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import useAuth from "@/hooks/useAuth";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const currentUrl = router.asPath;

  const Layout = UserLayout;
  const isAuthenticated = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentUrl]);
  if (!currentUrl) {
    return <div>404 - Page Not Found</div>;
  }

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }
  return (
    <main>
      <Layout isAuthenticated={isAuthenticated}>
        <Component {...pageProps} />
        <Toaster />
      </Layout>
    </main>
  );
}

export default MyApp;

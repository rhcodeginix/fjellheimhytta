import "../styles/globals.css";
import UserLayout from "@/components/Layout/userLayout";
import { useRouter } from "next/router";
import { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const currentUrl = router.asPath;

  const Layout = UserLayout;
  if (!currentUrl) {
    return <div>404 - Page Not Found</div>;
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentUrl]);

  return (
    // <Provider store={store}>
    <main>
      <Layout>
        <Component {...pageProps} />
        <Toaster />
      </Layout>
    </main>
    // </Provider>
  );
}

export default MyApp;

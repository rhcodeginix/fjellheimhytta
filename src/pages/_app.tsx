// // import "../styles/globals.css";
// // import UserLayout from "@/components/Layout/userLayout";
// // import { useRouter } from "next/router";
// // import { AppProps } from "next/app";
// // import { Toaster } from "react-hot-toast";
// // import { useEffect } from "react";

// // function MyApp({ Component, pageProps }: AppProps) {
// //   const router = useRouter();
// //   const currentUrl = router.asPath;

// //   const Layout = UserLayout;
// //   if (!currentUrl) {
// //     return <div>404 - Page Not Found</div>;
// //   }

// //   useEffect(() => {
// //     window.scrollTo(0, 0);
// //   }, [currentUrl]);

// //   return (
// //     // <Provider store={store}>
// //     <main>
// //       <Layout>
// //         <Component {...pageProps} />
// //         <Toaster />
// //       </Layout>
// //     </main>
// //     // </Provider>
// //   );
// // }

// // export default MyApp;

// import "../styles/globals.css";
// import UserLayout from "@/components/Layout/userLayout";
// import { useRouter } from "next/router";
// import { AppProps } from "next/app";
// import { Toaster } from "react-hot-toast";
// import React, { useEffect, useState } from "react";
// import useAuth from "@/hooks/useAuth";

// function MyApp({ Component, pageProps }: AppProps) {
//   const router = useRouter();
//   const currentUrl = router.asPath;
//   const isAuthenticated = useAuth();
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     if (isAuthenticated !== null) {
//       setIsLoading(false);
//     }
//   }, [isAuthenticated]);

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [currentUrl]);

//   const Layout: any = !isAuthenticated && UserLayout;

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (!isAuthenticated) {
//     router.push("/login");
//   }

//   if (!currentUrl) {
//     return <div>404 - Page Not Found</div>;
//   }

//   return (
//     <main>
//       <Layout>
//         <Component {...pageProps} />
//         <Toaster />
//       </Layout>
//     </main>
//   );
// }

// export default MyApp;

import "../styles/globals.css";
import UserLayout from "@/components/Layout/userLayout";
import { useRouter } from "next/router";
import { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import React, { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const currentUrl = router.asPath;
  const isAuthenticated = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated !== null) {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentUrl]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    router.push("/login");
    // return <div>Redirecting to login...</div>;
  }

  if (!currentUrl) {
    return <div>404 - Page Not Found</div>;
  }

  return (
    <main>
      <UserLayout isAuthenticated={isAuthenticated}>
        <Component {...pageProps} />
        <Toaster />
      </UserLayout>
    </main>
  );
}

export default MyApp;

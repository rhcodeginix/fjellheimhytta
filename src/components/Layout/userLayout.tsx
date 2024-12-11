// import React, { ReactNode } from "react";
// import Header from "../Ui/navbar";
// import Footer from "../Ui/footer";
// import { UserLayoutProvider } from "@/context/userLayoutContext";
// import { AddressProvider } from "@/context/addressContext";

// type Props = {
//   children: ReactNode;
// };

// const UserLayout = ({ children }: Props) => {
//   return (
//     <div>
//       <UserLayoutProvider>
//         <AddressProvider>
//           <Header />
//           <main>{children}</main>
//           <Footer />
//         </AddressProvider>
//       </UserLayoutProvider>
//     </div>
//   );
// };

// export default UserLayout;

import React, { ReactNode } from "react";
import Header from "../Ui/navbar";
import Footer from "../Ui/footer";
import { UserLayoutProvider } from "@/context/userLayoutContext";
import { AddressProvider } from "@/context/addressContext";

type Props = {
  children: ReactNode;
  isAuthenticated: any; // Accept the isAuthenticated prop
};

const UserLayout = ({ children, isAuthenticated }: Props) => {
  return (
    <div>
      <UserLayoutProvider>
        <AddressProvider>
          {/* Render Header and Footer only if authenticated */}
          {isAuthenticated && <Header />}
          <main>{children}</main>
          {isAuthenticated && <Footer />}
        </AddressProvider>
      </UserLayoutProvider>
    </div>
  );
};

export default UserLayout;

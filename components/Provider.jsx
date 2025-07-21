'use client';

import { SessionProvider } from "next-auth/react";

const Provider = ({ children }) => {
  // session provider baad mai use krunga
  return <>{children}</>;
};

export default Provider;

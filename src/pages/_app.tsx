import { GeistSans } from "geist/font/sans";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { cn } from "~/lib/utils";
import { api } from "~/utils/api";
import { ChakraProvider } from "@chakra-ui/react"
import { AnimatePresence } from "framer-motion";
import MainLayout from "~/layouts/main";
import "~/styles/globals.css";
import theme from "~/lib/theme";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <ChakraProvider theme={theme}>
        <MainLayout>
          <style
          jsx
          global
          >{`:root { --font-geist-sans: ${GeistSans.style.fontFamily};}}`}</style>
          <main className={cn(GeistSans.className, GeistSans.variable)}>
            <AnimatePresence mode="wait" initial={true}>
              <Component {...pageProps} />
            </AnimatePresence>
          </main>
        </MainLayout>
      </ChakraProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);

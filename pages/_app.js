import nProgress from "nprogress";
import { ThemeProvider } from "next-themes";
import { UseAnalytics } from "@lib/analytics";
import { Router } from "next/router";
import { AnimatePresence, MotionConfig } from "framer-motion";
import "@styles/globals.css";
import "@styles/progress.css";
import "@styles/tippy.css";

Router.events.on("routeChangeStart", nProgress.start);
Router.events.on("routeChangeError", nProgress.done);
Router.events.on("routeChangeComplete", nProgress.done);

export default function App({ Component, pageProps, router }) {
 UseAnalytics();
 return (
  <ThemeProvider attribute="class" themes={["light", "dark"]}>
   <MotionConfig reducedMotion="user">
    <AnimatePresence exitBeforeEnter>
     <Component {...pageProps} key={router.route} />
    </AnimatePresence>
   </MotionConfig>
  </ThemeProvider>
 );
}

import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { hash, pathname } = useLocation();

  useLayoutEffect(() => {
    window.history.scrollRestoration = "manual";
  }, []);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    if (!hash) {
      return;
    }

    const element = document.getElementById(hash.slice(1));
    if (!element) {
      return;
    }

    window.requestAnimationFrame(() => {
      element.scrollIntoView({ block: "start", behavior: "auto" });
    });
  }, [hash, pathname]);

  return null;
};

export default ScrollToTop;

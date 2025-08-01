// src/components/scrollRestoration.tsx
import { getScrollPosition, saveScrollPosition } from "@/utils/scrollManger";
import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";


const ScrollRestoration = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const prevLocationKey = useRef(location.key);

  // ✅ Save scroll when leaving a route (before render updates)
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveScrollPosition(prevLocationKey.current);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // ✅ Save scroll when navigating away (before the new page is shown)
  useEffect(() => {
    saveScrollPosition(prevLocationKey.current);
    prevLocationKey.current = location.key;
  }, [location.key]);

  // ✅ Restore scroll on POP (back/forward)
  useEffect(() => {
    if (navigationType === "POP") {
      const y = getScrollPosition(location.key);
      requestAnimationFrame(() => {
        window.scrollTo(0, y);
      });
    }
  }, [location.key, navigationType]);

  return null;
};

export default ScrollRestoration;

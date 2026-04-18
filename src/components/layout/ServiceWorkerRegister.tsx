"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return;

    const enregistrer = async () => {
      try {
        await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      } catch (e) {
        console.warn("Service Worker non enregistré :", e);
      }
    };

    if (document.readyState === "complete") {
      enregistrer();
    } else {
      window.addEventListener("load", enregistrer, { once: true });
    }
  }, []);

  return null;
}

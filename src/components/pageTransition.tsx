"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState<"fadeIn" | "fadeOut">("fadeIn");

  // Detecta cambio de ruta
  useEffect(() => {
    setTransitionStage("fadeOut");
  }, [pathname]);

  // Cuando termina la animación de salida, cambia el contenido
  useEffect(() => {
    if (transitionStage === "fadeOut") {
      const timeout = setTimeout(() => {
        setDisplayChildren(children);
        setTransitionStage("fadeIn");
      }, 400); // ⏱ duración de salida
      return () => clearTimeout(timeout);
    }
  }, [transitionStage, children]);

  return (
    <div className="bg-white min-h-screen overflow-hidden relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={transitionStage}
          initial={{ opacity: transitionStage === "fadeIn" ? 0 : 1 }}
          animate={{ opacity: transitionStage === "fadeIn" ? 1 : 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {displayChildren}
        </motion.div>
      </AnimatePresence>

      {/* Overlay de transición */}
      <motion.div
        key={`overlay-${transitionStage}`}
        className="fixed inset-0 z-50 pointer-events-none"
        initial={{ opacity: transitionStage === "fadeIn" ? 1 : 0 }}
        animate={{ opacity: transitionStage === "fadeIn" ? 0 : 1 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      />
    </div>
  );
}

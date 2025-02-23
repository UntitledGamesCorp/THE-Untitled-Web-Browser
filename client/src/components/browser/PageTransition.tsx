import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  isLoading: boolean;
}

export function PageTransition({ children, isLoading }: PageTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={isLoading ? "loading" : "content"}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="flex-1 w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

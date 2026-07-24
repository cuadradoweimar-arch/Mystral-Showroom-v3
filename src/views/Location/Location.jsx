import { motion } from "framer-motion";
import Viewer from "../../components/Viewer/Viewer";

export default function Location() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 1.2,
        ease: "easeInOut",
      }}
    >
      <Viewer />
    </motion.div>
  );
}
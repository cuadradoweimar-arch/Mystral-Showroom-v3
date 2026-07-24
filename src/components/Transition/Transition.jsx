import "./Transition.css";
import { motion, AnimatePresence } from "framer-motion";

export default function Transition({ scene, children }) {

    return (

        <AnimatePresence mode="wait">

            <motion.div

                key={scene}
                className="transition"

                initial={{
                    opacity: 0
                }}

                animate={{
                    opacity: 1
                    

                }}

                exit={{
                    opacity: 0
                }}

                transition={{
                    duration: 0.40,
                    ease: "easeOut"
                }}

            >

                {children}

            </motion.div>

        </AnimatePresence>

    );

}
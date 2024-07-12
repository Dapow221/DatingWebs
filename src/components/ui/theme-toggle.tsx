import { AnimatePresence, motion } from "framer-motion";
import { IconButton, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { Sun, SunMoon } from "lucide-react";

export const ThemeButton = () => {
    const { toggleColorMode } = useColorMode();
    const key = useColorModeValue("light", "dark");

    return (
        <AnimatePresence mode="wait">
            <motion.div
                style={{ display: "inline-block" }}
                key={key}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 50 }}
            >
                <IconButton
                    aria-label="Toggle Theme"
                    colorScheme={useColorModeValue("purple", "orange")}
                    icon={useColorModeValue(<SunMoon />, <Sun />)}
                    onClick={toggleColorMode}
                />
            </motion.div>
        </AnimatePresence>
    );
};

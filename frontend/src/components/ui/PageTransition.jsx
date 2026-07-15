import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

import { motionPresets } from "../../constants/theme";

const PageTransition = ({ children }) => {
  const location = useLocation();

  return (
    <motion.div key={location.pathname} {...motionPresets.page}>
      {children}
    </motion.div>
  );
};

export default PageTransition;

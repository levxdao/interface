import { useContext } from "react";

import { Colors } from "../constants/colors";
import { GlobalContext } from "../context/GlobalContext";

const useColors = (inverted?: boolean) => {
    let { darkMode } = useContext(GlobalContext);
    if (inverted) {
        darkMode = !darkMode;
    }
    return {
        ...Colors[darkMode ? "dark" : "light"],
        ...Colors.common
    };
};

export default useColors;

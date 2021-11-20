/* tslint:disable:ordered-imports */
import "./globals";
import React from "react";

import { AppLoading } from "expo";
import { useFonts } from "expo-font";

import { ContextProvider } from "./src/context";
import { Screens } from "./src/screens";

const App = () => {
    const [fontsLoaded] = useFonts({
        light: require("./assets/fonts/IBMPlexSansKR-Light.ttf"),
        regular: require("./assets/fonts/IBMPlexSansKR-Regular.ttf"),
        bold: require("./assets/fonts/IBMPlexSansKR-SemiBold.ttf")
    });
    if (!fontsLoaded) {
        return <AppLoading />;
    }
    return (
        <ContextProvider>
            <Screens />
        </ContextProvider>
    );
};

export default App;

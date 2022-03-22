/* tslint:disable:ordered-imports */
import "./globals";
import React from "react";

import { AppLoading } from "expo";
import { useFonts } from "expo-font";

import { Auth0Provider } from "@auth0/auth0-react";

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
        <Auth0Provider
            domain="dev-mlyd9xws.us.auth0.com"
            clientId="6nnaUhBzeI4cmkxGqwRFcH8EYMjSnItA"
            onRedirectCallback={() => {
                // Empty
            }}>
            <ContextProvider>
                <Screens />
            </ContextProvider>
        </Auth0Provider>
    );
};

export default App;

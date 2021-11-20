import React from "react";
import { View, ViewStyle } from "react-native";

import useColors from "../hooks/useColors";

const BackgroundImage = ({ style }: { style?: ViewStyle }) => {
    const { background } = useColors();
    return (
        <View
            style={[
                {
                    position: "absolute",
                    width: "100%",
                    aspectRatio: 1,
                    backgroundColor: background
                },
                style
            ]}>
            <View style={{ marginTop: -400, marginLeft: -1000, alignSelf: "center" }}>
                {/*{darkMode ? <SvgBackgroundDark {...props} /> : <SvgBackgroundLight {...props} />}*/}
            </View>
        </View>
    );
};

export default BackgroundImage;

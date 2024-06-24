import React from "react";
import { Image, TouchableHighlight, View } from "react-native";
import { useHistory, useLocation } from "react-router-dom";

import Constants from "expo-constants";

import { Spacing } from "../../constants/dimension";
import useLinker from "../../hooks/useLinker";
import FlexView from "../FlexView";
import SocialIcons from "../SocialIcons";
import Text from "../Text";

const FLAGS = {
    us: require("../../../assets/flags/us.png"),
    cn: require("../../../assets/flags/cn.png"),
    kr: require("../../../assets/flags/kr.png"),
    fr: require("../../../assets/flags/fr.png"),
    es: require("../../../assets/flags/es.png"),
    jp: require("../../../assets/flags/jp.png"),
    de: require("../../../assets/flags/de.png")
};

const WebFooter = ({ simple = false }) => {
    return (
        <View style={{ width: "100%", padding: Spacing.normal, alignItems: "center" }}>
            {!simple && <SocialIcons />}
            <FlexView style={{ marginTop: Spacing.small }}>
                <Flag name={"us"} locale={"en"} />
                <Flag name={"es"} locale={"es"} />
                <Flag name={"fr"} locale={"fr"} />
                <Flag name={"cn"} locale={"zh"} />
                <Flag name={"jp"} locale={"jp"} />
                <Flag name={"kr"} locale={"ko"} />
                <Flag name={"de"} locale={"de"} />
            </FlexView>
            <Text note={true} style={{ marginTop: Spacing.tiny }}>
                Built by the Dicktator of LevX DAO (v{Constants.manifest.version})
            </Text>
        </View>
    );
};

const Flag = ({ name, locale }) => {
    const history = useHistory();
    const location = useLocation();
    const onPress = () => {
        history.push(location.pathname + "?locale=" + locale);
    };
    return (
        <TouchableHighlight onPress={onPress} style={{ marginHorizontal: 4 }}>
            <Image source={FLAGS[name]} style={{ width: 30, height: 20 }} />
        </TouchableHighlight>
    );
};

export default WebFooter;

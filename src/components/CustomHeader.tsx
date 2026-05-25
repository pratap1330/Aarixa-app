import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { wp, hp } from "../utils/responcive/responcive";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { toggleTheme } from "../redux/slices/themeSlice";
import { useAppTheme } from "../hooks/useTheme";

import MenuBar from "../images/headerImage/menubar.svg";
import MenuBarbdark from "../images/headerImage/menu_black.svg";
import LogoSvg from "../images/splash/spaashlogologin.svg"; 

const CustomHeader = () => {
    const navigation = useNavigation<any>();
    const dispatch = useDispatch();
    const { colors, mode } = useAppTheme();
    const insets = useSafeAreaInsets();

    const avatarBg = "#ffffff";

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: colors.background,
                    paddingTop: insets.top,
                    height: insets.top + hp(60),
                },
            ]}
        >
            
            <View style={[styles.userImage, { backgroundColor: avatarBg }]}>
                <LogoSvg 
                    width={wp(30)} 
                    height={wp(30)} 
                    fill={colors.primaryContrast} 
                />
            </View>

            <View style={styles.rightContainer}>
                {/* Theme Toggle */}
                <TouchableOpacity
                    onPress={() => dispatch(toggleTheme())}
                    style={[
                        styles.notificationBox,
                        {
                            backgroundColor: colors.background,
                            shadowColor: "#ffffff",
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: 0.25,
                            shadowRadius: 10,
                            elevation: 4,
                        },
                    ]}
                    activeOpacity={0.7}
                >
                    <Text
                        style={[
                            styles.themeIcon,
                            {
                                fontSize: wp(16),
                                color: "#FFF176",
                            },
                        ]}
                    >
                        {mode === "light" ? "🌙" : "☀\uFE0E"}
                    </Text>
                </TouchableOpacity>

                {/* Menu */}
                <TouchableOpacity
                    onPress={() => navigation.navigate("Explore")}
                    activeOpacity={0.7}
                >
                    {mode === "light" ? (
                        <MenuBar style={styles.menu} />
                    ) : (
                        <MenuBarbdark style={styles.menu} />
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default CustomHeader;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between",
        paddingHorizontal: wp(15),
        paddingBottom: hp(7),
    },
    userImage: {
        width: wp(45),
        height: wp(45),
        borderRadius: wp(100),
        alignItems: "center",
        justifyContent: "center",
    },
    rightContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: wp(10),
    },
    notificationBox: {
        width: wp(45),
        height: wp(45),
        borderRadius: wp(50),
        alignItems: "center",
        justifyContent: "center",
    },
    menu: {
        width: wp(35),
        height: wp(35),
    },
    themeIcon: {
        fontSize: wp(20),
    },
});
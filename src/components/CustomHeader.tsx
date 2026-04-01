import React from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { wp, hp } from "../utils/responcive/responcive";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { toggleTheme } from "../redux/slices/themeSlice";
import { useAppTheme } from "../hooks/useTheme";

const CustomHeader = () => {
    const navigation = useNavigation<any>();
    const dispatch = useDispatch();
    const { colors, mode } = useAppTheme();
    const insets = useSafeAreaInsets();

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
            {/* User Image */}
            <Image
                source={require("../images/headerImage/user.png")}
                style={styles.userImage}
            />

            <View style={styles.rightContainer}>

                {/* Light / Dark Mode Toggle */}
                <TouchableOpacity
                    onPress={() => dispatch(toggleTheme())}
                    style={[styles.notificationBox, { backgroundColor: colors.card }]}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.themeIcon, { color: mode === "dark" ? "#FFFFFF" : "#1A1A1A" }]}>
                        {mode === "light" ? "☽\uFE0E" : "☀\uFE0E"}
                    </Text>
                </TouchableOpacity>

                {/* Notification */}
                <View
                    style={[
                        styles.notificationBox,
                        { backgroundColor: colors.card },
                    ]}
                >
                    <Image
                        source={
                            mode === "light"
                                ? require("../images/headerImage/prime_bell.png")
                                : require("../images/headerImage/prime_bell_white.png")
                        }
                        style={styles.bell}
                    />
                </View>

                {/* Drawer */}
                <TouchableOpacity
                    onPress={() => navigation.navigate("Explore")}
                    activeOpacity={0.7}
                >
                    <Image
                        source={
                            mode === "light"
                                ? require("../images/headerImage/menu-bar 1.png")
                                : require("../images/headerImage/menu-bar-dark.png")
                        }
                        style={styles.menu}
                    />
                </TouchableOpacity>

            </View>
        </View>
    );
};

export default CustomHeader;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        // height is set dynamically: insets.top + hp(60)
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
        paddingHorizontal: wp(5),
        alignItems: "center",
        justifyContent: "center",
        // Figma: box-shadow 0px 0px 20px 0px #EEEEEE40
        shadowColor: "#EEEEEE",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 4,
    },

    bell: {
        width: wp(25),
        height: wp(25),
        resizeMode: "contain",
    },

    menu: {
        width: wp(35),
        height: wp(35),
        resizeMode: "contain",
    },

    themeIcon: {
        fontSize: wp(20),
    },
});

import React from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { wp, hp } from "../utils/responcive/responcive";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { toggleTheme } from "../redux/slices/themeSlice";
import { useAppTheme } from "../hooks/useTheme";
import Feather from "react-native-vector-icons/Feather";

const CustomHeader = () => {
    const navigation = useNavigation<any>();
    const dispatch = useDispatch();
    const { colors, mode } = useAppTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>

            {/* User Image */}
            <Image
                source={require("../images/headerImage/user.png")}
                style={styles.userImage}
            />

            <View style={styles.rightContainer}>


                {/* <TouchableOpacity
                    onPress={() => dispatch(toggleTheme())}
                    style={[
                        styles.notificationBox,
                        { backgroundColor: colors.card },
                    ]}
                    activeOpacity={0.7}
                >
                    <Feather
                        name={mode === "light" ? "moon" : "sun"}
                        size={22}
                        color={colors.text}
                    />
                </TouchableOpacity> */}

                {/* Notification */}
                <View style={[styles.notificationBox, { backgroundColor: colors.card }]}>
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
                <TouchableOpacity onPress={() => navigation.navigate("Explore")}>
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
        width: wp(389),
        height: hp(60),
        marginTop: hp(59),
        // paddingTop: hp(70), 
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: wp(15),
        // backgroundColor: "#fff",
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
});
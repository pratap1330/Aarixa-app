// import React, { useEffect, useState } from "react";
// import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { wp, hp } from "../utils/responcive/responcive";
// import { useNavigation } from "@react-navigation/native";
// import { useDispatch } from "react-redux";
// import { toggleTheme } from "../redux/slices/themeSlice";
// import { useAppTheme } from "../hooks/useTheme";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const CustomHeader = () => {
//     const [userName, setUserName] = useState("");
//     const [initials, setInitials] = useState("");
//     const navigation = useNavigation<any>();
//     const dispatch = useDispatch();
//     const { colors, mode } = useAppTheme();
//     const insets = useSafeAreaInsets();

//     useEffect(() => {
//         const getUser = async () => {
//             try {
//                 const storedUser = await AsyncStorage.getItem("user");

//                 if (storedUser) {
//                     const parsedUser = JSON.parse(storedUser);

//                     const name = parsedUser?.username || "";
//                     setUserName(name);

//                     const nameParts = name.trim().split(" ");
//                     const first = nameParts[0]?.charAt(0) || "";
//                     const second =
//                         nameParts.length > 1
//                             ? nameParts[1]?.charAt(0)
//                             : "";

//                     setInitials((first + second).toUpperCase());
//                 }
//             } catch (error) {
//                 console.log("Error fetching user:", error);
//             }
//         };

//         getUser();
//     }, []);

//     // 🔥 Dynamic avatar background (contrast based)
//     const avatarBg = mode === "light" ? "#0a7cff" : "#2C2C2C";
//     const avatarText = "#fcf8f8";

//     return (
//         <View
//             style={[
//                 styles.container,
//                 {
//                     backgroundColor: colors.background,
//                     paddingTop: insets.top,
//                     height: insets.top + hp(60),
//                 },
//             ]}
//         >
//             {/* Avatar with Initials */}
//             <View
//                 style={[
//                     styles.userImage,
//                     {
//                         backgroundColor: avatarBg,
//                     },
//                 ]}
//             >
//                 <Text style={[styles.initialsText, { color: avatarText }]}>
//                     {initials || "U"}
//                 </Text>
//             </View>

//             <View style={styles.rightContainer}>
//                 {/* Theme Toggle */}
//                 <TouchableOpacity
//                     onPress={() => dispatch(toggleTheme())}
//                     style={[
//                         styles.notificationBox,
//                         { backgroundColor: colors.card },
//                     ]}
//                     activeOpacity={0.7}
//                 >
//                     <Text
//                         style={[
//                             styles.themeIcon,
//                             {
//                                 color:
//                                     mode === "dark"
//                                         ? "#FFFFFF"
//                                         : "#1A1A1A",
//                             },
//                         ]}
//                     >
//                         {mode === "light" ? "☽\uFE0E" : "☀\uFE0E"}
//                     </Text>
//                 </TouchableOpacity>

//                 {/* Notification */}
//                 {/* <View
//                     style={[
//                         styles.notificationBox,
//                         { backgroundColor: colors.card },
//                     ]}
//                 >
//                     <Image
//                         source={
//                             mode === "light"
//                                 ? require("../images/headerImage/prime_bell.png")
//                                 : require("../images/headerImage/prime_bell_white.png")
//                         }
//                         style={styles.bell}
//                     />
//                 </View> */}

//                 {/* Menu */}
//                 <TouchableOpacity
//                     onPress={() => navigation.navigate("Explore")}
//                     activeOpacity={0.7}
//                 >
//                     <Image
//                         source={
//                             mode === "light"
//                                 ? require("../images/headerImage/menu-bar 1.png")
//                                 : require("../images/headerImage/menu-bar-dark.png")
//                         }
//                         style={styles.menu}
//                     />
//                 </TouchableOpacity>
//             </View>
//         </View>
//     );
// };

// export default CustomHeader;

// const styles = StyleSheet.create({
//     container: {
//         width: "100%",
//         flexDirection: "row",
//         alignItems: "flex-end",
//         justifyContent: "space-between",
//         paddingHorizontal: wp(15),
//         paddingBottom: hp(7),
//     },

//     // ✅ Perfect center + bold initials
//     userImage: {
//         width: wp(45),
//         height: wp(45),
//         borderRadius: wp(100),
//         alignItems: "center",
//         justifyContent: "center", // 🔥 center fix
//     },

//     initialsText: {
//         fontSize: wp(18),
//         fontWeight: "800", // 🔥 extra bold
//         letterSpacing: 1,
//     },

//     rightContainer: {
//         flexDirection: "row",
//         alignItems: "center",
//         gap: wp(10),
//     },

//     notificationBox: {
//         width: wp(45),
//         height: wp(45),
//         borderRadius: wp(50),
//         alignItems: "center",
//         justifyContent: "center",
//         shadowColor: "#ffffff",
//         shadowOffset: { width: 0, height: 0 },
//         shadowOpacity: 0.25,
//         shadowRadius: 10,
//         elevation: 4,
//     },

//     bell: {
//         width: wp(25),
//         height: wp(25),
//         resizeMode: "contain",
//     },

//     menu: {
//         width: wp(35),
//         height: wp(35),
//         resizeMode: "contain",
//     },

//     themeIcon: {
//         fontSize: wp(20),
//     },
// });


import React, { useEffect, useState } from "react";
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

    // Dynamic avatar background (optional if you want border/shadow)
    const avatarBg = mode === "light" ? "#0a7cff" : "#0a7cff";

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
            {/* Logo instead of User Initials */}
            <View style={[styles.userImage, { backgroundColor: avatarBg }]}>
                <Image
                    source={require("../images/splash/splash.png")}
                    style={styles.logo}
                    resizeMode="contain"
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
                fontSize: wp(16), // slightly smaller moon
                color: "#FFF176", // light yellow moon
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

    logo: {
        width: wp(35),
        height: wp(35),
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
        // shadowColor: "#ffffff",
        // shadowOffset: { width: 0, height: 0 },
        // shadowOpacity: 0.25,
        // shadowRadius: 10,
        // elevation: 4,x
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
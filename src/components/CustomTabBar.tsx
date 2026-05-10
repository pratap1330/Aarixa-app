import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { TAB_CONFIG } from "../utils/tab/tabConfig";
import { wp, hp } from "../utils/responcive/responcive";
import { useAppTheme } from "../hooks/useTheme";

const renderIcon = (icon: any, style: any, tintColor?: string, fill?: string) => {
  if (typeof icon === 'function') {
    return React.createElement(icon, { style, fill, color: fill });
  } else {
    return <Image source={icon} style={[style, tintColor ? { tintColor } : {}]} resizeMode="contain" />;
  }
};

const CustomTabBar: React.FC<BottomTabBarProps> = ({ navigation, state }) => {
  const { mode, colors } = useAppTheme();

  const pillBg      = mode === "dark" ? "#1E1E1E" : "#FFFFFF";
  const iconTint    = mode === "dark" ? "#CCCCCC" : "#A2A2A2";
  const labelColor  = mode === "dark" ? "#CCCCCC" : "#A2A2A2";
  const borderColor = mode === "dark" ? "#000000" : "#FFFFFF";
  const currentRoute = state.routes[state.index]?.name;

  return (
    <View style={styles.container}>
      <View style={[styles.innerContainer, { backgroundColor: pillBg }]}>

        {TAB_CONFIG.map((tab, index) => {
          if (tab.center) {
            return (
              <View key={tab.key} style={styles.centerWrapper}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => navigation.navigate("center")}
                >
                  <LinearGradient
                    colors={[colors.primary, colors.primaryDark]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={[styles.centerButton, { borderColor }]}
                  >
                    {renderIcon(tab.icon, styles.centerIcon)}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            );
          }

          const isFocused = currentRoute === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tab}
              activeOpacity={0.7}
              onPress={() => navigation.navigate(tab.key as never)}
            >
              {renderIcon(tab.icon, styles.icon, isFocused ? colors.primary : iconTint, isFocused ? colors.primary : iconTint)}
              <Text style={[styles.label, { color: isFocused ? colors.primary : labelColor }]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}

      </View>

    </View>
  );
};

export default CustomTabBar;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: Platform.OS === 'ios' ? hp(20) : hp(30), 
    alignSelf: "center",
    width: wp(367),
    height: hp(100), 
    justifyContent: "flex-end", 
    alignItems: "center",
    backgroundColor: "transparent",
  },
  innerContainer: {
    width: wp(358),
    height: hp(71),
    borderRadius: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    paddingHorizontal: wp(12),
    backgroundColor: "#ffffff",
  },
  tab: {
    flex: 1,
    width: wp(68.6),
    height: hp(45),
    alignItems: "center",
    justifyContent: "center",
    gap: hp(6),
  },
  icon: {
    width: wp(24),
    height: hp(24),
  },
  label: {
    width: wp(70),
    height: hp(15),
    fontFamily: "Urbanist-SemiBold",
    fontSize: hp(12),
    color : '#A2A2A2',
    marginTop: hp(4),
    // lineHeight: hp(12) * 1.25,
    // letterSpacing: hp(12) * 0.02,
    textAlign: "center",
  },
  centerWrapper: {
    width: wp(68.6),
    height: hp(71),

    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: hp(30),
  },
  centerButton: {
    width: wp(58),
    height: wp(58),
    borderRadius: 60, 
    // borderWidth: wp(4),
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -hp(55), 
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.2,
    // shadowRadius: 4,
    // elevation: 8,
  },
  centerIcon: {
    width: wp(30),
    height: hp(30),
  },

});












// import React from "react";
// import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import LinearGradient from "react-native-linear-gradient";
// import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

// import { TAB_CONFIG } from "../utils/tab/tabConfig";
// import { wp, hp } from "../utils/responcive/responcive";
// import { useAppTheme } from "../hooks/useTheme";

// const CustomTabBar: React.FC<BottomTabBarProps> = ({ navigation, state }) => {
//   const { mode } = useAppTheme();

//   const pillBg = mode === "dark" ? "#1E1E1E" : "#FFFFFF";
//   const iconDefaultColor = mode === "dark" ? "#CCCCCC" : "#A2A2A2";
//   const activeColor = "#527EFF";
//   const borderColor = mode === "dark" ? "#000000" : "#FFFFFF";

//   return (
//     <View style={styles.container}>
//       {/* INNER CONTAINER */}
//       <View style={[styles.innerContainer, { backgroundColor: pillBg }]}>
//         {TAB_CONFIG.map((tab) => {
//           // Identify if the current route in state matches this tab key
//           const isFocused = state.routes[state.index].name === tab.key;

//           // ✅ CENTER BUTTON
//           if (tab.center) {
//             const CenterIcon = tab.icon;
//             return (
//               <View key={tab.key} style={styles.centerWrapper}>
//                 <TouchableOpacity
//                   activeOpacity={0.85}
//                   onPress={() => navigation.navigate(tab.key)}
//                 >
//                   <LinearGradient
//                     colors={["#527EFF", "#3366FF"]}
//                     start={{ x: 0.5, y: 0 }}
//                     end={{ x: 0.5, y: 1 }}
//                     style={[styles.centerButton, { borderColor }]}
//                   >
//                     <CenterIcon width={wp(30)} height={hp(30)} fill="#FFF" />
//                   </LinearGradient>
//                 </TouchableOpacity>
//               </View>
//             );
//           }

//           // ✅ NORMAL TAB
//           const IconComponent = tab.icon;
//           return (
//             <TouchableOpacity
//               key={tab.key}
//               style={styles.tab}
//               activeOpacity={0.7}
//               onPress={() => navigation.navigate(tab.key)}
//             >
//               <IconComponent
//                 width={wp(24)}
//                 height={hp(24)}
//                 // Most SVGs use "fill", some use "stroke". 
//                 // Using "color" works if your SVG is set to use 'currentColor'
//                 fill={isFocused ? activeColor : iconDefaultColor} 
//               />
//               <Text
//                 style={[
//                   styles.label,
//                   { color: isFocused ? activeColor : iconDefaultColor },
//                 ]}
//               >
//                 {tab.label}
//               </Text>
//             </TouchableOpacity>
//           );
//         })}
//       </View>
//     </View>
//   );
// };

// export default CustomTabBar;

// const styles = StyleSheet.create({
//   container: {
//     position: "absolute",
//     bottom: hp(20),
//     alignSelf: "center",
//     width: wp(367),
//     // Removed fixed height here to let children define it
//     backgroundColor: "transparent",
//     alignItems: "center",
//   },
//   innerContainer: {
//     width: wp(358),
//     height: hp(75), // Increased height slightly to prevent clipping
//     borderRadius: 50,
//     flexDirection: "row",
//     justifyContent: "space-evenly",
//     alignItems: "center",
//     elevation: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//   },
//   tab: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   label: {
//     fontFamily: "Urbanist-SemiBold",
//     fontSize: hp(11),
//     marginTop: hp(4),
//     textAlign: "center",
//   },
//   centerWrapper: {
//     width: wp(70),
//     height: hp(70),
//     justifyContent: "center",
//     alignItems: "center",
//     // This allows the button to pop out of the top
//     marginTop: hp(-35), 
//   },
//   centerButton: {
//     width: wp(60),
//     height: wp(60),
//     borderRadius: 30,
//     borderWidth: wp(4),
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });

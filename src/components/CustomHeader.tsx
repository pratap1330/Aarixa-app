import React from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { wp, hp } from "../utils/responcive/responcive";
import { useNavigation } from "@react-navigation/native";

const CustomHeader = () => {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      
      {/* User Image */}
      <Image
        source={require("../images/headerImage/user.png")}
        style={styles.userImage}
      />

      <View style={styles.rightContainer}>
        
        {/* Notification */}
        <View style={styles.notificationBox}>
          <Image
            source={require("../images/headerImage/prime_bell.png")}
            style={styles.bell}
          />
        </View>

        {/* Drawer Icon */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Explore")}
        >
          <Image
            source={require("../images/headerImage/menu-bar 1.png")}
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
    height: hp(60),
    marginTop: hp(59),
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
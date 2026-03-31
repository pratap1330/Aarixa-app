
import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../utils/NavigationType/type";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const wp = (size: number) => (SCREEN_WIDTH / 375) * size;
const hp = (size: number) => (SCREEN_HEIGHT / 812) * size;
const scaleFont = (size: number) => (SCREEN_WIDTH / 375) * size;

type Props = NativeStackScreenProps<RootStackParamList, "AllSet">;

const AllSetScreen: React.FC<Props> = ({ navigation }) => {

  // ✅ Auto navigate after 1 sec
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Tabs"); 
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>

      <Image
        source={require("../../images/loginImage/allset.png")}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.title}>
        You're All Set!
      </Text>

      <Text style={styles.subtitle}>
        Your PIN has been successfully created.
      </Text>

    </View>
  );
};

export default AllSetScreen;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    width: wp(247),
    height: hp(185),
    marginBottom: -hp(40),
  },

  title: {
    width: wp(220),
    height: hp(31),
    fontFamily: "Urbanist-Bold",
    fontSize: scaleFont(26),
    textAlign: "center",
    color: "#1E232C",
    marginBottom: hp(10),
  },

  subtitle: {
    width: wp(226),
    fontFamily: "Urbanist-Medium",
    fontSize: scaleFont(15),
    textAlign: "center",
    color: "#8391A1",
  },

});

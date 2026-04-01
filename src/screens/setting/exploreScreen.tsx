import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { wp, hp } from "../../utils/responcive/responcive";
import { useAppTheme } from "../../hooks/useTheme";

const ExploreScreen = () => {
  const navigation = useNavigation<any>();
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      
      {/* Header */}
      <View style={styles.header}>
        
        {/* Back Button */}
       <TouchableOpacity
  onPress={() => navigation.goBack()}
  style={styles.backContainer}
  activeOpacity={0.7}
>
  <Image
    source={require("../../images/loginImage/back_arrow.png")}
    style={styles.backIcon}
  />
</TouchableOpacity>

        {/* Title */}
        <Text style={[styles.title, { color: colors.text }]}>
          Settings
        </Text>

        {/* Empty View for spacing */}
        <View style={{ width: wp(41) }} />
      </View>

      {/* Body */}
      <View style={styles.body}>
        <Text style={{ color: colors.text }}>Your content here...</Text>
      </View>
    </View>
  );
};

export default ExploreScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    width: wp(390),
    height: hp(61),
    marginTop: hp(59),
    paddingHorizontal: wp(10),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backContainer: {
  width: wp(41),
  height: wp(41),
  alignItems: "center",
  justifyContent: "center",
},

backIcon: {
  width: wp(19),
  height: wp(19),
  resizeMode: "contain",
},
  title: {
    fontSize: wp(24),
    // fontWeight: "600",
   fontFamily: "Urbanist-SemiBold",
    letterSpacing: 0.37,
  },

  body: {
    flex: 1,
    padding: wp(15),
  },
});
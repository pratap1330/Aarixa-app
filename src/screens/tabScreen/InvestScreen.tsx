import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useAppTheme } from "../../hooks/useTheme";
import { wp, hp, scaleFont } from "../../utils/responcive/responcive";

const InvestScreen = () => {
  const { colors } = useAppTheme();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.content}>
        {loading ? (
          <View style={styles.loaderWrap}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.text }]}>Loading...</Text>
          </View>
        ) : (
          <Text style={[styles.emptyText, { color: colors.text }]}>No data found</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default InvestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp(20),
  },
  loaderWrap: {
    justifyContent: "center",
    alignItems: "center",
    gap: hp(2),
  },
  loadingText: {
    marginTop: hp(12),
    fontFamily: "Urbanist-SemiBold",
    fontSize: scaleFont(16),
  },
  emptyText: {
    fontFamily: "Urbanist-SemiBold",
    fontSize: scaleFont(18),
  },
});

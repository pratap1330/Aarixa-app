import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  StatusBar,
  SafeAreaView,
  Alert,
} from "react-native";
import { useAppTheme } from "../../../hooks/useTheme";
import { wp, hp, scaleFont } from "../../../utils/responcive/responcive";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGet } from "../../../hooks/useGet";

// SVGs
import SipImage from '../../../images/setting/sipimage.svg';
import StpImage from '../../../images/setting/stpimage.svg';

type TabType = "SIP" | "STP";

const SipDetailsScreen = () => {
  const { colors, mode } = useAppTheme();
  const navigation = useNavigation<any>();
  const isDark = mode === "dark";

  // State
  const [activeTab, setActiveTab] = useState<TabType>("SIP");
  const [cid, setCid] = useState<string | null>(null);
  const [pid, setPid] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [listData, setListData] = useState<any[]>([]);

  // Constants for Theme & Logic
  const sipThemeColor = "#00B327";
  const stpThemeColor = "#1F77B4";
  const isSipActive = activeTab === "SIP";
  const isStpActive = activeTab === "STP";

  // Reset list on tab change
  useEffect(() => {
    setPage(1);
    setListData([]);
  }, [activeTab]);

  // Fetch Data
  const { data: sipResponse, loading } = useGet<any>(
    cid && pid
      ? `api/investor/getinvestorSip?cid=${cid}&txnCol=${activeTab}&currentPage=${page}&pageSize=10&levelNo=1&startDate=2026-02-1&endDate=2026-02-28`
      : "",
    {},
    !!cid && !!pid
  );

  // Handle API Response
  useEffect(() => {
    if (sipResponse?.result?.data) {
      const newData = sipResponse.result.data.map((item: any, index: number) => ({
        id: `${page}-${index}`,
        schemeName: item.scheme,
        folioNo: item.folioNo,
        amount: item.amount,
        txnDate: item.navDate,
      }));
      setListData((prev) => (page === 1 ? newData : [...prev, ...newData]));
    }

    if (sipResponse?.status === -1) {
      Alert.alert("Session Expired", sipResponse.message, [
        {
          text: "OK",
          onPress: async () => {
            await AsyncStorage.removeItem("user");
            navigation.reset({ index: 0, routes: [{ name: "Login" }] });
          },
        },
      ]);
    }
  }, [sipResponse]);

  // Initial User Data
  useEffect(() => {
    const getUserData = async () => {
      const userStr = await AsyncStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        setCid(user?.cid);
        setPid(user?.pid);
      }
    };
    getUserData();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN");
  };

  const getInitials = (name: string) => {
    if (!name) return "";
    const words = name.trim().split(" ");
    return words.slice(0, 2).map(w => w[0]).join("").toUpperCase();
  };

  const getColorFromText = (text: string) => {
    const colorsArr = ["#FF6B6B", "#4ECDC4", "#1A73E8", "#FFB400", "#6A5ACD", "#00B894"];
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colorsArr[Math.abs(hash) % colorsArr.length];
  };

  const renderItem = ({ item }: any) => (
    <View style={[styles.card, { backgroundColor: isDark ? "#1A1A1A" : "#FFFFFF" }]}>
      <View style={styles.cardLeft}>
        <View style={[styles.logoWrap, { backgroundColor: getColorFromText(item.schemeName) }]}>
          <Text style={{ fontSize: 14, fontWeight: "700", color: "#fff" }}>
            {getInitials(item.schemeName)}
          </Text>
        </View>

        <View style={styles.textCol}>
          <TouchableOpacity onPress={() => Alert.alert("Scheme Name", item.schemeName)}>
            <Text numberOfLines={1} style={[styles.fundName, { color: isDark ? "#FFF" : "#000" }]}>
              {item.schemeName}
            </Text>
          </TouchableOpacity>

          <View style={styles.folioRow}>
            <Text style={[styles.folioText, { color: isDark ? "#AAA" : "#777" }]}>
              Folio No: {item.folioNo}
            </Text>
            <Text style={[styles.folioDivider, { color: isDark ? "#AAA" : "#777" }]}> | </Text>
            <Text style={[styles.folioText, { color: isDark ? "#AAA" : "#777" }]}>
              {formatDate(item.txnDate)}
            </Text>
          </View>
        </View>
      </View>
      <Text style={[styles.amount, { color: isDark ? "#FFF" : "#000" }]}>₹{item.amount}</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? "#000" : "#FAFAFA" }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={isDark ? "#000000" : "#FAFAFA"} />

      {/* HEADER */}
      <View style={[styles.header, { backgroundColor: isDark ? "#000" : "#FAFAFA" }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Image
              source={require("../../../images/loginImage/back_arrow.png")}
              style={[styles.backIcon, { tintColor: isDark ? "#FFF" : "#000" }]}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: isDark ? "#FFF" : "#000000" }]}>SIP/STP Details</Text>
        </View>
      </View>

      {/* BODY */}
      <View style={[styles.body, { backgroundColor: isDark ? "#111" : "#FAFAFA" }]}>
        <View style={styles.tabRow}>
          {/* SIP Tab */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.tabBtn, { backgroundColor: isSipActive ? sipThemeColor : "transparent", borderColor: sipThemeColor }]}
            onPress={() => setActiveTab("SIP")}
          >
            <SipImage 
              width={wp(12)} 
              height={hp(12)} 
              fill={isSipActive ? "#FFFFFF" : sipThemeColor} 
            />
            <Text style={[styles.tabText, { color: isSipActive ? "#FFFFFF" : sipThemeColor }]}>SIP</Text>
          </TouchableOpacity>

          {/* STP Tab */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.tabBtn, { backgroundColor: isStpActive ? stpThemeColor : "transparent", borderColor: stpThemeColor }]}
            onPress={() => setActiveTab("STP")}
          >
            <StpImage 
              width={wp(12)} 
              height={hp(12)} 
              fill={isStpActive ? "#FFFFFF" : stpThemeColor} 
            />
            <Text style={[styles.tabText, { color: isStpActive ? "#FFFFFF" : stpThemeColor }]}>STP</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.viewAllRow}>
          <Text style={styles.viewAllText}>View all</Text>
        </TouchableOpacity>

        <FlatList
          data={listData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 50, flexGrow: 1 }}
          onEndReached={() => {
            if (!loading && sipResponse?.result && page < sipResponse.result.noOfPages) {
              setPage((prev) => prev + 1);
            }
          }}
          onEndReachedThreshold={0.2}
          ListEmptyComponent={
            !loading ? (
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontSize: 16, opacity: 0.6, color: isDark ? "#FFF" : "#000" }}>
                  No {activeTab} records found
                </Text>
              </View>
            ) : null
          }
          ListFooterComponent={loading ? <Text style={{ textAlign: "center", padding: 10, color: isDark ? "#FFF" : "#000" }}>Loading more...</Text> : null}
        />
      </View>
    </SafeAreaView>
  );
};

export default SipDetailsScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { width: wp(390), height: hp(119), justifyContent: "flex-end" },
  headerContent: { width: wp(390), height: hp(61), flexDirection: "row", alignItems: "center", paddingHorizontal: wp(10), gap: wp(10), marginBottom: hp(10) },
  backBtn: { width: wp(41), height: wp(41), justifyContent: "center", alignItems: "center" },
  backIcon: { width: wp(19), height: hp(19) },
  headerTitle: { fontFamily: "Urbanist", fontWeight: "600", fontSize: scaleFont(24), letterSpacing: 0.37, lineHeight: hp(41), marginLeft: wp(45) },
  body: { flex: 1 },
  tabRow: { flexDirection: "row", alignItems: "center", paddingLeft: wp(17), paddingTop: hp(9), gap: wp(24) },
  tabBtn: { flexDirection: "row", alignItems: "center", width: wp(75), height: hp(25), borderRadius: 50, borderWidth: 1, paddingHorizontal: wp(10), gap: wp(5), justifyContent: "center" },
  tabText: { fontFamily: "Urbanist-SemiBold", fontSize: scaleFont(12) },
  viewAllRow: { alignItems: "flex-end", paddingRight: wp(17), paddingTop: hp(8), paddingBottom: hp(15) },
  viewAllText: { fontFamily: "Urbanist-SemiBold", fontSize: scaleFont(12), color: "#1F77B4", textDecorationLine: "underline" },
  card: { width: wp(350), height: hp(65), borderRadius: 10, marginVertical: 4, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: wp(10), marginLeft: wp(12) },
  cardLeft: { flexDirection: "row", alignItems: "center", gap: wp(10), flex: 1 },
  logoWrap: { width: wp(45), height: wp(45), borderRadius: wp(22.5), overflow: "hidden", elevation: 3, justifyContent: "center", alignItems: "center" },
  textCol: { flex: 1, gap: hp(2) },
  fundName: { fontFamily: "Urbanist-SemiBold", fontSize: scaleFont(16), lineHeight: hp(21) },
  folioRow: { flexDirection: "row", alignItems: "center" },
  folioText: { fontFamily: "Urbanist-Medium", fontSize: scaleFont(11) },
  folioDivider: { fontFamily: "Urbanist-Medium", fontSize: scaleFont(11) },
  amount: { fontFamily: "Urbanist-Medium", fontSize: scaleFont(16), lineHeight: hp(21), marginBottom: 25 },
});
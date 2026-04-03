// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   FlatList,
//   StatusBar,
//   SafeAreaView,
// } from "react-native";
// import { useAppTheme } from "../../../hooks/useTheme";
// import { wp, hp, scaleFont } from "../../../utils/responcive/responcive";
// import { useNavigation } from "@react-navigation/native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useGet } from "../../../hooks/useGet";
// import { useEffect } from "react";
// const HDFC_IMG = require("../../../images/setting/HDFC.png");

// const SIP_DATA = [
//   {
//     id: "1",
//     name: "HDFC Mutual Fund",
//     folioNo: "2345678",
//     date: "09/10/2026",
//     amount: "₹34,978",
//   },
//   {
//     id: "2",
//     name: "ICICI Mutual Fund",
//     folioNo: "2345678",
//     date: "31/10/2026",
//     amount: "₹26,912",
//   },
//   {
//     id: "3",
//     name: "SBI Mutual Fund",
//     folioNo: "2345678",
//     date: "09/02/2026",
//     amount: "₹15,930",
//   },
// ];

// const STP_DATA = [
//   {
//     id: "4",
//     name: "HDFC Mutual Fund",
//     folioNo: "2345678",
//     date: "09/10/2026",
//     amount: "₹34,978",
//   },
//   {
//     id: "5",
//     name: "ICICI Mutual Fund",
//     folioNo: "2345678",
//     date: "31/10/2026",
//     amount: "₹26,912",
//   },
// ];

// type TabType = "SIP" | "STP";

// const SipDetailsScreen = () => {

//   const [cid, setCid] = useState<string | null>(null);
// const [pid, setPid] = useState<string | null>(null);
//   const { colors, mode } = useAppTheme();
//   const navigation = useNavigation();
//   const [activeTab, setActiveTab] = useState<TabType>("SIP");

//   const isDark = mode === "dark";


//   const { data: sipResponse, loading } = useGet<any>(
//   cid && pid
//     ? `api/investor/getinvestorSip?cid=${cid}&txnCol=${activeTab}&pid=${pid}&currentPage=1&pageSize=10&levelNo=1`
//     : "",
//   {},
//   !!cid && !!pid 
// );


// const apiData = sipResponse?.result?.data || [];
// const data = apiData;
// useEffect(() => {
//   const getUserData = async () => {
//     const userStr = await AsyncStorage.getItem("user");

//     if (userStr) {
//       const user = JSON.parse(userStr);
//       setCid(user?.cid);
//       setPid(user?.pid);
//     }
//   };

//   getUserData();
// }, []);

//  const renderItem = ({ item }: any) => (
//   <View
//     style={[
//       styles.card,
//       { backgroundColor: isDark ? "#1A1A1A" : "#FFFFFF" },
//     ]}
//   >
//     <View style={styles.cardLeft}>
//       <View style={styles.logoWrap}>
//         <Image source={HDFC_IMG} style={styles.logoImg} />
//       </View>

//       <View style={styles.textCol}>
//         <Text style={[styles.fundName, { color: isDark ? "#FFF" : "#000" }]}>
//           {item?.schemeName || "N/A"}
//         </Text>

//         <View style={styles.folioRow}>
//           <Text style={[styles.folioText, { color: isDark ? "#AAA" : "#777" }]}>
//             Folio No: {item?.folioNo || "-"}
//           </Text>

//           <Text style={styles.folioDivider}> | </Text>

//           <Text style={[styles.folioText, { color: isDark ? "#AAA" : "#777" }]}>
//             {item?.txnDate || "-"}
//           </Text>
//         </View>
//       </View>
//     </View>

//     <Text style={[styles.amount, { color: isDark ? "#FFF" : "#000" }]}>
//       ₹{item?.amount || 0}
//     </Text>
//   </View>
// );
//   return (
//     <SafeAreaView
//       style={[
//         styles.container,
//         { backgroundColor: isDark ? "#000" : "#FAFAFA" },
//       ]}
//     >
//       <StatusBar
//         barStyle={isDark ? "light-content" : "dark-content"}
//         backgroundColor={isDark ? "#000000" : "#FAFAFA"}
//       />

//       {/* ── HEADER ── */}
//       <View
//         style={[
//           styles.header,
//           { backgroundColor: isDark ? "#000" : "#FAFAFA" },
//         ]}
//       >
//         <View style={styles.headerContent}>
//           <TouchableOpacity
//             style={styles.backBtn}
//             onPress={() => navigation.goBack()}
//           >
//             <Image
//               source={require("../../../images/loginImage/back_arrow.png")}
//               style={[styles.backIcon, { tintColor: isDark ? "#FFF" : "#000" }]}
//               resizeMode="contain"
//             />
//           </TouchableOpacity>
//           <Text style={[styles.headerTitle, { color: isDark ? "#FFF" : "#000000" }]}>
//             SIP/STP Details
//           </Text>
//         </View>
//       </View>


//       {/* ── BODY ── */}
//       <View
//         style={[
//           styles.body,
//           { backgroundColor: isDark ? "#111" : "#FAFAFA" },
//         ]}
//       >
//         {/* Tab row */}
//         <View style={styles.tabRow}>
//           {/* SIP tab */}
//           <TouchableOpacity
//             activeOpacity={0.85}
//             style={[
//               styles.tabBtn,
//               activeTab === "SIP"
//                 ? { backgroundColor: "#00B327", borderColor: "#00B327" }
//                 : { backgroundColor: "transparent", borderColor: isDark ? "#00B327" : "#00B327" },
//             ]}
//             onPress={() => setActiveTab("SIP")}
//           >
//             <Image
//               source={require("../../../images/loginImage/back_arrow.png")}
//               style={[
//                 styles.tabIcon,
//                 { tintColor: activeTab === "SIP" ? "#FFFFFF" : "#00B327" },
//               ]}
//               resizeMode="contain"
//             />
//             <Text
//               style={[
//                 styles.tabText,
//                 { color: activeTab === "SIP" ? "#FFFFFF" : "#00B327" },
//               ]}
//             >
//               SIP
//             </Text>
//           </TouchableOpacity>

//           {/* STP tab */}
//           <TouchableOpacity
//             activeOpacity={0.85}
//             style={[
//               styles.tabBtn,
//               activeTab === "STP"
//                 ? { backgroundColor: "#1F77B4", borderColor: "#1F77B4" }
//                 : { backgroundColor: "transparent", borderColor: "#1F77B4" },
//             ]}
//             onPress={() => setActiveTab("STP")}
//           >
//             <Image
//               source={require("../../../images/loginImage/back_arrow.png")}
//               style={[
//                 styles.tabIcon,
//                 { tintColor: activeTab === "STP" ? "#FFFFFF" : "#1F77B4" },
//               ]}
//               resizeMode="contain"
//             />
//             <Text
//               style={[
//                 styles.tabText,
//                 { color: activeTab === "STP" ? "#FFFFFF" : "#1F77B4" },
//               ]}
//             >
//               STP
//             </Text>
//           </TouchableOpacity>
//         </View>

//         {/* View all */}
//         <TouchableOpacity style={styles.viewAllRow}>
//           <Text style={styles.viewAllText}>View all</Text>
//         </TouchableOpacity>

//         {/* Fund list */}
//         <FlatList
//           data={data}
//           keyExtractor={(item) => item.id}
//           renderItem={renderItem}
//           contentContainerStyle={styles.listContent}
//           showsVerticalScrollIndicator={false}
//           ListEmptyComponent={
//             <Text style={[styles.emptyText, { color: colors.text }]}>
//               No {activeTab} records found.
//             </Text>
//           }
//         />
//       </View>
//     </SafeAreaView>
//   );
// };

// export default SipDetailsScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   /* ── Header ── */
//   header: {
//     width: wp(390),
//     height: hp(119),
//     justifyContent: "flex-end",
//   },
//   headerContent: {
//     width: wp(390),
//     height: hp(61),
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: wp(10),
//     gap: wp(10),
//     marginBottom: hp(10),
//   },
//   backBtn: {
//     width: wp(41),
//     height: wp(41),
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   backIcon: {
//     width: wp(19),
//     height: hp(19),
//   },
//   headerTitle: {
//     fontFamily: "Urbanist",
//     fontWeight: "600",
//     fontSize: scaleFont(24),
//     letterSpacing: 0.37,
//     lineHeight: hp(41),
//     marginLeft: wp(45)
//   },
//   headerBorder: {
//     height: 2,
//     backgroundColor: "#527EFF",
//   },
//   /* ── Body ── */
//   body: {
//     flex: 1,
//   },
//   /* ── Tabs ── */
//   tabRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingLeft: wp(17),
//     paddingTop: hp(9),
//     gap: wp(24),
//   },
//   tabBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     width: wp(75),
//     height: hp(25),
//     borderRadius: 50,
//     borderWidth: 1,
//     paddingHorizontal: wp(15),
//     gap: wp(5),
//     justifyContent: "center",
//   },
//   tabIcon: {
//     width: wp(12),
//     height: hp(12),
//   },
//   tabText: {
//     fontFamily: "Urbanist",
//     fontWeight: "600",
//     fontSize: scaleFont(12),
//     lineHeight: hp(13),
//   },
//   /* ── View All ── */
//   viewAllRow: {
//     alignItems: "flex-end",
//     paddingRight: wp(17),
//     paddingTop: hp(8),
//     paddingBottom: hp(15),
//   },
//   viewAllText: {
//     fontFamily: "Nunito",
//     fontWeight: "700",
//     fontSize: scaleFont(12),
//     color: "#1F77B4",
//     textDecorationLine: "underline",
//   },
//   /* ── List ── */
//   listContent: {
//     paddingHorizontal: wp(15),
//     gap: hp(10),
//     paddingBottom: hp(20),
//   },
//   /* ── Card ── */
//   card: {
//     width: wp(350),
//     height: hp(65),
//     borderRadius: 10,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: wp(10),
//   },
//   cardLeft: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: wp(10),
//     flex: 1,
//   },
//   logoWrap: {
//     width: wp(45),
//     height: wp(45),
//     borderRadius: wp(22.5),
//     overflow: "hidden",
//     shadowColor: "#EEEEEE",
//     shadowOffset: { width: 0, height: 0 },
//     shadowOpacity: 1,
//     shadowRadius: 10,
//     elevation: 3,
//     backgroundColor: "#fff",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   logoImg: {
//     width: wp(55),
//     height: wp(55),
//     borderRadius: wp(22.5),
//   },
//   textCol: {
//     flex: 1,
//     gap: hp(2),
//   },
//   fundName: {
//     fontFamily: "Urbanist",
//     fontWeight: "500",
//     fontSize: scaleFont(16),
//     lineHeight: hp(21),
//   },
//   folioRow: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   folioText: {
//     fontFamily: "Urbanist",
//     fontWeight: "400",
//     fontSize: scaleFont(11),
//   },
//   folioDivider: {
//     fontFamily: "Urbanist",
//     fontSize: scaleFont(11),
//   },
//   amount: {
//     fontFamily: "Urbanist",
//     fontWeight: "500",
//     fontSize: scaleFont(16),
//     lineHeight: hp(21),
//     marginBottom: 25
//   },
//   emptyText: {
//     textAlign: "center",
//     marginTop: hp(50),
//     fontFamily: "Urbanist",
//     fontSize: scaleFont(16),
//     opacity: 0.6,
//   },
// });



import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  StatusBar,
  SafeAreaView,
  Alert
} from "react-native";
import { useAppTheme } from "../../../hooks/useTheme";
import { wp, hp, scaleFont } from "../../../utils/responcive/responcive";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGet } from "../../../hooks/useGet";
import { useEffect } from "react";
const HDFC_IMG = require("../../../images/setting/HDFC.png");

type TabType = "SIP" | "STP";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../utils/NavigationType/type";

type NavigationType = NativeStackNavigationProp<RootStackParamList>;

// const navigation = useNavigation<NavigationType>();

const SipDetailsScreen = () => {

  const [cid, setCid] = useState<string | null>(null);
  const [pid, setPid] = useState<string | null>(null);
  const { colors, mode } = useAppTheme();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<TabType>("SIP");
  const [page, setPage] = useState(1);
  const [listData, setListData] = useState<any[]>([]);
  const isDark = mode === "dark";




  useEffect(() => {
    setPage(1);
    setListData([]);
  }, [activeTab]);

  const { data: sipResponse, loading } = useGet<any>(
    cid && pid
      ? `api/investor/getinvestorSip?cid=${cid}&txnCol=${activeTab}&currentPage=${page}&pageSize=10&levelNo=1&startDate=2026-02-1&endDate=2026-02-28`
      : "",
    {},
    !!cid && !!pid
  );

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
  }, [sipResponse]);

  const apiData = sipResponse?.result?.data || [];
  const status = sipResponse?.status;
  const message = sipResponse?.message;

  useEffect(() => {
    if (!sipResponse) return;

    if (sipResponse.status === -1) {
      Alert.alert("Session Expired", sipResponse.message, [
        {
          text: "OK",
          onPress: async () => {
            await AsyncStorage.removeItem("user");
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" as never }],
            });
          },
        },
      ]);
    }
  }, [sipResponse]);

  const data = apiData.map((item: any, index: number) => ({
    id: index.toString(),
    schemeName: item.scheme,
    folioNo: item.folioNo,
    amount: item.amount,
    txnDate: item.navDate,
  }));


  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN"); // 17/02/2026
  };

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

  const renderItem = ({ item }: any) => (
    <View
      style={[
        styles.card,
        { backgroundColor: isDark ? "#1A1A1A" : "#FFFFFF" },
      ]}
    >
      <View style={styles.cardLeft}>
        <View style={styles.logoWrap}>
          <Image source={HDFC_IMG} style={styles.logoImg} />
        </View>

        <View style={styles.textCol}>
          {/* <Text style={[styles.fundName, { color: isDark ? "#FFF" : "#000" }]}>
            {item.schemeName}
          </Text> */}
          <TouchableOpacity
            onPress={() => Alert.alert("Scheme Name", item.schemeName)}
          >
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[styles.fundName, { color: isDark ? "#FFF" : "#000" }]}
            >
              {item.schemeName}
            </Text>
          </TouchableOpacity>

          <View style={styles.folioRow}>
            <Text style={[styles.folioText, { color: isDark ? "#AAA" : "#777" }]}>
              Folio No: {item.folioNo}
            </Text>

            <Text style={styles.folioDivider}> | </Text>

            <Text style={[styles.folioText, { color: isDark ? "#AAA" : "#777" }]}>
              {formatDate(item.txnDate)}
            </Text>
          </View>
        </View>
      </View>

      <Text style={[styles.amount, { color: isDark ? "#FFF" : "#000" }]}>
        ₹{item.amount}
      </Text>
    </View>
  );
  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? "#000" : "#FAFAFA" },
      ]}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={isDark ? "#000000" : "#FAFAFA"}
      />

      {/* ── HEADER ── */}
      <View
        style={[
          styles.header,
          { backgroundColor: isDark ? "#000" : "#FAFAFA" },
        ]}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Image
              source={require("../../../images/loginImage/back_arrow.png")}
              style={[styles.backIcon, { tintColor: isDark ? "#FFF" : "#000" }]}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: isDark ? "#FFF" : "#000000" }]}>
            SIP/STP Details
          </Text>
        </View>
      </View>


      {/* ── BODY ── */}
      <View
        style={[
          styles.body,
          { backgroundColor: isDark ? "#111" : "#FAFAFA" },
        ]}
      >
        {/* Tab row */}
        <View style={styles.tabRow}>
          {/* SIP tab */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={[
              styles.tabBtn,
              activeTab === "SIP"
                ? { backgroundColor: "#00B327", borderColor: "#00B327" }
                : { backgroundColor: "transparent", borderColor: isDark ? "#00B327" : "#00B327" },
            ]}
            onPress={() => setActiveTab("SIP")}
          >
            <Image
              source={require("../../../images/setting/sip_image.png")}
              style={[
                styles.tabIcon,
                { tintColor: activeTab === "SIP" ? "#FFFFFF" : "#00B327" },
              ]}
              resizeMode="contain"
            />
            <Text
              style={[
                styles.tabText,
                { color: activeTab === "SIP" ? "#FFFFFF" : "#00B327" },
              ]}
            >
              SIP
            </Text>
          </TouchableOpacity>

          {/* STP tab */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={[
              styles.tabBtn,
              activeTab === "STP"
                ? { backgroundColor: "#1F77B4", borderColor: "#1F77B4" }
                : { backgroundColor: "transparent", borderColor: "#1F77B4" },
            ]}
            onPress={() => setActiveTab("STP")}
          >
            <Image
              source={require("../../../images/setting/stp.png")}
              style={[
                styles.tabIcon,
                { tintColor: activeTab === "STP" ? "#FFFFFF" : "#1F77B4" },
              ]}
              resizeMode="contain"
            />
            <Text
              style={[
                styles.tabText,
                { color: activeTab === "STP" ? "#FFFFFF" : "#1F77B4" },
              ]}
            >
              STP
            </Text>
          </TouchableOpacity>
        </View>

        {/* View all */}
        <TouchableOpacity style={styles.viewAllRow}>
          <Text style={styles.viewAllText}>View all</Text>
        </TouchableOpacity>

        {/* Fund list */}
        <FlatList
          data={listData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{
            paddingBottom: 50,
            flexGrow: 1, // 👈 important for centering empty view
          }}

          onEndReached={() => {
            if (
              !loading &&
              sipResponse?.result &&
              page < sipResponse.result.noOfPages
            ) {
              setPage((prev) => prev + 1);
            }
          }}
          onEndReachedThreshold={0.2}
          onMomentumScrollBegin={() => { }}

          ListEmptyComponent={
            !loading ? (
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontSize: 16, opacity: 0.6 }}>
                  No {activeTab} records found
                </Text>
              </View>
            ) : null
          }

          ListFooterComponent={
            loading ? (
              <Text style={{ textAlign: "center", padding: 10 }}>
                Loading more...
              </Text>
            ) : null
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default SipDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  /* ── Header ── */
  header: {
    width: wp(390),
    height: hp(119),
    justifyContent: "flex-end",
  },
  headerContent: {
    width: wp(390),
    height: hp(61),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(10),
    gap: wp(10),
    marginBottom: hp(10),
  },
  backBtn: {
    width: wp(41),
    height: wp(41),
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    width: wp(19),
    height: hp(19),
  },
  headerTitle: {
    fontFamily: "Urbanist",
    fontWeight: "600",
    fontSize: scaleFont(24),
    letterSpacing: 0.37,
    lineHeight: hp(41),
    marginLeft: wp(45)
  },
  headerBorder: {
    height: 2,
    backgroundColor: "#527EFF",
  },
  /* ── Body ── */
  body: {
    flex: 1,
  },
  /* ── Tabs ── */
  tabRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: wp(17),
    paddingTop: hp(9),
    gap: wp(24),
  },
  tabBtn: {
    flexDirection: "row",
    alignItems: "center",
    width: wp(75),
    height: hp(25),
    borderRadius: 50,
    borderWidth: 1,
    paddingHorizontal: wp(15),
    gap: wp(5),
    justifyContent: "center",
  },
  tabIcon: {
    width: wp(12),
    height: hp(12),
  },
  tabText: {
    fontFamily: "Urbanist",
    fontWeight: "600",
    fontSize: scaleFont(12),
    lineHeight: hp(13),
  },
  /* ── View All ── */
  viewAllRow: {
    alignItems: "flex-end",
    paddingRight: wp(17),
    paddingTop: hp(8),
    paddingBottom: hp(15),
  },
  viewAllText: {
    fontFamily: "Nunito",
    fontWeight: "700",
    fontSize: scaleFont(12),
    color: "#1F77B4",
    textDecorationLine: "underline",
  },
  /* ── List ── */
  listContent: {
    paddingHorizontal: wp(15),
    gap: hp(10),
    paddingBottom: hp(20),
  },
  /* ── Card ── */
  card: {
    width: wp(350),
    height: hp(65),
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(10),
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(10),
    flex: 1,
  },
  logoWrap: {
    width: wp(45),
    height: wp(45),
    borderRadius: wp(22.5),
    overflow: "hidden",
    shadowColor: "#EEEEEE",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 3,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  logoImg: {
    width: wp(55),
    height: wp(55),
    borderRadius: wp(22.5),
  },
  textCol: {
    flex: 1,
    gap: hp(2),
  },
  fundName: {
    fontFamily: "Urbanist",
    fontWeight: "500",
    fontSize: scaleFont(16),
    lineHeight: hp(21),
  },
  folioRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  folioText: {
    fontFamily: "Urbanist",
    fontWeight: "400",
    fontSize: scaleFont(11),
  },
  folioDivider: {
    fontFamily: "Urbanist",
    fontSize: scaleFont(11),
  },
  amount: {
    fontFamily: "Urbanist",
    fontWeight: "500",
    fontSize: scaleFont(16),
    lineHeight: hp(21),
    marginBottom: 25
  },
  emptyText: {
    textAlign: "center",
    marginTop: hp(50),
    fontFamily: "Urbanist",
    fontSize: scaleFont(16),
    opacity: 0.6,
  },
});

// import React, { useState, useMemo, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   ScrollView,
//   Modal,
//   FlatList,
//   TextInput,
//   Alert, Linking
// } from "react-native";
// import LinearGradient from "react-native-linear-gradient";
// import { useNavigation } from "@react-navigation/native";
// import { wp, hp } from "../../../utils/responcive/responcive";
// import { useAppTheme } from "../../../hooks/useTheme";
// import { useGet } from "../../../hooks/useGet";
// import { usePost } from "../../../hooks/usePost";
// import { ActivityIndicator } from "react-native"
// import AsyncStorage from "@react-native-async-storage/async-storage";
// // ─── Date Picker Modal ────────────────────────────────────────────────────────
// const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
// const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// const YEARS = Array.from({ length: 11 }, (_, i) => 2020 + i);

// const DatePickerModal = ({
//   visible,
//   onClose,
//   onConfirm,
//   colors,
//   mode,
// }: {
//   visible: boolean;
//   onClose: () => void;
//   onConfirm: (date: string) => void;
//   colors: any;
//   mode: string;
// }) => {
//   const [day, setDay] = useState(1);
//   const [month, setMonth] = useState(1);
//   const [year, setYear] = useState(2025);

//   const cardBg = mode === "dark" ? "#1E1E1E" : "#FFFFFF";
//   const textColor = colors.text;
//   const accent = "#3366FF";


//   const Column = ({
//     data,
//     selected,
//     onSelect,
//     label,
//   }: {
//     data: (string | number)[];
//     selected: number;
//     onSelect: (v: number) => void;
//     label: string;
//   }) => (
//     <View style={pickerStyles.col}>
//       <Text style={[pickerStyles.colLabel, { color: mode === "dark" ? "#888" : "#9E9E9E" }]}>{label}</Text>
//       <ScrollView
//         style={pickerStyles.scroll}
//         showsVerticalScrollIndicator={false}
//         nestedScrollEnabled
//       >
//         {data.map((item, idx) => {
//           const val = idx + 1;
//           const active = selected === val;
//           return (
//             <TouchableOpacity
//               key={idx}
//               onPress={() => onSelect(val)}
//               style={[pickerStyles.item, active && { backgroundColor: accent + "22", borderRadius: 8 }]}
//             >
//               <Text style={[
//                 pickerStyles.itemText,
//                 { color: active ? accent : textColor },
//                 active && { fontFamily: "Urbanist-Bold" },
//               ]}>
//                 {typeof item === "number" ? String(item).padStart(2, "0") : item}
//               </Text>
//             </TouchableOpacity>
//           );
//         })}
//       </ScrollView>
//     </View>
//   );

//   // Year column needs different index mapping
//   const YearColumn = () => (
//     <View style={pickerStyles.col}>
//       <Text style={[pickerStyles.colLabel, { color: mode === "dark" ? "#888" : "#9E9E9E" }]}>Year</Text>
//       <ScrollView style={pickerStyles.scroll} showsVerticalScrollIndicator={false} nestedScrollEnabled>
//         {YEARS.map((y, idx) => {
//           const active = year === y;
//           return (
//             <TouchableOpacity
//               key={idx}
//               onPress={() => setYear(y)}
//               style={[pickerStyles.item, active && { backgroundColor: accent + "22", borderRadius: 8 }]}
//             >
//               <Text style={[
//                 pickerStyles.itemText,
//                 { color: active ? accent : textColor },
//                 active && { fontFamily: "Urbanist-Bold" },
//               ]}>
//                 {y}
//               </Text>
//             </TouchableOpacity>
//           );
//         })}
//       </ScrollView>
//     </View>
//   );

//   const handleConfirm = () => {
//     const d = String(day).padStart(2, "0");
//     const m = String(month).padStart(2, "0");
//     onConfirm(`${d}/${m}/${year}`);
//     onClose();
//   };

//   return (
//     <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
//       <View style={pickerStyles.overlay}>
//         <View style={[pickerStyles.sheet, { backgroundColor: cardBg }]}>
//           <Text style={[pickerStyles.title, { color: textColor }]}>Select Date</Text>

//           <View style={pickerStyles.columns}>
//             <Column data={DAYS} selected={day} onSelect={setDay} label="Day" />
//             <View style={[pickerStyles.dividerV, { backgroundColor: mode === "dark" ? "#333" : "#E0E0E0" }]} />
//             <Column data={MONTHS} selected={month} onSelect={setMonth} label="Month" />
//             <View style={[pickerStyles.dividerV, { backgroundColor: mode === "dark" ? "#333" : "#E0E0E0" }]} />
//             <YearColumn />
//           </View>

//           <TouchableOpacity style={[pickerStyles.confirmBtn, { backgroundColor: accent }]} onPress={handleConfirm} activeOpacity={0.8}>
//             <Text style={pickerStyles.confirmText}>Confirm</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={pickerStyles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
//             <Text style={[pickerStyles.cancelText, { color: mode === "dark" ? "#AAA" : "#888" }]}>Cancel</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// const pickerStyles = StyleSheet.create({
//   overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
//   sheet: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: wp(20), paddingBottom: hp(36) },
//   title: { fontFamily: "Urbanist-SemiBold", fontSize: wp(17), textAlign: "center", marginBottom: hp(16) },
//   columns: { flexDirection: "row", justifyContent: "space-around", alignItems: "flex-start" },
//   col: { flex: 1, alignItems: "center" },
//   colLabel: { fontFamily: "Urbanist-Medium", fontSize: wp(12), marginBottom: hp(6) },
//   scroll: { height: hp(160) },
//   item: { height: hp(40), justifyContent: "center", alignItems: "center", paddingHorizontal: wp(8), marginVertical: 1 },
//   itemText: { fontFamily: "Urbanist-Medium", fontSize: wp(15) },
//   dividerV: { width: 1, height: hp(160) },
//   confirmBtn: { borderRadius: 8, paddingVertical: hp(12), alignItems: "center", marginTop: hp(16) },
//   confirmText: { fontFamily: "Urbanist-SemiBold", fontSize: wp(15), color: "#FFFFFF" },
//   cancelBtn: { paddingVertical: hp(10), alignItems: "center" },
//   cancelText: { fontFamily: "Urbanist-Medium", fontSize: wp(14) },
// });

// // ─── Dropdown Modal ───────────────────────────────────────────────────────────
// const DropdownModal = ({
//   visible,
//   onClose,
//   data,
//   onSelect,
//   colors,
//   mode,
//   loading,
// }: any) => {
//   const [search, setSearch] = useState("");
//   const [visibleCount, setVisibleCount] = useState(10);

//   const filteredData = useMemo(() => {
//     return data.filter((item: any) =>
//       item?.investorName?.toLowerCase().includes(search.toLowerCase())
//     );

//   }, [search, data]);


//   const visibleData = filteredData.slice(0, visibleCount);

//   const loadMore = () => {
//     if (visibleCount < filteredData.length) {
//       setVisibleCount(prev => prev + 10);
//     }

//   };


//   const cardBg = mode === "dark" ? "#1E1E1E" : "#FFFFFF";

//   return (
//     <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
//       <TouchableOpacity style={dropStyles.overlay} activeOpacity={1} onPress={onClose}>
//         <View style={[dropStyles.menu, { backgroundColor: cardBg, maxHeight: "80%" }]}>

//           {/* 🔍 SEARCH */}
//           <TextInput
//             placeholder="Search..."
//             value={search}
//             onChangeText={setSearch}
//             style={{ padding: 12, borderBottomWidth: 1 }}
//           />

//           {/* ⏳ LOADER */}
//           {loading ? (
//             <ActivityIndicator style={{ marginTop: 20 }} />
//           ) : (
//             <FlatList
//               data={visibleData}
//               keyExtractor={(_, i) => i.toString()}
//               onEndReached={loadMore}
//               onEndReachedThreshold={0.5}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   style={dropStyles.item}
//                   onPress={() => {
//                     onSelect(item);
//                     onClose();
//                   }}
//                 >
//                   <Text style={[dropStyles.itemText, { color: colors.text }]}>
//                     {item.investorName}
//                   </Text>
//                 </TouchableOpacity>
//               )}
//               ListFooterComponent={
//                 visibleCount < filteredData.length ? (
//                   <ActivityIndicator style={{ margin: 10 }} />
//                 ) : null
//               }
//             />
//           )}

//         </View>
//       </TouchableOpacity>
//     </Modal>
//   );
// };

// const dropStyles = StyleSheet.create({
//   overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "center", paddingHorizontal: wp(20) },
//   menu: { borderRadius: 12, paddingVertical: hp(8), shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 10, elevation: 8 },
//   item: { paddingHorizontal: wp(16), paddingVertical: hp(14) },
//   itemText: { fontFamily: "Urbanist-Medium", fontSize: wp(15) },
//   sep: { height: 1, marginHorizontal: wp(16) },
// });

// const ReportsScreen = () => {
// const [cid, setCid] = useState<string | null>(null);

// useEffect(() => {
//   const getCid = async () => {
//     const storedCid = await AsyncStorage.getItem("cid");

//     if (!storedCid) {
//       Alert.alert("Error", "CID not found");
//       return;
//     }

//     setCid(storedCid);
//   };

//   getCid();
// }, []);


// const { data, loading } = useGet<any>(
//   cid ? `api/reports/family-heads?cid=${cid}` : null
// );
//   const { postData, loading: reportLoading } = usePost();

//   const dropdownOptions = data?.result || [];
//   const navigation = useNavigation<any>();
//   const { colors, mode } = useAppTheme();

//   const [selected, setSelected] = useState("Portfolio Valuation");
//   const [selectName, setSelectName] = useState("Select name");
//   const [selectedInvestor, setSelectedInvestor] = useState<any>(null);

//   const [fromDate, setFromDate] = useState("DD / MM / YYYY");
//   const [toDate, setToDate] = useState("DD / MM / YYYY");
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [showFromPicker, setShowFromPicker] = useState(false);
//   const [showToPicker, setShowToPicker] = useState(false);

//   const cardBg = mode === "dark" ? "#1E1E1E" : "#FFFFFF";
//   const borderCol = mode === "dark" ? "#3A3A3A" : "#D1D5DB";
//   const labelCol = mode === "dark" ? "#888888" : "#000000";

//   const tabs = [
//     { label: "Portfolio Valuation", color: "#22C55E" },
//     { label: "Portfolio Summary", color: "#E6A928" },
//     { label: "Assets Allocation", color: "#8657D9" },
//     { label: "Transaction Reports", color: "#E75480" },
//     { label: "Capital Gain", color: "#13A6A1" },
//     { label: "Dividend Report", color: "#527EFF" },
//   ];

//   const isPlaceholder = fromDate === "DD / MM / YYYY";
//   const isPlaceholderT = toDate === "DD / MM / YYYY";

//   // const isCustomDate = fromDate !== "DD / MM / YYYY" && toDate !== "DD / MM / YYYY";
//   // const dateFilterType = isCustomDate ? "CUSTOM" : "SINCE_INCEPTION";

//   const dateFilterType = selected === "Portfolio Valuation" ? "SINCE_INCEPTION" : "CUSTOM";

//   const handleDownload = async () => {
//     if (!selectedInvestor) {
//       Alert.alert("Error", "Please select investor");
//       return;
//     }
//     if (dateFilterType === "CUSTOM") {
//       if (
//         fromDate === "DD / MM / YYYY" ||
//         toDate === "DD / MM / YYYY"
//       ) {
//         Alert.alert("Error", "Please select both dates");
//         return;
//       }
//     }

//     const { fhid, cid } = selectedInvestor;

//     let url = "";
//     let body: any = {};

//     if (dateFilterType === "CUSTOM") {
//       body = {
//         fromDate,
//         toDate,
//       };
//     }

//     if (selected === "Portfolio Valuation") {
//       url = `/api/reports/valuation-pdf?isSummary=0&fhid=${fhid}&cid=${cid}&dateFilterType=${dateFilterType}`;
//     }
//     else if (selected === "Portfolio Summary") {
//       url = `/api/reports/valuation-pdf?isSummary=1&fhid=${fhid}&cid=${cid}&dateFilterType=${dateFilterType}`;
//     }
//     else if (selected === "Transaction Reports") {
//       url = `/api/reports/getTransactionReport-pdf?fhid=${fhid}&cid=${cid}&dateFilterType=${dateFilterType}`;
//     }
//     else {
//       Alert.alert("Error", "API not implemented for this tab");
//       return;
//     }

//     try {
//       const res = await postData(url, body);
//       console.log("Report Response:", res);

//       if (!res?.success) {
//         Alert.alert("Error", res?.message);
//         return;
//       }

//       if (res?.url) {
//         Linking.openURL(res.url);
//       } else {
//         Alert.alert("Error", "No file URL received");
//       }

//     } catch (err: any) {
//       const message =
//         err?.response?.data?.message ||
//         err?.message ||
//         "Something went wrong";

//       Alert.alert("Error", message);
//     }
//   };

//   return (
//     <View style={[styles.container, { backgroundColor: colors.background }]}>
//       {/* 1. Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backContainer}>
//           <Image
//             source={require("../../../images/loginImage/back_arrow.png")}
//             style={[styles.backIcon, mode === "dark" && { tintColor: "#FFFFFF" }]}
//             resizeMode="contain"
//           />
//         </TouchableOpacity>
//         <Text style={[styles.title, { color: colors.text }]}>Reports</Text>
//         <View style={{ width: wp(41) }} />
//       </View>

//       <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

//         {/* 2. Report Tabs Section (Upper) */}
//         <View style={styles.tabsWrapper}>
//           <View style={styles.gridContainer}>
//             {tabs.map((tab, index) => {
//               const isActive = selected === tab.label;
//               return (
//                 <TouchableOpacity
//                   key={index}
//                   onPress={() => setSelected(tab.label)}
//                   style={[
//                     styles.gridItem,
//                     {
//                       backgroundColor: isActive ? tab.color : "transparent",
//                       borderColor: tab.color,
//                     },
//                   ]}
//                 >
//                   <Text style={[styles.chipText, { color: isActive ? "#FFFFFF" : tab.color }]}>
//                     {tab.label}
//                   </Text>
//                 </TouchableOpacity>
//               );
//             })}
//           </View>
//         </View>

//         <View style={styles.filterSection}>

//           {/* 3. Date Picker Section */}
//           <View style={styles.dateLabelRow}>
//             <Text style={[styles.dateBoxLabel, { color: labelCol }]}>From Date</Text>
//             <Text style={[styles.dateBoxLabel, { color: labelCol }]}>To Date</Text>
//           </View>

//           <View style={styles.dateRow}>
//             <TouchableOpacity
//               style={[styles.dateBox, { backgroundColor: cardBg, borderColor: borderCol }]}
//               onPress={() => setShowFromPicker(true)}
//             >
//               <View style={styles.dateBoxInner}>
//                 <Image
//                   source={require("../../../images/setting/calendar.png")}
//                   style={[styles.calendarIcon, { tintColor: "#007AFF" }]}
//                   resizeMode="contain"
//                 />
//                 <Text style={[styles.dateText, { color: isPlaceholder ? (mode === "dark" ? "#555" : "#BBBBBB") : colors.text }]}>
//                   {fromDate}
//                 </Text>
//               </View>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[styles.dateBox, { backgroundColor: cardBg, borderColor: borderCol }]}
//               onPress={() => setShowToPicker(true)}
//             >
//               <View style={styles.dateBoxInner}>
//                 <Image
//                   source={require("../../../images/setting/calendar.png")}
//                   style={[styles.calendarIcon, { tintColor: "#007AFF" }]}
//                   resizeMode="contain"
//                 />
//                 <Text style={[styles.dateText, { color: isPlaceholderT ? (mode === "dark" ? "#555" : "#BBBBBB") : colors.text }]}>
//                   {toDate}
//                 </Text>
//               </View>
//             </TouchableOpacity>
//           </View>

//           {/* 4. Name Dropdown (Under Date Picker) */}
//           <View style={{ marginTop: hp(20) }}>
//             <TouchableOpacity
//               style={[styles.selectRow, { borderBottomColor: mode === "dark" ? "#527EFF" : "#3366FF" }]}
//               activeOpacity={0.7}
//               onPress={() => setShowDropdown(true)}
//             >
//               <Text style={[styles.selectText, { color: colors.text }]}>{selectName}</Text>
//               <Image
//                 source={require("../../../images/setting/formkit_down.png")}
//                 style={[styles.dropIcon, { tintColor: colors.text }]}
//                 resizeMode="contain"
//               />
//             </TouchableOpacity>
//           </View>

//           {/* 5. Download Button (At Bottom) */}
//           <LinearGradient
//             colors={["#527EFF", "#3366FF"]}
//             start={{ x: 0.5, y: 0 }}
//             end={{ x: 0.5, y: 1 }}
//             style={styles.downloadBtn}
//           >
//             <TouchableOpacity
//               activeOpacity={0.8}
//               style={[styles.downloadBtnInner, { opacity: reportLoading || !selectedInvestor ? 0.6 : 1 }]}
//               onPress={handleDownload}
//               disabled={reportLoading || !selectedInvestor}
//             >
//               {reportLoading ? (
//                 <ActivityIndicator color="#fff" />
//               ) : (
//                 <>
//                   <Image
//                     source={require("../../../images/setting/download.png")}
//                     style={styles.downloadIcon}
//                     resizeMode="contain"
//                   />
//                   <Text style={styles.downloadBtnText}>Download Report</Text>
//                 </>
//               )}
//             </TouchableOpacity>
//           </LinearGradient>
//         </View>
//       </ScrollView>

//       {/* Modals */}
//       <DropdownModal
//         visible={showDropdown}
//         onClose={() => setShowDropdown(false)}
//         data={dropdownOptions}
//         loading={loading}
//         colors={colors}
//         mode={mode}
//         onSelect={(item: any) => {
//           setSelectName(item.investorName);
//           setSelectedInvestor(item);
//         }}
//       />
//       {/* ... DatePickerModals here ... */}

//       <DatePickerModal
//         visible={showFromPicker}
//         onClose={() => setShowFromPicker(false)}
//         onConfirm={setFromDate}
//         colors={colors}
//         mode={mode}
//       />
//       <DatePickerModal
//         visible={showToPicker}
//         onClose={() => setShowToPicker(false)}
//         onConfirm={setToDate}
//         colors={colors}
//         mode={mode}
//       />


//     </View>
//   );
// };

// export default ReportsScreen;

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   header: {
//     height: hp(61),
//     marginTop: hp(50),
//     paddingHorizontal: wp(10),
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   backContainer: { width: wp(41), height: wp(41), justifyContent: "center", alignItems: "center" },
//   backIcon: { width: wp(19), height: wp(19) },
//   title: { fontSize: wp(24), fontFamily: "Urbanist-SemiBold" },

//   // Tabs Grid
//   tabsWrapper: {
//     marginBottom: hp(40),
//   },
//   gridContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-between",
//     paddingHorizontal: wp(17),
//     paddingTop: hp(10),
//   },
//   gridItem: {
//     width: "48%",
//     height: hp(40),
//     borderRadius: 50,
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 1.5,
//     marginBottom: hp(10),
//   },
//   chipText: { fontSize: wp(12), fontFamily: "Urbanist-Medium" },

//   // Filter section
//   filterSection: {
//     paddingHorizontal: wp(17),
//     gap: hp(10),
//   },
//   selectRow: {
//     width: "100%",
//     height: hp(45),
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     borderBottomWidth: 1.5,
//   },
//   selectText: { fontFamily: "Urbanist-Medium", fontSize: wp(16) },
//   dropIcon: { width: wp(20), height: wp(20) },

//   // Dates
//   dateLabelRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: hp(10),
//   },
//   dateBoxLabel: { fontFamily: "Urbanist-Medium", fontSize: wp(14), width: wp(150) },
//   dateRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: hp(5),
//   },
//   dateBox: {
//     width: wp(160),
//     height: hp(44),
//     borderRadius: 8,
//     borderWidth: 1,
//     paddingHorizontal: wp(12),
//     justifyContent: "center",
//   },
//   dateBoxInner: { flexDirection: "row", alignItems: "center", gap: wp(8) },
//   calendarIcon: { width: wp(21), height: hp(20) },
//   dateText: { fontFamily: "Urbanist-Medium", fontSize: wp(14) },

//   // Button
//   downloadBtn: {
//     width: wp(220),
//     height: hp(45),
//     borderRadius: 8,
//     alignSelf: "center",
//     marginTop: hp(30),
//   },
//   downloadBtnInner: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: wp(10),
//   },
//   downloadIcon: { width: wp(18), height: wp(18), tintColor: "#FFFFFF" },
//   downloadBtnText: { fontFamily: "Urbanist-SemiBold", fontSize: wp(14), color: "#FFFFFF" },
// });
import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  FlatList,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { wp, hp } from "../../../utils/responcive/responcive";
import { useAppTheme } from "../../../hooks/useTheme";
import { useGet } from "../../../hooks/useGet";
import { usePost } from "../../../hooks/usePost";
import { ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNFS from "react-native-fs";
import FileViewer from "react-native-file-viewer";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (date: Date): string => {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  return `${y}-${m}-${d}`;
};

const isoToDisplay = (iso: string): string => {
  return iso.substring(0, 10);
};

const getYesterday = (): string => {
  const d = new Date();
  d.setDate(d.getDate() - 2);
  return formatDate(d);
};

// ─── Date Picker Modal ────────────────────────────────────────────────────────
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const YEARS = Array.from({ length: 11 }, (_, i) => 2020 + i);

const DatePickerModal = ({
  visible,
  onClose,
  onConfirm,
  colors,
  mode,
}: {
  visible: boolean;
  onClose: () => void;
  onConfirm: (date: string) => void;
  colors: any;
  mode: string;
}) => {
  const [day, setDay] = useState(1);
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(2025);

  const cardBg = mode === "dark" ? "#1E1E1E" : "#FFFFFF";
  const textColor = colors.text;
  const accent = "#3366FF";

  const Column = ({
    data,
    selected,
    onSelect,
    label,
  }: {
    data: (string | number)[];
    selected: number;
    onSelect: (v: number) => void;
    label: string;
  }) => (
    <View style={pickerStyles.col}>
      <Text style={[pickerStyles.colLabel, { color: mode === "dark" ? "#888" : "#9E9E9E" }]}>
        {label}
      </Text>
      <ScrollView style={pickerStyles.scroll} showsVerticalScrollIndicator={false} nestedScrollEnabled>
        {data.map((item, idx) => {
          const val = idx + 1;
          const active = selected === val;
          return (
            <TouchableOpacity
              key={idx}
              onPress={() => onSelect(val)}
              style={[pickerStyles.item, active && { backgroundColor: accent + "22", borderRadius: 8 }]}
            >
              <Text
                style={[
                  pickerStyles.itemText,
                  { color: active ? accent : textColor },
                  active && { fontFamily: "Urbanist-Bold" },
                ]}
              >
                {typeof item === "number" ? String(item).padStart(2, "0") : item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  const YearColumn = () => (
    <View style={pickerStyles.col}>
      <Text style={[pickerStyles.colLabel, { color: mode === "dark" ? "#888" : "#9E9E9E" }]}>
        Year
      </Text>
      <ScrollView style={pickerStyles.scroll} showsVerticalScrollIndicator={false} nestedScrollEnabled>
        {YEARS.map((y, idx) => {
          const active = year === y;
          return (
            <TouchableOpacity
              key={idx}
              onPress={() => setYear(y)}
              style={[pickerStyles.item, active && { backgroundColor: accent + "22", borderRadius: 8 }]}
            >
              <Text
                style={[
                  pickerStyles.itemText,
                  { color: active ? accent : textColor },
                  active && { fontFamily: "Urbanist-Bold" },
                ]}
              >
                {y}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  const handleConfirm = () => {
    const d = String(day).padStart(2, "0");
    const m = String(month).padStart(2, "0");
    onConfirm(`${year}-${m}-${d}`);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={pickerStyles.overlay}>
        <View style={[pickerStyles.sheet, { backgroundColor: cardBg }]}>
          <Text style={[pickerStyles.title, { color: textColor }]}>Select Date</Text>
          <View style={pickerStyles.columns}>
            <Column data={DAYS} selected={day} onSelect={setDay} label="Day" />
            <View style={[pickerStyles.dividerV, { backgroundColor: mode === "dark" ? "#333" : "#E0E0E0" }]} />
            <Column data={MONTHS} selected={month} onSelect={setMonth} label="Month" />
            <View style={[pickerStyles.dividerV, { backgroundColor: mode === "dark" ? "#333" : "#E0E0E0" }]} />
            <YearColumn />
          </View>
          <TouchableOpacity
            style={[pickerStyles.confirmBtn, { backgroundColor: accent }]}
            onPress={handleConfirm}
            activeOpacity={0.8}
          >
            <Text style={pickerStyles.confirmText}>Confirm</Text>
          </TouchableOpacity>
          <TouchableOpacity style={pickerStyles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
            <Text style={[pickerStyles.cancelText, { color: mode === "dark" ? "#AAA" : "#888" }]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const pickerStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  sheet: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: wp(20), paddingBottom: hp(36) },
  title: { fontFamily: "Urbanist-SemiBold", fontSize: wp(17), textAlign: "center", marginBottom: hp(16) },
  columns: { flexDirection: "row", justifyContent: "space-around", alignItems: "flex-start" },
  col: { flex: 1, alignItems: "center" },
  colLabel: { fontFamily: "Urbanist-Medium", fontSize: wp(12), marginBottom: hp(6) },
  scroll: { height: hp(160) },
  item: { height: hp(40), justifyContent: "center", alignItems: "center", paddingHorizontal: wp(8), marginVertical: 1 },
  itemText: { fontFamily: "Urbanist-Medium", fontSize: wp(15) },
  dividerV: { width: 1, height: hp(160) },
  confirmBtn: { borderRadius: 8, paddingVertical: hp(12), alignItems: "center", marginTop: hp(16) },
  confirmText: { fontFamily: "Urbanist-SemiBold", fontSize: wp(15), color: "#FFFFFF" },
  cancelBtn: { paddingVertical: hp(10), alignItems: "center" },
  cancelText: { fontFamily: "Urbanist-Medium", fontSize: wp(14) },
});

// ─── Dropdown Modal ───────────────────────────────────────────────────────────
const DropdownModal = ({
  visible,
  onClose,
  data,
  onSelect,
  colors,
  mode,
  loading,
}: any) => {
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);

  const filteredData = useMemo(() => {
    return data.filter((item: any) =>
      item?.investorName?.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, data]);

  const visibleData = filteredData.slice(0, visibleCount);

  const loadMore = () => {
    if (visibleCount < filteredData.length) {
      setVisibleCount((prev) => prev + 10);
    }
  };

  const cardBg = mode === "dark" ? "#1E1E1E" : "#FFFFFF";

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={dropStyles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={[dropStyles.menu, { backgroundColor: cardBg, maxHeight: "80%" }]}>
          <TextInput
            placeholder="Search..."
            value={search}
            onChangeText={setSearch}
            style={{ padding: 12, borderBottomWidth: 1 }}
          />
          {loading ? (
            <ActivityIndicator style={{ marginTop: 20 }} />
          ) : (
            <FlatList
              data={visibleData}
              keyExtractor={(_, i) => i.toString()}
              onEndReached={loadMore}
              onEndReachedThreshold={0.5}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={dropStyles.item}
                  onPress={() => {
                    onSelect(item);
                    onClose();
                  }}
                >
                  <Text style={[dropStyles.itemText, { color: colors.text }]}>
                    {item.investorName}
                  </Text>
                </TouchableOpacity>
              )}
              ListFooterComponent={
                visibleCount < filteredData.length
                  ? <ActivityIndicator style={{ margin: 10 }} />
                  : null
              }
            />
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const dropStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "center", paddingHorizontal: wp(20) },
  menu: { borderRadius: 12, paddingVertical: hp(8), shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 10, elevation: 8 },
  item: { paddingHorizontal: wp(16), paddingVertical: hp(14) },
  itemText: { fontFamily: "Urbanist-Medium", fontSize: wp(15) },
});

// ─── PDF Save Helper ──────────────────────────────────────────────────────────
const savePdfFromResponse = async (rawPdf: string, filePath: string): Promise<void> => {
  const trimmed = rawPdf.trimStart();

  console.log("PDF starts with:", trimmed.substring(0, 80));
  console.log("PDF length:", trimmed.length);

  if (trimmed.startsWith("%PDF")) {
    // ── Case A: Raw binary PDF string (%PDF-...) ──────────────────────────
    // Must convert char-by-char to base64 to preserve binary bytes correctly
    console.log("Case A: Raw PDF binary string");
    const bytes = new Uint8Array(trimmed.length);
    for (let i = 0; i < trimmed.length; i++) {
      bytes[i] = trimmed.charCodeAt(i) & 0xff;
    }
    let binary = "";
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    const base64Pdf = btoa(binary);
    await RNFS.writeFile(filePath, base64Pdf, "base64");

  } else if (/^[A-Za-z0-9+/]={0,2}$/.test(trimmed.slice(-4)) && trimmed.length % 4 === 0) {
    // ── Case B: Already base64 encoded ───────────────────────────────────
    console.log("Case B: Base64 encoded PDF");
    await RNFS.writeFile(filePath, trimmed, "base64");

  } else if (/^[0-9a-fA-F\s]+$/.test(trimmed.substring(0, 200))) {
    // ── Case C: Hex string ────────────────────────────────────────────────
    console.log("Case C: Hex string PDF");
    const cleanHex = trimmed.replace(/\s/g, "");
    const bytes: number[] = [];
    for (let i = 0; i < cleanHex.length; i += 2) {
      bytes.push(parseInt(cleanHex.substring(i, i + 2), 16));
    }
    let binary = "";
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    const base64Pdf = btoa(binary);
    await RNFS.writeFile(filePath, base64Pdf, "base64");

  } else {
    // ── Case D: Unknown — try saving as-is and log for debugging ──────────
    console.log("Case D: Unknown format, first 300 chars:", trimmed.substring(0, 300));
    throw new Error("Unknown PDF format received. Check Metro logs for details.");
  }
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
const ReportsScreen = () => {
  const [cid, setCid] = useState<string | null>(null);

  useEffect(() => {
    const getCid = async () => {
      const storedCid = await AsyncStorage.getItem("cid");
      if (!storedCid) {
        Alert.alert("Error", "CID not found");
        return;
      }
      setCid(storedCid);
    };
    getCid();
  }, []);

  const { data, loading } = useGet<any>(
    cid ? `api/reports/family-heads?cid=${cid}` : null
  );
  const { postData, loading: reportLoading } = usePost();

  const dropdownOptions: any[] = data?.result || [];
  const navigation = useNavigation<any>();
  const { colors, mode } = useAppTheme();

  const [selected, setSelected] = useState("Portfolio Valuation");
  const [selectName, setSelectName] = useState("Select name");
  const [selectedInvestor, setSelectedInvestor] = useState<any>(null);

  const PLACEHOLDER = "YYYY-MM-DD";
  const [fromDate, setFromDate] = useState(PLACEHOLDER);
  const [toDate, setToDate] = useState(PLACEHOLDER);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const cardBg = mode === "dark" ? "#1E1E1E" : "#FFFFFF";
  const borderCol = mode === "dark" ? "#3A3A3A" : "#D1D5DB";
  const labelCol = mode === "dark" ? "#888888" : "#000000";

  const tabs = [
    { label: "Portfolio Valuation", color: "#22C55E" },
    { label: "Portfolio Summary", color: "#E6A928" },
    { label: "Assets Allocation", color: "#8657D9" },
    { label: "Transaction Reports", color: "#E75480" },
    { label: "Capital Gain", color: "#13A6A1" },
    { label: "Dividend Report", color: "#527EFF" },
  ];

  const dateFilterType = selected === "Portfolio Valuation" ? "SINCE_INCEPTION" : "CUSTOM";
  const isCustomDate = dateFilterType === "CUSTOM";

  // ── Auto-select if only one investor ──────────────────────────────────────
  useEffect(() => {
    if (dropdownOptions.length === 1) {
      const only = dropdownOptions[0];
      setSelectedInvestor(only);
      setSelectName(only.investorName);
    }
  }, [data]);

  // ── Auto-fill dates when investor selected ────────────────────────────────
  useEffect(() => {
    if (selectedInvestor && isCustomDate) {
      if (selectedInvestor.firstInvestmentDate) {
        setFromDate(isoToDisplay(selectedInvestor.firstInvestmentDate));
      }
      setToDate(getYesterday());
    }
    if (!isCustomDate) {
      setFromDate(PLACEHOLDER);
      setToDate(PLACEHOLDER);
    }
  }, [selectedInvestor, isCustomDate]);

  const isFromPlaceholder = fromDate === PLACEHOLDER;
  const isToPlaceholder = toDate === PLACEHOLDER;

  const handleInvestorSelect = (item: any) => {
    setSelectName(item.investorName);
    setSelectedInvestor(item);
  };

  // ─── Download & Open PDF ──────────────────────────────────────────────────
  const handleDownload = async () => {
    if (!selectedInvestor) {
      Alert.alert("Error", "Please select investor");
      return;
    }
    if (isCustomDate && (isFromPlaceholder || isToPlaceholder)) {
      Alert.alert("Error", "Please select both dates");
      return;
    }

    const { fhid, cid: investorCid } = selectedInvestor;
    const dateParams = isCustomDate ? `&fromDate=${fromDate}&toDate=${toDate}` : "";

    let url = "";
    if (selected === "Portfolio Valuation") {
      url = `/api/reports/valuation-pdf?isSummary=0&fhid=${fhid}&cid=${investorCid}&dateFilterType=${dateFilterType}${dateParams}`;
    } else if (selected === "Portfolio Summary") {
      url = `/api/reports/valuation-pdf?isSummary=1&fhid=${fhid}&cid=${investorCid}&dateFilterType=${dateFilterType}${dateParams}`;
    } else if (selected === "Transaction Reports") {
      url = `/api/reports/getTransactionReport-pdf?fhid=${fhid}&cid=${investorCid}&dateFilterType=${dateFilterType}${dateParams}`;
    } else {
      Alert.alert("Error", "API not implemented for this tab");
      return;
    }

    try {
      const res = await postData(url, {});

      // ── Extract PDF string from response ──────────────────────────────
      const rawPdf: string | undefined =
        typeof res === "string"
          ? res
          : res?.data ?? res?.pdf ?? res?.file ?? res?.result;

      if (!rawPdf) {
        Alert.alert("Error", res?.message || "No PDF data received from server");
        return;
      }

      // ── Build file path ───────────────────────────────────────────────
      const fileName = `${selected.replace(/\s+/g, "_")}_${Date.now()}.pdf`;
      const dir =
        Platform.OS === "android"
          ? RNFS.DownloadDirectoryPath
          : RNFS.DocumentDirectoryPath;
      const filePath = `${dir}/${fileName}`;

      // ── Save with correct encoding (auto-detects format) ──────────────
      await savePdfFromResponse(rawPdf, filePath);

      // ── Scan so file appears in Downloads app (Android only) ──────────
      if (Platform.OS === "android") {
        await RNFS.scanFile(filePath);
      }

      // ── Open in device's default PDF viewer ───────────────────────────
      await FileViewer.open(filePath, {
        showOpenWithDialog: true,
        showAppsSuggestions: true,
      });

    } catch (err: any) {
      if (err?.message?.toLowerCase().includes("cancel")) return;
      console.log("Download error full:", err);
      const message = err?.response?.data?.message || err?.message || "Something went wrong";
      Alert.alert("Error", message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>

      {/* 1. Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backContainer}>
          <Image
            source={require("../../../images/loginImage/back_arrow.png")}
            style={[styles.backIcon, mode === "dark" && { tintColor: "#FFFFFF" }]}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Reports</Text>
        <View style={{ width: wp(41) }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* 2. Report Type Tabs */}
        <View style={styles.tabsWrapper}>
          <View style={styles.gridContainer}>
            {tabs.map((tab, index) => {
              const isActive = selected === tab.label;
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelected(tab.label)}
                  style={[
                    styles.gridItem,
                    {
                      backgroundColor: isActive ? tab.color : "transparent",
                      borderColor: tab.color,
                    },
                  ]}
                >
                  <Text style={[styles.chipText, { color: isActive ? "#FFFFFF" : tab.color }]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.filterSection}>

          {/* 3. Date Pickers — only for CUSTOM tabs */}
          {isCustomDate && (
            <>
              <View style={styles.dateLabelRow}>
                <Text style={[styles.dateBoxLabel, { color: labelCol }]}>From Date</Text>
                <Text style={[styles.dateBoxLabel, { color: labelCol }]}>To Date</Text>
              </View>

              <View style={styles.dateRow}>
                <TouchableOpacity
                  style={[styles.dateBox, { backgroundColor: cardBg, borderColor: borderCol }]}
                  onPress={() => setShowFromPicker(true)}
                >
                  <View style={styles.dateBoxInner}>
                    <Image
                      source={require("../../../images/setting/calendar.png")}
                      style={[styles.calendarIcon, { tintColor: "#007AFF" }]}
                      resizeMode="contain"
                    />
                    <Text
                      style={[
                        styles.dateText,
                        { color: isFromPlaceholder ? (mode === "dark" ? "#555" : "#BBBBBB") : colors.text },
                      ]}
                    >
                      {fromDate}
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.dateBox, { backgroundColor: cardBg, borderColor: borderCol }]}
                  onPress={() => setShowToPicker(true)}
                >
                  <View style={styles.dateBoxInner}>
                    <Image
                      source={require("../../../images/setting/calendar.png")}
                      style={[styles.calendarIcon, { tintColor: "#007AFF" }]}
                      resizeMode="contain"
                    />
                    <Text
                      style={[
                        styles.dateText,
                        { color: isToPlaceholder ? (mode === "dark" ? "#555" : "#BBBBBB") : colors.text },
                      ]}
                    >
                      {toDate}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* 4. Investor Dropdown */}
          <View style={{ marginTop: hp(20) }}>
            <TouchableOpacity
              style={[styles.selectRow, { borderBottomColor: mode === "dark" ? "#527EFF" : "#3366FF" }]}
              activeOpacity={dropdownOptions.length === 1 ? 1 : 0.7}
              onPress={() => dropdownOptions.length !== 1 && setShowDropdown(true)}
            >
              <Text style={[styles.selectText, { color: colors.text }]}>{selectName}</Text>
              {dropdownOptions.length !== 1 && (
                <Image
                  source={require("../../../images/setting/formkit_down.png")}
                  style={[styles.dropIcon, { tintColor: colors.text }]}
                  resizeMode="contain"
                />
              )}
            </TouchableOpacity>
          </View>

          {/* 5. Download Button */}
          <LinearGradient
            colors={["#527EFF", "#3366FF"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.downloadBtn}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.downloadBtnInner,
                { opacity: reportLoading || !selectedInvestor ? 0.6 : 1 },
              ]}
              onPress={handleDownload}
              disabled={reportLoading || !selectedInvestor}
            >
              {reportLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Image
                    source={require("../../../images/setting/download.png")}
                    style={styles.downloadIcon}
                    resizeMode="contain"
                  />
                  <Text style={styles.downloadBtnText}>Download Report</Text>
                </>
              )}
            </TouchableOpacity>
          </LinearGradient>

        </View>
      </ScrollView>

      {/* ── Modals ── */}
      <DropdownModal
        visible={showDropdown}
        onClose={() => setShowDropdown(false)}
        data={dropdownOptions}
        loading={loading}
        colors={colors}
        mode={mode}
        onSelect={handleInvestorSelect}
      />
      <DatePickerModal
        visible={showFromPicker}
        onClose={() => setShowFromPicker(false)}
        onConfirm={setFromDate}
        colors={colors}
        mode={mode}
      />
      <DatePickerModal
        visible={showToPicker}
        onClose={() => setShowToPicker(false)}
        onConfirm={setToDate}
        colors={colors}
        mode={mode}
      />
    </View>
  );
};

export default ReportsScreen;

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: hp(61),
    marginTop: hp(50),
    paddingHorizontal: wp(10),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backContainer: { width: wp(41), height: wp(41), justifyContent: "center", alignItems: "center" },
  backIcon: { width: wp(19), height: wp(19) },
  title: { fontSize: wp(24), fontFamily: "Urbanist-SemiBold" },

  tabsWrapper: { marginBottom: hp(40) },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: wp(17),
    paddingTop: hp(10),
  },
  gridItem: {
    width: "48%",
    height: hp(40),
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    marginBottom: hp(10),
  },
  chipText: { fontSize: wp(12), fontFamily: "Urbanist-Medium" },

  filterSection: { paddingHorizontal: wp(17), gap: hp(10) },
  selectRow: {
    width: "100%",
    height: hp(45),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1.5,
  },
  selectText: { fontFamily: "Urbanist-Medium", fontSize: wp(16) },
  dropIcon: { width: wp(20), height: wp(20) },

  dateLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp(10),
  },
  dateBoxLabel: { fontFamily: "Urbanist-Medium", fontSize: wp(14), width: wp(150) },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp(5),
  },
  dateBox: {
    width: wp(160),
    height: hp(44),
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: wp(12),
    justifyContent: "center",
  },
  dateBoxInner: { flexDirection: "row", alignItems: "center", gap: wp(8) },
  calendarIcon: { width: wp(21), height: hp(20) },
  dateText: { fontFamily: "Urbanist-Medium", fontSize: wp(14) },

  downloadBtn: {
    width: wp(220),
    height: hp(45),
    borderRadius: 8,
    alignSelf: "center",
    marginTop: hp(30),
  },
  downloadBtnInner: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: wp(10),
  },
  downloadIcon: { width: wp(18), height: wp(18), tintColor: "#FFFFFF" },
  downloadBtnText: { fontFamily: "Urbanist-SemiBold", fontSize: wp(14), color: "#FFFFFF" },
});
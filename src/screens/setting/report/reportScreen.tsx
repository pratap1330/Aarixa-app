import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { wp, hp } from "../../../utils/responcive/responcive";
import { useAppTheme } from "../../../hooks/useTheme";
import { useGet } from "../../../hooks/useGet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNFS from "react-native-fs";
import { Buffer } from "buffer";
import axios from "axios";

import DatePickerModal from "../../../components/customDatePicker";
import DropdownModal from "../../../components/searchableDropdown";

// --- Helpers ---
// --- Helpers ---
const formatToUI = (date: Date): string => {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
};

const isoToUI = (iso: string): string => {
  if (!iso) return "DD/MM/YYYY";
  // Directly split the string to avoid timezone conversion shifting the day
  // "2017-03-15T18:30:00.000Z" -> "2017-03-15"
  const datePart = iso.split("T")[0];
  const [y, m, d] = datePart.split("-");
  return `${d}/${m}/${y}`;
};

const getDayBeforeYesterdayUI = (): string => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return formatToUI(d);
};

const ReportsScreen = () => {
  const [cid, setCid] = useState<string | null>(null);
  const navigation = useNavigation<any>();
  const { colors, mode } = useAppTheme();

  const [expandedTab, setExpandedTab] = useState<string | null>("");
  const [reportLoading, setReportLoading] = useState<Record<string, boolean>>({});

  const [selectName, setSelectName] = useState("Select name");
  const [selectedInvestor, setSelectedInvestor] = useState<any>(null);

  const [fromDate, setFromDate] = useState("DD/MM/YYYY");
  const [toDate, setToDate] = useState(getDayBeforeYesterdayUI());

  const [showDropdown, setShowDropdown] = useState(false);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  useEffect(() => {
    const getCid = async () => {
      const storedCid = await AsyncStorage.getItem("cid");
      if (storedCid) setCid(storedCid);
    };
    getCid();
  }, []);

  const { data, loading } = useGet<any>(`api/reports/family-heads?cid=${cid}`);
  const dropdownOptions: any[] = useMemo(() => data?.result || [], [data]);

  useEffect(() => {
    if (dropdownOptions.length > 0) {
      const investor = dropdownOptions[0];
      setSelectedInvestor(investor);
      setSelectName(investor.investorName);
      if (investor.firstInvestmentDate) {
        setFromDate(isoToUI(investor.firstInvestmentDate));
      }
      setToDate(getDayBeforeYesterdayUI());
    }
  }, [data, dropdownOptions]);

  const tabs = [
    { label: "Portfolio Valuation", iconBg: "#FFF1EB", iconTint: "#F97316" },
    { label: "Portfolio Summary", iconBg: "#F5F3FF", iconTint: "#8B5CF6" },
    { label: "Asset Allocation", iconBg: "#F0FDF4", iconTint: "#22C55E" },
    { label: "Transaction Report", iconBg: "#FFFBEB", iconTint: "#F59E0B" },
    { label: "Capital Gain", iconBg: "#F0FDFA", iconTint: "#14B8A6" },
    { label: "Dividend Report", iconBg: "#FFF1F2", iconTint: "#F43F5E" },
  
  ];

  const handleDownload = async (tabLabel:any) => {
    const base_url = "http://43.224.137.63:9085";
    if (!selectedInvestor) {
      Alert.alert("Error", "Please select investor");
      return;
    }

    const formatForBackend = (dateStr: string) => {
      if (dateStr.includes("/")) {
        const [d, m, y] = dateStr.split("/");
        return `${y}-${m}-${d}`;
      }
      return dateStr;
    };

    const apiToDate = formatForBackend(toDate);
    // if (selectedToDate > limitDate) {
    //   Alert.alert("Validation Error", "To date cannot be greater than day before yesterday");
    //   return;
    // }

    setReportLoading((prev: Record<string, boolean>) => ({ ...prev, [tabLabel]: true }));
    const { fhid, cid: investorCid } = selectedInvestor;
    const dateFilterType = expandedTab === "Portfolio Valuation" ? "SINCE_INCEPTION" : "CUSTOM";
    const dateParams = `&fromDate=${formatForBackend(fromDate)}&toDate=${apiToDate}`;

    let url = "";
    if (expandedTab === "Portfolio Valuation")
      url = `/api/reports/valuation-pdf?isSummary=0&fhid=${fhid}&cid=${investorCid}&dateFilterType=${dateFilterType}${dateParams}`;
    else if (expandedTab === "Portfolio Summary")
      url = `/api/reports/valuation-pdf?isSummary=1&fhid=${fhid}&cid=${investorCid}&dateFilterType=${dateFilterType}${dateParams}`;
    else if (expandedTab === "Transaction Report")
      url = `/api/reports/getTransactionReport-pdf?fhid=${fhid}&cid=${investorCid}&dateFilterType=${dateFilterType}${dateParams}`;
    else {    setReportLoading(prev => ({ ...prev, [tabLabel]: false }));
      Alert.alert("Error", "API not implemented");
      return;
    }

    try {
      const response = await axios.post(base_url + url, {}, {
        responseType: "arraybuffer",
        headers: { 'Accept': 'application/pdf' }
      });

      const contentType = response.headers['content-type'];
      if (contentType && contentType.includes('application/json')) {
        const responseData = JSON.parse(Buffer.from(response.data).toString());
        setReportLoading((prev: Record<string, boolean>) => ({ ...prev, [tabLabel]: false }));
        Alert.alert("Error", responseData.message || "Request failed");
        return;
      }

      const fileName = `${expandedTab?.replace(/\s+/g, "_")}_${Date.now()}.pdf`;
      const filePath = Platform.OS === "android"
        ? `${RNFS.DownloadDirectoryPath}/${fileName}`
        : `${RNFS.DocumentDirectoryPath}/${fileName}`;
      const base64Data = Buffer.from(response.data).toString("base64");
      await RNFS.writeFile(filePath, base64Data, "base64");
      if (Platform.OS === "android") await RNFS.scanFile(filePath);
    setReportLoading((prev: Record<string, boolean>) => ({ ...prev, [tabLabel]: false }));
      Alert.alert(
        "Download Complete",
        "Your report has been saved successfully in the Downloads folder.",
        [{ text: "OK" }]
      );
    } catch {
       setReportLoading((prev: Record<string, boolean>) => ({ ...prev, [tabLabel]: false }));
      Alert.alert("Error", "Check server or internet connection.");
    }
  };

  const renderTab = (tab: typeof tabs[0]) => {
    const isExpanded = expandedTab === tab.label;
    const isValuation = tab.label === "Portfolio Valuation";

    const expandedHeight = isValuation ? hp(200) : hp(315);
    const collapsedHeight = hp(50);

    return (
      <View
        key={tab.label}
        style={[
          styles.accordionCard,
          {
            backgroundColor: mode === "dark" ? "#1E1E1E" : "#FFFFFF",
            height: isExpanded ? expandedHeight : collapsedHeight,
            borderRadius: isExpanded ? wp(25) : wp(10),
            borderColor: mode === "dark" ? "#333" : "#E5E7EB",
          },
        ]}
      >
        <TouchableOpacity
          style={styles.headerRow}
          onPress={() => setExpandedTab(isExpanded ? null : tab.label)}
          activeOpacity={0.7}
        >
          <View style={styles.headerLeft}>
            <View style={[styles.iconWrapper, { backgroundColor: tab.iconBg }]}>
              <Image
                source={require("../../../images/setting/reportimage.png")}
                style={[styles.reportIcon, { tintColor: tab.iconTint }]}
              />
            </View>
            <Text style={[styles.headerTitle, { color: colors.text }]}>{tab.label}</Text>
          </View>
          <Image
            source={require("../../../images/setting/formkit_down.png")}
            style={[
              styles.chevron,
              {
                transform: [{ rotate: isExpanded ? "180deg" : "0deg" }],
                tintColor: colors.text,
              },
            ]}
          />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.expandedContent}>
            <View style={styles.separator} />

            <TouchableOpacity
              style={[styles.selectNameRow, { borderBottomColor: colors.primary }]}
              onPress={() => setShowDropdown(true)}
            >
              <Text style={[styles.selectNameText, { color: colors.text }]}>
                {selectName}
              </Text>
              <Image
                source={require("../../../images/setting/formkit_down.png")}
                style={[ { tintColor: colors.text }]}
              />
            </TouchableOpacity>

            {!isValuation && (
              <>
                <View style={styles.dateLabelRow}>
                  <Text style={styles.dateLabel}>From Date</Text>
                  <Text style={styles.dateLabel}>To Date</Text>
                </View>
                <View style={styles.dateInputRow}>
                  <TouchableOpacity
                    style={[styles.dateBox, { borderColor: colors.primarySoft }]}
                    onPress={() => setShowFromPicker(true)}
                  >
                    <Image
                      source={require("../../../images/setting/calendar.png")}
                      style={[styles.calIcon, { tintColor: colors.primary }]}
                    />
                    <Text style={[styles.dateVal, { color: colors.text }]}>
                      {fromDate}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.dateBox, { borderColor: colors.primarySoft }]}
                    onPress={() => setShowToPicker(true)}
                  >
                    <Image
                      source={require("../../../images/setting/calendar.png")}
                      style={[styles.calIcon, { tintColor: colors.primary }]}
                    />
                    <Text style={[styles.dateVal, { color: colors.text }]}>
                      {toDate}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            <LinearGradient
              colors={[colors.primary, colors.primaryDark]}
              style={[
                styles.downloadBtn,
                isValuation && { marginTop: hp(20) },
              ]}
            >
              <TouchableOpacity
                style={styles.downloadBtnInner}
                onPress={() => handleDownload(tab.label)}
               disabled={reportLoading[tab.label]}
              >
                {reportLoading[tab.label] ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Image
                      source={require("../../../images/setting/download.png")}
                      style={styles.dlIcon}
                    />
                    <Text style={styles.dlText}>Download Report</Text>
                  </>
                )}
              </TouchableOpacity>
            </LinearGradient>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Image
            source={require("../../../images/loginImage/back_arrow.png")}
            style={[styles.backIcon, mode === "dark" && { tintColor: "#FFF" }]}
          />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Reports</Text>
        <View style={{ width: wp(40) }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {tabs.map(renderTab)}
      </ScrollView>

      <DropdownModal
        visible={showDropdown}
        onClose={() => setShowDropdown(false)}
        data={dropdownOptions}
        loading={loading}
        colors={colors}
        mode={mode}
        onSelect={(item) => {
          setSelectName(item.investorName);
          setSelectedInvestor(item);
          if (item.firstInvestmentDate) setFromDate(isoToUI(item.firstInvestmentDate));
        }}
      />
      <DatePickerModal
        visible={showFromPicker}
        onClose={() => setShowFromPicker(false)}
        onConfirm={(date: string) => setFromDate(date)}
        colors={colors}
        mode={mode}
      />
      <DatePickerModal
        visible={showToPicker}
        onClose={() => setShowToPicker(false)}
        onConfirm={(date: string) => setToDate(date)}
        colors={colors}
        mode={mode}
      />
    </View>
  );
};

export default ReportsScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    marginTop: hp(70),
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(16),
    marginBottom: hp(10),
  },
  backBtn: { width: wp(40), height: wp(40), justifyContent: "center" },
  backIcon: { width: wp(20), height: wp(20), resizeMode: "contain" },
  title: { fontSize: wp(24), fontFamily: "Urbanist-SemiBold" },
  scrollContent: {
    paddingHorizontal: wp(16),
    paddingBottom: hp(40),
    gap: hp(12),
    marginTop: hp(20),
  },

  accordionCard: {
    width: wp(358),
    alignSelf: "center",
    borderWidth: 1,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerRow: {
    height: hp(50),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(11),
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: wp(10) },
  iconWrapper: {
    width: wp(35),
    height: wp(35),
    borderRadius: wp(8),
    justifyContent: "center",
    alignItems: "center",
  },
  reportIcon: { width: wp(19), height: wp(19), resizeMode: "contain" },
  headerTitle: { fontFamily: "Urbanist-SemiBold", fontSize: wp(16) },
  chevron: { width: wp(24), height: wp(24), resizeMode: "contain" },

  expandedContent: { paddingHorizontal: wp(11), flex: 1 },
  separator: {
    height: 1,
    backgroundColor: "#F3F4F6",
    width: "100%",
    marginBottom: hp(15),
  },

  selectNameRow: {
    width: wp(338),
    height: hp(35),
    borderBottomWidth: 1,
    borderBottomColor: "#3366FF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: hp(15),
  },
  selectNameText: { fontFamily: "Urbanist-Medium", fontSize: wp(16) },
  dropIcon: { width: wp(16), height: wp(16) },

  dateLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hp(5),
  },
  dateLabel: {
    fontFamily: "Urbanist-Medium",
    fontSize: wp(14),
    color: "#6B7280",
    width: wp(150),
  },
  dateInputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hp(25),
  },
  dateBox: {
    width: wp(160),
    height: hp(44),
    borderRadius: wp(10),
    borderWidth: 1,
    borderColor: "#D1D5DB",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(10),
    gap: wp(8),
  },
  calIcon: { width: wp(20), height: wp(20), tintColor: "#3366FF" },
  dateVal: { fontFamily: "Urbanist-Medium", fontSize: wp(14) },

  downloadBtn: {
    width: wp(195),
    height: hp(35),
    borderRadius: wp(8),
    alignSelf: "center",
  },
  downloadBtnInner: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: wp(8),
  },
  dlIcon: { width: wp(16), height: wp(16), tintColor: "#FFF" },
  dlText: { color: "#FFF", fontFamily: "Urbanist-SemiBold", fontSize: wp(14) },
});

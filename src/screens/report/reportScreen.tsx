import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { wp, hp } from "../../utils/responcive/responcive";
import { useAppTheme } from "../../hooks/useTheme";

// ─── Date Picker Modal ────────────────────────────────────────────────────────
const DAYS   = Array.from({ length: 31 }, (_, i) => i + 1);
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const YEARS  = Array.from({ length: 11 }, (_, i) => 2020 + i);

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
  const [day,   setDay]   = useState(1);
  const [month, setMonth] = useState(1);
  const [year,  setYear]  = useState(2025);

  const cardBg   = mode === "dark" ? "#1E1E1E" : "#FFFFFF";
  const textColor = colors.text;
  const accent   = "#3366FF";

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
      <Text style={[pickerStyles.colLabel, { color: mode === "dark" ? "#888" : "#9E9E9E" }]}>{label}</Text>
      <ScrollView
        style={pickerStyles.scroll}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        {data.map((item, idx) => {
          const val    = idx + 1;
          const active = selected === val;
          return (
            <TouchableOpacity
              key={idx}
              onPress={() => onSelect(val)}
              style={[pickerStyles.item, active && { backgroundColor: accent + "22", borderRadius: 8 }]}
            >
              <Text style={[
                pickerStyles.itemText,
                { color: active ? accent : textColor },
                active && { fontFamily: "Urbanist-Bold" },
              ]}>
                {typeof item === "number" ? String(item).padStart(2, "0") : item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  // Year column needs different index mapping
  const YearColumn = () => (
    <View style={pickerStyles.col}>
      <Text style={[pickerStyles.colLabel, { color: mode === "dark" ? "#888" : "#9E9E9E" }]}>Year</Text>
      <ScrollView style={pickerStyles.scroll} showsVerticalScrollIndicator={false} nestedScrollEnabled>
        {YEARS.map((y, idx) => {
          const active = year === y;
          return (
            <TouchableOpacity
              key={idx}
              onPress={() => setYear(y)}
              style={[pickerStyles.item, active && { backgroundColor: accent + "22", borderRadius: 8 }]}
            >
              <Text style={[
                pickerStyles.itemText,
                { color: active ? accent : textColor },
                active && { fontFamily: "Urbanist-Bold" },
              ]}>
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
    onConfirm(`${d}/${m}/${year}`);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={pickerStyles.overlay}>
        <View style={[pickerStyles.sheet, { backgroundColor: cardBg }]}>
          <Text style={[pickerStyles.title, { color: textColor }]}>Select Date</Text>

          <View style={pickerStyles.columns}>
            <Column data={DAYS}   selected={day}   onSelect={setDay}   label="Day"   />
            <View style={[pickerStyles.dividerV, { backgroundColor: mode === "dark" ? "#333" : "#E0E0E0" }]} />
            <Column data={MONTHS} selected={month} onSelect={setMonth} label="Month" />
            <View style={[pickerStyles.dividerV, { backgroundColor: mode === "dark" ? "#333" : "#E0E0E0" }]} />
            <YearColumn />
          </View>

          <TouchableOpacity style={[pickerStyles.confirmBtn, { backgroundColor: accent }]} onPress={handleConfirm} activeOpacity={0.8}>
            <Text style={pickerStyles.confirmText}>Confirm</Text>
          </TouchableOpacity>
          <TouchableOpacity style={pickerStyles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
            <Text style={[pickerStyles.cancelText, { color: mode === "dark" ? "#AAA" : "#888" }]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const pickerStyles = StyleSheet.create({
  overlay:     { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  sheet:       { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: wp(20), paddingBottom: hp(36) },
  title:       { fontFamily: "Urbanist-SemiBold", fontSize: wp(17), textAlign: "center", marginBottom: hp(16) },
  columns:     { flexDirection: "row", justifyContent: "space-around", alignItems: "flex-start" },
  col:         { flex: 1, alignItems: "center" },
  colLabel:    { fontFamily: "Urbanist-Medium", fontSize: wp(12), marginBottom: hp(6) },
  scroll:      { height: hp(160) },
  item:        { height: hp(40), justifyContent: "center", alignItems: "center", paddingHorizontal: wp(8), marginVertical: 1 },
  itemText:    { fontFamily: "Urbanist-Medium", fontSize: wp(15) },
  dividerV:    { width: 1, height: hp(160) },
  confirmBtn:  { borderRadius: 8, paddingVertical: hp(12), alignItems: "center", marginTop: hp(16) },
  confirmText: { fontFamily: "Urbanist-SemiBold", fontSize: wp(15), color: "#FFFFFF" },
  cancelBtn:   { paddingVertical: hp(10), alignItems: "center" },
  cancelText:  { fontFamily: "Urbanist-Medium", fontSize: wp(14) },
});

// ─── Dropdown Modal ───────────────────────────────────────────────────────────
const DropdownModal = ({
  visible,
  onClose,
  options,
  onSelect,
  colors,
  mode,
}: {
  visible: boolean;
  onClose: () => void;
  options: string[];
  onSelect: (v: string) => void;
  colors: any;
  mode: string;
}) => {
  const cardBg = mode === "dark" ? "#1E1E1E" : "#FFFFFF";
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={dropStyles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={[dropStyles.menu, { backgroundColor: cardBg }]}>
          {options.map((opt, idx) => (
            <React.Fragment key={idx}>
              <TouchableOpacity
                style={dropStyles.item}
                activeOpacity={0.7}
                onPress={() => { onSelect(opt); onClose(); }}
              >
                <Text style={[dropStyles.itemText, { color: colors.text }]}>{opt}</Text>
              </TouchableOpacity>
              {idx < options.length - 1 && (
                <View style={[dropStyles.sep, { backgroundColor: mode === "dark" ? "#333" : "#F0F0F0" }]} />
              )}
            </React.Fragment>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const dropStyles = StyleSheet.create({
  overlay:  { flex: 1, backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "center", paddingHorizontal: wp(20) },
  menu:     { borderRadius: 12, paddingVertical: hp(8), shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 10, elevation: 8 },
  item:     { paddingHorizontal: wp(16), paddingVertical: hp(14) },
  itemText: { fontFamily: "Urbanist-Medium", fontSize: wp(15) },
  sep:      { height: 1, marginHorizontal: wp(16) },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
const ReportsScreen = () => {
  const navigation = useNavigation<any>();
  const { colors, mode } = useAppTheme();

  const [selected,      setSelected]      = useState("Portfolio Valuation");
  const [selectName,    setSelectName]    = useState("Select name");
  const [fromDate,      setFromDate]      = useState("DD / MM / YYYY");
  const [toDate,        setToDate]        = useState("DD / MM / YYYY");
  const [showDropdown,  setShowDropdown]  = useState(false);
  const [showFromPicker,setShowFromPicker]= useState(false);
  const [showToPicker,  setShowToPicker]  = useState(false);

  const cardBg    = mode === "dark" ? "#1E1E1E" : "#FFFFFF";
  const borderCol = mode === "dark" ? "#3A3A3A" : "#D1D5DB";
  const labelCol  = mode === "dark" ? "#888888" : "#000000";

  const tabs = [
    { label: "Portfolio Valuation", color: "#22C55E" },
    { label: "Portfolio Summary",   color: "#E6A928" },
    { label: "Assets Allocation",   color: "#8657D9" },
    { label: "Transaction Reports", color: "#E75480" },
    { label: "Capital Gain",        color: "#13A6A1" },
    { label: "Dividend Report",     color: "#527EFF" },
  ];

  const dropdownOptions = tabs.map(t => t.label);
  const isPlaceholder  = fromDate === "DD / MM / YYYY";
  const isPlaceholderT = toDate   === "DD / MM / YYYY";

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backContainer}>
          <Image
            source={require("../../images/loginImage/back_arrow.png")}
            style={[styles.backIcon, mode === "dark" && { tintColor: "#FFFFFF" }]}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Reports</Text>
        <View style={{ width: wp(41) }} />
      </View>

      {/* Scrollable Tabs */}
      <View style={styles.tabsWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} bounces={false} contentContainerStyle={styles.chipContainer}>
          {tabs.map((tab, index) => {
            const isActive = selected === tab.label;
            return (
              <TouchableOpacity
                key={index}
                onPress={() => setSelected(tab.label)}
                style={[styles.chip, { backgroundColor: isActive ? tab.color : "transparent", borderColor: tab.color }]}
              >
                <Text style={[styles.chipText, { color: isActive ? "#FFFFFF" : tab.color }]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Filter Section */}
      <View style={styles.filterSection}>

        {/* Select name dropdown */}
        <TouchableOpacity
          style={[styles.selectRow, { borderBottomColor: mode === "dark" ? "#527EFF" : "#3366FF" }]}
          activeOpacity={0.7}
          onPress={() => setShowDropdown(true)}
        >
          <Text style={[styles.selectText, { color: colors.text }]}>{selectName}</Text>
          <Image
            source={require("../../images/setting/formkit_down.png")}
            style={[styles.dropIcon, { tintColor: colors.text }]}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Date labels */}
        <View style={styles.dateLabelRow}>
          <Text style={[styles.dateBoxLabel, { color: labelCol }]}>From Date</Text>
          <Text style={[styles.dateBoxLabel, { color: labelCol }]}>To Date</Text>
        </View>

        {/* Date boxes */}
        <View style={styles.dateRow}>

          {/* From Date */}
          <TouchableOpacity
            style={[styles.dateBox, { backgroundColor: cardBg, borderColor: borderCol }]}
            activeOpacity={0.7}
            onPress={() => setShowFromPicker(true)}
          >
            <View style={styles.dateBoxInner}>
              <Image
                source={require("../../images/setting/calendar.png")}
                style={[styles.calendarIcon, { tintColor: "#007AFF" }]}
                resizeMode="contain"
              />
              <Text style={[styles.dateText, { color: isPlaceholder ? (mode === "dark" ? "#555" : "#BBBBBB") : colors.text }]}>
                {fromDate}
              </Text>
            </View>
          </TouchableOpacity>

          {/* To Date */}
          <TouchableOpacity
            style={[styles.dateBox, { backgroundColor: cardBg, borderColor: borderCol }]}
            activeOpacity={0.7}
            onPress={() => setShowToPicker(true)}
          >
            <View style={styles.dateBoxInner}>
              <Image
                source={require("../../images/setting/calendar.png")}
                style={[styles.calendarIcon, { tintColor: "#007AFF" }]}
                resizeMode="contain"
              />
              <Text style={[styles.dateText, { color: isPlaceholderT ? (mode === "dark" ? "#555" : "#BBBBBB") : colors.text }]}>
                {toDate}
              </Text>
            </View>
          </TouchableOpacity>

        </View>

        {/* Download Report Button */}
        <LinearGradient
          colors={["#527EFF", "#3366FF"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.downloadBtn}
        >
          <TouchableOpacity activeOpacity={0.8} style={styles.downloadBtnInner}>
            <Image
              source={require("../../images/setting/download.png")}
              style={styles.downloadIcon}
              resizeMode="contain"
            />
            <Text style={styles.downloadBtnText}>Download Report</Text>
          </TouchableOpacity>
        </LinearGradient>

      </View>

      {/* Modals */}
      <DropdownModal
        visible={showDropdown}
        onClose={() => setShowDropdown(false)}
        options={dropdownOptions}
        onSelect={setSelectName}
        colors={colors}
        mode={mode}
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
  container: {
    flex: 1,
  },

  header: {
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
    justifyContent: "center",
    alignItems: "center",
  },

  backIcon: {
    width: wp(19),
    height: wp(19),
  },

  title: {
    fontSize: wp(24),
    fontFamily: "Urbanist-SemiBold",
  },

  tabsWrapper: {
    height: hp(50),
  },

  chipContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(17),
    gap: wp(8),
  },

  chip: {
    height: hp(35),
    paddingHorizontal: wp(14),
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
  },

  chipText: {
    fontSize: wp(12),
    fontFamily: "Urbanist-Medium",
  },

  // ── Filter section
  filterSection: {
    paddingHorizontal: wp(17),
    paddingTop: hp(16),
    gap: hp(14),
  },

  selectRow: {
    width: wp(356),
    height: hp(35),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1.5,
    paddingBottom: hp(8),
  },

  selectText: {
    fontFamily: "Urbanist-Medium",
    fontSize: wp(16),
    lineHeight: wp(16) * 1.25,
  },

  dropIcon: {
    width: wp(20),
    height: wp(20),
  },

  dateLabelRow: {
    width: wp(353),
    flexDirection: "row",
    paddingTop :24,
    justifyContent: "space-between",
  },

  dateBoxLabel: {
    fontFamily: "Urbanist-Medium",
    fontSize: wp(14),
    width: wp(150),
  },

  dateRow: {
    width: wp(353),
    flexDirection: "row",
    justifyContent: "space-between",
  },

  dateBox: {
    width: wp(150),
    height: hp(44),
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: wp(12),
    justifyContent: "center",
  },

  dateBoxInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(8),
  },

  calendarIcon: {
    width: wp(21),
    height: hp(20),
  },

  dateText: {
    fontFamily: "Urbanist-Medium",
    fontSize: wp(16),
    flex: 1,
  },

  downloadBtn: {
    width: wp(203),
    height: hp(35),
    borderRadius: 8,
    alignSelf: "center",
    marginTop: hp(8),
  },

  downloadBtnInner: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: wp(10),
  },

  downloadIcon: {
    width: wp(18),
    height: wp(18),
    tintColor: "#FFFFFF",
  },

  downloadBtnText: {
    fontFamily: "Urbanist-SemiBold",
    fontSize: wp(14),
    color: "#FFFFFF",
  },
});

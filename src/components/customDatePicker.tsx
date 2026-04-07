import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from "react-native";
import { wp, hp } from "../utils/responcive/responcive";

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const YEARS = Array.from({ length: 11 }, (_, i) => 2020 + i);

interface DatePickerProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (date: string) => void;
  colors: any;
  mode: string;
}

const DatePickerModal = ({ visible, onClose, onConfirm, colors, mode }: DatePickerProps) => {
  const [day, setDay] = useState(1);
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(2025);

  const cardBg = mode === "dark" ? "#1E1E1E" : "#FFFFFF";
  const textColor = colors.text;
  const accent = "#3366FF";

  const Column = ({ data, selected, onSelect, label }: any) => (
    <View style={pickerStyles.col}>
      <Text style={[pickerStyles.colLabel, { color: mode === "dark" ? "#888" : "#9E9E9E" }]}>
        {label}
      </Text>
      <ScrollView style={pickerStyles.scroll} showsVerticalScrollIndicator={false} nestedScrollEnabled>
        {data.map((item: any, idx: number) => {
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
            
            <View style={pickerStyles.col}>
              <Text style={[pickerStyles.colLabel, { color: mode === "dark" ? "#888" : "#9E9E9E" }]}>Year</Text>
              <ScrollView style={pickerStyles.scroll} showsVerticalScrollIndicator={false} nestedScrollEnabled>
                {YEARS.map((y, idx) => {
                  const active = year === y;
                  return (
                    <TouchableOpacity key={idx} onPress={() => setYear(y)} style={[pickerStyles.item, active && { backgroundColor: accent + "22", borderRadius: 8 }]}>
                      <Text style={[pickerStyles.itemText, { color: active ? accent : textColor }, active && { fontFamily: "Urbanist-Bold" }]}>
                        {y}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
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

export default DatePickerModal;

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
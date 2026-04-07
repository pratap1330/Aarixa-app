import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, TextInput, ActivityIndicator } from "react-native";
import { wp, hp } from "../utils/responcive/responcive";

interface DropdownProps {
  visible: boolean;
  onClose: () => void;
  data: any[];
  onSelect: (item: any) => void;
  colors: any;
  mode: string;
  loading: boolean;
}

const DropdownModal = ({ visible, onClose, data, onSelect, colors, mode, loading }: DropdownProps) => {
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
            placeholderTextColor={mode === "dark" ? "#888" : "#999"}
            value={search}
            onChangeText={setSearch}
            style={[dropStyles.searchInput, { color: colors.text, borderBottomColor: mode === "dark" ? "#333" : "#EEE" }]}
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
                visibleCount < filteredData.length ? <ActivityIndicator style={{ margin: 10 }} /> : null
              }
            />
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default DropdownModal;

const dropStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "center", paddingHorizontal: wp(20) },
  menu: { borderRadius: 12, paddingVertical: hp(8), shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 10, elevation: 8 },
  searchInput: { padding: 12, borderBottomWidth: 1, fontFamily: "Urbanist-Medium", fontSize: wp(15) },
  item: { paddingHorizontal: wp(16), paddingVertical: hp(14) },
  itemText: { fontFamily: "Urbanist-Medium", fontSize: wp(15) },
});
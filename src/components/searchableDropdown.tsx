import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  FlatList, 
  ActivityIndicator 
} from "react-native";
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
  // Pure list logic with lazy loading for performance
  const [visibleCount, setVisibleCount] = useState(20);
  const visibleData = data ? data.slice(0, visibleCount) : [];

  const loadMore = () => {
    if (visibleCount < data.length) {
      setVisibleCount((prev) => prev + 20);
    }
  };

  const cardBg = mode === "dark" ? "#1E1E1E" : "#FFFFFF";

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={dropStyles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={[dropStyles.menu, { backgroundColor: cardBg, maxHeight: "60%" }]}>
          <Text style={[dropStyles.modalTitle, { color: colors.text, borderBottomColor: mode === "dark" ? "#333" : "#F3F4F6" }]}>
            Select Investor
          </Text>
          
          {loading ? (
            <ActivityIndicator style={{ marginVertical: hp(20) }} color={colors.primary} />
          ) : (
            <FlatList
              data={visibleData}
              keyExtractor={(_, i) => i.toString()}
              onEndReached={loadMore}
              onEndReachedThreshold={0.5}
              showsVerticalScrollIndicator={true}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    dropStyles.item, 
                    { borderBottomColor: mode === "dark" ? "#333" : "#F3F4F6" }
                  ]}
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
            />
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default DropdownModal;

const dropStyles = StyleSheet.create({
  overlay: { 
    flex: 1, 
    backgroundColor: "rgba(0,0,0,0.5)", 
    justifyContent: "center", 
    paddingHorizontal: wp(40) 
  },
  menu: { 
    borderRadius: 12, 
    paddingVertical: hp(10), 
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5
  },
  modalTitle: {
    fontFamily: "Urbanist-Bold",
    fontSize: wp(18),
    textAlign: 'center',
    paddingVertical: hp(12),
    borderBottomWidth: 1,
  },
  item: { 
    paddingHorizontal: wp(20), 
    paddingVertical: hp(16),
    borderBottomWidth: 1
  },
  itemText: { 
    fontFamily: "Urbanist-Medium", 
    fontSize: wp(16) 
  },
});
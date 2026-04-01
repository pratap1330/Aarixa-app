import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  StatusBar,
  Animated,
  Easing,
} from "react-native";
import { useAppTheme } from "../../hooks/useTheme";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BASE_WIDTH = 390;
const BASE_HEIGHT = 977;

const scaleW = (size: number) => (SCREEN_WIDTH / BASE_WIDTH) * size;
const scaleH = (size: number) => (SCREEN_HEIGHT / BASE_HEIGHT) * size;
const scaleFont = (size: number) => Math.round((SCREEN_WIDTH / BASE_WIDTH) * size);

// ─── Types ───────────────────────────────────────────────────────────────────

type TransactionStatus = "success" | "failed" | "processing";

interface Transaction {
  id: string;
  fundName: string;
  transactionDate: string;
  transactionType: string;
  amount: string;
  nav: string;
  units: string;
  status: TransactionStatus;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  transactions?: Transaction[];
}

// ─── Status badge colours ─────────────────────────────────────────────────────

const STATUS_COLORS: Record<TransactionStatus, { bg: string; text: string }> = {
  success: { bg: "#4CFF0026", text: "#1AAD00" },
  failed: { bg: "#FF000026", text: "#CC0000" },
  processing: { bg: "#FF840026", text: "#C05E00" },
};

// ─── Sample / demo data ───────────────────────────────────────────────────────

const DEMO_TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    fundName: "SBI Equity - Hybrid Fund - Direct Growth",
    transactionDate: "12 Jan 2025",
    transactionType: "Purchase",
    amount: "₹14,12,780",
    nav: "₹45.23",
    units: "312.45",
    status: "success",
  },
  {
    id: "2",
    fundName: "HDFC Mid-Cap Opportunities Fund - Direct",
    transactionDate: "08 Jan 2025",
    transactionType: "Redemption",
    amount: "₹2,50,000",
    nav: "₹89.67",
    units: "27.88",
    status: "failed",
  },
  {
    id: "3",
    fundName: "Axis Long Term Equity Fund - Direct Growth",
    transactionDate: "05 Jan 2025",
    transactionType: "SIP",
    amount: "₹5,000",
    nav: "₹72.14",
    units: "69.32",
    status: "processing",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const LabelValue: React.FC<{
  label: string;
  value: string;
  valueStyle?: object;
}> = ({ label, value, valueStyle }) => (
  <View style={card.labelValueContainer}>
    <Text style={card.label}>{label}</Text>
    <Text style={[card.value, valueStyle]}>{value}</Text>
  </View>
);

const StatusBadge: React.FC<{ status: TransactionStatus }> = ({ status }) => {
  const { bg, text } = STATUS_COLORS[status];
  const label =
    status === "success"
      ? "Success"
      : status === "failed"
      ? "Failed"
      : "Processing";

  return (
    <View style={[card.badge, { backgroundColor: bg }]}>
      <Text style={[card.badgeText, { color: text }]}>{label}</Text>
    </View>
  );
};

const TransactionCard: React.FC<{ item: Transaction }> = ({ item }) => {
  const { colors, mode } = useAppTheme();
  const cardBg      = mode === "dark" ? "#1E1E1E" : "#FFFFFF";
  const cardBorder  = mode === "dark" ? "#333333" : "#EEEEEE";
  const dividerBg   = mode === "dark" ? "#2A2A2A" : "#F0F0F0";
  const valueColor  = { color: colors.text };

  return (
    <View style={[card.container, { backgroundColor: cardBg, borderColor: cardBorder }]}>
      {/* ── Header row: fund icon + fund name ── */}
      <View style={card.headerRow}>
        <Image
          source={require("../../images/dashboard/sbi.png")}
          style={card.fundIcon}
          resizeMode="contain"
        />
        <Text style={[card.fundName, valueColor]} numberOfLines={1} ellipsizeMode="tail">
          {item.fundName}
        </Text>
      </View>

      {/* ── Divider ── */}
      <View style={[card.divider, { backgroundColor: dividerBg }]} />

      {/* ── Row 1: Trans. Date | Tran. Type ── */}
      <View style={card.dataRow}>
        <LabelValue label="Trans. Date" value={item.transactionDate} valueStyle={valueColor} />
        <LabelValue label="Tran. Type" value={item.transactionType} valueStyle={valueColor} />
      </View>

      <View style={card.dataRow}>
        <LabelValue label="Amount" value={item.amount} valueStyle={valueColor} />
        <LabelValue label="NAV" value={item.nav} valueStyle={valueColor} />
      </View>

      {/* ── Row 3: Units | Status badge ── */}
      <View style={card.dataRow}>
        <LabelValue label="Units" value={item.units} valueStyle={valueColor} />
        <StatusBadge status={item.status} />
      </View>
    </View>
  );
};



const TransactionModal: React.FC<Props> = ({
  visible,
  onClose,
  transactions = DEMO_TRANSACTIONS,
}) => {
  const { colors, mode } = useAppTheme();
  const sheetBg = mode === "dark" ? "#1E1E1E" : "#FAFAFA";
  const titleColor = mode === "dark" ? "#FFFFFF" : "#000000";

  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Reset to bottom before every open — ensures clean start on repeat opens
      translateY.setValue(SCREEN_HEIGHT);
      overlayOpacity.setValue(0);

      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 440,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 360,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT,
          duration: 320,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 280,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <StatusBar translucent backgroundColor="transparent" />

      <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
        <Animated.View
          style={[
            styles.sheet,
            { backgroundColor: sheetBg, transform: [{ translateY }] },
          ]}
        >
          {/* ── Drag handle ── */}
          <View style={styles.handle} />

          {/* ── Title row ── */}
          <View style={styles.titleRow}>
            <View style={styles.titleSpacer} />

            <Text style={[styles.title, { color: titleColor }]}>
              Transactions Overview
            </Text>

            {/* Close button */}
            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, { backgroundColor: mode === "dark" ? "#2A2A2A" : "#FFFFFF" }]}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Image
                source={require("../../images/dashboard/close.png")}
                style={[styles.closeIcon, mode === "dark" && { tintColor: "#FFFFFF" }]}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {/* ── Cards list ── */}
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {transactions.length === 0 ? (
              <Text style={[styles.emptyText, { color: colors.text }]}>
                No transactions available
              </Text>
            ) : (
              transactions.map((item) => (
                <TransactionCard key={item.id} item={item} />
              ))
            )}
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default TransactionModal;


const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    borderTopLeftRadius: scaleW(25),
    borderTopRightRadius: scaleW(25),
    paddingTop: scaleH(50),
    paddingHorizontal: scaleW(19),
    paddingBottom: scaleH(30),
  },
  handle: {
    width: scaleW(40),
    height: scaleH(5),
    borderRadius: 10,
    // backgroundColor: "#CCCCCC",
    alignSelf: "center",
    marginBottom: scaleH(16),
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: scaleH(24),
    height: scaleH(35),
  },
  titleSpacer: {
    width: scaleW(35),
  },
  title: {
    fontFamily: "Urbanist-SemiBold",
    fontSize: scaleFont(20),
    fontWeight: "600",
    letterSpacing: -0.4,
    lineHeight: scaleFont(20),
    textAlign: "center",
    flex: 1,
  },
  closeBtn: {
    width: scaleW(35),
    height: scaleW(35),
    borderRadius: scaleW(50),
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: scaleW(5),
    shadowColor: "#EEEEEE",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: scaleW(20),
    elevation: 4,
  },
  closeIcon: {
    width: scaleW(80),
    height: scaleW(80),
  },
  scrollContent: {
    gap: scaleH(15),
    paddingBottom: scaleH(10),
  },
  emptyText: {
    fontFamily: "Urbanist-Regular",
    fontSize: scaleFont(14),
    textAlign: "center",
    marginTop: scaleH(40),
  },
});

// ─── Card styles (separate StyleSheet for clarity) ────────────────────────────

const card = StyleSheet.create({
  container: {
    width: scaleW(357),
    alignSelf: "center",
    borderRadius: scaleW(25),
    borderWidth: 1,
    borderColor: "#EEEEEE",
    paddingTop: scaleH(15),
    paddingRight: scaleW(14),
    paddingBottom: scaleH(15),
    paddingLeft: scaleW(14),
    backgroundColor: "#FFFFFF",
    shadowColor: "#EEEEEE",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: scaleW(27),
    elevation: 6,
    gap: scaleH(10),
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    width: scaleW(352),
    height: scaleH(35),
    gap: scaleW(10),
  },
  fundIcon: {
    width: scaleW(35),
    // height: scaleH(35),
      height: scaleW(35),
    borderRadius: scaleW(35) / 2,
  },
  fundName: {
    flex: 1,
    fontFamily: "Urbanist-SemiBold",
    fontWeight: "600",
    fontSize: scaleFont(16),
    color: "#000000",
    lineHeight: scaleFont(16),
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: scaleH(4),
  },
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: scaleW(296),
  },
  labelValueContainer: {
    gap: scaleH(5),
  },
  label: {
    fontFamily: "Urbanist-SemiBold",
    fontWeight: "600",
    fontSize: scaleFont(12),
    color: "#878787",
    lineHeight: scaleFont(12),
  },
  value: {
    fontFamily: "Urbanist-SemiBold",
    fontWeight: "600",
    fontSize: scaleFont(14),
    color: "#000000",
    lineHeight: scaleFont(14),
  },
  badge: {
    borderRadius: scaleW(50),
    paddingTop: scaleH(6),
    paddingBottom: scaleH(6),
    paddingLeft: scaleW(13),
    paddingRight: scaleW(13),
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontFamily: "Urbanist-SemiBold",
    fontWeight: "600",
    fontSize: scaleFont(12),
    lineHeight: scaleFont(14),
  },
});





// import React from "react";
// import {
//   View,
//   Text,
//   Modal,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   ScrollView,
//   Image,
//   StatusBar,
// } from "react-native";
// import { useAppTheme } from "../../hooks/useTheme";

// const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
// const BASE_WIDTH = 390;
// const BASE_HEIGHT = 977;

// const scaleW = (size: number) => (SCREEN_WIDTH / BASE_WIDTH) * size;
// const scaleH = (size: number) => (SCREEN_HEIGHT / BASE_HEIGHT) * size;
// const scaleFont = (size: number) => Math.round((SCREEN_WIDTH / BASE_WIDTH) * size);

// // ─── Types ───────────────────────────────────────────────────────────────────
// type TransactionStatus = "success" | "failed" | "processing";

// export interface Transaction {
//   id: string;
//   fundName: string;
//   transactionDate: string;
//   transactionType: string;
//   amount: string;
//   nav: string;
//   units: string;
//   status: TransactionStatus;
// }

// interface Props {
//   visible: boolean;
//   onClose: () => void;
//   transactions?: Transaction[];
// }

// // ─── Status badge colors ─────────────────────────────────────────────────────
// const STATUS_COLORS: Record<TransactionStatus, { bg: string; text: string }> = {
//   success: { bg: "#4CFF0026", text: "#1AAD00" },
//   failed: { bg: "#FF000026", text: "#CC0000" },
//   processing: { bg: "#FF840026", text: "#C05E00" },
// };

// // ─── Sub-components ───────────────────────────────────────────────────────────
// const LabelValue: React.FC<{
//   label: string;
//   value: string;
//   valueStyle?: object;
// }> = ({ label, value, valueStyle }) => (
//   <View style={card.labelValueContainer}>
//     <Text style={card.label}>{label}</Text>
//     <Text style={[card.value, valueStyle]}>{value}</Text>
//   </View>
// );

// const StatusBadge: React.FC<{ status: TransactionStatus }> = ({ status }) => {
//   const { bg, text } = STATUS_COLORS[status];
//   const label =
//     status === "success"
//       ? "Success"
//       : status === "failed"
//       ? "Failed"
//       : "Processing";

//   return (
//     <View style={[card.badge, { backgroundColor: bg }]}>
//       <Text style={[card.badgeText, { color: text }]}>{label}</Text>
//     </View>
//   );
// };

// const TransactionCard: React.FC<{ item: Transaction }> = ({ item }) => (
//   <View style={card.container}>
//     {/* ── Header row: fund icon + fund name ── */}
//     <View style={card.headerRow}>
//       <Image
//         source={require("../../images/dashboard/sbi.png")} // You can replace with dynamic logo if available
//         style={card.fundIcon}
//         resizeMode="contain"
//       />
//       <Text style={card.fundName} numberOfLines={1} ellipsizeMode="tail">
//         {item.fundName}
//       </Text>
//     </View>

//     <View style={card.divider} />

//     {/* ── Transaction info ── */}
//     <View style={card.dataRow}>
//       <LabelValue label="Trans. Date" value={item.transactionDate} />
//       <LabelValue label="Tran. Type" value={item.transactionType} />
//     </View>

//     <View style={card.dataRow}>
//       <LabelValue label="Amount" value={item.amount} />
//       <LabelValue label="NAV" value={item.nav} />
//     </View>

//     <View style={card.dataRow}>
//       <LabelValue label="Units" value={item.units} />
//       <StatusBadge status={item.status} />
//     </View>
//   </View>
// );

// // ─── Main Modal Component ─────────────────────────────────────────────────────
// const TransactionModal: React.FC<Props> = ({
//   visible,
//   onClose,
//   transactions = [],
// }) => {
//   const { colors, mode } = useAppTheme();
//   const sheetBg = mode === "dark" ? "#1E1E1E" : "#FAFAFA";
//   const titleColor = mode === "dark" ? "#FFFFFF" : "#000000";

//   return (
//     <Modal
//       visible={visible}
//       transparent
//       animationType="slide"
//       onRequestClose={onClose}
//       statusBarTranslucent
//     >
//       <StatusBar translucent backgroundColor="transparent" />

//       <View style={styles.overlay}>
//         <View style={[styles.sheet, { backgroundColor: sheetBg }]}>
//           {/* Drag handle */}
//           <View style={styles.handle} />

//           {/* Title row */}
//           <View style={styles.titleRow}>
//             <View style={styles.titleSpacer} />

//             <Text style={[styles.title, { color: titleColor }]}>
//               Transactions Overview
//             </Text>

//             <TouchableOpacity
//               onPress={onClose}
//               style={styles.closeBtn}
//               hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
//             >
//               <Image
//                 source={require("../../images/dashboard/close.png")}
//                 style={styles.closeIcon}
//                 resizeMode="contain"
//               />
//             </TouchableOpacity>
//           </View>

//           {/* Transactions List */}
//           <ScrollView
//             contentContainerStyle={styles.scrollContent}
//             showsVerticalScrollIndicator={false}
//           >
//             {transactions.length === 0 ? (
//               <Text style={[styles.emptyText, { color: colors.text }]}>
//                 No transactions available
//               </Text>
//             ) : (
//               transactions.map((item) => (
//                 <TransactionCard key={item.id} item={item} />
//               ))
//             )}
//           </ScrollView>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// export default TransactionModal;

// // ─── Styles ────────────────────────────────────────────────────────────────
// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.4)",
//     justifyContent: "flex-end",
//   },
//   sheet: {
//     width: SCREEN_WIDTH,
//     maxHeight: SCREEN_HEIGHT * 0.92,
//     borderTopLeftRadius: scaleW(25),
//     borderTopRightRadius: scaleW(25),
//     paddingTop: scaleH(16),
//     paddingHorizontal: scaleW(19),
//     paddingBottom: scaleH(30),
//   },
//   handle: {
//     width: scaleW(40),
//     height: scaleH(5),
//     borderRadius: 10,
//     alignSelf: "center",
//     marginBottom: scaleH(16),
//   },
//   titleRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: scaleH(24),
//     height: scaleH(35),
//   },
//   titleSpacer: { width: scaleW(35) },
//   title: {
//     fontFamily: "Urbanist-SemiBold",
//     fontSize: scaleFont(20),
//     fontWeight: "600",
//     letterSpacing: -0.4,
//     lineHeight: scaleFont(20),
//     textAlign: "center",
//     flex: 1,
//   },
//   closeBtn: {
//     width: scaleW(35),
//     height: scaleW(35),
//     borderRadius: scaleW(50),
//     backgroundColor: "#FFFFFF",
//     alignItems: "center",
//     justifyContent: "center",
//     paddingHorizontal: scaleW(5),
//     shadowColor: "#EEEEEE",
//     shadowOffset: { width: 0, height: 0 },
//     shadowOpacity: 0.25,
//     shadowRadius: scaleW(20),
//     elevation: 4,
//   },
//   closeIcon: { width: scaleW(80), height: scaleW(80) },
//   scrollContent: { gap: scaleH(15), paddingBottom: scaleH(10) },
//   emptyText: {
//     fontFamily: "Urbanist-Regular",
//     fontSize: scaleFont(14),
//     textAlign: "center",
//     marginTop: scaleH(40),
//   },
// });

// // ─── Card Styles ───────────────────────────────────────────────────────────
// const card = StyleSheet.create({
//   container: {
//     width: scaleW(357),
//     alignSelf: "center",
//     borderRadius: scaleW(25),
//     borderWidth: 1,
//     borderColor: "#EEEEEE",
//     paddingVertical: scaleH(15),
//     paddingHorizontal: scaleW(14),
//     backgroundColor: "#FFFFFF",
//     shadowColor: "#EEEEEE",
//     shadowOffset: { width: 0, height: 0 },
//     shadowOpacity: 1,
//     shadowRadius: scaleW(27),
//     elevation: 6,
//     gap: scaleH(10),
//   },
//   headerRow: { flexDirection: "row", alignItems: "center", gap: scaleW(10) },
//   fundIcon: {
//     width: scaleW(35),
//     height: scaleW(35),
//     borderRadius: scaleW(35) / 2,
//   },
//   fundName: {
//     flex: 1,
//     fontFamily: "Urbanist-SemiBold",
//     fontWeight: "600",
//     fontSize: scaleFont(16),
//     color: "#000000",
//     lineHeight: scaleFont(16),
//   },
//   divider: { height: 1, backgroundColor: "#F0F0F0", marginVertical: scaleH(4) },
//   dataRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   labelValueContainer: { gap: scaleH(5) },
//   label: {
//     fontFamily: "Urbanist-SemiBold",
//     fontWeight: "600",
//     fontSize: scaleFont(12),
//     color: "#878787",
//     lineHeight: scaleFont(12),
//   },
//   value: {
//     fontFamily: "Urbanist-SemiBold",
//     fontWeight: "600",
//     fontSize: scaleFont(14),
//     color: "#000000",
//     lineHeight: scaleFont(14),
//   },
//   badge: {
//     borderRadius: scaleW(50),
//     paddingVertical: scaleH(6),
//     paddingHorizontal: scaleW(13),
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   badgeText: {
//     fontFamily: "Urbanist-SemiBold",
//     fontWeight: "600",
//     fontSize: scaleFont(12),
//     lineHeight: scaleFont(14),
//   },
// });
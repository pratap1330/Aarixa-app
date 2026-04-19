import React, { useEffect, useRef, useState } from "react";
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
  ActivityIndicator,
} from "react-native";
import { useAppTheme } from "../../hooks/useTheme";
import { useGet } from "../../hooks/useGet";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BASE_WIDTH = 390;
const BASE_HEIGHT = 977;

const scaleW = (size: number) => (SCREEN_WIDTH / BASE_WIDTH) * size;
const scaleH = (size: number) => (SCREEN_HEIGHT / BASE_HEIGHT) * size;
const scaleFont = (size: number) => Math.round((SCREEN_WIDTH / BASE_WIDTH) * size);

const PAGE_SIZE = 10;

// ─── Types ────────────────────────────────────────────────────────────────────

interface ApiTransaction {
  buyid: string | null;
  sellid: string | null;
  amount: number;
  units: number;
  nav: number;
  txnType: string;
  balanceUnits: number;
  navDate: string;
  arnNo: string;
  adjNav: string | null;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  folid: string;
  cid: string;
  schemeName: string;
}

// ─── Status colours ───────────────────────────────────────────────────────────

// const STATUS_COLORS: Record<TransactionStatus, { bg: string; text: string }> = {
//   success:    { bg: "#4CFF0026", text: "#1AAD00" },
//   failed:     { bg: "#FF000026", text: "#CC0000" },
//   processing: { bg: "#FF840026", text: "#C05E00" },
// };

// const getStatus = (txnType: string): TransactionStatus => {
//   const t = txnType?.toLowerCase() ?? "";
//   if (t === "swo" || t === "red" || t === "sell" || t === "redemption") return "failed";
//   if (t === "sip" || t === "purchase" || t === "buy") return "success";
//   return "processing";
// };

const formatINR = (value: number) =>
  `₹${value.toLocaleString("en-IN", {
    // minimumFractionDigits: 2,
    // maximumFractionDigits: 2,
  })}`;

// ─── Avatar helpers ───────────────────────────────────────────────────────────

const getInitials = (name: string) => {
  if (!name) return "";
  const words = name.trim().split(" ");
  return words.slice(0, 2).map((w) => w[0]).join("").toUpperCase();
};

const getColorFromText = (text: string) => {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 45%)`;
};

// ─── SchemeHeader (shown once above the list) ─────────────────────────────────

const SchemeHeader: React.FC<{ schemeName: string; mode: string }> = ({
  schemeName,
  mode,
}) => {
  const initials = getInitials(schemeName);
  const bgColor = getColorFromText(schemeName);
  const nameColor = mode === "dark" ? "#FFFFFF" : "#000000";

  return (
    <View style={schemeHeader.container}>
      <View style={[schemeHeader.avatar, { backgroundColor: bgColor }]}>
        <Text style={schemeHeader.avatarText}>{initials}</Text>
      </View>
      <Text
        style={[schemeHeader.name, { color: nameColor }]}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {schemeName}
      </Text>
    </View>
  );
};

const schemeHeader = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: scaleH(20),
    gap: scaleW(10),
    paddingHorizontal: scaleW(2),
  },
  avatar: {
    width: scaleW(42),
    height: scaleW(42),
    borderRadius: scaleW(21),
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: scaleFont(14),
    fontFamily: "Urbanist-SemiBold",
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  name: {
    flex: 1,
    fontFamily: "Urbanist-SemiBold",
    fontWeight: "600",
    fontSize: scaleFont(16),
    lineHeight: scaleFont(22),
  },
});

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

// const StatusBadge: React.FC<{ status: TransactionStatus }> = ({ status }) => {
//   const { bg, text } = STATUS_COLORS[status];
//   const label =
//     status === "success"   ? "Completed"  :
//     status === "failed"    ? "Failed"     :
//                              "Processing";
//   return (
//     <View style={[card.badge, { backgroundColor: bg }]}>
//       <Text style={[card.badgeText, { color: text }]}>{label}</Text>
//     </View>
//   );
// };

// ─── TransactionCard (no scheme name / avatar here) ──────────────────────────

const TransactionCard: React.FC<{ item: ApiTransaction }> = ({ item }) => {
  const { colors, mode } = useAppTheme();
  const cardBg = mode === "dark" ? "#1E1E1E" : "#FFFFFF";
  const cardBorder = mode === "dark" ? "#333333" : "#EEEEEE";
  const dividerBg = mode === "dark" ? "#2A2A2A" : "#F0F0F0";
  const valueColor = { color: colors.text };
  // const status     = getStatus(item.txnType);

  return (
    <View style={[card.container, { backgroundColor: cardBg, borderColor: cardBorder }]}>

      {/* Row 1: Trans. Date | Tran. Type */}

<View style={card.dataRow}>
  <View style={card.col}>
    <LabelValue label="Trans. Date" value={item.navDate} valueStyle={valueColor} />
  </View>
  <View style={card.col}>
    <LabelValue label="Tran. Type" value={item.txnType} valueStyle={valueColor} />
  </View>
</View>

<View style={[card.divider, { backgroundColor: dividerBg }]} />

{/* Row 2: Amount | NAV */}
<View style={card.dataRow}>
  <View style={card.col}>
    <LabelValue label="Amount" value={formatINR(item.amount)} valueStyle={valueColor} />
  </View>
  <View style={card.col}>
    <LabelValue label="NAV" value={formatINR(item.nav)} valueStyle={valueColor} />
  </View>
</View>

{/* Row 3: Units */}
<View style={card.dataRow}>
  <View style={card.col}>
    <LabelValue label="Units" value={String(item.units)} valueStyle={valueColor} />
  </View>
</View>
    </View>
  );
};

// ─── Modal ────────────────────────────────────────────────────────────────────

const TransactionModal: React.FC<Props> = ({
  visible,
  onClose,
  folid,
  cid: _cid,
  schemeName,
}) => {
  const { colors, mode } = useAppTheme();
  const sheetBg = mode === "dark" ? "#1E1E1E" : "#FAFAFA";
  const titleColor = mode === "dark" ? "#FFFFFF" : "#000000";

  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const [allTransactions, setAllTransactions] = useState<ApiTransaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const apiUrl =
    visible && folid
      ? `api/dataimport/getFolStatement?folid=${folid}&currentPage=${currentPage}&pageSize=${PAGE_SIZE}`
      : "";

  const { data, loading } = useGet(apiUrl, {}, !!apiUrl);

  useEffect(() => {
    if (!data?.result?.data) return;
    const fetched: ApiTransaction[] = data.result.data;
    setAllTransactions((prev) =>
      currentPage === 1 ? fetched : [...prev, ...fetched]
    );
    setHasMore(fetched.length === PAGE_SIZE);
  }, [data]);

  useEffect(() => {
    if (visible) {
      setAllTransactions([]);
      setCurrentPage(1);
      setHasMore(true);
    }
  }, [visible, folid]);

  const handleScroll = ({ nativeEvent }: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    const nearBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 40;
    if (nearBottom && !loading && hasMore) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (visible) {
      translateY.setValue(SCREEN_HEIGHT);
      overlayOpacity.setValue(0);
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0, duration: 440,
          easing: Easing.out(Easing.cubic), useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1, duration: 360,
          easing: Easing.out(Easing.quad), useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT, duration: 320,
          easing: Easing.in(Easing.cubic), useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0, duration: 280,
          easing: Easing.in(Easing.quad), useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const isFirstLoad = loading && currentPage === 1 && allTransactions.length === 0;
  const isFetchingMore = loading && currentPage > 1;

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
          style={[styles.sheet, { backgroundColor: sheetBg, transform: [{ translateY }] }]}
        >
          <View style={styles.handle} />

          {/* ── Title row ── */}
          <View style={styles.titleRow}>
            <View style={styles.titleSpacer} />
            <Text style={[styles.title, { color: titleColor }]}>
              Transactions Overview
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={[
                styles.closeBtn,
                { backgroundColor: mode === "dark" ? "#2A2A2A" : "#FFFFFF" },
              ]}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Image
                source={require("../../images/dashboard/close.png")}
                // style={[styles.closeIcon, { tintColor: colors.text }]}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {/* ── Scheme header — shown once, above the scroll list ── */}
          <SchemeHeader schemeName={schemeName} mode={mode} />

          {isFirstLoad ? (
            <View style={styles.centeredLoader}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : (
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={200}
            >
              {allTransactions.length === 0 ? (
                <Text style={[styles.emptyText, { color: colors.text }]}>
                  No transactions available
                </Text>
              ) : (
                allTransactions.map((item, index) => (
                  <TransactionCard
                    key={`${item.sellid ?? item.buyid ?? ""}_${index}`}
                    item={item}
                  />
                ))
              )}

              {isFetchingMore && (
                <ActivityIndicator
                  style={{ marginVertical: scaleH(16) }}
                  size="small"
                  color={colors.primary}
                />
              )}

              {!hasMore && allTransactions.length > 0 && (
                <Text style={[styles.endText, { color: colors.primary }]}>All transactions loaded</Text>
              )}
            </ScrollView>
          )}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default TransactionModal;

// ─── Modal styles ─────────────────────────────────────────────────────────────

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
    alignSelf: "center",
    marginBottom: scaleH(16),
    backgroundColor: "#CCCCCC",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: scaleH(20),
    height: scaleH(35),
  },
  titleSpacer: { width: scaleW(35) },
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
    paddingBottom: scaleH(30),
  },
  centeredLoader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontFamily: "Urbanist-Regular",
    fontSize: scaleFont(14),
    textAlign: "center",
    marginTop: scaleH(40),
  },
  endText: {
    fontFamily: "Urbanist-SemiBold",
    fontSize: scaleFont(12),
    textAlign: "center",
    color: "#999",
    marginTop: scaleH(8),
    marginBottom: scaleH(4),
  },
});

// ─── Card styles ──────────────────────────────────────────────────────────────

const card = StyleSheet.create({
  container: {
    width: scaleW(357),
    alignSelf: "center",
    borderRadius: scaleW(25),
    borderWidth: 1,
    paddingTop: scaleH(15),
    // paddingRight: scaleW(24),
    paddingBottom: scaleH(15),
    paddingLeft: scaleW(24 ),
    // paddingLeft: scaleW(14),
    shadowColor: "#EEEEEE",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: scaleW(27),
    elevation: 6,
    gap: scaleH(10),
  },
   dataRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: scaleW(100)   // ← flex-start so columns align at top when text wraps
  },
  col: {
    //  paddingHorizontal: scaleW(16),
    flex: 1,                    // ← each column takes equal width and stays left-aligned
  },
    divider: {
    height: 1,
  },
  labelValueContainer: { gap: scaleH(5) },
  label: {
    fontFamily: "Urbanist-SemiBold",
    // fontWeight:  "600",
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
    paddingVertical: scaleH(6),
    paddingHorizontal: scaleW(13),
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

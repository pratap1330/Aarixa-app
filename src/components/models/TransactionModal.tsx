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

const scaleW    = (size: number) => (SCREEN_WIDTH / BASE_WIDTH) * size;
const scaleH    = (size: number) => (SCREEN_HEIGHT / BASE_HEIGHT) * size;
const scaleFont = (size: number) => Math.round((SCREEN_WIDTH / BASE_WIDTH) * size);

const PAGE_SIZE = 10;

// ─── Types ────────────────────────────────────────────────────────────────────

type TransactionStatus = "success" | "failed" | "processing";

interface ApiTransaction {
  buyid:        string | null;
  sellid:       string | null;
  amount:       number;
  units:        number;
  nav:          number;
  txnType:      string;
  balanceUnits: number;
  navDate:      string;
  arnNo:        string;
  adjNav:       string | null;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  folid:   string;   // folioNo from fund card (fallback "765")
  cid:     string;   // from AsyncStorage
}

// ─── Status colours ───────────────────────────────────────────────────────────

const STATUS_COLORS: Record<TransactionStatus, { bg: string; text: string }> = {
  success:    { bg: "#4CFF0026", text: "#1AAD00" },
  failed:     { bg: "#FF000026", text: "#CC0000" },
  processing: { bg: "#FF840026", text: "#C05E00" },
};

const getStatus = (txnType: string): TransactionStatus => {
  const t = txnType?.toLowerCase() ?? "";
  if (t === "swo" || t === "red" || t === "sell") return "failed";
  if (t === "sip" || t === "purchase" || t === "buy") return "success";
  return "processing";
};

const formatINR = (value: number) =>
  `₹${value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

// ─── Sub-components ───────────────────────────────────────────────────────────

const LabelValue: React.FC<{
  label:       string;
  value:       string;
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
    status === "success"   ? "Success"    :
    status === "failed"    ? "Failed"     :
                             "Processing";
  return (
    <View style={[card.badge, { backgroundColor: bg }]}>
      <Text style={[card.badgeText, { color: text }]}>{label}</Text>
    </View>
  );
};

const TransactionCard: React.FC<{ item: ApiTransaction }> = ({ item }) => {
  const { colors, mode } = useAppTheme();
  const cardBg     = mode === "dark" ? "#1E1E1E" : "#FFFFFF";
  const cardBorder = mode === "dark" ? "#333333" : "#EEEEEE";
  const dividerBg  = mode === "dark" ? "#2A2A2A" : "#F0F0F0";
  const valueColor = { color: colors.text };
  const status     = getStatus(item.txnType);

  return (
    <View style={[card.container, { backgroundColor: cardBg, borderColor: cardBorder }]}>
      <View style={card.headerRow}>
        <Image
          source={require("../../images/dashboard/sbi.png")}
          style={card.fundIcon}
          resizeMode="contain"
        />
        <Text style={[card.fundName, valueColor]} numberOfLines={1} ellipsizeMode="tail">
          {item.txnType} — {item.arnNo}
        </Text>
      </View>

      <View style={[card.divider, { backgroundColor: dividerBg }]} />

      <View style={card.dataRow}>
        <LabelValue label="NAV Date" value={item.navDate}           valueStyle={valueColor} />
        <LabelValue label="Txn Type" value={item.txnType}           valueStyle={valueColor} />
      </View>

      <View style={card.dataRow}>
        <LabelValue label="Amount"   value={formatINR(item.amount)} valueStyle={valueColor} />
        <LabelValue label="NAV"      value={formatINR(item.nav)}    valueStyle={valueColor} />
      </View>

      <View style={card.dataRow}>
        <LabelValue label="Units"         value={String(item.units)}        valueStyle={valueColor} />
        <LabelValue label="Balance Units" value={String(item.balanceUnits)} valueStyle={valueColor} />
      </View>

      <View style={card.dataRow}>
        <LabelValue label="ARN No" value={item.arnNo} valueStyle={valueColor} />
        <StatusBadge status={status} />
      </View>
    </View>
  );
};

// ─── Main Modal ───────────────────────────────────────────────────────────────

const TransactionModal: React.FC<Props> = ({ visible, onClose, folid, cid }) => {
  const { colors, mode } = useAppTheme();
  const sheetBg    = mode === "dark" ? "#1E1E1E" : "#FAFAFA";
  const titleColor = mode === "dark" ? "#FFFFFF" : "#000000";

  const translateY     = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const [allTransactions, setAllTransactions] = useState<ApiTransaction[]>([]);
  const [currentPage,     setCurrentPage]     = useState(1);
  const [hasMore,         setHasMore]         = useState(true);

  // ── URL — empty string when modal hidden so useGet skips the call ──────────
  const apiUrl =
    visible && folid && cid
      ? `api/dataimport/getFolStatement?folid=${folid}&cid=${cid}&currentPage=${currentPage}&pageSize=${PAGE_SIZE}`
      : "";

  const { data, loading } = useGet(apiUrl, {}, !!apiUrl);

  // ── Accumulate pages ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!data?.result?.data) return;

    const fetched: ApiTransaction[] = data.result.data;

    setAllTransactions((prev) =>
      currentPage === 1 ? fetched : [...prev, ...fetched]
    );

    setHasMore(fetched.length === PAGE_SIZE);
  }, [data]);

  // ── Reset on open / folid change ───────────────────────────────────────────
  useEffect(() => {
    if (visible) {
      setAllTransactions([]);
      setCurrentPage(1);
      setHasMore(true);
    }
  }, [visible, folid]);

  // ── Scroll-to-bottom → load next page ─────────────────────────────────────
  const handleScroll = ({ nativeEvent }: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    const nearBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 40;

    if (nearBottom && !loading && hasMore) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // ── Slide animation ────────────────────────────────────────────────────────
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

  const isFirstLoad    = loading && currentPage === 1 && allTransactions.length === 0;
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

          <View style={styles.titleRow}>
            <View style={styles.titleSpacer} />
            <Text style={[styles.title, { color: titleColor }]}>
              Transactions Overview
            </Text>
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

          {isFirstLoad ? (
            <View style={styles.centeredLoader}>
              <ActivityIndicator size="large" color="#3A6FF8" />
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
                  color="#3A6FF8"
                />
              )}

              {!hasMore && allTransactions.length > 0 && (
                <Text style={styles.endText}>All transactions loaded</Text>
              )}
            </ScrollView>
          )}
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

const card = StyleSheet.create({
  container: {
    width: scaleW(357),
    alignSelf: "center",
    borderRadius: scaleW(25),
    borderWidth: 1,
    paddingTop: scaleH(15),
    paddingRight: scaleW(14),
    paddingBottom: scaleH(15),
    paddingLeft: scaleW(14),
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
    height: scaleH(35),
    gap: scaleW(10),
  },
  fundIcon: {
    width: scaleW(35),
    height: scaleW(35),
    borderRadius: scaleW(35) / 2,
  },
  fundName: {
    flex: 1,
    fontFamily: "Urbanist-SemiBold",
    fontWeight: "600",
    fontSize: scaleFont(16),
    lineHeight: scaleFont(16),
  },
  divider: {
    height: 1,
    marginVertical: scaleH(4),
  },
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  labelValueContainer: { gap: scaleH(5) },
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
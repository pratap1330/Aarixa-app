import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppTheme } from "../hooks/useTheme";
import TransactionModal from "../components/models/TransactionModal";
import { useGet } from "../hooks/useGet";
import { wp, hp, scaleFont } from "../utils/responcive/responcive";

const FILTERS = ["Equity Funds", "Debt Funds", "Hybrid Funds"];

const FilterCard = () => {
    const [showModal, setShowModal] = useState(false);
    const [cid, setCid] = useState<string | null>(null);
    const { colors, mode } = useAppTheme();
    const [active, setActive] = useState("Equity Funds");

    useEffect(() => {
        const getCid = async () => {
            try {
                const storedCid = await AsyncStorage.getItem("uniqueId");
                if (storedCid) setCid(storedCid);
            } catch (err) {
                console.log("Error reading cid from AsyncStorage", err);
            }
        };
        getCid();
    }, []);

    const { data, loading, error } = useGet(
        cid ? `api/investor/getInvestedFunds?cid=${cid}&levelNo=1&currentPage=1&pageSize=10` : "",
        {},
        !!cid
    );
    const fund = data?.result?.[0];

    const transactions = data?.result.map((item: any, index: any) => ({
        id: index.toString(),
        fundName: item.schemeName,
        transactionDate: new Date(item.firstInvestmentDate).toLocaleDateString("en-IN"),
        amount: item.investedValue,
        units: item.balUnits,
        nav: item.nav,
        currentValue: item.currentValue,
        gain: item.gain.toString(),
        xirr: item.xirr.toString(),
        status: item.currentValue === "0.00" ? "failed" : "success",
    }));

    return (
        <View style={styles.outerContainer}>
            {/* ── FILTER ROW — Figma: Frame 1707478214, width:356, height:45, space-between ── */}
            <View style={styles.filterRow}>
                {/* Filter button — Figma: Frame 1597885257, width:83, height:30, radius:50, shadow:0 0 20 #EEE */}
                <TouchableOpacity
                    style={[
                        styles.filterBtn,
                        { backgroundColor: mode === "dark" ? "#1E1E1E" : "#FFFFFF" },
                    ]}
                >
                    <Image
                        source={
                            mode === "dark"
                                ? require("../images/dashboard/filter_dark.png")
                                : require("../images/dashboard/filter.png")
                        }
                        style={styles.filterIcon}
                    />
                    <Text style={[styles.filterText, { color: colors.text }]}>
                        Filters
                    </Text>
                </TouchableOpacity>

                {/* Chips — Figma: Frame 1597885253, width:273, height:45 */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.chipsScroll}
                    contentContainerStyle={styles.chipsWrapper}
                >
                    {FILTERS.map((item) => {
                        const isActive = active === item;
                        return (
                            <TouchableOpacity
                                key={item}
                                onPress={() => setActive(item)}
                                style={[
                                    styles.chip,
                                    isActive
                                        ? styles.activeChip
                                        : [styles.inactiveChip, mode === "dark" && { backgroundColor: "#2A2A2A" }],
                                ]}
                            >
                                <Text style={[styles.chipText, { color: isActive ? "#000000" : (mode === "dark" ? "#CCCCCC" : "#434343") }]}>{item}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* ── FUND CARD — Figma: Group 1707478200, width:357, height:326 ── */}
            <View
                style={[
                    styles.fundCard,
                    { backgroundColor: mode === "dark" ? "#111111" : "#FFFFFF" },
                ]}
            >
                {loading ? (
                    <ActivityIndicator size="small" color="#3A6FF8" />
                ) : error ? (
                    <Text style={{ color: "red" }}>Error loading fund</Text>
                ) : fund ? (
                    <>
                        {/* Header */}
                        <View style={styles.cardHeader}>
                            <View style={styles.logoCircle}>
                                <Image
                                    source={require("../images/dashboard/sbi.png")}
                                    style={styles.logoImage}
                                    resizeMode="contain"
                                />
                            </View>
                            <Text style={[styles.fundName, { color: colors.text }]} numberOfLines={2}>
                                {fund.schemeName}
                            </Text>
                            <TouchableOpacity style={styles.dotsBtn}>
                                <Image
                                    source={require("../images/card/dot.png")}
                                    style={[styles.dotIcon, mode === "dark" && { tintColor: "#FFFFFF" }]}
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Folio + Tags */}
                        <View style={styles.tagsRow}>
                            <Text style={[styles.accountNum, { color: colors.text }]}>
                                ({fund.folioNo})
                            </Text>
                            <View style={[styles.tag, { backgroundColor: mode === "dark" ? "#2A2A2A" : "#E9E9E9" }]}>
                                <Image
                                    source={require("../images/dashboard/greendot.png")}
                                    style={styles.greenDotImage}
                                />
                                <Text style={[styles.tagText, { color: mode === "dark" ? "#CCCCCC" : "#333333" }]}>Direct Plan- Growth</Text>
                            </View>
                            <View style={[styles.tag1, { backgroundColor: mode === "dark" ? "#2A2A2A" : "#E9E9E9" }]}>
                                <Image
                                    source={require("../images/dashboard/greendot.png")}
                                    style={styles.greenDotImage}
                                />
                                <Text style={[styles.tagText, { color: mode === "dark" ? "#CCCCCC" : "#333333" }]}>Hybrid</Text>
                            </View>
                        </View>

                        <View style={[styles.divider, { backgroundColor: mode === "dark" ? "#2A2A2A" : "#F0F0F0" }]} />

                        {/* Current & Invested Value */}
                        <View style={styles.valuesRow}>
                            <View style={styles.valueCol}>
                                <Text style={styles.valueLabel}>Current Value</Text>
                                <Text style={[styles.valueAmount, { color: colors.text }]}>
                                    ₹{parseFloat(fund.currentValue).toLocaleString("en-IN")}
                                </Text>
                            </View>
                            <View style={[styles.valueCol, { marginRight: wp(18) }]}>
                                <Text style={styles.valueLabel}>Invested Value</Text>
                                <Text style={[styles.valueAmount, { color: colors.text }]}>
                                    ₹{parseFloat(fund.investedValue).toLocaleString("en-IN")}
                                </Text>
                            </View>
                        </View>

                        {/* Unrealised Gain & Today's Gain/Loss */}
                        <View style={styles.valuesRow}>
                            <View style={styles.valueCol}>
                                <Text style={styles.valueLabel}>Unrealised Gain</Text>
                                <Text style={styles.gainText}>
                                    ₹{parseFloat(fund.gain).toLocaleString("en-IN")}
                                </Text>
                            </View>
                            <View style={styles.valueCol}>
                                <Text style={styles.valueLabel}>Today's Gain/Loss</Text>
                                <Text style={styles.lossText}>
                                    ₹{(
                                        parseFloat(fund.currentValue) - parseFloat(fund.investedValue)
                                    ).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                </Text>
                            </View>
                        </View>

                        {/* Units & View Transactions */}
                        <View style={[styles.valuesRow, { marginBottom: 0 }]}>
                            <View style={styles.valueCol}>
                                <Text style={styles.valueLabel}>Units</Text>
                                <Text style={[styles.valueAmount, { color: colors.text }]}>
                                    {fund.balUnits}
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={styles.viewTxnBtn}
                                onPress={() => setShowModal(true)}
                            >
                                <Text style={styles.viewTxnText}>View Transactions</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                ) : (
                    <Text>No funds available</Text>
                )}
            </View>

            <TransactionModal
                visible={showModal}
                onClose={() => setShowModal(false)}
                transactions={transactions || []}
            />
        </View>
    );
};

export default FilterCard;

const styles = StyleSheet.create({
    /* ── OUTER CONTAINER — Figma: width:357, left:16 ── */
    outerContainer: {
        // width: wp(357),
        // marginLeft: wp(1),
        // marginBottom: hp(16),
    },

    /* ── FILTER ROW — Figma: Frame 1707478214, width:356, height:45, space-between ── */
    filterRow: {
        width: wp(356),
        height: hp(45),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: hp(8),
    },

    /* ── Filter Button — Figma: width:83, height:30, radius:50, shadow:0 0 20 #EEE ── */
    filterBtn: {
        width: wp(83),
        height: hp(30),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: wp(10),
        borderRadius: wp(50),
        shadowColor: "#EEEEEE",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: wp(20),
        elevation: 5,
    },

    /* ── Filter icon — Figma: lets-icons:filter-big, width:16, height:16 ── */
    filterIcon: {
        width: wp(16),
        height: wp(16),
        resizeMode: "contain",
    },

    /* ── "Filters" text — Figma: Urbanist SemiBold 12px, #000000 ── */
    filterText: {
        fontFamily: "Urbanist-SemiBold",
        fontWeight: "600",
        fontSize: scaleFont(12),
        lineHeight: scaleFont(12),
        letterSpacing: -0.24,
        textAlign: "center",
    },

    /* ── Chips ScrollView — Figma: Frame 1597885253, width:273, height:45 ── */
    chipsScroll: {
        width: wp(273),
        height: hp(45),
    },

    chipsWrapper: {
        flexDirection: "row",
        alignItems: "center",
        gap: wp(8),
        paddingLeft: wp(3),
    },

    /* ── Chip base — height:30, radius:50 ── */
    chip: {
        height: hp(30),
        borderRadius: wp(50),
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: wp(10),
    },

    /* ── Active chip — Figma: Rectangle 177, width:83, #FFDD6D ── */
    activeChip: {
        minWidth: wp(83),
        backgroundColor: "#FFDD6D",
    },

    /* ── Inactive chip — Figma: Rectangle 178, width:76, #EDEDED ── */
    inactiveChip: {
        minWidth: wp(76),
        backgroundColor: "#EDEDED",
    },

    /* ── Chip text — Urbanist SemiBold 12px, #434343 ── */
    chipText: {
        fontFamily: "Urbanist-SemiBold",
        fontWeight: "600",
        fontSize: scaleFont(12),
        lineHeight: scaleFont(12),
        letterSpacing: -0.24,
        textAlign: "center",
        color: "#434343",
    },

    /* ── FUND CARD — Figma: Group 1707478200, width:357, height:326 ── */
    fundCard: {
        width: wp(357),
        borderRadius: wp(16),
        paddingHorizontal: wp(16),
        paddingVertical: hp(14),
        shadowColor: "#EEEEEE",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: wp(12),
        elevation: 4,
    },

    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: wp(10),
        marginBottom: hp(10),
    },

    logoCircle: {
        width: wp(44),
        height: wp(44),
        borderRadius: wp(22),
        backgroundColor: "#2D2580",
        justifyContent: "center",
        alignItems: "center",
    },

    logoImage: {
        width: wp(36),
        height: wp(36),
        borderRadius: wp(18),
    },

    fundName: {
        flex: 1,
        fontFamily: "Urbanist-Bold",
        fontWeight: "700",
        fontSize: scaleFont(14),
        lineHeight: scaleFont(19),
        letterSpacing: -0.2,
    },

    dotsBtn: {
        justifyContent: "center",
        alignItems: "center",
    },

    dotIcon: {
        width: wp(25),
        height: wp(25),
        resizeMode: "contain",
    },

    tagsRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: wp(6),
        marginBottom: hp(10),
        flexWrap: "nowrap",
    },

    accountNum: {
        fontFamily: "Urbanist-SemiBold",
        fontWeight: "600",
        fontSize: scaleFont(11),
        letterSpacing: 0.5,
        width: wp(84),
    },

    tag: {
        flexDirection: "row",
        alignItems: "center",
        width: wp(143),
        height: hp(20),
        paddingHorizontal: wp(8),
        paddingVertical: hp(4),
        backgroundColor: "#E9E9E9",
        borderRadius: wp(20),
    },

    tag1: {
        flexDirection: "row",
        alignItems: "center",
        width: wp(75),
        height: hp(20),
        paddingHorizontal: wp(8),
        borderRadius: wp(20),
        backgroundColor: "#E9E9E9",
    },

    greenDotImage: {
        width: wp(15),
        height: wp(15),
    },

    tagText: {
        fontFamily: "Urbanist-SemiBold",
        fontWeight: "600",
        paddingLeft: wp(6),
        fontSize: scaleFont(10),
        color: "#333333",
        letterSpacing: -0.2,
    },

    divider: {
        height: 1,
        backgroundColor: "#F0F0F0",
        marginBottom: hp(10),
    },

    valuesRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingLeft: wp(10),
        paddingRight: wp(14),
        marginBottom: hp(8),
    },

    valueCol: {
        gap: hp(2),
    },

    valueLabel: {
        fontFamily: "Urbanist-SemiBold",
        fontWeight: "600",
        fontSize: scaleFont(12),
        color: "#9E9E9E",
        letterSpacing: -0.2,
    },

    valueAmount: {
        fontFamily: "Urbanist-Bold",
        fontWeight: "700",
        fontSize: scaleFont(14),
        letterSpacing: -0.3,
    },

    gainText: {
        fontFamily: "Urbanist-Bold",
        fontWeight: "700",
        fontSize: scaleFont(14),
        color: "#1AAD00",
        letterSpacing: -0.3,
    },

    lossText: {
        fontFamily: "Urbanist-Bold",
        fontWeight: "700",
        fontSize: scaleFont(14),
        color: "#CC0000",
        letterSpacing: -0.3,
    },

    viewTxnBtn: {
        alignSelf: "flex-end",
    },

    viewTxnText: {
        fontFamily: "Urbanist-SemiBold",
        fontWeight: "600",
        fontSize: scaleFont(13),
        color: "#3A6FF8",
        textDecorationLine: "underline",
        letterSpacing: -0.2,
    },
});

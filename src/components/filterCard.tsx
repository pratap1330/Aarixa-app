import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppTheme } from "../hooks/useTheme";
import TransactionModal from "../components/models/TransactionModal";
import { useGet } from "../hooks/useGet";
import { wp, hp, scaleFont } from "../utils/responcive/responcive";
import Dot from "../images/card/dot.svg";

// Category label mapping
const CATEGORY_LABEL_MAP: Record<string, string> = {
    Equity: "Equity Funds",
    Debt: "Debt Funds",
    Hybrid: "Hybrid Funds",
    ELSS: "ELSS Funds",
    Index: "Index Funds",
    Liquid: "Liquid Funds",
    Gold: "Gold Funds",
    International: "International Funds",
};

const getCategoryLabel = (cat: string) => CATEGORY_LABEL_MAP[cat] ?? cat;

const FilterCard = () => {
    const [showModal, setShowModal] = useState(false);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [cid, setCid] = useState<string | null>(null);
    const { colors, mode } = useAppTheme();
    const [selectedSchemeName, setSelectedSchemeName] = useState<string | null>(null);
    const [active, setActive] = useState("All");
    const [selectedFolid, setSelectedFolid] = useState<string | null>(null);
    const [selectedFolNo, setSelectedFolNo] = useState<string | null>(null);
    // Pagination States
    const [allFunds, setAllFunds] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    // Dynamic filters
    const [filters, setFilters] = useState<string[]>(["All"]);

    useEffect(() => {
        const getCid = async () => {
            try {
                const storedCid = await AsyncStorage.getItem("cid");
                if (storedCid) setCid(storedCid);
            } catch {
                // console.log("Error reading cid from AsyncStorage", err);
            }
        };
        getCid();
    }, []);


    

    // API Call
    const { data, loading } = useGet(
        cid ? `api/investor/getInvestedFunds?cid=${cid}&levelNo=1&currentPage=${currentPage}&pageSize=10` : "",
        {},
        !!cid
    );

    // Append data and rebuild dynamic filters
    useEffect(() => {
        if (data?.result?.data) {
            // ─── TESTING: inject extra dummy categories ───────────────────────
            // const testExtras = [
            //     { ...data.result.data[0], folioNo: "TEST-ELSS-1", category: "ELSS" },
            //     { ...data.result.data[0], folioNo: "TEST-INDEX-1", category: "Index" },
            //     { ...data.result.data[0], folioNo: "TEST-HYBRID-1", category: "Hybrid" },
            //     { ...data.result.data[0], folioNo: "TEST-LIQUID-1", category: "Liquid" },
            // ];
            const incoming = [...data.result.data];
            // ─────────────────────────────────────────────────────────────────

            const updatedFunds =
                currentPage === 1 ? incoming : [...allFunds, ...incoming];

            if (currentPage === 1) {
                setAllFunds(incoming);
            } else {
                setAllFunds((prev) => [...prev, ...incoming]);
            }

            // Build filter tabs from unique categories in accumulated data
            const seen = new Set<string>();
            const categories: string[] = ["All"];
            updatedFunds.forEach((fund: any) => {
                const label = getCategoryLabel(fund.category?.trim());
                if (label && !seen.has(label)) {
                    seen.add(label);
                    categories.push(label);
                }
            });
            setFilters(categories);
            setIsFetchingMore(false);
        }
    }, [data]);

    const loadMore = () => {
        if (!loading && !isFetchingMore && data?.result?.data?.length === 10) {
            setIsFetchingMore(true);
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handleViewTransactions = (fund: any) => {
        const folid = fund?.folid ?? "765";
        const folioNo = fund?.folioNo ?? "765";
        setSelectedFolid(String(folid));
        setSelectedFolNo(String(folioNo));
        setSelectedSchemeName(fund?.schemeName || "");
        setShowModal(true);
    };

    // Filter funds based on active tab
    const filteredFunds = allFunds.filter((fund) => {
        if (active === "All") return true;
        return getCategoryLabel(fund.category?.trim()) === active;
    });

    const renderFundItem = ({ item: fund }: { item: any }) => (
        <View
            style={[
            styles.fundCard,
            { backgroundColor: mode === "dark" ? "#111111" : "#FFFFFF" },
            activeMenu === fund.folioNo && { zIndex: 999, overflow: 'visible' }, // ← ADD THIS
        ]}
        >
            {/* Header */}
            <View style={styles.cardHeader}>
                <View />
                <Text style={[styles.fundName, { color: colors.text }]} numberOfLines={2}>
                    {fund.schemeName}
                </Text>
                <TouchableOpacity
                    style={styles.dotsBtn}
                    onPress={() =>
                        setActiveMenu(activeMenu === fund.folioNo ? null : fund.folioNo)
                    }
                >
                  <Dot
                    width={wp(25)}
                    height={wp(25)}
                    fill={mode === "dark" ? "#FFFFFF" : "#000000"} 
                  />
                </TouchableOpacity>
            </View>

            {activeMenu === fund.folioNo && (
                <View style={styles.dropdown}>
                    {["Invest Lumpsum", "STP", "SWP", "Switch", "Redeem"].map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.dropdownItem}
                            onPress={() => {
                                // console.log(item);
                                setActiveMenu(null);
                            }}
                        >
                            <Text style={styles.dropdownText}>{item}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {/* Folio + Tags */}
            <View style={styles.tagsRow}>
                <Text style={[styles.accountNum, { color: colors.text }]}>
                    ({fund.folioNo})
                </Text>
                {/* Category badge */}
                <View style={[styles.categoryBadge, { backgroundColor: mode === "dark" ? "#2A2A2A" : colors.primarySoft }]}>
                    <Text style={[styles.categoryBadgeText, { color: colors.primary }]}>
                        {getCategoryLabel(fund.category)}
                    </Text>
                </View>
            </View>

            <View style={[styles.divider, { backgroundColor: mode === "dark" ? "#2A2A2A" : "#F0F0F0" }]} />

            {/* Values */}
            <View style={styles.valuesRow}>
    <View style={styles.valueCol}>
        <Text style={styles.valueLabel}>Current Value</Text>
        <Text style={[styles.valueAmount, { color: colors.text }]}>
            ₹{parseFloat(fund.currentValue || 0).toLocaleString("en-IN")}
        </Text>
    </View>
    <View style={[styles.valueCol, { alignItems: "flex-end" }]}>
        <Text style={styles.valueLabel}>Invested Value</Text>
        <Text style={[styles.valueAmount, { color: colors.text }]}>
            ₹{parseFloat(fund.investedValue || 0).toLocaleString("en-IN")}
        </Text>
    </View>
</View>

<View style={styles.valuesRow}>
    <View style={styles.valueCol}>
        <Text style={styles.valueLabel}>Unrealised Gain</Text>
        <Text style={[styles.gainText, {
            color: parseFloat(fund.gain || 0) >= 0 ? "#1AAD00" : "#CC0000"
        }]}>
            ₹{parseFloat(fund.gain || 0).toLocaleString("en-IN")}
        </Text>
    </View>
    <View style={[styles.valueCol, { alignItems: "flex-end" }]}>
        <Text style={styles.valueLabel}>Xirr</Text>
        <Text style={[styles.lossText, {
            color: fund.xirr && parseFloat(fund.xirr) >= 0 ? "#1AAD00" : "#CC0000"
        }]}>
            {fund.xirr ? `${parseFloat(fund.xirr)}%` : "N/A"}
        </Text>
    </View>
</View>
 <View style={[styles.valuesRow, { marginBottom: 0 }]}>
                <View style={styles.valueCol}>
                    <Text style={styles.valueLabel}>Units</Text>
                    <Text style={[styles.valueAmount, { color: colors.text }]}>
                        {fund.balUnits}
                    </Text>
                </View>
                <TouchableOpacity
                    style={styles.viewTxnBtn}
                    onPress={() => handleViewTransactions(fund)}
                >
                    <Text style={[styles.viewTxnText, { color: colors.primary }]}>View Transactions</Text>
                </TouchableOpacity>
            </View>

        </View>
    );

    const renderHeader = () => (
        <View style={styles.filterRow}>
            <TouchableOpacity
                style={[styles.filterBtn, { backgroundColor: mode === "dark" ? "#1E1E1E" : "#FFFFFF" }]}
            >
                <Image
                    source={mode === "dark"
                        ? require("../images/dashboard/filter_dark.png")
                        : require("../images/dashboard/filter.png")}
                    style={styles.filterIcon}
                />
                <Text style={[styles.filterText, { color: colors.text }]}>Filters</Text>
            </TouchableOpacity>

            <FlatList
                horizontal
                data={filters}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item}
                contentContainerStyle={styles.chipsWrapper}
                renderItem={({ item }) => {
                    const isActive = active === item;
                    return (
                        <TouchableOpacity
                            onPress={() => setActive(item)}
                            style={[
                                styles.chip,
                                isActive
                                    ? [styles.activeChip, { backgroundColor: colors.primarySoft }]
                                    : [styles.inactiveChip, mode === "dark" && { backgroundColor: "#2A2A2A" }],
                            ]}
                        >
                            <Text style={[styles.chipText, { color: isActive ? colors.primaryDark : (mode === "dark" ? "#CCCCCC" : "#434343") }]}>
                                {item}
                            </Text>
                        </TouchableOpacity>
                    );
                }}
            />
        </View>
    );

    const renderFooter = () => {
        if (!isFetchingMore) return <View style={{ height: hp(20) }} />;
        return (
            <ActivityIndicator style={{ marginVertical: 20 }} size="small" color={colors.primary} />
        );
    };

    return (
        <View style={styles.outerContainer}>
            <FlatList
                data={filteredFunds}
                keyExtractor={(item, index) => item.folioNo + index}
                renderItem={renderFundItem}
                ListHeaderComponent={renderHeader}
                ListFooterComponent={renderFooter}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={() => (
                    !loading ? <Text style={styles.emptyText}>No funds available</Text> : null
                )}
            />

            <TransactionModal
                visible={showModal}
                onClose={() => {
                    setShowModal(false);
                    setSelectedFolid(null);
                    setSelectedSchemeName(null);
                    setSelectedFolNo(null);

                }}
                folid={selectedFolid ?? "765"}
                folioNo={selectedFolNo ?? "N/A"}
                cid={cid ?? ""}
                schemeName={selectedSchemeName ?? ""}
            />
        </View>
    );
};

export default FilterCard;

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        paddingHorizontal: wp(16),
        overflow: 'visible',
    },
    filterRow: {
        flexDirection: "row",
        width: '99%', 
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: hp(15),
    },
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
    filterIcon: {
        width: wp(16),
        height: wp(16),
        resizeMode: "contain",
    },
    filterText: {
        fontFamily: "Urbanist-SemiBold",
        fontSize: scaleFont(12),
    },
    chipsWrapper: {
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: wp(10),
        gap: wp(8),
    },
    chip: {
        height: hp(30),
        borderRadius: wp(50),
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: wp(12),
    },
    activeChip: {
        backgroundColor: "#FFDD6D",
    },
    inactiveChip: {
        backgroundColor: "#EDEDED",
    },
    chipText: {
        fontFamily: "Urbanist-SemiBold",
        fontSize: scaleFont(12),
    },
    fundCard: {
        width: "99%",
        borderRadius: wp(16),
        paddingHorizontal: wp(16),
        paddingVertical: hp(14),
        marginBottom: hp(16),
        marginHorizontal: hp(2),
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 1,
        overflow: 'visible', 
        zIndex: 1,  
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
        marginLeft: -10,
        fontSize: scaleFont(14),
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
    },
    accountNum: {
        fontFamily: "Urbanist-SemiBold",
        fontSize: scaleFont(11),
        width: wp(84),
    },
    categoryBadge: {
        paddingHorizontal: wp(8),
        paddingVertical: hp(3),
        borderRadius: wp(20),
    },
    categoryBadgeText: {
        fontFamily: "Urbanist-SemiBold",
        fontSize: scaleFont(10),
        color: "#3A6FF8",
    },
    tag: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: wp(8),
        paddingVertical: hp(4),
        borderRadius: wp(20),
    },
    tag1: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: wp(8),
        borderRadius: wp(20),
    },
    greenDotImage: {
        width: wp(15),
        height: wp(15),
    },
    tagText: {
        fontFamily: "Urbanist-SemiBold",
        paddingLeft: wp(4),
        fontSize: scaleFont(10),
    },
    divider: {
        height: 1,
        marginBottom: hp(10),
    },
    valuesRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: hp(8),
    },
    valueCol: {
        gap: hp(2),
    },
    valueLabel: {
        fontFamily: "Urbanist-SemiBold",
        fontSize: scaleFont(12),
        color: "#9E9E9E",
    },
    valueAmount: {
        fontFamily: "Urbanist-Bold",
        fontSize: scaleFont(14),
    },
    gainText: {
        fontFamily: "Urbanist-Bold",
        fontSize: scaleFont(14),
        // color: "#1AAD00",
    },
    lossText: {
        fontFamily: "Urbanist-Bold",
        fontSize: scaleFont(14),
        // color: "#CC0000",
    },
    viewTxnBtn: {
        alignSelf: "flex-end",
    },
    viewTxnText: {
        fontFamily: "Urbanist-SemiBold",
        fontSize: scaleFont(13),
        color: "#3A6FF8",
        textDecorationLine: "underline",
    },
    emptyText: {
        textAlign: "center",
        marginTop: 50,
        fontFamily: "Urbanist-SemiBold",
        color: "#999",
    },
    dropdown: {
        position: "absolute",
        top: hp(40),
        right: wp(10),
        width: wp(145),
        backgroundColor: "#FFFFFF",
        borderRadius: wp(8),
        elevation: 5,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        zIndex: 999,
    },
    dropdownItem: {
        height: hp(35),
        justifyContent: "center",
        paddingHorizontal: wp(15),
        borderBottomWidth: 1,
        borderBottomColor: "#EAEAEA",
    },
    dropdownText: {
        fontFamily: "Urbanist-Medium",
        fontSize: scaleFont(12),
        color: "#333",
    },
});

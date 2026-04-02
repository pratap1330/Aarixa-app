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

const FILTERS = ["Equity Funds", "Debt Funds", "Hybrid Funds"];

const FilterCard = () => {
    const [showModal, setShowModal] = useState(false);
    const [cid, setCid] = useState<string | null>(null);
    const { colors, mode } = useAppTheme();
    const [active, setActive] = useState("Equity Funds");

    // Pagination States
    const [allFunds, setAllFunds] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

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

    // API Call
    const { data, loading, error } = useGet(
        cid ? `api/investor/getInvestedFunds?cid=${cid}&levelNo=1&currentPage=${currentPage}&pageSize=10` : "",
        {},
        !!cid
    );

    // Append data when API returns results
    useEffect(() => {
        if (data?.result) {
            if (currentPage === 1) {
                setAllFunds(data.result);
            } else {
                setAllFunds((prev) => [...prev, ...data.result]);
            }
            setIsFetchingMore(false);
        }
    }, [data]);

    const handleFilterChange = (filter: string) => {
        setActive(filter);
        setAllFunds([]); // Clear list for new filter
        setCurrentPage(1); // Reset to page 1
    };

    const loadMore = () => {
        // Only load more if we aren't already loading and there is data to load
        if (!loading && !isFetchingMore && data?.result?.length === 10) {
            setIsFetchingMore(true);
            setCurrentPage((prev) => prev + 1);
        }
    };

    const renderFundItem = ({ item: fund }: { item: any }) => (
        <View
            style={[
                styles.fundCard,
                { backgroundColor: mode === "dark" ? "#111111" : "#FFFFFF" },
            ]}
        >
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
                    <Image source={require("../images/dashboard/greendot.png")} style={styles.greenDotImage} />
                    <Text style={[styles.tagText, { color: mode === "dark" ? "#CCCCCC" : "#333333" }]}>Direct Plan- Growth</Text>
                </View>
                <View style={[styles.tag1, { backgroundColor: mode === "dark" ? "#2A2A2A" : "#E9E9E9" }]}>
                    <Image source={require("../images/dashboard/greendot.png")} style={styles.greenDotImage} />
                    <Text style={[styles.tagText, { color: mode === "dark" ? "#CCCCCC" : "#333333" }]}>Hybrid</Text>
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
                <View style={[styles.valueCol, { marginRight: wp(18) }]}>
                    <Text style={styles.valueLabel}>Invested Value</Text>
                    <Text style={[styles.valueAmount, { color: colors.text }]}>
                        ₹{parseFloat(fund.investedValue || 0).toLocaleString("en-IN")}
                    </Text>
                </View>
            </View>

            <View style={styles.valuesRow}>
                <View style={styles.valueCol}>
                    <Text style={styles.valueLabel}>Unrealised Gain</Text>
                    <Text style={styles.gainText}>
                        ₹{parseFloat(fund.gain || 0).toLocaleString("en-IN")}
                    </Text>
                </View>
                <View style={styles.valueCol}>
                    <Text style={styles.valueLabel}>Today's Gain/Loss</Text>
                    <Text style={styles.lossText}>
                        ₹{(parseFloat(fund.currentValue || 0) - parseFloat(fund.investedValue || 0)).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
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
                <TouchableOpacity style={styles.viewTxnBtn} onPress={() => setShowModal(true)}>
                    <Text style={styles.viewTxnText}>View Transactions</Text>
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
                    source={mode === "dark" ? require("../images/dashboard/filter_dark.png") : require("../images/dashboard/filter.png")}
                    style={styles.filterIcon}
                />
                <Text style={[styles.filterText, { color: colors.text }]}>Filters</Text>
            </TouchableOpacity>

            <FlatList
                horizontal
                data={FILTERS}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item}
                contentContainerStyle={styles.chipsWrapper}
                renderItem={({ item }) => {
                    const isActive = active === item;
                    return (
                        <TouchableOpacity
                            onPress={() => handleFilterChange(item)}
                            style={[
                                styles.chip,
                                isActive ? styles.activeChip : [styles.inactiveChip, mode === "dark" && { backgroundColor: "#2A2A2A" }],
                            ]}
                        >
                            <Text style={[styles.chipText, { color: isActive ? "#000000" : (mode === "dark" ? "#CCCCCC" : "#434343") }]}>
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
            <ActivityIndicator style={{ marginVertical: 20 }} size="small" color="#3A6FF8" />
        );
    };

    return (
        <View style={styles.outerContainer}>
            <FlatList
                data={allFunds}
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
                onClose={() => setShowModal(false)}
            />
        </View>
    );
};

export default FilterCard;

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        paddingHorizontal: wp(16),
    },
    filterRow: {
        flexDirection: "row",
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
        width: "100%",
        borderRadius: wp(16),
        paddingHorizontal: wp(16),
        paddingVertical: hp(14),
        marginBottom: hp(16),
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 6,
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
        color: "#1AAD00",
    },
    lossText: {
        fontFamily: "Urbanist-Bold",
        fontSize: scaleFont(14),
        color: "#CC0000",
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
    }
});
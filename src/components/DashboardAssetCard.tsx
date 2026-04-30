import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import Svg, { Path, Circle, Text as SvgText } from "react-native-svg";
import { wp, hp, scaleFont } from "../utils/responcive/responcive";
import { useAppTheme } from "../hooks/useTheme";
import { getService } from "../api/services/genericService/genericService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "../constants/storageKeys";

interface ChartSlice {
  id: string;
  label: string;
  percentage: number;       
  actualPercentage: number; 
  color: string;
}

const CATEGORY_COLORS: { [key: string]: string } = {
  Equity: "#1F77B4",
  Debt: "#2CA02C",
  Hybrid: "#FFB800",
  Liquidity: "#17BECF",
  Commodity: "#D62728",
  Others: "#7F7F7F", // Fallback color
};

const SIZE = wp(170);
const CX = SIZE / 2;
const CY = SIZE / 2;
const OUTER_LARGE = wp(82);
const OUTER_SMALL = wp(72);
const INNER = wp(42);
const GAP_DEG = 0;

function toRad(deg: number) { return ((deg - 90) * Math.PI) / 180; }
function pt(r: number, angleDeg: number) {
  return { x: CX + r * Math.cos(toRad(angleDeg)), y: CY + r * Math.sin(toRad(angleDeg)) };
}

function arcPath(startDeg: number, endDeg: number, outerR: number): string {
  const clamped = Math.min(endDeg, startDeg + 359.9);
  const large = clamped - startDeg > 180 ? 1 : 0;
  const os = pt(outerR, startDeg);
  const oe = pt(outerR, clamped);
  const ie = pt(INNER, clamped);
  const is_ = pt(INNER, startDeg);
  return `M${os.x},${os.y} A${outerR},${outerR} 0 ${large} 1 ${oe.x},${oe.y} L${ie.x},${ie.y} A${INNER},${INNER} 0 ${large} 0 ${is_.x},${is_.y} Z`;
}

const DonutChart: React.FC<{
  slices: ChartSlice[];
  centerColor: string;
  centerTextColor: string;
}> = ({ slices, centerColor, centerTextColor }) => {
  if (slices.length === 0) return null;
  
  let cursor = 0;
  const totalDrawingPercentage = slices.reduce((sum, s) => sum + s.percentage, 0);
  const totalActual = slices.reduce((sum, s) => sum + s.actualPercentage, 0);

  const segments = slices.map((item, index) => {
    const outerR = index % 2 === 0 ? OUTER_LARGE : OUTER_SMALL;
    const labelR = INNER + (outerR - INNER) * 0.54;
    const degrees = (item.percentage / totalDrawingPercentage) * 360;
    const start = cursor + GAP_DEG / 2;
    const end = cursor + degrees - GAP_DEG / 2;
    const mid = (start + end) / 2;
    cursor += degrees;

    const lp = pt(labelR, mid);
    const rotation = item.percentage < 8 ? mid : 0;

    return { ...item, path: arcPath(start, end, outerR), lp, rotation };
  });

  return (
    <Svg width={SIZE} height={SIZE}>
      {segments.map((s) => (
        <Path key={s.id} d={s.path} fill={s.color} />
      ))}
      <Circle cx={CX} cy={CY} r={INNER - wp(1)} fill={centerColor} />
      
      {segments.map((s) => (
        s.percentage > 0 && (
          <SvgText
            key={`lbl-${s.id}`}
            x={s.lp.x}
            y={s.lp.y}
            textAnchor="middle"
            alignmentBaseline="middle"
            fontSize={wp(10)}
            fontWeight="700"
            fill="#FFFFFF"
            transform={`rotate(${s.rotation}, ${s.lp.x}, ${s.lp.y})`}
          >
            {`${Math.round(s.actualPercentage)}%`}
          </SvgText>
        )
      ))}

      <SvgText
        x={CX}
        y={CY}
        textAnchor="middle"
        alignmentBaseline="middle"
        fontSize={wp(16)}
        fontWeight="900"
        fill={centerTextColor}
      >
        {`${Math.round(totalActual)}%`}
      </SvgText>
    </Svg>
  );
};

const Legend: React.FC<{ slices: ChartSlice[]; textColor: string }> = ({ slices, textColor }) => (
  <View style={legendStyles.container}>
    {slices.map((s) => (
      <View key={s.id} style={legendStyles.row}>
        <View style={[legendStyles.dot, { backgroundColor: s.color }]} />
        <Text style={[legendStyles.label, { color: textColor }]}>{s.label}</Text>
      </View>
    ))}
  </View>
);

const AssetsCard = () => {
  const { colors, mode } = useAppTheme();
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<ChartSlice[]>([]);

  useEffect(() => {
    fetchData();
  }, []);


  const fetchData = async () => {
  
    try {
      const storedCid = await AsyncStorage.getItem(STORAGE_KEYS.cid);
      const storedFid = await AsyncStorage.getItem(STORAGE_KEYS.fhid);
      const storedLevelNo = await AsyncStorage.getItem(STORAGE_KEYS.levelNo);
      const fhid = storedFid && storedFid.trim() !== "" ? storedFid : storedCid;
      const levelNo = storedLevelNo && !isNaN(Number(storedLevelNo)) ? Number(storedLevelNo) : 98;

      const json = await getService("api/investor/getExposure", {
        cid: storedCid,
        levelNo,
        fhid,
      });

      if (json.status === 0 && json.result.asset) {
        const assets = json.result.asset;

        // ✅ Allowed categories
        const allowed = ["Equity", "Debt", "Hybrid", "Liquidity", "Commodity"];

        // ✅ 1. Group categories
        const groupedMap: { [key: string]: number } = {};

        assets.forEach((item: any) => {
          const label = item.AUMcategory?.trim() || "Others";

          const match = allowed.find(
            (a) => a.toLowerCase() === label.toLowerCase()
          );

          const finalKey = match ? match : "Others";

          groupedMap[finalKey] =
            (groupedMap[finalKey] || 0) + (item.Amount || 0);
        });

        // ✅ 2. Total
        const totalAmount = Object.values(groupedMap).reduce(
          (sum, amt) => sum + amt,
          0
        );

        // ✅ 3. Transform data
        let transformedData: ChartSlice[] = Object.keys(groupedMap).map(
          (key, index) => {
            const amount = groupedMap[key];

            const rawPercentage =
              totalAmount === 0 ? 0 : (amount / totalAmount) * 100;

            // 👉 avoid invisible slices in chart for small but visible values
            const displayPercentage =
              rawPercentage >= 0.1 && rawPercentage < 1 ? 1 : rawPercentage;

            return {
              id: index.toString(),
              label: key,
              percentage: displayPercentage, // for chart
              actualPercentage: rawPercentage, // real %
              color: CATEGORY_COLORS[key] || "#7F7F7F",
            };
          }
        );

        // ✅ 4. REMOVE categories smaller than 0.1% entirely
        transformedData = transformedData.filter(
          (item) => item.actualPercentage >= 0.1
        );


        setChartData(transformedData);
      }
    } catch (error) {
      console.error("Error fetching exposure data:", error);
    } finally {
      setLoading(false);
    }
  };

//   const fetchData = async () => {
//   try {
//     const storedCid = await AsyncStorage.getItem("cid");
//     const storedFid = await AsyncStorage.getItem("fid");
//     const fhid = (storedFid && storedFid !== "") ? storedFid : storedCid;

//     const json = await getService("api/investor/getExposure", { 
//       cid: storedCid, 
//       levelNo: 98, 
//       fhid: fhid 
//     });

//     if (json.status === 0 && json.result.asset) {
//       const assets = json.result.asset;

//       // Allowed categories
//       const allowed = ["Equity", "Debt", "Hybrid", "Liquidity", "Commodity"];

//       // ✅ 1. Group categories
//       const groupedMap: { [key: string]: number } = {};
//       assets.forEach((item: any) => {
//         const label = item.AUMcategory?.trim() || "Others";

//         const match = allowed.find(
//           (a) => a.toLowerCase() === label.toLowerCase()
//         );

//         const finalKey = match ? match : "Others";

//         groupedMap[finalKey] =
//           (groupedMap[finalKey] || 0) + (item.Amount || 0);
//       });

//       // ✅ 2. Total
//       const totalAmount = Object.values(groupedMap).reduce(
//         (sum, amt) => sum + amt,
//         0
//       );

//       // ✅ 3. Transform for chart
//       const transformedData: ChartSlice[] = Object.keys(groupedMap).map(
//         (key, index) => {
//           const amount = groupedMap[key];

//           const rawPercentage =
//             totalAmount === 0 ? 0 : (amount / totalAmount) * 100;

//           // 👉 prevent invisible slice
//           const displayPercentage =
//             rawPercentage > 0 && rawPercentage < 1 ? 1 : rawPercentage;

//           return {
//             id: index.toString(),
//             label: key,
//             percentage: displayPercentage, // used for drawing
//             actualPercentage: rawPercentage, // real %
//             color: CATEGORY_COLORS[key] || "#7F7F7F",
//           };
//         }
//       );

//       setChartData(transformedData);
//     }
//   } catch (error) {
//     console.error("Error fetching exposure data:", error);
//   } finally {
//     setLoading(false);
//   }
// };

  const cardBg = mode === "dark" ? "#121212" : "#FFFFFF";
  const cardBorder = mode === "dark" ? "#222222" : "#F3F3F3";
  const centerColor = mode === "dark" ? "#121212" : "rgba(14,149,153,0.05)";

  return (
    <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.headerText, { color: colors.text }]}>Asset Class</Text>
      </View>

      <View style={styles.innerContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ flex: 1 }} />
        ) : chartData.length > 0 ? (
          <>
            <DonutChart
              slices={chartData}
              centerColor={centerColor}
              centerTextColor={colors.text}
            />
            <Legend slices={chartData} textColor={colors.text} />
          </>
        ) : (
          <Text style={{ color: colors.text, textAlign: 'center', flex: 1 }}>No Data Available</Text>
        )}
      </View>
    </View>
  );
};

const legendStyles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", gap: hp(7), paddingLeft: wp(10) },
  row: { flexDirection: "row", alignItems: "center", gap: wp(6) },
  dot: { width: wp(10), height: wp(10), borderRadius: wp(5) },
  label: { fontFamily: "Urbanist-SemiBold", fontSize: scaleFont(11), fontWeight: "600" },
});

const styles = StyleSheet.create({
  card: {
    width: wp(350), height: hp(237), borderRadius: wp(25), borderWidth: 1,
    shadowColor: "#EEEEEE", shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1, shadowRadius: wp(20), elevation: 8, alignSelf: 'center', marginTop: hp(20)
  },
  headerRow: { position: "absolute", top: hp(15), left: wp(15), right: wp(15), flexDirection: "row", justifyContent: "space-between" },
  headerText: { fontFamily: "Urbanist-Bold", fontSize: scaleFont(16) },
  innerContainer: { position: "absolute", top: hp(44), left: wp(29), width: wp(298), gap: wp(38), height: hp(170), flexDirection: "row", alignItems: "center" },
});

export default AssetsCard;


// import React, { useEffect, useState } from "react";
// import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
// import Svg, { Path, Circle, Text as SvgText } from "react-native-svg";
// import { wp, hp, scaleFont } from "../utils/responcive/responcive";
// import { useAppTheme } from "../hooks/useTheme";
// import { getService } from "../api/services/genericService/genericService";

// interface ChartSlice {
//   id: string;
//   label: string;
//   percentage: number;
//   actualPercentage: number;
//   color: string;
// }

// const CATEGORY_COLORS: { [key: string]: string } = {
//   Equity: "#1F77B4",
//   Debt: "#2CA02C",
//   Hybrid: "#FFB800",
//   Liquidity: "#17BECF",
//   Commodity: "#D62728",
//   Others: "#7F7F7F",
// };

// const SIZE = wp(170);
// const CX = SIZE / 2;
// const CY = SIZE / 2;
// const OUTER_LARGE = wp(82);
// const OUTER_SMALL = wp(72);
// const INNER = wp(42);
// const GAP_DEG = 0;

// function toRad(deg: number) { return ((deg - 90) * Math.PI) / 180; }
// function pt(r: number, angleDeg: number) {
//   return { x: CX + r * Math.cos(toRad(angleDeg)), y: CY + r * Math.sin(toRad(angleDeg)) };
// }

// function arcPath(startDeg: number, endDeg: number, outerR: number): string {
//   const clamped = Math.min(endDeg, startDeg + 359.9);
//   const large = clamped - startDeg > 180 ? 1 : 0;
//   const os = pt(outerR, startDeg);
//   const oe = pt(outerR, clamped);
//   const ie = pt(INNER, clamped);
//   const is_ = pt(INNER, startDeg);
//   return `M${os.x},${os.y} A${outerR},${outerR} 0 ${large} 1 ${oe.x},${oe.y} L${ie.x},${ie.y} A${INNER},${INNER} 0 ${large} 0 ${is_.x},${is_.y} Z`;
// }

// const DonutChart: React.FC<{
//   slices: ChartSlice[];
//   centerColor: string;
//   centerTextColor: string;
// }> = ({ slices, centerColor, centerTextColor }) => {
//   if (slices.length === 0) return null;
  
//   let cursor = 0;
//   const totalDrawingPercentage = slices.reduce((sum, s) => sum + s.percentage, 0);
//   const totalActual = slices.reduce((sum, s) => sum + s.actualPercentage, 0);

//   const segments = slices.map((item, index) => {
//     const outerR = index % 2 === 0 ? OUTER_LARGE : OUTER_SMALL;
//     const labelR = INNER + (outerR - INNER) * 0.54;
//     const degrees = (item.percentage / totalDrawingPercentage) * 360;
//     const start = cursor + GAP_DEG / 2;
//     const end = cursor + degrees - GAP_DEG / 2;
//     const mid = (start + end) / 2;
//     cursor += degrees;
//     const lp = pt(labelR, mid);
//     const rotation = item.percentage < 8 ? mid : 0;
//     return { ...item, path: arcPath(start, end, outerR), lp, rotation };
//   });

//   return (
//     <Svg width={SIZE} height={SIZE}>
//       {segments.map((s) => (
//         <Path key={s.id} d={s.path} fill={s.color} />
//       ))}
//       <Circle cx={CX} cy={CY} r={INNER - wp(1)} fill={centerColor} />
//       {segments.map((s) => (
//         s.actualPercentage > 0 && (
//           <SvgText
//             key={`lbl-${s.id}`}
//             x={s.lp.x}
//             y={s.lp.y}
//             textAnchor="middle"
//             alignmentBaseline="middle"
//             fontSize={wp(10)}
//             fontWeight="700"
//             fill="#FFFFFF"
//             transform={`rotate(${s.rotation}, ${s.lp.x}, ${s.lp.y})`}
//           >
//             {`${Math.round(s.actualPercentage)}%`}
//           </SvgText>
//         )
//       ))}
//       <SvgText
//         x={CX}
//         y={CY}
//         textAnchor="middle"
//         alignmentBaseline="middle"
//         fontSize={wp(16)}
//         fontWeight="900"
//         fill={centerTextColor}
//       >
//         {`${Math.round(totalActual)}%`}
//       </SvgText>
//     </Svg>
//   );
// };

// const Legend: React.FC<{ slices: ChartSlice[]; textColor: string }> = ({ slices, textColor }) => (
//   <View style={legendStyles.container}>
//     {slices.map((s) => (
//       <View key={s.id} style={legendStyles.row}>
//         <View style={[legendStyles.dot, { backgroundColor: s.color }]} />
//         <Text style={[legendStyles.label, { color: textColor }]}>{s.label}</Text>
//       </View>
//     ))}
//   </View>
// );

// const AssetsCard = ({ cid = 398 }: { cid?: number }) => {
//   const { colors, mode } = useAppTheme();
//   const [loading, setLoading] = useState(true);
//   const [chartData, setChartData] = useState<ChartSlice[]>([]);

//   useEffect(() => {
//     fetchData();
//   }, [cid]);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       // Calling API without pagination as requested
//       const response = await getService(`api/investor/getInvestedFunds?cid=${cid}&levelNo=1`);

//       if (response.status === 0 && response.result?.data) {
//         const rawData = response.result.data;

//         // 1. Group by Category and sum currentValues
//         const totalsByCategory: { [key: string]: number } = {};
//         let grandTotal = 0;

//         rawData.forEach((item: any) => {
//           const cat = item.category || "Others";
//           const value = parseFloat(item.currentValue || 0);
//           totalsByCategory[cat] = (totalsByCategory[cat] || 0) + value;
//           grandTotal += value;
//         });

//         // 2. Transform aggregated data into ChartSlices
//         const categories = Object.keys(totalsByCategory);
//         const transformedData: ChartSlice[] = categories.map((cat, index) => {
//           const amount = totalsByCategory[cat];
//           const colorKey = Object.keys(CATEGORY_COLORS).find(
//             k => k.toLowerCase() === cat.toLowerCase()
//           ) || "Others";

//           return {
//             id: index.toString(),
//             label: cat,
//             // If grandTotal is 0, distribute evenly for drawing, but 0% for actual
//             percentage: grandTotal === 0 ? (100 / categories.length) : (amount / grandTotal) * 100,
//             actualPercentage: grandTotal === 0 ? 0 : (amount / grandTotal) * 100,
//             color: CATEGORY_COLORS[colorKey] || CATEGORY_COLORS["Others"],
//           };
//         });

//         setChartData(transformedData);
//       }
//     } catch (error) {
//       console.error("Error fetching invested funds:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const cardBg = mode === "dark" ? "#121212" : "#FFFFFF";
//   const cardBorder = mode === "dark" ? "#222222" : "#F3F3F3";
//   const centerColor = mode === "dark" ? "#121212" : "rgba(14,149,153,0.05)";

//   return (
//     <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
//       <View style={styles.headerRow}>
//         <Text style={[styles.headerText, { color: colors.text }]}>Asset Class</Text>
//       </View>

//       <View style={styles.innerContainer}>
//         {loading ? (
//           <ActivityIndicator size="large" color={colors.primary} style={{ flex: 1 }} />
//         ) : chartData.length > 0 ? (
//           <>
//             <DonutChart
//               slices={chartData}
//               centerColor={centerColor}
//               centerTextColor={colors.text}
//             />
//             <Legend slices={chartData} textColor={colors.text} />
//           </>
//         ) : (
//           <Text style={{ color: colors.text, textAlign: 'center', flex: 1 }}>No Data Available</Text>
//         )}
//       </View>
//     </View>
//   );
// };

// const legendStyles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     gap: hp(7),
//     paddingLeft: wp(10),
//   },
//   row: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: wp(6),
//   },
//   dot: {
//     width: wp(10),
//     height: wp(10),
//     borderRadius: wp(5),
//   },
//   label: {
//     fontFamily: "Urbanist-SemiBold",
//     fontSize: scaleFont(11),
//     fontWeight: "600",
//   },
// });

// const styles = StyleSheet.create({
//   card: {
//     width: wp(350),
//     height: hp(237),
//     borderRadius: wp(25),
//     borderWidth: 1,
//     shadowColor: "#EEEEEE",
//     shadowOffset: { width: 0, height: 0 },
//     shadowOpacity: 1,
//     shadowRadius: wp(20),
//     elevation: 8,
//     overflow: "visible",
//     alignSelf: 'center',
//     marginTop: hp(20)
//   },
//   headerRow: {
//     position: "absolute",
//     top: hp(15),
//     left: wp(15),
//     right: wp(15),
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   headerText: {
//     width: wp(100),
//     height: hp(19),
//     fontFamily: "Urbanist-Bold",
//     fontSize: scaleFont(16),
//     lineHeight: scaleFont(16),
//     letterSpacing: 0,
//   },
//   innerContainer: {
//     position: "absolute",
//     top: hp(44),
//     left: wp(29),
//     width: wp(298),
//     gap: wp(38),
//     height: hp(170),
//     flexDirection: "row",
//     alignItems: "center",
//   },
// });

// export default AssetsCard;
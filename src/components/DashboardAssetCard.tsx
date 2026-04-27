import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import Svg, { Path, Circle, Text as SvgText } from "react-native-svg";
import { wp, hp, scaleFont } from "../utils/responcive/responcive";
import { useAppTheme } from "../hooks/useTheme";
import { getService } from "../api/services/genericService/genericService";


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
  Others: "#7F7F7F",
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
            {/* Displaying actual percentage (0% if amount is 0) */}
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
        {/* Total is 0% if all items are 0 amount */}
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
      const json = await getService("api/partner/getExposure", { cid: 398 });

      if (json.status === 0 && json.result.asset) {
        const assets = json.result.asset;
        const totalAmount = assets.reduce((sum: number, item: any) => sum + (item.Amount || 0), 0);

        const transformedData: ChartSlice[] = assets.map((item: any, index: number) => {
          const cleanLabel = item.AUMcategory.trim();
          const colorKey = Object.keys(CATEGORY_COLORS).find(
            k => k.toLowerCase() === cleanLabel.toLowerCase()
          ) || "Others";

          return {
            id: index.toString(),
            label: cleanLabel.charAt(0).toUpperCase() + cleanLabel.slice(1),
            percentage: totalAmount === 0 ? (100 / assets.length) : (item.Amount / totalAmount) * 100,
            actualPercentage: totalAmount === 0 ? 0 : (item.Amount / totalAmount) * 100,
            color: CATEGORY_COLORS[colorKey] || "#7F7F7F",
          };
        });

        setChartData(transformedData);
      }
    } catch (error) {
      console.error("Error fetching exposure data:", error);
    } finally {
      setLoading(false);
    }
  };

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
  container: {
    flex: 1,
    justifyContent: "center",
    gap: hp(7),
    paddingLeft: wp(10),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(6),
  },
  dot: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
  },
  label: {
    fontFamily: "Urbanist-SemiBold",
    fontSize: scaleFont(11),
    fontWeight: "600",
  },
});

const styles = StyleSheet.create({
  card: {
    width: wp(350),
    height: hp(237),
    borderRadius: wp(25),
    borderWidth: 1,
    shadowColor: "#EEEEEE",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: wp(20),
    elevation: 8,
    overflow: "visible",
    alignSelf: 'center',
    marginTop: hp(20)
  },
  headerRow: {
    position: "absolute",
    top: hp(15),
    left: wp(15),
    right: wp(15),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerText: {
    width: wp(100),
    height: hp(19),
    fontFamily: "Urbanist-Bold",
    fontSize: scaleFont(16),
    lineHeight: scaleFont(16),
    letterSpacing: 0,
  },
  innerContainer: {
    position: "absolute",
    top: hp(44),
    left: wp(29),
    width: wp(298),
    gap: wp(38),
    height: hp(170),
    flexDirection: "row",
    alignItems: "center",
  },
});

export default AssetsCard;
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Svg, { Path, Circle, Text as SvgText } from "react-native-svg";
import { wp, hp, scaleFont } from "../utils/responcive/responcive";
import assetData from "../data/assetData.json";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChartSlice {
  id: string;
  label: string;
  percentage: number;
  color: string;
}

// ─── Donut Chart helpers ──────────────────────────────────────────────────────

const SIZE        = wp(170);
const CX          = SIZE / 2;
const CY          = SIZE / 2;
const OUTER_LARGE = wp(82);   // figma: 170×170 slice → radius 85, minus 3px gap
const OUTER_SMALL = wp(72);   // figma: 150×152 slice → radius ~75, minus 3px gap
const INNER       = wp(42);   // figma: 83×83 hole → radius ~41.5
const GAP_DEG     = 0;

function toRad(deg: number) {
  return ((deg - 90) * Math.PI) / 180; // -90 so 0° = top
}

function pt(r: number, angleDeg: number) {
  return { x: CX + r * Math.cos(toRad(angleDeg)), y: CY + r * Math.sin(toRad(angleDeg)) };
}

function arcPath(startDeg: number, endDeg: number, outerR: number): string {
  const clamped = Math.min(endDeg, startDeg + 359.9);
  const large   = clamped - startDeg > 180 ? 1 : 0;
  const os  = pt(outerR, startDeg);
  const oe  = pt(outerR, clamped);
  const ie  = pt(INNER,  clamped);
  const is_ = pt(INNER,  startDeg);
  return `M${os.x},${os.y} A${outerR},${outerR} 0 ${large} 1 ${oe.x},${oe.y} L${ie.x},${ie.y} A${INNER},${INNER} 0 ${large} 0 ${is_.x},${is_.y} Z`;
}

// ─── Donut Chart component ────────────────────────────────────────────────────

const DonutChart: React.FC<{ slices: ChartSlice[] }> = ({ slices }) => {
  let cursor = 0;

  // sum of all percentages — used for center label + normalization
  const total = slices.reduce((sum, s) => sum + s.percentage, 0);

  const segments = slices.map((item, index) => {
    // alternating large/small by index — automatic, no JSON field needed
    const outerR   = index % 2 === 0 ? OUTER_LARGE : OUTER_SMALL;
    const labelR   = INNER + (outerR - INNER) * 0.54;
    // normalize so slices always fill 360° regardless of whether data sums to 100
    const degrees  = (item.percentage / total) * 360;
    const start    = cursor + GAP_DEG / 2;
    const end      = cursor + degrees - GAP_DEG / 2;
    const mid      = (start + end) / 2;
    cursor        += degrees;

    const lp       = pt(labelR, mid);
    const rotation = item.percentage < 8 ? mid : 0;

    return { ...item, path: arcPath(start, end, outerR), lp, rotation };
  });

  return (
    <Svg width={SIZE} height={SIZE}>
      {/* Slices */}
      {segments.map((s) => (
        <Path key={s.id} d={s.path} fill={s.color} />
      ))}

      {/* Hole */}
      <Circle cx={CX} cy={CY} r={INNER - wp(1)} fill="rgba(14,149,153,0.05)" />

      {/* Percentage labels on each slice */}
      {segments.map((s) => (
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
          {`${s.percentage}%`}
        </SvgText>
      ))}

      {/* Center total — dynamic from data */}
      <SvgText
        x={CX}
        y={CY}
        textAnchor="middle"
        alignmentBaseline="middle"
        fontSize={wp(16)}
        fontWeight="900"
        fill="#070707"
      >
        {`${total}%`}
      </SvgText>
    </Svg>
  );
};

const AssetsCard = () => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>Asset Class</Text>

        <Image
          source={require('../images/card/dot.png')}
          style={styles.dotIcon}
          resizeMode="contain"
        />
      </View>

      <View style={styles.innerContainer}>
        <DonutChart slices={assetData.chart as ChartSlice[]} />

        <Image
          source={require("../images/card/frame.png")}
          style={styles.frameImage}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: wp(350),
    height: hp(237),
    borderRadius: wp(25),
    borderWidth: 1,
    borderColor: "#F3F3F3",
    backgroundColor: "#FFFFFF",
    opacity: 1,
    // Shadow (iOS)
    shadowColor: "#EEEEEE",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: wp(20),
    // Elevation (Android)
    elevation: 8,
    overflow: "visible",
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
    // fontWeight: "700",
    fontSize: scaleFont(16),
    lineHeight: scaleFont(16),
    letterSpacing: 0,
    color: "#000000",
  },

  dotIcon: {
    width: wp(16),
    height: hp(16),
    opacity: 1,
  },

  innerContainer: {
    position: "absolute",
    top: hp(44),
    left: wp(29),
    width: wp(298),
    height: hp(170),
    flexDirection: "row",
    alignItems: "center",
    gap: 0,
    opacity: 1,
  },

  frameImage: {
    flex: 1,
    height: hp(118),
    opacity: 1,
  },
});

export default AssetsCard;
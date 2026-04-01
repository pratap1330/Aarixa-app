import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Svg, { Path, Circle, Text as SvgText } from "react-native-svg";
import { wp, hp, scaleFont } from "../utils/responcive/responcive";
import assetData from "../data/assetData.json";
import { useAppTheme } from "../hooks/useTheme";

interface ChartSlice {
  id: string;
  label: string;
  percentage: number;
  color: string;
}

const SIZE        = wp(170);
const CX          = SIZE / 2;
const CY          = SIZE / 2;
const OUTER_LARGE = wp(82);   
const OUTER_SMALL = wp(72);   
const INNER       = wp(42);  
const GAP_DEG     = 0;

function toRad(deg: number) {
  return ((deg - 90) * Math.PI) / 180; 
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

const DonutChart: React.FC<{
  slices: ChartSlice[];
  centerColor: string;
  centerTextColor: string;
}> = ({ slices, centerColor, centerTextColor }) => {
  let cursor = 0;

  const total = slices.reduce((sum, s) => sum + s.percentage, 0);

  const segments = slices.map((item, index) => {
    const outerR   = index % 2 === 0 ? OUTER_LARGE : OUTER_SMALL;
    const labelR   = INNER + (outerR - INNER) * 0.54;
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
      {segments.map((s) => (
        <Path key={s.id} d={s.path} fill={s.color} />
      ))}

      <Circle cx={CX} cy={CY} r={INNER - wp(1)} fill={centerColor} />

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

      <SvgText
        x={CX}
        y={CY}
        textAnchor="middle"
        alignmentBaseline="middle"
        fontSize={wp(16)}
        fontWeight="900"
        fill={centerTextColor}
      >
        {`${total}%`}
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

  const cardBg      = mode === "dark" ? "#121212" : "#FFFFFF";
  const cardBorder  = mode === "dark" ? "#222222" : "#F3F3F3";
  const centerColor = mode === "dark" ? "#121212" : "rgba(14,149,153,0.05)";

  return (
    <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.headerText, { color: colors.text }]}>Asset Class</Text>

        <Image
          source={require('../images/card/dot.png')}
          style={[styles.dotIcon, mode === "dark" && { tintColor: "#FFFFFF" }]}
          resizeMode="contain"
        />
      </View>

      <View style={styles.innerContainer}>
        <DonutChart
          slices={assetData.chart as ChartSlice[]}
          centerColor={centerColor}
          centerTextColor={colors.text}
        />

        <Legend slices={assetData.chart as ChartSlice[]} textColor={colors.text} />
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
    gap :wp(38),
    height: hp(170),
    flexDirection: "row",
    alignItems: "center",
  },
});

export default AssetsCard;



// import React from "react";
// import { View, Text, Image, StyleSheet } from "react-native";
// import Svg, { Path, Circle, Text as SvgText } from "react-native-svg";
// import { wp, hp, scaleFont } from "../utils/responcive/responcive";
// import assetData from "../data/assetData.json";
// import { useAppTheme } from "../hooks/useTheme"; // ✅ added

// // ─── Types ────────────────────────────────────────────────────────────────────
// interface ChartSlice {
//   id: string;
//   label: string;
//   percentage: number;
//   color: string;
// }

// // ─── Donut Chart helpers ──────────────────────────────────────────────────────
// const SIZE = wp(170);
// const CX = SIZE / 2;
// const CY = SIZE / 2;
// const OUTER_LARGE = wp(82);
// const OUTER_SMALL = wp(72);
// const INNER = wp(42);
// const GAP_DEG = 0;

// function toRad(deg: number) {
//   return ((deg - 90) * Math.PI) / 180;
// }

// function pt(r: number, angleDeg: number) {
//   return {
//     x: CX + r * Math.cos(toRad(angleDeg)),
//     y: CY + r * Math.sin(toRad(angleDeg)),
//   };
// }

// function arcPath(startDeg: number, endDeg: number, outerR: number): string {
//   const clamped = Math.min(endDeg, startDeg + 359.9);
//   const large = clamped - startDeg > 180 ? 1 : 0;
//   const os = pt(outerR, startDeg);
//   const oe = pt(outerR, clamped);
//   const ie = pt(INNER, clamped);
//   const is_ = pt(INNER, startDeg);

//   return `M${os.x},${os.y} A${outerR},${outerR} 0 ${large} 1 ${oe.x},${oe.y} 
//           L${ie.x},${ie.y} 
//           A${INNER},${INNER} 0 ${large} 0 ${is_.x},${is_.y} Z`;
// }

// // ─── Donut Chart ──────────────────────────────────────────────────────────────
// const DonutChart: React.FC<{ slices: ChartSlice[] }> = ({ slices }) => {
//   const { colors, mode } = useAppTheme(); // ✅ theme access

//   let cursor = 0;
//   const total = slices.reduce((sum, s) => sum + s.percentage, 0);

//   const segments = slices.map((item, index) => {
//     const outerR = index % 2 === 0 ? OUTER_LARGE : OUTER_SMALL;
//     const labelR = INNER + (outerR - INNER) * 0.54;

//     const degrees = (item.percentage / total) * 360;
//     const start = cursor + GAP_DEG / 2;
//     const end = cursor + degrees - GAP_DEG / 2;
//     const mid = (start + end) / 2;

//     cursor += degrees;

//     const lp = pt(labelR, mid);

//     return {
//       ...item,
//       path: arcPath(start, end, outerR),
//       lp,
//     };
//   });

//   return (
//     <Svg width={SIZE} height={SIZE}>
//       {/* Slices */}
//       {segments.map((s) => (
//         <Path key={s.id} d={s.path} fill={s.color} />
//       ))}

//       {/* Hole */}
//       <Circle
//         cx={CX}
//         cy={CY}
//         r={INNER - wp(1)}
//         fill={mode === "dark" ? "#1A1A1A" : "rgba(14,149,153,0.05)"} // ✅ dynamic
//       />

//       {/* Labels */}
//       {segments.map((s) => (
//         <SvgText
//           key={`lbl-${s.id}`}
//           x={s.lp.x}
//           y={s.lp.y}
//           textAnchor="middle"
//           alignmentBaseline="middle"
//           fontSize={wp(10)}
//           fontWeight="700"
//           fill="#FFFFFF"
//         >
//           {`${s.percentage}%`}
//         </SvgText>
//       ))}

//       {/* Center total */}
//       <SvgText
//         x={CX}
//         y={CY}
//         textAnchor="middle"
//         alignmentBaseline="middle"
//         fontSize={wp(16)}
//         fontWeight="900"
//         fill={colors.text} // ✅ dynamic
//       >
//         {`${total}%`}
//       </SvgText>
//     </Svg>
//   );
// };

// // ─── Main Card ────────────────────────────────────────────────────────────────
// const AssetsCard = () => {
//   const { colors, mode } = useAppTheme(); // ✅ theme

//   return (
//     <View
//       style={[
//         styles.card,
//         {
//           backgroundColor: colors.card,
//           borderColor: mode === "dark" ? "#222" : "#F3F3F3",
//         },
//       ]}
//     >
//       <View style={styles.headerRow}>
//         <Text style={[styles.headerText, { color: colors.text }]}>
//           Asset Class
//         </Text>

//         <Image
//           source={
//             mode === "light"
//               ? require("../images/card/dot.png"):
//            ""   // : require("../images/card/dot-white.png") // ✅ add dark icon
//           }
//           style={styles.dotIcon}
//         />
//       </View>

//       <View style={styles.innerContainer}>
//         <DonutChart slices={assetData.chart as ChartSlice[]} />

//         <Image
//           source={require("../images/card/frame.png")}
//           style={styles.frameImage}
//         />
//       </View>
//     </View>
//   );
// };

// export default AssetsCard;

// // ─── Styles ───────────────────────────────────────────────────────────────────
// const styles = StyleSheet.create({
//   card: {
//     width: wp(350),
//     height: hp(237),
//     borderRadius: wp(25),
//     borderWidth: 1,

//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 0 },
//     shadowOpacity: 0.2,
//     shadowRadius: wp(20),
//     elevation: 8,
//   },

//   headerRow: {
//     position: "absolute",
//     top: hp(15),
//     left: wp(15),
//     right: wp(15),
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },

//   headerText: {
//     fontFamily: "Urbanist-Bold",
//     fontSize: scaleFont(16),
//   },

//   dotIcon: {
//     width: wp(16),
//     height: hp(16),
//   },

//   innerContainer: {
//     position: "absolute",
//     top: hp(44),
//     left: wp(29),
//     width: wp(298),
//     height: hp(170),
//     flexDirection: "row",
//     alignItems: "center",
//   },

//   frameImage: {
//     flex: 1,
//     height: hp(118),
//   },
// });
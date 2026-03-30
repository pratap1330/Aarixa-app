// components/BannerCarousel.tsx

import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  ImageSourcePropType,
} from "react-native";

import { wp, hp } from "../utils/responcive/responcive";

export interface BannerItem {
  id: string;
  uri?: string;
  source?: ImageSourcePropType;
}

interface BannerCarouselProps {
  banners?: BannerItem[];
  autoPlayInterval?: number;
}

const DEFAULT_BANNERS: BannerItem[] = [
  { id: "1", source: require("../images/headerImage/banner.png") },
];

// ✅ Replace scale with wp/hp
const CARD_WIDTH = wp(358);
const CARD_HEIGHT = hp(150);

const BannerCarousel: React.FC<BannerCarouselProps> = ({
  banners = DEFAULT_BANNERS,
  autoPlayInterval = 3000,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<BannerItem>>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (banners.length <= 1) return;

    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % banners.length;
        flatListRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, autoPlayInterval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [banners.length, autoPlayInterval]);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: Array<{ index: number | null }> }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setActiveIndex(viewableItems[0].index);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const renderItem = ({ item }: { item: BannerItem }) => (
    <View style={styles.slide}>
      <Image
        source={item.uri ? { uri: item.uri } : (item.source as ImageSourcePropType)}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );

  return (
    <View style={styles.wrapper}>
      <FlatList
        ref={flatListRef}
        data={banners}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(_, index) => ({
          length: CARD_WIDTH,
          offset: CARD_WIDTH * index,
          index,
        })}
        scrollEventThrottle={16}
        onScrollBeginDrag={() => {
          if (timerRef.current) clearInterval(timerRef.current);
        }}
        onScrollEndDrag={() => {
          if (banners.length <= 1) return;

          timerRef.current = setInterval(() => {
            setActiveIndex((prev) => {
              const next = (prev + 1) % banners.length;
              flatListRef.current?.scrollToIndex({ index: next, animated: true });
              return next;
            });
          }, autoPlayInterval);
        }}
      />

      {banners.length > 1 && (
        <View style={styles.dots}>
          {banners.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === activeIndex && styles.dotActive]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default BannerCarousel;

const styles = StyleSheet.create({
  wrapper: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },

  slide: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: wp(25), 
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  dots: {
    position: "absolute",
    bottom: hp(10),
    alignSelf: "center",
    flexDirection: "row",
    gap: wp(5),
  },

  dot: {
    width: wp(6),
    height: wp(6),
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.5)",
  },

  dotActive: {
    width: wp(18),
    backgroundColor: "#fff",
  },
});
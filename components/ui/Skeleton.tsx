import { useEffect, useRef } from 'react';
import type { ViewStyle } from 'react-native';
import { Animated, StyleSheet, View } from 'react-native';

function usePulse() {
  const opacity = useRef(new Animated.Value(0.6)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.6, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);
  return opacity;
}

export function SkeletonBox({
  height,
  width,
  radius = 8,
  style,
}: {
  height: number;
  width?: number | string; // ← geen 'as const' nodig
  radius?: number;
  style?: ViewStyle;
}) {
  const opacity = usePulse();
  return (
    <Animated.View
      style={[
        styles.box,
        {
          height,
          width: width ?? '100%',
          borderRadius: radius,
          opacity,
        },
        style,
      ]}
    />
  );
}

export function SkeletonLine({
  width = '100%',
  height = 14,
}: {
  width?: number | string; // ← geen 'as const' nodig
  height?: number;
}) {
  return <SkeletonBox width={width} height={height} radius={6} style={{ marginVertical: 6 }} />;
}

/* ----- Screen-specifieke skeletons ----- */

export function SkeletonHero() {
  return (
    <View style={styles.hero}>
      <SkeletonLine width={120} height={16} />
      <View style={{ height: 12 }} />
      <SkeletonLine width="60%" height={40} />
      <View style={{ height: 8 }} />
      <SkeletonLine width={70} height={22} />
      <View style={{ height: 16 }} />
      {/* type chips */}
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <SkeletonBox width={100} height={34} radius={18} />
        <SkeletonBox width={100} height={34} radius={18} />
      </View>
      {/* image overlap */}
      <View style={{ alignItems: 'center' }}>
        <SkeletonBox width={240} height={240} radius={120} style={{ marginTop: 20 }} />
      </View>
    </View>
  );
}

export function SkeletonTabs() {
  return (
    <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
        <SkeletonLine width={70} height={18} />
        <SkeletonLine width={60} height={18} />
        <SkeletonLine width={100} height={18} />
      </View>
      <SkeletonBox width="100%" height={2} radius={2} />
    </View>
  );
}

export function SkeletonAboutCard() {
  return (
    <View style={styles.card}>
      {Array.from({ length: 7 }).map((_, i) => (
        <View key={i} style={styles.row}>
          <SkeletonLine width={100} />
          <SkeletonLine width={140} />
        </View>
      ))}
    </View>
  );
}

export function SkeletonStatsCard() {
  return (
    <View style={styles.card}>
      {Array.from({ length: 6 }).map((_, i) => (
        <View key={i} style={{ marginBottom: 16 }}>
          <View style={[styles.row, { marginBottom: 6 }]}>
            <SkeletonLine width={120} />
            <SkeletonLine width={40} />
          </View>
          <SkeletonBox width="100%" height={10} radius={999} />
        </View>
      ))}
    </View>
  );
}

export function SkeletonEvolutionList() {
  return (
    <View style={styles.card}>
      {Array.from({ length: 3 }).map((_, i) => (
        <View key={i} style={styles.evoItem}>
          {/* grijze image-strip links, wit content rechts */}
          <View style={styles.evoLeft}>
            <SkeletonBox width={64} height={64} radius={14} style={{ alignSelf: 'flex-start' }} />
            {/* dotted connector onder de image */}
            <View style={styles.dotsUnder}>
              <SkeletonDot />
              <SkeletonDot />
              <SkeletonDot />
            </View>
          </View>
          <View style={styles.evoRight}>
            <SkeletonBox width={48} height={22} radius={12} style={{ alignSelf: 'flex-start', marginBottom: 8 }} />
            <SkeletonLine width={150} height={20} />
          </View>
        </View>
      ))}
    </View>
  );
}

function SkeletonDot() {
  return <SkeletonBox width={6} height={6} radius={3} style={{ marginVertical: 6 }} />;
}

const styles = StyleSheet.create({
  box: { backgroundColor: '#EEF0F3' },
  hero: {
    height: 360,
    backgroundColor: '#E9F2F8',
    paddingHorizontal: 20,
    paddingTop: 12,
    position: 'relative',
  },
  card: {
    marginHorizontal: 20,
    marginBottom: 22,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    shadowColor: '#1D1D1D',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  evoItem: {
    flexDirection: 'row',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#F8F9FB',
  },
  evoLeft: { width: 104, backgroundColor: '#EEF0F3', padding: 16, alignItems: 'center' },
  evoRight: { flex: 1, backgroundColor: '#FFFFFF', padding: 16, justifyContent: 'center' },
  dotsUnder: { position: 'absolute', bottom: 8, alignItems: 'center' },
});

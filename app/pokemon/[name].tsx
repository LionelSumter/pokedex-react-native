// app/pokemon/[name].tsx
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';

import { BlurView } from 'expo-blur';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { TabView } from 'react-native-tab-view';

import { PokemonImage } from '@/components/ui/pokemon-image';
import { TYPE_COLORS } from '@/constants/pokemon-types';
import { getTokens } from '@/constants/tokens';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEvolutionChainByName } from '@/hooks/use-evolution';
import { useIsFavorite, useToggleFavorite } from '@/hooks/use-favorites';
import { usePokemonByName } from '@/hooks/use-pokemon';
import { i18n } from '@/lib/i18n';

type TabKey = 'about' | 'stats' | 'evolution';

const DETAIL = {
  padX: 24,

  chipsToImage: 24,
  imageOverlap: 50,

  // Tabs
  tabsTopFromSheet: 74,
  tabsItemW: 114,
  tabsItemH: 24,
  tabsTrackH: 2,
  tabsToContent: 24,

  // Stats
  statsRowGap: 24,
  statsTextToBar: 8,
  statsBarH: 4,

  // Evolution
  evoCardGap: 38,
  evoCardH: 80,
  evoRadius: 8,
  evoWellW: 80,
  evoWellBg: '#F6F6FF',
  evoInnerPad: 12,
  evoNameGap: 8,
  evoSpriteSize: 64,
  evoConnectorH: 14,

  tabbarH: 84,
} as const;

export const STAT_MAX_BY_NAME: Record<string, number> = {
  hp: 255,
  attack: 190,
  defense: 230,
  'special-attack': 194,
  'special-defense': 230,
  speed: 200,
};

function pad3(n: number) {
  return String(n).padStart(3, '0');
}

function titleCase(s: string) {
  if (!s) return s;
  return s
    .split(/[-\s]+/g)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

const SOFT_CARD_SHADOW = {
  shadowColor: '#000',
  shadowOpacity: 0.08,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 6 },
  elevation: 3,
} as const;

const HEADER_TOTAL_H = 100;

/** ✅ TYPE COLORS SAFE MAP */
const TYPE_COLORS_SAFE: Record<string, string> =
  TYPE_COLORS && typeof TYPE_COLORS === 'object' ? (TYPE_COLORS as any) : {};

function getTypeColor(typeName: string) {
  const key = String(typeName ?? '').toLowerCase();
  return TYPE_COLORS_SAFE[key] ?? '#999';
}

function createStyles(tokens: ReturnType<typeof getTokens>, scheme: 'light' | 'dark') {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: tokens.color.surface.card },
    container: { flex: 1, backgroundColor: tokens.color.surface.card },

    heroBg: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: tokens.color.surface.background,
    },

    headerRow: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      elevation: 50,
      paddingHorizontal: DETAIL.padX,
      justifyContent: 'flex-end',
      backgroundColor: 'transparent',
      overflow: 'hidden',
    },
    headerTint: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor:
        scheme === 'dark' ? 'rgba(18, 26, 46, 0.70)' : 'rgba(237, 246, 255, 0.50)',
    },
    headerInner: {
      height: 44,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    backText: {
      fontFamily: tokens.typography.family.regular,
      fontSize: 17,
      lineHeight: 22,
      color: tokens.color.primary.midnight,
    },

    pageScroll: { flex: 1, backgroundColor: tokens.color.surface.card },
    scrollContent: { backgroundColor: tokens.color.surface.card },

    titleRow: {
      paddingHorizontal: DETAIL.padX,
      marginTop: 16,
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 16,
    },
    title: {
      fontFamily: tokens.typography.family.heading,
      fontSize: 32,
      lineHeight: 38,
      color: tokens.color.primary.midnight,
      textTransform: 'capitalize',
    },
    idBadge: {
      fontFamily: tokens.typography.family.regular,
      fontSize: 24,
      lineHeight: 28,
      color: tokens.color.primary.midnight,
      opacity: 0.25,
    },

    chipsRow: {
      marginTop: 12,
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: 14,
      height: 36,
      borderRadius: 999,
      backgroundColor:
        scheme === 'dark' ? 'rgba(233, 230, 255, 0.10)' : 'rgba(14, 9, 64, 0.08)',
    },
    dot: { width: 10, height: 10, borderRadius: 999, backgroundColor: '#FFD000' },
    chipText: {
      fontFamily: tokens.typography.family.medium,
      fontSize: 16,
      lineHeight: 18,
      color: tokens.color.primary.midnight,
      textTransform: 'capitalize',
    },

    imageWrap: {
      marginTop: DETAIL.chipsToImage,
      alignItems: 'center',
      zIndex: 10,
      elevation: 10,
    },

    sheet: {
      flexGrow: 1,
      marginTop: -DETAIL.imageOverlap,
      backgroundColor: tokens.color.surface.card,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
    },

    // Custom tab bar
    tabsWrap: {
      position: 'absolute',
      top: DETAIL.tabsTopFromSheet,
      left: 0,
      right: 0,
      paddingHorizontal: DETAIL.padX,
      zIndex: 10,
      elevation: 10,
    },
    tabsRow: { flexDirection: 'row', height: DETAIL.tabsItemH },
    tabBtn: {
      width: DETAIL.tabsItemW,
      height: DETAIL.tabsItemH,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tabLabel: {
      fontFamily: tokens.typography.family.semibold,
      fontSize: 14,
      lineHeight: 16,
      color: tokens.color.text.muted,
    },
    tabLabelActive: { color: tokens.color.primary.midnight },

    // ✅ “vorige balkje / track” in dark mode
    track: {
      marginTop: 10,
      height: DETAIL.tabsTrackH,
      width: '100%',
      backgroundColor:
        scheme === 'dark' ? 'rgba(233, 230, 255, 0.12)' : 'rgba(14, 9, 64, 0.10)',
      position: 'relative',
    },
    indicator: {
      position: 'absolute',
      top: 0,
      height: DETAIL.tabsTrackH,
      width: DETAIL.tabsItemW,
      backgroundColor: tokens.color.primary.purple,
    },

    // About
    scenePad: {
      paddingHorizontal: DETAIL.padX,
      rowGap: 16,
    },
    aboutRow: { flexDirection: 'row', columnGap: 16, alignItems: 'flex-start' },
    aboutKey: {
      width: 110,
      fontFamily: tokens.typography.family.semibold,
      fontSize: 14,
      lineHeight: 20,
      color: tokens.color.primary.midnight,
    },
    aboutVal: {
      flex: 1,
      fontFamily: tokens.typography.family.regular,
      fontSize: 14,
      lineHeight: 20,
      color: scheme === 'dark' ? tokens.color.text.muted : 'rgba(14, 9, 64, 0.60)',
      textTransform: 'capitalize',
    },

    // Stats
    statsPad: {
      paddingHorizontal: DETAIL.padX,
      rowGap: DETAIL.statsRowGap,
    },
    statBlock: { width: '100%' },
    statTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    },
    statLabel: {
      fontFamily: tokens.typography.family.semibold,
      fontSize: 14,
      lineHeight: 16,
      color: tokens.color.primary.midnight,
    },
    statValue: {
      fontFamily: tokens.typography.family.regular,
      fontSize: 14,
      lineHeight: 16,
      color: tokens.color.primary.midnight,
      opacity: 0.6,
    },
    statTrack: {
      marginTop: DETAIL.statsTextToBar,
      height: DETAIL.statsBarH,
      borderRadius: 999,
      backgroundColor:
        scheme === 'dark' ? 'rgba(233, 230, 255, 0.12)' : 'rgba(14, 9, 64, 0.10)',
      overflow: 'hidden',
    },
    statFill: {
      height: '100%',
      borderRadius: 999,
      backgroundColor: tokens.color.primary.purple,
    },

    // Evolution
    evoList: {
      paddingHorizontal: DETAIL.padX,
    },

    evoCard: {
      height: DETAIL.evoCardH,
      borderRadius: DETAIL.evoRadius,
      backgroundColor: tokens.color.surface.card,
      flexDirection: 'row',
      overflow: 'hidden',
      ...(tokens.shadow?.soft ?? SOFT_CARD_SHADOW),
    },
    evoWell: {
      width: DETAIL.evoWellW,
      height: '100%',
      backgroundColor: scheme === 'dark' ? 'rgba(233, 230, 255, 0.06)' : DETAIL.evoWellBg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    evoSprite: {
      width: DETAIL.evoSpriteSize,
      height: DETAIL.evoSpriteSize,
    },
    evoBody: {
      flex: 1,
      padding: DETAIL.evoInnerPad,
      justifyContent: 'center',
      rowGap: DETAIL.evoNameGap,
    },
    evoBadge: {
      alignSelf: 'flex-start',
      backgroundColor: tokens.color.primary.purple,
      borderRadius: 4,
      paddingHorizontal: 6,
      paddingVertical: 2,
    },
    evoBadgeText: {
      fontFamily: tokens.typography.family.medium,
      fontSize: 10,
      lineHeight: 12,
      color: tokens.color.text.onPrimary,
    },
    evoName: {
      fontFamily: tokens.typography.family.medium,
      fontSize: 16,
      lineHeight: 20,
      color: tokens.color.primary.midnight,
      textTransform: 'capitalize',
    },

    evoSep: {
      height: DETAIL.evoCardGap,
      flexDirection: 'row',
      alignItems: 'center',
    },
    evoSepWell: {
      width: DETAIL.evoWellW,
      alignItems: 'center',
      justifyContent: 'center',
    },
    evoSepLine: {
      height: DETAIL.evoConnectorH,
      borderLeftWidth: 2,
      borderStyle: 'dotted',
      borderLeftColor:
        scheme === 'dark' ? 'rgba(233, 230, 255, 0.30)' : 'rgba(14, 9, 64, 0.30)',
    },

    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    centerSmall: { alignItems: 'center', justifyContent: 'center' },
    muted: {
      marginTop: 8,
      fontFamily: tokens.typography.family.base,
      fontSize: 14,
      color: tokens.color.text.muted,
    },
    errorTitle: {
      fontFamily: tokens.typography.family.bold,
      fontSize: 18,
      color: tokens.color.status.error,
    },
  });
}

export default function PokemonDetailScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const scheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const tokens = useMemo(() => getTokens(scheme), [scheme]);
  const s = useMemo(() => createStyles(tokens, scheme), [tokens, scheme]);

  const pokemonName = String(name ?? '').toLowerCase();

  const { data: pokemon, isLoading, error } = usePokemonByName(pokemonName);
  const { steps: evoSteps, isLoading: evoLoading, error: evoError } =
    useEvolutionChainByName(pokemonName);

  const pokemonId = pokemon?.id;
  const { data: isFav } = useIsFavorite(pokemonId);
  const toggleFavorite = useToggleFavorite();

  const bottomPad = DETAIL.tabbarH + insets.bottom + 24;

  const [sheetTopY, setSheetTopY] = useState<number>(460);

  const types = useMemo(() => {
    const arr = pokemon?.types ?? [];
    return arr
      .map((t: any) => String(t?.type?.name ?? '').toLowerCase())
      .filter(Boolean) as string[];
  }, [pokemon]);

  const headerH = HEADER_TOTAL_H;

  const routes = useMemo(
    () => [
      { key: 'about' as const, title: i18n.t('tabs.about') },
      { key: 'stats' as const, title: i18n.t('tabs.stats') },
      { key: 'evolution' as const, title: i18n.t('tabs.evolution') },
    ],
    []
  );
  const [index, setIndex] = useState(0);
  const tabKey = routes[index]?.key as TabKey;

  const contentTopPad =
    DETAIL.tabsTopFromSheet + DETAIL.tabsItemH + DETAIL.tabsToContent;

  const [sceneHeights, setSceneHeights] = useState<Record<TabKey, number>>({
    about: 0,
    stats: 0,
    evolution: 0,
  });

  const tabViewHeight = Math.max(
    320,
    (sceneHeights[tabKey] || 0) + contentTopPad + bottomPad
  );

  const AboutRow = ({ label, value }: { label: string; value: string }) => (
    <View style={s.aboutRow}>
      <Text style={s.aboutKey}>{label}</Text>
      <Text style={s.aboutVal}>{value}</Text>
    </View>
  );

  const EvolutionSeparator = () => (
    <View style={s.evoSep}>
      <View style={s.evoSepWell}>
        <View style={s.evoSepLine} />
      </View>
      <View style={{ flex: 1 }} />
    </View>
  );

  const EvolutionCard = ({ id, name }: { id: number; name: string }) => {
    const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

    return (
      <View style={s.evoCard}>
        <View style={s.evoWell}>
          <Image source={{ uri: spriteUrl }} style={s.evoSprite} resizeMode="contain" />
        </View>

        <View style={s.evoBody}>
          <View style={s.evoBadge}>
            <Text style={s.evoBadgeText}>{pad3(id)}</Text>
          </View>

          <Text style={s.evoName}>{titleCase(name)}</Text>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={s.safe} edges={['left', 'right']}>
        <View style={s.center}>
          <ActivityIndicator size="large" />
          <Text style={s.muted}>{i18n.t('common.loading')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!pokemon || error) {
    return (
      <SafeAreaView style={s.safe} edges={['left', 'right']}>
        <View style={s.center}>
          <Text style={s.errorTitle}>{i18n.t('common.error')}</Text>
          <Text style={s.muted}>
            {error instanceof Error ? error.message : i18n.t('common.failedToLoad')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const favorite = !!isFav;

  const renderTabBar = () => {
    return (
      <View style={s.tabsWrap}>
        <View style={s.tabsRow}>
          {routes.map((r, i) => {
            const active = i === index;
            return (
              <Pressable
                key={r.key}
                style={s.tabBtn}
                onPress={() => setIndex(i)}
                hitSlop={6}
              >
                <Text style={[s.tabLabel, active && s.tabLabelActive]}>
                  {r.title}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={s.track}>
          <View
            style={[
              s.indicator,
              { transform: [{ translateX: index * DETAIL.tabsItemW }] },
            ]}
          />
        </View>
      </View>
    );
  };

  const renderAbout = () => (
    <View
      style={[s.scenePad, { paddingTop: contentTopPad, paddingBottom: bottomPad }]}
      onLayout={(e) => {
        const h = e.nativeEvent.layout.height;
        setSceneHeights((prev) => (prev.about === h ? prev : { ...prev, about: h }));
      }}
    >
      <AboutRow label={i18n.t('details.name')} value={titleCase(pokemon.name)} />
      <AboutRow label={i18n.t('details.id')} value={pad3(pokemon.id)} />
      <AboutRow label={i18n.t('details.base')} value={String(pokemon.base_experience ?? '-')} />
      <AboutRow label={i18n.t('details.weight')} value={`${(pokemon.weight ?? 0) / 10} kg`} />
      <AboutRow label={i18n.t('details.height')} value={`${(pokemon.height ?? 0) / 10} m`} />
      <AboutRow label={i18n.t('details.types')} value={types.map(titleCase).join(', ') || '-'} />
      <AboutRow
        label={i18n.t('details.abilities')}
        value={(pokemon.abilities ?? [])
          .map((a: any) => a?.ability?.name)
          .filter(Boolean)
          .map(titleCase)
          .join(', ') || '-'}
      />
    </View>
  );

  const renderStats = () => (
    <View
      style={[s.statsPad, { paddingTop: contentTopPad, paddingBottom: bottomPad }]}
      onLayout={(e) => {
        const h = e.nativeEvent.layout.height;
        setSceneHeights((prev) => (prev.stats === h ? prev : { ...prev, stats: h }));
      }}
    >
      {(pokemon.stats ?? []).map((st: any) => {
        const key = String(st?.stat?.name ?? '');
        const value = Number(st?.base_stat ?? 0);
        const max = STAT_MAX_BY_NAME[key] ?? 255;
        const pct = clamp01(value / max);

        return (
          <View key={key} style={s.statBlock}>
            <View style={s.statTop}>
              <Text style={s.statLabel}>{i18n.t(`stats.${key}`)}</Text>
              <Text style={s.statValue}>{value}</Text>
            </View>

            <View style={s.statTrack}>
              <View style={[s.statFill, { width: `${pct * 100}%` }]} />
            </View>
          </View>
        );
      })}
    </View>
  );

  const renderEvolution = () => (
    <View
      style={{ paddingBottom: bottomPad }}
      onLayout={(e) => {
        const h = e.nativeEvent.layout.height;
        setSceneHeights((prev) =>
          prev.evolution === h ? prev : { ...prev, evolution: h }
        );
      }}
    >
      {evoLoading ? (
        <View style={[s.centerSmall, { paddingTop: contentTopPad }]}>
          <ActivityIndicator />
          <Text style={s.muted}>{i18n.t('details.loadingEvolution')}</Text>
        </View>
      ) : evoError ? (
        <View style={[s.centerSmall, { paddingTop: contentTopPad }]}>
          <Text style={s.errorTitle}>{i18n.t('common.error')}</Text>
          <Text style={s.muted}>
            {evoError instanceof Error ? evoError.message : i18n.t('details.failedToLoadEvolution')}
          </Text>
        </View>
      ) : (
        <View style={[s.evoList, { paddingTop: contentTopPad }]}>
          {(evoSteps ?? []).map((item, idx) => (
            <View key={`${item.id}-${item.name}`}>
              <EvolutionCard id={item.id} name={item.name} />
              {idx < (evoSteps?.length ?? 0) - 1 ? <EvolutionSeparator /> : null}
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const renderScene = ({ route }: { route: { key: TabKey } }) => {
    switch (route.key) {
      case 'about':
        return renderAbout();
      case 'stats':
        return renderStats();
      case 'evolution':
        return renderEvolution();
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={s.safe} edges={['left', 'right']}>
      <View style={s.container}>
        <View style={[s.headerRow, { height: headerH, paddingTop: insets.top }]}>
          <BlurView
            intensity={50}
            tint={scheme === 'dark' ? 'dark' : 'light'}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={s.headerTint} pointerEvents="none" />

          <View style={s.headerInner}>
            <Pressable style={s.backBtn} onPress={() => router.back()} hitSlop={10}>
              <Ionicons name="chevron-back" size={20} color={tokens.color.primary.midnight} />
              <Text style={s.backText}>{i18n.t('common.back')}</Text>
            </Pressable>

            <Pressable
              hitSlop={10}
              onPress={() => {
                const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
                toggleFavorite.mutate({
                  pokemonId: pokemon.id,
                  name: pokemon.name,
                  imageUrl,
                  isCurrentlyFavorite: favorite,
                });
              }}
            >
              <Ionicons
                name={favorite ? 'heart' : 'heart-outline'}
                size={24}
                color={favorite ? '#E53935' : tokens.color.primary.midnight}
              />
            </Pressable>
          </View>
        </View>

        <ScrollView
          style={s.pageScroll}
          contentContainerStyle={[s.scrollContent, { paddingTop: headerH }]}
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="never"
          automaticallyAdjustContentInsets={false}
          bounces={false}
          overScrollMode="never"
          alwaysBounceVertical={false}
        >
          <View style={[s.heroBg, { height: sheetTopY }]} pointerEvents="none" />

          <View style={s.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={s.title}>{titleCase(pokemon.name)}</Text>

              <View style={s.chipsRow}>
                {(types ?? []).map((t) => (
                  <View key={t} style={s.chip}>
                    <View style={[s.dot, { backgroundColor: getTypeColor(t) }]} />
                    <Text style={s.chipText}>{titleCase(t)}</Text>
                  </View>
                ))}
              </View>
            </View>

            <Text style={s.idBadge}>#{pad3(pokemon.id)}</Text>
          </View>

          <View style={s.imageWrap}>
            <PokemonImage id={pokemon.id} size={200} />
          </View>

          <View
            onLayout={(e) => {
              const y = e.nativeEvent.layout.y;
              if (y > 0 && Math.abs(y - sheetTopY) > 1) setSheetTopY(y);
            }}
            style={s.sheet}
          >
            <View style={{ height: tabViewHeight }}>
              {renderTabBar()}

              <TabView
                navigationState={{ index, routes }}
                onIndexChange={setIndex}
                renderScene={renderScene}
                renderTabBar={() => null}
                initialLayout={{ width }}
                swipeEnabled
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

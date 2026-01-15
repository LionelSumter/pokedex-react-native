// app/pokemon/[name].tsx
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { PokemonImage } from '@/components/ui/pokemon-image';
import { tokens } from '@/constants/tokens';
import { useEvolutionChainByName, usePokemonByName } from '@/hooks/use-pokemon';

type TabKey = 'about' | 'stats' | 'evolution';

/** ====== Detail measurements (from your Figma) ====== */
const DETAIL = {
  padX: 24,

  chipsToImage: 24,
  imageOverlap: 50, // white sheet starts under last 50px of image

  // Tabs: fixed position within white sheet
  tabsTopFromSheet: 74, // your requirement
  tabsItemW: 114,
  tabsItemH: 24,
  tabsTrackH: 2,
  tabsToContent: 24,

  // Stats
  statsRowGap: 24,
  statsTextToBar: 8,
  statsBarH: 4,

  // Evolution
  evoPadTop: 24,
  evoCardGap: 38,
  evoCardH: 80,
  evoRadius: 8,
  evoWellW: 80,
  evoWellBg: '#F6F6FF',
  evoInnerPad: 12,
  evoNameGap: 8,

  // ✅ Bigger sprite (was too small)
  evoSpriteSize: 72,

  evoConnectorH: 14,

  tabbarH: 84,
} as const;

/** ====== Stat max map (normalization) ====== */
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

/** ✅ Shadow (pixel-ish soft shadow like Figma) */
const SOFT_CARD_SHADOW = {
  shadowColor: '#000',
  shadowOpacity: 0.10,
  shadowRadius: 16,
  shadowOffset: { width: 0, height: 8 },
  elevation: 4,
} as const;


export default function PokemonDetailScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const insets = useSafeAreaInsets();

  const pokemonName = String(name ?? '').toLowerCase();

  const { data: pokemon, isLoading, error } = usePokemonByName(pokemonName);
  const { steps: evoSteps, isLoading: evoLoading, error: evoError } =
    useEvolutionChainByName(pokemonName);

  const [tab, setTab] = useState<TabKey>('about');
  const tabIndex = tab === 'about' ? 0 : tab === 'stats' ? 1 : 2;

  const bottomPad = DETAIL.tabbarH + insets.bottom + 24;

  const types = useMemo(() => {
    const arr = pokemon?.types ?? [];
    return arr.map((t: any) => t?.type?.name).filter(Boolean) as string[];
  }, [pokemon]);

  // Content should start BELOW the fixed tabs area:
  const contentTopPad =
    DETAIL.tabsTopFromSheet + DETAIL.tabsItemH + DETAIL.tabsToContent;

  if (isLoading) {
    return (
      <SafeAreaView style={s.safe} edges={['left', 'right']}>
        <View style={s.center}>
          <ActivityIndicator size="large" />
          <Text style={s.muted}>Loading…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!pokemon || error) {
    return (
      <SafeAreaView style={s.safe} edges={['left', 'right']}>
        <View style={s.center}>
          <Text style={s.errorTitle}>Error</Text>
          <Text style={s.muted}>
            {error instanceof Error ? error.message : 'Failed to load'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    // Root safe area: left/right only (hero + image can go edge-to-edge)
    <SafeAreaView style={s.safe} edges={['left', 'right']}>
      <View style={s.container}>
        {/* HERO background (behind everything) */}
        <View style={s.heroBg} pointerEvents="none" />

        {/* Header (top safe area ONLY here) */}
        <View style={[s.headerRow, { paddingTop: insets.top + 6 }]}>
          <Pressable style={s.backBtn} onPress={() => router.back()} hitSlop={10}>
            <Ionicons
              name="chevron-back"
              size={22}
              color={tokens.color.primary.midnight}
            />
            <Text style={s.backText}>Vorige</Text>
          </Pressable>

          <Pressable onPress={() => {}} hitSlop={10}>
            <Ionicons
              name="heart-outline"
              size={22}
              color={tokens.color.primary.midnight}
            />
          </Pressable>
        </View>

        {/* Title + chips + id */}
        <View style={s.titleRow}>
          <View style={{ flex: 1 }}>
            <Text style={s.title}>{titleCase(pokemon.name)}</Text>

            <View style={s.chipsRow}>
              {types.map((t) => (
                <View key={t} style={s.chip}>
                  <View style={s.dot} />
                  <Text style={s.chipText}>{titleCase(t)}</Text>
                </View>
              ))}
            </View>
          </View>

          <Text style={s.idBadge}>#{pad3(pokemon.id)}</Text>
        </View>

        {/* Image (must sit ON TOP of the white sheet) */}
        <View style={s.imageWrap}>
          <PokemonImage id={pokemon.id} size={200} />
        </View>

        {/* White sheet */}
        <View style={s.sheet}>
          {/* Tabs: FIXED position from top of the white sheet */}
          <View style={s.tabsWrap}>
            <View style={s.tabsRow}>
              <TabButton
                label="About"
                active={tab === 'about'}
                onPress={() => setTab('about')}
              />
              <TabButton
                label="Stats"
                active={tab === 'stats'}
                onPress={() => setTab('stats')}
              />
              <TabButton
                label="Evolution"
                active={tab === 'evolution'}
                onPress={() => setTab('evolution')}
              />
            </View>

            <View style={s.track}>
              <View
                style={[
                  s.indicator,
                  { transform: [{ translateX: tabIndex * DETAIL.tabsItemW }] },
                ]}
              />
            </View>
          </View>

          {/* Scenes (content starts under fixed tabs) */}
          {tab === 'about' && (
            <View style={[s.scenePad, { paddingTop: contentTopPad, paddingBottom: bottomPad }]}>
              <AboutRow label="Name" value={titleCase(pokemon.name)} />
              <AboutRow label="ID" value={pad3(pokemon.id)} />
              <AboutRow label="Base" value={String(pokemon.base_experience ?? '-')} />
              <AboutRow label="Weight" value={`${(pokemon.weight ?? 0) / 10} kg`} />
              <AboutRow label="Height" value={`${(pokemon.height ?? 0) / 10} m`} />
              <AboutRow label="Types" value={types.map(titleCase).join(', ') || '-'} />
              <AboutRow
                label="Abilities"
                value={(pokemon.abilities ?? [])
                  .map((a: any) => a?.ability?.name)
                  .filter(Boolean)
                  .map(titleCase)
                  .join(', ') || '-'}
              />
            </View>
          )}

          {tab === 'stats' && (
            <View style={[s.statsPad, { paddingTop: contentTopPad, paddingBottom: bottomPad }]}>
              {(pokemon.stats ?? []).map((st: any) => {
                const key = String(st?.stat?.name ?? '');
                const value = Number(st?.base_stat ?? 0);
                const max = STAT_MAX_BY_NAME[key] ?? 255;
                const pct = clamp01(value / max);

                return (
                  <View key={key} style={s.statBlock}>
                    <View style={s.statTop}>
                      <Text style={s.statLabel}>{titleCase(key)}</Text>
                      <Text style={s.statValue}>{value}</Text>
                    </View>

                    <View style={s.statTrack}>
                      <View style={[s.statFill, { width: `${pct * 100}%` }]} />
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {tab === 'evolution' && (
            <View style={{ flex: 1 }}>
              {evoLoading ? (
                <View style={[s.centerSmall, { paddingTop: contentTopPad }]}>
                  <ActivityIndicator />
                  <Text style={s.muted}>Loading evolution…</Text>
                </View>
              ) : evoError ? (
                <View style={[s.centerSmall, { paddingTop: contentTopPad }]}>
                  <Text style={s.errorTitle}>Error</Text>
                  <Text style={s.muted}>
                    {evoError instanceof Error ? evoError.message : 'Failed to load evolution'}
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={evoSteps ?? []}
                  keyExtractor={(item) => `${item.id}-${item.name}`}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={[
                    s.evoList,
                    { paddingTop: contentTopPad, paddingBottom: bottomPad },
                  ]}
                  ItemSeparatorComponent={EvolutionSeparator}
                  renderItem={({ item }) => <EvolutionCard id={item.id} name={item.name} />}
                />
              )}
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

function TabButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={s.tabBtn} onPress={onPress} hitSlop={6}>
      <Text style={[s.tabLabel, active && s.tabLabelActive]}>{label}</Text>
    </Pressable>
  );
}

function AboutRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.aboutRow}>
      <Text style={s.aboutKey}>{label}</Text>
      <Text style={s.aboutVal}>{value}</Text>
    </View>
  );
}

function EvolutionSeparator() {
  return (
    <View style={s.evoSep}>
      <View style={s.evoSepWell}>
        <View style={s.evoSepLine} />
      </View>
      <View style={{ flex: 1 }} />
    </View>
  );
}

function EvolutionCard({ id, name }: { id: number; name: string }) {
  const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

  return (
    <View style={s.evoCardShadow}>
      <View style={s.evoCardInner}>
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
    </View>
  );
}


const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: tokens.color.surface.background },
  container: { flex: 1 },

  // hero background behind everything
  heroBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 460,
    backgroundColor: tokens.color.surface.background,
  },

  // header
  headerRow: {
    paddingHorizontal: DETAIL.padX,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backText: {
    fontFamily: tokens.typography.family.medium,
    fontSize: 14,
    color: tokens.color.primary.midnight,
  },

  // title + id
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

  // chips
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
    backgroundColor: 'rgba(14, 9, 64, 0.08)',
  },
  dot: { width: 10, height: 10, borderRadius: 999, backgroundColor: '#FFD000' },
  chipText: {
    fontFamily: tokens.typography.family.medium,
    fontSize: 16,
    lineHeight: 18,
    color: tokens.color.primary.midnight,
    textTransform: 'capitalize',
  },

  // image must be above sheet
  imageWrap: {
    marginTop: DETAIL.chipsToImage,
    alignItems: 'center',
    zIndex: 10,
    elevation: 10,
  },

  // sheet: only overlap up by 50px
  sheet: {
    flex: 1,
    marginTop: -DETAIL.imageOverlap,
    backgroundColor: tokens.color.surface.card,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    zIndex: 0,
  },

  /** Tabs fixed inside sheet */
  tabsWrap: {
    position: 'absolute',
    top: DETAIL.tabsTopFromSheet,
    left: 0,
    right: 0,
    paddingHorizontal: DETAIL.padX,
    zIndex: 5,
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

  track: {
    marginTop: 10,
    height: DETAIL.tabsTrackH,
    width: '100%',
    backgroundColor: 'rgba(14, 9, 64, 0.10)',
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    top: 0,
    height: DETAIL.tabsTrackH,
    width: DETAIL.tabsItemW,
    backgroundColor: tokens.color.primary.purple,
  },

  // about
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
    color: 'rgba(14, 9, 64, 0.60)',
    textTransform: 'capitalize',
  },

  // stats
  statsPad: {
    paddingHorizontal: DETAIL.padX,
    rowGap: DETAIL.statsRowGap,
  },
  statBlock: { width: '100%' },
  statTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
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
    backgroundColor: 'rgba(14, 9, 64, 0.10)',
    overflow: 'hidden',
  },
  statFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: tokens.color.primary.purple,
  },

  // evolution list
  evoList: {
    paddingHorizontal: DETAIL.padX,
  },

  // ✅ Soft shadow + same layout
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
    backgroundColor: DETAIL.evoWellBg,
    alignItems: 'center',
    justifyContent: 'center',
  },

  evoCardShadow: {
  borderRadius: DETAIL.evoRadius,
  backgroundColor: 'transparent',
  ...(tokens.shadow?.soft ?? SOFT_CARD_SHADOW),
},

evoCardInner: {
  height: DETAIL.evoCardH,
  borderRadius: DETAIL.evoRadius,
  backgroundColor: tokens.color.surface.card,
  flexDirection: 'row',
  overflow: 'hidden',
},


  // ✅ Bigger sprite
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
    borderLeftColor: 'rgba(14, 9, 64, 0.30)',
  },

  // states
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

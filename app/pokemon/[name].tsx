// app/pokemon/[name].tsx
import Favorite from '@/components/ui/favorite';
import { PokemonImage } from '@/components/ui/pokemon-image';
import { useEvolutionChainByName, usePokemonByName } from '@/hooks/use-pokemon';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
    SkeletonAboutCard,
    SkeletonEvolutionList,
    SkeletonHero,
    SkeletonStatsCard,
} from '@/components/ui/Skeleton';

import { SceneMap, TabView } from 'react-native-tab-view';

const TYPE_COLORS: Record<string, string> = {
  normal: '#A8A77A', fire: '#EE8130', water: '#6390F0', electric: '#F7D02C',
  grass: '#7AC74C', ice: '#96D9D6', fighting: '#C22E28', poison: '#A33EA1',
  ground: '#E2BF65', flying: '#A98FF3', psychic: '#F95587', bug: '#A6B91A',
  rock: '#B6A136', ghost: '#735797', dragon: '#6F35FC', dark: '#705746',
  steel: '#B7B7CE', fairy: '#D685AD',
};

const HERO_H = 420;
const EV_IMG_BOX_W = 96;

type Route = { key: 'about' | 'stats' | 'evolution'; title: 'About' | 'Stats' | 'Evolution' };

export default function PokemonDetailScreen() {
  const layout = useWindowDimensions();
  const { name } = useLocalSearchParams<{ name: string }>();

  const { data: pokemon, isLoading: isPokemonLoading, error } = usePokemonByName(name ?? '');
  const { steps: evoSteps, isLoading: isEvoLoading } = useEvolutionChainByName(name ?? '');

  const [index, setIndex] = useState(0);
  const routes: Route[] = [
    { key: 'about', title: 'About' },
    { key: 'stats', title: 'Stats' },
    { key: 'evolution', title: 'Evolution' },
  ];

  const [sceneHeights, setSceneHeights] = useState<Record<Route['key'], number>>({
    about: 0,
    stats: 0,
    evolution: 0,
  });

  const handleLayoutFor =
    (key: Route['key']) =>
    (e: LayoutChangeEvent) => {
      const h = e.nativeEvent.layout.height;
      setSceneHeights((prev) => (prev[key] === h ? prev : { ...prev, [key]: h }));
    };

  const safeIndex = Math.min(Math.max(0, index), Math.max(0, routes.length - 1));
  const activeKey = routes[safeIndex]!.key;
  const tabViewHeight = Math.max(sceneHeights[activeKey] || 0, 1) + 120;

  const prettyId = useMemo(
    () => (pokemon ? `#${String(pokemon.id).padStart(3, '0')}` : ''),
    [pokemon]
  );

  const abilities = useMemo(() => {
    if (!pokemon) return '';
    return pokemon.abilities
      .map((a) => a.ability.name.replace(/-/g, ' '))
      .map(capitalize)
      .join(', ');
  }, [pokemon]);

  const typesLine = useMemo(() => {
    if (!pokemon) return '';
    return pokemon.types.map((t) => capitalize(t.type.name)).join(', ');
  }, [pokemon]);

  // Loading
  if (isPokemonLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#E9F2F8' }}>
        <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: '#E9F2F8' }}>
          <SkeletonHero />
          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              marginTop: 80,
              paddingTop: 24,
            }}
          >
            <SkeletonAboutCard />
            <SkeletonStatsCard />
            <SkeletonEvolutionList />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Error
  if (error || !pokemon) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#E9F2F8' }}>
        <View style={styles.center}>
          <Text style={styles.error}>Kon Pokémon niet laden</Text>
          <Pressable style={styles.retry} onPress={() => router.back()}>
            <Text style={styles.retryText}>Terug</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // Scenes (gewone functies; geen hooks → voldoet aan react-hooks regel)
  const AboutScene = () => (
    <View onLayout={handleLayoutFor('about')}>
      <View style={styles.card}>
        <InfoRow label="Name" value={capitalize(pokemon.name)} />
        <InfoRow label="ID" value={String(pokemon.id).padStart(3, '0')} />
        <InfoRow label="Base Exp" value={String(pokemon.base_experience ?? '—')} />
        <InfoRow label="Weight" value={`${(pokemon.weight ?? 0) / 10} kg`} />
        <InfoRow label="Height" value={`${(pokemon.height ?? 0) / 10} m`} />
        <InfoRow label="Types" value={typesLine} />
        <InfoRow label="Abilities" value={abilities} />
      </View>
    </View>
  );

  const StatsScene = () => (
    <View onLayout={handleLayoutFor('stats')}>
      <View style={styles.card}>
        {pokemon.stats.map((s) => {
          const map: Record<string, string> = {
            hp: 'HP',
            attack: 'Attack',
            defense: 'Defense',
            'special-attack': 'Special Attack',
            'special-defense': 'Special Defense',
            speed: 'Speed',
          };
          const label = map[s.stat.name] ?? s.stat.name;
          const val = s.base_stat;
          const widthPct = Math.min(100, Math.max(0, (val / 180) * 100));
          return (
            <View key={s.stat.name} style={{ marginBottom: 16 }}>
              <View style={styles.statHeader}>
                <Text style={styles.statName}>{label}</Text>
                <Text style={styles.statValue}>{val}</Text>
              </View>
              <View style={styles.statBarBg}>
                <View style={[styles.statBarFill, { width: `${widthPct}%` }]} />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );

  const EvolutionScene = () =>
    isEvoLoading ? (
      <View onLayout={handleLayoutFor('evolution')}>
        <SkeletonEvolutionList />
      </View>
    ) : (
      <View onLayout={handleLayoutFor('evolution')}>
        <View style={styles.card}>
          {evoSteps.map((step, idx) => {
            const id3 = String(step.id).padStart(3, '0');
            const img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${step.id}.png`;
            const isLast = idx === evoSteps.length - 1;

            return (
              <View key={step.id}>
                <View style={styles.evoRow}>
                  <View style={styles.evoImgBox}>
                    <Image source={{ uri: img }} style={styles.evoImg} />
                  </View>
                  <View style={styles.evoRight}>
                    <View style={styles.evoIdBadge}>
                      <Text style={styles.evoIdText}>{id3}</Text>
                    </View>
                    <Text style={styles.evoName}>{capitalize(step.name)}</Text>
                  </View>
                </View>
                {!isLast && (
                  <View style={styles.dotsWrap}>
                    <View style={styles.dotsCol}>
                      <View style={styles.dot} />
                      <View style={styles.dot} />
                      <View style={styles.dot} />
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </View>
    );

  const renderScene = SceneMap({
    about: AboutScene,
    stats: StatsScene,
    evolution: EvolutionScene,
  });

  const artworkUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#E9F2F8' }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: '#E9F2F8' }}
      >
        {/* ==== Hero ==== */}
        <View style={styles.hero}>
          <View style={styles.customHeaderRow}>
            <Pressable style={styles.backBtn} onPress={() => router.back()}>
              <Text style={styles.backIcon}>‹</Text>
              <Text style={styles.backText}>Vorige</Text>
            </Pressable>
            <Favorite pokemonId={pokemon.id} pokemonName={pokemon.name} imageUrl={artworkUrl} />
          </View>

          <View style={styles.titleRow}>
            <Text numberOfLines={1} style={styles.title}>
              {capitalize(pokemon.name)}
            </Text>
            <Text style={styles.idText}>{prettyId}</Text>
          </View>

          <View style={styles.typeChipsRow}>
            {pokemon.types.map(({ type }) => {
              const key = type.name.toLowerCase();
              const dot = TYPE_COLORS[key] ?? '#999';
              return (
                <View key={type.name} style={styles.typeChip}>
                  <View style={[styles.typeDot, { backgroundColor: dot }]} />
                  <Text style={styles.typeChipLabel}>{capitalize(type.name)}</Text>
                </View>
              );
            })}
          </View>

          <View style={styles.imageWrap}>
            <PokemonImage id={pokemon.id} size={300} />
          </View>
        </View>

        {/* ==== Tabs: eigen header, default TabBar uit ==== */}
        <View style={styles.sheet}>
          <TabsHeader routes={routes} index={index} onChangeIndex={setIndex} />

          <TabView<Route>
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            lazy
            renderTabBar={() => null}   // verberg standaard TabBar
            style={{ height: tabViewHeight }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function TabsHeader({
  routes,
  index,
  onChangeIndex,
}: {
  routes: Route[];
  index: number;
  onChangeIndex: (i: number) => void;
}) {
  return (
    <View style={styles.tabsHeader}>
      {routes.map((r, i) => {
        const focused = i === index;
        return (
          <Pressable
            key={r.key}
            onPress={() => onChangeIndex(i)}
            style={[styles.tabBtn, focused && styles.tabBtnActive]}
          >
            <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
              {r.title}
            </Text>
            {focused && <View style={styles.tabsIndicator} />}
          </Pressable>
        );
      })}
    </View>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { color: '#DC2626', fontSize: 16, fontWeight: '700', marginBottom: 10 },
  retry: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#6E56CF', borderRadius: 10 },
  retryText: { color: '#fff', fontWeight: '700' },

  hero: {
    height: HERO_H,
    backgroundColor: '#E9F2F8',
    paddingHorizontal: 20,
    paddingTop: 12,
    position: 'relative',
  },

  customHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6 },
  backIcon: { fontSize: 22, color: '#0B1026', lineHeight: 22 },
  backText: { fontSize: 16, fontWeight: '800', color: '#0B1026' },

  titleRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  title: { fontSize: 44, fontWeight: '900', color: '#0B1026', maxWidth: '70%' },
  idText: { fontSize: 28, fontWeight: '800', color: '#9AA3B2' },

  typeChipsRow: { flexDirection: 'row', gap: 14, marginTop: 14 },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    shadowColor: '#1D1D1D',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  typeDot: { width: 10, height: 10, borderRadius: 999, marginRight: 10 },
  typeChipLabel: { fontWeight: '800', color: '#0B1026' },

  imageWrap: { position: 'absolute', left: 0, right: 0, bottom: -90, alignItems: 'center' },

  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: 80,
    paddingTop: 24,
  },

  // Custom Tabs Header
  tabsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  tabBtnActive: {},
  tabLabel: { fontSize: 18, fontWeight: '800', textTransform: 'none', color: '#727B88' },
  tabLabelActive: { color: '#0B1026' },
  tabsIndicator: { marginTop: 6, height: 3, width: 36, borderRadius: 2, backgroundColor: '#6E56CF' },

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

  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12 },
  infoLabel: { color: '#6B7280', fontSize: 18, fontWeight: '800' },
  infoValue: { color: '#0B1026', fontSize: 20, fontWeight: '900' },

  statHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  statName: { color: '#0B1026', fontWeight: '800', fontSize: 16 },
  statValue: { color: '#0B1026', fontWeight: '900', fontSize: 16 },
  statBarBg: { height: 10, borderRadius: 999, backgroundColor: '#E5E7EB' },
  statBarFill: { height: 10, borderRadius: 999, backgroundColor: '#6E56CF' },

  // Evolution stijl
  evoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#1D1D1D',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    marginBottom: 14,
  },
  evoImgBox: {
    width: EV_IMG_BOX_W,
    alignSelf: 'stretch',
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  evoImg: { width: 64, height: 64, resizeMode: 'contain' },
  evoRight: { flex: 1, paddingVertical: 18, paddingHorizontal: 16, backgroundColor: '#FFFFFF' },
  evoIdBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, backgroundColor: '#ECE7FF', borderRadius: 10, marginBottom: 8 },
  evoIdText: { color: '#4F46E5', fontWeight: '800' },
  evoName: { fontSize: 22, fontWeight: '900', color: '#0B1026' },

  dotsWrap: { height: 28, marginTop: -6, marginBottom: 8 },
  dotsCol: { marginLeft: 18, width: EV_IMG_BOX_W, alignItems: 'center', justifyContent: 'flex-start' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#D1D5DB', marginVertical: 4 },
});

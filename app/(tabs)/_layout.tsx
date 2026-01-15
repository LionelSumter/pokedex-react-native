// app/(tabs)/_layout.tsx
import { HapticTab } from '@/components/haptic-tab';
import { PokeballActive } from '@/components/icons/PokeballActive';
import { PokeballInactive } from '@/components/icons/PokeballInactive';
import { tokens } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet, View } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const tabBg = tokens.color.tabbar.background;

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,

        tabBarActiveTintColor: tokens.color.primary.purple,
        tabBarInactiveTintColor: tokens.color.text.muted,

        // ✅ ONLY typography changed
        tabBarLabelStyle: styles.label,

        tabBarStyle: [
          styles.tabBar,
          { backgroundColor: tabBg, borderTopColor: tokens.color.tabbar.border },
        ],

        tabBarBackground: () =>
          Platform.OS === 'ios' ? (
            <BlurView
              intensity={25}
              tint={colorScheme === 'dark' ? 'dark' : 'light'}
              style={StyleSheet.absoluteFill}
            />
          ) : (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: tabBg }]} />
          ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Pokémons',
          tabBarIcon: ({ focused, color }) =>
            focused ? (
              <PokeballActive size={24} color={color} />
            ) : (
              <PokeballInactive size={24} color={color} />
            ),
        }}
      />

      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'heart' : 'heart-outline'} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 84,
    borderTopWidth: 1,
    position: 'absolute',
  },

  // ✅ SF Pro Text / Bold / 10
  label: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : undefined,
  },
});

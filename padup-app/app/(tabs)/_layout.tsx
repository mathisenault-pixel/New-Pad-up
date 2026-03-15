import { Tabs } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ACCENT = '#4A8FE8';
const MUTED = '#6B6B7E';
const BORDER = 'rgba(255,255,255,0.07)';

// ─── Tab item ─────────────────────────────────────────────────────────────────

function TabIcon({
  focused,
  label,
  children,
}: {
  focused: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View style={s.item}>
      <View style={[s.iconWrap, focused && s.iconWrapActive]}>
        {children}
      </View>
      <Text style={[s.label, focused && s.labelActive]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: s.bar,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      {/* Terrain de padel vu de face = home */}
      <Tabs.Screen
        name="(home)"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Accueil">
              <Ionicons
                name={focused ? 'grid' : 'grid-outline'}
                size={22}
                color={focused ? ACCENT : MUTED}
              />
            </TabIcon>
          ),
        }}
      />

      {/* Carte clubs */}
      <Tabs.Screen
        name="clubs"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Clubs">
              <Ionicons
                name={focused ? 'map' : 'map-outline'}
                size={22}
                color={focused ? ACCENT : MUTED}
              />
            </TabIcon>
          ),
        }}
      />

      {/* Réseau social / fil d'actualité */}
      <Tabs.Screen
        name="feed"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Feed">
              <Ionicons
                name={focused ? 'newspaper' : 'newspaper-outline'}
                size={22}
                color={focused ? ACCENT : MUTED}
              />
            </TabIcon>
          ),
        }}
      />

      {/* Trophée tournoi */}
      <Tabs.Screen
        name="tournois"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Tournois">
              <Ionicons
                name={focused ? 'trophy' : 'trophy-outline'}
                size={22}
                color={focused ? ACCENT : MUTED}
              />
            </TabIcon>
          ),
        }}
      />

      {/* Profil joueur */}
      <Tabs.Screen
        name="profil"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Profil">
              <Ionicons
                name={focused ? 'person-circle' : 'person-circle-outline'}
                size={24}
                color={focused ? ACCENT : MUTED}
              />
            </TabIcon>
          ),
        }}
      />

      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  bar: {
    backgroundColor: 'rgba(10,10,15,0.97)',
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingTop: 6,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    width: 64,
  },
  iconWrap: {
    width: 44,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: 'rgba(74,143,232,0.12)',
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: MUTED,
    textAlign: 'center',
  },
  labelActive: {
    color: ACCENT,
  },
});

import React, { useState } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const C = {
  bg: '#0A0A0F', surface: '#111118', surface2: '#18181F',
  border: 'rgba(255,255,255,0.07)', accent: '#4A8FE8',
  text: '#F0F0F5', muted: '#6B6B7E', card: '#13131A',
  green: '#4ade80',
};

const USERNAME = 'Thomas M.';

const CONVS = [
  {
    id: '1', type: 'dm' as const,
    avatarBg: '#1A3A6B', avatarText: 'JL',
    name: 'Julien Leroy', sub: 'On joue vendredi ? 🏓',
    time: '14:32', unread: 2, online: true,
  },
  {
    id: '2', type: 'group' as const,
    avatarBg: '#0D1F3C', avatarText: '🏟️',
    name: 'QG Padel Club', sub: '📣 Nouveau terrain ouvert !',
    time: '12:15', unread: 5, online: false,
  },
  {
    id: '3', type: 'group' as const,
    avatarBg: '#1A1E40', avatarText: '🎾',
    name: 'Équipe Victoire', sub: 'Alice : GG les gars 🔥',
    time: '11:04', unread: 0, online: false,
  },
  {
    id: '4', type: 'dm' as const,
    avatarBg: '#2D5FC4', avatarText: 'AL',
    name: 'Alice Laurent', sub: 'Top la session de ce matin ☀️',
    time: 'Hier', unread: 0, online: true,
  },
  {
    id: '5', type: 'group' as const,
    avatarBg: '#0A1E35', avatarText: '🏆',
    name: 'Open Padel Mars', sub: 'Raphaël : J\'arrive à 9h',
    time: 'Hier', unread: 1, online: false,
  },
  {
    id: '6', type: 'dm' as const,
    avatarBg: '#1A3F8F', avatarText: 'RC',
    name: 'Raphaël Couture', sub: 'Tu es dispo samedi soir ?',
    time: 'Lun', unread: 0, online: false,
  },
  {
    id: '7', type: 'dm' as const,
    avatarBg: '#0C1F30', avatarText: '⚡',
    name: 'ZE Padel Club', sub: 'Votre réservation du 15 mars est confirmée ✅',
    time: 'Dim', unread: 0, online: false,
  },
  {
    id: '8', type: 'group' as const,
    avatarBg: '#1E2A50', avatarText: '🤝',
    name: 'Padel Potes', sub: 'Thomas : On fait quand le prochain match ?',
    time: 'Sam', unread: 0, online: false,
  },
];


export default function MessagesScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('Messages');

  const filtered = CONVS.filter((c) => {
    if (activeTab === 'Demandes') return false;
    return true;
  }).filter((c) =>
    search === '' || c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity
          style={s.backBtn}
          onPress={() => activeTab === 'Demandes' ? setActiveTab('Messages') : router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={22} color={C.text} />
        </TouchableOpacity>
        <Text style={s.pageTitle}>{activeTab === 'Demandes' ? 'Demandes' : USERNAME}</Text>
        {activeTab !== 'Demandes' && (
          <TouchableOpacity style={s.newBtn} activeOpacity={0.7}>
            <Ionicons name="create-outline" size={20} color={C.bg} />
          </TouchableOpacity>
        )}
        {activeTab === 'Demandes' && <View style={{ width: 38 }} />}
      </View>

      {/* Search */}
      <View style={s.searchWrap}>
        <Ionicons name="search-outline" size={16} color={C.muted} style={s.searchIcon} />
        <TextInput
          style={s.searchInput}
          placeholder="Rechercher une conversation..."
          placeholderTextColor={C.muted}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={16} color={C.muted} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header section */}
        {activeTab !== 'Demandes' && (
          <View style={s.tabsWrap}>
            <Text style={s.sectionTitle}>Messages</Text>
            <TouchableOpacity
              style={s.demandesBtn}
              onPress={() => setActiveTab('Demandes')}
              activeOpacity={0.7}
            >
              <Text style={s.demandesText}>Demandes</Text>
              <View style={s.tabBadge}><Text style={s.tabBadgeText}>3</Text></View>
            </TouchableOpacity>
          </View>
        )}

        {/* Conversations list */}
        <View style={s.convList}>
          {filtered.length === 0 && (
            <View style={s.emptyState}>
              <Ionicons name="chatbubbles-outline" size={40} color={C.muted} />
              <Text style={s.emptyText}>Aucune conversation trouvée</Text>
            </View>
          )}
          {filtered.map((conv) => (
            <TouchableOpacity key={conv.id} style={s.convRow} activeOpacity={0.7}>
              {/* Avatar */}
              <View style={s.avatarWrap}>
                <View style={[s.avatar, { backgroundColor: conv.avatarBg }]}>
                  <Text style={[s.avatarText, conv.type === 'group' && s.avatarEmoji]}>
                    {conv.avatarText}
                  </Text>
                </View>
                {conv.online && <View style={s.onlineBadge} />}
                {conv.type === 'group' && (
                  <View style={s.groupBadge}>
                    <Ionicons name="people" size={9} color="#fff" />
                  </View>
                )}
              </View>

              {/* Content */}
              <View style={s.convContent}>
                <View style={s.convTop}>
                  <Text style={[s.convName, conv.unread > 0 && s.convNameBold]}>{conv.name}</Text>
                  <Text style={[s.convTime, conv.unread > 0 && s.convTimeAccent]}>{conv.time}</Text>
                </View>
                <View style={s.convBottom}>
                  <Text
                    style={[s.convSub, conv.unread > 0 && s.convSubBold]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {conv.sub}
                  </Text>
                  {conv.unread > 0 && (
                    <View style={s.unreadBadge}>
                      <Text style={s.unreadText}>{conv.unread}</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    gap: 12,
  },
  backBtn: {
    width: 38, height: 38,
    backgroundColor: C.surface2,
    borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: C.border,
  },
  pageTitle: {
    flex: 1,
    fontWeight: '800', fontSize: 20,
    color: C.text, letterSpacing: -0.5,
    textAlign: 'center',
  },
  newBtn: {
    width: 38, height: 38,
    backgroundColor: C.accent,
    borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },

  // Search
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.surface2,
    borderWidth: 1, borderColor: C.border,
    borderRadius: 14,
    marginHorizontal: 20,
    paddingVertical: 13, paddingHorizontal: 14,
    gap: 10,
    marginBottom: 20,
  },
  searchIcon: {},
  searchInput: {
    flex: 1, color: C.text, fontSize: 14, padding: 0,
  },

  // Tabs
  tabsWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: '800', fontSize: 20,
    color: C.text, letterSpacing: -0.4,
  },
  sectionTitleAccent: {
    fontWeight: '800', fontSize: 20,
    color: C.accent, letterSpacing: -0.4,
  },
  backSection: {
    flexDirection: 'row', alignItems: 'center', gap: 2,
  },
  demandesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 5, paddingHorizontal: 11,
    borderRadius: 100,
    backgroundColor: C.surface2,
    borderWidth: 1, borderColor: C.border,
  },
  demandesText: { fontSize: 11, fontWeight: '700', color: C.muted },
  tabBadge: {
    backgroundColor: '#ef4444',
    borderRadius: 100, minWidth: 16, height: 16,
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 4,
  },
  tabBadgeText: { fontSize: 9, fontWeight: '800', color: '#fff' },

  // Conversations
  convList: { paddingHorizontal: 16, paddingTop: 8 },
  convRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14, paddingHorizontal: 14,
    backgroundColor: C.card,
    borderRadius: 16, marginBottom: 8,
    borderWidth: 1, borderColor: C.border,
  },

  // Avatar
  avatarWrap: { position: 'relative', flexShrink: 0 },
  avatar: {
    width: 50, height: 50, borderRadius: 15,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  avatarEmoji: { fontSize: 20 },
  onlineBadge: {
    position: 'absolute', bottom: -1, right: -1,
    width: 13, height: 13, borderRadius: 7,
    backgroundColor: C.green, borderWidth: 2, borderColor: C.bg,
  },
  groupBadge: {
    position: 'absolute', bottom: -1, right: -1,
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: C.accent, borderWidth: 2, borderColor: C.bg,
    alignItems: 'center', justifyContent: 'center',
  },

  // Conv content
  convContent: { flex: 1 },
  convTop: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 4,
  },
  convName: { fontSize: 14, fontWeight: '600', color: C.text },
  convNameBold: { fontWeight: '800' },
  convTime: { fontSize: 11, color: C.muted },
  convTimeAccent: { color: C.accent, fontWeight: '700' },
  convBottom: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  convSub: { fontSize: 12, color: C.muted, flex: 1, marginRight: 8 },
  convSubBold: { color: C.text, fontWeight: '600' },
  unreadBadge: {
    backgroundColor: C.accent, borderRadius: 100,
    minWidth: 20, height: 20, paddingHorizontal: 5,
    alignItems: 'center', justifyContent: 'center',
  },
  unreadText: { fontSize: 10, fontWeight: '800', color: '#fff' },

  // Empty
  emptyState: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 14, color: C.muted, fontWeight: '600' },
});

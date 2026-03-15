import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useBookings } from '@/context/bookings';
import { Ionicons } from '@expo/vector-icons';

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg: '#0A0A0F',
  surface: '#111118',
  surface2: '#18181F',
  border: 'rgba(255,255,255,0.07)',
  accent: '#4A8FE8',
  accent2: '#1A5FBF',
  text: '#F0F0F5',
  muted: '#6B6B7E',
  card: '#13131A',
  gold: '#F5A623',
  green: '#4ade80',
};

// ─── Types ────────────────────────────────────────────────────────────────────
type FilterPill = { label: string; key: string };
type TerrainCard = {
  id: string;
  name: string;
  location: string;
  badge: string;
  dispo: string;
  dispoNow: boolean;
  type: 'indoor' | 'outdoor';
  distanceKm: number;
  stars: number;
  gradient: [string, string];
};
type MatchCard = {
  id: string;
  day: string;
  num: string;
  title: string;
  time: string;
  place: string;
  level: string;
  levelType: 'open' | 'priv';
  spots: number;
  players: { initials: string; color: [string, string] }[];
};
type ClubFav = { id: string; icon: string; name: string; dispo: string; available: boolean };

// ─── Static data ──────────────────────────────────────────────────────────────
const FILTERS: FilterPill[] = [
  { label: 'Tous', key: 'all' },
  { label: 'Disponible maintenant', key: 'now' },
  { label: 'Intérieur', key: 'indoor' },
  { label: 'Extérieur', key: 'outdoor' },
  { label: '< 5 km', key: 'nearby' },
];

const TERRAINS: TerrainCard[] = [
  {
    id: '1',
    name: 'QG Padel Club',
    location: '📍 Paris 12 · 1.2 km',
    badge: '⭐ Top',
    dispo: 'Dispo maintenant',
    dispoNow: true,
    type: 'indoor',
    distanceKm: 1.2,
    stars: 5,
    gradient: ['#1A3A6B', '#2B5BAD'],
  },
  {
    id: '2',
    name: 'Cocoon Padel',
    location: '📍 Paris 11 · 2.1 km',
    badge: 'Indoor',
    dispo: 'Dispo 15h',
    dispoNow: false,
    type: 'indoor',
    distanceKm: 2.1,
    stars: 4,
    gradient: ['#1E3A7A', '#2D5FC4'],
  },
  {
    id: '3',
    name: 'ZE Padel Club',
    location: '📍 Paris 20 · 3.8 km',
    badge: 'Outdoor',
    dispo: 'Dispo 16h',
    dispoNow: false,
    type: 'outdoor',
    distanceKm: 3.8,
    stars: 4,
    gradient: ['#1A3F5C', '#2A6496'],
  },
  {
    id: '4',
    name: 'Arena Padel Vincennes',
    location: '📍 Vincennes · 7.2 km',
    badge: 'Outdoor',
    dispo: 'Dispo 18h',
    dispoNow: false,
    type: 'outdoor',
    distanceKm: 7.2,
    stars: 3,
    gradient: ['#2A3F1A', '#3A6028'],
  },
];

const MATCHES: MatchCard[] = [
  {
    id: '1',
    day: 'Mar',
    num: '14',
    title: 'Match Amical 2v2',
    time: '19h00',
    place: 'Club Nation',
    level: 'Niv. 4',
    levelType: 'open',
    spots: 1,
    players: [
      { initials: 'TM', color: ['#4A8FE8', '#1A5FBF'] },
      { initials: 'JL', color: ['#2B6CB0', '#4A90D9'] },
      { initials: '+', color: ['#718096', '#4A5568'] },
    ],
  },
  {
    id: '2',
    day: 'Mar',
    num: '15',
    title: 'Compétition Mixte',
    time: '10h00',
    place: 'Padel Bastille',
    level: 'Niveau 3+',
    levelType: 'priv',
    spots: 2,
    players: [
      { initials: 'AL', color: ['#3B6FD4', '#6FA3E0'] },
      { initials: 'RC', color: ['#1A3F8F', '#2B5BAD'] },
      { initials: '?', color: ['#A0AEC0', '#718096'] },
      { initials: '?', color: ['#A0AEC0', '#718096'] },
    ],
  },
];

const CLUBS_FAV: ClubFav[] = [
  { id: '1', icon: '🏟️', name: 'QG Padel Club', dispo: '3 dispo', available: true },
  { id: '2', icon: '🎾', name: 'Cocoon Padel', dispo: '1 dispo', available: true },
  { id: '3', icon: '⚡', name: 'ZE Padel Club', dispo: '— Complet', available: false },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function Header() {
  const router = useRouter();
  return (
    <View style={s.header}>
      <View style={s.headerLeft} />
      <Text style={s.logo}>
        Pad<Text style={s.logoAccent}>'</Text>up
      </Text>
      <TouchableOpacity style={s.msgBtn} activeOpacity={0.7} onPress={() => router.navigate('/messages')}>
        <Text style={s.msgIcon}>💬</Text>
        <View style={s.msgDot} />
      </TouchableOpacity>
    </View>
  );
}

function MesClubs() {
  const router = useRouter();
  return (
    <>
      <View style={s.sectionHeader}>
        <Text style={s.sectionTitle}>Mes clubs</Text>
      </View>
      <View style={s.clubsRow}>
        {CLUBS_FAV.map((club) => (
          <TouchableOpacity key={club.id} style={s.clubCard} activeOpacity={0.7} onPress={() => router.push(`/club/${club.id}`)}>
            <View style={s.clubIcon}>
              <Text style={{ fontSize: 18 }}>{club.icon}</Text>
            </View>
            <Text style={s.clubName}>{club.name}</Text>
            <View style={s.clubDispo}>
              {club.available && <View style={s.dispoDot} />}
              <Text style={[s.clubDispoText, !club.available && { color: C.muted }]}>
                {club.dispo}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
}

function HeroCard() {
  const router = useRouter();
  return (
    <View style={s.heroCard}>
      {/* Decorative glow top-right */}
      <View style={s.heroGlow1} />
      <View style={s.heroGlow2} />

      <View style={s.heroTag}>
        <Text style={s.heroTagText}>🏆 Tournoi ce week-end</Text>
      </View>

      <Text style={s.heroTitle}>{'Open Padel\nCocoon Padel Club'}</Text>
      <Text style={s.heroSub}>Samedi 15 mars · 32 joueurs inscrits · Places limitées</Text>

      <View style={s.heroCta}>
        <TouchableOpacity style={s.btnPrimary} activeOpacity={0.8} onPress={() => router.navigate('/tournois')}>
          <Text style={s.btnPrimaryText}>S'inscrire maintenant</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.btnSecondary} activeOpacity={0.8} onPress={() => router.navigate('/tournois')}>
          <Text style={s.btnSecondaryText}>Voir</Text>
        </TouchableOpacity>
      </View>

      <View style={s.heroStats}>
        <View style={s.heroStat}>
          <Text style={s.heroStatValue}>32</Text>
          <Text style={s.heroStatLabel}>Inscrits</Text>
        </View>
        <View style={s.heroStatDivider} />
        <View style={s.heroStat}>
          <Text style={s.heroStatValue}>€50</Text>
          <Text style={s.heroStatLabel}>Buy-in</Text>
        </View>
        <View style={s.heroStatDivider} />
        <View style={s.heroStat}>
          <Text style={s.heroStatValue}>4</Text>
          <Text style={s.heroStatLabel}>Places restantes</Text>
        </View>
      </View>
    </View>
  );
}

function SearchAndFilters({
  activeFilter,
  onFilter,
  searchQuery,
  onSearch,
}: {
  activeFilter: string;
  onFilter: (key: string) => void;
  searchQuery: string;
  onSearch: (q: string) => void;
}) {
  const router = useRouter();
  return (
    <>
      <View style={s.sectionHeader}>
        <Text style={s.sectionTitle}>Réserver un terrain</Text>
        <TouchableOpacity onPress={() => router.navigate('/clubs')}>
          <Text style={s.sectionLink}>Voir tout →</Text>
        </TouchableOpacity>
      </View>

      <View style={s.searchWrap}>
        <View style={s.searchBar}>
          <Text style={s.searchIcon}>📍</Text>
          <TextInput
            style={s.searchInput}
            placeholder="Rechercher un club, un quartier..."
            placeholderTextColor={C.muted}
            value={searchQuery}
            onChangeText={onSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 ? (
            <TouchableOpacity style={s.searchFilter} activeOpacity={0.8} onPress={() => onSearch('')}>
              <Ionicons name="close" size={16} color={C.bg} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={s.searchFilter} activeOpacity={0.8} onPress={() => onFilter('all')}>
              <Ionicons name="options-outline" size={16} color={C.bg} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.filtersContainer}
        keyboardShouldPersistTaps="handled"
      >
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[s.filterPill, activeFilter === f.key && s.filterPillActive]}
            activeOpacity={0.7}
            onPress={() => onFilter(f.key)}
          >
            <Text
              style={[s.filterPillText, activeFilter === f.key && s.filterPillTextActive]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </>
  );
}

function TerrainCourt({ gradient }: { gradient: [string, string] }) {
  return (
    <View style={[s.terrainImgBg, { backgroundColor: gradient[0] }]}>
      {/* Court visual */}
      <View style={s.court}>
        <View style={s.courtLineH} />
        <View style={s.courtLineV} />
      </View>
    </View>
  );
}

function TerrainCards({ filter, query }: { filter: string; query: string }) {
  const router = useRouter();
  const filtered = TERRAINS.filter((t) => {
    if (filter === 'now' && !t.dispoNow) return false;
    if (filter === 'indoor' && t.type !== 'indoor') return false;
    if (filter === 'outdoor' && t.type !== 'outdoor') return false;
    if (filter === 'nearby' && t.distanceKm >= 5) return false;
    if (query.length > 0) {
      const q = query.toLowerCase();
      if (!t.name.toLowerCase().includes(q) && !t.location.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    return (
      <View style={s.emptyState}>
        <Text style={s.emptyStateText}>Aucun terrain trouvé</Text>
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={s.terrainScroll}
    >
      {filtered.map((t) => (
        <TouchableOpacity key={t.id} style={s.terrainCard} activeOpacity={0.8} onPress={() => router.push(`/club/${t.id}`)}>
          <TerrainCourt gradient={t.gradient} />

          {/* Badge */}
          <View style={s.terrainBadge}>
            <Text style={s.terrainBadgeText}>{t.badge}</Text>
          </View>
          {/* Dispo */}
          <View style={s.terrainDispo}>
            <View style={s.dispoDotGreen} />
            <Text style={s.terrainDispoText}>{t.dispo}</Text>
          </View>

          <View style={s.terrainInfo}>
            <Text style={s.terrainName}>{t.name}</Text>
            <Text style={s.terrainLoc}>{t.location}</Text>
            <View style={s.terrainBottom}>
              <View />
              <Text style={s.terrainStars}>
                {'★'.repeat(t.stars)}
                {t.stars < 5 ? <Text style={{ color: C.muted }}>{'★'.repeat(5 - t.stars)}</Text> : null}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

function MatchCards() {
  const router = useRouter();
  return (
    <>
      <View style={s.sectionHeader}>
        <Text style={s.sectionTitle}>Prochains matchs publics</Text>
        <TouchableOpacity onPress={() => router.navigate('/feed')}>
          <Text style={s.sectionLink}>Voir tout →</Text>
        </TouchableOpacity>
      </View>

      <View style={s.matchList}>
        {MATCHES.map((m) => (
          <TouchableOpacity key={m.id} style={s.matchCard} activeOpacity={0.8} onPress={() => router.navigate('/feed')}>
            {/* Date box */}
            <View style={s.matchDate}>
              <Text style={s.matchDay}>{m.day}</Text>
              <Text style={s.matchNum}>{m.num}</Text>
            </View>

            {/* Info */}
            <View style={s.matchInfo}>
              <Text style={s.matchTitle}>{m.title}</Text>
              <View style={s.matchMeta}>
                <Text style={s.matchMetaText}>🕐 {m.time}</Text>
                <Text style={s.matchMetaText}>📍 {m.place}</Text>
              </View>
              <View style={s.levelBadgeRow}>
                <View style={s.levelBadge}>
                  <Text style={s.levelBadgeText}>{m.level}</Text>
                </View>
              </View>
              <View style={s.playersRow}>
                {m.players.map((p, i) => (
                  <View
                    key={i}
                    style={[
                      s.playerAvatar,
                      { backgroundColor: p.color[0], marginLeft: i === 0 ? 0 : -6 },
                    ]}
                  >
                    <Text style={s.playerInitials}>{p.initials}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Right */}
            <View style={s.matchRight}>
              <View style={m.levelType === 'open' ? s.levelOpen : s.levelPriv}>
                <Text style={m.levelType === 'open' ? s.levelOpenText : s.levelPrivText}>
                  {m.levelType === 'open' ? 'Ouvert' : 'Niveau 3+'}
                </Text>
              </View>
              <Text style={s.matchSpots}>
                <Text style={{ color: C.text, fontWeight: '700' }}>{m.spots}</Text>
                {m.spots === 1 ? ' place libre' : ' places libres'}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
}

// ─── Prochaine réservation ────────────────────────────────────────────────────

function UpcomingBooking() {
  const { bookings } = useBookings();
  const [dismissed, setDismissed] = useState<string[]>([]);
  const visible = bookings.filter((b) => !dismissed.includes(b.id));
  if (visible.length === 0) return null;
  const b = visible[0];
  return (
    <View style={s.bookingBanner}>
      <View style={s.bookingBannerGlow} />

      <View style={s.bookingIconWrap}>
        <Text style={{ fontSize: 22 }}>{b.clubIcon}</Text>
      </View>

      <View style={s.bookingInfo}>
        <View style={s.bookingTopRow}>
          <View style={s.bookingLiveBadge}>
            <View style={s.bookingLiveDot} />
            <Text style={s.bookingLiveText}>Réservé</Text>
          </View>
          <Text style={s.bookingPrice}>€{b.price}</Text>
        </View>
        <Text style={s.bookingTerrain}>{b.terrainName} · {b.clubName}</Text>
        <View style={s.bookingTimeRow}>
          <Ionicons name="calendar-outline" size={12} color={C.muted} />
          <Text style={s.bookingTimeText}>{b.dateLabel}</Text>
          <Ionicons name="time-outline" size={12} color={C.muted} />
          <Text style={s.bookingTimeText}>{b.slotStart} → {b.slotEnd}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={s.bookingDismiss}
        onPress={() => setDismissed([...dismissed, b.id])}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        activeOpacity={0.7}
      >
        <Ionicons name="close" size={14} color={C.muted} />
      </TouchableOpacity>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      <ScrollView
        style={s.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Header />
        <UpcomingBooking />
        <MesClubs />
        <HeroCard />
        <SearchAndFilters
          activeFilter={activeFilter}
          onFilter={setActiveFilter}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
        />
        <TerrainCards filter={activeFilter} query={searchQuery} />
        <MatchCards />
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.bg,
  },
  scroll: {
    flex: 1,
    backgroundColor: C.bg,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 0,
    position: 'relative',
  },
  headerLeft: { width: 38 },
  logo: {
    fontWeight: '800',
    fontSize: 22,
    color: C.text,
    letterSpacing: -0.5,
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  logoAccent: { color: C.accent },
  msgBtn: {
    width: 38,
    height: 38,
    backgroundColor: C.surface2,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: C.border,
  },
  msgIcon: { fontSize: 16 },
  msgDot: {
    width: 7,
    height: 7,
    backgroundColor: C.accent,
    borderRadius: 4,
    position: 'absolute',
    top: 6,
    right: 6,
    borderWidth: 1.5,
    borderColor: C.bg,
  },

  // Section header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontWeight: '700',
    fontSize: 17,
    color: C.text,
    letterSpacing: -0.3,
  },
  sectionLink: {
    fontSize: 12,
    color: C.accent,
    fontWeight: '800',
  },

  // Clubs favoris
  clubsRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 14,
  },
  clubCard: {
    flex: 1,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    gap: 12,
  },
  clubIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.surface2,
    borderWidth: 1,
    borderColor: C.border,
  },
  clubName: {
    fontWeight: '800',
    fontSize: 10,
    color: C.text,
    textAlign: 'center',
    lineHeight: 13,
  },
  clubDispo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dispoDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: C.green,
  },
  clubDispoText: {
    fontSize: 9,
    color: C.green,
  },

  // Hero card
  heroCard: {
    marginHorizontal: 24,
    marginTop: 32,
    borderRadius: 22,
    backgroundColor: '#131320',
    borderWidth: 1,
    borderColor: 'rgba(74,143,232,0.2)',
    padding: 28,
    overflow: 'hidden',
  },
  heroGlow1: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(74,143,232,0.12)',
  },
  heroGlow2: {
    position: 'absolute',
    bottom: -30,
    left: 60,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(26,95,191,0.1)',
  },
  heroTag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(74,143,232,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(74,143,232,0.25)',
    borderRadius: 100,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  heroTagText: {
    fontSize: 11,
    color: C.accent,
    fontWeight: '800',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontWeight: '800',
    fontSize: 22,
    color: C.text,
    lineHeight: 26,
    marginTop: 12,
    letterSpacing: -0.3,
  },
  heroSub: {
    fontSize: 13,
    color: C.muted,
    marginTop: 6,
    lineHeight: 20,
  },
  heroCta: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 24,
  },
  btnPrimary: {
    flex: 1,
    backgroundColor: C.accent,
    borderRadius: 12,
    paddingVertical: 11,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  btnPrimaryText: {
    color: C.bg,
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 0.2,
  },
  btnSecondary: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    paddingVertical: 11,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  btnSecondaryText: {
    color: C.text,
    fontWeight: '700',
    fontSize: 13,
  },
  heroStats: {
    flexDirection: 'row',
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  heroStat: {
    flex: 1,
    alignItems: 'center',
  },
  heroStatDivider: {
    width: 1,
    backgroundColor: C.border,
  },
  heroStatValue: {
    fontWeight: '800',
    fontSize: 18,
    color: C.accent,
  },
  heroStatLabel: {
    fontSize: 11,
    color: C.muted,
    marginTop: 2,
  },

  // Search
  searchWrap: {
    paddingHorizontal: 24,
    marginTop: 4,
  },
  searchBar: {
    backgroundColor: C.surface2,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  searchIcon: { fontSize: 16 },
  searchInput: {
    flex: 1,
    color: C.text,
    fontSize: 14,
    padding: 0,
  },
  searchFilter: {
    width: 32,
    height: 32,
    backgroundColor: C.accent,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Filters
  filtersContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    paddingTop: 14,
    paddingBottom: 2,
  },
  filterPill: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.surface2,
  },
  filterPillActive: {
    backgroundColor: C.accent,
    borderColor: C.accent,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: C.muted,
    whiteSpace: 'nowrap',
  } as any,
  filterPillTextActive: {
    color: C.bg,
  },

  // Terrains
  terrainScroll: {
    flexDirection: 'row',
    gap: 14,
    paddingHorizontal: 24,
    paddingTop: 4,
    paddingBottom: 8,
  },
  terrainCard: {
    width: 200,
    backgroundColor: C.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
  },
  terrainImgBg: {
    width: '100%',
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  court: {
    width: 100,
    height: 65,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  courtLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  courtLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  terrainBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(74,143,232,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(74,143,232,0.4)',
    borderRadius: 100,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  terrainBadgeText: {
    fontSize: 10,
    color: C.accent,
    fontWeight: '700',
  },
  terrainDispo: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dispoDotGreen: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: C.green,
  },
  terrainDispoText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
  },
  terrainInfo: {
    padding: 16,
  },
  terrainName: {
    fontWeight: '700',
    fontSize: 14,
    color: C.text,
    marginBottom: 4,
  },
  terrainLoc: {
    fontSize: 11,
    color: C.muted,
  },
  terrainBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  terrainStars: {
    fontSize: 10,
    color: '#FBBF24',
  },

  // Matches
  matchList: {
    paddingHorizontal: 24,
    gap: 16,
  },
  matchCard: {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 18,
    padding: 18,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  matchDate: {
    backgroundColor: C.surface2,
    borderRadius: 10,
    padding: 8,
    paddingHorizontal: 10,
    minWidth: 46,
    alignItems: 'center',
  },
  matchDay: {
    fontSize: 10,
    color: C.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  matchNum: {
    fontWeight: '800',
    fontSize: 20,
    color: C.accent,
    lineHeight: 22,
  },
  matchInfo: {
    flex: 1,
  },
  matchTitle: {
    fontWeight: '700',
    fontSize: 14,
    color: C.text,
    marginBottom: 3,
  },
  matchMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  matchMetaText: {
    fontSize: 11,
    color: C.muted,
  },
  levelBadgeRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  levelBadge: {
    backgroundColor: 'rgba(74,143,232,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(74,143,232,0.25)',
    borderRadius: 100,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  levelBadgeText: {
    fontWeight: '700',
    fontSize: 11,
    color: C.accent,
  },
  playersRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  playerAvatar: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: C.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerInitials: {
    fontSize: 9,
    color: '#fff',
    fontWeight: '700',
  },
  matchRight: {
    alignItems: 'flex-end',
  },
  levelOpen: {
    backgroundColor: 'rgba(74,143,232,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(74,143,232,0.25)',
    borderRadius: 100,
    paddingVertical: 3,
    paddingHorizontal: 8,
    marginBottom: 6,
  },
  levelOpenText: {
    fontSize: 10,
    fontWeight: '700',
    color: C.accent,
  },
  levelPriv: {
    backgroundColor: 'rgba(26,95,191,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(26,95,191,0.3)',
    borderRadius: 100,
    paddingVertical: 3,
    paddingHorizontal: 8,
    marginBottom: 6,
  },
  levelPrivText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#7EB8F7',
  },
  matchSpots: {
    fontSize: 11,
    color: C.muted,
  },

  // Upcoming booking banner
  bookingBanner: {
    marginHorizontal: 24,
    marginTop: 20,
    marginBottom: 4,
    backgroundColor: '#0E1628',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(74,143,232,0.3)',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    overflow: 'hidden',
  },
  bookingBannerGlow: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(74,143,232,0.1)',
  },
  bookingIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: C.surface2,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  bookingInfo: {
    flex: 1,
    gap: 3,
  },
  bookingTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  bookingLiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(74,222,128,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.25)',
    borderRadius: 100,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  bookingLiveDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: C.green,
  },
  bookingLiveText: {
    fontSize: 10,
    fontWeight: '700',
    color: C.green,
  },
  bookingPrice: {
    fontWeight: '800',
    fontSize: 15,
    color: C.accent,
  },
  bookingTerrain: {
    fontWeight: '700',
    fontSize: 13,
    color: C.text,
  },
  bookingTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  bookingTimeText: {
    fontSize: 11,
    color: C.muted,
    fontWeight: '600',
  },
  bookingDismiss: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: C.surface2,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  // Empty state
  emptyState: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 13,
    color: C.muted,
    fontWeight: '600',
  },
});

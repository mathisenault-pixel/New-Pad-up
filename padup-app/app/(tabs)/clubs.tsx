import React, { useRef, useState } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar,
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useBookings } from '@/context/bookings';

const C = {
  bg: '#0A0A0F', surface: '#111118', surface2: '#18181F',
  border: 'rgba(255,255,255,0.07)', accent: '#4A8FE8',
  text: '#F0F0F5', muted: '#6B6B7E', card: '#13131A',
  green: '#4ade80', red: '#f87171', gold: '#F5A623',
};

// ─── Données clubs ────────────────────────────────────────────────────────────

const FILTERS = ['Tous', 'Dispo maintenant', 'Indoor', 'Outdoor', '< 5 km'];

const CLUBS_LIST = [
  {
    id: '1', icon: '🏟️', name: 'QG Padel Club',
    tag: '⭐ Favori', tagType: 'fav' as const,
    dispo: 'Disponible', dispoOk: true,
    location: 'Paris 12', distance: '1.2 km', terrains: '8 terrains',
    rating: '4.9', ratingCount: '210 avis',
    slots: ['14h', '15h', '17h'],
    bg: '#0D1F3C',
    coords: { latitude: 48.8490, longitude: 2.3729 },
  },
  {
    id: '2', icon: '🎾', name: 'Cocoon Padel',
    tag: '⭐ Favori', tagType: 'fav' as const,
    dispo: 'Disponible', dispoOk: true,
    location: 'Paris 11', distance: '2.4 km', terrains: '6 terrains',
    rating: '4.8', ratingCount: '124 avis',
    slots: ['15h', '16h'],
    bg: '#0A1E35',
    coords: { latitude: 48.8590, longitude: 2.3764 },
  },
  {
    id: '3', icon: '⚡', name: 'ZE Padel Club',
    tag: 'Outdoor', tagType: 'type' as const,
    dispo: 'Disponible', dispoOk: true,
    location: 'Paris 20', distance: '3.1 km', terrains: '4 terrains',
    rating: '4.6', ratingCount: '87 avis',
    slots: ['16h'],
    bg: '#0C1F30',
    coords: { latitude: 48.8631, longitude: 2.3944 },
  },
  {
    id: '4', icon: '🏓', name: 'Club Nation Padel',
    tag: 'Indoor', tagType: 'type' as const,
    dispo: 'Disponible', dispoOk: true,
    location: 'Paris 12', distance: '3.8 km', terrains: '10 terrains',
    rating: '4.7', ratingCount: '198 avis',
    slots: ['18h', '19h'],
    bg: '#1A0A2E',
    coords: { latitude: 48.8452, longitude: 2.3786 },
  },
];

// ─── Données détail club ──────────────────────────────────────────────────────

const CLUBS_DATA: Record<string, {
  id: string; icon: string; name: string;
  address: string; city: string; phone: string; email: string;
  rating: string; ratingCount: string; price: number;
  tags: string[]; description: string;
  terrains: { id: string; name: string; type: 'Indoor' | 'Outdoor'; surface: string; color: string }[];
}> = {
  '1': {
    id: '1', icon: '🏟️', name: 'QG Padel Club',
    address: '14 Rue de Lyon', city: 'Paris 12e · 75012',
    phone: '01 43 45 67 89', email: 'contact@qgpadel.fr',
    rating: '4.9', ratingCount: '210 avis', price: 22,
    tags: ['Indoor', 'Parking', 'Vestiaires', 'Bar', 'Pro shop'],
    description: "L'adresse incontournable du padel parisien. 4 terrains couverts, location de raquettes et ambiance conviviale garantie.",
    terrains: [
      { id: 't1', name: 'Terrain 1', type: 'Indoor', surface: 'Gazon synthétique', color: '#1A3A6B' },
      { id: 't2', name: 'Terrain 2', type: 'Indoor', surface: 'Gazon synthétique', color: '#1A3F8F' },
      { id: 't3', name: 'Terrain 3', type: 'Indoor', surface: 'Moquette',          color: '#0D2A5E' },
      { id: 't4', name: 'Terrain 4', type: 'Indoor', surface: 'Gazon synthétique', color: '#162B5C' },
    ],
  },
  '2': {
    id: '2', icon: '🎾', name: 'Cocoon Padel',
    address: '27 Boulevard Voltaire', city: 'Paris 11e · 75011',
    phone: '01 48 05 33 21', email: 'hello@cocoonpadel.fr',
    rating: '4.8', ratingCount: '124 avis', price: 18,
    tags: ['Indoor', 'Outdoor', 'Cours', 'Location raquettes'],
    description: 'Cocoon Padel, un club chaleureux avec 4 terrains mixtes indoor/outdoor. Idéal pour tous les niveaux.',
    terrains: [
      { id: 't1', name: 'Terrain A', type: 'Indoor',  surface: 'Moquette',          color: '#1A3A6B' },
      { id: 't2', name: 'Terrain B', type: 'Indoor',  surface: 'Gazon synthétique', color: '#0D2A5E' },
      { id: 't3', name: 'Terrain C', type: 'Outdoor', surface: 'Gazon synthétique', color: '#1A4A2A' },
      { id: 't4', name: 'Terrain D', type: 'Outdoor', surface: 'Gazon synthétique', color: '#1A4030' },
    ],
  },
  '3': {
    id: '3', icon: '⚡', name: 'ZE Padel Club',
    address: '5 Rue des Pyrénées', city: 'Paris 20e · 75020',
    phone: '01 46 36 89 12', email: 'info@zepadel.fr',
    rating: '4.6', ratingCount: '87 avis', price: 16,
    tags: ['Outdoor', 'Éclairage LED', 'Vestiaires'],
    description: "ZE Padel Club, 4 terrains outdoor éclairés pour jouer jusqu'à 22h30. Ambiance décontractée dans l'est parisien.",
    terrains: [
      { id: 't1', name: 'Court 1', type: 'Outdoor', surface: 'Gazon synthétique', color: '#1A4A2A' },
      { id: 't2', name: 'Court 2', type: 'Outdoor', surface: 'Gazon synthétique', color: '#1A4030' },
      { id: 't3', name: 'Court 3', type: 'Outdoor', surface: 'Gazon synthétique', color: '#1A3A20' },
      { id: 't4', name: 'Court 4', type: 'Outdoor', surface: 'Gazon synthétique', color: '#153520' },
    ],
  },
  '4': {
    id: '4', icon: '🏓', name: 'Club Nation Padel',
    address: '2 Avenue Daumesnil', city: 'Paris 12e · 75012',
    phone: '01 44 68 90 11', email: 'contact@clubnation.fr',
    rating: '4.7', ratingCount: '198 avis', price: 20,
    tags: ['Indoor', 'Pro shop', 'Cours', 'Parking'],
    description: "Club Nation Padel, 4 terrains indoor de dernière génération au cœur de Paris. Le rendez-vous des compétiteurs et des amateurs.",
    terrains: [
      { id: 't1', name: 'Court A', type: 'Indoor', surface: 'Gazon synthétique', color: '#1A2A5E' },
      { id: 't2', name: 'Court B', type: 'Indoor', surface: 'Gazon synthétique', color: '#1E3070' },
      { id: 't3', name: 'Court C', type: 'Indoor', surface: 'Moquette',          color: '#142050' },
      { id: 't4', name: 'Court D', type: 'Indoor', surface: 'Gazon synthétique', color: '#0F1A40' },
    ],
  },
};

// ─── Crénaux ─────────────────────────────────────────────────────────────────

const SLOTS = [
  { start: '9h00',  end: '10h30' },
  { start: '10h30', end: '12h00' },
  { start: '12h00', end: '13h30' },
  { start: '13h30', end: '15h00' },
  { start: '15h00', end: '16h30' },
  { start: '16h30', end: '18h00' },
  { start: '18h00', end: '19h30' },
  { start: '19h30', end: '21h00' },
  { start: '21h00', end: '22h30' },
];

function isAvailable(terrainIdx: number, dayIdx: number, slotIdx: number): boolean {
  const seed = (terrainIdx * 7 + dayIdx) * 13 + slotIdx;
  return (seed * 2654435761) % 100 > 38;
}

const DAY_NAMES = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const MONTH_NAMES = ['jan', 'fév', 'mar', 'avr', 'mai', 'juin', 'juil', 'aoû', 'sep', 'oct', 'nov', 'déc'];

function buildDays(count = 7) {
  const today = new Date();
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return {
      key: i,
      label: i === 0 ? 'Auj.' : i === 1 ? 'Dem.' : DAY_NAMES[d.getDay()],
      num: d.getDate(),
      month: MONTH_NAMES[d.getMonth()],
    };
  });
}

const DAYS = buildDays(7);

// ─── Composant détail terrain ─────────────────────────────────────────────────

function TerrainBlock({
  terrain, terrainIdx, dayIdx, price, clubId, dateLabel,
  isBooked: isBookedFn, bookedSlot, onBook, onConfirm,
}: {
  terrain: { id: string; name: string; type: string; surface: string; color: string };
  terrainIdx: number; dayIdx: number; price: number;
  clubId: string; dateLabel: string;
  isBooked: (key: string) => boolean;
  bookedSlot: string | null;
  onBook: (key: string) => void;
  onConfirm: (slotStart: string, slotEnd: string) => void;
}) {
  function slotAvail(si: number) {
    if (!isAvailable(terrainIdx, dayIdx, si)) return false;
    return !isBookedFn(`${clubId}|${terrain.name}|${dateLabel}|${SLOTS[si].start}`);
  }
  const availCount = SLOTS.filter((_, si) => slotAvail(si)).length;

  return (
    <View style={d.terrainCard}>
      <View style={d.terrainHeader}>
        <View style={[d.courtVisual, { backgroundColor: terrain.color }]}>
          <View style={d.courtOuter}>
            <View style={d.courtLineH} />
            <View style={d.courtLineV} />
            <View style={d.courtNet} />
          </View>
        </View>
        <View style={d.terrainMeta}>
          <Text style={d.terrainName}>{terrain.name}</Text>
          <View style={d.terrainTagsRow}>
            <View style={[d.typeTag, terrain.type === 'Outdoor' && d.typeTagOutdoor]}>
              <Text style={[d.typeTagText, terrain.type === 'Outdoor' && d.typeTagTextOutdoor]}>{terrain.type}</Text>
            </View>
            <Text style={d.surfaceText}>{terrain.surface}</Text>
          </View>
        </View>
        <View style={d.availBadge}>
          <View style={[d.availDot, availCount === 0 && d.availDotOff]} />
          <Text style={[d.availText, availCount === 0 && d.availTextOff]}>
            {availCount === 0 ? 'Complet' : `${availCount} dispo`}
          </Text>
        </View>
      </View>

      <View style={d.slotsGrid}>
        {SLOTS.map((slot, si) => {
          const avail = slotAvail(si);
          const key = `${terrain.id}-${dayIdx}-${si}`;
          const booked = bookedSlot === key;
          return (
            <TouchableOpacity
              key={si}
              style={[d.slotBtn, avail && d.slotBtnAvail, booked && d.slotBtnBooked, !avail && d.slotBtnOff]}
              disabled={!avail}
              activeOpacity={0.7}
              onPress={() => onBook(key)}
            >
              <Text style={[d.slotStart, avail && d.slotStartAvail, booked && d.slotStartBooked]}>{slot.start}</Text>
              <Text style={[d.slotArrow, avail && d.slotArrowAvail]}>→</Text>
              <Text style={[d.slotEnd, avail && d.slotEndAvail]}>{slot.end}</Text>
              {booked && <View style={d.checkCircle}><Ionicons name="checkmark" size={9} color="#fff" /></View>}
              {!avail && <Text style={d.slotComplet}>Complet</Text>}
            </TouchableOpacity>
          );
        })}
      </View>

      {bookedSlot?.startsWith(terrain.id) && (() => {
        const slotIdx = parseInt(bookedSlot.split('-')[2], 10);
        const slot = SLOTS[slotIdx];
        return (
          <TouchableOpacity style={d.confirmBtn} activeOpacity={0.85} onPress={() => onConfirm(slot.start, slot.end)}>
            <Ionicons name="arrow-forward-circle" size={18} color="#fff" />
            <Text style={d.confirmText}>Continuer · €{price}</Text>
          </TouchableOpacity>
        );
      })()}
    </View>
  );
}

// ─── Vue détail club ──────────────────────────────────────────────────────────

function ClubDetailView({ clubId, onBack }: { clubId: string; onBack: () => void }) {
  const router = useRouter();
  const club = CLUBS_DATA[clubId];
  const [selectedDay, setSelectedDay] = useState(0);
  const [bookedSlot, setBookedSlot] = useState<string | null>(null);
  const { isBooked } = useBookings();

  if (!club) return null;

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={d.scroll}>
      {/* Header */}
      <View style={d.header}>
        <TouchableOpacity style={d.backBtn} onPress={onBack} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={22} color={C.text} />
        </TouchableOpacity>
        <Text style={d.headerTitle}>{club.name}</Text>
        <View style={{ width: 38 }} />
      </View>

      {/* Hero */}
      <View style={d.heroCard}>
        <View style={d.heroGlow} />
        <View style={d.heroRow}>
          <View style={d.clubIconWrap}>
            <Text style={d.clubIconEmoji}>{club.icon}</Text>
          </View>
          <View style={d.heroInfo}>
            <Text style={d.clubName}>{club.name}</Text>
            <View style={d.ratingRow}>
              <Ionicons name="star" size={11} color={C.gold} />
              <Text style={d.ratingVal}>{club.rating}</Text>
              <Text style={d.ratingCnt}>({club.ratingCount})</Text>
            </View>
            <View style={d.tagsRow}>
              {club.tags.slice(0, 3).map((tag) => (
                <View key={tag} style={d.tag}>
                  <Text style={d.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
        <Text style={d.description}>{club.description}</Text>
        <View style={d.statsRow}>
          <View style={d.stat}>
            <Text style={d.statVal}>4</Text>
            <Text style={d.statLabel}>Terrains</Text>
          </View>
          <View style={d.statDiv} />
          <View style={d.stat}>
            <Text style={d.statVal}>€{club.price}</Text>
            <Text style={d.statLabel}>/ 1h30</Text>
          </View>
          <View style={d.statDiv} />
          <View style={d.stat}>
            <Ionicons name="location-sharp" size={13} color={C.accent} style={{ marginBottom: 2 }} />
            <Text style={d.statLabel}>{club.city.split('·')[0].trim()}</Text>
          </View>
        </View>
      </View>

      {/* Infos pratiques */}
      <View style={d.infoCard}>
        <Text style={d.sectionTitle}>Infos pratiques</Text>
        <View style={d.infoRow}>
          <View style={d.infoIconWrap}><Ionicons name="location-outline" size={15} color={C.accent} /></View>
          <View>
            <Text style={d.infoLabel}>Adresse</Text>
            <Text style={d.infoValue}>{club.address}{'\n'}{club.city}</Text>
          </View>
        </View>
        <View style={d.divider} />
        <View style={d.infoRow}>
          <View style={d.infoIconWrap}><Ionicons name="call-outline" size={15} color={C.accent} /></View>
          <View>
            <Text style={d.infoLabel}>Téléphone</Text>
            <Text style={d.infoValue}>{club.phone}</Text>
          </View>
        </View>
        <View style={d.divider} />
        <View style={d.infoRow}>
          <View style={d.infoIconWrap}><Ionicons name="mail-outline" size={15} color={C.accent} /></View>
          <View>
            <Text style={d.infoLabel}>Email</Text>
            <Text style={d.infoValue}>{club.email}</Text>
          </View>
        </View>
      </View>

      {/* Réservation */}
      <View style={d.bookSection}>
        <Text style={d.sectionTitle}>Réserver un terrain</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={d.daysRow}>
          {DAYS.map((day) => (
            <TouchableOpacity
              key={day.key}
              style={[d.dayBtn, selectedDay === day.key && d.dayBtnActive]}
              onPress={() => { setSelectedDay(day.key); setBookedSlot(null); }}
              activeOpacity={0.7}
            >
              <Text style={[d.dayLabel, selectedDay === day.key && d.dayLabelActive]}>{day.label}</Text>
              <Text style={[d.dayNum, selectedDay === day.key && d.dayNumActive]}>{day.num}</Text>
              <Text style={[d.dayMonth, selectedDay === day.key && d.dayMonthActive]}>{day.month}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {club.terrains.map((terrain, tIdx) => {
          const day = DAYS[selectedDay];
          const dateLabel = `${day.label} ${day.num} ${day.month}`;
          return (
            <TerrainBlock
              key={terrain.id}
              terrain={terrain}
              terrainIdx={tIdx}
              dayIdx={selectedDay}
              price={club.price}
              clubId={club.id}
              dateLabel={dateLabel}
              isBooked={isBooked}
              bookedSlot={bookedSlot}
              onBook={(key) => setBookedSlot(bookedSlot === key ? null : key)}
              onConfirm={(slotStart, slotEnd) => router.push({
                pathname: '/booking-confirm',
                params: {
                  clubId: club.id, clubName: club.name, clubIcon: club.icon,
                  terrainName: terrain.name, terrainType: terrain.type,
                  dateLabel, slotStart, slotEnd, price: String(club.price),
                },
              })}
            />
          );
        })}
      </View>

      <View style={{ height: 48 }} />
    </ScrollView>
  );
}

// ─── Écran principal clubs ────────────────────────────────────────────────────

const FRANCE_REGION: Region = {
  latitude: 46.2276,
  longitude: 2.2137,
  latitudeDelta: 12,
  longitudeDelta: 12,
};

const PARIS_REGION: Region = {
  latitude: 48.856,
  longitude: 2.376,
  latitudeDelta: 0.18,
  longitudeDelta: 0.18,
};

export default function ClubsScreen() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('Tous');
  const [selectedPin, setSelectedPin] = useState('1');
  const [openClubId, setOpenClubId] = useState<string | null>(null);
  const mapRef = useRef<MapView>(null);

  const filteredClubs = CLUBS_LIST.filter((club) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!club.name.toLowerCase().includes(q) && !club.location.toLowerCase().includes(q)) return false;
    }
    switch (activeFilter) {
      case 'Dispo maintenant': if (!club.dispoOk) return false; break;
      case 'Indoor': if (!CLUBS_DATA[club.id].tags.includes('Indoor')) return false; break;
      case 'Outdoor': if (!CLUBS_DATA[club.id].tags.includes('Outdoor')) return false; break;
      case '< 5 km': if (parseFloat(club.distance) >= 5) return false; break;
    }
    return true;
  });

  // Vue détail club inline
  if (openClubId) {
    return (
      <SafeAreaView style={s.safe}>
        <StatusBar barStyle="light-content" backgroundColor={C.bg} />
        <ClubDetailView clubId={openClubId} onBack={() => setOpenClubId(null)} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      {/* ── Header fixe ─────────────────────────── */}
      <View style={s.header}>
        <Text style={s.pageTitle}>Clubs</Text>

        <View style={s.searchBar}>
          <Ionicons name="search-outline" size={16} color={C.muted} />
          <TextInput
            style={s.searchInput}
            placeholder="Nom d'un club, quartier..."
            placeholderTextColor={C.muted}
            value={search}
            onChangeText={setSearch}
          />
          <View style={s.locBadge}>
            <Ionicons name="location-sharp" size={11} color={C.accent} />
            <Text style={s.locText}>Paris</Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.filtersRow}
        >
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f}
              style={[s.pill, activeFilter === f && s.pillActive]}
              onPress={() => setActiveFilter(f)}
              activeOpacity={0.7}
            >
              <Text style={[s.pillText, activeFilter === f && s.pillTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ── Contenu scrollable ───────────────────── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
      >
        {/* Carte interactive */}
        <View style={s.mapBox}>
          <MapView
            ref={mapRef}
            style={StyleSheet.absoluteFillObject}
            initialRegion={PARIS_REGION}
            showsUserLocation
            showsCompass={false}
            showsScale={false}
          >
            {CLUBS_LIST.map((club) => (
              <Marker
                key={club.id}
                coordinate={club.coords}
                title={club.name}
                description={`${club.location} · ${club.distance}`}
                pinColor={selectedPin === club.id ? '#ffffff' : '#4A8FE8'}
                onPress={() => setSelectedPin(club.id)}
              />
            ))}
          </MapView>

          {/* Boutons zoom */}
          <View style={s.mapControls}>
            <TouchableOpacity style={s.mapCtrl} onPress={() => mapRef.current?.animateToRegion(FRANCE_REGION, 600)}>
              <Text style={s.mapCtrlText}>🇫🇷</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.mapCtrl} onPress={() => mapRef.current?.animateToRegion(PARIS_REGION, 600)}>
              <Ionicons name="locate" size={14} color={C.text} />
            </TouchableOpacity>
          </View>
          <View style={s.mapCount}><Text style={s.mapCountText}>12 clubs dans la zone</Text></View>
        </View>

        {/* ── Section clubs ─────────────────────── */}
        <View style={s.sectionHeader}>
          <View>
            <Text style={s.sectionTitle}>À proximité</Text>
            <Text style={s.sectionSub}>{filteredClubs.length} club{filteredClubs.length !== 1 ? 's' : ''} autour de vous</Text>
          </View>
          <TouchableOpacity style={s.sortBtn}>
            <Ionicons name="options-outline" size={14} color={C.accent} />
            <Text style={s.sortBtnText}>Trier</Text>
          </TouchableOpacity>
        </View>

        {filteredClubs.length === 0 && (
          <View style={{ alignItems: 'center', paddingTop: 40, paddingBottom: 20 }}>
            <Text style={{ color: C.muted, fontSize: 14, fontWeight: '600' }}>Aucun club ne correspond à ces filtres</Text>
          </View>
        )}
        {filteredClubs.map((club) => (
          <TouchableOpacity
            key={club.id}
            style={[s.clubRow, selectedPin === club.id && s.clubRowSelected]}
            onPress={() => setOpenClubId(club.id)}
            activeOpacity={0.8}
          >
            <View style={[s.clubIconWrap, { backgroundColor: club.bg }]}>
              <Text style={s.clubIconText}>{club.icon}</Text>
              <View style={s.courtMini} />
            </View>

            <View style={s.clubInfo}>
              <View style={s.clubInfoTop}>
                <Text style={s.clubName}>{club.name}</Text>
                <View style={s.ratingRow}>
                  <Ionicons name="star" size={11} color="#FBBF24" />
                  <Text style={s.ratingVal}>{club.rating}</Text>
                  <Text style={s.ratingCnt}>{club.ratingCount}</Text>
                </View>
              </View>

              <View style={s.clubMeta}>
                <Ionicons name="location-outline" size={11} color={C.muted} />
                <Text style={s.clubMetaText}>{club.location} · {club.distance}</Text>
                <Text style={s.clubMetaDot}>·</Text>
                <Text style={s.clubMetaText}>{club.terrains}</Text>
              </View>

              <View style={s.slotsRow}>
                <View style={s.dispoBadge}>
                  <View style={s.dispoGreenDot} />
                  <Text style={s.dispoText}>{club.dispo}</Text>
                </View>
                {club.slots.slice(0, 3).map((sl) => (
                  <View key={sl} style={s.slot}>
                    <Text style={s.slotText}>{sl}</Text>
                  </View>
                ))}
                <TouchableOpacity
                  style={s.btnBook}
                  activeOpacity={0.8}
                  onPress={() => setOpenClubId(club.id)}
                >
                  <Text style={s.btnBookText}>Réserver</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles liste clubs ───────────────────────────────────────────────────────

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  header: { backgroundColor: C.bg, paddingTop: 20 },
  pageTitle: { fontWeight: '800', fontSize: 24, color: C.text, letterSpacing: -0.5, paddingHorizontal: 20, marginBottom: 14 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border, borderRadius: 14, marginHorizontal: 20, paddingVertical: 13, paddingHorizontal: 14, gap: 10, marginBottom: 12 },
  searchInput: { flex: 1, color: C.text, fontSize: 14, padding: 0 },
  locBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(74,143,232,0.1)', borderRadius: 8, paddingVertical: 4, paddingHorizontal: 8 },
  locText: { fontSize: 11, color: C.accent, fontWeight: '700' },
  filtersRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, paddingBottom: 14 },
  pill: { paddingVertical: 7, paddingHorizontal: 14, borderRadius: 100, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface2 },
  pillActive: { backgroundColor: C.accent, borderColor: C.accent },
  pillText: { fontSize: 12, fontWeight: '700', color: C.muted },
  pillTextActive: { color: C.bg },
  scrollContent: { paddingBottom: 16 },
  mapBox: { height: 220, marginHorizontal: 20, borderRadius: 16, overflow: 'hidden', position: 'relative', borderWidth: 1, borderColor: C.border },
  mapControls: { position: 'absolute', top: 10, right: 10, gap: 6 },
  mapCtrl: { width: 34, height: 34, backgroundColor: 'rgba(17,17,24,0.92)', borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  mapCtrlText: { fontSize: 14 },
  mapCount: { position: 'absolute', bottom: 8, left: 10, backgroundColor: 'rgba(17,17,24,0.92)', borderRadius: 7, paddingVertical: 3, paddingHorizontal: 9, borderWidth: 1, borderColor: C.border },
  mapCountText: { fontSize: 10, fontWeight: '700', color: C.text },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 24, paddingBottom: 14 },
  sectionTitle: { fontWeight: '800', fontSize: 17, color: C.text, letterSpacing: -0.3 },
  sectionSub: { fontSize: 11, color: C.muted, marginTop: 2 },
  sortBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border, borderRadius: 10, paddingVertical: 7, paddingHorizontal: 12 },
  sortBtnText: { fontSize: 12, color: C.accent, fontWeight: '700' },
  clubRow: { flexDirection: 'row', gap: 14, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 18, marginHorizontal: 20, marginBottom: 12, padding: 14, overflow: 'hidden' },
  clubRowSelected: { borderColor: 'rgba(74,143,232,0.35)', backgroundColor: '#101020' },
  clubIconWrap: { width: 72, height: 72, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden', position: 'relative' },
  clubIconText: { fontSize: 28, zIndex: 2 },
  courtMini: { position: 'absolute', width: 52, height: 34, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 2, opacity: 0.5 },
  clubInfo: { flex: 1, gap: 6 },
  clubInfoTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  clubName: { fontWeight: '800', fontSize: 14, color: C.text, letterSpacing: -0.2, flex: 1, marginRight: 8 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingVal: { fontSize: 12, fontWeight: '700', color: '#FBBF24' },
  ratingCnt: { fontSize: 10, color: C.muted },
  clubMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  clubMetaText: { fontSize: 11, color: C.muted },
  clubMetaDot: { fontSize: 11, color: C.muted },
  slotsRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginTop: 2 },
  dispoBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dispoGreenDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: C.green },
  dispoText: { fontSize: 10, color: C.green, fontWeight: '700' },
  slot: { backgroundColor: 'rgba(74,143,232,0.1)', borderWidth: 1, borderColor: 'rgba(74,143,232,0.2)', borderRadius: 7, paddingVertical: 3, paddingHorizontal: 8 },
  slotText: { fontSize: 10, color: C.accent, fontWeight: '700' },
  btnBook: { marginLeft: 'auto', backgroundColor: C.accent, borderRadius: 9, paddingVertical: 6, paddingHorizontal: 12 },
  btnBookText: { color: C.bg, fontWeight: '700', fontSize: 11 },
});

// ─── Styles détail club ───────────────────────────────────────────────────────

const d = StyleSheet.create({
  scroll: { paddingBottom: 32 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 10, gap: 12 },
  backBtn: { width: 38, height: 38, backgroundColor: C.surface2, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  headerTitle: { flex: 1, textAlign: 'center', fontWeight: '800', fontSize: 17, color: C.text, letterSpacing: -0.3 },
  heroCard: { marginHorizontal: 20, marginTop: 4, marginBottom: 14, backgroundColor: '#131320', borderRadius: 22, borderWidth: 1, borderColor: 'rgba(74,143,232,0.2)', padding: 20, overflow: 'hidden' },
  heroGlow: { position: 'absolute', top: -50, right: -50, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(74,143,232,0.09)' },
  heroRow: { flexDirection: 'row', gap: 14, marginBottom: 14 },
  clubIconWrap: { width: 60, height: 60, borderRadius: 18, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border, flexShrink: 0 },
  clubIconEmoji: { fontSize: 28 },
  heroInfo: { flex: 1, justifyContent: 'center', gap: 4 },
  clubName: { fontWeight: '800', fontSize: 18, color: C.text, letterSpacing: -0.3 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingVal: { fontSize: 12, fontWeight: '700', color: C.gold },
  ratingCnt: { fontSize: 11, color: C.muted },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginTop: 2 },
  tag: { backgroundColor: 'rgba(74,143,232,0.1)', borderWidth: 1, borderColor: 'rgba(74,143,232,0.2)', borderRadius: 100, paddingVertical: 2, paddingHorizontal: 8 },
  tagText: { fontSize: 10, color: C.accent, fontWeight: '700' },
  description: { fontSize: 12, color: C.muted, lineHeight: 18, marginBottom: 16 },
  statsRow: { flexDirection: 'row', paddingTop: 14, borderTopWidth: 1, borderTopColor: C.border },
  stat: { flex: 1, alignItems: 'center', gap: 2 },
  statVal: { fontWeight: '800', fontSize: 17, color: C.accent },
  statLabel: { fontSize: 10, color: C.muted, fontWeight: '600' },
  statDiv: { width: 1, backgroundColor: C.border },
  infoCard: { marginHorizontal: 20, marginBottom: 14, backgroundColor: C.card, borderRadius: 18, borderWidth: 1, borderColor: C.border, padding: 18 },
  sectionTitle: { fontWeight: '800', fontSize: 16, color: C.text, letterSpacing: -0.3, marginBottom: 16 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  infoIconWrap: { width: 32, height: 32, borderRadius: 9, backgroundColor: 'rgba(74,143,232,0.1)', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  infoLabel: { fontSize: 9, color: C.muted, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  infoValue: { fontSize: 13, color: C.text, fontWeight: '600', lineHeight: 18 },
  divider: { height: 1, backgroundColor: C.border, marginVertical: 12 },
  bookSection: { marginHorizontal: 20 },
  daysRow: { flexDirection: 'row', gap: 8, paddingBottom: 16 },
  dayBtn: { alignItems: 'center', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 14, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface2, minWidth: 54 },
  dayBtnActive: { backgroundColor: C.accent, borderColor: C.accent },
  dayLabel: { fontSize: 9, fontWeight: '700', color: C.muted, textTransform: 'uppercase', letterSpacing: 0.4 },
  dayLabelActive: { color: 'rgba(10,10,15,0.7)' },
  dayNum: { fontWeight: '800', fontSize: 20, color: C.text, lineHeight: 24 },
  dayNumActive: { color: C.bg },
  dayMonth: { fontSize: 9, color: C.muted, fontWeight: '600' },
  dayMonthActive: { color: 'rgba(10,10,15,0.6)' },
  terrainCard: { backgroundColor: C.card, borderRadius: 18, borderWidth: 1, borderColor: C.border, padding: 16, marginBottom: 12 },
  terrainHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  courtVisual: { width: 56, height: 38, borderRadius: 8, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  courtOuter: { width: 40, height: 26, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.25)', borderRadius: 2, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  courtLineH: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: 'rgba(255,255,255,0.15)' },
  courtLineV: { position: 'absolute', top: 0, bottom: 0, width: 1, backgroundColor: 'rgba(255,255,255,0.15)' },
  courtNet: { position: 'absolute', top: 0, bottom: 0, width: 2, backgroundColor: 'rgba(255,255,255,0.35)' },
  terrainMeta: { flex: 1 },
  terrainName: { fontWeight: '800', fontSize: 14, color: C.text, marginBottom: 5 },
  terrainTagsRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  typeTag: { backgroundColor: 'rgba(74,143,232,0.12)', borderWidth: 1, borderColor: 'rgba(74,143,232,0.25)', borderRadius: 6, paddingVertical: 2, paddingHorizontal: 7 },
  typeTagOutdoor: { backgroundColor: 'rgba(74,222,128,0.1)', borderColor: 'rgba(74,222,128,0.25)' },
  typeTagText: { fontSize: 10, color: C.accent, fontWeight: '700' },
  typeTagTextOutdoor: { color: C.green },
  surfaceText: { fontSize: 10, color: C.muted },
  availBadge: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  availDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.green },
  availDotOff: { backgroundColor: C.muted },
  availText: { fontSize: 11, color: C.green, fontWeight: '700' },
  availTextOff: { color: C.muted },
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  slotBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 9, paddingHorizontal: 10, borderRadius: 11, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface2 },
  slotBtnAvail: { backgroundColor: 'rgba(74,143,232,0.08)', borderColor: 'rgba(74,143,232,0.3)' },
  slotBtnBooked: { backgroundColor: 'rgba(74,143,232,0.25)', borderColor: C.accent },
  slotBtnOff: { opacity: 0.4 },
  slotStart: { fontSize: 12, fontWeight: '700', color: C.muted },
  slotStartAvail: { color: C.text },
  slotStartBooked: { color: C.accent },
  slotArrow: { fontSize: 9, color: C.muted },
  slotArrowAvail: { color: 'rgba(74,143,232,0.5)' },
  slotEnd: { fontSize: 11, fontWeight: '600', color: C.muted },
  slotEndAvail: { color: C.muted },
  checkCircle: { width: 14, height: 14, borderRadius: 7, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center', marginLeft: 2 },
  slotComplet: { fontSize: 9, color: C.muted, marginLeft: 2 },
  confirmBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 14, backgroundColor: C.accent, borderRadius: 12, paddingVertical: 13 },
  confirmText: { fontWeight: '700', fontSize: 14, color: '#fff' },
});

import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useBookings } from '@/context/bookings';

const C = {
  bg: '#0A0A0F', surface: '#111118', surface2: '#18181F',
  border: 'rgba(255,255,255,0.07)', accent: '#4A8FE8',
  text: '#F0F0F5', muted: '#6B6B7E', card: '#13131A',
  green: '#4ade80', red: '#f87171', gold: '#F5A623',
};

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
    description: 'L\'adresse incontournable du padel parisien. 4 terrains couverts, location de raquettes et ambiance conviviale garantie.',
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
    description: 'ZE Padel Club, 4 terrains outdoor éclairés pour jouer jusqu\'à 22h30. Ambiance décontractée dans l\'est parisien.',
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
    description: 'Club Nation Padel, 4 terrains indoor de dernière génération au cœur de Paris. Le rendez-vous des compétiteurs et des amateurs.',
    terrains: [
      { id: 't1', name: 'Court A', type: 'Indoor', surface: 'Gazon synthétique', color: '#1A2A5E' },
      { id: 't2', name: 'Court B', type: 'Indoor', surface: 'Gazon synthétique', color: '#1E3070' },
      { id: 't3', name: 'Court C', type: 'Indoor', surface: 'Moquette',          color: '#142050' },
      { id: 't4', name: 'Court D', type: 'Indoor', surface: 'Gazon synthétique', color: '#0F1A40' },
    ],
  },
};

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

export default function ClubDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const club = CLUBS_DATA[id ?? '1'];
  const [selectedDay, setSelectedDay] = useState(0);
  const [bookedSlot, setBookedSlot] = useState<string | null>(null);
  const { isBooked } = useBookings();

  if (!club) {
    return (
      <SafeAreaView style={s.safe}>
        <Text style={{ color: C.text, padding: 24 }}>Club introuvable</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={22} color={C.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>{club.name}</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* Hero */}
        <View style={s.heroCard}>
          <View style={s.heroGlow} />
          <View style={s.heroRow}>
            <View style={s.clubIconWrap}>
              <Text style={s.clubIconEmoji}>{club.icon}</Text>
            </View>
            <View style={s.heroInfo}>
              <Text style={s.clubName}>{club.name}</Text>
              <View style={s.ratingRow}>
                <Ionicons name="star" size={11} color={C.gold} />
                <Text style={s.ratingVal}>{club.rating}</Text>
                <Text style={s.ratingCnt}>({club.ratingCount})</Text>
              </View>
              <View style={s.tagsRow}>
                {club.tags.slice(0, 3).map((tag) => (
                  <View key={tag} style={s.tag}>
                    <Text style={s.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
          <Text style={s.description}>{club.description}</Text>
          <View style={s.statsRow}>
            <View style={s.stat}>
              <Text style={s.statVal}>4</Text>
              <Text style={s.statLabel}>Terrains</Text>
            </View>
            <View style={s.statDiv} />
            <View style={s.stat}>
              <Text style={s.statVal}>€{club.price}</Text>
              <Text style={s.statLabel}>/ 1h30</Text>
            </View>
            <View style={s.statDiv} />
            <View style={s.stat}>
              <Ionicons name="location-sharp" size={13} color={C.accent} style={{ marginBottom: 2 }} />
              <Text style={s.statLabel}>{club.city.split('·')[0].trim()}</Text>
            </View>
          </View>
        </View>

        {/* Infos pratiques */}
        <View style={s.infoCard}>
          <Text style={s.sectionTitle}>Infos pratiques</Text>
          <InfoRow icon="location-outline" label="Adresse" value={`${club.address}\n${club.city}`} />
          <View style={s.divider} />
          <InfoRow icon="call-outline" label="Téléphone" value={club.phone} />
          <View style={s.divider} />
          <InfoRow icon="mail-outline" label="Email" value={club.email} />
        </View>

        {/* Réservation */}
        <View style={s.bookSection}>
          <Text style={s.sectionTitle}>Réserver un terrain</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.daysRow}>
            {DAYS.map((day) => (
              <TouchableOpacity
                key={day.key}
                style={[s.dayBtn, selectedDay === day.key && s.dayBtnActive]}
                onPress={() => { setSelectedDay(day.key); setBookedSlot(null); }}
                activeOpacity={0.7}
              >
                <Text style={[s.dayLabel, selectedDay === day.key && s.dayLabelActive]}>{day.label}</Text>
                <Text style={[s.dayNum, selectedDay === day.key && s.dayNumActive]}>{day.num}</Text>
                <Text style={[s.dayMonth, selectedDay === day.key && s.dayMonthActive]}>{day.month}</Text>
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
    </SafeAreaView>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={s.infoRow}>
      <View style={s.infoIconWrap}>
        <Ionicons name={icon as any} size={15} color={C.accent} />
      </View>
      <View>
        <Text style={s.infoLabel}>{label}</Text>
        <Text style={s.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

function TerrainBlock({
  terrain, terrainIdx, dayIdx, price, clubId, dateLabel,
  isBooked, bookedSlot, onBook, onConfirm,
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
    return !isBooked(`${clubId}|${terrain.name}|${dateLabel}|${SLOTS[si].start}`);
  }
  const availCount = SLOTS.filter((_, si) => slotAvail(si)).length;

  return (
    <View style={s.terrainCard}>
      <View style={s.terrainHeader}>
        <View style={[s.courtVisual, { backgroundColor: terrain.color }]}>
          <View style={s.courtOuter}>
            <View style={s.courtLineH} />
            <View style={s.courtLineV} />
            <View style={s.courtNet} />
          </View>
        </View>
        <View style={s.terrainMeta}>
          <Text style={s.terrainName}>{terrain.name}</Text>
          <View style={s.terrainTagsRow}>
            <View style={[s.typeTag, terrain.type === 'Outdoor' && s.typeTagOutdoor]}>
              <Text style={[s.typeTagText, terrain.type === 'Outdoor' && s.typeTagTextOutdoor]}>{terrain.type}</Text>
            </View>
            <Text style={s.surfaceText}>{terrain.surface}</Text>
          </View>
        </View>
        <View style={s.availBadge}>
          <View style={[s.availDot, availCount === 0 && s.availDotOff]} />
          <Text style={[s.availText, availCount === 0 && s.availTextOff]}>
            {availCount === 0 ? 'Complet' : `${availCount} dispo`}
          </Text>
        </View>
      </View>

      <View style={s.slotsGrid}>
        {SLOTS.map((slot, si) => {
          const avail = slotAvail(si);
          const key = `${terrain.id}-${dayIdx}-${si}`;
          const booked = bookedSlot === key;
          return (
            <TouchableOpacity
              key={si}
              style={[s.slotBtn, avail && s.slotBtnAvail, booked && s.slotBtnBooked, !avail && s.slotBtnOff]}
              disabled={!avail}
              activeOpacity={0.7}
              onPress={() => onBook(key)}
            >
              <Text style={[s.slotStart, avail && s.slotStartAvail, booked && s.slotStartBooked]}>{slot.start}</Text>
              <Text style={[s.slotArrow, avail && s.slotArrowAvail]}>→</Text>
              <Text style={[s.slotEnd, avail && s.slotEndAvail]}>{slot.end}</Text>
              {booked && <View style={s.checkCircle}><Ionicons name="checkmark" size={9} color="#fff" /></View>}
              {!avail && <Text style={s.slotComplet}>Complet</Text>}
            </TouchableOpacity>
          );
        })}
      </View>

      {bookedSlot?.startsWith(terrain.id) && (() => {
        const slotIdx = parseInt(bookedSlot.split('-')[2], 10);
        const slot = SLOTS[slotIdx];
        return (
          <TouchableOpacity style={s.confirmBtn} activeOpacity={0.85} onPress={() => onConfirm(slot.start, slot.end)}>
            <Ionicons name="arrow-forward-circle" size={18} color="#fff" />
            <Text style={s.confirmText}>Continuer · €{price}</Text>
          </TouchableOpacity>
        );
      })()}
    </View>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
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

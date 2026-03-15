import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar, TextInput,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useBookings } from '@/context/bookings';

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg: '#0A0A0F', surface: '#111118', surface2: '#18181F',
  border: 'rgba(255,255,255,0.07)', accent: '#4A8FE8',
  text: '#F0F0F5', muted: '#6B6B7E', card: '#13131A',
  green: '#4ade80', red: '#f87171', gold: '#F5A623',
};

// ─── Mes amis ─────────────────────────────────────────────────────────────────
const FRIENDS = [
  { id: 'f1', name: 'Julien L.',  initials: 'JL', color: '#1A3A6B', online: true  },
  { id: 'f2', name: 'Alice L.',   initials: 'AL', color: '#2D5FC4', online: true  },
  { id: 'f3', name: 'Raphaël C.', initials: 'RC', color: '#1A3F8F', online: false },
  { id: 'f4', name: 'Sophie M.',  initials: 'SM', color: '#4A2D8F', online: true  },
  { id: 'f5', name: 'Lucas B.',   initials: 'LB', color: '#0D2A5E', online: false },
  { id: 'f6', name: 'Emma D.',    initials: 'ED', color: '#2A1A6B', online: true  },
];

const ME = { id: 'me', name: 'Moi', initials: 'TM', color: '#4A8FE8' };
const MAX_PLAYERS = 4; // padel 2v2

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function BookingConfirmScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    clubId: string; clubName: string; clubIcon: string;
    terrainName: string; terrainType: string;
    dateLabel: string; slotStart: string; slotEnd: string;
    price: string;
  }>();

  const price = parseInt(params.price ?? '20', 10);
  const { addBooking } = useBookings();

  // Joueurs sélectionnés (moi toujours présent)
  const [selected, setSelected] = useState<string[]>([]);
  // Invités (joueurs inconnus)
  const [guests, setGuests] = useState<{ id: string; name: string }[]>([]);
  const [guestName, setGuestName] = useState('');
  const [showGuestInput, setShowGuestInput] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const totalPlayers = 1 + selected.length + guests.length;
  const spotsLeft = MAX_PLAYERS - totalPlayers;
  const pricePerPlayer = Math.round(price / MAX_PLAYERS);

  function toggleFriend(id: string) {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
    } else {
      if (totalPlayers < MAX_PLAYERS) setSelected([...selected, id]);
    }
  }

  function addGuest() {
    if (guests.length + selected.length + 1 >= MAX_PLAYERS) return;
    const name = guestName.trim() || `Invité ${guests.length + 1}`;
    setGuests([...guests, { id: `g${Date.now()}`, name }]);
    setGuestName('');
    setShowGuestInput(false);
  }

  function removeGuest(id: string) {
    setGuests(guests.filter((g) => g.id !== id));
  }

  if (confirmed) {
    return <SuccessScreen router={router} params={params} />;
  }

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      {/* ── Header ── */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={22} color={C.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Réservation</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* ── Récap réservation ── */}
        <View style={s.recapCard}>
          <View style={s.recapGlow} />

          <View style={s.recapRow}>
            <View style={s.recapIconWrap}>
              <Text style={s.recapIconEmoji}>{params.clubIcon ?? '🏟️'}</Text>
            </View>
            <View style={s.recapInfo}>
              <Text style={s.recapClubName}>{params.clubName}</Text>
              <Text style={s.recapTerrain}>{params.terrainName} · {params.terrainType}</Text>
            </View>
            <View style={s.recapPriceBadge}>
              <Text style={s.recapPrice}>€{price}</Text>
            </View>
          </View>

          <View style={s.recapDivider} />

          <View style={s.recapDetails}>
            <View style={s.recapDetail}>
              <Ionicons name="calendar-outline" size={14} color={C.accent} />
              <Text style={s.recapDetailText}>{params.dateLabel}</Text>
            </View>
            <View style={s.recapDetail}>
              <Ionicons name="time-outline" size={14} color={C.accent} />
              <Text style={s.recapDetailText}>{params.slotStart} → {params.slotEnd}</Text>
            </View>
            <View style={s.recapDetail}>
              <Ionicons name="people-outline" size={14} color={C.accent} />
              <Text style={s.recapDetailText}>4 joueurs · 2v2</Text>
            </View>
          </View>
        </View>

        {/* ── Spots visuels ── */}
        <View style={s.spotsSection}>
          <Text style={s.sectionTitle}>Équipe</Text>
          <Text style={s.sectionSub}>
            {spotsLeft > 0
              ? `${spotsLeft} place${spotsLeft > 1 ? 's' : ''} restante${spotsLeft > 1 ? 's' : ''}`
              : 'Équipe complète ✓'}
          </Text>
          <View style={s.spotsRow}>
            {/* Moi */}
            <View style={s.spotItem}>
              <View style={[s.spotAvatar, { backgroundColor: ME.color }]}>
                <Text style={s.spotInitials}>{ME.initials}</Text>
                <View style={s.spotCheckBadge}>
                  <Ionicons name="checkmark" size={8} color="#fff" />
                </View>
              </View>
              <Text style={s.spotName} numberOfLines={1}>{ME.name}</Text>
            </View>

            {/* Joueurs sélectionnés */}
            {selected.map((fid) => {
              const f = FRIENDS.find((fr) => fr.id === fid)!;
              return (
                <View key={fid} style={s.spotItem}>
                  <TouchableOpacity onPress={() => toggleFriend(fid)} activeOpacity={0.8}>
                    <View style={[s.spotAvatar, { backgroundColor: f.color }]}>
                      <Text style={s.spotInitials}>{f.initials}</Text>
                      <View style={s.spotCheckBadge}>
                        <Ionicons name="checkmark" size={8} color="#fff" />
                      </View>
                    </View>
                  </TouchableOpacity>
                  <Text style={s.spotName} numberOfLines={1}>{f.name.split(' ')[0]}</Text>
                </View>
              );
            })}

            {/* Invités */}
            {guests.map((g) => (
              <View key={g.id} style={s.spotItem}>
                <TouchableOpacity onPress={() => removeGuest(g.id)} activeOpacity={0.8}>
                  <View style={[s.spotAvatar, { backgroundColor: C.surface2, borderWidth: 1.5, borderColor: C.border }]}>
                    <Text style={[s.spotInitials, { color: C.muted }]}>
                      {g.name.slice(0, 2).toUpperCase()}
                    </Text>
                    <View style={[s.spotCheckBadge, { backgroundColor: C.muted }]}>
                      <Ionicons name="close" size={8} color="#fff" />
                    </View>
                  </View>
                </TouchableOpacity>
                <Text style={[s.spotName, { color: C.muted }]} numberOfLines={1}>
                  {g.name.split(' ')[0]}
                </Text>
              </View>
            ))}

            {/* Spots vides */}
            {Array.from({ length: spotsLeft }).map((_, i) => (
              <View key={`empty-${i}`} style={s.spotItem}>
                <View style={s.spotEmpty}>
                  <Ionicons name="person-add-outline" size={18} color={C.muted} />
                </View>
                <Text style={[s.spotName, { color: C.muted }]}>Libre</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Mes amis ── */}
        <View style={s.friendsSection}>
          <Text style={s.sectionTitle}>Mes amis</Text>
          <View style={s.friendsList}>
            {FRIENDS.map((f) => {
              const sel = selected.includes(f.id);
              const disabled = !sel && totalPlayers >= MAX_PLAYERS;
              return (
                <TouchableOpacity
                  key={f.id}
                  style={[s.friendRow, sel && s.friendRowSel, disabled && s.friendRowDisabled]}
                  onPress={() => toggleFriend(f.id)}
                  activeOpacity={0.75}
                  disabled={disabled}
                >
                  <View style={s.friendAvatarWrap}>
                    <View style={[s.friendAvatar, { backgroundColor: f.color }]}>
                      <Text style={s.friendInitials}>{f.initials}</Text>
                    </View>
                    {f.online && <View style={s.onlineDot} />}
                  </View>

                  <View style={s.friendInfo}>
                    <Text style={s.friendName}>{f.name}</Text>
                    <Text style={[s.friendStatus, f.online && s.friendStatusOnline]}>
                      {f.online ? 'En ligne' : 'Hors ligne'}
                    </Text>
                  </View>

                  <View style={[s.friendCheck, sel && s.friendCheckSel]}>
                    {sel && <Ionicons name="checkmark" size={13} color="#fff" />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── Inviter un inconnu ── */}
        <View style={s.guestSection}>
          <Text style={s.sectionTitle}>Inviter quelqu'un</Text>
          <Text style={s.sectionSub}>Joueur hors de votre liste d'amis</Text>

          {showGuestInput ? (
            <View style={s.guestInputRow}>
              <TextInput
                style={s.guestInput}
                placeholder="Prénom du joueur (optionnel)"
                placeholderTextColor={C.muted}
                value={guestName}
                onChangeText={setGuestName}
                autoFocus
              />
              <TouchableOpacity
                style={[s.guestAddBtn, (totalPlayers >= MAX_PLAYERS) && s.guestAddBtnOff]}
                onPress={addGuest}
                disabled={totalPlayers >= MAX_PLAYERS}
                activeOpacity={0.8}
              >
                <Text style={s.guestAddBtnText}>Ajouter</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[s.guestTrigger, totalPlayers >= MAX_PLAYERS && s.guestTriggerOff]}
              onPress={() => setShowGuestInput(true)}
              disabled={totalPlayers >= MAX_PLAYERS}
              activeOpacity={0.8}
            >
              <Ionicons
                name="person-add-outline"
                size={16}
                color={totalPlayers >= MAX_PLAYERS ? C.muted : C.accent}
              />
              <Text style={[s.guestTriggerText, totalPlayers >= MAX_PLAYERS && { color: C.muted }]}>
                {totalPlayers >= MAX_PLAYERS ? 'Équipe complète' : 'Ajouter un invité'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ── Résumé prix ── */}
        <View style={s.priceCard}>
          <View style={s.priceRow}>
            <Text style={s.priceLabel}>Terrain 1h30</Text>
            <Text style={s.priceVal}>€{price}</Text>
          </View>
          <View style={s.priceRow}>
            <Text style={s.priceLabel}>Joueurs</Text>
            <Text style={s.priceVal}>{totalPlayers} / {MAX_PLAYERS}</Text>
          </View>
          {totalPlayers > 1 && (
            <View style={s.priceRow}>
              <Text style={s.priceLabel}>Part par joueur</Text>
              <Text style={[s.priceVal, { color: C.green }]}>~€{pricePerPlayer}</Text>
            </View>
          )}
          <View style={s.priceDivider} />
          <View style={s.priceRow}>
            <Text style={s.priceTotalLabel}>Total</Text>
            <Text style={s.priceTotalVal}>€{price}</Text>
          </View>
        </View>

        {/* ── Bouton final ── */}
        <TouchableOpacity
          style={s.confirmBtn}
          activeOpacity={0.85}
          onPress={() => {
            addBooking({
              id: `booking-${Date.now()}`,
              clubId: params.clubId ?? '',
              clubName: params.clubName ?? '',
              clubIcon: params.clubIcon ?? '🏟️',
              terrainName: params.terrainName ?? '',
              terrainType: params.terrainType ?? '',
              dateLabel: params.dateLabel ?? '',
              slotStart: params.slotStart ?? '',
              slotEnd: params.slotEnd ?? '',
              price,
            });
            setConfirmed(true);
          }}
        >
          <Ionicons name="shield-checkmark" size={18} color="#fff" />
          <Text style={s.confirmText}>Confirmer et payer · €{price}</Text>
        </TouchableOpacity>

        <View style={{ height: 48 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Success screen ───────────────────────────────────────────────────────────
function SuccessScreen({ router, params }: { router: any; params: any }) {
  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <View style={s.successWrap}>
          <View style={s.successIconWrap}>
          <View style={s.successIconOuter}>
            <View style={s.successIconInner}>
              <Ionicons name="checkmark-sharp" size={34} color="#fff" />
            </View>
          </View>
        </View>

        <Text style={s.successTitle}>Réservation confirmée !</Text>
        <Text style={s.successSub}>
          {params.terrainName} · {params.clubName}
        </Text>
        <View style={s.successDetails}>
          <View style={s.successDetail}>
            <Ionicons name="calendar-outline" size={14} color={C.accent} />
            <Text style={s.successDetailText}>{params.dateLabel}</Text>
          </View>
          <View style={s.successDetail}>
            <Ionicons name="time-outline" size={14} color={C.accent} />
            <Text style={s.successDetailText}>{params.slotStart} → {params.slotEnd}</Text>
          </View>
        </View>

        <View style={s.successBadge}>
          <Text style={s.successBadgeText}>Un récap a été envoyé par email</Text>
        </View>

        <TouchableOpacity
          style={s.successBtn}
          onPress={() => router.navigate('/')}
          activeOpacity={0.85}
        >
          <Text style={s.successBtnText}>Retour à l'accueil</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={s.successBtnAlt}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Text style={s.successBtnAltText}>Voir mes réservations</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingBottom: 32 },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 10, gap: 12,
  },
  backBtn: {
    width: 38, height: 38, backgroundColor: C.surface2, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border,
  },
  headerTitle: {
    flex: 1, textAlign: 'center', fontWeight: '800',
    fontSize: 17, color: C.text, letterSpacing: -0.3,
  },

  // Recap card
  recapCard: {
    marginHorizontal: 20, marginTop: 8, marginBottom: 16,
    backgroundColor: '#131320', borderRadius: 20,
    borderWidth: 1, borderColor: 'rgba(74,143,232,0.25)',
    padding: 18, overflow: 'hidden',
  },
  recapGlow: {
    position: 'absolute', top: -40, right: -40, width: 130, height: 130,
    borderRadius: 65, backgroundColor: 'rgba(74,143,232,0.08)',
  },
  recapRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 },
  recapIconWrap: {
    width: 50, height: 50, borderRadius: 14, backgroundColor: C.surface2,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border,
  },
  recapIconEmoji: { fontSize: 24 },
  recapInfo: { flex: 1 },
  recapClubName: { fontWeight: '800', fontSize: 16, color: C.text, marginBottom: 3 },
  recapTerrain: { fontSize: 12, color: C.muted },
  recapPriceBadge: {
    backgroundColor: 'rgba(74,143,232,0.15)', borderWidth: 1,
    borderColor: 'rgba(74,143,232,0.3)', borderRadius: 12,
    paddingVertical: 6, paddingHorizontal: 12,
  },
  recapPrice: { fontWeight: '800', fontSize: 18, color: C.accent },
  recapDivider: { height: 1, backgroundColor: C.border, marginBottom: 14 },
  recapDetails: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  recapDetail: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  recapDetailText: { fontSize: 12, color: C.text, fontWeight: '600' },

  // Spots
  spotsSection: { marginHorizontal: 20, marginBottom: 20 },
  sectionTitle: { fontWeight: '800', fontSize: 16, color: C.text, letterSpacing: -0.3, marginBottom: 4 },
  sectionSub: { fontSize: 12, color: C.muted, marginBottom: 14 },
  spotsRow: { flexDirection: 'row', gap: 12 },
  spotItem: { alignItems: 'center', gap: 6 },
  spotAvatar: {
    width: 56, height: 56, borderRadius: 28,
    alignItems: 'center', justifyContent: 'center', position: 'relative',
  },
  spotInitials: { fontWeight: '800', fontSize: 16, color: '#fff' },
  spotCheckBadge: {
    position: 'absolute', bottom: -3, right: -3,
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: C.bg,
  },
  spotEmpty: {
    width: 56, height: 56, borderRadius: 16,
    backgroundColor: C.surface2, borderWidth: 1.5,
    borderColor: C.border, borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center',
  },
  spotName: { fontSize: 10, fontWeight: '700', color: C.text },

  // Friends
  friendsSection: { marginHorizontal: 20, marginBottom: 20 },
  friendsList: { gap: 8 },
  friendRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: C.card, borderWidth: 1, borderColor: C.border,
    borderRadius: 16, padding: 14,
  },
  friendRowSel: { borderColor: 'rgba(74,143,232,0.4)', backgroundColor: '#101020' },
  friendRowDisabled: { opacity: 0.4 },
  friendAvatarWrap: { position: 'relative' },
  friendAvatar: {
    width: 44, height: 44, borderRadius: 13,
    alignItems: 'center', justifyContent: 'center',
  },
  friendInitials: { fontWeight: '800', fontSize: 14, color: '#fff' },
  onlineDot: {
    position: 'absolute', bottom: -1, right: -1,
    width: 11, height: 11, borderRadius: 6,
    backgroundColor: C.green, borderWidth: 2, borderColor: C.bg,
  },
  friendInfo: { flex: 1 },
  friendName: { fontWeight: '700', fontSize: 14, color: C.text, marginBottom: 2 },
  friendStatus: { fontSize: 11, color: C.muted },
  friendStatusOnline: { color: C.green },
  friendCheck: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 1.5, borderColor: C.border, backgroundColor: C.surface2,
    alignItems: 'center', justifyContent: 'center',
  },
  friendCheckSel: { backgroundColor: C.accent, borderColor: C.accent },

  // Guest
  guestSection: { marginHorizontal: 20, marginBottom: 20 },
  guestTrigger: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: 'rgba(74,143,232,0.07)', borderWidth: 1,
    borderColor: 'rgba(74,143,232,0.2)', borderRadius: 14,
    paddingVertical: 14, paddingHorizontal: 18, borderStyle: 'dashed',
  },
  guestTriggerOff: {
    backgroundColor: C.surface2, borderColor: C.border, borderStyle: 'solid',
  },
  guestTriggerText: { fontWeight: '700', fontSize: 14, color: C.accent },
  guestInputRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  guestInput: {
    flex: 1, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border,
    borderRadius: 12, paddingVertical: 13, paddingHorizontal: 16,
    color: C.text, fontSize: 14,
  },
  guestAddBtn: {
    backgroundColor: C.accent, borderRadius: 12,
    paddingVertical: 13, paddingHorizontal: 18,
  },
  guestAddBtnOff: { backgroundColor: C.surface2 },
  guestAddBtnText: { fontWeight: '700', fontSize: 14, color: C.bg },

  // Price
  priceCard: {
    marginHorizontal: 20, marginBottom: 16,
    backgroundColor: C.card, borderRadius: 18,
    borderWidth: 1, borderColor: C.border, padding: 18,
  },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  priceLabel: { fontSize: 13, color: C.muted, fontWeight: '600' },
  priceVal: { fontSize: 13, color: C.text, fontWeight: '700' },
  priceDivider: { height: 1, backgroundColor: C.border, marginBottom: 10 },
  priceTotalLabel: { fontSize: 15, color: C.text, fontWeight: '800' },
  priceTotalVal: { fontSize: 18, color: C.accent, fontWeight: '800' },

  // Confirm btn
  confirmBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, marginHorizontal: 20, backgroundColor: C.accent,
    borderRadius: 16, paddingVertical: 16,
  },
  confirmText: { fontWeight: '800', fontSize: 15, color: '#fff', letterSpacing: 0.2 },

  // Success
  successWrap: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 32, overflow: 'hidden',
  },
  successGlow: {
    position: 'absolute',
    top: '10%',
    width: 310,
    height: 380,
    borderRadius: 32,
    backgroundColor: 'rgba(74,143,232,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(74,143,232,0.1)',
  },
  successIconWrap: { marginBottom: 28 },
  successIconOuter: {
    width: 96, height: 96, borderRadius: 28,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: C.accent, shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.35, shadowRadius: 28,
  },
  successIconInner: {
    width: 72, height: 72, borderRadius: 20,
    backgroundColor: C.accent,
    alignItems: 'center', justifyContent: 'center',
  },
  successTitle: {
    fontWeight: '800', fontSize: 26, color: C.text,
    letterSpacing: -0.5, textAlign: 'center', marginBottom: 8,
  },
  successSub: { fontSize: 14, color: C.muted, textAlign: 'center', marginBottom: 20 },
  successDetails: { flexDirection: 'row', gap: 16, marginBottom: 24 },
  successDetail: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  successDetailText: { fontSize: 13, color: C.text, fontWeight: '600' },
  successBadge: {
    backgroundColor: 'rgba(74,222,128,0.1)', borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.25)', borderRadius: 100,
    paddingVertical: 6, paddingHorizontal: 16, marginBottom: 32,
  },
  successBadgeText: { fontSize: 12, color: C.green, fontWeight: '700' },
  successBtn: {
    width: '100%', backgroundColor: C.accent, borderRadius: 16,
    paddingVertical: 16, alignItems: 'center', marginBottom: 10,
  },
  successBtnText: { fontWeight: '800', fontSize: 15, color: '#fff' },
  successBtnAlt: {
    width: '100%', backgroundColor: C.surface2, borderWidth: 1,
    borderColor: C.border, borderRadius: 16,
    paddingVertical: 16, alignItems: 'center',
  },
  successBtnAltText: { fontWeight: '700', fontSize: 14, color: C.text },
});

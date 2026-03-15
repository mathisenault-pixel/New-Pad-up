import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar, Modal, TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBookings } from '@/context/bookings';
import { useProfile } from '@/context/profile';

const C = {
  bg: '#0A0A0F', surface2: '#18181F', border: 'rgba(255,255,255,0.07)',
  accent: '#4A8FE8', text: '#F0F0F5', muted: '#6B6B7E',
  card: '#13131A', green: '#4ade80', gold: '#F5A623',
};

const STATS = [
  { value: '87', label: 'Matchs' },
  { value: '61%', label: 'Victoires' },
  { value: '2430', label: 'Points' },
];

const MATCHES = [
  { id: '1', result: 'V', vs: 'Alice L. & Raphaël C.', club: 'QG Padel', when: 'il y a 2h', type: 'Match amical', score: '6·4', pts: '+18 pts', win: true },
  { id: '2', result: 'V', vs: 'Marc C. & Paul D.', club: 'Cocoon Padel', when: 'Hier', type: 'Compétition', score: '7·5', pts: '+24 pts', win: true },
  { id: '3', result: 'D', vs: 'Julien L. & Sofiane M.', club: 'Club Nation', when: 'Mar 10', type: 'Match amical', score: '3·6', pts: '−12 pts', win: false },
  { id: '4', result: 'V', vs: 'Thomas B. & Rémi V.', club: 'QG Padel', when: 'Mar 8', type: 'Compétition', score: '6·2', pts: '+20 pts', win: true },
];

const FRIENDS = [
  { id: '1', initials: 'AL', bg: '#3B6FD4', name: 'Alice', online: true },
  { id: '2', initials: 'JL', bg: '#2B6CB0', name: 'Julien', online: true },
  { id: '3', initials: 'RC', bg: '#1A3F8F', name: 'Raphaël', online: false },
  { id: '4', initials: 'SM', bg: '#4A2D8F', name: 'Sofiane', online: false },
  { id: '5', initials: 'PD', bg: '#0D3B6E', name: 'Paul', online: false },
];

const FRIENDS_PROFILES: Record<string, {
  name: string; handle: string; location: string; since: string;
  level: number; ranking: number; bg: string; initials: string; online: boolean;
  stats: { value: string; label: string }[];
  chartData: { val: number; label: string }[];
  matches: { result: string; vs: string; club: string; when: string; type: string; score: string; pts: string; win: boolean }[];
}> = {
  '1': {
    name: 'Alice Lévêque', handle: '@alice_padel', location: 'Paris 11', since: '2020',
    level: 6, ranking: 1850, bg: '#3B6FD4', initials: 'AL', online: true,
    stats: [{ value: '64', label: 'Matchs' }, { value: '68%', label: 'Victoires' }, { value: '1850', label: 'Points' }],
    chartData: [
      { val: 2100, label: 'Jan' }, { val: 2050, label: 'Fév' }, { val: 1980, label: 'Mar' },
      { val: 1920, label: 'Avr' }, { val: 1870, label: 'Mai' }, { val: 1850, label: 'Jun' },
    ],
    matches: [
      { result: 'V', vs: 'Marie D. & Sophie L.', club: 'Cocoon Padel', when: 'il y a 1h', type: 'Match amical', score: '6·3', pts: '+16 pts', win: true },
      { result: 'D', vs: 'Laura M. & Emma R.', club: 'QG Padel', when: 'Hier', type: 'Compétition', score: '4·6', pts: '−10 pts', win: false },
      { result: 'V', vs: 'Julie A. & Clara B.', club: 'ZE Padel', when: 'Mar 12', type: 'Match amical', score: '6·1', pts: '+14 pts', win: true },
    ],
  },
  '2': {
    name: 'Julien Larue', handle: '@julien_lr', location: 'Paris 12', since: '2018',
    level: 8, ranking: 3120, bg: '#2B6CB0', initials: 'JL', online: true,
    stats: [{ value: '112', label: 'Matchs' }, { value: '71%', label: 'Victoires' }, { value: '3120', label: 'Points' }],
    chartData: [
      { val: 2800, label: 'Jan' }, { val: 2900, label: 'Fév' }, { val: 2950, label: 'Mar' },
      { val: 3000, label: 'Avr' }, { val: 3080, label: 'Mai' }, { val: 3120, label: 'Jun' },
    ],
    matches: [
      { result: 'V', vs: 'Thomas B. & Marc D.', club: 'Club Nation', when: 'il y a 3h', type: 'Compétition', score: '6·4', pts: '+28 pts', win: true },
      { result: 'V', vs: 'Rémi V. & Paul D.', club: 'QG Padel', when: 'Mar 13', type: 'Match amical', score: '7·5', pts: '+18 pts', win: true },
      { result: 'D', vs: 'Alex C. & Nico F.', club: 'Cocoon Padel', when: 'Mar 11', type: 'Compétition', score: '5·7', pts: '−15 pts', win: false },
    ],
  },
  '3': {
    name: 'Raphaël Collin', handle: '@raph_padel', location: 'Paris 15', since: '2021',
    level: 5, ranking: 1340, bg: '#1A3F8F', initials: 'RC', online: false,
    stats: [{ value: '41', label: 'Matchs' }, { value: '54%', label: 'Victoires' }, { value: '1340', label: 'Points' }],
    chartData: [
      { val: 1100, label: 'Jan' }, { val: 1150, label: 'Fév' }, { val: 1200, label: 'Mar' },
      { val: 1250, label: 'Avr' }, { val: 1300, label: 'Mai' }, { val: 1340, label: 'Jun' },
    ],
    matches: [
      { result: 'D', vs: 'Hugo M. & Luc T.', club: 'ZE Padel', when: 'Mar 10', type: 'Match amical', score: '3·6', pts: '−8 pts', win: false },
      { result: 'V', vs: 'Félix R. & Noé P.', club: 'QG Padel', when: 'Mar 8', type: 'Match amical', score: '6·2', pts: '+12 pts', win: true },
    ],
  },
  '4': {
    name: 'Sofiane Maarek', handle: '@sofi_maarek', location: 'Paris 20', since: '2019',
    level: 7, ranking: 2650, bg: '#4A2D8F', initials: 'SM', online: false,
    stats: [{ value: '93', label: 'Matchs' }, { value: '63%', label: 'Victoires' }, { value: '2650', label: 'Points' }],
    chartData: [
      { val: 2900, label: 'Jan' }, { val: 2850, label: 'Fév' }, { val: 2780, label: 'Mar' },
      { val: 2720, label: 'Avr' }, { val: 2680, label: 'Mai' }, { val: 2650, label: 'Jun' },
    ],
    matches: [
      { result: 'V', vs: 'Karim B. & Yann D.', club: 'Padel Bastille', when: 'Hier', type: 'Compétition', score: '6·3', pts: '+22 pts', win: true },
      { result: 'V', vs: 'Omar S. & Riad M.', club: 'Club Nation', when: 'Mar 11', type: 'Match amical', score: '7·6', pts: '+16 pts', win: true },
      { result: 'D', vs: 'Mehdi L. & Amine K.', club: 'QG Padel', when: 'Mar 9', type: 'Compétition', score: '4·6', pts: '−12 pts', win: false },
    ],
  },
  '5': {
    name: 'Paul Dupré', handle: '@paul_dupre', location: 'Paris 8', since: '2022',
    level: 4, ranking: 980, bg: '#0D3B6E', initials: 'PD', online: false,
    stats: [{ value: '28', label: 'Matchs' }, { value: '46%', label: 'Victoires' }, { value: '980', label: 'Points' }],
    chartData: [
      { val: 750, label: 'Jan' }, { val: 800, label: 'Fév' }, { val: 840, label: 'Mar' },
      { val: 900, label: 'Avr' }, { val: 940, label: 'Mai' }, { val: 980, label: 'Jun' },
    ],
    matches: [
      { result: 'D', vs: 'Lucas B. & Théo M.', club: 'Cocoon Padel', when: 'Mar 13', type: 'Match amical', score: '2·6', pts: '−6 pts', win: false },
      { result: 'V', vs: 'Axel D. & Simon V.', club: 'ZE Padel', when: 'Mar 9', type: 'Match amical', score: '6·4', pts: '+10 pts', win: true },
    ],
  },
};

const LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// Graphe simplifié (points SVG-like avec des View)
const CHART_DATA = [
  { val: 2790, label: 'Jan' },
  { val: 2730, label: 'Fév' },
  { val: 2610, label: 'Mar' },
  { val: 2560, label: 'Avr' },
  { val: 2480, label: 'Mai' },
  { val: 2430, label: 'Jun' },
];

function MiniChart() {
  const [chartWidth, setChartWidth] = useState(0);
  const H = 72;
  const DOT = 7;
  const PAD = DOT / 2 + 1;

  const vals = CHART_DATA.map((d) => d.val);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = max - min || 1;
  const n = CHART_DATA.length;

  const pts = chartWidth > 0
    ? CHART_DATA.map((d, i) => ({
        x: PAD + (i / (n - 1)) * (chartWidth - PAD * 2),
        y: PAD + (1 - (d.val - min) / range) * (H - PAD * 2),
        label: d.label,
      }))
    : [];

  return (
    <View onLayout={(e) => setChartWidth(e.nativeEvent.layout.width)}>
      {/* Lignes de grille */}
      <View style={{ height: H, position: 'relative' }}>
        {[0.25, 0.5, 0.75].map((t) => (
          <View key={t} style={{
            position: 'absolute', left: 0, right: 0,
            top: PAD + t * (H - PAD * 2),
            height: 1, backgroundColor: 'rgba(255,255,255,0.04)',
          }} />
        ))}

        {/* Segments de courbe */}
        {pts.slice(0, -1).map((p1, i) => {
          const p2 = pts[i + 1];
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const len = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);
          const cx = (p1.x + p2.x) / 2;
          const cy = (p1.y + p2.y) / 2;
          return (
            <View key={i} style={{
              position: 'absolute',
              left: cx - len / 2,
              top: cy - 1,
              width: len,
              height: 2,
              borderRadius: 1,
              backgroundColor: C.accent,
              opacity: 0.85,
              transform: [{ rotate: `${angle}deg` }],
            }} />
          );
        })}

        {/* Points */}
        {pts.map((p, i) => {
          const isLast = i === pts.length - 1;
          return (
            <View key={i} style={{
              position: 'absolute',
              left: p.x - DOT / 2,
              top: p.y - DOT / 2,
              width: DOT,
              height: DOT,
              borderRadius: DOT / 2,
              backgroundColor: isLast ? C.accent : 'rgba(74,143,232,0.5)',
              borderWidth: isLast ? 1.5 : 0,
              borderColor: '#fff',
            }} />
          );
        })}
      </View>

      {/* Labels mois */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
        {CHART_DATA.map((d) => (
          <Text key={d.label} style={{ fontSize: 9, color: C.muted, width: 24, textAlign: 'center' }}>{d.label}</Text>
        ))}
      </View>
    </View>
  );
}

// ─── Courbe mini pour profil ami ──────────────────────────────────────────────

function FriendChart({ data }: { data: { val: number; label: string }[] }) {
  const [chartWidth, setChartWidth] = useState(0);
  const H = 72; const DOT = 7; const PAD = DOT / 2 + 1;
  const vals = data.map((d) => d.val);
  const min = Math.min(...vals); const max = Math.max(...vals);
  const range = max - min || 1; const n = data.length;
  const pts = chartWidth > 0
    ? data.map((d, i) => ({
        x: PAD + (i / (n - 1)) * (chartWidth - PAD * 2),
        y: PAD + (1 - (d.val - min) / range) * (H - PAD * 2),
      }))
    : [];
  return (
    <View onLayout={(e) => setChartWidth(e.nativeEvent.layout.width)}>
      <View style={{ height: H, position: 'relative' }}>
        {[0.25, 0.5, 0.75].map((t) => (
          <View key={t} style={{ position: 'absolute', left: 0, right: 0, top: PAD + t * (H - PAD * 2), height: 1, backgroundColor: 'rgba(255,255,255,0.04)' }} />
        ))}
        {pts.slice(0, -1).map((p1, i) => {
          const p2 = pts[i + 1];
          const dx = p2.x - p1.x; const dy = p2.y - p1.y;
          const len = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);
          return (
            <View key={i} style={{ position: 'absolute', left: (p1.x + p2.x) / 2 - len / 2, top: (p1.y + p2.y) / 2 - 1, width: len, height: 2, borderRadius: 1, backgroundColor: C.accent, opacity: 0.85, transform: [{ rotate: `${angle}deg` }] }} />
          );
        })}
        {pts.map((p, i) => (
          <View key={i} style={{ position: 'absolute', left: p.x - DOT / 2, top: p.y - DOT / 2, width: DOT, height: DOT, borderRadius: DOT / 2, backgroundColor: i === pts.length - 1 ? C.accent : 'rgba(74,143,232,0.5)', borderWidth: i === pts.length - 1 ? 1.5 : 0, borderColor: '#fff' }} />
        ))}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
        {data.map((d) => <Text key={d.label} style={{ fontSize: 9, color: C.muted, width: 24, textAlign: 'center' }}>{d.label}</Text>)}
      </View>
    </View>
  );
}

// ─── Vue profil ami ───────────────────────────────────────────────────────────

function FriendProfileView({ friendId, onClose }: { friendId: string; onClose: () => void }) {
  const friend = FRIENDS_PROFILES[friendId];
  if (!friend) return null;
  const delta = friend.chartData[friend.chartData.length - 1].val - friend.chartData[0].val;
  const deltaStr = (delta > 0 ? '+' : '') + delta + ' pts';
  const deltaColor = delta >= 0 ? C.green : '#f87171';

  return (
    <Modal visible animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={[s.safe, { backgroundColor: C.bg }]}>
        <StatusBar barStyle="light-content" />
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8, gap: 12 }}>
            <TouchableOpacity onPress={onClose} style={fp.backBtn} activeOpacity={0.7}>
              <Ionicons name="chevron-down" size={20} color={C.text} />
            </TouchableOpacity>
            <Text style={fp.headerTitle}>Profil</Text>
            <View style={{ width: 38 }} />
          </View>

          {/* Cover */}
          <View style={[fp.cover, { backgroundColor: friend.bg + '44' }]}>
            <View style={fp.coverGlow} />
            <View style={fp.coverCourt} />
          </View>

          {/* Avatar */}
          <View style={fp.avatarSection}>
            <View style={fp.avatarRow}>
              <View style={fp.avatarWrap}>
                <View style={[fp.avatar, { backgroundColor: friend.bg }]}>
                  <Text style={fp.avatarInitials}>{friend.initials}</Text>
                </View>
                <View style={fp.avatarLevel}>
                  <Text style={fp.avatarLevelText}>Niv. {friend.level}</Text>
                </View>
              </View>
              <View style={[fp.onlineBadge, { backgroundColor: friend.online ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.05)', borderColor: friend.online ? 'rgba(74,222,128,0.3)' : C.border }]}>
                <View style={[fp.onlineDot, { backgroundColor: friend.online ? C.green : C.muted }]} />
                <Text style={[fp.onlineText, { color: friend.online ? C.green : C.muted }]}>{friend.online ? 'En ligne' : 'Hors ligne'}</Text>
              </View>
            </View>
            <Text style={fp.name}>{friend.name}</Text>
            <Text style={fp.handle}>{friend.handle} · {friend.location} · Padel depuis {friend.since}</Text>

            {/* Stats */}
            <View style={fp.statsStrip}>
              {friend.stats.map((st, i) => (
                <React.Fragment key={st.label}>
                  {i > 0 && <View style={fp.statDiv} />}
                  <View style={fp.statItem}>
                    <Text style={fp.statNum}>{st.value}</Text>
                    <Text style={fp.statLbl}>{st.label}</Text>
                  </View>
                </React.Fragment>
              ))}
            </View>
          </View>

          {/* Progression */}
          <View style={fp.chartCard}>
            <View style={fp.chartTop}>
              <View>
                <Text style={fp.chartTitle}>Progression classement</Text>
                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                  <Text style={fp.chartVal}>{friend.ranking.toLocaleString('fr-FR')}</Text>
                  <Text style={[fp.chartDelta, { color: deltaColor }]}> {delta >= 0 ? '↑' : '↓'} {deltaStr}</Text>
                </View>
                <Text style={fp.chartSub}>depuis janvier</Text>
              </View>
            </View>
            <FriendChart data={friend.chartData} />
          </View>

          {/* Derniers matchs */}
          <View style={fp.sectionHeader}>
            <Text style={fp.sectionTitle}>Derniers matchs</Text>
          </View>
          <View style={fp.matchCard}>
            {friend.matches.map((m, i) => (
              <View key={i} style={[fp.matchRow, i < friend.matches.length - 1 && fp.matchRowBorder]}>
                <View style={[fp.resultDot, m.win ? fp.dotWin : fp.dotLose]}>
                  <Text style={[fp.resultDotText, { color: m.win ? C.green : '#f87171' }]}>{m.result}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={fp.matchVs}>{m.vs}</Text>
                  <Text style={fp.matchMeta}>{m.club} · {m.when} · {m.type}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={fp.matchScore}>{m.score}</Text>
                  <Text style={[fp.matchPts, { color: m.win ? C.green : '#f87171' }]}>{m.pts}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

export default function ProfilScreen() {
  const { bookings } = useBookings();
  const { profile, updateProfile } = useProfile();

  const [editVisible, setEditVisible] = useState(false);
  const [draft, setDraft] = useState({ ...profile });
  const [openFriendId, setOpenFriendId] = useState<string | null>(null);

  // Paramètres
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [privacy, setPrivacy] = useState<'Public' | 'Privé'>('Public');
  const [displayLevel, setDisplayLevel] = useState(7);
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  function openEdit() {
    setDraft({ ...profile });
    setEditVisible(true);
  }

  function saveEdit() {
    updateProfile(draft);
    setEditVisible(false);
  }

  // Initiales depuis le nom
  const initials = profile.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cover */}
        <View style={s.cover}>
          <View style={s.coverGrid} />
          <View style={s.coverGlow} />
          {/* Court décoratif */}
          <View style={s.coverCourt} />
        </View>

        {/* Avatar section */}
        <View style={s.avatarSection}>
          <View style={s.avatarRow}>
            <View style={s.avatarWrap}>
              <View style={s.avatar}>
                <Text style={s.avatarInitials}>{initials}</Text>
              </View>
              <View style={s.avatarLevel}>
                <Text style={s.avatarLevelText}>Niv. {profile.level}</Text>
              </View>
            </View>
            <View style={s.avatarBtns}>
              <TouchableOpacity style={s.btnEdit} activeOpacity={0.8} onPress={openEdit}>
                <Text style={s.btnEditText}>Modifier</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={s.profileName}>{profile.name}</Text>
          <Text style={s.profileHandle}>{profile.handle} · {profile.location} · Padel depuis {profile.since}</Text>

          {/* Stats strip */}
          <View style={s.statsStrip}>
            {STATS.map((st, i) => (
              <React.Fragment key={st.label}>
                {i > 0 && <View style={s.statDivider} />}
                <View style={s.statItem}>
                  <Text style={s.statNum}>{st.value}</Text>
                  <Text style={s.statLbl}>{st.label}</Text>
                </View>
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Progression chart */}
        <View style={s.chartCard}>
          <View style={s.chartTop}>
            <View>
              <Text style={s.chartTitle}>Progression classement</Text>
              <View style={s.chartValRow}>
                <Text style={s.chartVal}>2 430</Text>
                <Text style={s.chartDelta}> ↑ +180 pts</Text>
              </View>
              <Text style={s.chartSub}>depuis janvier</Text>
            </View>
            <TouchableOpacity style={s.periodBtn}>
              <Text style={s.periodBtnText}>6 mois</Text>
            </TouchableOpacity>
          </View>
          <MiniChart />
        </View>

        {/* Mes réservations */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Mes réservations</Text>
          {bookings.length > 0 && (
            <View style={s.bookingCount}>
              <Text style={s.bookingCountText}>{bookings.length}</Text>
            </View>
          )}
        </View>

        {bookings.length === 0 ? (
          <View style={s.emptyBookings}>
            <Ionicons name="calendar-outline" size={32} color={C.muted} />
            <Text style={s.emptyBookingsText}>Aucune réservation</Text>
            <Text style={s.emptyBookingsSub}>Vos réservations à venir apparaîtront ici</Text>
          </View>
        ) : (
          <View style={s.bookingsList}>
            {bookings.map((b) => (
              <View key={b.id} style={s.bookingRow}>
                <View style={s.bookingRowGlow} />
                <View style={s.bookingRowIconWrap}>
                  <Text style={{ fontSize: 20 }}>{b.clubIcon}</Text>
                </View>
                <View style={s.bookingRowInfo}>
                  <View style={s.bookingRowTop}>
                    <Text style={s.bookingRowName}>{b.terrainName}</Text>
                    <Text style={s.bookingRowPrice}>€{b.price}</Text>
                  </View>
                  <Text style={s.bookingRowClub}>{b.clubName} · {b.terrainType}</Text>
                  <View style={s.bookingRowMeta}>
                    <Ionicons name="calendar-outline" size={11} color={C.muted} />
                    <Text style={s.bookingRowMetaText}>{b.dateLabel}</Text>
                    <Ionicons name="time-outline" size={11} color={C.muted} />
                    <Text style={s.bookingRowMetaText}>{b.slotStart} → {b.slotEnd}</Text>
                  </View>
                </View>
                <View style={s.bookingStatusBadge}>
                  <View style={s.bookingStatusDot} />
                  <Text style={s.bookingStatusText}>Confirmé</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Derniers matchs */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Derniers matchs</Text>
          <TouchableOpacity><Text style={s.sectionLink}>Voir tout →</Text></TouchableOpacity>
        </View>

        <View style={s.matchCard}>
          {MATCHES.map((m, i) => (
            <TouchableOpacity
              key={m.id}
              style={[s.matchRow, i < MATCHES.length - 1 && s.matchRowBorder]}
              activeOpacity={0.7}
            >
              <View style={[s.resultDot, m.win ? s.dotWin : s.dotLose]}>
                <Text style={[s.resultDotText, m.win ? s.dotWinText : s.dotLoseText]}>{m.result}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.matchVs}>{m.vs}</Text>
                <Text style={s.matchMeta}>{m.club} · {m.when} · {m.type}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={s.matchScore}>{m.score}</Text>
                <Text style={[s.matchPts, !m.win && s.matchPtsNeg]}>{m.pts}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Amis */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Amis · 38</Text>
          <TouchableOpacity><Text style={s.sectionLink}>Voir tout →</Text></TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.friendsRow}
        >
          {FRIENDS.map((f) => (
            <TouchableOpacity key={f.id} style={s.friendCard} activeOpacity={0.8} onPress={() => setOpenFriendId(f.id)}>
              <View style={[s.friendAvatar, { backgroundColor: f.bg }]}>
                <Text style={s.friendInitials}>{f.initials}</Text>
                {f.online && <View style={s.friendOnline} />}
              </View>
              <Text style={s.friendName}>{f.name}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={s.friendCard} activeOpacity={0.8}>
            <View style={s.friendAdd}>
              <Text style={s.friendAddText}>＋</Text>
            </View>
            <Text style={s.friendName}>Ajouter</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Paramètres */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Paramètres</Text>
        </View>

        <View style={s.settingsList}>
          {/* Notifications */}
          <TouchableOpacity style={[s.settingRow, s.settingRowBorder]} activeOpacity={0.7} onPress={() => setNotifEnabled((v) => !v)}>
            <View style={[s.settingIcon, { backgroundColor: 'rgba(74,143,232,0.1)' }]}>
              <Text style={{ fontSize: 18 }}>🔔</Text>
            </View>
            <Text style={s.settingLabel}>Notifications</Text>
            <View style={[s.toggle, notifEnabled && s.toggleOn]}>
              <View style={[s.toggleThumb, notifEnabled && s.toggleThumbOn]} />
            </View>
          </TouchableOpacity>

          {/* Confidentialité */}
          <TouchableOpacity style={[s.settingRow, s.settingRowBorder]} activeOpacity={0.7} onPress={() => setPrivacy((v) => v === 'Public' ? 'Privé' : 'Public')}>
            <View style={[s.settingIcon, { backgroundColor: 'rgba(74,222,128,0.08)' }]}>
              <Text style={{ fontSize: 18 }}>🔒</Text>
            </View>
            <Text style={s.settingLabel}>Confidentialité</Text>
            <Text style={s.settingValue}>{privacy}</Text>
            <Text style={s.settingArrow}>›</Text>
          </TouchableOpacity>

          {/* Niveau affiché */}
          <TouchableOpacity style={[s.settingRow, s.settingRowBorder]} activeOpacity={0.7} onPress={() => setShowLevelModal(true)}>
            <View style={[s.settingIcon, { backgroundColor: 'rgba(245,166,35,0.1)' }]}>
              <Text style={{ fontSize: 18 }}>🎯</Text>
            </View>
            <Text style={s.settingLabel}>Niveau affiché</Text>
            <Text style={s.settingValue}>Niv. {displayLevel}</Text>
            <Text style={s.settingArrow}>›</Text>
          </TouchableOpacity>

          {/* Paiement */}
          <TouchableOpacity style={[s.settingRow, s.settingRowBorder]} activeOpacity={0.7} onPress={() => setShowPaymentModal(true)}>
            <View style={[s.settingIcon, { backgroundColor: 'rgba(74,143,232,0.08)' }]}>
              <Text style={{ fontSize: 18 }}>💳</Text>
            </View>
            <Text style={s.settingLabel}>Paiement</Text>
            <Text style={s.settingValue}>Visa ···6411</Text>
            <Text style={s.settingArrow}>›</Text>
          </TouchableOpacity>

          {/* Se déconnecter */}
          <TouchableOpacity style={s.settingRow} activeOpacity={0.7} onPress={() => Alert.alert('Se déconnecter', 'Voulez-vous vraiment vous déconnecter ?', [
            { text: 'Annuler', style: 'cancel' },
            { text: 'Se déconnecter', style: 'destructive', onPress: () => {} },
          ])}>
            <View style={[s.settingIcon, { backgroundColor: 'rgba(239,68,68,0.1)' }]}>
              <Text style={{ fontSize: 18 }}>🚪</Text>
            </View>
            <Text style={[s.settingLabel, { color: '#f87171' }]}>Se déconnecter</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ── Modal édition profil ── */}
      {openFriendId && <FriendProfileView friendId={openFriendId} onClose={() => setOpenFriendId(null)} />}

      {/* Modal niveau affiché */}
      <Modal visible={showLevelModal} transparent animationType="slide" onRequestClose={() => setShowLevelModal(false)}>
        <TouchableOpacity style={s.modalOverlay} activeOpacity={1} onPress={() => setShowLevelModal(false)}>
          <TouchableOpacity activeOpacity={1} style={s.modalSheet} onPress={() => {}}>
            <View style={s.modalHandle} />
            <Text style={s.modalTitle}>Niveau affiché</Text>
            <Text style={{ fontSize: 13, color: C.muted, marginBottom: 20 }}>Choisissez le niveau visible sur votre profil</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {LEVELS.map((lvl) => (
                <TouchableOpacity key={lvl} onPress={() => { setDisplayLevel(lvl); setShowLevelModal(false); }} activeOpacity={0.7}
                  style={[s.levelPill, displayLevel === lvl && s.levelPillActive]}>
                  <Text style={[s.levelPillText, displayLevel === lvl && s.levelPillTextActive]}>Niv. {lvl}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Modal paiement */}
      <Modal visible={showPaymentModal} transparent animationType="slide" onRequestClose={() => setShowPaymentModal(false)}>
        <TouchableOpacity style={s.modalOverlay} activeOpacity={1} onPress={() => setShowPaymentModal(false)}>
          <TouchableOpacity activeOpacity={1} style={s.modalSheet} onPress={() => {}}>
            <View style={s.modalHandle} />
            <Text style={s.modalTitle}>Paiement</Text>
            <View style={s.payCard}>
              <View style={s.payCardChip} />
              <Text style={s.payCardNum}>•••• •••• •••• 6411</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
                <View>
                  <Text style={s.payCardLabel}>TITULAIRE</Text>
                  <Text style={s.payCardVal}>{profile.name.toUpperCase()}</Text>
                </View>
                <View>
                  <Text style={s.payCardLabel}>EXPIRE</Text>
                  <Text style={s.payCardVal}>09/27</Text>
                </View>
                <View style={s.payCardBrand}>
                  <Text style={{ fontSize: 13, fontWeight: '800', color: '#fff', letterSpacing: 0.5 }}>VISA</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={s.payAddBtn} activeOpacity={0.8} onPress={() => Alert.alert('Bientôt disponible', 'L\'ajout de carte sera disponible prochainement.')}>
              <Ionicons name="add" size={16} color={C.accent} />
              <Text style={s.payAddText}>Ajouter une carte</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.saveBtn} onPress={() => setShowPaymentModal(false)} activeOpacity={0.85}>
              <Text style={s.saveBtnText}>Fermer</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <Modal visible={editVisible} transparent animationType="slide" onRequestClose={() => setEditVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={s.modalOverlay}>
          <TouchableOpacity style={s.modalBackdrop} activeOpacity={1} onPress={() => setEditVisible(false)} />
          <View style={s.modalSheet}>
            <View style={s.modalHandle} />
            <Text style={s.modalTitle}>Modifier le profil</Text>

            <Text style={s.inputLabel}>Nom complet</Text>
            <TextInput
              style={s.input}
              value={draft.name}
              onChangeText={(v) => setDraft({ ...draft, name: v })}
              placeholderTextColor={C.muted}
              placeholder="Votre nom"
            />

            <Text style={s.inputLabel}>Pseudo</Text>
            <TextInput
              style={s.input}
              value={draft.handle}
              onChangeText={(v) => setDraft({ ...draft, handle: v })}
              placeholderTextColor={C.muted}
              placeholder="@pseudo"
              autoCapitalize="none"
            />

            <Text style={s.inputLabel}>Ville</Text>
            <TextInput
              style={s.input}
              value={draft.location}
              onChangeText={(v) => setDraft({ ...draft, location: v })}
              placeholderTextColor={C.muted}
              placeholder="Paris"
            />

            <Text style={s.inputLabel}>Padel depuis (année)</Text>
            <TextInput
              style={s.input}
              value={draft.since}
              onChangeText={(v) => setDraft({ ...draft, since: v })}
              placeholderTextColor={C.muted}
              placeholder="2019"
              keyboardType="number-pad"
            />

            <Text style={s.inputLabel}>Niveau</Text>
            <TextInput
              style={s.input}
              value={draft.level}
              onChangeText={(v) => setDraft({ ...draft, level: v })}
              placeholderTextColor={C.muted}
              placeholder="7"
              keyboardType="number-pad"
            />

            <TouchableOpacity style={s.saveBtn} onPress={saveEdit} activeOpacity={0.85}>
              <Text style={s.saveBtnText}>Enregistrer</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },

  // Cover
  cover: { height: 80, backgroundColor: '#0D2254', overflow: 'hidden', position: 'relative' },
  coverGrid: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'transparent',
  },
  coverGlow: { position: 'absolute', top: -30, right: -30, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(74,143,232,0.18)' },
  coverCourt: { position: 'absolute', bottom: 16, right: 24, width: 90, height: 58, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 3, opacity: 0.4 },

  // Avatar
  avatarSection: { paddingHorizontal: 24, marginTop: -28 },
  avatarRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 },
  avatarWrap: { position: 'relative' },
  avatar: { width: 72, height: 72, borderRadius: 22, backgroundColor: '#1A5FBF', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: C.bg },
  avatarInitials: { fontWeight: '800', fontSize: 26, color: '#fff' },
  avatarLevel: { position: 'absolute', bottom: -5, right: -5, backgroundColor: C.gold, borderRadius: 8, paddingVertical: 2, paddingHorizontal: 6, borderWidth: 2, borderColor: C.bg },
  avatarLevelText: { fontSize: 9, fontWeight: '800', color: C.bg },
  avatarBtns: { flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 8 },
  btnEdit: { backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 16 },
  btnEditText: { fontWeight: '700', fontSize: 13, color: C.text },
  btnShare: { width: 38, height: 38, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  profileName: { fontWeight: '800', fontSize: 20, color: C.text, letterSpacing: -0.4, marginBottom: 4 },
  profileHandle: { fontSize: 12, color: C.muted, marginBottom: 20 },
  statsStrip: { flexDirection: 'row', backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border, borderRadius: 16, padding: 20, marginBottom: 0 },
  statItem: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, backgroundColor: C.border },
  statNum: { fontWeight: '800', fontSize: 20, color: C.accent },
  statLbl: { fontSize: 11, color: C.muted, marginTop: 2 },

  // Chart
  chartCard: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 18, marginHorizontal: 24, marginTop: 20, marginBottom: 0, padding: 18 },
  chartTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  chartTitle: { fontSize: 12, color: C.muted, marginBottom: 4 },
  chartValRow: { flexDirection: 'row', alignItems: 'baseline' },
  chartVal: { fontWeight: '800', fontSize: 28, color: C.text, letterSpacing: -1 },
  chartDelta: { fontSize: 12, fontWeight: '700', color: C.green },
  chartSub: { fontSize: 11, color: C.muted, marginTop: 2 },
  periodBtn: { backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border, borderRadius: 10, paddingVertical: 6, paddingHorizontal: 12 },
  periodBtnText: { fontSize: 12, fontWeight: '700', color: C.muted },

  // Section header
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 32, paddingBottom: 14 },
  sectionTitle: { fontWeight: '700', fontSize: 17, color: C.text, letterSpacing: -0.3 },
  sectionLink: { fontSize: 12, color: C.accent, fontWeight: '800' },

  // Match history
  matchCard: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 18, marginHorizontal: 24, overflow: 'hidden' },
  matchRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, paddingHorizontal: 18 },
  matchRowBorder: { borderBottomWidth: 1, borderBottomColor: C.border },
  resultDot: { width: 28, height: 28, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  dotWin: { backgroundColor: 'rgba(74,222,128,0.12)', borderWidth: 1, borderColor: 'rgba(74,222,128,0.25)' },
  dotWinText: { color: C.green },
  dotLose: { backgroundColor: 'rgba(239,68,68,0.1)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.22)' },
  dotLoseText: { color: '#f87171' },
  resultDotText: { fontWeight: '800', fontSize: 11 },
  matchVs: { fontWeight: '700', fontSize: 13, color: C.text, marginBottom: 2 },
  matchMeta: { fontSize: 10, color: C.muted },
  matchScore: { fontWeight: '800', fontSize: 15, color: C.text },
  matchPts: { fontSize: 11, color: C.accent, fontWeight: '700', textAlign: 'right' },
  matchPtsNeg: { color: '#f87171' },

  // Friends
  friendsRow: { flexDirection: 'row', gap: 18, paddingHorizontal: 24, paddingBottom: 8 },
  friendCard: { alignItems: 'center', gap: 8 },
  friendAvatar: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  friendInitials: { fontWeight: '700', fontSize: 16, color: '#fff' },
  friendOnline: { position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, backgroundColor: C.green, borderRadius: 5, borderWidth: 2, borderColor: C.bg },
  friendName: { fontSize: 11, fontWeight: '600', color: C.muted, textAlign: 'center' },
  friendAdd: { width: 56, height: 56, borderRadius: 16, backgroundColor: C.surface2, borderWidth: 1.5, borderColor: C.border, alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed' },
  friendAddText: { fontSize: 22, color: C.muted },

  // Bookings
  bookingCount: {
    backgroundColor: C.accent, borderRadius: 10,
    minWidth: 20, height: 20, paddingHorizontal: 6,
    alignItems: 'center', justifyContent: 'center',
  },
  bookingCountText: { fontSize: 10, fontWeight: '800', color: '#fff' },
  emptyBookings: {
    alignItems: 'center', gap: 8,
    paddingVertical: 28, marginHorizontal: 24,
    backgroundColor: C.card, borderWidth: 1, borderColor: C.border,
    borderRadius: 18,
  },
  emptyBookingsText: { fontWeight: '700', fontSize: 14, color: C.text },
  emptyBookingsSub: { fontSize: 12, color: C.muted },
  bookingsList: { marginHorizontal: 24, gap: 10 },
  bookingRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#0E1628', borderWidth: 1,
    borderColor: 'rgba(74,143,232,0.25)', borderRadius: 16,
    padding: 14, overflow: 'hidden',
  },
  bookingRowGlow: {
    position: 'absolute', top: -20, right: -20,
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(74,143,232,0.08)',
  },
  bookingRowIconWrap: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  bookingRowInfo: { flex: 1 },
  bookingRowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  bookingRowName: { fontWeight: '800', fontSize: 13, color: C.text },
  bookingRowPrice: { fontWeight: '800', fontSize: 14, color: C.accent },
  bookingRowClub: { fontSize: 11, color: C.muted, marginBottom: 5 },
  bookingRowMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  bookingRowMetaText: { fontSize: 10, color: C.muted, fontWeight: '600' },
  bookingStatusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(74,222,128,0.1)', borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.2)', borderRadius: 8,
    paddingVertical: 4, paddingHorizontal: 8,
  },
  bookingStatusDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: C.green },
  bookingStatusText: { fontSize: 10, fontWeight: '700', color: C.green },

  // Settings
  settingsList: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 18, marginHorizontal: 24, overflow: 'hidden' },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, paddingHorizontal: 18 },
  settingRowBorder: { borderBottomWidth: 1, borderBottomColor: C.border },
  settingIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  settingLabel: { flex: 1, fontWeight: '700', fontSize: 13, color: C.text },
  settingValue: { fontSize: 12, color: C.muted },
  settingArrow: { fontSize: 18, color: C.muted },

  // Edit modal
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)' },
  modalSheet: {
    backgroundColor: '#111118', borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingHorizontal: 24, paddingBottom: 40, paddingTop: 16,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
  },
  modalHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.15)', alignSelf: 'center', marginBottom: 20,
  },
  modalTitle: { fontWeight: '800', fontSize: 18, color: '#F0F0F5', marginBottom: 20, letterSpacing: -0.3 },
  inputLabel: { fontSize: 11, fontWeight: '700', color: '#6B6B7E', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    backgroundColor: '#18181F', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
    borderRadius: 12, paddingVertical: 13, paddingHorizontal: 16,
    color: '#F0F0F5', fontSize: 14, marginBottom: 14,
  },
  saveBtn: {
    backgroundColor: '#4A8FE8', borderRadius: 16,
    paddingVertical: 16, alignItems: 'center', marginTop: 6,
  },
  saveBtnText: { fontWeight: '800', fontSize: 15, color: '#fff' },

  // Toggle switch
  toggle: { width: 44, height: 26, borderRadius: 13, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border, justifyContent: 'center', paddingHorizontal: 3 },
  toggleOn: { backgroundColor: C.accent, borderColor: C.accent },
  toggleThumb: { width: 20, height: 20, borderRadius: 10, backgroundColor: C.muted },
  toggleThumbOn: { backgroundColor: '#fff', alignSelf: 'flex-end' },

  // Level picker
  levelPill: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 12, borderWidth: 1, borderColor: C.border, backgroundColor: C.card },
  levelPillActive: { backgroundColor: C.accent, borderColor: C.accent },
  levelPillText: { fontSize: 13, fontWeight: '700', color: C.muted },
  levelPillTextActive: { color: '#fff' },

  // Payment card
  payCard: { backgroundColor: '#0D2254', borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(74,143,232,0.3)' },
  payCardChip: { width: 32, height: 24, borderRadius: 6, backgroundColor: C.gold, marginBottom: 16, opacity: 0.85 },
  payCardNum: { fontWeight: '800', fontSize: 18, color: '#fff', letterSpacing: 2 },
  payCardLabel: { fontSize: 9, color: 'rgba(255,255,255,0.5)', fontWeight: '700', letterSpacing: 1, marginBottom: 3 },
  payCardVal: { fontSize: 12, color: '#fff', fontWeight: '700' },
  payCardBrand: { alignSelf: 'flex-end', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 6, paddingVertical: 4, paddingHorizontal: 10 },
  payAddBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 14, borderWidth: 1, borderColor: 'rgba(74,143,232,0.3)', borderRadius: 14, justifyContent: 'center', marginBottom: 12, borderStyle: 'dashed' },
  payAddText: { fontSize: 13, fontWeight: '700', color: C.accent },
});

// ─── Styles profil ami ────────────────────────────────────────────────────────
const fp = StyleSheet.create({
  backBtn: { width: 38, height: 38, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontWeight: '800', fontSize: 17, color: C.text, letterSpacing: -0.3 },
  cover: { height: 80, overflow: 'hidden', position: 'relative' },
  coverGlow: { position: 'absolute', top: -30, right: -30, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(74,143,232,0.18)' },
  coverCourt: { position: 'absolute', bottom: 16, right: 24, width: 90, height: 58, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 3, opacity: 0.4 },
  avatarSection: { paddingHorizontal: 24, marginTop: -28 },
  avatarRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 },
  avatarWrap: { position: 'relative' },
  avatar: { width: 72, height: 72, borderRadius: 22, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: C.bg },
  avatarInitials: { fontWeight: '800', fontSize: 26, color: '#fff' },
  avatarLevel: { position: 'absolute', bottom: -5, right: -5, backgroundColor: C.gold, borderRadius: 8, paddingVertical: 2, paddingHorizontal: 6, borderWidth: 2, borderColor: C.bg },
  avatarLevelText: { fontSize: 9, fontWeight: '800', color: C.bg },
  onlineBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderRadius: 10, paddingVertical: 7, paddingHorizontal: 12, marginBottom: 8 },
  onlineDot: { width: 6, height: 6, borderRadius: 3 },
  onlineText: { fontSize: 12, fontWeight: '700' },
  name: { fontWeight: '800', fontSize: 20, color: C.text, letterSpacing: -0.4, marginBottom: 4 },
  handle: { fontSize: 12, color: C.muted, marginBottom: 20 },
  statsStrip: { flexDirection: 'row', backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border, borderRadius: 16, padding: 20, marginBottom: 0 },
  statItem: { flex: 1, alignItems: 'center' },
  statDiv: { width: 1, backgroundColor: C.border },
  statNum: { fontWeight: '800', fontSize: 20, color: C.accent },
  statLbl: { fontSize: 11, color: C.muted, marginTop: 2 },
  chartCard: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 18, marginHorizontal: 24, marginTop: 20, padding: 18 },
  chartTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  chartTitle: { fontSize: 12, color: C.muted, marginBottom: 4 },
  chartVal: { fontWeight: '800', fontSize: 28, color: C.text, letterSpacing: -1 },
  chartDelta: { fontSize: 12, fontWeight: '700' },
  chartSub: { fontSize: 11, color: C.muted, marginTop: 2 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 32, paddingBottom: 14 },
  sectionTitle: { fontWeight: '700', fontSize: 17, color: C.text, letterSpacing: -0.3 },
  matchCard: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 18, marginHorizontal: 24, overflow: 'hidden' },
  matchRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, paddingHorizontal: 18 },
  matchRowBorder: { borderBottomWidth: 1, borderBottomColor: C.border },
  resultDot: { width: 28, height: 28, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  dotWin: { backgroundColor: 'rgba(74,222,128,0.12)', borderWidth: 1, borderColor: 'rgba(74,222,128,0.25)' },
  dotLose: { backgroundColor: 'rgba(239,68,68,0.1)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.22)' },
  resultDotText: { fontWeight: '800', fontSize: 11 },
  matchVs: { fontWeight: '700', fontSize: 13, color: C.text, marginBottom: 2 },
  matchMeta: { fontSize: 10, color: C.muted },
  matchScore: { fontWeight: '800', fontSize: 15, color: C.text },
  matchPts: { fontSize: 11, fontWeight: '700', textAlign: 'right' },
});

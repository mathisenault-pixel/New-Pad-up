import React, { useRef, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar, Modal,
  Alert, TextInput,
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

const C = {
  bg: '#0A0A0F', surface2: '#18181F', border: 'rgba(255,255,255,0.07)',
  accent: '#4A8FE8', text: '#F0F0F5',
  muted: '#6B6B7E', card: '#13131A', green: '#4ade80', gold: '#F5A623',
  red: '#f87171',
};

// ─── Données ───────────────────────────────────────────────────────────────────

const MAIN_TABS = ['Découvrir', 'Mes inscriptions', 'Résultats'];
const LEVEL_FILTERS = ['Tous', 'P25', 'P50', 'P100', 'P250', 'P500', 'P1000', 'P1500', 'P2000'];

const FRANCE_REGION: Region = { latitude: 46.2276, longitude: 2.2137, latitudeDelta: 12, longitudeDelta: 12 };
const PARIS_REGION: Region  = { latitude: 48.856,  longitude: 2.376,  latitudeDelta: 0.18, longitudeDelta: 0.18 };

type Tournament = {
  id: string; name: string; gradient: string;
  status: 'open' | 'soon' | 'full'; statusLabel: string;
  level: string; buyin: string; date: string; location: string;
  filled: number; total: number; pct: number;
  coords: { latitude: number; longitude: number };
  category: string; format: string;
};

const TOURNAMENTS: Tournament[] = [
  {
    id: '1', name: 'Tournoi Mixte Nation', gradient: '#0D1A30',
    status: 'open', statusLabel: '● Ouvert',
    level: 'P100', buyin: '€30',
    date: '📅 Mar 22 · 10h00', location: '📍 Club Nation',
    filled: 18, total: 24, pct: 75,
    coords: { latitude: 48.8452, longitude: 2.3786 },
    category: 'Mixte', format: 'Tableau simple',
  },
  {
    id: '2', name: 'Elite Cup · Paris', gradient: '#1A0A2E',
    status: 'soon', statusLabel: '⚡ 2 places',
    level: 'P500', buyin: '€80',
    date: '📅 Mar 29 · 9h00', location: '📍 Padel Bastille',
    filled: 30, total: 32, pct: 94,
    coords: { latitude: 48.8533, longitude: 2.3692 },
    category: 'Hommes', format: 'Double élimination',
  },
  {
    id: '3', name: 'Tournoi Débutants', gradient: '#0A1F2E',
    status: 'open', statusLabel: '● Ouvert',
    level: 'P25', buyin: 'Gratuit',
    date: '📅 Avr 5 · 13h00', location: '📍 ZE Padel Club',
    filled: 8, total: 16, pct: 50,
    coords: { latitude: 48.8631, longitude: 2.3944 },
    category: 'Mixte', format: 'Round Robin',
  },
  {
    id: '4', name: 'Spring Series · Cocoon', gradient: '#0A1E35',
    status: 'full', statusLabel: '✗ Complet',
    level: 'P250', buyin: '€60',
    date: '📅 Avr 12 · 9h00', location: '📍 Cocoon Padel',
    filled: 32, total: 32, pct: 100,
    coords: { latitude: 48.8590, longitude: 2.3764 },
    category: 'Hommes', format: 'Tableau simple',
  },
];

type Registration = {
  tournamentId: string;
  partner: string;
  partnerInitials: string;
  partnerBg: string;
  dossard: string;
  registeredAt: string;
};

// Résultats passés
const PAST_RESULTS = [
  {
    id: 'r1',
    tournament: 'Winter Cup · QG Padel',
    date: 'Mar 8 · 2026',
    level: 'P250',
    gradient: '#0D1A30',
    position: '🥈 2ème',
    positionColor: '#C0C0C0',
    matches: [
      { round: 'Quart de finale', vs: 'Dupont / Martin',    score: '6·3 6·2', win: true },
      { round: 'Demi-finale',     vs: 'Lemaire / Bernard',  score: '7·5 6·4', win: true },
      { round: 'Finale',          vs: 'Girard / Moreau',    score: '4·6 3·6', win: false },
    ],
    ptsGained: '+180 pts',
    rankBefore: 2610,
    rankAfter: 2430,
  },
  {
    id: 'r2',
    tournament: 'Tournoi Amical Cocoon',
    date: 'Fév 22 · 2026',
    level: 'P100',
    gradient: '#0A1E35',
    position: '🥇 1er',
    positionColor: C.gold,
    matches: [
      { round: 'Poule A',  vs: 'Blanc / Noir',    score: '6·1 6·0', win: true },
      { round: 'Poule A',  vs: 'Rouge / Vert',    score: '6·2 6·3', win: true },
      { round: 'Finale',   vs: 'Petit / Grand',   score: '6·4 7·5', win: true },
    ],
    ptsGained: '+120 pts',
    rankBefore: 2730,
    rankAfter: 2610,
  },
  {
    id: 'r3',
    tournament: 'Open Hiver · Nation',
    date: 'Jan 18 · 2026',
    level: 'P500',
    gradient: '#1A0A2E',
    position: '🏅 5ème',
    positionColor: C.accent,
    matches: [
      { round: 'Poule B', vs: 'Faure / Petit',    score: '6·4 6·3', win: true },
      { round: 'Poule B', vs: 'Aubert / Simon',   score: '3·6 4·6', win: false },
      { round: '1/8',     vs: 'Meyer / Leclerc',  score: '4·6 5·7', win: false },
    ],
    ptsGained: '+60 pts',
    rankBefore: 2790,
    rankAfter: 2730,
  },
];

// ─── Composants ────────────────────────────────────────────────────────────────

function TournamentCard({
  t, registered, onRegister, onUnregister,
}: {
  t: Tournament; registered: boolean;
  onRegister: () => void; onUnregister: () => void;
}) {
  const isFull = t.status === 'full';
  const isAlmost = t.pct >= 90;
  return (
    <View style={s.tCard}>
      <View style={[s.tCardImg, { backgroundColor: t.gradient }]}>
        <View style={s.tCourt} />
        <View style={s.tCardBadges}>
          <View style={[s.tBadge, t.status === 'open' && s.tbOpen, t.status === 'soon' && s.tbSoon, t.status === 'full' && s.tbFull]}>
            <Text style={[s.tBadgeText, t.status === 'open' && { color: C.green }, t.status === 'soon' && { color: C.gold }, t.status === 'full' && { color: C.red }]}>
              {t.statusLabel}
            </Text>
          </View>
          <View style={s.tBadgeLevel}><Text style={s.tBadgeLevelText}>{t.level}</Text></View>
        </View>
        <View style={s.tBuyinBadge}><Text style={s.tBuyinBadgeText}>{t.buyin}</Text></View>
        {registered && (
          <View style={s.tRegisteredBadge}>
            <Ionicons name="checkmark-circle" size={12} color={C.green} />
            <Text style={s.tRegisteredText}>Inscrit</Text>
          </View>
        )}
      </View>

      <View style={s.tCardBody}>
        <Text style={s.tName}>{t.name}</Text>
        <View style={s.tMeta}>
          <Text style={s.tMetaText}>{t.date}</Text>
          <Text style={s.tMetaText}>{t.location}</Text>
        </View>
        <View style={s.tProgressRow}>
          <View style={s.tProgressBar}>
            <View style={[s.tProgressFill, isAlmost && s.tProgressFillAlmost, { width: `${t.pct}%` as any }]} />
          </View>
          <Text style={s.tProgressText}>{t.filled}/{t.total}</Text>
        </View>
        <View style={s.tCardFooter}>
          {registered ? (
            <TouchableOpacity style={s.btnInsrit} onPress={onUnregister} activeOpacity={0.8}>
              <Ionicons name="checkmark" size={13} color={C.green} />
              <Text style={s.btnInsritText}>Inscrit · Se désinscrire</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={isFull ? s.btnComplet : s.btnInscrire}
              activeOpacity={isFull ? 1 : 0.8}
              disabled={isFull}
              onPress={onRegister}
            >
              <Text style={isFull ? s.btnCompletText : s.btnInscrireText}>
                {isFull ? 'Complet' : "S'inscrire"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

// ─── Onglet Mes inscriptions ───────────────────────────────────────────────────

function MesInscriptions({
  registrations, tournaments, onUnregister,
}: {
  registrations: Registration[];
  tournaments: Tournament[];
  onUnregister: (id: string) => void;
}) {
  if (registrations.length === 0) {
    return (
      <View style={r.empty}>
        <View style={r.emptyIcon}>
          <Ionicons name="clipboard-outline" size={32} color={C.muted} />
        </View>
        <Text style={r.emptyTitle}>Aucune inscription</Text>
        <Text style={r.emptySub}>Inscrivez-vous à un tournoi depuis l'onglet Découvrir</Text>
      </View>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={r.sectionHeader}>
        <Text style={r.sectionTitle}>À venir</Text>
        <View style={r.countBadge}><Text style={r.countBadgeText}>{registrations.length}</Text></View>
      </View>

      {registrations.map((reg) => {
        const t = tournaments.find((x) => x.id === reg.tournamentId)!;
        if (!t) return null;
        return (
          <View key={reg.tournamentId} style={r.card}>
            <View style={[r.cardTop, { backgroundColor: t.gradient }]}>
              <View style={r.cardCourt} />
              <View style={r.cardBadgeRow}>
                <View style={r.levelBadge}><Text style={r.levelBadgeText}>{t.level}</Text></View>
                <View style={r.confirmedBadge}>
                  <Ionicons name="checkmark-circle" size={11} color={C.green} />
                  <Text style={r.confirmedText}>Confirmé</Text>
                </View>
              </View>
              <Text style={r.cardTitle}>{t.name}</Text>
            </View>

            <View style={r.cardBody}>
              {/* Infos */}
              <View style={r.infoRow}>
                <View style={r.infoItem}>
                  <Ionicons name="calendar-outline" size={13} color={C.accent} />
                  <Text style={r.infoText}>{t.date.replace('📅 ', '')}</Text>
                </View>
                <View style={r.infoItem}>
                  <Ionicons name="location-outline" size={13} color={C.accent} />
                  <Text style={r.infoText}>{t.location.replace('📍 ', '')}</Text>
                </View>
              </View>
              <View style={r.infoRow}>
                <View style={r.infoItem}>
                  <Ionicons name="trophy-outline" size={13} color={C.accent} />
                  <Text style={r.infoText}>{t.format}</Text>
                </View>
                <View style={r.infoItem}>
                  <Ionicons name="pricetag-outline" size={13} color={C.accent} />
                  <Text style={r.infoText}>{t.buyin}</Text>
                </View>
              </View>

              <View style={r.divider} />

              {/* Partenaire */}
              <View style={r.partnerRow}>
                <View style={[r.partnerAvatar, { backgroundColor: reg.partnerBg }]}>
                  <Text style={r.partnerInitials}>{reg.partnerInitials}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={r.partnerLabel}>Partenaire</Text>
                  <Text style={r.partnerName}>{reg.partner}</Text>
                </View>
                <View style={r.dossardWrap}>
                  <Text style={r.dossardLabel}>Dossard</Text>
                  <Text style={r.dossardNum}>#{reg.dossard}</Text>
                </View>
              </View>

              <View style={r.divider} />

              {/* Footer */}
              <View style={r.cardFooter}>
                <Text style={r.registeredAt}>Inscrit le {reg.registeredAt}</Text>
                <TouchableOpacity
                  onPress={() => Alert.alert('Se désinscrire', `Annuler l'inscription à ${t.name} ?`, [
                    { text: 'Annuler', style: 'cancel' },
                    { text: 'Se désinscrire', style: 'destructive', onPress: () => onUnregister(t.id) },
                  ])}
                  activeOpacity={0.7}
                >
                  <Text style={r.unregisterBtn}>Se désinscrire</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

// ─── Onglet Résultats ──────────────────────────────────────────────────────────

function Resultats() {
  const [openResult, setOpenResult] = useState<string | null>(null);

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Résumé stats */}
      <View style={rs.statsCard}>
        <View style={rs.statItem}>
          <Text style={rs.statNum}>3</Text>
          <Text style={rs.statLabel}>Tournois</Text>
        </View>
        <View style={rs.statDiv} />
        <View style={rs.statItem}>
          <Text style={[rs.statNum, { color: C.green }]}>7</Text>
          <Text style={rs.statLabel}>Victoires</Text>
        </View>
        <View style={rs.statDiv} />
        <View style={rs.statItem}>
          <Text style={[rs.statNum, { color: C.red }]}>3</Text>
          <Text style={rs.statLabel}>Défaites</Text>
        </View>
        <View style={rs.statDiv} />
        <View style={rs.statItem}>
          <Text style={[rs.statNum, { color: C.gold }]}>+360</Text>
          <Text style={rs.statLabel}>Pts gagnés</Text>
        </View>
      </View>

      <View style={rs.sectionHeader}>
        <Text style={rs.sectionTitle}>Historique</Text>
      </View>

      {PAST_RESULTS.map((res) => {
        const isOpen = openResult === res.id;
        return (
          <View key={res.id} style={rs.card}>
            {/* Header cliquable */}
            <TouchableOpacity
              style={[rs.cardHeader, { backgroundColor: res.gradient }]}
              onPress={() => setOpenResult(isOpen ? null : res.id)}
              activeOpacity={0.85}
            >
              <View style={rs.cardCourt} />
              <View style={{ flex: 1 }}>
                <View style={rs.cardBadgeRow}>
                  <View style={rs.levelBadge}><Text style={rs.levelBadgeText}>{res.level}</Text></View>
                  <Text style={[rs.position, { color: res.positionColor }]}>{res.position}</Text>
                </View>
                <Text style={rs.cardName}>{res.tournament}</Text>
                <Text style={rs.cardDate}>{res.date}</Text>
              </View>
              <View style={rs.ptsWrap}>
                <Text style={rs.ptsText}>{res.ptsGained}</Text>
                <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={14} color={C.muted} style={{ marginTop: 4 }} />
              </View>
            </TouchableOpacity>

            {/* Détail matches */}
            {isOpen && (
              <View style={rs.matchesWrap}>
                <View style={rs.rankRow}>
                  <Text style={rs.rankLabel}>Classement avant</Text>
                  <Text style={rs.rankVal}>{res.rankBefore} pts</Text>
                  <Ionicons name="arrow-forward" size={12} color={C.muted} />
                  <Text style={[rs.rankVal, { color: C.green }]}>{res.rankAfter} pts</Text>
                </View>
                {res.matches.map((m, i) => (
                  <View key={i} style={[rs.matchRow, i < res.matches.length - 1 && rs.matchRowBorder]}>
                    <View style={[rs.resultDot, m.win ? rs.dotWin : rs.dotLose]}>
                      <Text style={[rs.resultDotText, m.win ? { color: C.green } : { color: C.red }]}>
                        {m.win ? 'V' : 'D'}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={rs.matchRound}>{m.round}</Text>
                      <Text style={rs.matchVs}>vs {m.vs}</Text>
                    </View>
                    <Text style={[rs.matchScore, m.win ? { color: C.green } : { color: C.red }]}>{m.score}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}

// ─── Screen principal ──────────────────────────────────────────────────────────

export default function TournoisScreen() {
  const [activeTab, setActiveTab] = useState('Découvrir');
  const [activeFilter, setActiveFilter] = useState('Tous');
  const [selectedTournoi, setSelectedTournoi] = useState<string | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterCategory, setFilterCategory] = useState<'Tous' | 'Mixte' | 'Hommes'>('Tous');
  const [filterStatus, setFilterStatus] = useState<'Tous' | 'open' | 'soon' | 'full'>('Tous');
  const mapRef = useRef<MapView>(null);

  function register(t: Tournament) {
    if (registrations.find((r) => r.tournamentId === t.id)) return;
    const today = new Date();
    const partners = [
      { name: 'Julien L.', initials: 'JL', bg: '#1A3A6B' },
      { name: 'Alice L.', initials: 'AL', bg: '#2D5FC4' },
      { name: 'Raphaël C.', initials: 'RC', bg: '#1A3F8F' },
    ];
    const partner = partners[Math.floor(Math.random() * partners.length)];
    const dossard = String(Math.floor(10 + Math.random() * 90));
    const dateStr = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
    setRegistrations((prev) => [...prev, {
      tournamentId: t.id,
      partner: partner.name,
      partnerInitials: partner.initials,
      partnerBg: partner.bg,
      dossard,
      registeredAt: dateStr,
    }]);
    Alert.alert('Inscription confirmée ! 🎉', `Vous êtes inscrit à ${t.name}.\nPartenaire : ${partner.name}\nDossard : #${dossard}`, [
      { text: 'Voir mes inscriptions', onPress: () => setActiveTab('Mes inscriptions') },
      { text: 'OK' },
    ]);
  }

  function unregister(tournamentId: string) {
    setRegistrations((prev) => prev.filter((r) => r.tournamentId !== tournamentId));
  }

  const isRegistered = (id: string) => registrations.some((r) => r.tournamentId === id);

  const hasActiveFilters = filterCategory !== 'Tous' || filterStatus !== 'Tous';

  const filteredTournaments = TOURNAMENTS.filter((t) => {
    if (activeFilter !== 'Tous' && t.level !== activeFilter) return false;
    if (filterCategory !== 'Tous' && t.category !== filterCategory) return false;
    if (filterStatus !== 'Tous' && t.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!t.name.toLowerCase().includes(q) && !t.location.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      {/* Header */}
      <View style={s.header}>
        <Text style={s.pageTitle}>Tournois</Text>
        <View style={s.headerRight}>
          <TouchableOpacity style={[s.iconBtn, showSearch && s.iconBtnActive]} onPress={() => { setShowSearch((v) => !v); setSearchQuery(''); }}>
            <Ionicons name="search-outline" size={17} color={showSearch ? C.accent : C.text} />
          </TouchableOpacity>
          <TouchableOpacity style={[s.iconBtn, hasActiveFilters && s.iconBtnActive]} onPress={() => setShowFilters(true)}>
            <Ionicons name="options-outline" size={17} color={hasActiveFilters ? C.accent : C.text} />
            {hasActiveFilters && <View style={s.iconBadge} />}
          </TouchableOpacity>
        </View>
      </View>

      {/* Barre de recherche */}
      {showSearch && (
        <View style={s.searchBar}>
          <Ionicons name="search-outline" size={15} color={C.muted} style={{ marginLeft: 14 }} />
          <TextInput
            style={s.searchInput}
            placeholder="Nom du tournoi, lieu..."
            placeholderTextColor={C.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={{ paddingHorizontal: 14 }}>
              <Ionicons name="close-circle" size={16} color={C.muted} />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Modal Filtres */}
      <Modal visible={showFilters} transparent animationType="slide" onRequestClose={() => setShowFilters(false)}>
        <TouchableOpacity style={s.modalOverlay} activeOpacity={1} onPress={() => setShowFilters(false)} />
        <View style={s.modalSheet}>
          <View style={s.modalHandle} />
          <View style={s.modalHeader}>
            <Text style={s.modalTitle}>Filtres</Text>
            <TouchableOpacity onPress={() => { setFilterCategory('Tous'); setFilterStatus('Tous'); }}>
              <Text style={s.modalReset}>Réinitialiser</Text>
            </TouchableOpacity>
          </View>

          <Text style={s.modalSection}>Catégorie</Text>
          <View style={s.modalOptions}>
            {(['Tous', 'Mixte', 'Hommes'] as const).map((opt) => (
              <TouchableOpacity key={opt} style={[s.modalPill, filterCategory === opt && s.modalPillActive]} onPress={() => setFilterCategory(opt)} activeOpacity={0.7}>
                <Text style={[s.modalPillText, filterCategory === opt && s.modalPillTextActive]}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={s.modalSection}>Statut</Text>
          <View style={s.modalOptions}>
            {([
              { value: 'Tous', label: 'Tous' },
              { value: 'open', label: '● Ouvert' },
              { value: 'soon', label: '⚡ Bientôt complet' },
              { value: 'full', label: '✗ Complet' },
            ] as const).map(({ value, label }) => (
              <TouchableOpacity key={value} style={[s.modalPill, filterStatus === value && s.modalPillActive]} onPress={() => setFilterStatus(value)} activeOpacity={0.7}>
                <Text style={[s.modalPillText, filterStatus === value && s.modalPillTextActive]}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={s.modalApply} onPress={() => setShowFilters(false)} activeOpacity={0.85}>
            <Text style={s.modalApplyText}>Appliquer</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Main tabs */}
      <View style={s.mainTabsWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.mainTabsRow} style={s.mainTabsScroll}>
          {MAIN_TABS.map((tab) => {
            const count = tab === 'Mes inscriptions' ? registrations.length : 0;
            return (
              <TouchableOpacity key={tab} style={s.mainTab} onPress={() => setActiveTab(tab)} activeOpacity={0.7}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={[s.mainTabText, activeTab === tab && s.mainTabTextActive]}>{tab}</Text>
                  {count > 0 && (
                    <View style={s.tabBadge}><Text style={s.tabBadgeText}>{count}</Text></View>
                  )}
                </View>
                {activeTab === tab && <View style={s.mainTabLine} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <View style={s.mainTabBorder} />
      </View>

      {/* Contenu selon l'onglet */}
      {activeTab === 'Découvrir' && (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Carte */}
          <View style={s.mapBox}>
            <MapView ref={mapRef} style={StyleSheet.absoluteFillObject} initialRegion={FRANCE_REGION} showsUserLocation showsCompass={false}>
              {TOURNAMENTS.map((t) => (
                <Marker key={t.id} coordinate={t.coords} title={t.name}
                  description={t.location.replace('📍 ', '')}
                  pinColor={selectedTournoi === t.id ? '#ffffff' : t.status === 'full' ? C.red : t.status === 'soon' ? C.gold : C.green}
                  onPress={() => setSelectedTournoi(t.id)}
                />
              ))}
            </MapView>
            <View style={s.mapControls}>
              <TouchableOpacity style={s.mapCtrl} onPress={() => mapRef.current?.animateToRegion(FRANCE_REGION, 600)}>
                <Text style={s.mapCtrlText}>🇫🇷</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.mapCtrl} onPress={() => mapRef.current?.animateToRegion(PARIS_REGION, 600)}>
                <Ionicons name="locate" size={14} color={C.text} />
              </TouchableOpacity>
            </View>
            <View style={s.mapCount}><Text style={s.mapCountText}>8 tournois dans la zone</Text></View>
          </View>

          {/* Filtres niveau */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filtersRow}>
            {LEVEL_FILTERS.map((f) => (
              <TouchableOpacity key={f} style={[s.pill, activeFilter === f && s.pillActive]} onPress={() => setActiveFilter(f)} activeOpacity={0.7}>
                <Text style={[s.pillText, activeFilter === f && s.pillTextActive]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>À venir</Text>
            <TouchableOpacity><Text style={s.sectionLink}>Voir tout →</Text></TouchableOpacity>
          </View>

          {filteredTournaments.length === 0 ? (
            <View style={{ alignItems: 'center', paddingTop: 40, paddingBottom: 20 }}>
              <Text style={{ color: C.muted, fontSize: 14, fontWeight: '600' }}>Aucun tournoi {activeFilter} disponible</Text>
            </View>
          ) : filteredTournaments.map((t) => (
            <TournamentCard
              key={t.id} t={t}
              registered={isRegistered(t.id)}
              onRegister={() => register(t)}
              onUnregister={() => Alert.alert('Se désinscrire', `Annuler l'inscription à ${t.name} ?`, [
                { text: 'Annuler', style: 'cancel' },
                { text: 'Se désinscrire', style: 'destructive', onPress: () => unregister(t.id) },
              ])}
            />
          ))}
          <View style={{ height: 20 }} />
        </ScrollView>
      )}

      {activeTab === 'Mes inscriptions' && (
        <MesInscriptions registrations={registrations} tournaments={TOURNAMENTS} onUnregister={unregister} />
      )}

      {activeTab === 'Résultats' && <Resultats />}
    </SafeAreaView>
  );
}

// ─── Styles principaux ─────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 20, paddingBottom: 14 },
  pageTitle: { fontWeight: '800', fontSize: 24, color: C.text, letterSpacing: -0.5 },
  headerRight: { flexDirection: 'row', gap: 8 },
  iconBtn: { width: 38, height: 38, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  mainTabsWrap: {},
  mainTabsScroll: { flexShrink: 0 },
  mainTabsRow: { flexDirection: 'row', paddingHorizontal: 16, alignItems: 'stretch' },
  mainTab: { paddingVertical: 12, paddingHorizontal: 14, position: 'relative', justifyContent: 'center' },
  mainTabText: { fontWeight: '700', fontSize: 14, color: C.muted },
  mainTabTextActive: { color: C.accent },
  mainTabLine: { position: 'absolute', bottom: 0, left: 14, right: 14, height: 2, backgroundColor: C.accent, borderRadius: 2 },
  mainTabBorder: { height: 1, backgroundColor: C.border },
  tabBadge: { backgroundColor: C.accent, borderRadius: 8, minWidth: 16, height: 16, paddingHorizontal: 4, alignItems: 'center', justifyContent: 'center' },
  tabBadgeText: { fontSize: 9, fontWeight: '800', color: '#fff' },
  mapBox: { height: 240, marginHorizontal: 20, marginTop: 16, borderRadius: 16, overflow: 'hidden', position: 'relative', borderWidth: 1, borderColor: C.border },
  mapControls: { position: 'absolute', top: 10, right: 10, gap: 6 },
  mapCtrl: { width: 34, height: 34, backgroundColor: 'rgba(17,17,24,0.92)', borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  mapCtrlText: { fontSize: 14 },
  mapCount: { position: 'absolute', bottom: 10, left: 10, backgroundColor: 'rgba(17,17,24,0.92)', borderRadius: 8, paddingVertical: 4, paddingHorizontal: 10, borderWidth: 1, borderColor: C.border },
  mapCountText: { fontSize: 10, fontWeight: '700', color: C.text },
  filtersRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 },
  pill: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 100, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface2 },
  pillActive: { backgroundColor: C.accent, borderColor: C.accent },
  pillText: { fontSize: 12, fontWeight: '700', color: C.muted },
  pillTextActive: { color: C.bg },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 28, paddingBottom: 14 },
  sectionTitle: { fontWeight: '700', fontSize: 17, color: C.text, letterSpacing: -0.3 },
  sectionLink: { fontSize: 12, color: C.accent, fontWeight: '800' },
  tCard: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 20, marginHorizontal: 20, marginBottom: 16, overflow: 'hidden' },
  tCardImg: { height: 100, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  tCourt: { width: 80, height: 52, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.13)', borderRadius: 2, opacity: 0.5 },
  tCardBadges: { position: 'absolute', top: 10, left: 10, flexDirection: 'row', gap: 6 },
  tBadge: { paddingVertical: 3, paddingHorizontal: 8, borderRadius: 100 },
  tbOpen: { backgroundColor: 'rgba(74,222,128,0.15)', borderWidth: 1, borderColor: 'rgba(74,222,128,0.3)' },
  tbSoon: { backgroundColor: 'rgba(245,166,35,0.15)', borderWidth: 1, borderColor: 'rgba(245,166,35,0.3)' },
  tbFull: { backgroundColor: 'rgba(239,68,68,0.12)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.25)' },
  tBadgeText: { fontSize: 9, fontWeight: '700' },
  tBadgeLevel: { backgroundColor: 'rgba(74,143,232,0.15)', borderWidth: 1, borderColor: 'rgba(74,143,232,0.3)', borderRadius: 100, paddingVertical: 3, paddingHorizontal: 8 },
  tBadgeLevelText: { fontSize: 9, fontWeight: '700', color: C.accent },
  tBuyinBadge: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(10,10,15,0.7)', borderRadius: 8, paddingVertical: 4, paddingHorizontal: 10, borderWidth: 1, borderColor: C.border },
  tBuyinBadgeText: { fontWeight: '800', fontSize: 13, color: C.accent },
  tRegisteredBadge: { position: 'absolute', bottom: 10, right: 10, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(74,222,128,0.15)', borderWidth: 1, borderColor: 'rgba(74,222,128,0.3)', borderRadius: 8, paddingVertical: 3, paddingHorizontal: 8 },
  tRegisteredText: { fontSize: 9, fontWeight: '700', color: C.green },
  tCardBody: { padding: 18 },
  tName: { fontWeight: '800', fontSize: 15, color: C.text, letterSpacing: -0.2, marginBottom: 8 },
  tMeta: { flexDirection: 'row', gap: 14, marginBottom: 14 },
  tMetaText: { fontSize: 12, color: C.muted },
  tProgressRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  tProgressBar: { flex: 1, height: 4, backgroundColor: C.surface2, borderRadius: 2, overflow: 'hidden' },
  tProgressFill: { height: '100%', backgroundColor: C.accent, borderRadius: 2 },
  tProgressFillAlmost: { backgroundColor: C.red },
  tProgressText: { fontSize: 11, color: C.muted, minWidth: 36, textAlign: 'right' },
  tCardFooter: { flexDirection: 'row', justifyContent: 'flex-end' },
  btnInscrire: { backgroundColor: C.accent, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 16 },
  btnInscrireText: { color: C.bg, fontWeight: '700', fontSize: 12 },
  btnInsrit: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(74,222,128,0.1)', borderWidth: 1, borderColor: 'rgba(74,222,128,0.25)', borderRadius: 10, paddingVertical: 8, paddingHorizontal: 14 },
  btnInsritText: { color: C.green, fontWeight: '700', fontSize: 12 },
  btnComplet: { backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: C.border, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 16 },
  btnCompletText: { color: C.muted, fontWeight: '700', fontSize: 12 },
  iconBtnActive: { backgroundColor: 'rgba(74,143,232,0.15)', borderColor: 'rgba(74,143,232,0.4)' },
  iconBadge: { position: 'absolute', top: 6, right: 6, width: 7, height: 7, borderRadius: 4, backgroundColor: C.accent, borderWidth: 1.5, borderColor: C.bg },
  searchBar: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginBottom: 8, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border, borderRadius: 14, height: 42 },
  searchInput: { flex: 1, color: C.text, fontSize: 14, paddingHorizontal: 10 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' },
  modalSheet: { backgroundColor: C.surface2, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 36, borderTopWidth: 1, borderColor: C.border },
  modalHandle: { width: 36, height: 4, backgroundColor: C.border, borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontWeight: '800', fontSize: 18, color: C.text },
  modalReset: { fontSize: 13, fontWeight: '700', color: C.accent },
  modalSection: { fontWeight: '700', fontSize: 13, color: C.muted, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  modalOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  modalPill: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 100, borderWidth: 1, borderColor: C.border, backgroundColor: C.card },
  modalPillActive: { backgroundColor: C.accent, borderColor: C.accent },
  modalPillText: { fontSize: 13, fontWeight: '700', color: C.muted },
  modalPillTextActive: { color: '#fff' },
  modalApply: { backgroundColor: C.accent, borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginTop: 4 },
  modalApplyText: { fontWeight: '800', fontSize: 15, color: '#fff' },
});

// ─── Styles Mes inscriptions ───────────────────────────────────────────────────
const r = StyleSheet.create({
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, gap: 12, marginTop: 80 },
  emptyIcon: { width: 72, height: 72, borderRadius: 22, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  emptyTitle: { fontWeight: '800', fontSize: 17, color: C.text },
  emptySub: { fontSize: 13, color: C.muted, textAlign: 'center', lineHeight: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20, paddingTop: 24, paddingBottom: 16 },
  sectionTitle: { fontWeight: '800', fontSize: 17, color: C.text },
  countBadge: { backgroundColor: C.accent, borderRadius: 10, minWidth: 22, height: 22, paddingHorizontal: 6, alignItems: 'center', justifyContent: 'center' },
  countBadgeText: { fontSize: 11, fontWeight: '800', color: '#fff' },
  card: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 20, marginHorizontal: 20, marginBottom: 16, overflow: 'hidden' },
  cardTop: { height: 90, justifyContent: 'flex-end', padding: 14, position: 'relative' },
  cardCourt: { position: 'absolute', right: 20, top: '50%', marginTop: -20, width: 60, height: 40, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.12)', borderRadius: 2, opacity: 0.4 },
  cardBadgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  levelBadge: { backgroundColor: 'rgba(74,143,232,0.2)', borderWidth: 1, borderColor: 'rgba(74,143,232,0.35)', borderRadius: 100, paddingVertical: 2, paddingHorizontal: 8 },
  levelBadgeText: { fontSize: 9, fontWeight: '700', color: C.accent },
  confirmedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(74,222,128,0.15)', borderWidth: 1, borderColor: 'rgba(74,222,128,0.3)', borderRadius: 100, paddingVertical: 2, paddingHorizontal: 8 },
  confirmedText: { fontSize: 9, fontWeight: '700', color: C.green },
  cardTitle: { fontWeight: '800', fontSize: 15, color: '#fff', letterSpacing: -0.2 },
  cardBody: { padding: 16 },
  infoRow: { flexDirection: 'row', gap: 20, marginBottom: 10 },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  infoText: { fontSize: 12, color: C.text, fontWeight: '600' },
  divider: { height: 1, backgroundColor: C.border, marginVertical: 14 },
  partnerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  partnerAvatar: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  partnerInitials: { fontWeight: '800', fontSize: 13, color: '#fff' },
  partnerLabel: { fontSize: 10, color: C.muted, fontWeight: '600', marginBottom: 2 },
  partnerName: { fontSize: 14, color: C.text, fontWeight: '700' },
  dossardWrap: { alignItems: 'flex-end' },
  dossardLabel: { fontSize: 10, color: C.muted, fontWeight: '600', marginBottom: 2 },
  dossardNum: { fontSize: 18, color: C.accent, fontWeight: '800' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  registeredAt: { fontSize: 11, color: C.muted },
  unregisterBtn: { fontSize: 12, color: C.red, fontWeight: '700' },
});

// ─── Styles Résultats ──────────────────────────────────────────────────────────
const rs = StyleSheet.create({
  statsCard: { flexDirection: 'row', backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border, borderRadius: 18, marginHorizontal: 20, marginTop: 20, padding: 20 },
  statItem: { flex: 1, alignItems: 'center' },
  statNum: { fontWeight: '800', fontSize: 20, color: C.accent },
  statLabel: { fontSize: 10, color: C.muted, marginTop: 2 },
  statDiv: { width: 1, backgroundColor: C.border },
  sectionHeader: { paddingHorizontal: 20, paddingTop: 28, paddingBottom: 14 },
  sectionTitle: { fontWeight: '800', fontSize: 17, color: C.text, letterSpacing: -0.3 },
  card: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 20, marginHorizontal: 20, marginBottom: 14, overflow: 'hidden' },
  cardHeader: { padding: 16, position: 'relative', flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardCourt: { width: 50, height: 34, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.12)', borderRadius: 2, opacity: 0.4 },
  cardBadgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  levelBadge: { backgroundColor: 'rgba(74,143,232,0.2)', borderWidth: 1, borderColor: 'rgba(74,143,232,0.35)', borderRadius: 100, paddingVertical: 2, paddingHorizontal: 8 },
  levelBadgeText: { fontSize: 9, fontWeight: '700', color: C.accent },
  position: { fontSize: 11, fontWeight: '800' },
  cardName: { fontWeight: '800', fontSize: 14, color: '#fff', letterSpacing: -0.2 },
  cardDate: { fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 },
  ptsWrap: { alignItems: 'flex-end' },
  ptsText: { fontSize: 13, fontWeight: '800', color: C.green },
  matchesWrap: { padding: 16, borderTopWidth: 1, borderTopColor: C.border },
  rankRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  rankLabel: { fontSize: 11, color: C.muted, flex: 1 },
  rankVal: { fontSize: 12, fontWeight: '700', color: C.text },
  matchRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  matchRowBorder: { borderBottomWidth: 1, borderBottomColor: C.border },
  resultDot: { width: 26, height: 26, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  dotWin: { backgroundColor: 'rgba(74,222,128,0.12)', borderWidth: 1, borderColor: 'rgba(74,222,128,0.25)' },
  dotLose: { backgroundColor: 'rgba(248,113,113,0.1)', borderWidth: 1, borderColor: 'rgba(248,113,113,0.22)' },
  resultDotText: { fontWeight: '800', fontSize: 10 },
  matchRound: { fontSize: 10, color: C.muted, marginBottom: 2 },
  matchVs: { fontSize: 12, color: C.text, fontWeight: '600' },
  matchScore: { fontSize: 13, fontWeight: '800' },
});

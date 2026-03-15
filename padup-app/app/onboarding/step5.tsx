import { View, TextInput, Text, StyleSheet, TouchableOpacity, ScrollView, Keyboard } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import OnboardingShell from '@/components/OnboardingShell';

const SURFACE = '#111118';
const BORDER = 'rgba(255,255,255,0.1)';
const ACCENT = '#4A8FE8';
const TEXT = '#F0F0F5';
const MUTED = '#6B6B7E';

const CITIES = [
  'Ajaccio','Aix-en-Provence','Albi','Alençon','Amiens','Angers','Angoulême','Annecy',
  'Antibes','Arles','Arras','Aubagne','Aurillac','Auxerre','Avignon',
  'Bayonne','Belfort','Besançon','Béziers','Bobigny','Bordeaux','Boulogne-Billancourt',
  'Boulogne-sur-Mer','Bourges','Brest','Brive-la-Gaillarde',
  'Caen','Calais','Cannes','Carcassonne','Châlons-en-Champagne','Chambéry',
  'Charleville-Mézières','Chartres','Châteauroux','Cherbourg-en-Cotentin',
  'Clermont-Ferrand','Colmar','Créteil',
  'Dijon','Digne-les-Bains','Douai','Draguignan',
  'Épinal','Évry-Courcouronnes',
  'Fontainebleau','Fréjus',
  'Gap','Grenoble','Guéret',
  'La Rochelle','La Roche-sur-Yon','Laval','Le Havre','Le Mans','Le Puy-en-Velay',
  'Lens','Limoges','Lorient','Lyon',
  'Macon','Marseille','Metz','Montauban','Montbéliard','Montpellier',
  'Moulins','Mulhouse','Nancy','Nantes','Narbonne','Nice','Nîmes','Niort',
  'Orléans',
  'Paris','Pau','Périgueux','Perpignan','Poitiers','Pontoise',
  'Reims','Rennes','Rodez','Rouen',
  'Saint-Brieuc','Saint-Denis','Saint-Étienne','Saint-Lô','Saint-Malo',
  'Saint-Nazaire','Saint-Quentin','Sartrouville','Sens','Strasbourg',
  'Tarbes','Toulon','Toulouse','Tours','Troyes',
  'Valence','Vannes','Versailles','Vesoul',
];

function normalize(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export default function Step5() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState('');
  const [showList, setShowList] = useState(false);

  const filtered = query.length >= 1
    ? CITIES.filter((c) => normalize(c).startsWith(normalize(query))).slice(0, 8)
    : [];

  function pick(city: string) {
    setSelected(city);
    setQuery(city);
    setShowList(false);
    Keyboard.dismiss();
  }

  function handleChange(text: string) {
    setQuery(text);
    setSelected('');
    setShowList(true);
  }

  return (
    <OnboardingShell
      step={5}
      title="Ta ville"
      subtitle="Pour trouver les clubs et les joueurs près de chez toi."
      onNext={() => router.push('/onboarding/step6')}
      nextDisabled={!selected}
    >
      <View style={s.wrap}>
        {/* Input */}
        <View style={[s.inputRow, showList && filtered.length > 0 && s.inputRowOpen]}>
          <Ionicons name="location-outline" size={18} color={selected ? ACCENT : MUTED} />
          <TextInput
            style={s.input}
            placeholder="Rechercher une ville..."
            placeholderTextColor={MUTED}
            value={query}
            onChangeText={handleChange}
            onFocus={() => setShowList(true)}
            autoCorrect={false}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => { setQuery(''); setSelected(''); setShowList(false); }} activeOpacity={0.7}>
              <Ionicons name="close-circle" size={18} color={MUTED} />
            </TouchableOpacity>
          )}
        </View>

        {/* Suggestions */}
        {showList && filtered.length > 0 && (
          <View style={s.dropdown}>
            <ScrollView keyboardShouldPersistTaps="handled" scrollEnabled={filtered.length > 5}>
              {filtered.map((city, i) => {
                const isLast = i === filtered.length - 1;
                // bold la partie tapée
                const matchLen = query.length;
                const bold = city.slice(0, matchLen);
                const rest = city.slice(matchLen);
                return (
                  <TouchableOpacity
                    key={city}
                    style={[row.wrap, !isLast && row.border]}
                    onPress={() => pick(city)}
                    activeOpacity={0.75}
                  >
                    <Ionicons name="location-outline" size={15} color={MUTED} />
                    <Text style={row.text}>
                      <Text style={row.bold}>{bold}</Text>
                      {rest}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Ville sélectionnée */}
        {selected !== '' && (
          <View style={s.pill}>
            <Ionicons name="checkmark-circle" size={16} color={ACCENT} />
            <Text style={s.pillText}>{selected}</Text>
          </View>
        )}
      </View>
    </OnboardingShell>
  );
}

const s = StyleSheet.create({
  wrap: { gap: 10 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    height: 54,
    paddingHorizontal: 18,
  },
  inputRowOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomColor: 'transparent',
  },
  input: { flex: 1, color: TEXT, fontSize: 16 },
  dropdown: {
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    borderTopWidth: 0,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    maxHeight: 280,
    overflow: 'hidden',
    marginTop: -10,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(74,143,232,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(74,143,232,0.25)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginTop: 4,
  },
  pillText: { color: ACCENT, fontSize: 14, fontWeight: '600' },
});

const row = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  text: { color: TEXT, fontSize: 15 },
  bold: { color: TEXT, fontSize: 15, fontWeight: '700' },
});

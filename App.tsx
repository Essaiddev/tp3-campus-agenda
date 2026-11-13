import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

type Categorie = 'Atelier' | 'Conférence' | 'Rencontre';
type Statut = 'Complet' | 'Presque complet' | 'Ouvert';
type Mode = 'tous' | 'ateliers';

type Evenement = {
  id: string;
  titre: string;
  categorie: Categorie;
  capacite: number;
  inscrits: number;
};

const evenements: Evenement[] = [
  { id: 'E01', titre: 'Atelier React', categorie: 'Atelier', capacite: 25, inscrits: 25 },
  { id: 'E02', titre: 'Conférence IA', categorie: 'Conférence', capacite: 70, inscrits: 52 },
  { id: 'E03', titre: 'Sécurité mobile', categorie: 'Atelier', capacite: 20, inscrits: 17 },
  { id: 'E04', titre: 'Design UI', categorie: 'Atelier', capacite: 18, inscrits: 9 },
  { id: 'E05', titre: 'Forum projets', categorie: 'Rencontre', capacite: 50, inscrits: 49 },
  { id: 'E06', titre: 'Découverte Git', categorie: 'Atelier', capacite: 24, inscrits: 24 },
];

// Changer cette valeur pour tester les deux modes : 'tous' ou 'ateliers'
const mode = 'tous' as Mode;

function placesRestantes(e: Evenement): number {
  return Math.max(0, e.capacite - e.inscrits);
}

function statutEvenement(e: Evenement): Statut {
  const r = placesRestantes(e);
  if (r === 0) return 'Complet';
  if (r <= 3) return 'Presque complet';
  return 'Ouvert';
}

const COULEURS: Record<Statut, { fond: string; texte: string }> = {
  'Complet': { fond: '#FFE5E5', texte: '#8A1C1C' },
  'Presque complet': { fond: '#FFEBD6', texte: '#8A4B00' },
  'Ouvert': { fond: '#D6F5E7', texte: '#14633F' },
};

type BadgeProps = { statut: Statut };

function BadgeEtat({ statut }: BadgeProps) {
  const { fond, texte } = COULEURS[statut];
  return (
    <View style={[styles.badge, { backgroundColor: fond }]}>
      <Text style={[styles.texteBadge, { color: texte }]}>{statut}</Text>
    </View>
  );
}

type CarteProps = { evenement: Evenement };

function CarteEvenement({ evenement }: CarteProps) {
  const { titre, categorie, capacite } = evenement;
  const restantes = placesRestantes(evenement);
  return (
    <View style={styles.carte}>
      <View style={styles.ligne}>
        <Text style={styles.titreCarte}>{titre}</Text>
        <BadgeEtat statut={statutEvenement(evenement)} />
      </View>
      <Text style={styles.info}>{categorie}</Text>
      <Text style={styles.info}>Places restantes : {restantes} / {capacite}</Text>
    </View>
  );
}

type BlocProps = { libelle: string; valeur: number };

function BlocStatistique({ libelle, valeur }: BlocProps) {
  return (
    <View style={styles.bloc}>
      <Text style={styles.valeur}>{valeur}</Text>
      <Text style={styles.libelle}>{libelle}</Text>
    </View>
  );
}

export default function App() {
  const total = evenements.length;
  const complets = evenements.filter(e => placesRestantes(e) === 0).length;
  const avecPlaces = evenements.filter(e => placesRestantes(e) > 0).length;
  const totalPlaces = evenements.reduce((somme, e) => somme + placesRestantes(e), 0);

  const ateliersDisponibles = evenements.filter(
    e => e.categorie === 'Atelier' && placesRestantes(e) > 0
  );
  const donnees = mode === 'tous' ? evenements : ateliersDisponibles;
  const titreMode = mode === 'tous' ? 'Tous les événements' : 'Ateliers disponibles';

  return (
    <View style={styles.page}>
      <View style={styles.entete}>
        <Text style={styles.titre}>CampusAgenda</Text>
        <Text style={styles.sousTitre}>Événements du campus</Text>
      </View>

      <View style={styles.statistiques}>
        <BlocStatistique libelle="Événements" valeur={total} />
        <BlocStatistique libelle="Complets" valeur={complets} />
        <BlocStatistique libelle="Avec des places" valeur={avecPlaces} />
        <BlocStatistique libelle="Places restantes" valeur={totalPlaces} />
      </View>

      <Text style={styles.titreMode}>{titreMode}</Text>

      <FlatList
        data={donnees}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <CarteEvenement evenement={item} />}
        ListEmptyComponent={<Text style={styles.vide}>Aucun événement à afficher.</Text>}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </View>
  );
} 

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F4F7FB', paddingTop: 56, paddingHorizontal: 16 },
  entete: { backgroundColor: '#0B3D91', borderRadius: 16, padding: 16, marginBottom: 14 },
  titre: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF' },
  sousTitre: { color: '#DCE8FF', marginTop: 4 },
  statistiques: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
  bloc: { flexGrow: 1, flexBasis: '45%', backgroundColor: '#FFFFFF', borderRadius: 12,
    padding: 12, alignItems: 'center', borderWidth: 1, borderColor: '#DCE5F2' },
  valeur: { fontSize: 24, fontWeight: 'bold', color: '#0B3D91' },
  libelle: { color: '#4C5360', fontSize: 13, marginTop: 2 },
  titreMode: { fontSize: 18, fontWeight: 'bold', color: '#0B2A5C', marginBottom: 10 },
  carte: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 14, marginBottom: 10,
    borderLeftWidth: 5, borderLeftColor: '#0B3D91' },
  ligne: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 6 },
  titreCarte: { fontSize: 17, fontWeight: 'bold', color: '#0B2A5C', flexShrink: 1 },
  info: { color: '#3D4A5C', marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, marginLeft: 8 },
  texteBadge: { fontSize: 12, fontWeight: 'bold' },
  vide: { textAlign: 'center', color: '#6B7480', marginTop: 24, fontSize: 16 },
});


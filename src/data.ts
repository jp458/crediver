/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserProfile, Transaction, PracticeAnswers, ScoreBreakdown, ScoreLevel, CreditEligibility } from './types';

export const SECTORS = [
  'Commerce de détail (Boutique, Étal)',
  'Alimentation & Restauration (Maquis, Fast food)',
  'Artisanat & Couture',
  'Maraîcher & Agriculture',
  'Salon de Coiffure & Beauté',
  'Transport & Livraison',
  'Services de Proximité',
  'Autre Activité'
];

export const CITIES = [
  'Abidjan',
  'Yamoussoukro',
  'Bouaké',
  'San-Pédro',
  'Korhogo',
  'Daloa',
  'Man'
];

export const COMMUNES: Record<string, string[]> = {
  'Abidjan': ['Cocody', 'Yopougon', 'Abobo', 'Marcory', 'Treichville', 'Plateau', 'Koumassi', 'Port-Bouët', 'Adjamé', 'Anyama', 'Songon'],
  'Yamoussoukro': ['Commune Centrale', 'Morofé', 'Dioulabougou', 'Kossou'],
  'Bouaké': ['Gbêkêkro', 'Koko', 'Nimbo', 'Broukro', 'Ahougnansou'],
  'San-Pédro': ['Bardot', 'Cité', 'Sewer', 'Naro'],
  'Korhogo': ['Soba', 'Koko', 'Bafimé', 'Quartier Résidentiel'],
  'Daloa': ['Commune Centrale', 'Gbeuliville', 'Tazibouo'],
  'Man': ['Gbêpleu', 'Quartier Commerce', 'Dompleu']
};

export const DEFAULT_PROFILE: UserProfile = {
  fullName: 'Awa Koné',
  phone: '+225 07 48 92 11 05',
  isRegistered: true,
  businessName: 'Chez Awa - Fruits et Épices',
  sector: 'Commerce de détail (Boutique, Étal)',
  commune: 'Adjamé',
  city: 'Abidjan',
  employeeCount: 2,
  photoUrl: '',
  hasBusinessDocs: true
};

export const DEFAULT_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_1',
    type: 'vente',
    amount: 25000,
    paymentMethod: 'Wave',
    date: '2026-06-08',
  },
  {
    id: 'tx_2',
    type: 'vente',
    amount: 18000,
    paymentMethod: 'Cash',
    date: '2026-06-09',
  },
  {
    id: 'tx_3',
    type: 'vente',
    amount: 32000,
    paymentMethod: 'Orange Money',
    date: '2026-06-10',
  },
  {
    id: 'tx_4',
    type: 'depense',
    amount: 12000,
    category: 'Stock',
    date: '2026-06-08',
  },
  {
    id: 'tx_5',
    type: 'depense',
    amount: 3000,
    category: 'Transport',
    date: '2026-06-09',
  }
];

export const DEFAULT_PRACTICE_ANSWERS: PracticeAnswers = {
  ledLighting: true,
  plasticReduction: false,
  wasteManagement: true,
  energyEfficientEquipment: true,
  jobCreation: true,
  employsWomen: true,
  separateMoney: 'parfois',
  trackSales: 'toujours'
};

export function calculateScore(
  profile: UserProfile,
  transactions: Transaction[],
  answers: PracticeAnswers
): ScoreBreakdown {
  // 1. ACTIVITÉ ÉCONOMIQUE (50 Points Max)
  let economique = 0;
  
  // Commerce existant depuis plus de 6 mois (simulate always active or based on register state)
  if (profile.businessName.length > 0) {
    economique += 10;
  }
  
  // Enregistrement régulier des ventes (au moins 1 vente)
  const hasSales = transactions.some(t => t.type === 'vente');
  if (hasSales) {
    economique += 15;
  }
  
  // Transactions fréquentes (au moins 3 transactions)
  if (transactions.length >= 3) {
    economique += 15;
  }
  
  // Revenu stable (bénéfice estimé est positif)
  const totalSales = transactions.filter(t => t.type === 'vente').reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'depense').reduce((acc, t) => acc + t.amount, 0);
  const benefit = totalSales - totalExpenses;
  if (benefit > 0) {
    economique += 10;
  }

  // 2. GOUVERNANCE (25 Points Max)
  let gouvernance = 0;
  
  // Profil complété (nom, commerce, secteur, commune, ville)
  const profileComplete = !!(profile.fullName && profile.businessName && profile.sector && profile.commune && profile.city);
  if (profileComplete) {
    gouvernance += 5;
  }
  
  // Registre des dépenses tenu (au moins 1 dépense)
  const hasExpenses = transactions.some(t => t.type === 'depense');
  if (hasExpenses) {
    gouvernance += 5;
  }
  
  // Séparation argent personnel / commerce
  if (answers.separateMoney === 'toujours') {
    gouvernance += 10;
  } else if (answers.separateMoney === 'parfois') {
    gouvernance += 5;
  }
  
  // Documents ou justificatifs ajoutés (hasBusinessDocs)
  if (profile.hasBusinessDocs) {
    gouvernance += 5;
  }

  // 3. BONNES PRATIQUES (25 Points Max)
  let bonnesPratiques = 0;
  
  // Environment (12 points total)
  if (answers.ledLighting === true) {
    bonnesPratiques += 3;
  }
  if (answers.plasticReduction === true) {
    bonnesPratiques += 3;
  }
  if (answers.wasteManagement === true) {
    bonnesPratiques += 3;
  }
  if (answers.energyEfficientEquipment === true) {
    bonnesPratiques += 3;
  }
  
  // Social (10 points total)
  if (answers.jobCreation === true) {
    bonnesPratiques += 4; // Creates jobs
  }
  if (answers.employsWomen === true) {
    bonnesPratiques += 3; // Employs women
  }
  // Responsible practices (auto awarded if job creation & has employee count > 0)
  if (answers.jobCreation === true && profile.employeeCount > 0) {
    bonnesPratiques += 3;
  }
  
  // Governance / Commitment consistency (consistency of eco actions - 3 points total)
  // Awarded if answered Yes to at least 3 environmental/social practices
  let yesCount = 0;
  if (answers.ledLighting === true) yesCount++;
  if (answers.plasticReduction === true) yesCount++;
  if (answers.wasteManagement === true) yesCount++;
  if (answers.energyEfficientEquipment === true) yesCount++;
  if (answers.jobCreation === true) yesCount++;
  if (answers.employsWomen === true) yesCount++;
  
  if (yesCount >= 3) {
    bonnesPratiques += 3;
  }

  const total = economique + gouvernance + bonnesPratiques;

  return {
    economique,
    gouvernance,
    bonnesPratiques,
    total: Math.min(total, 100)
  };
}

export function getScoreLevel(score: number): ScoreLevel {
  if (score < 40) return 'Activité à structurer';
  if (score < 60) return 'En progression';
  if (score < 80) return 'Finançable';
  return 'Hautement finançable';
}

export function getCreditEligibility(score: number): CreditEligibility {
  if (score < 60) return 'Non éligible';
  if (score < 80) return 'Éligible sous conditions';
  return 'Éligible au financement vert';
}

export interface Recommendation {
  id: string;
  title: string;
  points: number;
  category: 'Activités' | 'Gouvernance' | 'Bonnes Pratiques';
  why: string;
  how: string;
  isCompleted: (p: UserProfile, txs: Transaction[], ans: PracticeAnswers) => boolean;
}

export const RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'rec_separate',
    title: 'Séparer l\'argent du commerce et de la maison',
    points: 10,
    category: 'Gouvernance',
    why: 'Séparer les caisses permet de calculer les vrais bénéfices de votre commerce et démontre au banquier votre rigueur de gestion.',
    how: 'Utilisez un compte Mobile Money (Wave ou Orange Money) dédié exclusivement aux encaissements de vos clients.',
    isCompleted: (p, txs, ans) => ans.separateMoney === 'toujours'
  },
  {
    id: 'rec_track_sales',
    title: 'Enregistrer vos ventes régulièrement',
    points: 15,
    category: 'Activités',
    why: 'Avoir un historique fiable de vos ventes quotidiennes prouve la viabilité économique de votre commerce.',
    how: 'Utilisez l\'onglet "Mon Activité" pour ajouter au moins 1 vente chaque jour, même les petits montants.',
    isCompleted: (p, txs, ans) => txs.some(t => t.type === 'vente')
  },
  {
    id: 'rec_track_expenses',
    title: 'Tenir un registre régulier de vos dépenses',
    points: 5,
    category: 'Gouvernance',
    why: 'Le prêteur doit comprendre vos marges de bénéfices. Enregistrer vos dépenses démontre que vous maîtrisez vos coûts de revient.',
    how: 'Dès que vous payez un fournisseur, le loyer ou le transport, enregistrez-le dans l\'onglet "Mon Activité".',
    isCompleted: (p, txs, ans) => txs.some(t => t.type === 'depense')
  },
  {
    id: 'rec_led',
    title: 'Passer aux ampoules économiques LED',
    points: 3,
    category: 'Bonnes Pratiques',
    why: 'Le passage au LED réduit considérablement vos factures d\'électricité et diminue votre empreinte carbone, un point clé pour la finance verte.',
    how: 'Remplacez vos ampoules classiques dans votre boutique par des ampoules labellisées LED basse consommation.',
    isCompleted: (p, txs, ans) => ans.ledLighting === true
  },
  {
    id: 'rec_plastic',
    title: 'Réduire l\'usage des sachets en plastique',
    points: 3,
    category: 'Bonnes Pratiques',
    why: 'La pollution plastique est un défi écologique majeur. Utiliser des alternatives biodégradables attire les subventions écologiques.',
    how: 'Proposez des sacs en kraft ou encouragez vos clients à venir avec leurs propres cabas durables.',
    isCompleted: (p, txs, ans) => ans.plasticReduction === true
  },
  {
    id: 'rec_docs',
    title: 'Déposer vos justificatifs d\'activité',
    points: 5,
    category: 'Gouvernance',
    why: 'La présence de documents légaux ou de photos de votre commerce valide votre existence physique et juridique.',
    how: 'Activez l\'option justificatifs ou joignez une photo de votre commerce et de votre carte d\'identité dans votre profil.',
    isCompleted: (p, txs, ans) => p.hasBusinessDocs === true
  }
];

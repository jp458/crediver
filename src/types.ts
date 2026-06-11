/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserProfile {
  id?: string;
  fullName: string;
  phone: string;
  isRegistered: boolean;
  businessName: string;
  sector: string;
  commune: string;
  city: string;
  employeeCount: number;
  photoUrl: string;
  hasBusinessDocs: boolean;
}

export type ExpenseCategory = 'Stock' | 'Transport' | 'Électricité' | 'Eau' | 'Salaires' | 'Autres';
export type PaymentMethod = 'Cash' | 'Wave' | 'Orange Money' | 'MTN Money' | 'Moov Money';

export interface Transaction {
  id: string;
  type: 'vente' | 'depense';
  amount: number;
  category?: ExpenseCategory;
  paymentMethod?: PaymentMethod;
  date: string;
  proofUrl?: string;
}

export interface CreditRequest {
  id: string;
  amount: number;
  purpose: 'Achat de stock' | 'Réfrigérateur' | 'Équipement' | 'Tricycle électrique' | 'Extension activité' | 'Autre';
  status: 'Brouillon' | 'Soumise' | 'Analyse' | 'Approuvée' | 'Refusée';
  date: string;
}

export interface PracticeAnswers {
  ledLighting: boolean | null;
  plasticReduction: boolean | null;
  wasteManagement: boolean | null;
  energyEfficientEquipment: boolean | null;
  jobCreation: boolean | null;
  employsWomen: boolean | null;
  separateMoney: 'toujours' | 'parfois' | 'jamais' | null;
  trackSales: 'toujours' | 'parfois' | 'jamais' | null;
}

export interface ScoreBreakdown {
  economique: number;     // max 50
  gouvernance: number;    // max 25
  bonnesPratiques: number; // max 25
  total: number;          // max 100
}

export type ScoreLevel = 'Activité à structurer' | 'En progression' | 'Finançable' | 'Hautement finançable';
export type CreditEligibility = 'Non éligible' | 'Éligible sous conditions' | 'Éligible au financement vert';

export type UserRole = 'merchant' | 'banker';

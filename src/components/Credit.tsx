/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserProfile, Transaction, CreditRequest, ScoreBreakdown } from '../types';
import { getCreditEligibility, getScoreLevel } from '../data';
import { Landmark, TrendingUp, AlertCircle, FileSpreadsheet, Calendar, HelpCircle, ArrowRight, ShieldCheck, Check, Info } from 'lucide-react';

interface CreditProps {
  profile: UserProfile;
  transactions: Transaction[];
  scoreBreakdown: ScoreBreakdown;
  creditRequests: CreditRequest[];
  onAddCreditRequest: (request: CreditRequest) => void;
  onNavigateToTab: (index: number) => void;
}

export function Credit({
  profile,
  transactions,
  scoreBreakdown,
  creditRequests,
  onAddCreditRequest,
  onNavigateToTab
}: CreditProps) {
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [requestedAmount, setRequestedAmount] = useState('');
  const [purpose, setPurpose] = useState<CreditRequest['purpose']>('Achat de stock');
  const [formError, setFormError] = useState('');

  const score = scoreBreakdown.total;
  const eligibility = getCreditEligibility(score);

  // Dynamic calculations based on business activity
  const totalSales = transactions
    .filter((t) => t.type === 'vente')
    .reduce((sum, t) => sum + t.amount, 0);

  // Determine authorized credit upper boundary
  let maxCreditAmount = 0;
  let interestRateText = "N/A";
  let statusColor = "text-red-500 bg-red-50 border-red-200";
  let statusLabel = "Non éligible";

  if (score >= 80) {
    maxCreditAmount = Math.max(1500000, Math.floor(totalSales * 1.5));
    interestRateText = "3.5% (Taux Vert préférentiel subventionné)";
    statusColor = "text-emerald-700 bg-emerald-50 border-emerald-200";
    statusLabel = "Éligible au financement vert";
  } else if (score >= 60) {
    maxCreditAmount = Math.max(500000, Math.floor(totalSales * 0.8));
    interestRateText = "7.0% (Taux standard bonifié)";
    statusColor = "text-yellow-800 bg-yellow-50 border-yellow-200";
    statusLabel = "Éligible sous conditions";
  } else {
    maxCreditAmount = 0;
    interestRateText = "N/A";
    statusColor = "text-red-650 bg-orange-50/50 border-orange-200";
    statusLabel = "Non éligible actuellement";
  }

  // Format currency
  const formatCFAPrice = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num) + ' F CFA';
  };

  // Submit credit request
  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const amt = parseFloat(requestedAmount);
    if (!requestedAmount || isNaN(amt) || amt <= 1000) {
      setFormError('Veuillez introduire un montant de financement cohérent.');
      return;
    }
    if (amt > maxCreditAmount) {
      setFormError(`Le montant maximal auquel vous pouvez prétendre est de ${formatCFAPrice(maxCreditAmount)}.`);
      return;
    }

    const newReq: CreditRequest = {
      id: 'req_' + Date.now(),
      amount: amt,
      purpose,
      status: 'Soumise', // Start life as 'Soumise' (Screen 13)
      date: new Date().toISOString().split('T')[0]
    };

    onAddCreditRequest(newReq);
    setShowApplyForm(false);
    setRequestedAmount('');
  };

  // Timeline Step Tracker configuration (Screen 13)
  const TIMELINE_STEPS = [
    { key: 'Brouillon', title: 'Brouillon enregistré', desc: 'Votre profil local est constitué sur votre téléphone' },
    { key: 'Soumise', title: 'Certifier & Soumettre', desc: 'Passeport transmis au fond de garantie' },
    { key: 'Analyse', title: 'Analyse de risques', desc: 'Le conseiller valide l\'existence physique de votre boutique' },
    { key: 'Approuvée', title: 'Fonds libérés 🎉', desc: 'Crédit versé sur votre compte Wave ou Mobile Money' }
  ];

  return (
    <div className="flex flex-col flex-1 bg-gray-50 select-none overflow-y-auto pb-24 h-full">
      {/* Green Header banner */}
      <div className="bg-[#1DB954] text-white pt-6 pb-8 px-5 rounded-b-[32px] shadow-sm">
        <span className="text-[10px] font-bold tracking-widest bg-white/20 uppercase px-2.5 py-0.5 rounded-full">
          Simulation & Demandes
        </span>
        <h2 className="text-xl font-black mt-1">Crédit Éco-Responsable</h2>
        <p className="text-xs text-white/80 mt-0.5">La finance de croissance africaine, simplifiée au maximum.</p>
      </div>

      {showApplyForm ? (
        /* SCREEN 12: FORMULAIRE DE DEMANDE DE CRÉDIT */
        <div className="px-5 mt-5">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-150 text-left">
            <h3 className="text-lg font-black text-gray-905 mb-1.5 flex items-center gap-2">
              <span>📝</span> Faire ma demande de crédit
            </h3>
            <p className="text-xs text-gray-500 mb-5 leading-normal">
              Remplissez ce formulaire d'accès direct. Nos banques partenaires vous répondront directement sur l'application.
            </p>

            {formError && (
              <div className="mb-4 p-3 bg-orange-50 border border-orange-200 text-orange-900 rounded-xl text-xs font-semibold flex items-stretch gap-2">
                <AlertCircle className="w-5 h-5 text-orange-500 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitRequest} className="flex flex-col gap-4">
              {/* Montant souhaité */}
              <div>
                <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-1.5 ml-1">
                  Montant Demandé (F CFA)
                </label>
                <input
                  type="number"
                  pattern="[0-9]*"
                  value={requestedAmount}
                  onChange={(e) => setRequestedAmount(e.target.value)}
                  placeholder={`Ex : 500000 (Maximum ${maxCreditAmount.toLocaleString('fr-FR')})`}
                  className="w-full h-12 px-4 rounded-xl border border-gray-200 text-sm font-semibold bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#1DB954] focus:outline-none text-gray-800"
                  required
                />
                <span className="text-[10px] text-gray-400 mt-1 block">Taux d'intérêt applicable : {interestRateText}</span>
              </div>

              {/* Objet du financement options checklist */}
              <div>
                <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2 ml-1">
                  Destination du financement (Objet)
                </label>
                <div className="flex flex-col gap-2">
                  {(['Achat de stock', 'Réfrigérateur', 'Équipement', 'Tricycle électrique', 'Extension activité', 'Autre'] as CreditRequest['purpose'][]).map((p) => {
                    const isSelected = purpose === p;
                    return (
                      <button
                        type="button"
                        key={p}
                        onClick={() => setPurpose(p)}
                        className={`h-11 rounded-xl flex items-center px-4 gap-3 border-2 text-xs font-bold transition-all relative cursor-pointer text-left ${
                          isSelected
                            ? 'border-[#1DB954] bg-emerald-50/50 text-emerald-800'
                            : 'border-gray-150 bg-white text-gray-600 hover:bg-gray-55'
                        }`}
                      >
                        <span className="text-sm">
                          {p === 'Achat de stock' && '📦'}
                          {p === 'Réfrigérateur' && '❄️'}
                          {p === 'Équipement' && '⚙️'}
                          {p === 'Tricycle électrique' && '🛺'}
                          {p === 'Extension activité' && '📈'}
                          {p === 'Autre' && '💭'}
                        </span>
                        <span>{p}</span>
                        {isSelected && <span className="absolute right-3 text-[#1DB954] font-bold">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2.5 mt-4">
                {/* Cancel */}
                <button
                  type="button"
                  onClick={() => setShowApplyForm(false)}
                  className="flex-1 h-12 bg-white text-gray-700 font-bold text-xs border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-all text-center"
                >
                  Annuler
                </button>
                {/* Submit */}
                <button
                  type="submit"
                  className="flex-1 h-12 bg-[#1DB954] hover:bg-[#159441] text-white font-black text-xs rounded-xl cursor-pointer shadow-sm shadow-emerald-50"
                >
                  Envoyer ma Demande
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        /* SCREEN 11: MAIN CREDIT ACCESS INDICATOR PANEL */
        <div className="px-5 mt-5 flex flex-col gap-4">
          
          {/* Eligibility status card */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-150 text-left">
            <p className="text-xs font-black text-zinc-400 uppercase tracking-wider mb-2">Mon Éligibilité Actuelle</p>
            
            <div className={`p-4 rounded-2xl border-2 flex items-start gap-3 mb-4 ${statusColor}`}>
              <Landmark className="w-6 h-6 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-black leading-tight">{statusLabel}</p>
                <p className="text-[11px] font-bold opacity-80 mt-1">Limite autorisée : {formatCFAPrice(maxCreditAmount)}</p>
                {score >= 60 && <p className="text-[10px] opacity-70 font-semibold mt-0.5">Taux d'intérêt : {interestRateText}</p>}
              </div>
            </div>

            {/* Score info badge representation */}
            <div className="flex justify-between items-center text-xs border-b border-gray-100 pb-3 mb-3">
              <span className="font-extrabold text-gray-500">Mon score actuel :</span>
              <span className="font-black text-gray-900 bg-gray-100 px-3 py-1 rounded-full">{score} / 100 points</span>
            </div>

            {score < 60 ? (
              /* Non eligible Coach guidelines */
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-2xl text-[11px] text-orange-900 leading-normal font-medium mb-3">
                ⚠️ <span className="font-extrabold text-orange-850">Comment franchir la ligne d'éligibilité ?</span>
                <p className="mt-1 font-semibold text-gray-600">
                  Votre score est inférieur à 60. Ne vous découragez pas ! Adoptez de nouvelles <span className="font-bold cursor-pointer underline text-[#1DB954]" onClick={() => onNavigateToTab(1)}>bonnes pratiques</span> (comme utiliser du LED ou supprimer les sacs plastiques) ou continuez de tenir vos <span className="font-bold cursor-pointer underline text-[#1DB954]" onClick={() => onNavigateToTab(0)}>ventes</span> pour monter vos points.
                </p>
              </div>
            ) : (
              /* Eligible Apply Trigger */
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setShowApplyForm(true)}
                  id="btn_request_loan_action"
                  className="w-full h-14 bg-[#1DB954] hover:bg-[#159441] text-white rounded-2xl font-black text-center text-sm shadow-sm transition-all active:scale-98 cursor-pointer"
                >
                  Faire une demande de crédit
                </button>
                <p className="text-[9px] text-center text-gray-400 font-bold">Étude garantie sous 48h sans garant requis</p>
              </div>
            )}
          </div>

          {/* SCREEN 13: SUIVI DE DEMANDE (TIMELINE PREVIEW) */}
          {creditRequests.length > 0 && (
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 text-left">
              <div className="flex justify-between items-baseline mb-4">
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                  📁 Suivi de ma Demande
                </h3>
                <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full font-black">
                  {creditRequests[0].status}
                </span>
              </div>

              {/* Outstanding Loan info */}
              <div className="bg-gray-55 rounded-2xl p-4 border border-gray-150 mb-6 font-semibold text-xs text-gray-700 flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-bold text-gray-400">MONTANT DEMANDÉ</p>
                  <p className="text-base font-black text-gray-900 mt-0.5">{formatCFAPrice(creditRequests[0].amount)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-gray-400">OBJET DU PRÊT</p>
                  <p className="text-xs font-extrabold text-indigo-700 mt-1 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100 inline-block">{creditRequests[0].purpose}</p>
                </div>
              </div>

              {/* Beautiful Chronological Timeline (Screen 13 specific) */}
              <div className="flex flex-col pl-4 relative border-l-2 border-dashed border-gray-200 ml-2.5 gap-6 py-2">
                {TIMELINE_STEPS.map((step, idx) => {
                  const currentStatus = creditRequests[0].status;
                  
                  // Compute whether step is accomplished, active, or pending
                  const statusRank: Record<string, number> = { 'Brouillon': 0, 'Soumise': 1, 'Analyse': 2, 'Approuvée': 3, 'Refusée': 3 };
                  const currentRank = statusRank[currentStatus] ?? 1;
                  const stepRank = idx;

                  const isAccomplished = stepRank < currentRank;
                  const isActive = stepRank === currentRank;
                  const isFuture = stepRank > currentRank;

                  // Handle refusal visual state override
                  const isRefused = currentStatus === 'Refusée' && isActive;

                  return (
                    <div key={idx} className="relative text-left">
                      {/* Timeline dot badge */}
                      <div className={`absolute -left-7 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        isRefused
                          ? 'bg-red-500 border-red-500 text-white shadow-sm'
                          : isAccomplished
                          ? 'bg-[#1DB954] border-[#1DB954] text-white shadow-xs'
                          : isActive
                          ? 'bg-white border-[#1DB954] ring-4 ring-emerald-50 text-emerald-600 animate-pulse'
                          : 'bg-white border-gray-300 text-gray-300'
                      }`}>
                        {isRefused ? '✕' : isAccomplished ? '✓' : '●'}
                      </div>

                      {/* Text */}
                      <div className="pl-2">
                        <p className={`text-xs font-black ${isActive ? 'text-gray-900 font-extrabold text-[#1DB954]' : isFuture ? 'text-gray-400' : 'text-gray-800'}`}>
                          {isRefused ? 'Demande Déclinée' : step.title}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-0.5">
                          {isRefused 
                            ? 'Le conseiller a décliné la demande. Veuillez ajuster vos garanties ou vos réponses pour retenter.' 
                            : step.desc
                          }
                        </p>
                        {isActive && !isRefused && (
                          <span className="text-[9px] font-black tracking-wide text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-1.5 py-0.5 mt-1 opacity-90 inline-block uppercase">
                            ÉTAPE EN COURS
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

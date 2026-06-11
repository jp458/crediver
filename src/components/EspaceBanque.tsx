/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useMemo } from 'react';
import { UserProfile, Transaction, PracticeAnswers, CreditRequest } from '../types';
import { SECTORS, CITIES, calculateScore, getScoreLevel } from '../data';
import { Search, Filter, Landmark, UserCheck, ShieldCheck, Check, X, Eye, FileText, ChevronRight, Phone, AlertCircle } from 'lucide-react';

interface EspaceBanqueProps {
  // Current active user's metrics to review in live-sync mode
  activeProfile: UserProfile;
  activeTransactions: Transaction[];
  activeAnswers: PracticeAnswers;
  activeCreditRequests: CreditRequest[];
  onUpdateCreditStatus: (requestId: string, status: CreditRequest['status']) => void;
}

export function EspaceBanque({
  activeProfile,
  activeTransactions,
  activeAnswers,
  activeCreditRequests,
  onUpdateCreditStatus
}: EspaceBanqueProps) {
  // Filters state
  const [selectedCity, setSelectedCity] = useState<string>('Tous');
  const [selectedSector, setSelectedSector] = useState<string>('Tous');
  const [minScore, setMinScore] = useState<number>(0);

  // Selected merchant ID state
  const [selectedMerchantId, setSelectedMerchantId] = useState<string>('live_merchant');

  // Precalculated dynamic list of candidates
  const candidatesData = useMemo(() => {
    // 1. Current Live User profile recalculated
    const liveScore = calculateScore(activeProfile, activeTransactions, activeAnswers);
    const liveRequest = activeCreditRequests.length > 0 ? activeCreditRequests[0] : null;

    const merchantsList = [
      {
        id: 'live_merchant',
        fullName: activeProfile.fullName,
        phone: activeProfile.phone,
        businessName: activeProfile.businessName || 'Commerce sans nom',
        sector: activeProfile.sector,
        city: activeProfile.city,
        commune: activeProfile.commune,
        employeeCount: activeProfile.employeeCount,
        photoUrl: activeProfile.photoUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400",
        score: liveScore.total,
        scoreBreakdown: liveScore,
        answers: activeAnswers,
        transactions: activeTransactions,
        hasDocs: activeProfile.hasBusinessDocs,
        request: liveRequest,
        isLiveUser: true
      },
      {
        id: 'candidate_2',
        fullName: 'Fatou Diallo',
        phone: '+225 05 12 34 56 78',
        businessName: 'Atelier Fatou - Couture Chic',
        sector: 'Artisanat & Couture',
        city: 'Abidjan',
        commune: 'Yopougon',
        employeeCount: 4,
        photoUrl: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&q=80&w=400',
        score: 82,
        scoreBreakdown: { economique: 42, gouvernance: 20, bonnesPratiques: 20, total: 82 },
        answers: {
          ledLighting: true,
          plasticReduction: true,
          wasteManagement: true,
          energyEfficientEquipment: false,
          jobCreation: true,
          employsWomen: true,
          separateMoney: 'toujours',
          trackSales: 'toujours'
        } as PracticeAnswers,
        transactions: [
          { id: 't_c2_1', type: 'vente', amount: 80000, date: '2026-06-05', paymentMethod: 'Wave' },
          { id: 't_c2_2', type: 'vente', amount: 95000, date: '2026-06-06', paymentMethod: 'Orange Money' },
          { id: 't_c3_3', type: 'depense', amount: 45000, date: '2026-06-05', category: 'Stock' }
        ] as Transaction[],
        hasDocs: true,
        request: {
          id: 'req_candidate_2',
          amount: 1200000,
          purpose: 'Extension activité',
          status: 'Soumise',
          date: '2026-06-07'
        } as CreditRequest,
        isLiveUser: false
      },
      {
        id: 'candidate_3',
        fullName: 'Koffi Mensah',
        phone: '+225 07 98 76 54 32',
        businessName: 'Maraîchage Koffi - Légumes Sains',
        sector: 'Maraîcher & Agriculture',
        city: 'Bouaké',
        commune: 'Koko',
        employeeCount: 0,
        photoUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400',
        score: 41,
        scoreBreakdown: { economique: 25, gouvernance: 10, bonnesPratiques: 6, total: 41 },
        answers: {
          ledLighting: false,
          plasticReduction: false,
          wasteManagement: true,
          energyEfficientEquipment: false,
          jobCreation: false,
          employsWomen: false,
          separateMoney: 'jamais',
          trackSales: 'parfois'
        } as PracticeAnswers,
        transactions: [
          { id: 't_c3_1', type: 'vente', amount: 15000, date: '2026-06-04', paymentMethod: 'Cash' }
        ] as Transaction[],
        hasDocs: false,
        request: {
          id: 'req_candidate_3',
          amount: 250000,
          purpose: 'Achat de stock',
          status: 'Soumise',
          date: '2026-06-09'
        } as CreditRequest,
        isLiveUser: false
      }
    ];

    return merchantsList;
  }, [activeProfile, activeTransactions, activeAnswers, activeCreditRequests]);

  // Apply filters on dataset
  const filteredCandidates = useMemo(() => {
    return candidatesData.filter((merchant) => {
      const matchCity = selectedCity === 'Tous' || merchant.city === selectedCity;
      const matchSector = selectedSector === 'Tous' || merchant.sector === selectedSector;
      const matchScore = merchant.score >= minScore;
      return matchCity && matchSector && matchScore;
    });
  }, [candidatesData, selectedCity, selectedSector, minScore]);

  // Current viewed merchant details
  const currentViewedMerchant = useMemo(() => {
    return candidatesData.find((m) => m.id === selectedMerchantId) || candidatesData[0];
  }, [candidatesData, selectedMerchantId]);

  // Format currency
  const formatCFAPrice = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num) + ' F CFA';
  };

  return (
    <div className="flex flex-col flex-1 bg-gray-50 select-none overflow-y-auto pb-24 h-full">
      {/* Banker Top Header Banner */}
      <div className="bg-[#1DB954] text-white pt-6 pb-24 px-5 rounded-b-[40px] shadow-sm text-left relative">
        <div className="flex items-center gap-1.5 bg-gray-900/30 text-emerald-100 border border-white/10 rounded-full px-2.5 py-0.5 text-[9px] font-bold w-fit">
          <Landmark className="w-3.5 h-3.5 text-white mr-0.5" />
          <span>ESPACE PRÊTEUR MICROFINANCE</span>
        </div>
        <h2 className="text-xl font-black mt-2">Dossiers CREDIVER</h2>
        <p className="text-xs text-white/80 mt-0.5">Vérifiez les passeports ESG de confiance et débloquez les prêts verts.</p>
      </div>

      <div className="px-5 -mt-16 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* LEFT COLUMN: FILTERS CODE & CANDIDATES LIST */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-150 flex flex-col md:col-span-5 text-left mb-4">
          <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-1.5 border-b border-gray-100 pb-2">
            <Filter className="w-3.5 h-3.5" /> Rechercher & Filtrer ({filteredCandidates.length})
          </h3>

          <div className="flex flex-col gap-3">
            {/* Filter Ville */}
            <div>
              <label className="block text-[10px] font-extrabold text-gray-500 uppercase mb-1 ml-0.5">
                Ville d'origine
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-gray-200 text-xs font-bold bg-gray-50 focus:bg-white text-gray-800"
              >
                <option value="Tous">Tous les réseaux (Côte d'Ivoire)</option>
                {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Filter Secteur */}
            <div>
              <label className="block text-[10px] font-extrabold text-gray-500 uppercase mb-1 ml-0.5">
                Secteur économique
              </label>
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-gray-200 text-xs font-bold bg-gray-50 focus:bg-white text-gray-800"
              >
                <option value="Tous">Tous les secteurs d'activité</option>
                {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Filter Score brackets */}
            <div>
              <label className="block text-[10px] font-extrabold text-[#1DB954] uppercase mb-1 ml-0.5">
                Score Minimum (sur 100) : {minScore} pts
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={minScore}
                onChange={(e) => setMinScore(parseInt(e.target.value))}
                className="w-full accent-[#1DB954] cursor-pointer"
              />
            </div>
          </div>

          {/* List of matching applicants */}
          <div className="mt-5 flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-wide mb-1 select-none">Candidats de la liste :</p>
            
            {filteredCandidates.length === 0 ? (
              <div className="text-center py-6 text-xs text-gray-400">
                Aucun dossier ne correspond à ces critères de recherche.
              </div>
            ) : (
              filteredCandidates.map((merchant) => {
                const isSelected = selectedMerchantId === merchant.id;
                return (
                  <button
                    key={merchant.id}
                    type="button"
                    onClick={() => setSelectedMerchantId(merchant.id)}
                    className={`p-3 rounded-2xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#1DB954] bg-emerald-50/10 shadow-xs'
                        : 'border-gray-150 bg-gray-55 hover:border-gray-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-black text-gray-900 leading-tight truncate max-w-[120px]">{merchant.businessName}</p>
                        {merchant.isLiveUser && (
                          <span className="text-[7px] bg-[#1DB954] text-white px-1.5 py-0.2 rounded font-black uppercase">LIVE (VOUS)</span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{merchant.fullName} • Milan</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <span className="text-[10px] font-black text-gray-750 block">{merchant.score}/100</span>
                        {merchant.request && (
                          <span className="text-[8px] bg-indigo-50 text-indigo-700 px-1 py-0.2 rounded font-extrabold block mt-0.5">
                            {formatCFAPrice(merchant.request.amount)}
                          </span>
                        )}
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: MERCHANDISE APPLICATION CARD EXPLORER */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-150 flex flex-col md:col-span-7 text-left">
          
          {/* Header of Applicant */}
          <div className="flex items-start gap-4 border-b border-gray-100 pb-4 mb-4">
            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
              <img src={currentViewedMerchant.photoUrl} alt="Boutique" className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-1.5">
                <h4 className="text-base font-black text-gray-900 leading-tight truncate">{currentViewedMerchant.businessName}</h4>
              </div>
              <p className="text-xs font-bold text-gray-500">{currentViewedMerchant.fullName} • {currentViewedMerchant.city}, {currentViewedMerchant.commune}</p>
              
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[9px] font-bold text-[#1DB954] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase">
                  {currentViewedMerchant.sector}
                </span>
                <span className="text-[9px] text-gray-400 font-semibold flex items-center gap-1">
                  <Phone className="w-3 h-3" /> {currentViewedMerchant.phone}
                </span>
              </div>
            </div>
          </div>

          {/* Core score & active validation badge representation */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
              <p className="text-[9px] font-bold text-zinc-400 uppercase">Score Global</p>
              <p className="text-[22px] font-black text-[#1DB954] leading-tight mt-1">{currentViewedMerchant.score} / 100</p>
              <span className="text-[9px] text-gray-400 font-bold uppercase">{getScoreLevel(currentViewedMerchant.score)}</span>
            </div>

            <div className="bg-gray-50 p-3 rounded-2xl border border-[#1DB954]/20">
              <p className="text-[9px] font-bold text-indigo-400 uppercase">Solde Ventes Estimé</p>
              <p className="text-xs font-black text-gray-900 leading-tight mt-1 truncate">
                {formatCFAPrice(currentViewedMerchant.transactions.filter(t => t.type === 'vente').reduce((s,t) => s + t.amount, 0))}
              </p>
              <p className="text-[9px] text-gray-400 font-semibold">{currentViewedMerchant.transactions.length} écritures de caisse chargées</p>
            </div>
          </div>

          {/* Section: ESG answers list details */}
          <div className="mb-5">
            <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2.5">Habitudes Écologiques (ESG) déclarées</h5>
            
            <div className="grid grid-cols-2 gap-2 text-[10px] font-extrabold text-gray-700">
              <div className="flex items-center gap-1.5 p-2 bg-gray-50 rounded-xl">
                <span>{currentViewedMerchant.answers.ledLighting ? '🟢' : '❌'}</span>
                <span>Ampoules LED basse conso</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 bg-gray-50 rounded-xl">
                <span>{currentViewedMerchant.answers.plasticReduction ? '🟢' : '❌'}</span>
                <span>Diminution plastique jetable</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 bg-gray-50 rounded-xl">
                <span>{currentViewedMerchant.answers.wasteManagement ? '🟢' : '❌'}</span>
                <span>Poubelles domestiques & tri</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 bg-gray-50 rounded-xl">
                <span>{currentViewedMerchant.answers.energyEfficientEquipment ? '🟢' : '❌'}</span>
                <span>Équipements certifiés éco</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 bg-gray-50 rounded-xl">
                <span>{currentViewedMerchant.answers.jobCreation ? '🟢' : '❌'}</span>
                <span>Favorise l'emploi direct</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 bg-gray-50 rounded-xl">
                <span>{currentViewedMerchant.answers.employsWomen ? '🟢' : '❌'}</span>
                <span>Collaboration active femmes</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 bg-gray-50 rounded-xl col-span-2">
                <span>💼</span>
                <span>Séparation caisses : <span className="text-[#1DB954]">{currentViewedMerchant.answers.separateMoney || 'Non renseigné'}</span></span>
              </div>
            </div>
          </div>

          {/* Section: active loan request analysis */}
          {currentViewedMerchant.request ? (
            <div className="bg-gradient-to-r from-emerald-500/5 to-indigo-500/5 hover:from-emerald-500/10 hover:to-indigo-500/10 rounded-2xl p-4 border border-dashed border-[#1DB954]/20 mb-5 relative">
              <h5 className="text-[10px] font-black text-gray-500 uppercase tracking-wider mb-2">Demande de Prêt Active</h5>
              
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-lg font-black text-gray-900">{formatCFAPrice(currentViewedMerchant.request.amount)}</span>
                <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                  {currentViewedMerchant.request.purpose}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 border-t border-gray-100 pt-2 mt-2">
                <span>Date de dépôt : {currentViewedMerchant.request.date}</span>
                <span>Statut : <span className="text-[#1DB954] font-black">{currentViewedMerchant.request.status}</span></span>
              </div>

              {/* ACTION PANEL (Valider / Rechercher complément / Refuser) */}
              {currentViewedMerchant.request.status === 'Soumise' ? (
                <div className="mt-4 flex flex-col gap-2">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest text-center mb-1">DÉCISION DU CONSEILLER DE COMPTE :</p>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {/* Valider / Approve */}
                    <button
                      onClick={() => onUpdateCreditStatus(currentViewedMerchant.request!.id, 'Approuvée')}
                      className="h-11 bg-[#1DB954] hover:bg-[#159441] text-white rounded-xl font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-all shadow-emerald-50 active:scale-98"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Valider & Libérer</span>
                    </button>

                    {/* Refuse */}
                    <button
                      onClick={() => onUpdateCreditStatus(currentViewedMerchant.request!.id, 'Refusée')}
                      className="h-11 bg-white hover:bg-red-50 text-red-500 border-2 border-red-100 hover:border-red-300 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-98"
                    >
                      <X className="w-4 h-4" />
                      <span>Refuser le Prêt</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-4 p-3 bg-gray-50 rounded-xl text-center text-xs font-bold text-gray-500 border border-gray-200">
                  Le statut de cette demande de prêt est : <span className="text-[#1DB954] font-black">{currentViewedMerchant.request.status}</span>. Décision irréversible localement.
                </div>
              )}
            </div>
          ) : (
            <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-4 flex items-start gap-2.5 mb-5 text-amber-900 leading-snug">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-extrabold text-amber-800">Aucun dossier déposé auprès du guichet</p>
                <p className="font-semibold text-gray-600 mt-0.5">Le commerçant n'a pas encore initié de demande active depuis son interface "Crédit".</p>
              </div>
            </div>
          )}

          {/* Section: attached documents simulation indicator list */}
          <div>
            <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Preuves de validation physique attachées</h5>
            
            <div className="flex flex-col gap-1.5 max-h-[140px] overflow-y-auto pr-1">
              <div className="p-2.5 rounded-xl border border-gray-150 flex items-center justify-between bg-gray-55 text-xs text-gray-700">
                <div className="flex items-center gap-2">
                  <span className="text-[#1DB954]">✓</span>
                  <span className="font-semibold">Photo de devanture de boutique physique</span>
                </div>
                <span className="text-[9px] text-[#1DB954] font-bold">Vérifié physique</span>
              </div>

              <div className="p-2.5 rounded-xl border border-gray-150 flex items-center justify-between bg-gray-55 text-xs text-gray-700">
                <div className="flex items-center gap-2">
                  <span>{currentViewedMerchant.hasDocs ? '🌟' : '⚠️'}</span>
                  <span className="font-bold">Registre de commerce / Attestation Municipale</span>
                </div>
                <span className={`text-[9px] font-bold ${currentViewedMerchant.hasDocs ? 'text-[#1DB954]' : 'text-gray-400'}`}>
                  {currentViewedMerchant.hasDocs ? 'Vérifié officiel' : 'Non joint'}
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

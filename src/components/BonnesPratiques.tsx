/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PracticeAnswers } from '../types';
import { Leaf, Shield, UserCheck, Heart, Camera, Check, AlertCircle, FileCheck, CircleDot } from 'lucide-react';

interface BonnesPratiquesProps {
  answers: PracticeAnswers;
  onUpdateAnswers: (newAnswers: PracticeAnswers) => void;
  proofs: Record<string, boolean>;
  onUpdateProofs: (newProofs: Record<string, boolean>) => void;
}

export function BonnesPratiques({ answers, onUpdateAnswers, proofs, onUpdateProofs }: BonnesPratiquesProps) {
  // Local notification banner for point updates
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const updateBoolAnswer = (key: keyof PracticeAnswers, val: boolean) => {
    const updated = { ...answers, [key]: val };
    onUpdateAnswers(updated);
    triggerCheckAnim(key, val ? "Activé (+3 pts)" : "Retiré");
  };

  const updateSelectAnswer = (key: keyof PracticeAnswers, val: 'toujours' | 'parfois' | 'jamais') => {
    const updated = { ...answers, [key]: val };
    onUpdateAnswers(updated);
    let scoreMsg = "Modifié";
    if (val === 'toujours') scoreMsg = "Excellent (+10 pts)";
    if (val === 'parfois') scoreMsg = "Moyen (+5 pts)";
    triggerCheckAnim(key, scoreMsg);
  };

  const toggleProof = (key: string) => {
    const updated = { ...proofs, [key]: !proofs[key] };
    onUpdateProofs(updated);
    triggerCheckAnim(key, !proofs[key] ? "Justificatif ajouté (+5 pts global)" : "Justificatif supprimé");
  };

  const triggerCheckAnim = (key: string, msg: string) => {
    setLastUpdated(`${msg}`);
    setTimeout(() => {
      setLastUpdated(null);
    }, 2500);
  };

  return (
    <div className="flex flex-col flex-1 bg-gray-50 select-none overflow-y-auto pb-24 h-full">
      {/* Wave-like Green Banner */}
      <div className="bg-[#1DB954] text-white pt-6 pb-8 px-5 rounded-b-[32px] shadow-sm relative">
        <span className="text-[10px] font-bold tracking-widest bg-white/20 uppercase px-2.5 py-0.5 rounded-full">
          Évaluation RSE simplifiée
        </span>
        <h2 className="text-xl font-extrabold mt-1">Mes Bonnes Pratiques</h2>
        <p className="text-xs text-white/80 mt-0.5">Cochez vos habitudes quotidiennes pour montrer votre sérieux financier.</p>

        {/* Dynamic Point Earn Toast Notification */}
        {lastUpdated && (
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gray-900 border border-gray-800 text-[#1DB954] text-[10px] font-black px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 animate-bounce z-10 transition-all">
            <Check className="w-3.5 h-3.5 stroke-[4]" />
            <span>Mise à jour : {lastUpdated}</span>
          </div>
        )}
      </div>

      <div className="px-5 mt-5">
        {/* Simple friendly introduction */}
        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 flex items-start gap-3.5 mb-5 shadow-xs">
          <div className="w-9 h-9 rounded-full bg-[#1DB954] text-white flex items-center justify-center text-lg shrink-0">
            🤝
          </div>
          <div className="text-left text-xs text-emerald-900 leading-normal">
            <p className="font-extrabold">Ici, aucun jargon compliqué !</p>
            <p className="font-medium text-[11px] text-emerald-800/95 mt-0.5">
              Répondez en toute sincérité. Chaque geste positif pour la nature, vos employés, ou vos clients augmente vos chances de décrocher un financement vert bonifié.
            </p>
          </div>
        </div>

        {/* QUESTIONS CONTAINER */}
        <div className="flex flex-col gap-4">
          
          {/* SECTION : NATURE & ENVIRONNEMENT */}
          <div className="border-l-4 border-[#1DB954] pl-2.5 my-1">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-[#1DB954]" /> Nature & Énergie
            </h3>
          </div>

          {/* Q1: LED bulb */}
          <div className="bg-white rounded-3xl p-4 shadow-xs border border-gray-150 flex flex-col gap-3">
            <div className="text-left">
              <p className="text-xs font-black text-gray-900 leading-snug">
                1. Utilisez-vous des ampoules LED (basse consommation) dans votre local ?
              </p>
              <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Permet de réduire vos factures d'énergie • +3 points</p>
            </div>
            
            <div className="flex items-center justify-between gap-3 pt-1">
              <div className="flex gap-2 w-2/3">
                <button
                  type="button"
                  onClick={() => updateBoolAnswer('ledLighting', true)}
                  className={`flex-1 h-10 rounded-xl font-bold text-xs border-2 transition-all cursor-pointer ${
                    answers.ledLighting === true
                      ? 'bg-emerald-50 border-[#1DB954] text-emerald-850'
                      : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  🟢 Oui
                </button>
                <button
                  type="button"
                  onClick={() => updateBoolAnswer('ledLighting', false)}
                  className={`flex-1 h-10 rounded-xl font-bold text-xs border-2 transition-all cursor-pointer ${
                    answers.ledLighting === false
                      ? 'bg-red-50/50 border-red-300 text-red-800'
                      : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  Non
                </button>
              </div>

              {/* Upload Proof simulator */}
              <button
                type="button"
                onClick={() => toggleProof('ledProof')}
                className={`w-1/3 h-10 rounded-xl border flex items-center justify-center gap-1 text-[10px] font-bold transition-all cursor-pointer ${
                  proofs.ledProof
                    ? 'bg-emerald-100 border-[#1DB954] text-[#1DB954]'
                    : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{proofs.ledProof ? 'Preuve ✓' : 'Preuve'}</span>
              </button>
            </div>
          </div>

          {/* Q2: sachets plastique */}
          <div className="bg-white rounded-3xl p-4 shadow-xs border border-gray-150 flex flex-col gap-3">
            <div className="text-left">
              <p className="text-xs font-black text-gray-900 leading-snug">
                2. Essayez-vous de réduire l'utilisation de sachets plastiques jetables ?
              </p>
              <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Utiliser du kraft, papiers recyclés, etc. • +3 points</p>
            </div>
            
            <div className="flex items-center justify-between gap-3 pt-1">
              <div className="flex gap-2 w-2/3">
                <button
                  type="button"
                  onClick={() => updateBoolAnswer('plasticReduction', true)}
                  className={`flex-1 h-10 rounded-xl font-bold text-xs border-2 transition-all cursor-pointer ${
                    answers.plasticReduction === true
                      ? 'bg-emerald-50 border-[#1DB954] text-emerald-850'
                      : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  🟢 Oui
                </button>
                <button
                  type="button"
                  onClick={() => updateBoolAnswer('plasticReduction', false)}
                  className={`flex-1 h-10 rounded-xl font-bold text-xs border-2 transition-all cursor-pointer ${
                    answers.plasticReduction === false
                      ? 'bg-red-50/50 border-red-300 text-red-800'
                      : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  Non
                </button>
              </div>

              <button
                type="button"
                onClick={() => toggleProof('plasticProof')}
                className={`w-1/3 h-10 rounded-xl border flex items-center justify-center gap-1 text-[10px] font-bold transition-all cursor-pointer ${
                  proofs.plasticProof
                    ? 'bg-emerald-100 border-[#1DB954] text-[#1DB954]'
                    : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{proofs.plasticProof ? 'Preuve ✓' : 'Preuve'}</span>
              </button>
            </div>
          </div>

          {/* Q3: Trash bins / sorting */}
          <div className="bg-white rounded-3xl p-4 shadow-xs border border-gray-150 flex flex-col gap-3">
            <div className="text-left">
              <p className="text-xs font-black text-gray-900 leading-snug">
                3. Disposez-vous d'une poubelle propre ou d'un système de gestion de tri de vos déchets ?
              </p>
              <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Éviter d'abandonner les ordures sur la chaussée • +3 points</p>
            </div>
            
            <div className="flex items-center justify-between gap-3 pt-1">
              <div className="flex gap-2 w-2/3">
                <button
                  type="button"
                  onClick={() => updateBoolAnswer('wasteManagement', true)}
                  className={`flex-1 h-10 rounded-xl font-bold text-xs border-2 transition-all cursor-pointer ${
                    answers.wasteManagement === true
                      ? 'bg-emerald-50 border-[#1DB954] text-emerald-850'
                      : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  🟢 Oui
                </button>
                <button
                  type="button"
                  onClick={() => updateBoolAnswer('wasteManagement', false)}
                  className={`flex-1 h-10 rounded-xl font-bold text-xs border-2 transition-all cursor-pointer ${
                    answers.wasteManagement === false
                      ? 'bg-red-50/50 border-red-300 text-red-800'
                      : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  Non
                </button>
              </div>

              <button
                type="button"
                onClick={() => toggleProof('wasteProof')}
                className={`w-1/3 h-10 rounded-xl border flex items-center justify-center gap-1 text-[10px] font-bold transition-all cursor-pointer ${
                  proofs.wasteProof
                    ? 'bg-emerald-100 border-[#1DB954] text-[#1DB954]'
                    : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{proofs.wasteProof ? 'Preuve ✓' : 'Preuve'}</span>
              </button>
            </div>
          </div>

          {/* Q4: Energy-saver assets */}
          <div className="bg-white rounded-3xl p-4 shadow-xs border border-gray-150 flex flex-col gap-3">
            <div className="text-left">
              <p className="text-xs font-black text-gray-900 leading-snug">
                4. Utilisez-vous des climatiseurs, frigos ou équipements certifiés "économes en énergie" (A+++) ?
              </p>
              <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Matériel moderne consommant moins d'ampères • +3 points</p>
            </div>
            
            <div className="flex items-center justify-between gap-3 pt-1">
              <div className="flex gap-2 w-2/3">
                <button
                  type="button"
                  onClick={() => updateBoolAnswer('energyEfficientEquipment', true)}
                  className={`flex-1 h-10 rounded-xl font-bold text-xs border-2 transition-all cursor-pointer ${
                    answers.energyEfficientEquipment === true
                      ? 'bg-emerald-50 border-[#1DB954] text-emerald-850'
                      : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  🟢 Oui
                </button>
                <button
                  type="button"
                  onClick={() => updateBoolAnswer('energyEfficientEquipment', false)}
                  className={`flex-1 h-10 rounded-xl font-bold text-xs border-2 transition-all cursor-pointer ${
                    answers.energyEfficientEquipment === false
                      ? 'bg-red-50/50 border-red-300 text-red-800'
                      : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  Non
                </button>
              </div>

              <button
                type="button"
                onClick={() => toggleProof('energyProof')}
                className={`w-1/3 h-10 rounded-xl border flex items-center justify-center gap-1 text-[10px] font-bold transition-all cursor-pointer ${
                  proofs.energyProof
                    ? 'bg-emerald-100 border-[#1DB954] text-[#1DB954]'
                    : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{proofs.energyProof ? 'Preuve ✓' : 'Preuve'}</span>
              </button>
            </div>
          </div>

          {/* SECTION: ÉQUITÉ SOCIALE & TRAVAIL */}
          <div className="border-l-4 border-teal-500 pl-2.5 mt-4 my-1">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-teal-600" /> Humain & Emplois
            </h3>
          </div>

          {/* Q5: Job creation */}
          <div className="bg-white rounded-3xl p-4 shadow-xs border border-gray-150 flex flex-col gap-3">
            <div className="text-left">
              <p className="text-xs font-black text-gray-900 leading-snug">
                5. Employez-vous au moins une personne (apprenti, vendeur, livreur) ?
              </p>
              <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Soutenons l'insertion professionnelle et l'intégration locale • +4 points</p>
            </div>
            
            <div className="flex items-center justify-between gap-3 pt-1">
              <div className="flex gap-2 w-2/3">
                <button
                  type="button"
                  onClick={() => updateBoolAnswer('jobCreation', true)}
                  className={`flex-1 h-10 rounded-xl font-bold text-xs border-2 transition-all cursor-pointer ${
                    answers.jobCreation === true
                      ? 'bg-emerald-50 border-[#1DB954] text-emerald-850'
                      : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  🟢 Oui
                </button>
                <button
                  type="button"
                  onClick={() => updateBoolAnswer('jobCreation', false)}
                  className={`flex-1 h-10 rounded-xl font-bold text-xs border-2 transition-all cursor-pointer ${
                    answers.jobCreation === false
                      ? 'bg-red-50/50 border-red-300 text-red-800'
                      : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  Non
                </button>
              </div>

              <button
                type="button"
                onClick={() => toggleProof('jobProof')}
                className={`w-1/3 h-10 rounded-xl border flex items-center justify-center gap-1 text-[10px] font-bold transition-all cursor-pointer ${
                  proofs.jobProof
                    ? 'bg-emerald-100 border-[#1DB954] text-[#1DB954]'
                    : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{proofs.jobProof ? 'Preuve ✓' : 'Preuve'}</span>
              </button>
            </div>
          </div>

          {/* Q6: Employs women */}
          <div className="bg-white rounded-3xl p-4 shadow-xs border border-gray-150 flex flex-col gap-3">
            <div className="text-left">
              <p className="text-xs font-black text-gray-900 leading-snug">
                6. Travaillez-vous avec des femmes ou employez-vous des femmes à des rôles clés ?
              </p>
              <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Encourager l'indépendance économique des femmes • +3 points</p>
            </div>
            
            <div className="flex items-center justify-between gap-3 pt-1">
              <div className="flex gap-2 w-2/3">
                <button
                  type="button"
                  onClick={() => updateBoolAnswer('employsWomen', true)}
                  className={`flex-1 h-10 rounded-xl font-bold text-xs border-2 transition-all cursor-pointer ${
                    answers.employsWomen === true
                      ? 'bg-emerald-50 border-[#1DB954] text-emerald-850'
                      : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  🟢 Oui
                </button>
                <button
                  type="button"
                  onClick={() => updateBoolAnswer('employsWomen', false)}
                  className={`flex-1 h-10 rounded-xl font-bold text-xs border-2 transition-all cursor-pointer ${
                    answers.employsWomen === false
                      ? 'bg-red-50/50 border-red-300 text-red-800'
                      : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  Non
                </button>
              </div>

              <button
                type="button"
                onClick={() => toggleProof('womenProof')}
                className={`w-1/3 h-10 rounded-xl border flex items-center justify-center gap-1 text-[10px] font-bold transition-all cursor-pointer ${
                  proofs.womenProof
                    ? 'bg-emerald-100 border-[#1DB954] text-[#1DB954]'
                    : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{proofs.womenProof ? 'Preuve ✓' : 'Preuve'}</span>
              </button>
            </div>
          </div>

          {/* SECTION: GESTION & ÉCONOMIE */}
          <div className="border-l-4 border-indigo-500 pl-2.5 mt-4 my-1">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-indigo-600" /> Gestion & Rigueur
            </h3>
          </div>

          {/* Q7: Separate money */}
          <div className="bg-white rounded-3xl p-4 shadow-xs border border-gray-150 flex flex-col gap-3.5 text-left">
            <div>
              <p className="text-xs font-black text-gray-900 leading-snug">
                7. Séparez-vous l'argent quotidien du commerce de celui de votre foyer ?
              </p>
              <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Le secret pour ne pas piocher dans la caisse commerciale • Jusqu'à +10 points</p>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {(['toujours', 'parfois', 'jamais'] as const).map((opt) => {
                const isSelected = answers.separateMoney === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => updateSelectAnswer('separateMoney', opt)}
                    className={`h-11 rounded-xl text-xs font-extrabold border-2 transition-all capitalize cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 border-[#1DB954] text-emerald-800'
                        : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-55'
                    }`}
                  >
                    {opt === 'toujours' && '⭐ '}
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Q8: Track sales */}
          <div className="bg-white rounded-3xl p-4 shadow-xs border border-gray-150 flex flex-col gap-3.5 text-left mb-6">
            <div>
              <p className="text-xs font-black text-gray-900 leading-snug">
                8. Gardez-vous une trace écrite ou numérique de vos ventes ?
              </p>
              <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Cahier de comptes ou enregistreurs mobiles • Témoigne de votre sérieux</p>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {(['toujours', 'parfois', 'jamais'] as const).map((opt) => {
                const isSelected = answers.trackSales === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => updateSelectAnswer('trackSales', opt)}
                    className={`h-11 rounded-xl text-xs font-extrabold border-2 transition-all capitalize cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 border-[#1DB954] text-emerald-800'
                        : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-55'
                    }`}
                  >
                    {opt === 'toujours' && '⭐ '}
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

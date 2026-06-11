/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserProfile, ScoreBreakdown } from '../types';
import { getScoreLevel, getCreditEligibility } from '../data';
import { QRCodeSVG } from './QRCodeSVG';
import { ShieldCheck, Calendar, RotateCcw, Share2, Printer, Check, Copy } from 'lucide-react';

interface PasseportESGProps {
  profile: UserProfile;
  scoreBreakdown: ScoreBreakdown;
  onResetAllData?: () => void;
}

export function PasseportESG({ profile, scoreBreakdown, onResetAllData }: PasseportESGProps) {
  const [shared, setShared] = useState(false);
  const [copied, setCopied] = useState(false);

  const score = scoreBreakdown.total;
  const level = getScoreLevel(score);
  const eligibility = getCreditEligibility(score);

  // Dynamic emission date (current date)
  const todayStr = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Unique validation hash based on business profile
  const validationCode = `CREDIVER-${profile.businessName.substring(0,3).toUpperCase()}-${score}-${Math.floor(1000 + Math.random() * 9000)}`;

  // Handle mock share click
  const handleShare = () => {
    setShared(true);
    if (navigator.share) {
      navigator.share({
        title: 'MOn Passeport Crédit CREDIVER',
        text: `Chez CREDIVER, mon commerce "${profile.businessName}" est certifié avec un score de ${score}/100 !`,
        url: window.location.href,
      }).catch(() => {});
    }
    setTimeout(() => setShared(false), 2500);
  };

  // Handle mock copy verification credentials
  const handleCopyCredentials = () => {
    setCopied(true);
    navigator.clipboard.writeText(`Nom : ${profile.fullName}\nBoutique : ${profile.businessName}\nScore : ${score}/100\nNiveau : ${level}\nCode de validation : ${validationCode}`);
    setTimeout(() => setCopied(false), 2500);
  };

  // Beautiful level Badge styling
  const getBadgeVisuals = () => {
    if (score < 40) return { title: 'BRONZE', emoji: '🥉', color: 'text-amber-800', border: 'border-amber-200 bg-amber-50' };
    if (score < 80) return { title: 'ARGENT', emoji: '🥈', color: 'text-gray-700', border: 'border-gray-200 bg-gray-50' };
    return { title: 'OR (Vert)', emoji: '👑', color: 'text-emerald-700', border: 'border-emerald-200 bg-emerald-50' };
  };

  const badgeProps = getBadgeVisuals();

  return (
    <div className="flex flex-col flex-1 bg-gray-50 select-none overflow-y-auto pb-24 h-full">
      
      {/* SCREEN 10 HEADER */}
      <div className="bg-[#1DB954] text-white pt-6 pb-20 px-5 rounded-b-[40px] shadow-sm relative text-center">
        <span className="text-[10px] font-bold tracking-widest bg-white/20 uppercase px-3 py-1 rounded-full">
          Générateur de Certificat
        </span>
        <h2 className="text-xl font-black mt-2">Certificat de Confiance</h2>
        <p className="text-xs text-white/80 mt-1">Votre passeport écologique certifié pour les investissements.</p>
      </div>

      {/* Official printable Passport form layout (Screen 10) */}
      <div className="px-5 -mt-14 relative z-10 print:p-0 print:m-0 print:shadow-none">
        <div className="bg-white rounded-[32px] p-6 shadow-lg border border-gray-150 flex flex-col items-center">
          
          {/* Header banner style inside document */}
          <div className="w-full flex items-center justify-between border-b border-dashed border-gray-200 pb-4 mb-4">
            <div className="text-left">
              <span className="text-xs font-black tracking-normal text-gray-900 block">CREDIVER</span>
              <span className="text-[8px] font-bold text-gray-400 block uppercase">Passeport ESG de Confiance</span>
            </div>
            
            <div className="flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-full px-2 py-0.5 text-[9px] font-black">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1DB954]" />
              <span>OFFICIEL</span>
            </div>
          </div>

          {/* Business identity fields */}
          <div className="text-center mb-4">
            <h3 className="text-lg font-black text-gray-900 select-all leading-tight">
              {profile.businessName || 'Nom de ma boutique'}
            </h3>
            <p className="text-xs text-gray-500 font-bold mt-0.5">{profile.fullName || 'Commerçant'}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{profile.commune}, {profile.city}</p>
          </div>

          {/* Dynamic QR Code */}
          <div className="my-3">
            <QRCodeSVG value={validationCode} size={150} />
          </div>

          <div className="text-center mb-5 text-[10px] font-bold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100 select-all tracking-wider font-mono">
            ID de validation : {validationCode}
          </div>

          {/* Score Summary Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 w-full border-t border-dashed border-gray-200 pt-4 mb-3">
            <div className="bg-gray-50 px-4 py-3 rounded-2xl text-center border border-gray-100">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Score Global</p>
              <p className="text-xl font-black text-[#1DB954] mt-0.5">{score} / 100</p>
            </div>

            <div className={`px-4 py-3 rounded-2xl text-center border ${badgeProps.border}`}>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Médaille Éco</p>
              <p className={`text-sm font-black mt-1 ${badgeProps.color}`}>
                {badgeProps.emoji} {badgeProps.title}
              </p>
            </div>
          </div>

          <div className="w-full text-center text-[10px] text-gray-400 font-semibold mb-2 flex items-center justify-center gap-1">
            <Calendar className="w-3 h-3 text-gray-400" />
            <span>Fait à Abidjan, le {todayStr}</span>
          </div>
          
          <p className="text-[9px] text-zinc-400 font-medium text-center leading-normal max-w-[240px] border-t border-gray-100 pt-3">
            Le QR Code ci-dessus contient l'intégralité chiffrée de vos ventes locales et vos certifications. Les conseillers bancaires peuvent le flasher pour lancer l'étude d'éligibilité.
          </p>

        </div>
      </div>

      {/* Share / Action buttons (Screen 10 continued) */}
      <div className="px-5 mt-5 flex flex-col gap-2.5">
        
        <div className="grid grid-cols-2 gap-3">
          {/* Print certificate Button */}
          <button
            onClick={() => window.print()}
            className="h-12 bg-white text-gray-800 border-2 border-gray-200 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-50 font-bold text-xs transition-all cursor-pointer shadow-sm active:scale-98"
          >
            <Printer className="w-4 h-4 text-gray-400" />
            <span>Imprimer / PDF</span>
          </button>

          {/* Share Button representing popup flow */}
          <button
            onClick={handleShare}
            className="h-12 bg-white text-gray-800 border-2 border-gray-200 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-50 font-bold text-xs transition-all cursor-pointer shadow-sm active:scale-98"
          >
            {shared ? <Check className="w-4 h-4 text-[#1DB954]" /> : <Share2 className="w-4 h-4 text-gray-400" />}
            <span>{shared ? 'Partagé !' : 'Partager'}</span>
          </button>
        </div>

        {/* Copy credentials button */}
        <button
          onClick={handleCopyCredentials}
          className="h-12 bg-[#1DB954] text-white hover:bg-[#159441] rounded-2xl flex items-center justify-center gap-2 font-black text-xs transition-all cursor-pointer shadow-sm active:scale-98"
        >
          {copied ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4 text-emerald-100" />}
          <span>{copied ? 'Informations Copiées !' : 'Copier mes caractéristiques'}</span>
        </button>

        {/* Danger Zone: Reset simulated local storage state */}
        {onResetAllData && (
          <button
            type="button"
            onClick={() => {
              if (confirm("Voulez-vous réinitialiser toutes les données de l'application ? (Cette action réinitialisera votre commerce, vos ventes et vos réponses)")) {
                onResetAllData();
              }
            }}
            className="h-9 text-[10px] text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer mt-5 transition-all text-center self-center px-4 font-bold border border-red-200 border-dashed"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Réinitialiser mes données</span>
          </button>
        )}
      </div>

    </div>
  );
}

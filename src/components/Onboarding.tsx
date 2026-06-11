/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UserRole } from '../types';
import { Sparkles, ArrowRight, ShieldCheck, TrendingUp } from 'lucide-react';

interface OnboardingProps {
  onSelectRole: (role: UserRole) => void;
  illustrationUrl: string;
}

export function Onboarding({ onSelectRole, illustrationUrl }: OnboardingProps) {
  return (
    <div className="flex flex-col flex-1 bg-white select-none">
      {/* Wave-inspired Header */}
      <div className="pt-8 pb-4 px-6 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-9 h-9 rounded-full bg-[#1DB954] flex items-center justify-center shadow-xs">
            {/* Elegant leaf icon */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="white" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M3 12h18M12 3c4.97 0 9 4.03 9 9V3M12 21c-4.97 0-9-4.03-9-9v9" />
            </svg>
          </div>
          <span className="text-2xl font-display font-bold tracking-tight text-gray-900">CREDIVER</span>
        </div>
        <p className="text-[10px] font-bold tracking-wider text-[#1DB954] uppercase bg-emerald-50/70 px-3 py-0.5 rounded-full border border-emerald-100">
          Passeport ESG de Confiance
        </p>
      </div>

      {/* Main Content & Illustration */}
      <div className="flex-1 flex flex-col justify-center items-center px-6">
        <div className="relative w-60 h-60 mb-6 rounded-[28px] overflow-hidden bg-slate-50 border border-slate-100 shadow-xs flex items-center justify-center">
          <img
            src={illustrationUrl}
            alt="Commerçante Africaine CREDIVER"
            className="w-full h-full object-cover object-top"
            referrerPolicy="no-referrer"
          />
          {/* Wave Badge */}
          <div className="absolute bottom-3 right-3 bg-[#1DB954]/95 backdrop-blur-xs text-white text-[9px] font-bold py-1 px-3 rounded-full shadow-xs flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            100% Sécurisé & Off-line
          </div>
        </div>

        <h1 className="text-2xl font-display font-bold text-center text-gray-900 leading-tight mb-2">
          Faites grandir votre activité
        </h1>
        
        <p className="text-xs text-center text-gray-550 leading-relaxed max-w-xs px-2 mb-4">
          Montrez votre sérieux et accédez plus facilement au financement sans paperasse compliquée.
        </p>

        <p className="text-[11px] text-center font-medium text-emerald-800 bg-emerald-55/60 px-3.5 py-2.5 rounded-2xl border border-emerald-100/80">
          🌱 <span className="font-bold">Astuce :</span> Vos bonnes pratiques écologiques et sociales valent de l'or !
        </p>
      </div>

      {/* Action Buttons Section */}
      <div className="p-6 bg-slate-55/50 rounded-t-[28px] border-t border-slate-100 flex flex-col gap-3">
        <p className="text-[10px] font-bold text-center text-gray-400 uppercase tracking-widest mb-1">
          Veuillez choisir votre profil :
        </p>
        
        {/* Commerçant Button (Primary) */}
        <button
          onClick={() => onSelectRole('merchant')}
          id="btn_onboard_merchant"
          className="w-full h-13 bg-[#1DB954] hover:bg-[#159441] text-white rounded-xl flex items-center justify-between px-6 font-bold text-[15px] shadow-xs transition-all active:scale-98 cursor-pointer group"
        >
          <span className="flex items-center gap-2.5">
            🏪 Je suis commerçant
          </span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Institution Financière Button */}
        <button
          onClick={() => onSelectRole('banker')}
          id="btn_onboard_banker"
          className="w-full h-13 bg-white hover:bg-slate-50 text-gray-800 border border-slate-200 rounded-xl flex items-center justify-between px-6 font-bold text-[15px] shadow-xs transition-all active:scale-98 cursor-pointer"
        >
          <span className="flex items-center gap-2.5">
            🏦 Je suis une microfinance / banque
          </span>
          <ArrowRight className="w-4 h-4 text-gray-400" />
        </button>

        <p className="text-[10px] text-center text-gray-400 mt-1 font-medium">
          Simple • Gratuit • Passeport certifié instantané
        </p>
      </div>
    </div>
  );
}

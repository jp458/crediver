/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserProfile, Transaction, PracticeAnswers, ScoreBreakdown } from '../types';
import { getScoreLevel, getCreditEligibility, RECOMMENDATIONS, Recommendation } from '../data';
import { Award, ChevronRight, Sparkles, TrendingUp, HelpCircle, CheckCircle, Info, ArrowRight, ShieldCheck } from 'lucide-react';

interface MonScoreProps {
  profile: UserProfile;
  transactions: Transaction[];
  answers: PracticeAnswers;
  scoreBreakdown: ScoreBreakdown;
  onNavigateToTab: (index: number) => void;
}

export function MonScore({ profile, transactions, answers, scoreBreakdown, onNavigateToTab }: MonScoreProps) {
  const [activeRecId, setActiveRecId] = useState<string | null>(null);

  const score = scoreBreakdown.total;
  const level = getScoreLevel(score);
  const eligibility = getCreditEligibility(score);

  // Math for SVG Circular Progress
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Format currency
  const formatCFAPrice = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num) + ' F CFA';
  };

  // Color selection based on rating
  const getRatingColor = (sc: number) => {
    if (sc < 40) return '#F97316'; // orange
    if (sc < 60) return '#EAB308'; // yellow
    return '#1DB954'; // green
  };

  const getRatingBg = (sc: number) => {
    if (sc < 40) return 'bg-orange-50 text-orange-700 border-orange-200';
    if (sc < 60) return 'bg-yellow-50 text-yellow-800 border-yellow-200';
    return 'bg-emerald-50 text-emerald-800 border-emerald-200';
  };

  return (
    <div className="flex flex-col flex-1 bg-gray-50 select-none overflow-y-auto pb-24 h-full">
      
      {/* SCREEN 8: MON SCORE HEADER SECTION */}
      <div className="bg-[#1DB954] text-white pt-6 pb-20 px-5 rounded-b-[40px] shadow-sm relative text-center">
        <span className="text-[10px] font-bold tracking-widest bg-white/20 uppercase px-3 py-1 rounded-full">
          Mon Diagnostic Financier
        </span>
        <h2 className="text-xl font-black mt-2">Mon Passeport de Confiance</h2>
        <p className="text-xs text-white/80 mt-1">Évaluation en temps réel de votre éligibilité au financement.</p>
      </div>

      {/* Overlapping Dial Card */}
      <div className="px-5 -mt-14 relative z-10">
        <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-150 flex flex-col items-center">
          
          {/* Animated SVG Circle Circle Gauge */}
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              {/* Outer track */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-gray-100"
                strokeWidth="10"
                fill="transparent"
              />
              {/* Filled track */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke={getRatingColor(score)}
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            
            {/* Inner text score display */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-gray-900 leading-none">{score}</span>
              <span className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-wider">sur 100</span>
            </div>
          </div>

          {/* Level Badge */}
          <div className={`mt-3 px-5 py-2 rounded-2xl text-xs font-black border-2 flex items-center gap-2 ${getRatingBg(score)}`}>
            <span>🏆</span>
            <span>Niveau : {level}</span>
          </div>

          <p className="text-[11px] text-gray-500 font-semibold text-center mt-3 leading-relaxed px-4">
            {score >= 60 
              ? "Félicitations ! Votre sérieux est prouvé. Vos relevés d'activités et vos actions vous qualifient pour une demande de prêt."
              : "Continuez d'adopter des bonnes pratiques et d'enregistrer vos ventes pour franchir le palier et devenir Éligible !"
            }
          </p>
        </div>
      </div>

      {/* Score details breakdown box (Economic, Governance, Eco-practices) */}
      <div className="px-5 mt-5">
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4 text-left">
            Détail de mon score
          </h3>

          <div className="flex flex-col gap-4">
            {/* Activité Économique (50 points) */}
            <div>
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-xs font-extrabold text-gray-700 flex items-center gap-1.5">
                  🏪 Activité Commerciale
                </span>
                <span className="text-xs font-black text-gray-900">{scoreBreakdown.economique} / 50 points</span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                  style={{ width: `${(scoreBreakdown.economique / 50) * 100}%` }}
                />
              </div>
              <p className="text-[9px] text-gray-400 font-semibold text-left mt-1">Ventes et dépenses quotidiennes régulières</p>
            </div>

            {/* Gouvernance (25 points) */}
            <div>
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-xs font-extrabold text-gray-700 flex items-center gap-1.5">
                  🛡️ Rigueur de Gestion (Gouvernance)
                </span>
                <span className="text-xs font-black text-gray-900">{scoreBreakdown.gouvernance} / 25 points</span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
                  style={{ width: `${(scoreBreakdown.gouvernance / 25) * 100}%` }}
                />
              </div>
              <p className="text-[9px] text-gray-400 font-semibold text-left mt-1">Séparation de caisses et documents enregistrés</p>
            </div>

            {/* Bonnes Pratiques (25 points) */}
            <div>
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-xs font-extrabold text-gray-700 flex items-center gap-1.5">
                  🌱 Mes Gestes Verts & Social
                </span>
                <span className="text-xs font-black text-gray-900">{scoreBreakdown.bonnesPratiques} / 25 points</span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-500 rounded-full transition-all duration-500" 
                  style={{ width: `${(scoreBreakdown.bonnesPratiques / 25) * 100}%` }}
                />
              </div>
              <p className="text-[9px] text-gray-400 font-semibold text-left mt-1">LED, réduction de sachets, aides aux femmes</p>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================================== */}
      {/* SCREEN 9: COMMENT AMÉLIORER MON SCORE */}
      <div className="px-5 mt-6">
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-[#1DB954]" /> Comment augmenter mon score ?
          </h3>
          <span className="text-[9px] text-[#1DB954] font-black bg-emerald-50 px-2 py-0.5 rounded-full">
            Conseils personnalisés
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {RECOMMENDATIONS.map((rec) => {
            const completed = rec.isCompleted(profile, transactions, answers);
            const isExpanded = activeRecId === rec.id;

            return (
              <div
                key={rec.id}
                className={`rounded-3xl border text-left transition-all overflow-hidden bg-white ${
                  completed
                    ? 'border-emerald-100 bg-emerald-50/10'
                    : isExpanded
                    ? 'border-gray-300 ring-1 ring-gray-200'
                    : 'border-gray-150 hover:border-gray-200'
                }`}
              >
                {/* Header card area click trigger */}
                <button
                  type="button"
                  onClick={() => setActiveRecId(isExpanded ? null : rec.id)}
                  className="w-full p-4 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
                      completed ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {completed ? '✓' : '💡'}
                    </div>

                    <div className="text-left pr-3">
                      <p className={`text-xs font-black ${completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                        {rec.title}
                      </p>
                      
                      <p className="text-[10px] text-gray-500 font-bold mt-0.5">
                        {completed ? (
                          <span className="text-[#1DB954]">Félicitations ! +{rec.points} points acquis</span>
                        ) : (
                          <span className="text-orange-600">Gagnez +{rec.points} points de score</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <ChevronRight className={`w-4 invert-0 text-gray-400 shrink-0 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </button>

                {/* Expanded Card Details (Explainable Scores: WHY and HOW) */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-gray-100 bg-gray-50/60 text-xs">
                    
                    {/* Why Section */}
                    <div className="mb-2.5">
                      <p className="font-extrabold text-gray-700 flex items-center gap-1.5 mb-1 text-[10px] uppercase tracking-wider">
                        <Info className="w-3.5 h-3.5 text-gray-400" /> Pourquoi c'est important ?
                      </p>
                      <p className="text-gray-600 text-[11px] leading-relaxed pl-5 font-semibold">
                        {rec.why}
                      </p>
                    </div>

                    {/* How Section */}
                    <div className="mb-3">
                      <p className="font-extrabold text-[#1DB954] flex items-center gap-1.5 mb-1 text-[10px] uppercase tracking-wider">
                        <Award className="w-3.5 h-3.5" /> Comment accomplir ?
                      </p>
                      <p className="text-gray-600 text-[11px] leading-relaxed pl-5 font-bold">
                        {rec.how}
                      </p>
                    </div>

                    {/* Quick navigation shortcut button to target screen */}
                    {!completed && (
                      <button
                        type="button"
                        onClick={() => {
                          if (rec.category === 'Activités') {
                            onNavigateToTab(0); // activity tab
                          } else if (rec.category === 'Gouvernance' && rec.id === 'rec_docs') {
                            onNavigateToTab(4); // profile tab
                          } else {
                            onNavigateToTab(1); // buenas practices tab
                          }
                        }}
                        className="w-full h-9 bg-white hover:bg-gray-100 text-gray-900 border border-gray-200 rounded-xl text-[11px] font-black flex items-center justify-center gap-2 cursor-pointer transition-all"
                      >
                        <span>Compléter cette action</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#1DB954]" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

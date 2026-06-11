/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserProfile, Transaction, PracticeAnswers, CreditRequest, UserRole } from './types';
import { Onboarding } from './components/Onboarding';
import { SignupAndProfile } from './components/SignupAndProfile';
import { MonActivite } from './components/MonActivite';
import { BonnesPratiques } from './components/BonnesPratiques';
import { MonScore } from './components/MonScore';
import { Credit } from './components/Credit';
import { PasseportESG } from './components/PasseportESG';
import { EspaceBanque } from './components/EspaceBanque';
import { calculateScore, DEFAULT_PROFILE, DEFAULT_TRANSACTIONS, DEFAULT_PRACTICE_ANSWERS } from './data';
import { 
  BarChart3, 
  Leaf, 
  Award, 
  Landmark, 
  User, 
  Smartphone, 
  Monitor, 
  Wifi, 
  Battery, 
  ArrowRight,
  ShieldAlert,
  RotateCcw,
  Volume2,
  VolumeX
} from 'lucide-react';

const COACH_SCRIPTS = {
  fr: {
    onboarding: "Bienvenue sur CREDIVER ! Je suis votre coach Aminata. Je vous aide à obtenir des financements grâce à votre comportement propre et écologique. Touchez le bouton vert pour commencer !",
    signup_profile: "Inscrivons votre commerce ! Écrivez votre nom complet et votre numéro de téléphone. Pas d'inquiétude, c’est très sécurisé !",
    tab_0: "Sur cette page, notez vos ventes et vos dépenses de chaque jour. Regardez, vous pouvez cliquer directement sur des billets de banque ou pièces de monnaie pour ajouter les montants facilement !",
    tab_1: "Ici c'est la liste de vos bonnes pratiques écologiques. Ampoules basse consommation ? Gestion propre des déchets ? Séparez-vous l'argent du foyer ? Cochez simplement Oui ou Non !",
    tab_2: "Félicitations, voici votre score de confiance de Crediver ! Plus vous avez de points verts, plus vous obtiendrez vos crédits facilement et au meilleur prix !",
    tab_3: "C'est l'espace crédit ! Ici, demandez un prêt pour acheter du matériel et faire grandir votre commerce, par exemple un tricycle de transport électrique !",
    tab_4: "Voici votre précieux Passeport Crediver ! Montrez simplement ce code QR au banquier lors de votre rendez-vous pour qu'il examine votre dossier sans paperasse !"
  },
  nouchi: {
    onboarding: "C'est propre ! Je suis la Coach Aminata. Crediver va te donner la force avec les banques pour doubler ton business ! Appuie sur le gros bouton vert !",
    signup_profile: "On va blinder ton profil rapidement ! Mets ton nom et ton numéro de portable ici. C'est sécurisé propre-propre !",
    tab_0: "Ici là, c'est ton cahier de jetons ! Mets tes ventes et tes dépenses. Pour ne pas te fatiguer à écrire, appuie carrément sur les images de billets et de pièces de monnaie !",
    tab_1: "C'est la page du comportement propre pour le business ! Ampoules de lumières LED, trier les ordures, séparer les finances ? Appuie sur Oui ou Non !",
    tab_2: "Voici tes étoiles de Grotto ! Plus tes points brillent en vert, plus les banques vont t'épauler rapidement !",
    tab_3: "Tu cherches gbalman pour caler ton commerce ? Demande ton prêt ici pour acheter ton tricycle à petit intérêt !",
    tab_4: "Voici ton sésame Crediver ! Fais scanner ton QR Code fissa au banquier, pas de paperasse ni palabre !"
  }
};

export default function App() {
  // Mobile frame simulator / Fullscreen view options
  const [useMobileView, setUseMobileView] = useState(true);

  // User flow states: 'onboarding' | 'signup_profile' | 'app'
  const [flowState, setFlowState] = useState<'onboarding' | 'signup_profile' | 'app'>('onboarding');

  // Active Bottom Tab (0 to 4)
  const [activeTab, setActiveTab] = useState(0);

  // Core business variables
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [transactions, setTransactions] = useState<Transaction[]>(DEFAULT_TRANSACTIONS);
  const [answers, setAnswers] = useState<PracticeAnswers>(DEFAULT_PRACTICE_ANSWERS);
  const [proofs, setProofs] = useState<Record<string, boolean>>({
    ledProof: true,
    plasticProof: false,
    wasteProof: true,
    energyProof: false,
    jobProof: true,
    womenProof: true,
  });
  const [creditRequests, setCreditRequests] = useState<CreditRequest[]>([
    {
      id: 'req_initial',
      amount: 750000,
      purpose: 'Tricycle électrique',
      status: 'Analyse', // Default starting request
      date: '2026-06-10'
    }
  ]);

  // Current logged in simulation role
  const [currentRole, setCurrentRole] = useState<UserRole>('merchant');

  // Real-time dynamic clock state
  const [currentTime, setCurrentTime] = useState('');

  // Vocal Assistant states (low-literacy accessibility helpers)
  const [assistanceActive, setAssistanceActive] = useState<boolean>(true);
  const [assistanceLang, setAssistanceLang] = useState<'fr' | 'nouchi'>('fr');

  // Core Speech Synthesis Utility
  const playVocalGuide = (textToSpeak: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.82; // Slower rate for clear oral understanding
      
      const voices = window.speechSynthesis.getVoices();
      const frenchVoice = voices.find(v => v.lang.startsWith('fr') && v.name.toLowerCase().includes('female'));
      if (frenchVoice) {
        utterance.voice = frenchVoice;
      }
      window.speechSynthesis.speak(utterance);
    }
  };

  // 1. Initial State Load from local storage (Offline First)
  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem('crediver_profile');
      const storedTxs = localStorage.getItem('crediver_transactions');
      const storedAnswers = localStorage.getItem('crediver_answers');
      const storedProofs = localStorage.getItem('crediver_proofs');
      const storedRequests = localStorage.getItem('crediver_requests');
      const storedFlow = localStorage.getItem('crediver_flow');
      const storedRole = localStorage.getItem('crediver_role');
      const storedVoiceActive = localStorage.getItem('crediver_voice_active');
      const storedVoiceLang = localStorage.getItem('crediver_voice_lang');

      if (storedProfile) setProfile(JSON.parse(storedProfile));
      if (storedTxs) setTransactions(JSON.parse(storedTxs));
      if (storedAnswers) setAnswers(JSON.parse(storedAnswers));
      if (storedProofs) setProofs(JSON.parse(storedProofs));
      if (storedRequests) setCreditRequests(JSON.parse(storedRequests));
      if (storedFlow) setFlowState(storedFlow as any);
      if (storedRole) setCurrentRole(storedRole as UserRole);
      
      if (storedVoiceActive !== null) {
        setAssistanceActive(storedVoiceActive === 'true');
      }
      if (storedVoiceLang !== null) {
        setAssistanceLang(storedVoiceLang as 'fr' | 'nouchi');
      }
    } catch (e) {
      console.warn("Could not read from localStorage: ", e);
    }

    // Dynamic Clock ticking every second
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
    };
    updateClock();
    const timer = setInterval(updateClock, 60000);
    return () => clearInterval(timer);
  }, []);

  // Vocal Assistant auto-speaking effect when screen or tab changes
  useEffect(() => {
    if (!assistanceActive || currentRole === 'banker') {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    let text = "";
    if (flowState === 'onboarding') {
      text = COACH_SCRIPTS[assistanceLang].onboarding;
    } else if (flowState === 'signup_profile') {
      text = COACH_SCRIPTS[assistanceLang].signup_profile;
    } else if (flowState === 'app') {
      if (activeTab === 0) text = COACH_SCRIPTS[assistanceLang].tab_0;
      else if (activeTab === 1) text = COACH_SCRIPTS[assistanceLang].tab_1;
      else if (activeTab === 2) text = COACH_SCRIPTS[assistanceLang].tab_2;
      else if (activeTab === 3) text = COACH_SCRIPTS[assistanceLang].tab_3;
      else if (activeTab === 4) text = COACH_SCRIPTS[assistanceLang].tab_4;
    }

    if (text) {
      const triggerTimeout = setTimeout(() => {
        playVocalGuide(text);
      }, 700);
      return () => clearTimeout(triggerTimeout);
    }
  }, [flowState, activeTab, assistanceActive, assistanceLang, currentRole]);

  // Persists speech settings
  const handleToggleVoice = (active: boolean) => {
    setAssistanceActive(active);
    localStorage.setItem('crediver_voice_active', String(active));
    if (!active && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const handleToggleVoiceLang = (lang: 'fr' | 'nouchi') => {
    setAssistanceLang(lang);
    localStorage.setItem('crediver_voice_lang', lang);
  };

  // 2. Persist State Changes on modification
  const saveStateToLocalStorage = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn("Could not write to localStorage: ", e);
    }
  };

  const updateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    saveStateToLocalStorage('crediver_profile', newProfile);
  };

  const handleCompleteSetup = (completedProfile: UserProfile) => {
    updateProfile(completedProfile);
    setFlowState('app');
    localStorage.setItem('crediver_flow', 'app');
  };

  const handleAddTransaction = (newTx: Transaction) => {
    const updated = [newTx, ...transactions];
    setTransactions(updated);
    saveStateToLocalStorage('crediver_transactions', updated);
  };

  const handleDeleteTransaction = (id: string) => {
    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);
    saveStateToLocalStorage('crediver_transactions', updated);
  };

  const handleUpdateAnswers = (newAnswers: PracticeAnswers) => {
    setAnswers(newAnswers);
    saveStateToLocalStorage('crediver_answers', newAnswers);
  };

  const handleUpdateProofs = (newProofs: Record<string, boolean>) => {
    setProofs(newProofs);
    saveStateToLocalStorage('crediver_proofs', newProofs);
  };

  const handleAddCreditRequest = (newRequest: CreditRequest) => {
    const updated = [newRequest, ...creditRequests];
    setCreditRequests(updated);
    saveStateToLocalStorage('crediver_requests', updated);
  };

  // Direct response controller from Banker (updates merchant's state instantly)
  const handleUpdateCreditStatusInPlace = (requestId: string, status: CreditRequest['status']) => {
    const updated = creditRequests.map((req) => 
      req.id === requestId ? { ...req, status } : req
    );
    setCreditRequests(updated);
    saveStateToLocalStorage('crediver_requests', updated);
  };

  // Reset entire simulation to factory settings
  const handleResetAllData = () => {
    localStorage.removeItem('crediver_profile');
    localStorage.removeItem('crediver_transactions');
    localStorage.removeItem('crediver_answers');
    localStorage.removeItem('crediver_proofs');
    localStorage.removeItem('crediver_requests');
    localStorage.removeItem('crediver_flow');
    localStorage.removeItem('crediver_role');

    // Reset clean initial states
    setProfile(DEFAULT_PROFILE);
    setTransactions(DEFAULT_TRANSACTIONS);
    setAnswers(DEFAULT_PRACTICE_ANSWERS);
    setProofs({
      ledProof: true,
      plasticProof: false,
      wasteProof: true,
      energyProof: false,
      jobProof: true,
      womenProof: true,
    });
    setCreditRequests([]);
    setFlowState('onboarding');
    setActiveTab(0);
    setCurrentRole('merchant');
  };

  // Calculate dynamic score based on live updated state variables
  const scoreBreakdown = calculateScore(profile, transactions, answers);

  // Selected illustration url generated from raw asset designer
  const onboardingIllustration = "/src/assets/images/onboarding_entrepreneur_1781195448591.jpg";

  // Render Coach Aminata Vocal Support UI widget (highly accessible for low-literacy users)
  const renderCoachWidget = () => {
    if (currentRole === 'banker') return null; // Only for merchants
    
    let speechBubble = "";
    if (flowState === 'onboarding') speechBubble = COACH_SCRIPTS[assistanceLang].onboarding;
    else if (flowState === 'signup_profile') speechBubble = COACH_SCRIPTS[assistanceLang].signup_profile;
    else {
      if (activeTab === 0) speechBubble = COACH_SCRIPTS[assistanceLang].tab_0;
      else if (activeTab === 1) speechBubble = COACH_SCRIPTS[assistanceLang].tab_1;
      else if (activeTab === 2) speechBubble = COACH_SCRIPTS[assistanceLang].tab_2;
      else if (activeTab === 3) speechBubble = COACH_SCRIPTS[assistanceLang].tab_3;
      else if (activeTab === 4) speechBubble = COACH_SCRIPTS[assistanceLang].tab_4;
    }

    const shortBubble = speechBubble.length > 80 ? speechBubble.substring(0, 77) + "..." : speechBubble;

    return (
      <div className="bg-emerald-950 p-2.5 px-4 text-white border-b border-emerald-900 flex items-center justify-between gap-3 shrink-0 select-none shadow-sm animate-fade-in print:hidden">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <button 
            type="button"
            onClick={() => playVocalGuide(speechBubble)}
            className="relative focus:outline-none transition-all duration-300 hover:scale-105 active:scale-95 group focus:ring-2 focus:ring-[#1DB954] rounded-full"
            title="S'il vous plaît, cliquez ici pour m'entendre à haute voix"
          >
            <img 
              src="/src/assets/images/coach_aminata_1781196671671.jpg" 
              alt="Coach Aminata" 
              className="w-10 h-10 rounded-full object-cover border-2 border-[#1DB954] shadow-xs shrink-0" 
              referrerPolicy="no-referrer"
            />
            {assistanceActive && (
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-0.5 border border-emerald-950 animate-pulse">
                <Volume2 className="w-2.5 h-2.5 text-white" />
              </span>
            )}
          </button>
          
          <div className="text-left flex-1 min-w-0">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-[10px] font-black uppercase text-[#1DB954] tracking-wider">COACH AMINATA</span>
              <span className="text-[8px] font-bold bg-[#1DB954]/20 border border-emerald-500/30 text-emerald-400 px-1 py-0.2 rounded">HAUT-PARLEUR ACTIVÉ 🔊</span>
            </div>
            {/* Click bubble to speak */}
            <p 
              onClick={() => playVocalGuide(speechBubble)}
              className="text-[10.5px] font-medium text-emerald-100 mt-0.5 leading-tight line-clamp-1 cursor-pointer hover:text-white transition-colors"
              title="Toucher pour écouter Aminata à haute voix"
            >
              « {shortBubble} »
            </p>
          </div>
        </div>

        {/* Buttons to tune help settings */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Toggle speech on/off */}
          <button
            type="button"
            onClick={() => handleToggleVoice(!assistanceActive)}
            className={`p-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center ${
              assistanceActive ? 'bg-[#1DB954] text-white shadow-xs' : 'bg-emerald-900/60 border border-emerald-800 text-emerald-450'
            }`}
            title={assistanceActive ? "Désactiver la voix" : "Activer l'aide vocale"}
          >
            {assistanceActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Toggle language: Simple French vs Nouchi */}
          <button
            type="button"
            onClick={() => handleToggleVoiceLang(assistanceLang === 'fr' ? 'nouchi' : 'fr')}
            className="px-2 py-1.5 rounded-lg bg-emerald-900 border border-emerald-800 text-[10px] font-extrabold flex items-center gap-1 cursor-pointer transition-colors text-emerald-300 hover:bg-emerald-850"
            title="Changer de langue parlée"
          >
            <span>🇨🇮</span>
            <span className="text-[9px] uppercase tracking-wider">{assistanceLang === 'fr' ? 'Français' : 'Nouchi'}</span>
          </button>
        </div>
      </div>
    );
  };

  // Render current inside content
  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <MonActivite
            transactions={transactions}
            onAddTransaction={handleAddTransaction}
            onDeleteTransaction={handleDeleteTransaction}
          />
        );
      case 1:
        return (
          <BonnesPratiques
            answers={answers}
            onUpdateAnswers={handleUpdateAnswers}
            proofs={proofs}
            onUpdateProofs={handleUpdateProofs}
          />
        );
      case 2:
        return (
          <MonScore
            profile={profile}
            transactions={transactions}
            answers={answers}
            scoreBreakdown={scoreBreakdown}
            onNavigateToTab={(idx) => setActiveTab(idx)}
          />
        );
      case 3:
        return (
          <Credit
            profile={profile}
            transactions={transactions}
            scoreBreakdown={scoreBreakdown}
            creditRequests={creditRequests}
            onAddCreditRequest={handleAddCreditRequest}
            onNavigateToTab={(idx) => setActiveTab(idx)}
          />
        );
      case 4:
        return (
          <PasseportESG
            profile={profile}
            scoreBreakdown={scoreBreakdown}
            onResetAllData={handleResetAllData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col items-center justify-center py-6 px-4 md:px-8 font-sans text-slate-800 print:bg-white print:p-0">
      
      {/* APP HEADER DESKTOP CONTROL UTILITIES - HIDDEN ON PRINT */}
      <div className="w-full max-w-5xl mb-6 flex flex-col md:flex-row items-center justify-between gap-4 select-none print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-display font-bold text-slate-900 tracking-tight">CREDIVER</h1>
            <span className="text-[10px] font-bold text-center text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Passeport ESG de Confiance
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            🌱 Financez la croissance des PME africaines grâce aux bonnes pratiques écologiques.
          </p>
        </div>

        {/* Top bar controls */}
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs">
          
          {/* Layout presentation mode toggler */}
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl">
            <button
              onClick={() => setUseMobileView(true)}
              className={`p-2 rounded-lg flex items-center gap-1.5 text-xs font-bold cursor-pointer transition-all ${
                useMobileView ? 'bg-[#1DB954] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Vue Mobile"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Simulateur</span>
            </button>
            <button
              onClick={() => setUseMobileView(false)}
              className={`p-2 rounded-lg flex items-center gap-1.5 text-xs font-bold cursor-pointer transition-all ${
                !useMobileView ? 'bg-[#1DB954] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Vue Plein Écran"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Plein Écran</span>
            </button>
          </div>

          <div className="h-4 w-px bg-slate-200" />

          {/* Quick Dual Role simulation Switcher */}
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl">
            {/* Merchant */}
            <button
              onClick={() => {
                setCurrentRole('merchant');
                localStorage.setItem('crediver_role', 'merchant');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentRole === 'merchant'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              🏪 Commerçant
            </button>
            
            {/* Banker */}
            <button
              onClick={() => {
                setCurrentRole('banker');
                localStorage.setItem('crediver_role', 'banker');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentRole === 'banker'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              🏦 Banquier
            </button>
          </div>

        </div>
      </div>

      {/* RENDER CHASSIS CASE OR CONTAINER DEPENDING ON LAYOUT PREFERENCE */}
      <div 
        className={`print:p-0 print:shadow-none print:w-full select-none transition-all duration-300 ${
          useMobileView 
            ? 'w-[400px] h-[820px] rounded-[54px] bg-slate-950 p-3.5 border border-slate-900 shadow-2xl relative flex flex-col justify-between items-stretch outline-[12px] outline-slate-900 outline-offset-0 ring-1 ring-slate-800'
            : 'w-full max-w-5xl min-h-[750px] bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 flex flex-col'
        }`}
      >
        {/* VIRTUAL MOBILE STATUS BAR HEADER - Rendered only in Phone Frame simulator */}
        {useMobileView && (
          <div className="h-8 px-8 flex justify-between items-center text-[10px] text-white font-bold select-none bg-slate-950 rounded-t-[38px] z-20 shrink-0">
            {/* Live active clock */}
            <span>{currentTime || '09:30'}</span>
            
            {/* Center phone notch */}
            <div className="w-24 h-4 bg-slate-950 rounded-b-xl absolute top-1.5 left-1/2 -translate-x-1/2 flex items-center justify-center border-l border-r border-b border-slate-800/60">
              <div className="w-12 h-0.5 bg-slate-900 rounded-full mb-1" />
              <div className="w-1.5 h-1.5 bg-slate-900 rounded-full ml-1.5 mb-1" />
            </div>

            {/* Statuses bar icons */}
            <div className="flex items-center gap-1">
              <span className="mr-0.5 text-[8px] opacity-90">CREDIVER</span>
              <Wifi className="w-3 h-3 stroke-[2.5]" />
              <Battery className="w-3.5 h-3.5 fill-white" />
            </div>
          </div>
        )}

        {/* CONTAINER WORK MODULES CANVAS */}
        <div className="flex-1 bg-white overflow-hidden flex flex-col relative print:p-0 rounded-2xl">
          
          {/* IF BANQUER MODE ACTIVE: OVERRIDE EVERYTHING FOR BANQUER VIEW */}
          {currentRole === 'banker' ? (
            <EspaceBanque
              activeProfile={profile}
              activeTransactions={transactions}
              activeAnswers={answers}
              activeCreditRequests={creditRequests}
              onUpdateCreditStatus={handleUpdateCreditStatusInPlace}
            />
          ) : (
            /* MERCHANT PROFILE FLOW */
            <>
              {renderCoachWidget()}
              {flowState === 'onboarding' && (
                <Onboarding
                  onSelectRole={(role) => {
                    if (role === 'banker') {
                      setCurrentRole('banker');
                      localStorage.setItem('crediver_role', 'banker');
                    } else {
                      setFlowState('signup_profile');
                    }
                  }}
                  illustrationUrl={onboardingIllustration}
                />
              )}

              {flowState === 'signup_profile' && (
                <SignupAndProfile
                  onComplete={handleCompleteSetup}
                  initialProfile={profile}
                />
              )}

              {flowState === 'app' && (
                <div className="flex-1 flex flex-col h-full bg-white relative">
                  
                  {/* WORK CANVAS AREA */}
                  <div className="flex-1 overflow-hidden relative pb-[64px]">
                    {renderTabContent()}
                  </div>

                  {/* 5-PANEL TAB NAVIGATION BAR */}
                  <div id="bottom_nav" className="absolute bottom-0 inset-x-0 h-16 bg-white border-t border-slate-100 flex items-center justify-around z-20 shadow-xs px-2 select-none shrink-0 print:hidden">
                    
                    {/* Tab 1: Mon Activité */}
                    <button
                      onClick={() => setActiveTab(0)}
                      className={`flex flex-col items-center justify-center w-14 pb-0.5 cursor-pointer rounded-xl transition-all ${
                        activeTab === 0 ? 'text-[#1DB954] font-bold' : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <BarChart3 className="w-4.5 h-4.5 stroke-[2.5]" />
                      <span className="text-[9px] mt-1 font-semibold leading-none truncate">Activité</span>
                    </button>

                    {/* Tab 2: Bonnes Pratiques */}
                    <button
                      onClick={() => setActiveTab(1)}
                      className={`flex flex-col items-center justify-center w-14 pb-0.5 cursor-pointer rounded-xl transition-all ${
                        activeTab === 1 ? 'text-[#1DB954] font-bold' : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <Leaf className="w-4.5 h-4.5 stroke-[2.5]" />
                      <span className="text-[9px] mt-1 font-semibold leading-none truncate">Pratiques</span>
                    </button>

                    {/* Tab 3: Mon Score */}
                    <button
                      onClick={() => setActiveTab(2)}
                      className={`flex flex-col items-center justify-center w-14 pb-0.5 cursor-pointer rounded-xl transition-all ${
                        activeTab === 2 ? 'text-[#1DB954] font-bold' : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <Award className="w-4.5 h-4.5 stroke-[2.5]" />
                      <span className="text-[9px] mt-1 font-semibold leading-none truncate">Score</span>
                    </button>

                    {/* Tab 4: Crédit */}
                    <button
                      onClick={() => setActiveTab(3)}
                      className={`flex flex-col items-center justify-center w-14 pb-0.5 cursor-pointer rounded-xl transition-all ${
                        activeTab === 3 ? 'text-[#1DB954] font-bold' : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <Landmark className="w-4.5 h-4.5 stroke-[2.5]" />
                      <span className="text-[9px] mt-1 font-semibold leading-none truncate font-semibold">Crédit</span>
                    </button>

                    {/* Tab 5: Mon Profil/Passeport */}
                    <button
                      onClick={() => setActiveTab(4)}
                      className={`flex flex-col items-center justify-center w-14 pb-0.5 cursor-pointer rounded-xl transition-all ${
                        activeTab === 4 ? 'text-[#1DB954] font-bold' : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <User className="w-4.5 h-4.5 stroke-[2.5]" />
                      <span className="text-[9px] mt-1 font-semibold leading-none truncate font-semibold">Passeport</span>
                    </button>

                  </div>

                </div>
              )}
            </>
          )}

        </div>

        {/* LOWER HOME GESTURE BAR - Rendered only in Phone Frame simulator */}
        {useMobileView && (
          <div className="h-6 flex justify-center items-center bg-slate-950 rounded-b-[38px] shrink-0 z-20">
            <div className="w-32 h-1 bg-slate-800 rounded-full mb-1" />
          </div>
        )}
      </div>

    </div>
  );
}

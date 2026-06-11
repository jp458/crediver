/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { SECTORS, CITIES, COMMUNES } from '../data';
import { ShieldCheck, Eye, EyeOff, Check, AlertCircle, Camera, CheckSquare, Smartphone } from 'lucide-react';

interface SignupAndProfileProps {
  onComplete: (profile: UserProfile) => void;
  initialProfile: UserProfile;
}

export function SignupAndProfile({ onComplete, initialProfile }: SignupAndProfileProps) {
  // Navigation states: 'signup' -> 'otp' -> 'profile'
  const [step, setStep] = useState<'signup' | 'otp' | 'profile'>('signup');

  // Screen 2: Sign up inputs
  const [fullName, setFullName] = useState(initialProfile.fullName);
  const [phone, setPhone] = useState(initialProfile.phone);
  const [password, setPassword] = useState('MyPassword123');
  const [confirmPassword, setConfirmPassword] = useState('MyPassword123');
  const [showPassword, setShowPassword] = useState(false);
  const [signupError, setSignupError] = useState('');

  // OTP inputs
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp] = useState('2253'); // preset simple mock OTP
  const [otpError, setOtpError] = useState('');

  // Screen 3: Profile setup inputs
  const [businessName, setBusinessName] = useState(initialProfile.businessName);
  const [sector, setSector] = useState(initialProfile.sector || SECTORS[0]);
  const [city, setCity] = useState(initialProfile.city || CITIES[0]);
  const [commune, setCommune] = useState(initialProfile.commune || '');
  const [employeeCount, setEmployeeCount] = useState<number>(initialProfile.employeeCount || 0);
  const [hasDocs, setHasDocs] = useState(initialProfile.hasBusinessDocs);
  const [selectedPhotoPreset, setSelectedPhotoPreset] = useState<string>('étall_fruits'); // mock photo selection

  // Update communes when city changes
  useEffect(() => {
    const list = COMMUNES[city] || [];
    if (list.length > 0 && !list.includes(commune)) {
      setCommune(list[0]);
    }
  }, [city]);

  // Handle signup submission
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');

    if (!fullName.trim()) {
      setSignupError('Veuillez entrer votre nom complet.');
      return;
    }
    if (!phone.trim()) {
      setSignupError('Veuillez entrer votre numéro de téléphone.');
      return;
    }
    if (password !== confirmPassword) {
      setSignupError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (password.length < 4) {
      setSignupError('Le mot de passe doit faire au moins 4 caractères.');
      return;
    }

    // Go to OTP simulation
    setStep('otp');
  };

  // Handle OTP confirmation
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode === generatedOtp || otpCode === '1234') {
      setStep('profile');
    } else {
      setOtpError('Code incorrect. Astuce : utilisez le code ' + generatedOtp);
    }
  };

  // Preset boutique photos
  const BOUTIQUE_PHOTOS = [
    { id: 'étall_fruits', label: "Étal de marché", url: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400" },
    { id: 'salon_coiffure', label: "Atelier/Salon", url: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&q=80&w=400" },
    { id: 'boutique_alimentation', label: "Alimentation générale", url: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&q=80&w=400" }
  ];

  // Save full profile and proceed
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) {
      alert('Veuillez entrer le nom de votre commerce');
      return;
    }

    const completedProfile: UserProfile = {
      fullName,
      phone,
      isRegistered: true,
      businessName,
      sector,
      city,
      commune,
      employeeCount: Number(employeeCount),
      photoUrl: BOUTIQUE_PHOTOS.find(p => p.id === selectedPhotoPreset)?.url || '',
      hasBusinessDocs: hasDocs
    };

    onComplete(completedProfile);
  };

  return (
    <div className="flex flex-col flex-1 bg-white px-6 py-6 select-none justify-between">
      
      {/* SCREEN 2: SIGN UP */}
      {step === 'signup' && (
        <form onSubmit={handleSignup} className="flex flex-col flex-1 justify-between">
          <div>
            <div className="mb-6">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-full">
                Créer mon compte
              </span>
              <h2 className="text-2xl font-black text-gray-900 mt-2">
                Inscrivez votre commerce
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Entrez vos coordonnées pour commencer à calculer votre Passeport ESG de confiance.
              </p>
            </div>

            {signupError && (
              <div className="mb-4 p-3 bg-orange-50 text-orange-850 rounded-2xl flex items-start gap-2 border border-orange-200">
                <AlertCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <span className="text-xs font-semibold">{signupError}</span>
              </div>
            )}

            <div className="flex flex-col gap-4">
              {/* Nom complet */}
              <div>
                <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-1.5 ml-1">
                  Nom Complet
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ex : Awa Koné"
                  className="w-full h-12 px-4 rounded-xl border border-gray-200 text-sm font-semibold bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1DB954] text-gray-800"
                  required
                />
              </div>

              {/* Téléphone */}
              <div>
                <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-1.5 ml-1">
                  Numéro de Téléphone
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-sm font-bold text-gray-400">📞</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ex : +225 07 00 00 00 00"
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 text-sm font-semibold bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1DB954] text-gray-800"
                    required
                  />
                </div>
              </div>

              {/* Mot de passe */}
              <div>
                <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-1.5 ml-1">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 text-sm font-semibold bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1DB954] tracking-wider text-gray-800"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-[#1DB954]"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirmer Mot de passe */}
              <div>
                <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-1.5 ml-1">
                  Confirmer le mot de passe
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-gray-200 text-sm font-semibold bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1DB954] tracking-wider text-gray-800"
                  required
                />
              </div>
            </div>

            <div className="mt-5 p-3.5 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#1DB954] shrink-0 mt-0.5" />
              <p className="text-[11px] text-emerald-800 leading-relaxed font-medium">
                Conformément aux normes régionales, vos données restent cryptées dans votre appareil et ne sont transmises aux banques qu'avec votre accord par QR Code.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              id="btn_submit_signup"
              className="w-full h-14 bg-[#1DB954] hover:bg-[#159441] text-white rounded-2xl font-black text-center text-base cursor-pointer shadow-sm active:scale-98 transition-all"
            >
              Créer mon compte
            </button>
            <p className="text-[11px] text-center text-gray-400 mt-2.5">
              Déjà inscrit ? Connectez-vous en un clic
            </p>
          </div>
        </form>
      )}

      {/* SCREEN 2 (PART 2): OTP VERIFICATION */}
      {step === 'otp' && (
        <form onSubmit={handleVerifyOtp} className="flex flex-col flex-1 justify-between">
          <div>
            <div className="mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#1DB954] flex items-center justify-center mb-4 shadow-sm">
                <Smartphone className="w-6 h-6 animate-pulse" />
              </div>
              <span className="text-xs font-bold text-[#1DB954] uppercase tracking-wider">
                Sécurité SMS
              </span>
              <h2 className="text-2xl font-black text-gray-900 mt-1">
                Vérification du numéro
              </h2>
              <p className="text-xs text-gray-500 mt-2">
                Nous avons envoyé un SMS contenant un code de confirmation à 4 chiffres à <span className="font-bold text-gray-800">{phone}</span>.
              </p>
            </div>

            {/* Simulating code arrival */}
            <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-4 mb-5 flex items-start gap-3">
              <span className="text-xl">📩</span>
              <div className="text-xs">
                <p className="font-bold text-amber-800 mb-0.5">Notification instantanée (Simulation) :</p>
                <p className="font-semibold text-gray-700">« CREDIVER : Votre code de confirmation est : <span className="text-[#1DB954] font-black text-sm select-all tracking-wider">{generatedOtp}</span> »</p>
              </div>
            </div>

            {otpError && (
              <div className="mb-4 p-3 bg-orange-50 text-orange-850 rounded-2xl flex items-start gap-2 border border-orange-200">
                <AlertCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <span className="text-xs font-semibold">{otpError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2 text-center">
                Saisir le Code de validation
              </label>
              <input
                type="text"
                maxLength={4}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="0 0 0 0"
                className="w-full max-w-[200px] h-14 mx-auto text-center font-black text-2xl tracking-[12px] rounded-2xl border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-[#1DB954] focus:outline-none text-gray-800 block"
                required
              />
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              id="btn_submit_otp"
              className="w-full h-14 bg-[#1DB954] hover:bg-[#159441] text-white rounded-2xl font-black text-center text-base cursor-pointer shadow-sm active:scale-98 transition-all"
            >
              Vérifier le Code
            </button>
            <button
              type="button"
              onClick={() => {
                setOtpCode(generatedOtp);
                setOtpError('');
              }}
              className="w-full text-center text-xs text-[#1DB954] font-bold mt-4 hover:underline"
            >
              Renvoyer le SMS de confirmation
            </button>
          </div>
        </form>
      )}

      {/* SCREEN 3: PROFILE SETUP (MON COMMERCE) */}
      {step === 'profile' && (
        <form onSubmit={handleSaveProfile} className="flex flex-col flex-1 justify-between">
          <div className="max-h-[74vh] overflow-y-auto pr-1">
            <div className="mb-5">
              <span className="text-xs font-bold text-[#1DB954] uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-full">
                Étape 3 : Mon commerce
              </span>
              <h2 className="text-2xl font-black text-gray-900 mt-2">
                Faisons connaissance
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Présentez votre activité pour évaluer vos conditions initiales d'éligibilité.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {/* Nom du commerce */}
              <div>
                <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-1.5 ml-1">
                  Nom du Commerce
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Ex : Chez Awa - Épices Fin"
                  className="w-full h-12 px-4 rounded-xl border border-gray-200 text-sm font-semibold bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1DB954] text-gray-800"
                  required
                />
              </div>

              {/* Secteur d'activité */}
              <div>
                <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-1.5 ml-1">
                  Secteur d'Activité
                </label>
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-gray-200 text-sm font-semibold bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1DB954] text-gray-800 cursor-pointer"
                >
                  {SECTORS.map((sec) => (
                    <option key={sec} value={sec}>{sec}</option>
                  ))}
                </select>
              </div>

              {/* Ville et Commune */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-1.5 ml-1">
                    Ville
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 text-sm font-semibold bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1DB954] text-gray-800 cursor-pointer"
                  >
                    {CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-1.5 ml-1">
                    Commune
                  </label>
                  <select
                    value={commune}
                    onChange={(e) => setCommune(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 text-sm font-semibold bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1DB954] text-gray-800 cursor-pointer"
                  >
                    {(COMMUNES[city] || []).map((com) => (
                      <option key={com} value={com}>{com}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Nombre d'employés */}
              <div>
                <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-1.5 ml-1">
                  Nombre d'Employés
                </label>
                <input
                  type="number"
                  min={0}
                  value={employeeCount}
                  onChange={(e) => setEmployeeCount(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full h-12 px-4 rounded-xl border border-gray-200 text-sm font-semibold bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1DB954] text-gray-800"
                  required
                />
              </div>

              {/* Photo du commerce Selector (Preset Simulator) */}
              <div>
                <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2 ml-1">
                  Photo illustrative de votre commerce
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {BOUTIQUE_PHOTOS.map((bp) => (
                    <button
                      type="button"
                      key={bp.id}
                      onClick={() => setSelectedPhotoPreset(bp.id)}
                      className={`relative rounded-xl overflow-hidden aspect-video border-2 transition-all p-0.5 cursor-pointer ${
                        selectedPhotoPreset === bp.id ? 'border-[#1DB954] ring-2 ring-emerald-100' : 'border-gray-200 opacity-60'
                      }`}
                    >
                      <img src={bp.url} alt={bp.label} className="w-full h-full object-cover rounded-lg" referrerPolicy="no-referrer" />
                      <div className="absolute inset-x-0 bottom-0 bg-black/60 text-[8px] text-white text-center py-0.5 font-bold truncate">
                        {bp.label}
                      </div>
                      {selectedPhotoPreset === bp.id && (
                        <span className="absolute top-1 right-1 w-3 h-3 bg-[#1DB954] text-white flex items-center justify-center rounded-full text-[6px]">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Document Checkbox (+5 Governance points) */}
              <div
                onClick={() => setHasDocs(!hasDocs)}
                className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 mt-1.5 ${
                  hasDocs ? 'bg-emerald-50/50 border-[#1DB954]' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className={`w-5 h-5 rounded flex items-center justify-center border-2 ${hasDocs ? 'border-[#1DB954] bg-[#1DB954] text-white' : 'border-gray-300 bg-white'}`}>
                  {hasDocs && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <div className="text-left">
                  <p className="text-xs font-extrabold text-gray-900 leading-tight">Registre de commerce / document d'activité</p>
                  <p className="text-[10px] text-gray-500">Cochez si vous avez une carte d'entreprenant ou attestation municipale (+5 pts)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              id="btn_submit_profile"
              className="w-full h-14 bg-[#1DB954] hover:bg-[#159441] text-white rounded-2xl font-black text-center text-base cursor-pointer shadow-sm active:scale-98 transition-all"
            >
              Créer mon Passeport
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Transaction, PaymentMethod, ExpenseCategory } from '../types';
import { PlusCircle, ArrowUpRight, ArrowDownRight, CircleDollarSign, Calendar, Wallet, Check, Trash2, X, AlertCircle } from 'lucide-react';

interface MonActiviteProps {
  transactions: Transaction[];
  onAddTransaction: (newTx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

export function MonActivite({ transactions, onAddTransaction, onDeleteTransaction }: MonActiviteProps) {
  // Modal states: 'none' | 'vente' | 'depense'
  const [modalType, setModalType] = useState<'none' | 'vente' | 'depense'>('none');

  // Addition Form states
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [expenseCategory, setExpenseCategory] = useState<ExpenseCategory>('Stock');
  const [formError, setFormError] = useState('');

  // West African XOF Banknotes configurations for low-literacy tactile summation
  const BANKNOTES = [
    { value: 10000, color: 'bg-purple-100 hover:bg-purple-200 border-purple-300 text-purple-700', label: '10.000 F', type: 'Billet Violet' },
    { value: 5000, color: 'bg-emerald-100 hover:bg-emerald-200 border-emerald-300 text-emerald-800', label: '5.000 F', type: 'Billet Vert' },
    { value: 2000, color: 'bg-blue-100 hover:bg-blue-200 border-blue-300 text-blue-700', label: '2.000 F', type: 'Billet Bleu' },
    { value: 1000, color: 'bg-amber-100 hover:bg-amber-150 border-amber-300 text-amber-800', label: '1.000 F', type: 'Billet Marron' },
    { value: 500, color: 'bg-orange-105 hover:bg-orange-200 border-orange-300 text-orange-850', label: '500 F', type: 'Pièce Or' }
  ];

  const handleBanknoteTap = (val: number) => {
    const prev = parseFloat(amount) || 0;
    setAmount(String(prev + val));
  };

  const handleClearAmount = () => {
    setAmount('');
  };

  // Calculate current month's summaries
  const totalSales = transactions
    .filter((t) => t.type === 'vente')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'depense')
    .reduce((sum, t) => sum + t.amount, 0);

  const estimatedBenefit = totalSales - totalExpenses;

  // Format currency in F CFA (XOF)
  const formatCFAPrice = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num) + ' F CFA';
  };

  // Submit action for Vente
  const handleAddVenteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const val = parseFloat(amount);
    if (!amount || isNaN(val) || val <= 0) {
      setFormError('Saisissez un montant valide.');
      return;
    }

    const newTx: Transaction = {
      id: 'tx_' + Date.now(),
      type: 'vente',
      amount: val,
      paymentMethod,
      date,
    };

    onAddTransaction(newTx);
    setAmount('');
    setModalType('none');
  };

  // Submit action for Dépense
  const handleAddDepenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const val = parseFloat(amount);
    if (!amount || isNaN(val) || val <= 0) {
      setFormError('Saisissez un montant de dépense valide.');
      return;
    }

    const newTx: Transaction = {
      id: 'tx_' + Date.now(),
      type: 'depense',
      amount: val,
      category: expenseCategory,
      date,
    };

    onAddTransaction(newTx);
    setAmount('');
    setModalType('none');
  };

  // Quick amount selections
  const QUICK_AMOUNTS = [1000, 5000, 10000, 25000];

  return (
    <div className="flex flex-col flex-1 bg-gray-50 h-full select-none overflow-y-auto pb-24">
      {/* Header Banner */}
      <div className="bg-[#1DB954] text-white pt-6 pb-8 px-5 rounded-b-[32px] shadow-sm">
        <span className="text-[10px] font-bold tracking-widest bg-white/20 uppercase px-2.5 py-0.5 rounded-full">
          Suivi Commercial
        </span>
        <h2 className="text-xl font-extrabold mt-1">Mon Activité</h2>
        <p className="text-xs text-white/80 mt-0.5">Enregistrez vos revenus au jour le jour pour prouver votre solidité.</p>
        
        {/* Coach tip */}
        <div className="mt-4 p-3 rounded-2xl bg-white/10 border border-white/10 flex items-center gap-2.5">
          <span className="text-lg">💡</span>
          <p className="text-[11px] leading-tight font-medium">
            <span className="font-bold text-white">Conseil du Coach :</span> Plus vous ajoutez vos ventes régulières, plus votre score financier grimpe !
          </p>
        </div>
      </div>

      {/* Monthly Stats Cards Grid - Positioned slightly overlapping the banner */}
      <div className="px-5 -mt-5 flex flex-col gap-3">
        {/* Estimated Benefit Card (Large) */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-150 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-6 -mt-6" />
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Bénéfice Restant estimé</p>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-2xl font-black ${estimatedBenefit >= 0 ? 'text-gray-900' : 'text-orange-500'}`}>
              {formatCFAPrice(estimatedBenefit)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-gray-400 font-medium">
            <CircleDollarSign className="w-3.5 h-3.5 text-gray-400" />
            <span>Basé sur vos rapports enregistrés locaux</span>
          </div>
        </div>

        {/* Sales & Expenses smaller cards columns */}
        <div className="grid grid-cols-2 gap-3">
          {/* Sales Card */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-150">
            <div className="flex items-center gap-1.5 text-[#1DB954] mb-1">
              <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider">Ventes</span>
            </div>
            <p className="text-base font-black text-gray-900 truncate">{formatCFAPrice(totalSales)}</p>
            <p className="text-[9px] text-zinc-400 mt-0.5">Ce mois-ci</p>
          </div>

          {/* Expenses Card */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-150">
            <div className="flex items-center gap-1.5 text-orange-500 mb-1">
              <div className="w-6 h-6 rounded-lg bg-orange-100 flex items-center justify-center">
                <ArrowDownRight className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600">Dépenses</span>
            </div>
            <p className="text-base font-black text-gray-900 truncate">{formatCFAPrice(totalExpenses)}</p>
            <p className="text-[9px] text-zinc-400 mt-0.5">Ce mois-ci</p>
          </div>
        </div>
      </div>

      {/* Instant Action Big Tactile Buttons */}
      <div className="grid grid-cols-2 gap-3 px-5 mt-5">
        <button
          onClick={() => { setAmount(''); setModalType('vente'); }}
          id="btn_add_vente_action"
          className="h-16 rounded-2xl bg-[#1DB954] text-white flex items-center justify-center gap-3.5 hover:bg-[#159441] font-black text-sm shadow-sm transition-all active:scale-98 cursor-pointer"
        >
          <PlusCircle className="w-5 h-5 shrink-0" />
          <span>Ajouter une Vente</span>
        </button>

        <button
          onClick={() => { setAmount(''); setModalType('depense'); }}
          id="btn_add_depense_action"
          className="h-16 rounded-2xl bg-white text-gray-800 border-2 border-gray-200 flex items-center justify-center gap-3.5 hover:bg-gray-100 font-extrabold text-sm transition-all active:scale-98 cursor-pointer"
        >
          <PlusCircle className="w-5 h-5 text-gray-400 shrink-0" />
          <span>Ajouter Dépense</span>
        </button>
      </div>

      {/* Recent Transactions List (Screen 4 continued) */}
      <div className="px-5 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-black text-gray-600 uppercase tracking-widest">
            Mes Dernières Écritures ({transactions.length})
          </h3>
          <span className="text-[10px] text-gray-400 font-semibold bg-gray-200 px-2.5 py-0.5 rounded-full">
            Hors-ligne local
          </span>
        </div>

        {transactions.length === 0 ? (
          <div className="bg-white border border-gray-150 rounded-2xl p-6 text-center shadow-xs">
            <span className="text-3xl block mb-2">📋</span>
            <p className="text-xs font-bold text-gray-800">Aucune transaction ce mois-ci</p>
            <p className="text-[10px] text-gray-400 mt-1 max-w-[200px] mx-auto">
              Touchez un bouton vert ci-dessus pour enregistrer votre toute première vente !
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {transactions.map((tx) => {
              const isVente = tx.type === 'vente';
              return (
                <div
                  key={tx.id}
                  className="bg-white rounded-2xl p-3.5 shadow-xs border border-gray-100 flex items-center justify-between hover:border-gray-300 transition-all group"
                >
                  <div className="flex items-center gap-3.5">
                    {/* Method or Category Icon Display */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                      isVente ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                    }`}>
                      {isVente ? tx.paymentMethod?.split(' ')[0][0] || 'V' : tx.category?.substring(0, 2) || 'D'}
                    </div>

                    <div className="text-left">
                      <p className="text-xs font-black text-gray-800">
                        {isVente ? `Vente (${tx.paymentMethod})` : `Dépense : ${tx.category}`}
                      </p>
                      <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-medium">
                        <Calendar className="w-3 h-3" />
                        <span>{tx.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <p className={`text-xs font-black select-all ${isVente ? 'text-[#1DB954]' : 'text-gray-900'}`}>
                      {isVente ? '+' : '-'} {formatCFAPrice(tx.amount)}
                    </p>
                    {/* Trash Delete button */}
                    <button
                      onClick={() => onDeleteTransaction(tx.id)}
                      className="w-8 h-8 rounded-full hover:bg-red-50 text-gray-300 hover:text-red-500 flex items-center justify-center transition-all cursor-pointer opacity-80 group-hover:opacity-100"
                      title="Supprimer la ligne"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ======================================================================== */}
      {/* SCREEN 5: OVERLAY MODAL FOR ADDING A SALE */}
      {modalType === 'vente' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-end justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-t-[32px] w-full max-w-md p-6 max-h-[85vh] overflow-y-auto animate-slide-up shadow-xl border-t border-gray-100">
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-2">
                <span className="text-xl">💰</span>
                <h3 className="text-lg font-black text-gray-900">Nouvelle Vente</h3>
              </div>
              <button
                onClick={() => setModalType('none')}
                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3.5 bg-orange-50 border border-orange-200 text-orange-900 rounded-xl text-xs font-semibold flex items-start gap-2">
                <AlertCircle className="w-4.5 h-4.5 text-orange-500 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleAddVenteSubmit} className="flex flex-col gap-4">
              {/* Amount */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-extrabold text-gray-700 uppercase ml-1">
                    Montant de la vente (F CFA)
                  </label>
                  {amount && (
                    <button
                      type="button"
                      onClick={handleClearAmount}
                      className="text-[10px] font-bold text-red-500 hover:text-red-700 bg-red-50 px-2 py-0.5 rounded-full cursor-pointer transition-colors"
                    >
                      Effacer tout ✖
                    </button>
                  )}
                </div>
                
                <div className="relative">
                  <input
                    type="number"
                    pattern="[0-9]*"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    className="w-full h-14 px-4 rounded-2xl border-2 border-gray-200 text-lg font-black bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#1DB954] focus:border-[#1DB954] focus:outline-none text-gray-800 tracking-wide text-center"
                    required
                    autoFocus
                  />
                  <span className="absolute right-4 top-4 text-xs font-bold text-gray-400">F CFA</span>
                </div>
                
                {/* Visual Tactile West African Banknote Pad */}
                <div className="mt-3.5 bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-extrabold text-slate-505 uppercase tracking-wider mb-2 text-center">
                    💵 TAPEZ SUR LES BILLETS POUR AJOUTER :
                  </p>
                  
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {BANKNOTES.map((note) => (
                      <button
                        type="button"
                        key={note.value}
                        onClick={() => handleBanknoteTap(note.value)}
                        className={`px-3 py-2 rounded-xl text-xs font-black border-2 transition-all active:scale-95 cursor-pointer flex flex-col items-center gap-0.5 w-[76px] shadow-2xs ${note.color}`}
                      >
                        <span className="text-[10.5px] tracking-tight">{note.label}</span>
                        <span className="text-[7.5px] font-bold opacity-75 uppercase truncate max-w-full">{note.type}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-extrabold text-gray-700 uppercase mb-1.5 ml-1">
                  Date de perception
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-gray-200 text-sm font-semibold bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1DB954] text-gray-800 cursor-pointer"
                  required
                />
              </div>

              {/* Mode de Paiement */}
              <div>
                <label className="block text-xs font-extrabold text-gray-700 uppercase mb-2 ml-1">
                  Mode de Paiement Réceptionné
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {(['Cash', 'Wave', 'Orange Money', 'MTN Money', 'Moov Money'] as PaymentMethod[]).map((method) => {
                    const isSelected = paymentMethod === method;
                    return (
                      <button
                        type="button"
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`h-12 rounded-xl flex items-center px-3.5 gap-2.5 border-2 text-xs font-bold transition-all relative cursor-pointer text-left ${
                          isSelected
                            ? 'border-[#1DB954] bg-emerald-50/50 text-emerald-800'
                            : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-55'
                        }`}
                      >
                        {/* Simulated mobile badge visual */}
                        <div className="w-5 h-5 rounded bg-gray-100 flex items-center justify-center text-[10px]">
                          {method === 'Cash' && '💵'}
                          {method === 'Wave' && '🌊'}
                          {method === 'Orange Money' && '🍊'}
                          {method === 'MTN Money' && '🟡'}
                          {method === 'Moov Money' && '🔵'}
                        </div>
                        <span className="truncate">{method}</span>
                        {isSelected && (
                          <div className="absolute right-2.5 w-4 h-4 bg-[#1DB954] text-white rounded-full flex items-center justify-center text-[8px]">
                            ✓
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="h-0.5 bg-gray-100 my-2" />

              <button
                type="submit"
                id="btn_confirm_add_vente"
                className="w-full h-14 bg-[#1DB954] hover:bg-[#159441] text-white font-black rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-emerald-100"
              >
                <Check className="w-5 h-5 stroke-[3]" />
                <span>Enregistrer la Vente</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================== */}
      {/* SCREEN 6: OVERLAY MODAL FOR ADDING AN EXPENSE */}
      {modalType === 'depense' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-end justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-t-[32px] w-full max-w-md p-6 max-h-[85vh] overflow-y-auto animate-slide-up shadow-xl border-t border-gray-100">
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-2">
                <span className="text-xl">🧾</span>
                <h3 className="text-lg font-black text-gray-900">Nouvelle Dépense</h3>
              </div>
              <button
                onClick={() => setModalType('none')}
                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3.5 bg-orange-50 border border-orange-200 text-orange-900 rounded-xl text-xs font-semibold flex items-start gap-2">
                <AlertCircle className="w-4.5 h-4.5 text-orange-500 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleAddDepenseSubmit} className="flex flex-col gap-4">
              {/* Amount */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-extrabold text-gray-700 uppercase ml-1">
                    Montant de la dépense (F CFA)
                  </label>
                  {amount && (
                    <button
                      type="button"
                      onClick={handleClearAmount}
                      className="text-[10px] font-bold text-red-500 hover:text-red-700 bg-red-50 px-2 py-0.5 rounded-full cursor-pointer transition-colors"
                    >
                      Effacer tout ✖
                    </button>
                  )}
                </div>
                
                <div className="relative">
                  <input
                    type="number"
                    pattern="[0-9]*"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    className="w-full h-14 px-4 rounded-2xl border-2 border-slate-200 text-lg font-black bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#1DB954] focus:border-[#1DB954] focus:outline-none text-gray-800 tracking-wide text-center"
                    required
                    autoFocus
                  />
                  <span className="absolute right-4 top-4 text-xs font-bold text-gray-400">F CFA</span>
                </div>
                
                {/* Visual Tactile West African Banknote Pad */}
                <div className="mt-3.5 bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-extrabold text-slate-505 uppercase tracking-wider mb-2 text-center">
                    💵 TAPEZ SUR LES BILLETS POUR AJOUTER :
                  </p>
                  
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {BANKNOTES.map((note) => (
                      <button
                        type="button"
                        key={note.value}
                        onClick={() => handleBanknoteTap(note.value)}
                        className={`px-3 py-2 rounded-xl text-xs font-black border-2 transition-all active:scale-95 cursor-pointer flex flex-col items-center gap-0.5 w-[76px] shadow-2xs ${note.color}`}
                      >
                        <span className="text-[10.5px] tracking-tight">{note.label}</span>
                        <span className="text-[7.5px] font-bold opacity-75 uppercase truncate max-w-full">{note.type}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-extrabold text-gray-700 uppercase mb-1.5 ml-1">
                  Date de sortie
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-gray-200 text-sm font-semibold bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1DB954] text-gray-800 cursor-pointer"
                  required
                />
              </div>

              {/* Catégorie */}
              <div>
                <label className="block text-xs font-extrabold text-gray-700 uppercase mb-2 ml-1">
                  Catégorie de la Dépense
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {(['Stock', 'Transport', 'Électricité', 'Eau', 'Salaires', 'Autres'] as ExpenseCategory[]).map((cat) => {
                    const isSelected = expenseCategory === cat;
                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => setExpenseCategory(cat)}
                        className={`h-12 rounded-xl flex items-center px-3.5 gap-2 border-2 text-xs font-bold transition-all relative cursor-pointer text-left ${
                          isSelected
                            ? 'border-orange-500 bg-orange-50/50 text-orange-850'
                            : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-55'
                        }`}
                      >
                        <div className="w-5 h-5 rounded bg-gray-100 flex items-center justify-center text-[10px]">
                          {cat === 'Stock' && '📦'}
                          {cat === 'Transport' && '🚲'}
                          {cat === 'Électricité' && '💡'}
                          {cat === 'Eau' && '💧'}
                          {cat === 'Salaires' && '👥'}
                          {cat === 'Autres' && '⚙️'}
                        </div>
                        <span className="truncate">{cat}</span>
                        {isSelected && (
                          <div className="absolute right-2.5 w-4 h-4 bg-orange-500 text-white rounded-full flex items-center justify-center text-[8px]">
                            ✓
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="h-0.5 bg-gray-100 my-2" />

              <button
                type="submit"
                id="btn_confirm_add_depense"
                className="w-full h-14 bg-gray-900 hover:bg-black text-white font-black rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Check className="w-5 h-5 stroke-[3] text-[#1DB954]" />
                <span>Enregistrer la Dépense</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

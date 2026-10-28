import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { 
  getSupabaseConfig, 
  saveSupabaseConfig, 
  clearSupabaseConfig, 
  testSupabaseConnection 
} from '../lib/supabase';
import { 
  SUPABASE_SQL_SCHEMA, 
  seedAllLocalDataToSupabase, 
  AllHostelData 
} from '../services/supabaseService';
import { 
  CircleStackIcon, 
  DocumentDuplicateIcon, 
  ShieldCheckIcon 
} from '../constants';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  allCurrentData: AllHostelData;
  onDataSynced?: () => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({
  isOpen,
  onClose,
  allCurrentData,
  onDataSynced,
}) => {
  const [config, setConfig] = useState(getSupabaseConfig());
  const [urlInput, setUrlInput] = useState('');
  const [keyInput, setKeyInput] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<{ success: boolean; message: string; counts?: Record<string, number> } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedVar, setCopiedVar] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'connect' | 'sql' | 'sync' | 'vercel'>('connect');

  useEffect(() => {
    if (isOpen) {
      const current = getSupabaseConfig();
      setConfig(current);
      setUrlInput(current.url);
      setKeyInput(current.anonKey);
      setTestResult(null);
      setSeedResult(null);
    }
  }, [isOpen]);

  const handleSaveAndTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTesting(true);
    setTestResult(null);

    const saveRes = saveSupabaseConfig(urlInput, keyInput);
    if (!saveRes.success) {
      setIsTesting(false);
      setTestResult({ ok: false, message: saveRes.error || 'Invalid configuration.' });
      return;
    }

    const test = await testSupabaseConnection(urlInput, keyInput);
    setIsTesting(false);
    setTestResult(test);
    setConfig(getSupabaseConfig());
  };

  const handleDisconnect = () => {
    clearSupabaseConfig();
    setUrlInput('');
    setKeyInput('');
    setTestResult(null);
    setConfig(getSupabaseConfig());
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleCopyText = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedVar(identifier);
    setTimeout(() => setCopiedVar(null), 2000);
  };

  const handleSeedData = async () => {
    setIsSeeding(true);
    setSeedResult(null);
    const res = await seedAllLocalDataToSupabase(allCurrentData);
    setIsSeeding(false);
    setSeedResult(res);
    if (res.success && onDataSynced) {
      onDataSynced();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Supabase Database Integration">
      <div className="space-y-5">
        {/* Connection status banner */}
        <div className={`p-4 rounded-xl border flex items-center justify-between ${
          config.isConfigured 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
            : 'bg-amber-50 border-amber-200 text-amber-900'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              config.isConfigured ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
            }`}>
              <CircleStackIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm">
                  {config.isConfigured ? 'Supabase Connected' : 'Local Storage Mode'}
                </span>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                  config.isConfigured ? 'bg-emerald-200 text-emerald-800' : 'bg-amber-200 text-amber-800'
                }`}>
                  {config.isConfigured ? 'Cloud PostgreSQL' : 'Offline Mode'}
                </span>
              </div>
              <p className="text-xs opacity-90 mt-0.5">
                {config.isConfigured 
                  ? `Target: ${config.url}`
                  : 'Hostel records are currently stored locally in your browser.'}
              </p>
            </div>
          </div>
          {config.isConfigured && (
            <button
              type="button"
              onClick={handleDisconnect}
              className="text-xs text-red-600 hover:text-red-800 font-medium underline"
            >
              Disconnect
            </button>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-4 border-b border-slate-200 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('connect')}
            className={`py-2.5 text-center border-b-2 transition-colors ${
              activeTab === 'connect' 
                ? 'border-indigo-600 text-indigo-700' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            1. Connect
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sql')}
            className={`py-2.5 text-center border-b-2 transition-colors ${
              activeTab === 'sql' 
                ? 'border-indigo-600 text-indigo-700' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            2. SQL Schema
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sync')}
            className={`py-2.5 text-center border-b-2 transition-colors ${
              activeTab === 'sync' 
                ? 'border-indigo-600 text-indigo-700' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            3. Seed Data
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('vercel')}
            className={`py-2.5 text-center border-b-2 transition-colors flex items-center justify-center space-x-1 ${
              activeTab === 'vercel' 
                ? 'border-black text-black font-bold' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="inline-block text-[10px] font-black tracking-widest bg-black text-white px-1.5 py-0.2 rounded mr-1">▲</span>
            <span>4. Vercel</span>
          </button>
        </div>

        {/* Tab 1: Connect Form */}
        {activeTab === 'connect' && (
          <form onSubmit={handleSaveAndTest} className="space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              Enter your Supabase project credentials. You can find these in your Supabase Dashboard under 
              <strong> Project Settings → API</strong>.
            </p>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Project URL (VITE_SUPABASE_URL)
              </label>
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://xyzcompany.supabase.co"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Project API Anon Key (VITE_SUPABASE_ANON_KEY)
              </label>
              <textarea
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                rows={3}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white resize-none"
              />
            </div>

            {testResult && (
              <div className={`p-3 rounded-lg text-xs font-medium ${
                testResult.ok ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {testResult.ok ? '✅ ' : '❌ '} {testResult.message}
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="submit"
                disabled={isTesting}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 shadow-sm disabled:opacity-50"
              >
                {isTesting ? 'Testing Connection...' : 'Save & Test Connection'}
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: SQL Script */}
        {activeTab === 'sql' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-600">
                Execute this script once in your Supabase <strong>SQL Editor</strong>:
              </span>
              <button
                type="button"
                onClick={handleCopySql}
                className="inline-flex items-center space-x-1 px-3 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 rounded-md text-xs font-semibold transition-colors"
              >
                <DocumentDuplicateIcon className="w-3.5 h-3.5" />
                <span>{copiedSql ? 'Copied!' : 'Copy SQL Script'}</span>
              </button>
            </div>

            <div className="relative max-h-64 overflow-y-auto bg-slate-900 text-slate-100 p-3 rounded-lg text-[11px] font-mono leading-relaxed border border-slate-800">
              <pre>{SUPABASE_SQL_SCHEMA}</pre>
            </div>

            <p className="text-[11px] text-slate-500">
              💡 Tip: This creates tables for rooms, beds, bookings, staff credentials, bonus logic, utilities, and admin master password.
            </p>
          </div>
        )}

        {/* Tab 3: Seed / Sync Data */}
        {activeTab === 'sync' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              If this is your first time connecting to Supabase, you can upload all current local hostel records 
              (rooms, bookings, staff directory, bonuses, utilities) directly into your Supabase database with one click.
            </p>

            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs space-y-1.5">
              <div className="font-semibold text-slate-700">Records ready to migrate:</div>
              <div className="grid grid-cols-2 gap-2 text-slate-600 text-[11px]">
                <div>• Rooms & Bungalows: {allCurrentData.rooms.length}</div>
                <div>• Staff Members: {allCurrentData.staff.length}</div>
                <div>• Walk-in Guests: {allCurrentData.walkInGuests.length}</div>
                <div>• Online Bookings: {allCurrentData.accommodationBookings.length}</div>
                <div>• Activities & Tours: {allCurrentData.activities.length}</div>
                <div>• Staff Bonuses: {allCurrentData.bonuses.length}</div>
              </div>
            </div>

            {seedResult && (
              <div className={`p-3 rounded-lg text-xs font-medium ${
                seedResult.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {seedResult.success ? '🎉 ' : '❌ '} {seedResult.message}
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={handleSeedData}
                disabled={isSeeding || !config.isConfigured}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 shadow-sm disabled:opacity-50 flex items-center space-x-1.5"
              >
                <ShieldCheckIcon className="w-4 h-4" />
                <span>{isSeeding ? 'Syncing Records to Supabase...' : 'Export Local Records to Supabase'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: Vercel Deployment Guide */}
        {activeTab === 'vercel' && (
          <div className="space-y-4">
            <div className="bg-slate-900 text-white p-4 rounded-xl space-y-2 border border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="text-base font-black tracking-widest bg-white text-black px-2 py-0.5 rounded text-xs">▲ VERCEL</span>
                <span className="font-bold text-sm">Deployment Ready</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                The repository is configured with <code className="text-emerald-400 font-mono text-[11px]">vercel.json</code> rewrite rules 
                so your Vite SPA deploys with zero configuration and seamless page routing.
              </p>
            </div>

            <div className="space-y-3">
              <div className="border border-slate-200 rounded-xl p-3.5 bg-white space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center">1</span>
                  <span className="font-bold text-xs text-slate-800">Import Project in Vercel</span>
                </div>
                <p className="text-xs text-slate-600 pl-7">
                  Push your codebase to GitHub, then visit <a href="https://vercel.com/new" target="_blank" rel="noreferrer" className="text-indigo-600 underline font-medium">vercel.com/new</a> and select your repository. Vercel automatically detects the Vite framework.
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-3.5 bg-white space-y-2.5">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center">2</span>
                  <span className="font-bold text-xs text-slate-800">Add Supabase Environment Variables</span>
                </div>
                <p className="text-xs text-slate-600 pl-7">
                  In Vercel’s <strong>Configure Project → Environment Variables</strong> (or Project Settings), add these two variables:
                </p>

                <div className="pl-7 space-y-2 text-xs">
                  {/* Var 1 */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex items-center justify-between">
                    <div>
                      <div className="font-mono font-bold text-slate-800 text-[11px]">VITE_SUPABASE_URL</div>
                      <div className="text-[10px] text-slate-500 truncate max-w-xs mt-0.5">
                        {config.url || 'Your Supabase Project URL (e.g. https://xyz.supabase.co)'}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        onClick={() => handleCopyText('VITE_SUPABASE_URL', 'url_name')}
                        className="px-2 py-1 bg-white border border-slate-300 rounded text-[11px] font-medium text-slate-700 hover:bg-slate-100"
                      >
                        {copiedVar === 'url_name' ? 'Copied Name!' : 'Copy Name'}
                      </button>
                      {config.url && (
                        <button
                          type="button"
                          onClick={() => handleCopyText(config.url, 'url_val')}
                          className="px-2 py-1 bg-indigo-50 border border-indigo-200 rounded text-[11px] font-medium text-indigo-700 hover:bg-indigo-100"
                        >
                          {copiedVar === 'url_val' ? 'Copied Value!' : 'Copy Value'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Var 2 */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex items-center justify-between">
                    <div>
                      <div className="font-mono font-bold text-slate-800 text-[11px]">VITE_SUPABASE_ANON_KEY</div>
                      <div className="text-[10px] text-slate-500 truncate max-w-xs mt-0.5">
                        {config.anonKey ? '●●●●●●●● (configured)' : 'Your Supabase Anon / Public Key'}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        onClick={() => handleCopyText('VITE_SUPABASE_ANON_KEY', 'key_name')}
                        className="px-2 py-1 bg-white border border-slate-300 rounded text-[11px] font-medium text-slate-700 hover:bg-slate-100"
                      >
                        {copiedVar === 'key_name' ? 'Copied Name!' : 'Copy Name'}
                      </button>
                      {config.anonKey && (
                        <button
                          type="button"
                          onClick={() => handleCopyText(config.anonKey, 'key_val')}
                          className="px-2 py-1 bg-indigo-50 border border-indigo-200 rounded text-[11px] font-medium text-indigo-700 hover:bg-indigo-100"
                        >
                          {copiedVar === 'key_val' ? 'Copied Value!' : 'Copy Value'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-3.5 bg-white space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center">3</span>
                  <span className="font-bold text-xs text-slate-800">Execute SQL Schema in Supabase</span>
                </div>
                <p className="text-xs text-slate-600 pl-7">
                  Make sure you've run the SQL script from Tab 2 once in your Supabase SQL Editor. Once deployed on Vercel, your live production app will instantly connect and persist all bookings, staff credentials, and financial bonuses!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default SupabaseModal;

import { searchAdilet, analyzeText, checkOnline, getDocument } from './api';
import React, { useState, useEffect } from 'react';
import { openDocument } from './api';
import './App.css';

const LOCAL_API = 'http://localhost:3000/api';
const { ipcRenderer } = window.require('electron');



type ViewType =
  | 'laws'
  | 'codes'
  | 'npa'
  | 'intl'
  | 'search'
  | 'conflict'
  | 'history'
  | 'developers';

type DocStatus = 'active' | 'void' | 'project';
type LangType = 'ru' | 'kk' | 'en';
type ThemeType = 'light' | 'dark';

interface LawDocument {
  id: number;
  type: 'laws' | 'codes' | 'npa' | 'intl';
  num: string;
  date: string;
  year: number;
  title: string;
  org: string;
  status: DocStatus;
  desc: string;
  link?: string;
}

interface LogEntry {
  id: number;
  query: string;
  type: string;
  date: string;
}

const TRANSLATIONS: Record<LangType, Record<string, string>> = { /* ТВОЙ ОБЪЕКТ БЕЗ ИЗМЕНЕНИЙ */ } as any;

const MOCK_DB: LawDocument[] = [ ];

const dbService = {
  saveLog: (query: string, type: string) => {
    const record: LogEntry = {
      id: Date.now(),
      query,
      type,
      date:
        new Date().toLocaleTimeString() +
        ' ' +
        new Date().toLocaleDateString(),
    };
    const currentHistory = JSON.parse(
      localStorage.getItem('rk_search_history') || '[]'
    );
    localStorage.setItem(
      'rk_search_history',
      JSON.stringify([record, ...currentHistory].slice(0, 20))
    );
  },
  getHistory: (): LogEntry[] =>
    JSON.parse(localStorage.getItem('rk_search_history') || '[]'),
};

/* ================== APP ================== */
function App() {
  const [selectedDocument, setSelectedDocument] = useState<any>(null);

  const handleOpen = (link: string) => {
    openDocument(link, setSelectedDocument);
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LawDocument[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [conflictQuery, setConflictQuery] = useState('');
  const [conflictResults, setConflictResults] = useState<LawDocument[]>([]);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [historyList, setHistoryList] = useState<LogEntry[]>([]);

  /** 🔥 ЕДИНСТВЕННОЕ СОСТОЯНИЕ ДОКУМЕНТА */
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);

  /* ================== EFFECTS ================== */
  useEffect(() => {
    if (ipcRenderer) {
      ipcRenderer.send('check-online');
      ipcRenderer.on('online-status', (_: any, status: boolean) =>
        setIsOnline(status)
      );
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  if (isOnline === false) {
    return <div>Нет интернет-соединения</div>;
  }

  const t = (key: string) => TRANSLATIONS[lang]?.[key] || key;

  async function openDocument(
    link: string,
    setSelectedDoc: (data: any) => void
  ) {
    try {
      const data = await getDocument(link);

      if (!data || !data.text) {
        setSelectedDoc({ error: 'Текст документа пуст или не распознан' });
        return;
      }

      setSelectedDoc(data);
    } catch {
      setSelectedDoc({ error: 'Ошибка сети при загрузке документа' });
    }
  }

  const searchAdilet = async (query: string) => {
    const res = await fetch(
      `${LOCAL_API}/search?q=${encodeURIComponent(query)}`
    );
    if (!res.ok) throw new Error('Ошибка backend');
    return { results: await res.json() };
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setHasSearched(false);
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setHasSearched(false);
    setSearchResults([]);

    try {
      dbService.saveLog(searchQuery, 'general');
      const data = await searchAdilet(searchQuery);

      setSearchResults(
        (Array.isArray(data.results) ? data.results : []).map(
          (item: any, idx: number) => ({
            id: idx + 1,
            type: 'npa',
            num: '',
            date: '',
            year: new Date().getFullYear(),
            title: item.title,
            org: 'adilet.zan.kz',
            status: 'active',
            desc: item.desc || '',
            link: item.link,
          })
        )
      );
    } catch {
      setSearchResults([]);
    } finally {
      setIsLoading(false);
      setHasSearched(true);
    }
  };

  /* ================== CONFLICT ================== */
  const handleConflictAnalyze = async () => {
    if (!conflictQuery.trim()) return;

    setIsAnalyzing(true);
    setHasAnalyzed(false);
    setConflictResults([]);

    try {
      dbService.saveLog(conflictQuery, 'conflict');
      const data = await analyzeText(conflictQuery);

      if (data?.conflicts?.length) {
        setConflictResults(
          data.conflicts.map((c: any, i: number) => ({
            id: Date.now() + i,
            type: 'npa',
            num: 'Интернет',
            date: new Date().toLocaleDateString(),
            year: new Date().getFullYear(),
            title: c.opposing_norm?.npa_name || 'Коллизия',
            org: 'adilet.zan.kz',
            status: 'active',
            desc: c.legal_explanation,
            link: c.opposing_norm?.link,
          }))
        );
      }
    } finally {
      setHasAnalyzed(true);
      setIsAnalyzing(false);
    }
  };

  /* ================== RENDER ================== */
  return (
    <div className="app-container">

      {/* ТУТ ТВОЙ sidebar / header / таблицы — БЕЗ ИЗМЕНЕНИЙ */}

      {/* ================== MODAL ================== */}
      {selectedDoc && (
        <div className="modal-overlay" onClick={() => setSelectedDoc(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-bg">
              <h3>{t('modal_title')}</h3>
              <button onClick={() => setSelectedDoc(null)}>
                {t('btn_close')}
              </button>
            </div>

            {selectedDoc.error ? (
              <div style={{ padding: 32, color: 'red' }}>
                {selectedDoc.error}
              </div>
            ) : (
              <div style={{ padding: 32, overflowY: 'auto' }}>
                <h2 style={{ textAlign: 'center' }}>
                  {selectedDoc.title}
                </h2>

                <div
                  className="law-content"
                  dangerouslySetInnerHTML={{
                    __html: selectedDoc.text,
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

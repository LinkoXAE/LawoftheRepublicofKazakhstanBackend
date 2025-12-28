import React, { useState, useEffect } from 'react';
import './App.css';

type ViewType = 'laws' | 'codes' | 'npa' | 'intl' | 'search' | 'conflict' | 'history';
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
}

interface LogEntry {
  id: number;
  query: string;
  type: string;
  date: string;
}

const TRANSLATIONS: Record<LangType, Record<string, string>> = {
  ru: {
    logo_sub: "Правовая система РК",
    nav_laws: "Законы РК",
    nav_codes: "Кодексы РК",
    nav_npa: "НПА",
    nav_intl: "Международные договоры",
    nav_search: "Расширенный поиск",
    nav_conflict: "Поиск-конфликт",
    nav_history: "История изменений",
    nav_sec_main: "Основные разделы",
    nav_sec_tools: "Инструменты",
    user_access: "Локальный доступ",
    
    header_laws: "Реестр Законов РК",
    header_codes: "Кодексы Республики Казахстан",
    header_npa: "Нормативно-правовые акты",
    header_intl: "Международные договоры",
    header_search: "Поиск по базе законодательства",
    header_conflict: "Анализ коллизий (Поиск-конфликт)",
    header_history: "История запросов",
    header_default: "Е-ЗАҢНАМА",

    kpi_total: "Всего документов",
    kpi_projects: "Проекты",
    kpi_updated: "Обновлено",
    kpi_avg_age: "Ср. возраст",

    btn_year: "Год принятия",
    btn_reset: "Сброс",
    btn_export: "Экспорт",
    btn_find: "Найти",
    btn_analyze: "Анализ",
    btn_close: "Закрыть",
    
    th_num: "№ / Дата",
    th_year: "Год",
    th_name: "Наименование",
    th_org: "Орган",
    th_status: "Статус",
    
    status_active: "Действует",
    status_void: "Утратил силу",
    status_project: "Проект",
    
    ph_search: "Поиск по названию или номеру...",
    ph_conflict: "Введите название нового законопроекта...",
    
    msg_no_data: "Нет данных для отображения",
    msg_search_start: "Введите запрос для поиска",
    msg_search_empty: "Ничего не найдено",
    msg_conflict_found: "Обнаружены потенциальные пересечения:",
    msg_conflict_none: "Явных конфликтов не обнаружено",
    msg_conflict_label: "КОЛЛИЗИЯ",
    msg_loading: "Обработка запроса...",
    
    modal_title: "Просмотр документа",
    modal_info: "Системная информация",
    history_label: "Локальная история (SQLite Mock)"
  },
  kk: {
    logo_sub: "ҚР Құқықтық жүйесі",
    nav_laws: "ҚР Заңдары",
    nav_codes: "ҚР Кодекстері",
    nav_npa: "НҚА",
    nav_intl: "Халықаралық шарттар",
    nav_search: "Кеңейтілген іздеу",
    nav_conflict: "Қайшылықтарды іздеу",
    nav_history: "Өзгерістер тарихы",
    nav_sec_main: "Негізгі бөлімдер",
    nav_sec_tools: "Құралдар",
    user_access: "Жергілікті қолжетімділік",

    header_laws: "ҚР Заңдарының Тізілімі",
    header_codes: "Қазақстан Республикасының Кодекстері",
    header_npa: "Нормативтік-құқықтық актілер",
    header_intl: "Халықаралық шарттар",
    header_search: "Заңнама базасы бойынша іздеу",
    header_conflict: "Қайшылықтарды талдау",
    header_history: "Сұраулар тарихы",
    header_default: "Е-ЗАҢНАМА",

    kpi_total: "Барлық құжаттар",
    kpi_projects: "Жобалар",
    kpi_updated: "Жаңартылды",
    kpi_avg_age: "Орт. жасы",

    btn_year: "Қабылдау жылы",
    btn_reset: "Тазалау",
    btn_export: "Экспорттау",
    btn_find: "Іздеу",
    btn_analyze: "Талдау",
    btn_close: "Жабу",

    th_num: "№ / Күні",
    th_year: "Жылы",
    th_name: "Атауы",
    th_org: "Орган",
    th_status: "Мәртебесі",

    status_active: "Қолданыста",
    status_void: "Күші жойылды",
    status_project: "Жоба",

    ph_search: "Атауы немесе нөмірі бойынша іздеу...",
    ph_conflict: "Жаңа заң жобасының атауын енгізіңіз...",
    
    msg_no_data: "Деректер жоқ",
    msg_search_start: "Іздеу үшін сұрау енгізіңіз",
    msg_search_empty: "Ештеңе табылмады",
    msg_conflict_found: "Ықтимал қайшылықтар табылды:",
    msg_conflict_none: "Айқын қайшылықтар табылмады",
    msg_conflict_label: "ҚАЙШЫЛЫҚ",
    msg_loading: "Сұрау өңделуде...",

    modal_title: "Құжатты қарау",
    modal_info: "Жүйелік ақпарат",
    history_label: "Жергілікті тарих (SQLite Mock)"
  },
  en: {
    logo_sub: "Legal System of RK",
    nav_laws: "Laws of RK",
    nav_codes: "Codes of RK",
    nav_npa: "Regulatory Acts",
    nav_intl: "Intl. Treaties",
    nav_search: "Advanced Search",
    nav_conflict: "Conflict Search",
    nav_history: "Change History",
    nav_sec_main: "Main Sections",
    nav_sec_tools: "Tools",
    user_access: "Local Access",

    header_laws: "Registry of Laws of RK",
    header_codes: "Codes of the Republic of Kazakhstan",
    header_npa: "Regulatory Legal Acts",
    header_intl: "International Treaties",
    header_search: "Search Legislation Database",
    header_conflict: "Conflict Analysis",
    header_history: "Query History",
    header_default: "E-ZANNAMA",

    kpi_total: "Total Documents",
    kpi_projects: "Drafts",
    kpi_updated: "Updated",
    kpi_avg_age: "Avg. Age",

    btn_year: "Adoption Year",
    btn_reset: "Reset",
    btn_export: "Export",
    btn_find: "Find",
    btn_analyze: "Analyze",
    btn_close: "Close",

    th_num: "No. / Date",
    th_year: "Year",
    th_name: "Title",
    th_org: "Body",
    th_status: "Status",

    status_active: "Active",
    status_void: "Void",
    status_project: "Draft",

    ph_search: "Search by title or number...",
    ph_conflict: "Enter new bill title...",
    
    msg_no_data: "No data available",
    msg_search_start: "Enter a query to start searching",
    msg_search_empty: "Nothing found",
    msg_conflict_found: "Potential conflicts found:",
    msg_conflict_none: "No obvious conflicts found",
    msg_conflict_label: "CONFLICT",
    msg_loading: "Processing request...",

    modal_title: "Document View",
    modal_info: "System Info",
    history_label: "Local History (SQLite Mock)"
  }
};

const MOCK_DB: LawDocument[] = [
  { id: 1, type: 'laws', num: '—', date: '30.08.1995', year: 1995, title: 'Конституция Республики Казахстан', org: 'Народ Казахстана', status: 'active', desc: 'Принята на республиканском референдуме' },
  { id: 2, type: 'codes', num: '№ 268-XIII', date: '27.12.1994', year: 1994, title: 'Гражданский кодекс Республики Казахстан (Общая часть)', org: 'Верховный Совет РК', status: 'active', desc: 'С изменениями и дополнениями' },
  { id: 3, type: 'laws', num: '№ 434-V', date: '04.12.2015', year: 2015, title: 'Закон РК «О государственных закупках»', org: 'Парламент РК', status: 'void', desc: 'Утратил силу' },
  { id: 4, type: 'npa', num: 'Проект', date: '—', year: 2025, title: 'О внесении изменений в Закон РК «Об информатизации»', org: 'Мажилис Парламента РК', status: 'project', desc: 'Касательно ИИ' },
  { id: 5, type: 'intl', num: '№ 12', date: '10.10.2000', year: 2000, title: 'Договор об учреждении ЕврАзЭС', org: 'Главы государств', status: 'void', desc: 'Международный договор' },
  { id: 6, type: 'laws', num: '№ 94-V', date: '21.05.2013', year: 2013, title: 'Закон РК «О персональных данных и их защите»', org: 'Парламент РК', status: 'active', desc: 'Регулирует ПД' },
  { id: 7, type: 'codes', num: '№ 123-VI', date: '01.01.2018', year: 2018, title: 'Налоговый кодекс Республики Казахстан', org: 'Парламент РК', status: 'active', desc: 'О налогах и других обязательных платежах' }
];

const dbService = {
  saveLog: (query: string, type: string) => {
    const record: LogEntry = { 
      id: Date.now(), 
      query, 
      type, 
      date: new Date().toLocaleTimeString() + ' ' + new Date().toLocaleDateString() 
    };
    const currentHistory = JSON.parse(localStorage.getItem('rk_search_history') || '[]');
    const newHistory = [record, ...currentHistory].slice(0, 20);
    localStorage.setItem('rk_search_history', JSON.stringify(newHistory));
    console.log('[SQLite Mock] Saved:', record);
  },
  getHistory: (): LogEntry[] => {
    return JSON.parse(localStorage.getItem('rk_search_history') || '[]');
  }
};

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('laws');
  const [lang, setLang] = useState<LangType>('ru');
  const [filterYear, setFilterYear] = useState<number | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<LawDocument | null>(null);
  
  const [theme, setTheme] = useState<ThemeType>(() => {
    return (localStorage.getItem('app_theme') as ThemeType) || 'light';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LawDocument[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [conflictQuery, setConflictQuery] = useState('');
  const [conflictResults, setConflictResults] = useState<LawDocument[]>([]);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [historyList, setHistoryList] = useState<LogEntry[]>([]);
  
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  const t = (key: string) => TRANSLATIONS[lang][key] || key;

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const navigate = (view: ViewType) => {
    setCurrentView(view);
    setFilterYear(null);
    setHasSearched(false);
    setSearchQuery('');
    setHasAnalyzed(false);
    setConflictQuery('');
    
    if (view === 'history') {
      setHistoryList(dbService.getHistory());
    }
  };

  const getFilteredData = () => {
    let data = MOCK_DB.filter(item => item.type === currentView);
    if (filterYear) {
      data = data.filter(item => item.year === filterYear);
    }
    return data;
  };

  const handleExport = () => {
    const data = getFilteredData();
    const csvContent = [
      "Номер;Дата;Год;Название;Орган;Статус",
      ...data.map(d => `"${d.num}";"${d.date}";"${d.year}";"${d.title}";"${d.org}";"${d.status}"`)
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `registry_export.csv`;
    link.click();
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    setHasSearched(false);
    setTimeout(() => {
      dbService.saveLog(searchQuery, 'general');
      const q = searchQuery.toLowerCase();
      const results = MOCK_DB.filter(item => 
        item.title.toLowerCase().includes(q) || 
        item.num.toLowerCase().includes(q)
      );
      setSearchResults(results);
      setHasSearched(true);
      setIsLoading(false);
    }, 500);
  };

  const handleConflictAnalyze = () => {
    if (!conflictQuery.trim()) return;
    setIsAnalyzing(true);
    setHasAnalyzed(false);
    setTimeout(() => {
      dbService.saveLog(conflictQuery, 'conflict_check');
      const words = conflictQuery.toLowerCase().split(' ').filter(w => w.length > 3);
      let conflicts: LawDocument[] = [];
      if (words.length > 0) {
        conflicts = MOCK_DB.filter(item => 
          words.some(w => item.title.toLowerCase().includes(w))
        );
      }
      setConflictResults(conflicts);
      setHasAnalyzed(true);
      setIsAnalyzing(false);
    }, 800);
  };

  const getPageTitle = () => {
    switch(currentView) {
      case 'laws': return t('header_laws');
      case 'codes': return t('header_codes');
      case 'npa': return t('header_npa');
      case 'intl': return t('header_intl');
      case 'search': return t('header_search');
      case 'conflict': return t('header_conflict');
      case 'history': return t('header_history');
      default: return t('header_default');
    }
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="logo-area">
          <i className="ri-scales-3-line" style={{ fontSize: '24px', color: '#00A19D' }}></i>
          <div className="logo-text-container">
            <div className="logo-text">ZAN·BASE</div>
            <div className="logo-sub">{t('logo_sub')}</div>
          </div>
        </div>

        <div className="nav-section">{t('nav_sec_main')}</div>
        <ul className="nav-list">
          {['laws', 'codes', 'npa', 'intl'].map((v) => (
             <li 
              key={v}
              className={`nav-item ${currentView === v ? 'active' : ''}`} 
              onClick={() => navigate(v as ViewType)}
            >
              <i className={
                v === 'laws' ? 'ri-government-line' : 
                v === 'codes' ? 'ri-book-mark-line' : 
                v === 'npa' ? 'ri-file-list-3-line' : 'ri-archive-line'
              }></i> 
              <span className="nav-text">{t(`nav_${v}`)}</span>
            </li>
          ))}
        </ul>

        <div className="nav-section">{t('nav_sec_tools')}</div>
        <ul className="nav-list">
          <li className={`nav-item ${currentView === 'search' ? 'active' : ''}`} onClick={() => navigate('search')}>
            <i className="ri-search-2-line"></i> 
            <span className="nav-text">{t('nav_search')}</span>
          </li>
          <li className={`nav-item ${currentView === 'conflict' ? 'active' : ''}`} onClick={() => navigate('conflict')}>
            <i className="ri-alert-line"></i> 
            <span className="nav-text">{t('nav_conflict')}</span>
          </li>
          <li className={`nav-item ${currentView === 'history' ? 'active' : ''}`} onClick={() => navigate('history')}>
            <i className="ri-history-line"></i> 
            <span className="nav-text">{t('nav_history')}</span>
          </li>
        </ul>
      </aside>

      <main className="main-wrapper">
        <header className="top-bar">
          <div className="page-header">
            <h1>{getPageTitle()}</h1>
          </div>
          <div className="header-controls">
            
            <button className="theme-btn" onClick={toggleTheme} title="Toggle Theme">
              {theme === 'light' ? <i className="ri-moon-line"></i> : <i className="ri-sun-line"></i>}
            </button>

            <div style={{ display: 'flex', gap: '8px', fontSize: '13px' }}>
              {(['ru', 'kk', 'en'] as LangType[]).map(l => (
                <React.Fragment key={l}>
                  <button 
                    className={`lang-btn ${lang === l ? 'active' : ''}`} 
                    onClick={() => setLang(l)}
                  >
                    {l.toUpperCase()}
                  </button>
                  {l !== 'en' && <span style={{color: 'var(--divider-color)'}}>|</span>}
                </React.Fragment>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <span>{t('user_access')}</span>
              <div style={{ width: 32, height: 32, background: 'var(--border-color)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="ri-database-2-line" style={{color: 'var(--text-primary)'}}></i>
              </div>
            </div>
          </div>
        </header>

        <div className="content-area">
          
          {['laws', 'codes', 'npa', 'intl'].includes(currentView) && (
            <>
              <div className="kpi-row">
                <div className="kpi-card"><div className="kpi-title">{t('kpi_total')}</div><div className="kpi-value">{getFilteredData().length}</div></div>
                <div className="kpi-card"><div className="kpi-title">{t('kpi_projects')}</div><div className="kpi-value">158</div></div>
                <div className="kpi-card"><div className="kpi-title">{t('kpi_updated')}</div><div className="kpi-value">12</div></div>
                <div className="kpi-card"><div className="kpi-title">{t('kpi_avg_age')}</div><div className="kpi-value">8 лет</div></div>
              </div>

              <div className="data-panel">
                <div className="panel-header">
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn" onClick={() => {
                      const y = prompt(t('btn_year') + ': 2015, 1995...');
                      if(y && !isNaN(parseInt(y))) setFilterYear(parseInt(y));
                    }}>
                      <i className="ri-calendar-line"></i> {t('btn_year')}
                    </button>
                    {filterYear && (
                       <button className="btn" onClick={() => setFilterYear(null)}>
                         <i className="ri-refresh-line"></i> {t('btn_reset')}
                       </button>
                    )}
                  </div>
                  <button className="btn btn-primary" onClick={handleExport}>
                    <i className="ri-download-cloud-2-line"></i> {t('btn_export')}
                  </button>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th style={{ width: '15%' }}>{t('th_num')}</th>
                      <th style={{ width: '10%' }}>{t('th_year')}</th>
                      <th style={{ width: '40%' }}>{t('th_name')}</th>
                      <th style={{ width: '20%' }}>{t('th_org')}</th>
                      <th style={{ width: '15%' }}>{t('th_status')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredData().length === 0 ? (
                      <tr><td colSpan={5} style={{textAlign:'center', padding: 20}}>{t('msg_no_data')}</td></tr>
                    ) : (
                      getFilteredData().map(doc => (
                        <tr key={doc.id} onClick={() => setSelectedDoc(doc)}>
                          <td>
                            <div style={{ fontWeight: 700 }}>{doc.num}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{doc.date}</div>
                          </td>
                          <td>{doc.year}</td>
                          <td>
                            <div style={{ fontWeight: 500, fontSize: 14 }}>{doc.title}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{doc.desc}</div>
                          </td>
                          <td>{doc.org}</td>
                          <td>
                            <span className={`status status-${doc.status}`}>
                              {doc.status === 'active' ? t('status_active') : doc.status === 'void' ? t('status_void') : t('status_project')}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {currentView === 'search' && (
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
              <div className="search-input-group">
                <input 
                  type="text" 
                  className="search-field" 
                  placeholder={t('ph_search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button className="btn btn-primary" onClick={handleSearch} disabled={isLoading}>
                  {isLoading ? t('msg_loading') : t('btn_find')}
                </button>
              </div>
              <div className="data-panel">
                {!hasSearched ? (
                  <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>{t('msg_search_start')}</div>
                ) : searchResults.length === 0 ? (
                  <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>{t('msg_search_empty')}</div>
                ) : (
                  <table>
                    <tbody>
                      {searchResults.map(doc => (
                        <tr key={doc.id} onClick={() => setSelectedDoc(doc)}>
                          <td>
                            <div style={{ fontWeight: 600, color: 'var(--brand-color)' }}>{doc.title}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{doc.type.toUpperCase()} • {doc.year}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {currentView === 'conflict' && (
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
               <div className="search-input-group">
                <input 
                  type="text" 
                  className="search-field" 
                  placeholder={t('ph_conflict')}
                  value={conflictQuery}
                  onChange={(e) => setConflictQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleConflictAnalyze()}
                />
                <button 
                  className="btn btn-primary" 
                  style={{ backgroundColor: 'var(--danger-color)', borderColor: 'var(--danger-color)' }} 
                  onClick={handleConflictAnalyze}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? t('msg_loading') : t('btn_analyze')}
                </button>
              </div>
              
              {hasAnalyzed && (
                <div>
                   <h4 style={{ margin: '20px 0' }}>
                     {conflictResults.length > 0 ? t('msg_conflict_found') : t('msg_conflict_none')}
                   </h4>
                   {conflictResults.map(doc => (
                     <div key={doc.id} style={{ 
                       padding: 16, 
                       border: '1px solid var(--danger-color)', 
                       background: 'rgba(220, 38, 38, 0.05)', 
                       marginBottom: 10, borderRadius: 4, cursor: 'pointer' 
                     }} onClick={() => setSelectedDoc(doc)}>
                       <span style={{ background: 'var(--danger-color)', color: 'white', fontSize: 10, padding: '2px 6px', borderRadius: 2 }}>{t('msg_conflict_label')}</span>
                       <div style={{ fontWeight: 'bold', marginTop: 5 }}>{doc.title}</div>
                     </div>
                   ))}
                </div>
              )}
            </div>
          )}

          {currentView === 'history' && (
             <div style={{ maxWidth: 800, margin: '0 auto' }}>
                <div className="data-panel">
                  <div className="panel-header">{t('history_label')}</div>
                  <ul style={{ listStyle: 'none' }}>
                    {historyList.length === 0 && <li style={{padding: 20, textAlign: 'center', color: 'var(--text-secondary)'}}>{t('msg_no_data')}</li>}
                    {historyList.map((log) => (
                      <li key={log.id} style={{ padding: '12px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
                         <span>
                           {log.type === 'conflict_check' ? 
                             <b style={{color:'var(--danger-color)'}}>[{t('msg_conflict_label')}]</b> : 
                             <b style={{color:'var(--brand-color)'}}>[{t('btn_find')}]</b>
                           } {log.query}
                         </span>
                         <span style={{ color: 'var(--text-secondary)', fontSize: 11 }}>{log.date}</span>
                      </li>
                    ))}
                  </ul>
                </div>
             </div>
          )}

        </div>
      </main>

      {selectedDoc && (
        <div className="modal-overlay" onClick={() => setSelectedDoc(null)} style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999
        }}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{
            width: '800px', maxWidth: '90%', maxHeight: '85vh',
            borderRadius: '4px', display: 'flex', flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
          }}>
            <div className="modal-header-bg" style={{ padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                 <h3 style={{ fontSize: 16, fontWeight: 700 }}>{t('modal_title')}</h3>
                 <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>ID: {selectedDoc.id} • {selectedDoc.date}</div>
              </div>
              <button className="btn" onClick={() => setSelectedDoc(null)}>{t('btn_close')}</button>
            </div>
            <div style={{ padding: 32, overflowY: 'auto', fontFamily: 'Times New Roman, serif', fontSize: 16, lineHeight: 1.6 }}>
               <div style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 24, fontFamily: 'Roboto, sans-serif', fontSize: 14, textTransform: 'uppercase' }}>
                 {selectedDoc.title}
               </div>
               <p style={{textAlign: 'justify'}}>
                 Мы, народ Казахстана, объединенный общей исторической судьбой, созидая государственность на исконной казахской земле, сознавая себя миролюбивым гражданским обществом...
                 <br/><br/>
                 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
               </p>
               <div className="modal-info-block" style={{ marginTop: 32, padding: 16, fontFamily: 'Roboto, sans-serif', fontSize: 13 }}>
                  <strong>{t('modal_info')}:</strong><br/>
                  {t('th_org')}: {selectedDoc.org}<br/>
                  {t('th_year')}: {selectedDoc.year}
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
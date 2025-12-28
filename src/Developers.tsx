import React from 'react';

interface DeveloperProps {
  lang: 'ru' | 'kk' | 'en';
}

const TEXTS = {
  ru: {
    title: "Команда разработки системы",
    subtitle: "Техническая реализация и архитектура платформы Е-ЗАҢНАМА",
    role_frontend: "Frontend Архитектура & UI/UX",
    role_backend: "Backend Инфраструктура & БД",
    desc_adik: "Разработка клиентской части приложения, проектирование пользовательских интерфейсов, SPA-архитектура, оптимизация производительности и адаптивность.",
    desc_xbekzz: "Проектирование серверной архитектуры, управление базами данных, разработка API, безопасность данных и интеграция с внешними государственными сервисами.",
    stack: "Технологический стек",
    status: "Статус",
    status_active: "Активный разработчик"
  },
  kk: {
    title: "Жүйені әзірлеу тобы",
    subtitle: "Е-ЗАҢНАМА платформасының техникалық іске асырылуы мен архитектурасы",
    role_frontend: "Frontend Архитектура & UI/UX",
    role_backend: "Backend Инфрақұрылым & ДҚ",
    desc_adik: "Қолданбаның клиенттік бөлігін әзірлеу, пайдаланушы интерфейстерін жобалау, SPA-архитектура, өнімділікті оңтайландыру және бейімділік.",
    desc_xbekzz: "Серверлік архитектураны жобалау, дерекқорларды басқару, API әзірлеу, деректер қауіпсіздігі және сыртқы мемлекеттік қызметтермен интеграция.",
    stack: "Технологиялық стек",
    status: "Мәртебесі",
    status_active: "Белсенді әзірлеуші"
  },
  en: {
    title: "System Development Team",
    subtitle: "Technical implementation and architecture of the E-ZANNAMA platform",
    role_frontend: "Frontend Architecture & UI/UX",
    role_backend: "Backend Infrastructure & DB",
    desc_adik: "Client-side development, UI design, SPA architecture, performance optimization, and responsive design.",
    desc_xbekzz: "Server-side architecture design, database management, API development, data security, and integration with external government services.",
    stack: "Tech Stack",
    status: "Status",
    status_active: "Active Developer"
  }
};

const Developers: React.FC<DeveloperProps> = ({ lang }) => {
  const t = TEXTS[lang];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <h2 style={{ fontSize: 24, marginBottom: 8 }}>{t.title}</h2>
        <p style={{ color: 'var(--text-secondary)' }}>{t.subtitle}</p>
      </div>

      <div className="dev-grid">
        <div className="dev-card">
          <div className="dev-header">
            <div className="dev-avatar">
              <i className="ri-macbook-line"></i>
            </div>
            <div>
              <div className="dev-name">Adik</div>
              <div className="dev-role">{t.role_frontend}</div>
            </div>
          </div>
          <div className="dev-body">
            <p className="dev-desc">{t.desc_adik}</p>
            
            <div className="dev-meta">
              <div className="dev-meta-title">{t.stack}</div>
              <div className="stack-tags">
                <span>React</span>
                <span>TypeScript</span>
                <span>CSS3 Variables</span>
                <span>SPA / UX</span>
              </div>
            </div>

            <div className="dev-status">
              <div className="status-dot"></div> {t.status_active}
            </div>
          </div>
        </div>

        <div className="dev-card">
          <div className="dev-header">
            <div className="dev-avatar" style={{ background: 'var(--text-primary)', color: 'var(--bg-surface)' }}>
              <i className="ri-server-line"></i>
            </div>
            <div>
              <div className="dev-name">XBekzz</div>
              <div className="dev-role">{t.role_backend}</div>
            </div>
          </div>
          <div className="dev-body">
            <p className="dev-desc">{t.desc_xbekzz}</p>
            
            <div className="dev-meta">
              <div className="dev-meta-title">{t.stack}</div>
              <div className="stack-tags">
                <span>Node.js / Go</span>
                <span>Sqllite3</span>
                <span>REST API</span>
                <span>Docker</span>
              </div>
            </div>

            <div className="dev-status">
              <div className="status-dot"></div> {t.status_active}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Developers;
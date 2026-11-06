
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Sparkles,
  MoonStar,
  Settings,
  LogOut,
  ArrowUpRight,
  FileText,
  CalendarDays,
  Stars,
  Menu,
  Info,
} from "lucide-react";

export default function Admin() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
    { label: "Journal", icon: BookOpen, path: "/admin/journal" },
    { label: "Daily Tarot", icon: Sparkles, path: "/admin/tarot" },
    { label: "Horoscope", icon: MoonStar, path: "/admin/horoscope" },
    { label: "About Page", icon: Info, path: "/admin/about" },
    { label: "Settings", icon: Settings, path: "/admin/settings" },
  ];

  const stats = [
    {
      label: "Journal Articles",
      value: "12",
      icon: FileText,
      note: "Manage your content",
    },
    {
      label: "Tarot Reading",
      value: "01",
      icon: Sparkles,
      note: "Today's reading",
    },
    {
      label: "Zodiac Signs",
      value: "12",
      icon: Stars,
      note: "Horoscope sections",
    },
  ];

  const quickActions = [
    {
      title: "New Journal Article",
      subtitle: "Create a new story",
      icon: BookOpen,
      path: "/admin/journal",
    },
    {
      title: "Update Daily Tarot",
      subtitle: "Publish today's reading",
      icon: Sparkles,
      path: "/admin/tarot",
    },
    {
      title: "Manage Horoscope",
      subtitle: "Update zodiac readings",
      icon: MoonStar,
      path: "/admin/horoscope",
    },
    {
      title: "Edit About Page",
      subtitle: "Update story and information",
      icon: Info,
      path: "/admin/about",
    },
  ];

  return (
    <div className="dc-admin">
      <aside className="dc-sidebar">
        <div className="dc-brand">
          <div className="dc-brand-symbol">✧</div>
          <div>
            <h2>DIVINE CARAT</h2>
            <span>ADMIN STUDIO</span>
          </div>
        </div>

        <div className="dc-menu-label">WORKSPACE</div>

        <nav className="dc-navigation">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;

            return (
              <button
                key={item.label}
                className={`dc-nav-item ${active ? "active" : ""}`}
                onClick={() => navigate(item.path)}
              >
                <Icon size={19} strokeWidth={1.7} />
                <span>{item.label}</span>
                {active && <span className="dc-active-dot" />}
              </button>
            );
          })}
        </nav>

        <div className="dc-sidebar-bottom">
          <div className="dc-admin-profile">
            <div className="dc-avatar">A</div>
            <div>
              <strong>Administrator</strong>
              <span>Content Manager</span>
            </div>
          </div>

          <button className="dc-logout" onClick={() => navigate("/")}>
            <LogOut size={17} />
            Back to website
          </button>
        </div>
      </aside>

      <main className="dc-main">
        <header className="dc-topbar">
          <div>
            <span className="dc-breadcrumb">Workspace / Dashboard</span>
            <h1>Dashboard</h1>
          </div>

          <div className="dc-top-actions">
            <span className="dc-date">
              <CalendarDays size={16} /> Admin Workspace
            </span>

            <button
              className="dc-mobile-menu"
              onClick={() => navigate("/admin")}
              aria-label="Go to dashboard"
            >
              <Menu size={20} />
            </button>
          </div>
        </header>

        <section className="dc-welcome">
          <div>
            <span className="dc-eyebrow">THE ART OF THE UNIVERSE</span>
            <h2>Welcome to your creative space.</h2>
            <p>
              Manage your stories, readings and cosmic insights in one place.
            </p>
          </div>

          <div className="dc-welcome-star">✧</div>
        </section>

        <section className="dc-section">
          <div className="dc-section-heading">
            <div>
              <span className="dc-eyebrow">YOUR OVERVIEW</span>
              <h2>Content at a glance</h2>
            </div>
          </div>

          <div className="dc-stats">
            {stats.map((item) => {
              const Icon = item.icon;

              return (
                <article className="dc-stat-card" key={item.label}>
                  <div className="dc-stat-top">
                    <span>{item.label}</span>
                    <Icon size={21} strokeWidth={1.5} />
                  </div>

                  <strong>{item.value}</strong>
                  <p>{item.note}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="dc-content-grid">
          <div className="dc-panel">
            <div className="dc-panel-heading">
              <div>
                <span className="dc-eyebrow">CONTENT MANAGEMENT</span>
                <h2>Quick actions</h2>
              </div>
            </div>

            <div className="dc-quick-actions">
              {quickActions.map((action) => {
                const Icon = action.icon;

                return (
                  <button
                    className="dc-action"
                    key={action.title}
                    onClick={() => navigate(action.path)}
                  >
                    <span className="dc-action-icon">
                      <Icon size={21} />
                    </span>

                    <span>
                      <strong>{action.title}</strong>
                      <small>{action.subtitle}</small>
                    </span>

                    <ArrowUpRight size={18} />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="dc-panel dc-side-panel">
            <span className="dc-eyebrow">A LITTLE REMINDER</span>

            <div className="dc-reminder-star">✧</div>

            <h2>Let the universe inspire your next story.</h2>

            <p>
              Your content is a reflection of the wisdom and creativity you
              share.
            </p>

            <div className="dc-reminder-line" />

            <span className="dc-reminder-caption">
              DIVINE CARAT · ADMIN STUDIO
            </span>
          </div>
        </section>

        <footer className="dc-footer">
          <span>© 2026 DIVINE CARAT</span>
          <span>
            Made with intention <span className="dc-heart">✦</span>
          </span>
        </footer>
      </main>

      <style>{`
        .dc-admin {
          min-height: 100vh;
          display: flex;
          background: #f5f4ed;
          color: #263b31;
          font-family: Georgia, 'Times New Roman', serif;
        }

        .dc-sidebar {
          width: 255px;
          min-width: 255px;
          background: #203c30;
          color: #f4f0e4;
          padding: 32px 20px 22px;
          display: flex;
          flex-direction: column;
        }

        .dc-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 8px 42px;
        }

        .dc-brand-symbol {
          width: 40px;
          height: 40px;
          border: 1px solid #c4a96d;
          border-radius: 50%;
          display: grid;
          place-items: center;
          color: #d9c18a;
          font-size: 27px;
        }

        .dc-brand h2 {
          font-size: 15px;
          letter-spacing: 2px;
          margin: 0 0 5px;
        }

        .dc-brand span {
          font: 9px Arial, sans-serif;
          letter-spacing: 2.5px;
          color: #c4b993;
        }

        .dc-menu-label,
        .dc-eyebrow {
          font: 10px Arial, sans-serif;
          letter-spacing: 2px;
          color: #a88e5c;
        }

        .dc-menu-label {
          padding: 0 12px 14px;
          color: #a9b7a8;
        }

        .dc-navigation {
          display: grid;
          gap: 8px;
        }

        .dc-nav-item {
          border: 0;
          background: transparent;
          color: #d1d8cf;
          padding: 14px 13px;
          display: flex;
          align-items: center;
          gap: 13px;
          text-align: left;
          border-radius: 7px;
          font: 13px Arial, sans-serif;
          cursor: pointer;
          width: 100%;
        }

        .dc-nav-item.active {
          background: #345343;
          color: #f2d9a0;
        }

        .dc-active-dot {
          margin-left: auto;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #d6bd83;
        }

        .dc-sidebar-bottom {
          margin-top: auto;
        }

        .dc-admin-profile {
          display: flex;
          align-items: center;
          gap: 11px;
          border-top: 1px solid #496153;
          padding: 20px 4px;
        }

        .dc-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #d8c79f;
          color: #203c30;
          display: grid;
          place-items: center;
          font-size: 16px;
        }

        .dc-admin-profile strong,
        .dc-admin-profile span {
          display: block;
        }

        .dc-admin-profile strong {
          font-size: 13px;
          font-weight: normal;
        }

        .dc-admin-profile span {
          font: 10px Arial, sans-serif;
          color: #b7c1b5;
          margin-top: 5px;
        }

        .dc-logout {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 5px;
          border: 0;
          background: none;
          color: #d1d8cf;
          font: 12px Arial, sans-serif;
          cursor: pointer;
        }

        .dc-main {
          flex: 1;
          min-width: 0;
          padding: 34px 5%;
        }

        .dc-topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
        }

        .dc-breadcrumb {
          font: 11px Arial, sans-serif;
          color: #899187;
        }

        .dc-topbar h1 {
          font-size: 30px;
          font-weight: normal;
          margin: 9px 0 0;
        }

        .dc-top-actions {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .dc-date {
          display: flex;
          gap: 8px;
          align-items: center;
          font: 11px Arial, sans-serif;
          color: #69796c;
        }

        .dc-mobile-menu {
          display: none;
        }

        .dc-welcome {
          position: relative;
          overflow: hidden;
          background: #e9e9dc;
          border: 1px solid #dedfce;
          padding: 34px 38px;
          border-radius: 5px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .dc-welcome h2 {
          font-size: 27px;
          font-weight: normal;
          margin: 13px 0 8px;
        }

        .dc-welcome p {
          font: 12px Arial, sans-serif;
          color: #738074;
          margin: 0;
          line-height: 1.7;
        }

        .dc-welcome-star {
          color: #b39a65;
          font-size: 90px;
          padding-right: 25px;
        }

        .dc-section {
          margin-top: 36px;
        }

        .dc-section-heading,
        .dc-panel-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
        }

        .dc-section-heading h2,
        .dc-panel-heading h2 {
          font-size: 21px;
          font-weight: normal;
          margin: 7px 0 0;
        }

        .dc-stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 17px;
        }

        .dc-stat-card,
        .dc-panel {
          background: #fffefa;
          border: 1px solid #e8e6db;
          border-radius: 5px;
        }

        .dc-stat-card {
          padding: 22px;
        }

        .dc-stat-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #738074;
          font: 11px Arial, sans-serif;
        }

        .dc-stat-top svg {
          color: #a58d5c;
        }

        .dc-stat-card > strong {
          display: block;
          font-size: 34px;
          font-weight: normal;
          margin: 18px 0 7px;
        }

        .dc-stat-card p {
          font: 11px Arial, sans-serif;
          color: #9a9e91;
          margin: 0;
        }

        .dc-content-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 18px;
          margin-top: 25px;
        }

        .dc-panel {
          padding: 25px;
        }

        .dc-quick-actions {
          display: grid;
        }

        .dc-action {
          display: flex;
          align-items: center;
          gap: 13px;
          width: 100%;
          padding: 15px 0;
          border: 0;
          border-top: 1px solid #eeece4;
          background: none;
          color: #314538;
          text-align: left;
          cursor: pointer;
        }

        .dc-action-icon {
          width: 39px;
          height: 39px;
          display: grid;
          place-items: center;
          background: #edf0e7;
          color: #75886d;
          border-radius: 50%;
        }

        .dc-action > span:nth-child(2) {
          flex: 1;
        }

        .dc-action strong,
        .dc-action small {
          display: block;
        }

        .dc-action strong {
          font-size: 14px;
          font-weight: normal;
        }

        .dc-action small {
          font: 10px Arial, sans-serif;
          color: #969b8e;
          margin-top: 5px;
        }

        .dc-action > svg {
          color: #9a8a65;
        }

        .dc-side-panel {
          background: #e9e9dc;
          border-color: #dedfce;
        }

        .dc-reminder-star {
          color: #b39a65;
          font-size: 42px;
          margin: 24px 0 12px;
        }

        .dc-side-panel h2 {
          max-width: 280px;
          font-size: 24px;
          line-height: 1.35;
          font-weight: normal;
          margin: 0;
        }

        .dc-side-panel p {
          font: 11px Arial, sans-serif;
          line-height: 1.8;
          color: #788276;
          margin: 14px 0 22px;
        }

        .dc-reminder-line {
          height: 1px;
          background: #d2d1c1;
        }

        .dc-reminder-caption {
          display: block;
          font: 9px Arial, sans-serif;
          letter-spacing: 1.8px;
          color: #9b8b62;
          margin-top: 16px;
        }

        .dc-footer {
          display: flex;
          justify-content: space-between;
          padding-top: 25px;
          margin-top: 30px;
          border-top: 1px solid #e1e0d6;
          font: 9px Arial, sans-serif;
          letter-spacing: 1px;
          color: #92978b;
        }

        .dc-heart {
          color: #aa925e;
        }

        @media (max-width: 900px) {
          .dc-sidebar {
            width: 210px;
            min-width: 210px;
          }

          .dc-main {
            padding: 28px 3%;
          }

          .dc-content-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 650px) {
          .dc-sidebar {
            width: 65px;
            min-width: 65px;
            padding: 25px 8px;
          }

          .dc-brand {
            padding: 0 4px 35px;
          }

          .dc-brand > div:last-child,
          .dc-menu-label,
          .dc-nav-item span,
          .dc-admin-profile > div:last-child,
          .dc-logout {
            display: none;
          }

          .dc-nav-item {
            justify-content: center;
            padding: 14px 8px;
          }

          .dc-admin-profile {
            justify-content: center;
          }

          .dc-main {
            padding: 22px 14px;
          }

          .dc-topbar h1 {
            font-size: 25px;
          }

          .dc-date {
            display: none;
          }

          .dc-mobile-menu {
            display: block;
            border: 0;
            background: none;
            color: #344b3c;
          }

          .dc-welcome {
            padding: 25px 20px;
          }

          .dc-welcome h2 {
            font-size: 21px;
          }

          .dc-welcome-star {
            font-size: 48px;
            padding: 0;
          }

          .dc-stats {
            grid-template-columns: 1fr;
          }

          .dc-footer {
            font-size: 8px;
          }
        }
      `}</style>
    </div>
  );
}

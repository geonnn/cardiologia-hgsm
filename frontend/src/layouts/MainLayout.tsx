import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import styles from './MainLayout.module.css';

export const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={styles.layoutContainer}>
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(false)} />
      
      <div className={styles.mainWrapper}>

        {/* Footer discreto en la parte inferior sólo cuando el menú lateral está oculto */}
        {!sidebarOpen && (
          <header className={styles.topBar}>
            <button
              type="button"
              className={styles.showSidebarBtn}
              onClick={() => setSidebarOpen(true)}
              title="Mostrar panel lateral"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </header>
        )}
        <main className={styles.mainContent}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

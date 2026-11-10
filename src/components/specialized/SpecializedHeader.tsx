/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Madrid Apoyo Especializado v1.7 - Top Navigation Bar (Clean & Minimalist)
 * Barra superior simplificada sin sobrecarga de elementos (§2 de frontend-design)
 */

import React from 'react';
import { 
  Bookmark, 
  Eye, 
  BookOpen,
  AlertCircle
} from 'lucide-react';

interface SpecializedHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  easyReadMode: boolean;
  setEasyReadMode: (v: boolean | ((prev: boolean) => boolean)) => void;
  savedSearchesCount: number;
  openSavedSearches: () => void;
  openGlossary: () => void;
}

export const SpecializedHeader: React.FC<SpecializedHeaderProps> = ({
  activeTab,
  setActiveTab,
  easyReadMode,
  setEasyReadMode,
  savedSearchesCount,
  openSavedSearches,
  openGlossary
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-16">
          {/* Zona 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => setActiveTab('search')}
              className="text-left group cursor-pointer focus:outline-none flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                M
              </div>
              <div>
                <span className="text-base sm:text-lg font-bold tracking-tight text-stone-900 group-hover:text-stone-700 transition-colors whitespace-nowrap block leading-tight">
                  Madrid Apoyo
                </span>
                <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block">
                  Especializado v1.7
                </span>
              </div>
            </button>
          </div>

          {/* Zona 2: Navegación principal limpia (Búsqueda, Mapa, Comparador) */}
          <nav className="hidden md:flex items-center gap-2 bg-stone-100 p-1 rounded-xl text-xs font-semibold text-stone-700">
            <button
              onClick={() => setActiveTab('search')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'search' ? 'bg-white text-stone-900 shadow-xs' : 'hover:text-stone-900'
              }`}
            >
              Búsqueda
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'map' ? 'bg-white text-stone-900 shadow-xs' : 'hover:text-stone-900'
              }`}
            >
              Mapa
            </button>
            <button
              onClick={() => setActiveTab('comparator')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'comparator' ? 'bg-white text-stone-900 shadow-xs' : 'hover:text-stone-900'
              }`}
            >
              Comparador
            </button>
          </nav>

          {/* Zona 3: Utilidades esenciales */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Modo lectura fácil */}
            <button
              onClick={() => setEasyReadMode(prev => !prev)}
              title="Lectura fácil"
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 ${
                easyReadMode 
                  ? 'bg-amber-100 border-amber-300 text-amber-900 font-semibold' 
                  : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden sm:inline">Lectura fácil</span>
            </button>

            {/* Búsquedas guardadas */}
            <button
              onClick={openSavedSearches}
              title="Búsquedas guardadas"
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 transition-colors flex items-center gap-1.5"
            >
              <Bookmark className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden sm:inline">Guardadas</span>
              {savedSearchesCount > 0 && (
                <span className="ml-0.5 text-xs font-mono font-semibold text-stone-900">
                  ({savedSearchesCount})
                </span>
              )}
            </button>

            {/* Glosario */}
            <button
              onClick={openGlossary}
              title="Glosario"
              className="p-2 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
            </button>

            {/* Reportar discrepancia de datos / GitHub Issues */}
            <a
              href="https://github.com/madrid-apoyo/madrid-apoyo-especializado/issues/new"
              target="_blank"
              rel="noreferrer"
              title="Reportar discrepancia o sugerir corrección registral"
              className="p-2 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
            >
              <AlertCircle className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Barra móvil para pestañas principales */}
        <div className="md:hidden flex items-center justify-center gap-2 py-2 border-t border-stone-100 text-xs font-semibold text-stone-700">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 py-1.5 rounded-lg text-center ${activeTab === 'search' ? 'bg-stone-900 text-white' : 'bg-stone-100'}`}
          >
            Búsqueda
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`flex-1 py-1.5 rounded-lg text-center ${activeTab === 'map' ? 'bg-stone-900 text-white' : 'bg-stone-100'}`}
          >
            Mapa
          </button>
          <button
            onClick={() => setActiveTab('comparator')}
            className={`flex-1 py-1.5 rounded-lg text-center ${activeTab === 'comparator' ? 'bg-stone-900 text-white' : 'bg-stone-100'}`}
          >
            Comparador
          </button>
        </div>
      </div>
    </header>
  );
};

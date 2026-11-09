/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Madrid Apoyo Especializado v1.7 - Top Navigation Bar
 * Cumple con el Contrato de Barra Superior de 3 Zonas (§2 de frontend-design)
 */

import React from 'react';
import { 
  Compass, 
  MapPin, 
  History, 
  Sparkles, 
  GraduationCap, 
  Settings, 
  CheckCircle2, 
  Bookmark, 
  Eye, 
  BookOpen,
  ArrowRight
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
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zona 1: Brand Wordmark (Un solo elemento de texto, sin badges ni subtítulos en el DOM) */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => setActiveTab('search')}
              className="text-left group cursor-pointer focus:outline-none"
            >
              <span className="text-lg font-bold tracking-tight text-stone-900 group-hover:text-stone-700 transition-colors whitespace-nowrap">
                Madrid Apoyo Especializado
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-mono text-stone-600">
                v1.7
              </span>
            </button>
          </div>

          {/* Zona 2: Enlaces de navegación concisos de 1-2 palabras */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-600">
            <button
              onClick={() => setActiveTab('search')}
              className={`hover:text-stone-900 transition-colors whitespace-nowrap py-1 ${
                activeTab === 'search' ? 'text-stone-900 font-semibold border-b-2 border-stone-900' : ''
              }`}
            >
              Búsqueda
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`hover:text-stone-900 transition-colors whitespace-nowrap py-1 ${
                activeTab === 'map' ? 'text-stone-900 font-semibold border-b-2 border-stone-900' : ''
              }`}
            >
              Mapa
            </button>
            <button
              onClick={() => setActiveTab('comparator')}
              className={`hover:text-stone-900 transition-colors whitespace-nowrap py-1 ${
                activeTab === 'comparator' ? 'text-stone-900 font-semibold border-b-2 border-stone-900' : ''
              }`}
            >
              Comparador
            </button>
            <button
              onClick={() => setActiveTab('what_changed')}
              className={`hover:text-stone-900 transition-colors whitespace-nowrap py-1 ${
                activeTab === 'what_changed' ? 'text-stone-900 font-semibold border-b-2 border-stone-900' : ''
              }`}
            >
              Qué ha cambiado
            </button>
            <button
              onClick={() => setActiveTab('governance')}
              className={`hover:text-stone-900 transition-colors whitespace-nowrap py-1 ${
                activeTab === 'governance' ? 'text-stone-900 font-semibold border-b-2 border-stone-900' : ''
              }`}
            >
              Gobernanza
            </button>
            <button
              onClick={() => setActiveTab('tests')}
              className={`hover:text-stone-900 transition-colors whitespace-nowrap py-1 ${
                activeTab === 'tests' ? 'text-stone-900 font-semibold border-b-2 border-stone-900' : ''
              }`}
            >
              Pruebas canónicas
            </button>
          </nav>

          {/* Zona 3: Acciones primarias y utilidades de accesibilidad */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Modo lectura fácil */}
            <button
              onClick={() => setEasyReadMode(prev => !prev)}
              title="Activar o desactivar explicaciones en lectura fácil"
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                easyReadMode 
                  ? 'bg-amber-100 border-amber-300 text-amber-900 font-semibold' 
                  : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden sm:inline">Lectura fácil</span>
            </button>

            {/* Búsquedas guardadas en el navegador */}
            <button
              onClick={openSavedSearches}
              title="Ver búsquedas guardadas localmente en este navegador"
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 transition-colors whitespace-nowrap flex items-center gap-1.5"
            >
              <Bookmark className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden sm:inline">Guardadas</span>
              {savedSearchesCount > 0 && (
                <span className="ml-1 text-xs font-mono font-semibold text-stone-900">
                  ({savedSearchesCount})
                </span>
              )}
            </button>

            {/* Glosario */}
            <button
              onClick={openGlossary}
              title="Glosario oficial de términos y siglas"
              className="p-2 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sub-barra móvil para pestañas en pantallas estrechas */}
        <div className="lg:hidden flex items-center gap-4 py-2 border-t border-stone-100 overflow-x-auto text-xs font-medium text-stone-600">
          <button
            onClick={() => setActiveTab('search')}
            className={`whitespace-nowrap px-2 py-1 rounded ${activeTab === 'search' ? 'bg-stone-100 text-stone-900 font-bold' : ''}`}
          >
            Búsqueda
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`whitespace-nowrap px-2 py-1 rounded ${activeTab === 'map' ? 'bg-stone-100 text-stone-900 font-bold' : ''}`}
          >
            Mapa
          </button>
          <button
            onClick={() => setActiveTab('comparator')}
            className={`whitespace-nowrap px-2 py-1 rounded ${activeTab === 'comparator' ? 'bg-stone-100 text-stone-900 font-bold' : ''}`}
          >
            Comparador
          </button>
          <button
            onClick={() => setActiveTab('what_changed')}
            className={`whitespace-nowrap px-2 py-1 rounded ${activeTab === 'what_changed' ? 'bg-stone-100 text-stone-900 font-bold' : ''}`}
          >
            Qué ha cambiado
          </button>
          <button
            onClick={() => setActiveTab('governance')}
            className={`whitespace-nowrap px-2 py-1 rounded ${activeTab === 'governance' ? 'bg-stone-100 text-stone-900 font-bold' : ''}`}
          >
            Gobernanza
          </button>
          <button
            onClick={() => setActiveTab('tests')}
            className={`whitespace-nowrap px-2 py-1 rounded ${activeTab === 'tests' ? 'bg-stone-100 text-stone-900 font-bold' : ''}`}
          >
            Pruebas (35)
          </button>
        </div>
      </div>
    </header>
  );
};

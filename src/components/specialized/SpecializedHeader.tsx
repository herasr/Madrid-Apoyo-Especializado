/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Madrid Apoyo Especializado v1.8 - Top Navigation Bar (Clean & Minimalist)
 * Barra superior simplificada sin sobrecarga de elementos (§2 de frontend-design)
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bookmark, 
  Eye, 
  BookOpen,
  AlertCircle,
  X,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { PWAInstallButton } from '../pwa/PWAInstallButton';
import { useFocusTrap } from '../../hooks/useFocusTrap';

interface SpecializedHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  easyReadMode: boolean;
  setEasyReadMode: (v: boolean | ((prev: boolean) => boolean)) => void;
  savedSearchesCount: number;
  openSavedSearches: () => void;
  openGlossary: () => void;
  onOpenWhatChanged?: () => void;
}

export const SpecializedHeader: React.FC<SpecializedHeaderProps> = ({
  activeTab,
  setActiveTab,
  easyReadMode,
  setEasyReadMode,
  savedSearchesCount,
  openSavedSearches,
  openGlossary,
  onOpenWhatChanged
}) => {
  const [isSourcesModalOpen, setIsSourcesModalOpen] = useState(false);
  const sourcesModalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(sourcesModalRef, isSourcesModalOpen);

  useEffect(() => {
    if (!isSourcesModalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSourcesModalOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isSourcesModalOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-6 h-16">
            {/* Zona 1: Brand Wordmark */}
            <div className="flex items-center gap-3 shrink-0">
              <button 
                onClick={() => setActiveTab('search')}
                aria-label="Volver al inicio de búsqueda de Madrid Apoyo"
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
                    Especializado v1.8
                  </span>
                </div>
              </button>
            </div>

            {/* Zona 2: Navegación principal limpia (Búsqueda, Mapa, Comparador) */}
            <nav aria-label="Navegación principal" className="hidden md:flex items-center gap-2 bg-stone-100 p-1 rounded-xl text-xs font-semibold text-stone-700">
              <button
                onClick={() => setActiveTab('search')}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'search' ? 'bg-white text-stone-900 shadow-xs' : 'hover:text-stone-900'
                }`}
              >
                Búsqueda
              </button>
              <button
                onClick={() => setActiveTab('map')}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'map' ? 'bg-white text-stone-900 shadow-xs' : 'hover:text-stone-900'
                }`}
              >
                Mapa
              </button>
              <button
                onClick={() => setActiveTab('comparator')}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
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
                type="button"
                onClick={() => setEasyReadMode(prev => !prev)}
                title="Lectura fácil"
                aria-label="Activar o desactivar modo de lectura fácil"
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer ${
                  easyReadMode 
                    ? 'bg-amber-100 border-amber-300 text-amber-900 font-semibold' 
                    : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <Eye className="w-3.5 h-3.5 text-stone-500" aria-hidden="true" />
                <span className="hidden sm:inline">Lectura fácil</span>
              </button>

              {/* Búsquedas guardadas */}
              <PWAInstallButton />
              <button
                type="button"
                onClick={openSavedSearches}
                title="Búsquedas guardadas"
                aria-label={`Ver búsquedas guardadas en el navegador${savedSearchesCount > 0 ? ` (${savedSearchesCount})` : ''}`}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5 text-stone-500" aria-hidden="true" />
                <span className="hidden sm:inline">Guardadas</span>
                {savedSearchesCount > 0 && (
                  <span className="ml-0.5 text-xs font-mono font-semibold text-stone-900">
                    ({savedSearchesCount})
                  </span>
                )}
              </button>

              {/* Glosario */}
              <button
                type="button"
                onClick={openGlossary}
                title="Glosario en lectura fácil"
                aria-label="Abrir glosario en lectura fácil y siglas oficiales"
                className="p-2 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <BookOpen className="w-4 h-4" aria-hidden="true" />
              </button>

              {/* Verificar fuentes oficiales y reportar discrepancias */}
              <button
                type="button"
                onClick={() => setIsSourcesModalOpen(true)}
                title="Verificar fuentes oficiales y reportar discrepancia registral"
                aria-label="Abrir diálogo de verificación de fuentes oficiales y reporte de discrepancias"
                className="p-2 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <AlertCircle className="w-4 h-4" aria-hidden="true" />
              </button>
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

      {/* Modal interno de verificación de fuentes y reporte de discrepancias */}
      {isSourcesModalOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="sources-verification-title"
        >
          <div
            ref={sourcesModalRef}
            tabIndex={-1}
            className="bg-white rounded-2xl max-w-xl w-full border border-stone-200 shadow-xl overflow-hidden my-8"
          >
            <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <h2 id="sources-verification-title" className="text-base font-bold text-stone-900">
                  Verificación de fuentes y reporte de discrepancias
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsSourcesModalOpen(false)}
                aria-label="Cerrar modal"
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-stone-700 leading-relaxed">
              <p>
                Todos los datos de centros y servicios proceden exclusivamente de los tres registros públicos abiertos de <strong>Atención Social</strong> descargados sin alterar su codificación original y contrastados por suma <strong>SHA-256</strong>:
              </p>

              <ul className="space-y-2 bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                <li>
                  <a
                    href="https://datos.madrid.es/dataset/212774-0-atencion-social"
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-stone-900 underline inline-flex items-center gap-1 hover:text-stone-700"
                  >
                    <span>Ayuntamiento de Madrid · Catálogo de Centros de Atención Social (212774-0)</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://datos.comunidad.madrid/dataset/atencion_social_registro_centros"
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-stone-900 underline inline-flex items-center gap-1 hover:text-stone-700"
                  >
                    <span>Comunidad de Madrid · Registro General de Centros de Atención Social</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://datos.comunidad.madrid/dataset/atencion_social_registro_servicios"
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-stone-900 underline inline-flex items-center gap-1 hover:text-stone-700"
                  >
                    <span>Comunidad de Madrid · Registro General de Servicios de Atención Social</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              </ul>

              <p className="text-stone-600">
                Si detecta un teléfono o dirección desactualizados, puede verificarlo en el portal origen o revisar la auditoría automática de descargas y huellas SHA-256. El motor no modifica datos administrativos manualmente en la aplicación.
              </p>
            </div>

            <div className="px-6 py-3 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs">
              {onOpenWhatChanged ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsSourcesModalOpen(false);
                    onOpenWhatChanged();
                  }}
                  className="font-semibold text-stone-900 underline hover:text-stone-700 cursor-pointer"
                >
                  Ver auditoría de snapshots y SHA-256
                </button>
              ) : <span />}
              <button
                type="button"
                onClick={() => setIsSourcesModalOpen(false)}
                className="px-4 py-1.5 bg-stone-900 text-white rounded-lg font-semibold hover:bg-stone-800 cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

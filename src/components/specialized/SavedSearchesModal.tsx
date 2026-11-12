/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Madrid Apoyo Especializado v1.7 - Búsquedas Guardadas en el Navegador
 * Almacenamiento 100% local en localStorage sin persistencia de coordenadas exactas ni datos médicos (§83)
 */

import React, { useState, useEffect, useRef } from 'react';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { SavedSearch, SearchQueryState } from '../../types/specialized';
import { 
  X, 
  Bookmark, 
  Trash2, 
  ExternalLink, 
  Calendar, 
  History, 
  Plus, 
  ShieldCheck,
  Check
} from 'lucide-react';
import { CORE_PROFILES, SUPPORT_TYPES, LIFE_STAGES } from '../../data/specializedTaxonomy';

interface SavedSearchesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentQuery: SearchQueryState;
  onLoadSearch: (filters: SavedSearch['filters']) => void;
  onOpenWhatChanged: () => void;
}

const STORAGE_KEY = 'madrid_apoyo_saved_searches_v17';

export const SavedSearchesModal: React.FC<SavedSearchesModalProps> = ({
  isOpen,
  onClose,
  currentQuery,
  onLoadSearch,
  onOpenWhatChanged
}) => {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [newSearchName, setNewSearchName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  // Cargar búsquedas locales del navegador
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          setSavedSearches(JSON.parse(raw));
        }
      } catch (err) {}
    }
  }, [isOpen]);

  const saveSearchesToStorage = (list: SavedSearch[]) => {
    setSavedSearches(list);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {}
  };

  const handleSaveCurrent = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newSearchName.trim() || `Búsqueda del ${new Date().toLocaleDateString('es-ES')}`;

    // Regla de Privacidad SAVE-001 y §83.2: NUNCA guardar coordenadas exactas GPS
    const safeFilters = {
      profile: currentQuery.profile,
      functional_needs: currentQuery.functional_needs,
      support_types: currentQuery.support_types,
      support_combination_mode: currentQuery.support_combination_mode,
      life_stage: currentQuery.life_stage,
      municipality: currentQuery.municipality,
      radius_km: currentQuery.radius_km,
      network_preference: currentQuery.network_preference,
      accessibility_needs: currentQuery.accessibility_needs
    };

    const newRecord: SavedSearch = {
      saved_search_id: `search_${Date.now()}`,
      name,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      filters: safeFilters,
      taxonomy_version: '1.7.0',
      dataset_snapshot: '2026-11-09'
    };

    saveSearchesToStorage([newRecord, ...savedSearches]);
    setNewSearchName('');
  };

  const handleDelete = (id: string) => {
    const updated = savedSearches.filter(s => s.saved_search_id !== id);
    saveSearchesToStorage(updated);
  };

  const handleClearAll = () => {
    if (confirm('¿Desea eliminar todas las búsquedas guardadas en este navegador?')) {
      saveSearchesToStorage([]);
    }
  };

  const handleApply = (search: SavedSearch) => {
    onLoadSearch(search.filters);
    onClose();
  };

  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(modalRef, isOpen);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="saved-searches-modal-title"
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl max-w-2xl w-full border border-stone-200 shadow-xl overflow-hidden my-8 max-h-[90vh] flex flex-col"
        tabIndex={-1}
      >
        {/* Cabecera */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-stone-700" />
            <div>
              <h2 id="saved-searches-modal-title" className="text-base font-bold text-stone-900">
                Búsquedas guardadas en tu navegador
              </h2>
              <div className="text-[11px] text-stone-500">
                Almacenamiento 100% local (sin cuenta ni servidores · RGPD)
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario para guardar búsqueda actual */}
        <div className="p-6 border-b border-stone-200 bg-stone-50/50">
          <form onSubmit={handleSaveCurrent} className="space-y-2">
            <label className="block text-xs font-bold text-stone-800">
              Guardar configuración actual de filtros
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSearchName}
                onChange={(e) => setNewSearchName(e.target.value)}
                placeholder="Nombre para esta búsqueda (ej. «DCA en Madrid con Logopedia»)"
                className="flex-1 px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900 bg-white"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Guardar</span>
              </button>
            </div>
            <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Garantía de privacidad: nunca se guardan coordenadas exactas GPS ni diagnósticos libres.</span>
            </div>
          </form>
        </div>

        {/* Lista de búsquedas guardadas */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1 text-xs">
          {savedSearches.length === 0 ? (
            <div className="text-center py-8 text-stone-400">
              No tienes ninguna búsqueda guardada en este navegador.
            </div>
          ) : (
            savedSearches.map((s) => (
              <div
                key={s.saved_search_id}
                className="p-3 rounded-xl border border-stone-200 bg-white hover:border-stone-300 transition-colors space-y-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">
                      {s.name}
                    </h4>
                    <div className="text-[11px] text-stone-500 font-mono mt-0.5">
                      Versión taxonomía: {s.taxonomy_version} · Guardado el {new Date(s.created_at).toLocaleDateString('es-ES')}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleApply(s)}
                      className="px-3 py-1 bg-stone-900 text-white rounded-md text-xs font-semibold hover:bg-stone-800 transition-colors"
                    >
                      Abrir búsqueda
                    </button>
                    <button
                      onClick={() => handleDelete(s.saved_search_id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded-md transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Resumen de filtros */}
                <div className="flex flex-wrap gap-1 text-[11px] text-stone-600">
                  {s.filters.profile && (
                    <span className="bg-stone-100 px-2 py-0.5 rounded text-stone-800">
                      {CORE_PROFILES[s.filters.profile as keyof typeof CORE_PROFILES]?.preferred_label || s.filters.profile}
                    </span>
                  )}
                  {s.filters.support_types.map(st => (
                    <span key={st} className="bg-stone-100 px-2 py-0.5 rounded text-stone-800">
                      {SUPPORT_TYPES[st]?.label || st}
                    </span>
                  ))}
                  {s.filters.life_stage && (
                    <span className="bg-stone-100 px-2 py-0.5 rounded text-stone-800">
                      {LIFE_STAGES[s.filters.life_stage]?.label}
                    </span>
                  )}
                  {s.filters.municipality && (
                    <span className="bg-stone-100 px-2 py-0.5 rounded text-stone-800">
                      {s.filters.municipality} (±{s.filters.radius_km} km)
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pie con botón de "Qué ha cambiado" y Limpiar todo */}
        <div className="px-6 py-3 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs">
          <button
            onClick={() => {
              onClose();
              onOpenWhatChanged();
            }}
            className="font-semibold text-stone-900 hover:text-stone-700 flex items-center gap-1.5"
          >
            <History className="w-3.5 h-3.5 text-stone-600" />
            <span>Ver qué ha cambiado en el conjunto de datos (§84)</span>
          </button>

          {savedSearches.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-stone-400 hover:text-rose-600 transition-colors"
            >
              Borrar todas las búsquedas locales
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

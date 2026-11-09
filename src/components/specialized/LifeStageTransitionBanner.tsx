/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Madrid Apoyo Especializado v1.7 - Avisos de Transición entre Etapas Vitales
 * Avisos preventivos sin almacenar fecha de nacimiento ni datos de edad exacta (§85)
 */

import React from 'react';
import { LifeStageTransitionDef, LifeStage } from '../../types/specialized';
import { LIFE_STAGE_TRANSITIONS, LIFE_STAGES } from '../../data/specializedTaxonomy';
import { AlertCircle, ArrowRight, X, Clock, HelpCircle } from 'lucide-react';

interface LifeStageTransitionBannerProps {
  currentLifeStage: LifeStage | null;
  onTransitionToNextStage: (nextStage: LifeStage) => void;
  onDismiss: () => void;
}

export const LifeStageTransitionBanner: React.FC<LifeStageTransitionBannerProps> = ({
  currentLifeStage,
  onTransitionToNextStage,
  onDismiss
}) => {
  if (!currentLifeStage) return null;

  const transitionDef = LIFE_STAGE_TRANSITIONS[currentLifeStage];
  if (!transitionDef) return null;

  return (
    <div className="bg-amber-50/90 border border-amber-300 rounded-xl p-4 mb-6 shadow-xs text-xs text-amber-950">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <Clock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-amber-900 text-sm">
              {transitionDef.alert_title}
            </h4>
            <p className="leading-relaxed text-amber-900/90 max-w-3xl">
              {transitionDef.description}
            </p>
            <div className="font-semibold text-amber-950 pt-1">
              Recomendación preventiva: {transitionDef.recommended_action}
            </div>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="p-1 text-amber-700 hover:text-amber-900 rounded-md hover:bg-amber-100 transition-colors"
          title="Ocultar aviso de transición"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3 pt-3 border-t border-amber-200/80 flex items-center gap-3 flex-wrap">
        <button
          type="button"
          onClick={() => onTransitionToNextStage(transitionDef.next_stage)}
          className="px-3.5 py-1.5 bg-amber-900 text-amber-50 font-semibold rounded-lg hover:bg-amber-950 transition-colors flex items-center gap-1.5"
        >
          <span>Ver recursos para {LIFE_STAGES[transitionDef.next_stage].label}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={onDismiss}
          className="text-amber-800 hover:text-amber-950 font-medium"
        >
          No mostrar ahora
        </button>
      </div>
    </div>
  );
};

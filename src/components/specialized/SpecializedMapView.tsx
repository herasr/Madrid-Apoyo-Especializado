/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Madrid Apoyo Especializado v1.7 - Synchronized Interactive Map View
 * Mapa profesional interactivo con teselas oficiales de OpenStreetMap (§63, §67).
 * Marcadores HTML personalizados por nivel de evidencia (A1, A2, B1, B2, C),
 * círculo de radio geográfico y panel lateral sincronizado sin filtros redundantes.
 */

import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import { EvaluatedCentreResult } from '../../types/specialized';
import { 
  MapPin, 
  ZoomIn, 
  ZoomOut, 
  Compass, 
  Maximize2, 
  Crosshair, 
  AlertTriangle,
  ChevronRight
} from 'lucide-react';

interface MapViewProps {
  results: EvaluatedCentreResult[];
  selectedCentreId: string | null;
  onSelectCentre: (centreId: string) => void;
  onWhyAppears: (item: EvaluatedCentreResult) => void;
  originCoords: [number, number];
  originName: string;
  radiusKm: number;
}

export const SpecializedMapView: React.FC<MapViewProps> = ({
  results,
  selectedCentreId,
  onSelectCentre,
  onWhyAppears,
  originCoords,
  originName,
  radiusKm
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const originLayerRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const [searchFilterText, setSearchFilterText] = useState('');

  // Separar los que tienen coordenadas de los que no las tienen (§63, GEO-001/002)
  const geocodedResults = useMemo(() => {
    return results.filter(r => r.centre.has_valid_coordinates && r.centre.coordinates);
  }, [results]);

  const withoutCoordinates = useMemo(() => {
    return results.filter(r => !r.centre.has_valid_coordinates);
  }, [results]);

  // Filtrado interno exclusivo por texto de búsqueda en el panel lateral (sin filtros por nivel de evidencia)
  const displayedCentres = useMemo(() => {
    return geocodedResults.filter(r => {
      if (searchFilterText.trim()) {
        const query = searchFilterText.toLowerCase();
        const nameMatch = r.centre.official_name.toLowerCase().includes(query);
        const muniMatch = r.centre.municipality.toLowerCase().includes(query);
        const typeMatch = (r.centre.subtype || r.centre.centre_type).toLowerCase().includes(query);
        return nameMatch || muniMatch || typeMatch;
      }
      return true;
    });
  }, [geocodedResults, searchFilterText]);

  // Configuración de colores por nivel de evidencia oficial (§27)
  const getEvidenceColor = (level: string) => {
    switch (level) {
      case 'A1': return { bg: '#059669', border: '#047857', text: '#ffffff' };
      case 'A2': return { bg: '#0d9488', border: '#0f766e', text: '#ffffff' };
      case 'B1': return { bg: '#0284c7', border: '#0369a1', text: '#ffffff' };
      case 'B2': return { bg: '#4f46e5', border: '#4338ca', text: '#ffffff' };
      default:   return { bg: '#57534e', border: '#44403c', text: '#ffffff' };
    }
  };

  // 1. Inicialización única del mapa Leaflet con OpenStreetMap puro
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: originCoords,
      zoom: 11,
      zoomControl: false,
      attributionControl: true
    });

    const osmUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
    const osmLayer = L.tileLayer(osmUrl, {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
    }).addTo(map);

    tileLayerRef.current = osmLayer;

    const markersGroup = L.layerGroup().addTo(map);
    const originGroup = L.layerGroup().addTo(map);

    markersLayerRef.current = markersGroup;
    originLayerRef.current = originGroup;
    mapInstanceRef.current = map;

    setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Actualización de marcador de origen y círculo de radio
  useEffect(() => {
    const map = mapInstanceRef.current;
    const originGroup = originLayerRef.current;
    if (!map || !originGroup) return;

    originGroup.clearLayers();

    const originHtml = `
      <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
        <span style="position: absolute; width: 28px; height: 28px; border-radius: 50%; background: rgba(59, 130, 246, 0.25); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
        <div style="width: 18px; height: 18px; border-radius: 50%; background: #2563eb; border: 3px solid #ffffff; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; z-index: 2;">
          <div style="width: 5px; height: 5px; border-radius: 50%; background: #ffffff;"></div>
        </div>
      </div>
    `;

    const originIcon = L.divIcon({
      html: originHtml,
      className: 'origin-marker-icon',
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    const originMarker = L.marker(originCoords, { icon: originIcon, zIndexOffset: 500 });
    originMarker.bindTooltip(`<strong>Origen:</strong> ${originName}`, {
      direction: 'top',
      offset: [0, -10],
      className: 'leaflet-origin-tooltip'
    });
    originGroup.addLayer(originMarker);

    if (radiusKm > 0) {
      const radiusCircle = L.circle(originCoords, {
        radius: radiusKm * 1000,
        color: '#2563eb',
        weight: 1.5,
        dashArray: '5, 5',
        fillColor: '#3b82f6',
        fillOpacity: 0.05
      });
      radiusCircle.bindTooltip(`Radio de búsqueda: ${radiusKm} km desde ${originName}`, {
        sticky: true
      });
      originGroup.addLayer(radiusCircle);
    }
  }, [originCoords, originName, radiusKm]);

  // 3. Actualización de marcadores de centros
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    displayedCentres.forEach((item) => {
      const [lat, lon] = item.centre.coordinates!;
      const isSelected = selectedCentreId === item.centre.centre_id;
      const col = getEvidenceColor(item.evidence_level);

      const markerHtml = `
        <div class="custom-centre-marker" style="
          position: relative;
          width: ${isSelected ? '36px' : '30px'};
          height: ${isSelected ? '36px' : '30px'};
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          background: ${col.bg};
          border: 2px solid #ffffff;
          box-shadow: 0 3px 8px rgba(0,0,0,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
          ${isSelected ? 'border-color: #0f172a; box-shadow: 0 0 0 4px rgba(15, 23, 42, 0.35);' : ''}
        ">
          <span style="
            transform: rotate(45deg);
            font-size: ${isSelected ? '11px' : '10px'};
            font-weight: 800;
            color: ${col.text};
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            line-height: 1;
          ">${item.evidence_level}</span>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'centre-marker-icon',
        iconSize: [isSelected ? 36 : 30, isSelected ? 36 : 30],
        iconAnchor: [isSelected ? 18 : 15, isSelected ? 36 : 30],
        popupAnchor: [0, isSelected ? -36 : -30]
      });

      const marker = L.marker([lat, lon], {
        icon: customIcon,
        zIndexOffset: isSelected ? 1000 : 100
      });

      marker.bindTooltip(`
        <div style="font-size: 11px; padding: 4px; line-height: 1.4;">
          <strong style="display: block; font-size: 12px; margin-bottom: 2px;">${item.centre.official_name}</strong>
          <div style="color: #44403c; font-weight: 600;">
            ${item.centre.public_private_status === 'red_publica' ? 'Red Pública' : 
              item.centre.public_private_status === 'concertado' ? 'Centro Concertado' : 'Privado Autorizado'}
          </div>
          <div style="color: #78716c;">${item.distance_label} desde origen</div>
        </div>
      `, { direction: 'top', offset: [0, -25] });

      const popupDiv = document.createElement('div');
      popupDiv.className = 'p-1 text-stone-900';
      popupDiv.style.minWidth = '240px';
      popupDiv.style.maxWidth = '300px';

      popupDiv.innerHTML = `
        <div style="margin-bottom: 6px;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
            <span style="background: ${col.bg}; color: #ffffff; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700; font-family: monospace;">
              NIVEL ${item.evidence_level}
            </span>
            <span style="font-size: 11px; font-weight: 700; color: #0f172a; font-family: monospace;">
              ${item.distance_label}
            </span>
          </div>
          <h4 style="font-size: 13px; font-weight: 700; margin-top: 6px; margin-bottom: 2px; line-height: 1.3; color: #1c1917;">
            ${item.centre.official_name}
          </h4>
          <p style="font-size: 11px; color: #57534e; margin: 0; line-height: 1.3;">
            ${item.centre.municipality}${item.centre.district ? ` (Distrito ${item.centre.district})` : ''} · ${item.centre.subtype || item.centre.centre_type}
          </p>
        </div>
      `;

      const whyBtn = document.createElement('button');
      whyBtn.style.marginTop = '8px';
      whyBtn.style.width = '100%';
      whyBtn.style.padding = '6px 10px';
      whyBtn.style.background = '#1c1917';
      whyBtn.style.color = '#ffffff';
      whyBtn.style.borderRadius = '6px';
      whyBtn.style.fontSize = '11px';
      whyBtn.style.fontWeight = '600';
      whyBtn.style.border = 'none';
      whyBtn.style.cursor = 'pointer';
      whyBtn.style.display = 'flex';
      whyBtn.style.alignItems = 'center';
      whyBtn.style.justifyContent = 'center';
      whyBtn.style.gap = '4px';
      whyBtn.innerHTML = '<span>Ver por qué aparece (Evidencia)</span>';
      whyBtn.onclick = (e) => {
        e.stopPropagation();
        onWhyAppears(item);
      };

      popupDiv.appendChild(whyBtn);
      marker.bindPopup(popupDiv);

      marker.on('click', () => {
        onSelectCentre(item.centre.centre_id);
      });

      markersGroup.addLayer(marker);

      if (isSelected) {
        setTimeout(() => {
          marker.openPopup();
        }, 100);
      }
    });

    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [displayedCentres, selectedCentreId]);

  // Ajustar la vista automáticamente SOLO cuando cambian los resultados de centros
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
        handleFitAll();
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [displayedCentres]);

  const handleFitAll = () => {
    if (!mapInstanceRef.current) return;
    if (displayedCentres.length === 0) {
      mapInstanceRef.current.setView(originCoords, 11);
      return;
    }
    const bounds = L.latLngBounds([originCoords]);
    displayedCentres.forEach(c => {
      if (c.centre.coordinates) {
        bounds.extend(c.centre.coordinates);
      }
    });
    mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
  };

  const handleCenterOrigin = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setView(originCoords, 12, { animate: true });
  };

  const handleCentreCardClick = (item: EvaluatedCentreResult) => {
    onSelectCentre(item.centre.centre_id);
    if (!mapInstanceRef.current || !item.centre.coordinates) return;
    mapInstanceRef.current.setView(item.centre.coordinates, 14, { animate: true });
  };



  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs mb-8">
      {/* 1. Cabecera del mapa */}
      <div className="px-5 py-3 border-b border-stone-200 bg-stone-50 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs">
          <Compass className="w-4 h-4 text-stone-700" />
          <span className="font-bold text-stone-900">
            Mapa interactivo (OpenStreetMap)
          </span>
          <span className="text-stone-500 font-mono">
            ({geocodedResults.length} georreferenciados)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleFitAll}
            className="px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 text-xs font-medium flex items-center gap-1 cursor-pointer"
            title="Ajustar la vista a todos los centros"
            aria-label="Ajustar la vista del mapa a todos los centros"
          >
            <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Ajustar vista</span>
          </button>

          <button
            type="button"
            onClick={handleCenterOrigin}
            className="px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 text-xs font-medium flex items-center gap-1 cursor-pointer"
            title="Centrar en el punto de origen seleccionado"
            aria-label="Centrar el mapa en el punto de origen seleccionado"
          >
            <Crosshair className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Ir al origen</span>
          </button>
        </div>
      </div>

      {/* 2. Cuerpo del mapa: Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[560px]">
        <div className="lg:col-span-8 relative h-[480px] lg:h-[580px] w-full bg-stone-100">
          <div ref={mapContainerRef} className="w-full h-full z-0" />

          {/* Controles de Zoom */}
          <div className="absolute top-3 left-3 z-[400] flex flex-col gap-1 shadow-md rounded-lg overflow-hidden border border-stone-300 bg-white" role="toolbar" aria-label="Controles de zoom del mapa">
            <button
              type="button"
              onClick={() => mapInstanceRef.current?.zoomIn()}
              className="p-2 hover:bg-stone-100 text-stone-700 transition-colors border-b border-stone-200 cursor-pointer"
              title="Acercar mapa"
              aria-label="Acercar mapa"
            >
              <ZoomIn className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => mapInstanceRef.current?.zoomOut()}
              className="p-2 hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
              title="Alejar mapa"
              aria-label="Alejar mapa"
            >
              <ZoomOut className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          {/* Tarjeta flotante de origen */}
          <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-sm border border-stone-300 rounded-lg px-3 py-2 text-xs shadow-md max-w-xs">
            <div className="flex items-center gap-1.5 font-bold text-stone-900">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block animate-pulse" />
              <span>{originName}</span>
            </div>
            <div className="text-[11px] text-stone-600 mt-0.5">
              Radio: <span className="font-mono font-bold text-stone-900">{radiusKm} km</span>
            </div>
          </div>
        </div>

        {/* Panel lateral de centros en el mapa (sin filtros por nivel de evidencia) */}
        <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-stone-200 bg-white flex flex-col h-[480px] lg:h-[580px]">
          <div className="p-3 border-b border-stone-200 bg-stone-50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-900">
                Centros en mapa ({displayedCentres.length})
              </span>
            </div>

            <input
              type="text"
              value={searchFilterText}
              onChange={(e) => setSearchFilterText(e.target.value)}
              placeholder="Buscar en el mapa por nombre o municipio..."
              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white focus:outline-none focus:border-stone-900"
            />
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-stone-100 p-2 space-y-1">
            {displayedCentres.length === 0 ? (
              <div className="p-6 text-center text-xs text-stone-500">
                No hay centros georreferenciados.
              </div>
            ) : (
              displayedCentres.map((item) => {
                const isSelected = selectedCentreId === item.centre.centre_id;
                const col = getEvidenceColor(item.evidence_level);

                return (
                  <div
                    key={item.centre.centre_id}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                    aria-label={`Ver ${item.centre.official_name} en el mapa`}
                    onClick={() => handleCentreCardClick(item)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleCentreCardClick(item);
                      }
                    }}
                    className={`p-3 rounded-lg text-left cursor-pointer transition-all border outline-none focus-visible:ring-2 focus-visible:ring-stone-900 ${
                      isSelected
                        ? 'border-stone-900 bg-stone-50 shadow-xs'
                        : 'border-transparent hover:border-stone-200 hover:bg-stone-50/70'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span 
                          className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded text-white"
                          style={{ backgroundColor: col.bg }}
                        >
                          {item.evidence_level}
                        </span>
                        <span className="text-[11px] font-bold text-stone-600">
                          {item.centre.municipality}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-mono font-bold text-xs text-stone-900">
                          {item.distance_label}
                        </div>
                        {item.transit_time_label && (
                          <div className="font-mono text-[10px] text-blue-800 font-medium">
                            {item.transit_time_label}
                          </div>
                        )}
                      </div>
                    </div>

                    <h5 className="font-bold text-xs text-stone-900 mt-1.5 line-clamp-1 leading-snug">
                      {item.centre.official_name}
                    </h5>

                    <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                      {item.centre.subtype || item.centre.centre_type}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {withoutCoordinates.length > 0 && (
        <div className="px-5 py-3 bg-stone-50 border-t border-stone-200 text-xs text-stone-700 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <strong>Recursos sin coordenadas geográficas ({withoutCoordinates.length}):</strong>{' '}
            {withoutCoordinates.map(c => c.centre.official_name).join(', ')}. Permanecen en la lista principal pero no en el mapa.
          </div>
        </div>
      )}
    </div>
  );
};

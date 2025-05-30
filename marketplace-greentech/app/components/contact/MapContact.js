import React, { useEffect, useRef } from 'react';

export default function MapContact() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    // Charger Leaflet dynamiquement
    const loadLeaflet = async () => {
      if (typeof window !== 'undefined' && !window.L) {
        // Charger CSS de Leaflet
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
        document.head.appendChild(link);

        // Ajouter des styles personnalisés pour contrôler le z-index
        const customStyles = document.createElement('style');
        customStyles.textContent = `
          .leaflet-container {
            z-index: 1 !important;
          }
          .leaflet-control-container {
            z-index: 2 !important;
          }
          .leaflet-popup {
            z-index: 3 !important;
          }
          .leaflet-tooltip {
            z-index: 3 !important;
          }
          .leaflet-marker-icon {
            z-index: 2 !important;
          }
          .leaflet-shadow-pane {
            z-index: 1 !important;
          }
          .leaflet-overlay-pane {
            z-index: 1 !important;
          }
          .leaflet-map-pane {
            z-index: 1 !important;
          }
        `;
        document.head.appendChild(customStyles);

        // Charger JS de Leaflet
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';

        return new Promise((resolve) => {
          script.onload = resolve;
          document.head.appendChild(script);
        });
      }
    };

    const initializeMap = async () => {
      await loadLeaflet();

      if (mapRef.current && window.L && !mapInstanceRef.current) {
        // Coordonnées de Fianarantsoa, Madagascar
        const fianarantsoa = [-21.4527, 47.0857];
        const antarandolo = [-21.4580, 47.0920]; // Coordonnées approximatives d'Antarandolo

        // Initialiser la carte
        const map = window.L.map(mapRef.current, {
          center: fianarantsoa,
          zoom: 13,
          zoomControl: true,
          zoomControlOptions: {
            position: 'topright'
          }
        });

        // Ajouter les tuiles OpenStreetMap
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(map);

        // Créer une icône personnalisée verte
        const greenIcon = window.L.divIcon({
          html: `
            <div style="
              background-color: #16a34a;
              width: 30px;
              height: 30px;
              border-radius: 50% 50% 50% 0;
              transform: rotate(45deg);
              border: 3px solid #ffffff;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <div style="
                transform: rotate(-45deg);
                color: white;
                font-size: 14px;
                font-weight: bold;
              ">🌱</div>
            </div>
          `,
          className: 'custom-div-icon',
          iconSize: [30, 30],
          iconAnchor: [15, 30]
        });

        // Ajouter le marqueur pour GreenTech Marketplace
        const marker = window.L.marker(antarandolo, { icon: greenIcon }).addTo(map);

        marker.bindPopup(`
          <div style="font-family: Arial, sans-serif; max-width: 200px;">
            <div style="color: #16a34a; font-weight: bold; font-size: 16px; margin-bottom: 8px;">
              GreenTech Marketplace
            </div>
            <div style="color: #374151; font-size: 14px; line-height: 1.4;">
              <strong>Localisation:</strong> Antarandolo<br/>
              <strong>Ville:</strong> Fianarantsoa<br/>
              <strong>Région:</strong> Haute Matsiatra<br/>
              <strong>Pays:</strong> Madagascar
            </div>
            <div style="margin-top: 8px; padding: 6px; background-color: #f0f9ff; border-radius: 4px; font-size: 12px; color: #0369a1;">
             Plateforme de réutilisation de matériaux de construction et d'artisanat à Madagascar.
            </div>
          </div>
        `);

        // Ajouter un cercle pour montrer la zone de service
        window.L.circle(antarandolo, {
          color: '#16a34a',
          fillColor: '#16a34a',
          fillOpacity: 0.1,
          radius: 2000 // 2km de rayon
        }).addTo(map);

        // Ajouter des marqueurs pour quelques points d'intérêt à Fianarantsoa
        const pointsInteret = [
          {
            coords: [-21.4534, 47.0845],
            nom: "Centre-ville Fianarantsoa",
            description: "Centre historique de la ville"
          },
          {
            coords: [-21.4490, 47.0880],
            nom: "Université de Fianarantsoa",
            description: "Principale université de la région"
          },
          {
            coords: [-21.4610, 47.0890],
            nom: "Gare ferroviaire",
            description: "Connexion vers la côte est"
          }
        ];

        pointsInteret.forEach(point => {
          const simpleIcon = window.L.divIcon({
            html: `
              <div style="
                background-color: #6b7280;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                border: 2px solid #ffffff;
                box-shadow: 0 1px 4px rgba(0,0,0,0.3);
              "></div>
            `,
            className: 'simple-marker',
            iconSize: [12, 12],
            iconAnchor: [6, 6]
          });

          window.L.marker(point.coords, { icon: simpleIcon })
            .addTo(map)
            .bindPopup(`
              <div style="font-family: Arial, sans-serif;">
                <strong style="color: #374151;">${point.nom}</strong><br/>
                <span style="color: #6b7280; font-size: 12px;">${point.description}</span>
              </div>
            `);
        });

        mapInstanceRef.current = map;

        // Animation d'ouverture du popup après un délai
        setTimeout(() => {
          marker.openPopup();
        }, 1000);
      }
    };

    initializeMap();

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div>
      {/* Map Section - Modern Design */}
      <section className="relative py-12 md:py-16 lg:py-20 bg-gradient-to-br from-white via-gray-50 to-green-50 overflow-hidden" style={{ zIndex: 1 }}>
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-40"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 bg-emerald-100 rounded-full mix-blend-multiply filter blur-xl opacity-40"></div>
        </div>

        <div className="relative container mx-auto px-4" style={{ zIndex: 1 }}>
          {/* Header */}
          <div className="text-center mb-8 lg:mb-12">
            <div className="inline-flex items-center px-3 py-1.5 lg:px-4 lg:py-2 bg-green-100 text-green-800 rounded-full text-xs lg:text-sm font-medium mb-4 lg:mb-6">
              <svg className="w-3 h-3 lg:w-4 lg:h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              Notre Localisation
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 lg:mb-6">
              Où nous
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"> trouver</span>
            </h2>

            <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Visitez-nous à Antarandolo, Fianarantsoa pour découvrir notre plateforme de réutilisation de matériaux.
            </p>
          </div>

          {/* Map Container */}
          <div className="group relative max-w-6xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl lg:rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-xl lg:rounded-3xl border border-white/50 shadow-2xl overflow-hidden" style={{ zIndex: 1 }}>

              {/* Map */}
              <div
                ref={mapRef}
                className="h-64 sm:h-80 lg:h-96 xl:h-[500px] w-full relative"
                style={{ minHeight: '300px', zIndex: 1 }}
              >
                {/* Fallback content while map loads */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 lg:h-12 lg:w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-sm lg:text-base">Chargement de la carte...</p>
                  </div>
                </div>
              </div>

              {/* Info Panel */}
              <div className="p-4 lg:p-8 bg-gradient-to-r from-green-50/80 to-emerald-50/80 backdrop-blur-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">

                  {/* Location Info */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                      </div>
                      <h3 className="text-lg lg:text-xl font-bold text-gray-900">GreenTech Marketplace</h3>
                    </div>

                    <div className="space-y-2 text-sm lg:text-base text-gray-600 ml-13">
                      <p><span className="font-semibold text-gray-800">Adresse:</span> Antarandolo, Fianarantsoa</p>
                      <p><span className="font-semibold text-gray-800">Région:</span> Haute Matsiatra</p>
                      <p><span className="font-semibold text-gray-800">Code postal:</span> 301</p>
                      <p><span className="font-semibold text-gray-800">Pays:</span> Madagascar 🇲🇬</p>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      </div>
                      <h4 className="text-lg lg:text-xl font-bold text-gray-900">Zone de Service</h4>
                    </div>

                    <div className="space-y-2 text-sm lg:text-base text-gray-600 ml-13">
                      <p><span className="font-semibold text-gray-800">Rayon:</span> 2 km autour de notre localisation</p>
                      <p><span className="font-semibold text-gray-800">Couverture:</span> Fianarantsoa et environs</p>
                      <p><span className="font-semibold text-gray-800">Transport:</span> Accessible par route principale</p>
                      <p><span className="font-semibold text-gray-800">Proximité:</span> Centre-ville, université, gare</p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
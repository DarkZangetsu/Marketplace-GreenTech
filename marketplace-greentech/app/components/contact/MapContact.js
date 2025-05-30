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
      {/* Map Section */}
      <section className="py-8 relative" style={{ zIndex: 1 }}>
        <div className="container mx-auto px-4 relative" style={{ zIndex: 1 }}>
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Localisation
            </h2>
            <p className="text-green-600 font-medium">
              Antarandolo, Fianarantsoa - Madagascar
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden relative" style={{ zIndex: 1 }}>
            <div
              ref={mapRef}
              className="h-96 w-full relative"
              style={{ minHeight: '400px', zIndex: 1 }}
            >
              {/* Fallback content while map loads */}
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                  <p className="text-gray-500 text-sm">Chargement de la carte...</p>
                </div>
              </div>
            </div>

            {/* Info panel */}
            <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-green-600 mb-3 flex items-center">
                    GreenTech Marketplace
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>Adresse:</strong> Antarandolo, Fianarantsoa</p>
                    <p><strong>Région:</strong> Haute Matsiatra</p>
                    <p><strong>Code postal:</strong> 301</p>
                    <p><strong>Pays:</strong> Madagascar 🇲🇬</p>
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
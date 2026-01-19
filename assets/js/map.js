// NOWA Interactive Map
class NOWAMap {
  constructor() {
    this.map = null;
    this.markers = [];
    this.init();
  }

  init() {
    this.createMapSection();
    this.loadLeaflet();
  }

  createMapSection() {
    const mapHTML = `
      <section id="interactive-map" class="py-16 bg-white">
        <div class="max-w-7xl mx-auto px-4">
          <div class="text-center mb-8" data-aos="fade-up">
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Find NOWA Merchants Near You</h3>
            <p class="text-gray-600 max-w-2xl mx-auto">Discover participating merchants and transportation routes in your area</p>
          </div>
          <div id="map" class="h-96 rounded-xl shadow-lg" data-aos="fade-up" data-aos-delay="200"></div>
          <div class="mt-6 text-center text-sm text-gray-600">
            <p>Click on markers to see merchant details • Map data provided by OpenStreetMap</p>
          </div>
        </div>
      </section>
    `;

    // Insert before FAQ section
    const faqSection = document.getElementById('faq');
    if (faqSection) {
      faqSection.insertAdjacentHTML('beforebegin', mapHTML);
    }
  }

  loadLeaflet() {
    // Load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    // Load Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => this.initMap();
    document.head.appendChild(script);
  }

  initMap() {
    // Initialize map centered on Nakuru, Kenya
    this.map = L.map('map').setView([-0.3031, 36.0822], 13);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(this.map);

    // Custom NOWA marker icon
    const nowaIcon = L.icon({
      iconUrl: 'images/nowa-icon.png',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    });

    // Sample merchant locations (Nakuru area)
    const merchants = [
      {
        lat: -0.3031,
        lng: 36.0822,
        name: 'Green Groceries CBD',
        type: 'Grocery Store',
        description: 'Fresh produce and daily essentials'
      },
      {
        lat: -0.2980,
        lng: 36.0750,
        name: 'Corner Cafe Riverside',
        type: 'Restaurant',
        description: 'Coffee and local cuisine'
      },
      {
        lat: -0.3100,
        lng: 36.0900,
        name: 'Wellness Pharmacy',
        type: 'Pharmacy',
        description: 'Healthcare products and services'
      },
      {
        lat: -0.3050,
        lng: 36.0850,
        name: 'Tech Hub Nakuru',
        type: 'Electronics',
        description: 'Gadgets and accessories'
      }
    ];

    // Add markers
    merchants.forEach(merchant => {
      const marker = L.marker([merchant.lat, merchant.lng], { icon: nowaIcon })
        .addTo(this.map)
        .bindPopup(`
          <div class="p-2">
            <h4 class="font-bold text-gray-900">${merchant.name}</h4>
            <p class="text-sm text-blue-600 mb-1">${merchant.type}</p>
            <p class="text-sm text-gray-600">${merchant.description}</p>
            <button class="mt-2 px-3 py-1 bg-emerald-600 text-white text-xs rounded hover:bg-emerald-700 transition">
              Get Directions
            </button>
          </div>
        `);

      this.markers.push(marker);
    });

    // Add route visualization (sample)
    this.addSampleRoute();

    // Add user location button
    this.addLocationButton();
  }

  addSampleRoute() {
    // Sample route coordinates (simplified)
    const routeCoords = [
      [-0.3031, 36.0822], // Start
      [-0.2980, 36.0750], // Point
      [-0.3100, 36.0900], // Point
      [-0.3050, 36.0850]  // End
    ];

    L.polyline(routeCoords, {
      color: '#10b981',
      weight: 4,
      opacity: 0.7,
      dashArray: '10, 10'
    }).addTo(this.map).bindPopup('Popular NOWA transportation route');
  }

  addLocationButton() {
    // Add locate user button
    const locateBtn = L.control({ position: 'topright' });

    locateBtn.onAdd = () => {
      const div = L.DomUtil.create('div', 'leaflet-control-locate');
      div.innerHTML = `
        <button class="bg-white border border-gray-300 rounded p-2 shadow hover:bg-gray-50 transition" title="Find my location">
          <i data-lucide="map-pin" class="w-4 h-4 text-gray-600"></i>
        </button>
      `;

      div.onclick = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            this.map.setView([latitude, longitude], 15);

            // Add user marker
            L.marker([latitude, longitude], {
              icon: L.icon({
                iconUrl: 'data:image/svg+xml;base64,' + btoa(`
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" fill="#ef4444" stroke="white" stroke-width="2"/>
                    <circle cx="12" cy="12" r="4" fill="white"/>
                  </svg>
                `),
                iconSize: [24, 24],
                iconAnchor: [12, 24]
              })
            }).addTo(this.map).bindPopup('Your Location');
          });
        }
      };

      return div;
    };

    locateBtn.addTo(this.map);
  }
}

// Initialize map when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new NOWAMap();
});
// Crear el mapa y establecer la vista inicial
var map = L.map('map').setView([-27.47535, -58.85267], 30);

const toggleListBtn = document.getElementById('toggleListBtn');
const sidebar = document.getElementById('sidebar');
const mapDiv = document.getElementById('map');

toggleListBtn.addEventListener('click', function() {
    sidebar.classList.toggle('retracted');
    mapDiv.style.width = sidebar.classList.contains('retracted') ? '100%' : '100%';
    //toggleListBtn.textContent = sidebar.classList.contains('retracted') ? '→' : '←';
});


// Añadir el fondo de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Crear un ícono personalizado para los pines
var customIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38]
});

// Inicializar contador de pines
var pinCounter = 1;

// Cargar los pines guardados en localStorage
loadPins();

// Función para añadir un pin donde se haga clic en el mapa
function onMapClick(e) {
    var pinName = prompt("Introduce el nombre para este pin:");
    if (pinName === null) {
      return;

    }
    if (pinName.trim() === "") {
        // Generar un nombre automáticamente si no se proporciona uno
        pinName = `Pin ${pinCounter++}`;
      }
    addPin(pinName, e.latlng);
    savePin(pinName, e.latlng);
}

// Añadir el evento de clic al mapa
map.on('click', onMapClick);

// Función para añadir un pin al mapa y a la lista
function addPin(name, latlng) {
    var marker = L.marker(latlng, {icon: customIcon}).addTo(map)
        .bindPopup(name)
        .openPopup();

    var pinList = document.getElementById('pinItems');
    var pinItem = document.createElement('div');
    pinItem.className = 'pin-item';
    pinItem.innerHTML = `${name} - [${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}] <button class="delete-btn">Borrar</button>`;
    
    pinList.appendChild(pinItem).addEventListener('click',() => map.setView([latlng.lat.toFixed(5), latlng.lng.toFixed(5)]));

    // Añadir evento de borrado al botón
    pinItem.querySelector('.delete-btn').addEventListener('click', function() {
        map.removeLayer(marker);
        pinList.removeChild(pinItem);
        deletePin(name, latlng);
    });
}

// Guardar el pin en localStorage
function savePin(name, latlng) {
    var pins = JSON.parse(localStorage.getItem('pins')) || [];
    pins.push({ name: name, latlng: latlng });
    localStorage.setItem('pins', JSON.stringify(pins));
}

// Cargar los pines guardados y añadirlos al mapa y la lista
function loadPins() {
    var pins = JSON.parse(localStorage.getItem('pins')) || [];
    pins.forEach(pin => {
        addPin(pin.name, pin.latlng);
    });
}

// Borrar el pin de localStorage
function deletePin(name, latlng) {
    var pins = JSON.parse(localStorage.getItem('pins')) || [];
    pins = pins.filter(pin => pin.name !== name || pin.latlng.lat !== latlng.lat || pin.latlng.lng !== latlng.lng);
    localStorage.setItem('pins', JSON.stringify(pins));
}

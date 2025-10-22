window.addEventListener("DOMContentLoaded", () => {
  console.log("✅ app.js çalıştı, harita hazırlanıyor...");

  // === 🟢 Daktilo efekti ===
  const typingText = document.querySelector(".typing-text");
  const text = Array.from("Hoşgeldiniz! Ben Oktay Duman 👋"); // Türkçe karakter & emoji desteği
  let index = 0;
  typingText.textContent = "";

  function type() {
    if (index < text.length) {
      typingText.textContent += text[index];
      index++;
      setTimeout(type, 100);
    }
  }
  type();

  // === 🗺️ Harita ===
  if (!window.ol) {
    console.error("❌ OpenLayers (ol) yüklenemedi!");
    return;
  }

  // Görünüm (Ankara merkezli)
  const view = new ol.View({
    center: ol.proj.fromLonLat([32.8597, 39.9334]),
    zoom: 12,
  });

  // Farklı harita teması (Stamen Watercolor)
  const stamenLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: "https://tile.stamen.com/watercolor/{z}/{x}/{y}.jpg",
      attributions: '© <a href="https://stamen.com/">Stamen Design</a>',
    }),
  });

  // OpenStreetMap katmanı
  const osmLayer = new ol.layer.Tile({
    source: new ol.source.OSM(),
  });

  // Harita nesnesi
  const map = new ol.Map({
    target: "map",
    layers: [osmLayer, stamenLayer],
    view: view,
  });

  // Marker
  const marker = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat([32.8597, 39.9334])),
    name: "Ankara",
    desc: "Hacettepe Üniversitesi 💡",
  });

  const vectorLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
      features: [marker],
    }),
    style: new ol.style.Style({
      image: new ol.style.Icon({
        src: "https://cdn-icons-png.flaticon.com/512/3448/3448339.png",
        scale: 0.08,
      }),
    }),
  });

  map.addLayer(vectorLayer);

  // Kontroller
  map.addControl(new ol.control.ZoomSlider());
  map.addControl(new ol.control.ScaleLine());
  map.addControl(new ol.control.FullScreen());
  map.addControl(new ol.control.OverviewMap());

  // Popup (bilgi balonu)
  const popup = document.createElement("div");
  popup.className = "ol-popup";
  popup.innerHTML = "";
  document.body.appendChild(popup);

  const overlay = new ol.Overlay({
    element: popup,
    positioning: "bottom-center",
    stopEvent: false,
    offset: [0, -20],
  });
  map.addOverlay(overlay);

  map.on("click", (e) => {
    const feature = map.forEachFeatureAtPixel(e.pixel, (f) => f);
    if (feature) {
      const coord = feature.getGeometry().getCoordinates();
      overlay.setPosition(coord);
      popup.innerHTML = `<b>${feature.get("name")}</b><br>${feature.get("desc")}`;
    } else {
      overlay.setPosition(undefined);
    }
  });

  // Koordinat yazdırma
  map.on("click", function (evt) {
    const coord = ol.proj.toLonLat(evt.coordinate);
    console.log(`🧭 Koordinatlar: ${coord[0].toFixed(4)}, ${coord[1].toFixed(4)}`);
  });
});

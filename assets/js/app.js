window.addEventListener("DOMContentLoaded", () => {
  console.log("✅ app.js çalıştı, harita hazırlanıyor...");

  // OL kütüphanesi yüklü mü kontrol et
  if (!window.ol) {
    console.error("❌ OpenLayers (ol) yüklenemedi!");
    return;
  }

  // Görünüm (Ankara merkezli)
  const view = new ol.View({
    center: ol.proj.fromLonLat([32.8597, 39.9334]),
    zoom: 12,
  });

  // === 1️⃣ Farklı harita teması (Stamen Watercolor) ===
  const stamenLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: "https://tile.stamen.com/watercolor/{z}/{x}/{y}.jpg",
      attributions: '© <a href="https://stamen.com/">Stamen Design</a>',
    }),
  });

  // === 2️⃣ OpenStreetMap katmanı (altyapı olarak) ===
  const osmLayer = new ol.layer.Tile({
    source: new ol.source.OSM(),
  });

  // === 3️⃣ Harita nesnesi ===
  const map = new ol.Map({
    target: "map",
    layers: [osmLayer, stamenLayer],
    view: view,
  });

  // === 4️⃣ Marker (ikon) ===
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

  // === 5️⃣ Harita kontrolleri ===
  map.addControl(new ol.control.ZoomSlider());
  map.addControl(new ol.control.ScaleLine());
  map.addControl(new ol.control.FullScreen());
  map.addControl(new ol.control.OverviewMap());

  // === 6️⃣ Popup (bilgi balonu) ===
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

  // === 7️⃣ Tıklanan konumu konsola yazdır ===
  map.on("click", function (evt) {
    const coord = ol.proj.toLonLat(evt.coordinate);
    console.log(`🧭 Koordinatlar: ${coord[0].toFixed(4)}, ${coord[1].toFixed(4)}`);
  });
});

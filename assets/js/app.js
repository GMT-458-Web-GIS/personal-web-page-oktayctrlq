window.addEventListener("DOMContentLoaded", () => {
  // Basit OpenStreetMap katmanı
  const map = new ol.Map({
    target: "map",
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(),
      }),
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([32.8597, 39.9334]), // Ankara koordinatları
      zoom: 10,
    }),
  });
});

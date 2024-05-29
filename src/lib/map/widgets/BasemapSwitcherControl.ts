// import * as maptilersdk from '@maptiler/sdk';
// import * as ml from 'maplibre-gl';

// export const basemaps = {
// 	"TOPO": {
// 		img: "/basemap-topo.png"
// 	},
// 	"SATELLITE": {
// 		img: "/basemap-satellite.png"
// 	}
// }

// export const initialBasemapStyle = (maptilersdk.MapStyle as any)[Object.keys(basemaps)[0]];

// export class BasemapSwitcherControl {
// 	private _container: HTMLDivElement;
// 	private _options: any;
// 	private _map?: ml.Map;
// 	private _callback: () => void;

// 	constructor(switchCallback: () => void, options: any) {
// 		this._callback = switchCallback;
// 		this._options = { ...options };
// 		this._container = document.createElement("div");
// 		this._container.classList.add("maplibregl-ctrl");
// 		this._container.classList.add("maplibregl-ctrl-basemaps");
// 		this._container.classList.add("closed");
// 		switch (this._options.expandDirection || "right") {
// 			case "top":
// 				this._container.classList.add("reverse");
// 				break;
// 			case "down":
// 				this._container.classList.add("column");
// 				break;
// 			case "left":
// 				this._container.classList.add("reverse");
// 				break;
// 			case "right":
// 				this._container.classList.add("row");
// 		}
// 		this._container.addEventListener("mouseenter", () => {
// 			this._container.classList.remove("closed");
// 		});
// 		this._container.addEventListener("mouseleave", () => {
// 			this._container.classList.add("closed");
// 		});
// 	}

// 	onAdd(map: ml.Map) {
// 		this._map = map;
// 		const basemaps = this._options.basemaps;
// 		Object.keys(basemaps).forEach((layerId) => {
// 			const base = basemaps[layerId];
// 			const basemapContainer = document.createElement("img");
// 			basemapContainer.src = base.img;
// 			basemapContainer.classList.add("basemap");
// 			basemapContainer.dataset.id = layerId;
// 			basemapContainer.addEventListener("click", () => {
// 				const activeElement = this._container.querySelector(".active");
// 				activeElement?.classList.remove("active");
// 				basemapContainer.classList.add("active");
// 				const styles = maptilersdk.MapStyle as any;
// 				const newStyle = styles[layerId];

// 				if(newStyle.name !== map.getStyle().name) {
// 					// console.log("style switching");
// 					map.setStyle(styles[layerId]);

// 					// reapply sources and layers
// 					map.once('idle', () => {
// 						this._callback();
// 						// console.log('map idle reload callback');
// 					});
// 				}
// 			});
// 			Object.assign
// 			basemapContainer.classList.add("hidden");
// 			this._container.appendChild(basemapContainer);
// 			if (this._options.initialBasemap.id === layerId) {
// 				basemapContainer.classList.add("active");
// 			}
// 		});
// 		return this._container;
// 	}

// 	onRemove() {
// 		this._container.parentNode?.removeChild(this._container);
// 		delete this._map;
// 	}
// }

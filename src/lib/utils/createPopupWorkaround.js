
import pkg from 'maplibre-gl';
const {Popup} = pkg;

export const createPopupWorkaround = () => new Popup({
	closeButton: false,
	closeOnClick: false
});
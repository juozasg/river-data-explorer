
import introJs from "intro.js";
import "intro.js/introjs.css";

import { basinObject1, basinObject2 } from "$src/appstate/selection/objectDataSelections.svelte";
import { setMapMaximized } from "$src/appstate/ui/layout.svelte";

export function startTour() {
	basinObject1.set("site", 50008);
	basinObject2.set("site-catchment", 50008);

	const tour = introJs.tour().setOptions({
		steps: [
			{
				title: "Welcome #0",
				intro: "Hello World! 👋"
			},
			{
				element: document.querySelector(".help-icon"),
				title: "Help #1",
				intro: "Click here for help"
			},
			{
				// element: document.querySelector(".panel-data1 > div.basin-object-stats > table > tbody > tr:nth-child(1) > td.variable-label > div > a.graph-button.y"),
				element: document.querySelector(".basin-object-stats table tbody tr:nth-child(1)"),
				title: "Help #2",
				intro: "Click here to graph"
			},
			// {
			// 	element: document.querySelector(".user-guide"),
			// 	title: "User Guide #3",
			// 	intro: "lick here for user guide"
			// 	// intro: '<img src="https://images.unsplash.com/photo-1608096299210-db7e38487075?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" />'
			// }
		]
	});

	// setTimeout(() => {
	// 		setMapMaximized(true);
	// }, 0);

	// tour.onBeforeChange(function () {
	tour.onBeforeChange(function () {
		const step = this.getCurrentStep();

		if (step == 0) {
			// basinObject1.clear();
			// basinObject2.clear();
			setMapMaximized(true);
		}

		if (step === 2) {
			console.log("You have reached step 1");
			tour.setOption("dontShowAgain", true)
			// Site ID: lagrange-8 50008
			// Site Name: Pigeon River
			// Region Name: Pigeon River
			// Region Type: site-catchment
			// Region ID: 50008
			// Latitude, Longitude: 41.71475634806109, -85.39019646484365
			// basinObject1.set("site", 50008);
			// basinObject2.set("site-catchment", 50008);
			setMapMaximized(false);

			// alert("You cannot continue! :P");
			// return false;
		}

		return true;
	});

	setTimeout(() => {
		tour.start();
	}, 100);

}
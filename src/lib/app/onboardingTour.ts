import Cookies from "js-cookie";
import introJs from "intro.js";
import "intro.js/introjs.css";

import { basinObject1, basinObject2, chartYSelection, chartZSelection } from "$src/appstate/selection/objectDataSelections.svelte";
import { waitForElementToExist } from "../utils/dom";
// import { setMapMaximized } from "$src/appstate/ui/layout.svelte";

export async function startTour(setMapMaximized: (maximized: boolean) => void) {
	setMapMaximized(true);
	basinObject1.set("site", 50008);
	basinObject2.set("site-catchment", 50008);


	await waitForElementToExist(".help-icon");
	await waitForElementToExist(".basin-object-stats table tbody tr:nth-child(1)");

	chartYSelection.set(basinObject1, 'ph');
	chartZSelection.set(basinObject2, 'ecoli');
	await waitForElementToExist(".panel-chart .brush-outer");

	console.log('Tour starting', '.help-icon', document.querySelector(".help-icon"), 'ph line', document.querySelector(".basin-object-stats table tbody tr:nth-child(1)"));
	startTourWhenReady(setMapMaximized);
}

function startTourWhenReady(setMapMaximized: (maximized: boolean) => void) {

	const tour: introJs.Tour = introJs.tour().setOptions({
		steps: [
			{
				title: "Welcome!",
				intro: "Welcome to SJRBC River Data Explorer! This web app exists to let users explore St. Joseph River Basin data to understand what is happening with the water in the watershed."
			},
			{
				element: document.querySelector(".help-icon"),
				title: "Introduction Tour",
				intro: "You can always re-open this tour by clicking the help icon."
			},
			{
				element: document.querySelector(".user-guide"),
				title: "User Guide",
				intro: "The complete User Guide has detailed information about the application and the water data."
				// intro: '<img src="https://images.unsplash.com/photo-1608096299210-db7e38487075?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" />'
			},
			{
				element: document.querySelector(".map-container"),
				title: "The Map",
				intro: "The map shows layers of data related to the St. Joseph River Basin."
			},
			{
				element: document.querySelector(".top-controls"),
				title: "Data Controls",
				intro: "The data controls allow you to filter and manipulate the data displayed on the map."
			},
			{
				element: document.querySelector(".variable-selector"),
				title: "Variable Selector",
				intro: "The variable selector allows you to choose which water quality variables are displayed on the map."
			},
			{
				element: document.querySelector(".legend"),
				title: "Legend",
				intro: "The legend explains the meaning of the different colors used on the map for the selected variable."
			},
			{
				element: document.querySelector(".overlay-controls"),
				title: "Overlay Layers",
				intro: "Water flow quantity, elevation and land use data can be displayed as overlay layers on the map."
			},
			{
				element: document.querySelector(".bottom-controls"),
				title: "Date and Time Controls",
				intro: "Time controls set the date and time for the variable data displayed on the map. You can select a specific date or use the slider to adjust the time range. The vertical lines on the slider represent all the available data points."
			},
			{
				title: "Tooltips",
				intro: "You can hover on sites (circle markers) and rivers on the map to see more information: <br/>&nbsp;<img src='/tour-site-tooltip.jpg' />"
			},
			{
				// element: document.querySelector(".panel-data1 > div.basin-object-stats > table > tbody > tr:nth-child(1) > td.variable-label > div > a.graph-button.y"),
				element: document.querySelector(".basin-object-stats"),
				title: "Data Tables",
				intro: "Clicking on a site or a river will open the data table for that location."
			},
			{
				// element: document.querySelector(".panel-data1 > div.basin-object-stats > table > tbody > tr:nth-child(1) > td.variable-label > div > a.graph-button.y"),
				element: document.querySelector(".basin-object-stats table tbody tr:nth-child(1)"),
				title: "Graphing",
				intro: "Hovering over a variable name will show buttons to graph it over time as Y or Z axis: <br/>&nbsp;<img src='/tour-variable-tooltip.jpg' />"
			},
			{
				// element: document.querySelector(".panel-data1 > div.basin-object-stats > table > tbody > tr:nth-child(1) > td.variable-label > div > a.graph-button.y"),
				element: document.querySelector(".panel-chart"),
				title: "Variables Graph",
				intro: "Any two variables of interest for any two objects in the basin can be compared"
			},
			{
				// element: document.querySelector(".panel-data1 > div.basin-object-stats > table > tbody > tr:nth-child(1) > td.variable-label > div > a.graph-button.y"),
				element: document.querySelector(".panel-chart .brush-outer"),
				title: "Adjusting Graph Time",
				intro: "You can adjust the time range for the graph by dragging to select a time period using the slider below the graph: <br/>&nbsp;<img src='/tour-graph-brush.jpg' />"
			},

			{
				// element: document.querySelector(".panel-data1 > div.basin-object-stats > table > tbody > tr:nth-child(1) > td.variable-label > div > a.graph-button.y"),
				title: "Congratulations!",
				intro: "You're now ready to explore the St. Joseph River Basin data!"
			},
		]
	});

	// console.log('Tour started', '.help-icon', document.querySelector(".help-icon"), 'ph line', document.querySelector(".basin-object-stats table tbody tr:nth-child(1)"));
	tour.start();

	tour.onExit(function () {
		setMapMaximized(false);
		basinObject1.clear();
		basinObject2.clear();
		chartYSelection.clear();
		chartZSelection.clear();
	});

	// tour.onBeforeChange(function () {
	tour.onBeforeChange(function () {
		const step = this.getCurrentStep();

		if (Cookies.get("introjs-dontShowAgain") === "true") {
			setMapMaximized(false);
			basinObject1.clear();
			basinObject2.clear();
			chartYSelection.clear();
			chartZSelection.clear();
			tour.exit();
			return true;
		}

		if (step == 0) {
			// basinObject1.clear();
			// basinObject2.clear();
			// setMapMaximized(true);
		}

		if (step == 0) {
			tour.setOption("dontShowAgain", true)

		}

		if (step === 10) {
			setMapMaximized(false);
		}

		if (step === 14) {
			setMapMaximized(false);
			basinObject1.clear();
			basinObject2.clear();
			chartYSelection.clear();
			chartZSelection.clear();
		}

		return true;
	});

}
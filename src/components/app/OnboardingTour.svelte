<script lang="ts">
	import { onMount } from "svelte";

	import introJs from "intro.js";
	import "intro.js/introjs.css";

	import { defineGlobal } from "$src/lib/utils";
	import { basinObject1, basinObject2 } from "$src/appstate/selection/objectDataSelections.svelte";

	onMount(() => {
		defineGlobal("startTour", () => {
			const tour = introJs.tour().setOptions({
				steps: [
					{
						title: "Welcome",
						intro: "Hello World! 👋"
					},
					{
						element: document.querySelector(".help-icon"),
						title: "Help",
						intro: "Click here for help"
					},
					{
						element: document.querySelector(".user-guide"),
						title: "User Guide",
						intro: "lick here for user guide"
						// intro: '<img src="https://images.unsplash.com/photo-1608096299210-db7e38487075?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" />'
					}
				]
			});

			tour.onAfterChange(function () {
				if (this.getCurrentStep() === 1) {
					console.log('You have reached step 1');
					// Site ID: lagrange-8 50008
					// Site Name: Pigeon River
					// Region Name: Pigeon River
					// Region Type: site-catchment
					// Region ID: 50008
					// Latitude, Longitude: 41.71475634806109, -85.39019646484365
					basinObject1.set("site", 50008);
					basinObject2.set("site-catchment", 50008);


					// alert("You cannot continue! :P");
					// return false;
				}
			});
			tour.start();

			// driverObj.drive();
			// const driverObj = driver({
			// 	showProgress: true,
			// 	steps: [
			// 		{
			// 			element: ".map-container",
			// 			popover: {
			// 				title: "Welcome!",
			// 				description:
			// 					"Welcome to SJRBC River Data Explorer. This web application exists to help you learn about and use St. Joseph River Basin data to understand what is what is happening with the water in the watershed."
			// 			}
			// 		},
			// 		{
			// 			element: ".help-icon",
			// 			popover: {
			// 				title: "Introduction Tour",
			// 				description: "You can always re-open this tour by clicking the help icon."
			// 			}
			// 		},
			// 		{
			// 			element: ".user-guide",
			// 			popover: {
			// 				title: "User Guide",
			// 				description: "A complete User Guide is available to help you navigate the application and the data."
			// 			}
			// 		}
			// 		// { element: ".sidebar", popover: { title: "Title", description: "Description" } },
			// 		// { element: ".footer", popover: { title: "Title", description: "Description" } }
			// 	]
			// });
			// driverObj.drive();
		});
	});
</script>

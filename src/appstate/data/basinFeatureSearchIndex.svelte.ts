import { defineGlobal } from '$src/lib/utils';
import lunr from 'lunr';
import { basinFeatureCollections, basinFeatureName, type BasinFeatureType } from './basinFeatureCollection.svelte';
import type { BasinObjectType } from '$src/appstate/data/basinObject.svelte';
import { compact } from '$src/lib/utils/arrays';
import { sites } from './sites.svelte';

const searchTags = {
	'site': ['site'],
	'huc8': ['huc8'],
	'huc10': ['huc10'],
	'huc12': ['huc12'],
	'state': ['state'],
	'county': ['county'],
	// 'rivers': ['river'],
	'site-catchment': ['site', 'catchment', 'site-catchment'],
	'river-catchment': ['river', 'catchment', 'river-catchment']
}


export type FeatureSearchItem = {
	name: string;
	tags: string[];
	featureType: BasinFeatureType;
	id: number;
	ref: string;
}

// let _riverappFeatureSearchIndex = $state<Fuse<FeatureSearchItem>>();
let _lunrFeatureSearchIndex = $state<lunr.Index>();
export const basinFeatureSearchIndex = () => _lunrFeatureSearchIndex;



function makeItems(featureType: BasinObjectType): FeatureSearchItem[] {
	const items = [] as FeatureSearchItem[];
	const collection = basinFeatureCollections.get(featureType);
	if (!collection) return items;

	for (const feature of collection.features) {
		const properties = feature.properties || {};
		const item: FeatureSearchItem = {
			name: basinFeatureName(featureType, properties.id),
			tags: [...searchTags[featureType]],
			featureType,
			id: properties.id,
			ref: `${featureType}+${properties.id}`
		};

		// get dataset id
		if (featureType === 'site' || featureType === 'site-catchment') {
			const site = sites.get(feature.properties!.id!);
			if(site) {
				item.tags.push(site.dataset);
				item.tags.push(String(site.num));

			}
			// const datasetId = (properties.siteId || '').split('-')[0];
			// if (datasetId.length > 0) {
			// 	item.tags.push(datasetId);
			// }


		}
		items.push(item);
	}
	return items;
}



export async function buildFeatureSearchIndex() {
	let list = [] as FeatureSearchItem[];

	Object.keys(searchTags).forEach((featureType) => {
		const items = makeItems(featureType as BasinObjectType);
		list = list.concat(items);
	});

	console.log('SEARCH INDEX');
	console.log(list);

	_lunrFeatureSearchIndex = lunr(function () {
		const l = this;
		l.ref('ref')
		l.field('name')
		l.field('tags')
		l.field('featureType', { boost: 5 })

		list.forEach(function (doc) {
			l.add(doc)
		}, l)
	})


	defineGlobal('featuresSearch', _lunrFeatureSearchIndex);

	defineGlobal('search', searchBasinFeatures);
}

export type BasinSearchResult = [BasinObjectType, number];

const refToFeature = (ref: string): BasinSearchResult => {
	const [featureType, id] = ref.split('+');

	return [featureType as BasinObjectType, parseInt(id)] as BasinSearchResult;
}


function makeQueryAnd(query: string): string {
	// split string and add + prefix to each word
	const words = query.split(' ').map(word => word.trim()).filter(word => word.length > 0);
	return words.map(word => `+${word}`).join(' ');
}

function addWildcard(query: string): string {
	// add wildcard to the end of each word
	return query.split(' ').map(word => `${word}*`).join(' ');
}

export function searchBasinFeatures(query: string): BasinSearchResult[] {
	try {
		if (!query || query.length < 2) return [];

		if (!_lunrFeatureSearchIndex) {
			console.warn('Riverapp feature search index is not built yet');
			return [];
		}


		query = makeQueryAnd(query);
		// console.log('Searching for:', query);

		let results = _lunrFeatureSearchIndex.search(query)

		if (results.length === 0) {
			// If no results, try adding wildcard to the end of each word
			query = addWildcard(query);
			// console.log('No results found, trying with wildcard:', query);
			results = _lunrFeatureSearchIndex.search(query);
		}


		results = results.splice(0, 100); // Limit to 100 results
		// console.log('Search results:', results);

		// return _riverappFeatureSearchIndex.search(query).map(result => result.item);
		return results.map(result => refToFeature(result.ref));
	} catch (e) {
		console.error('Error searching basin features:', e);
		return [];
	}
}


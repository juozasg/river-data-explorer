import { defineGlobal } from '$src/lib/utils';
import lunr from 'lunr';
import { riverappFeatureCollections, riverappFeatureName, type BasinFeatureType } from './riverappFeatureCollection.svelte';
import type { BasinObjectType } from '$src/appstate/data/basinObject.svelte';

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
let _riverappFeatureSearchIndex = $state<lunr.Index>();
export const riverappFeatureSearchIndex = () => _riverappFeatureSearchIndex;



function makeItems(featureType: BasinObjectType): FeatureSearchItem[] {
	const items = [] as FeatureSearchItem[];
	const collection = riverappFeatureCollections.get(featureType);
	if (!collection) return items;

	for (const feature of collection.features) {
		const properties = feature.properties || {};
		const item: FeatureSearchItem = {
			name: riverappFeatureName(featureType, properties.id),
			tags: [...searchTags[featureType]],
			featureType,
			id: properties.id,
			ref: `${featureType}+${properties.id}`
		};

		// get dataset id
		if (properties.siteId && featureType === 'site' || featureType === 'site-catchment') {
			const datasetId = (properties.siteId || '').split('-')[0];
			if (datasetId.length > 0) {
				item.tags.push(datasetId);
			}
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

	_riverappFeatureSearchIndex = lunr(function () {
		const l = this;
		l.ref('ref')
		l.field('name')
		l.field('tags')
		l.field('featureType', { boost: 5 })

		list.forEach(function (doc) {
			l.add(doc)
		}, l)
	})



	defineGlobal('featuresSearch', _riverappFeatureSearchIndex);

	defineGlobal('search', searchRiverappFeatures);
}

export function searchRiverappFeatures(query: string): any[] {
	if (!_riverappFeatureSearchIndex) {
		console.warn('Riverapp feature search index is not built yet');
		return [];
	}

	const refToFeature = (ref: string): any | undefined => {
		const [featureType, id] = ref.split('+');
		const feature = riverappFeatureCollections.get(featureType as BasinObjectType)?.features.find(f => f.properties?.id === parseInt(id));
		if (!feature) return [featureType, id];
		return [featureType, feature.properties]
	}
	// return _riverappFeatureSearchIndex.search(query).map(result => result.item);
	return _riverappFeatureSearchIndex.search(query).map(result => refToFeature(result.ref));
}


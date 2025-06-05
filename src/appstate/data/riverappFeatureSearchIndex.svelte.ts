import { defineGlobal } from '$src/lib/utils';
import Fuse from 'fuse.js'
import lunr from 'lunr';
import { riverappFeatureCollections, riverappFeatureName, type RiverappFeaturesType } from './riverappFeatureCollection.svelte';

const searchTags = {
	'sites': ['site'],
	'huc8': ['huc8'],
	'huc10': ['huc10'],
	'huc12': ['huc12'],
	'states': ['state'],
	'counties': ['county'],
	// 'rivers': ['river'],
	'site-catchments': ['site', 'catchment', 'site-catchment'],
	'river-catchments': ['river', 'catchment', 'river-catchment']
}

export type SearchableRiverappFeatures = Exclude<RiverappFeaturesType, 'rivers'>;

export type FeatureSearchItem = {
	name: string;
	tags: string[];
	featureType: RiverappFeaturesType;
	id: number;
	ref: string;
}

// let _riverappFeatureSearchIndex = $state<Fuse<FeatureSearchItem>>();
let _riverappFeatureSearchIndex = $state<lunr.Index>();
export const riverappFeatureSearchIndex = () => _riverappFeatureSearchIndex;





function makeItems(featureType: SearchableRiverappFeatures): FeatureSearchItem[] {
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
		if (properties.siteId && featureType === 'sites' || featureType === 'site-catchments') {
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
		const items = makeItems(featureType as SearchableRiverappFeatures);
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



	// const options = {
	// 	includeScore: true,
	// 	ignoreDiacritics: true,
	// 	minMatchCharLength: 2,
	//   useExtendedSearch: true,
	// 	// ignoreLocation: true,

	// 	// Search in `author` and in `tags` array
	// 	keys: [
	// 		'name',
	// 		{
	// 			name: 'tags',
	// 			// weight: 1
	// 		},
	// 		'featureType',


	// 	]
	// }

	// _riverappFeatureSearchIndex = new Fuse(list, options)



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
		const feature = riverappFeatureCollections.get(featureType as SearchableRiverappFeatures)?.features.find(f => f.properties?.id === parseInt(id));
		if (!feature) return [featureType, id];
		return [featureType, feature.properties]
	}
	// return _riverappFeatureSearchIndex.search(query).map(result => result.item);
	return _riverappFeatureSearchIndex.search(query).map(result => refToFeature(result.ref));
}


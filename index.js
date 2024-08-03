import { writeFileSync } from 'fs';
import { basename } from 'path';
import got from 'got';

import { Version } from './modules/Version.js';
import { AssetRipper } from './modules/wrappers/AssetRipper.js';
// import { Spine } from './modules/wrappers/Spine.js';
import { writeError } from './modules/helper.js';

const version = new Version();
await version.versionCheck();

const fetchIndex = [
	'spritesheets/heroes',     // character sprites, portraits
	'spritesheets/items',      // icons, weapons, cards
	'spritesheets/ui/main_s3', // UI icons
	'ui/common'                // stickers
];

console.log('\nGot: Downloading assets from the server ...');
const downloadDir = './data/version-data/' + version.current;

for (let i = 0; i < fetchIndex.length; i++) {

	const fetchPath = fetchIndex[i];
	console.log(`\t[${i+1}/${fetchIndex.length}]\t~/${fetchPath}`);
	try {
		const absFetchPath = version.link + '/AssetBundles/Android/' + fetchPath;
		const absDLPath = downloadDir + '/' + basename(fetchPath);

		const { rawBody: asset } = await got(absFetchPath);
		writeFileSync(absDLPath, asset);
	} catch (error) {
		writeError(error);
	}
}

console.log('\nLOG: Starting AssetRipper v0.3.4.0 ...');

const assetRipper = new AssetRipper();

const extractIndex = {
	heroes: [
		'characters.png',
		'characters.atlas.txt',
		'portraits.png',
		'portraits.asset'
	],
	items: [
		'items.png',
		'items.atlas.txt'
	],
	main_s3: [
		'MainUiS3.png',
		'MainUiS3.json'
	],
	common: [
		'ProfilecardStickers.png',
		'ProfilecardStickers.prefab'
	]
}

for (const [asset, data] of Object.entries(extractIndex)) {
	assetRipper.scan(version.dir + '/' + asset);
	assetRipper.export(data);
}

console.log(`\nDiffing all sprites from v${version.current} -> v${version.next} ...`);

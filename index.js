import { writeFileSync } from 'fs';
import { basename } from 'path';
import got from 'got'

import { Version } from './modules/Version.js';
import * as misc from './modules/helper.js';

const version = new Version();
await version.versionCheck();

const fetchIndex = [
	'spritesheets/heroes',     // character sprites, portraits
	'spritesheets/items',      // icons, weapons, cards
	'spritesheets/ui/main_s3', // UI icons
	'ui/common'                // stickers
]

console.log('\nLOG: Downloading assets from the server ...');
const downloadDir = './data/version-data/' + version.current;

fetchIndex.forEach(async (fetchPath, i) => {

	console.log(`\t[${i+1}/${fetchIndex.length}]\t~/${fetchIndex[i]}`);

	try {
		const absFetchPath = version.link + '/AssetBundles/Android/' + fetchPath;
		const absDLPath = downloadDir + '/' + basename(fetchPath);

		const { body: asset } = await got(absFetchPath);
		writeFileSync(absDLPath, asset);
	} catch(error) {
		misc.writeError(error);
	}
});

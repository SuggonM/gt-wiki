import { Version } from './modules/Version.js';

const version = new Version();
const versionCustom = new Version('2.10.0');

console.log('Testing "Version" class...');

for (const ver of [ version, versionCustom ]) {
	console.log('\nVersion ' + ver.current);
	console.log(ver.current);
	console.log(ver.next);
	console.log(ver.link);
	console.log(ver.version2id('3.00.0'));
	console.log(ver.id2version('1000'));
	console.log(ver.nextVersion());
	console.log(ver.versionLink());
	console.log(await ver.versionCheck());
};

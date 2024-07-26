import { Version } from './modules/Version.js';

const version = new Version();
const versionCustom = new Version('2.10.0');

console.log('Testing "Version" class...');
[ version, versionCustom ].forEach(ver => {
	console.log('\nVersion ' + ver.current);
	console.log(ver.current);
	console.log(ver.next);
	console.log(ver.link);
	console.log(ver.version2id('3.00.0'));
	console.log(ver.id2version('1000'));
	console.log(ver.nextVersion('3.00.0'));
	console.log(ver.versionLink('3.00.0'));
});

import { readFileSync, writeFileSync } from 'fs';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import 'dotenv/config';

export function writeError(error) {
	writeFileSync('./error.log', error.stack); // non-standard(?)
	console.error('LOG: Please check "./error.log" for error tracking.');
	process.exit(1);
}

export function $(program, ...args) {
	const subprocess = spawnSync(program, args);
	if (subprocess.error) {
		console.error(program + ' failed to start! Make sure executables inside ".env" run correctly.');
		writeError(subprocess.error);
		process.exit(1);
	}
	if (subprocess.status === 1) {
		const error = subprocess.stderr.toString() || subprocess.stdout.toString();
		writeError(new Error(error));
	}

	return subprocess;
}

// get version JSON data
const versionFile = readFileSync('./data/versions.json', 'utf8');
export const versions = JSON.parse(versionFile);

// dynamic import atlas prototype from spine2json
const s2jPath = pathToFileURL(process.env['s2j_path']).href;
const modules = {
	atlas: 'spine-atlas.mjs',
	skel2json: 'spine-skel.mjs',
	json2patch: 'spine-json.mjs'
};
export async function s2jImport(module) {
	const modulePath = s2jPath + '/scripts/' + modules[module];
	const imports = await import(modulePath);
	return imports;
}

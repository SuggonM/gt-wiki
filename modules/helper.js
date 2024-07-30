import { readFileSync, writeFileSync } from 'fs';
import { spawnSync } from 'node:child_process';

export function writeError(error) {
	writeFileSync('./error.log', error.stack); // non-standard(?)
	console.error('LOG: Please check "./error.log" for error tracking.');
	process.exit(1);
}

export function $(program, ...args) {
	const subprocess = spawnSync(program, args);
	if (subprocess.error) {
		console.error(program + ' failed to start! Make sure executables inside ".config.json" run correctly.');
		writeError(subprocess.error);
		process.exit(1);
	}
	if (subprocess.status === 1) {
		const error = subprocess.stderr.toString() || subprocess.stdout.toString();
		writeError(new Error(error));
	}

	return subprocess;
}

class Config {
	#config;
	#configPath = './.config.json';

	constructor() {
		const configFile = readFileSync(this.#configPath, 'utf8');
		this.#config = JSON.parse(configFile);
	}

	get(property) {
		return this.#config[property];
	}
	set(property, value) {
		this.#config[property] = value;
		this.#save();
	}
	erase(property) {
		delete this.#config[property];
		this.#save();
	}

	#save() {
		writeFileSync(this.#configPath, JSON.stringify(this.#config, null, '\t'));
	}
}

export const config = new Config();

const versionFile = readFileSync('./data/versions.json', 'utf8');
export const versions = JSON.parse(versionFile);

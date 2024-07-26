import { readFileSync } from 'fs';

export class Version {
	current;
	get next() {
		return this.nextVersion(this.current);
	}
	get link() {
		return this.versionLink(this.current);
	}

	constructor(version) {
		if (version) { this.current = version; return; }

		const json = readFileSync('./data/versions.json', 'utf-8');
		const versionJson = JSON.parse(json);
		const allVersions = versionJson.versions;
		const curVersion = allVersions[allVersions.length - 1];

		this.current = curVersion;
	}

	version2id(version) {
		const split = version.split('.');
		const season = split[0] - 2;
		const subVer = split[1];
		return `${season}${subVer}0`;
	}

	id2version(id) {
		id = String(id).padStart(4, '0');
		const season = Number(id[0]) + 2;
		const subVer = `${id[1]}${id[2]}`;
		return `${season}.${subVer}.0`;
	}

	nextVersion(version) {
		const id = this.version2id(version);
		const nextId = Number(id) + 10;
		return this.id2version(nextId);
	}

	versionLink(version) {
		const versionId = this.version2id(version);
		const link = `https://patch-w.gdts.kakaogames.com/live/kr/${versionId}/master-kakao-kr-v${version}`;
		return link;
	}
}

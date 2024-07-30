import got from 'got';

import { versions, writeError } from './helper.js';

export class Version {
	current;
	get next() {
		return this.nextVersion();
	}
	get link() {
		return this.versionLink();
	}
	get dir() {
		return this.versionDir();
	}

	constructor(version) {
		if (version) { this.current = version; return; }

		this.current = versions.current;
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

	nextVersion(version = this.current) {
		const id = this.version2id(version);
		const nextId = Number(id) + 10;
		return this.id2version(nextId);
	}

	versionLink(version = this.current) {
		const versionId = this.version2id(version);
		const link = `https://patch-w.gdts.kakaogames.com/live/kr/${versionId}/master-kakao-kr-v${version}`;
		return link;
	}

	async versionCheck(version = this.current) {
		const assetBundleUrl = this.versionLink() + '/assetbundle-version';
		console.log('LOG: Checking for version "' + version + '" ...');
		try {
			const { body: response } = await got(assetBundleUrl);
			const assetVersion = response.split('\n')[1];
			console.log('LOG: Found version ' + assetVersion);
			if (version !== assetVersion) throw new Error('Version mismatch!');
			return true;
		} catch (error) {
			console.error('LOG: Version up-to-date, or an error occurred.');
			writeError(error);
		}
	}

	versionDir(version = this.current) {
		return `./data/version-data/${version}`;
	}
}

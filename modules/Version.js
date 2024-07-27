import { readFileSync } from 'fs';
import got from 'got';

import * as misc from './helper.js';

export class Version {
	current;
	get next() {
		return this.nextVersion();
	}
	get link() {
		return this.versionLink();
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
			if (version !== assetVersion) throw new Error('Non-matching versions!');
			return true;
		} catch (error) {
			console.error('LOG: Version up-to-date, or an error occurred.');
			misc.writeError(error);
		}
	}
}

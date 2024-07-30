import { readdirSync, renameSync, existsSync, mkdirSync } from 'fs';

import { $, config } from '../helper.js';
import { Version } from '../Version.js';

class AssetRipper {
	app;
	appDir;
	dataViewDir;
	dataExtractTree;
	assetName;
	exportDir;

	constructor(configs) {
		this.app = configs.app;
		this.appDir = configs.appDir;
		this.dataViewDir = this.appDir + '/Ripped/ExportedProject/Assets';
		this.exportDir = configs.assetDir;
	}

	scan(asset, option = {}) {
		console.log(`\nAssetRipper: Reading data from "${asset}" ...`);
		$(this.app, '-q', asset);

		const extractTreeAll = readdirSync(this.dataViewDir, { recursive: true, withFileTypes: true });
		const extractTree = this.#sanitizeTree(extractTreeAll);

		this.dataExtractTree = extractTree;
		this.assetName = asset.replace(/.*[\\/]/, '');
		this.exportDir += `/${this.assetName}_`;

		if (option.print === true) {
			const fileList = extractTree.map(file => file.name);
			console.log('AssetRipper: Detected assets:');
			console.log(fileList);
			return fileList;
		}
	}

	export(filter) {
		if (!this.dataExtractTree) {
			throw new Error('Nothing scanned yet; use "AssetRipper.scan(…)" first.');
		}

		// very "readable" code ahead !!!
		const filterFunc = {
			String: (file) => file.name === filter,
			RegExp: (file) => file.name.match(filter),
			Array:  (file) => filter.includes(file.name),
			undefined:  () => true
		};
		const filteredFiles = this.dataExtractTree.filter(filterFunc[filter?.constructor?.name]);
		this.#move(filteredFiles);
	}

	#move(extractTree) {
		console.log('AssetRipper: Extracting data ...');
		existsSync(this.exportDir) || mkdirSync(this.exportDir);

		extractTree.forEach((file, i) => {
			const sanitizedName = file.name.replace(/\.(txt|bytes|rgba4444)/, '');
			const relPath = file.parentPath.replace(/.*Assets/, '~').replaceAll('\\', '/');
			const remoteFile = file.parentPath + '/' + file.name;
			const exportFile = this.exportDir + '/' + sanitizedName;

			renameSync(remoteFile, exportFile);
			console.log(`\t[${i+1}/${extractTree.length}]\t${relPath}/${sanitizedName}`);
		});
	}

	#sanitizeTree(extractTree) {
		return extractTree.filter(
			elem => elem.isFile() &&
			!elem.name.includes('.meta')
		);
	}
}

class _AssetRipper extends AssetRipper {
	constructor(assetDir) {
		super({
			app: config.get('AR'),
			appDir: config.get('AR_dir'),
			assetDir: assetDir || new Version().dir
		});
	}
}

export {
	_AssetRipper as AssetRipper
};

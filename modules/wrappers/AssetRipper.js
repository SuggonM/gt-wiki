import { readdirSync, renameSync, existsSync, mkdirSync } from 'fs';

import { $, config } from '../helper.js';
import { Version } from '../Version.js';

class AssetRipper {
	app;
	dataViewDir;
	dataExtractTree;
	assetName;
	exportDir;

	constructor(configs) {
		this.app = configs.app;
		this.exportDir = configs.assetDir;
	}

	scan(asset, options = {}) {
		console.log(`\nAssetRipper: Reading data from "${asset}" ...`);
		const ARprocess = $(this.app, '-q', asset);
		this.dataViewDir || this.#detectDataDir(ARprocess.stdout);

		const extractTreeAll = readdirSync(this.dataViewDir, { recursive: true, withFileTypes: true });
		const extractTree = this.#sanitizeTree(extractTreeAll);

		this.dataExtractTree = extractTree;
		this.assetName = asset.replace(/.*[\\/]/, '');
		this.exportDir = asset + '_';

		if (options.print === true) {
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
			const sanitizedName = file.name.replace(/\.(txt|bytes|rgba4444)/, '').replace(/\.(prefab|asset)/, '.yaml');
			const relPath = file.parentPath.replace(/.*Assets/, '~').replaceAll('\\', '/');
			const remoteFile = file.parentPath + '/' + file.name;
			const exportFile = this.exportDir + '/' + sanitizedName;

			renameSync(remoteFile, exportFile);
			console.log(`\t[${i+1}/${extractTree.length}]\t${relPath}/${file.name}`);
		});
	}

	#sanitizeTree(extractTree) {
		return extractTree.filter(
			elem => elem.isFile() &&
			!elem.name.includes('.meta')
		);
	}

	#detectDataDir(stdout) {
		const rootPathLogFilter = 'General : ExportRootPath: ';
		const rootPathLogs = stdout.toString().split(/\r?\n/);
		const rootPathLog = rootPathLogs.filter(log => log.includes(rootPathLogFilter))[0];
		const rootPath = rootPathLog.replace(rootPathLogFilter, '').replaceAll('\\', '/');

		this.dataViewDir = rootPath + '/ExportedProject/Assets';
	}
}

class _AssetRipper extends AssetRipper {
	constructor(assetDir) {
		super({
			app: config.get('AR'),
			assetDir: assetDir || new Version().dir
		});
	}
}

export {
	_AssetRipper as AssetRipper
};

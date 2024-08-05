import YAML from 'yaml';

import { atlas } from './spine2json/scripts/spine-atlas.mjs';

export function yaml2atlas(yaml, options = {}) {

	const parsedYaml = YAML.parseAllDocuments(yaml);
	// const firstSprite = parsedYaml[2].contents.items[0].value.items[11].value.items[0].items[0].value.value;

	// using this as a workaround for "complex" yaml tree as seen above
	const parsedJson = JSON.parse(JSON.stringify(parsedYaml));

	// search for name & sprites. works for most yamls (i think)
	const mSpriteElem = parsedJson[0].MonoBehaviour || parsedJson[2].MonoBehaviour;
	const mSprites = mSpriteElem.mSprites;
	const spritesheetName = mSpriteElem['m_Name'] || parsedJson[0].GameObject['m_Name'];

	const atlasJson = {
		file: spritesheetName + '.png',
		size: [0, 0],
		format: 'RGBA8888',
		filter: ['Linear', 'Linear'],
		repeat: 'none',
		data: new Set()
	};

	for (const sprite of mSprites) {
		// sprite.border(s) unused as i haven't found a valid usecase for it

		const atlasSprite = {
			file: sprite.name,
			rotate: false,
			xy: [
				sprite.x,
				sprite.y || sprite.true // yaml parser bug (duh)
			],
			size: [
				sprite.width,
				sprite.height
			],
			orig: [
				sprite.width + sprite.paddingLeft + sprite.paddingRight,
				sprite.height + sprite.paddingTop + sprite.paddingBottom
			],
			/*
			 * arbitrary algorithm because padding data sometimes introduces negative values
			 * along with an equal positive value in opposite direction, that cancel out each other
			 * FINAL padding is 0 in such a scenario.
			 * also see https://github.com/pavle-goloskokovic/texture-unpacker/issues/5
			 */
			// offset: [ sprite.paddingLeft, sprite.paddingBottom ],
			offset: [
				(sprite.paddingLeft + sprite.paddingRight) && sprite.paddingLeft,
				(sprite.paddingBottom + sprite.paddingTop) && sprite.paddingBottom
			],
			index: -1
		};

		atlasJson.data.add(atlasSprite);
	}

	if (options.format === 'txt') {
		const atlasPages = [ atlasJson ];
		const atlasTxt = atlas.stringify(atlasPages);
		return atlasTxt;
	}

	return atlasJson;
}

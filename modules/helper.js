import { writeFileSync } from 'fs';

export function writeError(error) {
	writeFileSync('./error.log', error.stack); // non-standard(?)
	console.error('LOG: Please check "./error.log" for error tracking.');
	process.exit(1);
}

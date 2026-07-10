import { writeFileSync } from 'node:fs';
import semanticRelease from 'semantic-release';

const result = await semanticRelease({ dryRun: true, ci: false });

if (!result || !result.nextRelease) {
  console.log('No release warranted.');
  process.exit(0);
}

const { version, notes } = result.nextRelease;
writeFileSync('.release-version', version);
writeFileSync('.release-notes.md', notes ?? '');
console.log(`Next release: ${version}`);

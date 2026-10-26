// Downloads the open datasets used by the ingest step into .data/sources (not committed).
// JMdict/KANJIDIC2 via jmdict-simplified (CC BY-SA 4.0, EDRDG), JmdictFurigana (CC BY-SA), Unihan (Unicode License v3).
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';

const OUT = '.data/sources';

async function latestAsset(repo: string, pattern: RegExp) {
  const res = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, { headers: { 'user-agent': 'japky-ingest' } });
  if (!res.ok) throw new Error(`${repo}: ${res.status}`);
  const release = (await res.json()) as { tag_name: string; assets: { name: string; browser_download_url: string }[] };
  const asset = release.assets.find((a) => pattern.test(a.name));
  if (!asset) throw new Error(`${repo}: no asset matching ${pattern}`);
  return { ...asset, tag: release.tag_name };
}

async function download(url: string, file: string) {
  if (existsSync(file)) return console.log(`cached ${file}`);
  const res = await fetch(url, { headers: { 'user-agent': 'japky-ingest' } });
  if (!res.ok) throw new Error(`${url}: ${res.status}`);
  writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  console.log(`downloaded ${file}`);
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const versions: Record<string, string> = {};

  const jmdict = await latestAsset('scriptin/jmdict-simplified', /^jmdict-eng-common-.*\.json\.zip$/);
  const kanjidic = await latestAsset('scriptin/jmdict-simplified', /^kanjidic2-en-.*\.json\.zip$/);
  const furigana = await latestAsset('Doublevil/JmdictFurigana', /^JmdictFurigana\.json$/);
  versions.jmdict = jmdict.tag;
  versions.jmdictFurigana = furigana.tag;

  await download(jmdict.browser_download_url, `${OUT}/jmdict.json.zip`);
  await download(kanjidic.browser_download_url, `${OUT}/kanjidic2.json.zip`);
  await download(furigana.browser_download_url, `${OUT}/JmdictFurigana.json`);
  await download('https://www.unicode.org/Public/UCD/latest/ucd/Unihan.zip', `${OUT}/Unihan.zip`);

  // Windows ships bsdtar (extracts zip); elsewhere use unzip.
  for (const zip of ['jmdict.json.zip', 'kanjidic2.json.zip', 'Unihan.zip']) {
    if (process.platform === 'win32') execFileSync('C:\\Windows\\System32\\tar.exe', ['-xf', zip], { cwd: OUT, stdio: 'inherit' });
    else execFileSync('unzip', ['-o', '-q', zip], { cwd: OUT, stdio: 'inherit' });
  }
  writeFileSync(`${OUT}/versions.json`, JSON.stringify(versions, null, 2));
  console.log('sources ready', versions);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

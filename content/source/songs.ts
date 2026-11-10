// Curated songs for F11 v1 (P8 decision H1). `channel` must equal the YouTube oEmbed author_name, so only
// official uploads pass the build. Lyrics come from LRCLIB at ingest; copyright is an owner-accepted v1 risk
// (docs/07-CONTENT-LICENSING.md §4) and every page has a removal link (content/songs/removed.json).
export type SongSource = { slug: string; title: string; artist: string; youtubeId: string; channel: string };

export const songs: SongSource[] = [
  { slug: 'yoasobi-yoru-ni-kakeru', title: '夜に駆ける', artist: 'YOASOBI', youtubeId: 'x8VYWazR5mE', channel: 'YOASOBI' },
  { slug: 'yoasobi-idol', title: 'アイドル', artist: 'YOASOBI', youtubeId: 'ZRtdQ81jPUQ', channel: 'YOASOBI' },
  { slug: 'yoasobi-gunjo', title: '群青', artist: 'YOASOBI', youtubeId: 'Y4nEEZwckuU', channel: 'YOASOBI' },
  { slug: 'yoasobi-harujion', title: 'ハルジオン', artist: 'YOASOBI', youtubeId: 'kzdJkT4kp-A', channel: 'YOASOBI' },
  { slug: 'higedan-pretender', title: 'Pretender', artist: 'Official髭男dism', youtubeId: 'TQ8WlA2GXbk', channel: 'Official髭男dism' },
  { slug: 'higedan-subtitle', title: 'Subtitle', artist: 'Official髭男dism', youtubeId: 'hN5MBlGv2Ac', channel: 'Official髭男dism' },
  { slug: 'yonezu-lemon', title: 'Lemon', artist: '米津玄師', youtubeId: 'SX_ViT4Ra7k', channel: 'Kenshi Yonezu  米津玄師' },
  { slug: 'yonezu-kanden', title: '感電', artist: '米津玄師', youtubeId: 'UFQEttrn6CQ', channel: 'Kenshi Yonezu  米津玄師' },
  { slug: 'yonezu-uma-to-shika', title: '馬と鹿', artist: '米津玄師', youtubeId: 'ptnYBctoexk', channel: 'Kenshi Yonezu  米津玄師' },
  { slug: 'yonezu-flamingo', title: 'Flamingo', artist: '米津玄師', youtubeId: 'Uh6dkL1M9DM', channel: 'Kenshi Yonezu  米津玄師' },
  { slug: 'yonezu-kick-back', title: 'KICK BACK', artist: '米津玄師', youtubeId: 'M2cckDmNLMI', channel: 'Kenshi Yonezu  米津玄師' },
  { slug: 'daoko-uchiage-hanabi', title: '打上花火', artist: 'DAOKO × 米津玄師', youtubeId: '-tKVN2mAKRI', channel: 'daoko_jp' },
  { slug: 'aimyon-marigold', title: 'マリーゴールド', artist: 'あいみょん', youtubeId: '0xSiBpUdW4E', channel: 'あいみょん' },
  { slug: 'king-gnu-hakujitsu', title: '白日', artist: 'King Gnu', youtubeId: 'ony539T074w', channel: 'King Gnu official YouTube channel' },
  { slug: 'radwimps-zenzenzense', title: '前前前世', artist: 'RADWIMPS', youtubeId: 'PDSkFeMVNFs', channel: 'RADWIMPS' },
  { slug: 'hoshino-gen-koi', title: '恋', artist: '星野源', youtubeId: 'jhOVibLEDhA', channel: '星野源 Gen Hoshino' },
  { slug: 'ado-usseewa', title: 'うっせぇわ', artist: 'Ado', youtubeId: 'Qp3b-RXtz4w', channel: 'Ado' },
  { slug: 'ado-shinjidai', title: '新時代', artist: 'Ado', youtubeId: '1FliVTcX8bQ', channel: 'Ado' },
  { slug: 'lisa-gurenge', title: '紅蓮華', artist: 'LiSA', youtubeId: 'CwkzK-F0Y00', channel: 'LiSA Official YouTube' },
  { slug: 'mrs-green-apple-ao-to-natsu', title: '青と夏', artist: 'Mrs. GREEN APPLE', youtubeId: 'm34DPnRUfMU', channel: 'MrsGREENAPPLEVEVO' },
  { slug: 'aimer-zankyosanka', title: '残響散歌', artist: 'Aimer', youtubeId: 'tLQLa6lM3Us', channel: 'Aimer Official YouTube Channel' },
  { slug: 'yuuri-betelgeuse', title: 'ベテルギウス', artist: '優里', youtubeId: 'cbqvxDTLMps', channel: '優里 Official YouTube Channel' },
];

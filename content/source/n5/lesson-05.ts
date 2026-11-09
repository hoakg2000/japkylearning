import type { LessonSource } from '../types';

export default {
  id: 'n5-05',
  order: 5,
  title: { vi: 'Sinh hoạt hằng ngày', en: 'Daily routine' },
  goals: [
    { vi: 'Nói việc mình làm mỗi ngày bằng thể ます', en: 'Describe what you do every day with the ます form' },
    { vi: 'Nói việc đã làm / không làm', en: 'Say what you did or did not do' },
  ],
  kanji: ['食', '飲', '見', '読', '買', '毎', '水'],
  words: [
    { surface: '起きる', reading: 'おきる', vi: 'thức dậy', example: ['{毎朝|まいあさ} {六時|ろくじ} に {起|お}きます。', 'Mỗi sáng tôi dậy lúc sáu giờ.', 'I get up at six every morning.'] },
    { surface: '寝る', reading: 'ねる', vi: 'ngủ, đi ngủ', example: ['{十一時|じゅういちじ} に {寝|ね}ます。', 'Tôi đi ngủ lúc mười một giờ.', 'I go to bed at eleven.'] },
    { surface: '食べる', reading: 'たべる', vi: 'ăn', example: ['パン を {食|た}べます。', 'Tôi ăn bánh mì.', 'I eat bread.'] },
    { surface: '飲む', reading: 'のむ', vi: 'uống', example: ['{水|みず} を {飲|の}みます。', 'Tôi uống nước.', 'I drink water.'] },
    { surface: '見る', reading: 'みる', vi: 'xem, nhìn', example: ['テレビ を {見|み}ます。', 'Tôi xem ti vi.', 'I watch TV.'] },
    { surface: '聞く', reading: 'きく', vi: 'nghe; hỏi', example: ['{音楽|おんがく} を {聞|き}きます。', 'Tôi nghe nhạc.', 'I listen to music.'] },
    { surface: '読む', reading: 'よむ', vi: 'đọc', example: ['{新聞|しんぶん} を {読|よ}みます。', 'Tôi đọc báo.', 'I read the newspaper.'] },
    { surface: '書く', reading: 'かく', vi: 'viết', example: ['{名前|なまえ} を {書|か}きます。', 'Tôi viết tên.', 'I write my name.'] },
    { surface: '買う', reading: 'かう', vi: 'mua', example: ['{本|ほん} を {買|か}いました。', 'Tôi đã mua sách.', 'I bought a book.'] },
    { surface: '勉強する', reading: 'べんきょうする', vi: 'học, học tập', example: ['{毎日|まいにち} {日本語|にほんご} を {勉強|べんきょう} します。', 'Hằng ngày tôi học tiếng Nhật.', 'I study Japanese every day.'] },
    { surface: '働く', reading: 'はたらく', vi: 'làm việc', example: ['{九時|くじ} から {五時|ごじ} まで {働|はたら}きます。', 'Tôi làm việc từ chín giờ đến năm giờ.', 'I work from nine to five.'] },
    { surface: '毎日', reading: 'まいにち', vi: 'hằng ngày', example: ['{毎日|まいにち} コーヒー を {飲|の}みます。', 'Ngày nào tôi cũng uống cà phê.', 'I drink coffee every day.'] },
    { surface: '朝ご飯', reading: 'あさごはん', vi: 'bữa sáng', example: ['{朝|あさ}ご{飯|はん} を {食|た}べません でした。', 'Tôi đã không ăn sáng.', 'I did not eat breakfast.'] },
    { surface: '水', reading: 'みず', vi: 'nước', example: ['{水|みず} を {飲|の}みません。', 'Tôi không uống nước.', 'I do not drink water.'] },
    { surface: 'テレビ', reading: 'テレビ', vi: 'ti vi', example: ['{昨日|きのう} テレビ を {見|み}ました。', 'Hôm qua tôi đã xem ti vi.', 'I watched TV yesterday.'] },
    { surface: '昨日', reading: 'きのう', vi: 'hôm qua', example: ['{昨日|きのう} {働|はたら}きません でした。', 'Hôm qua tôi đã không làm việc.', 'I did not work yesterday.'] },
  ],
  grammar: [
    {
      id: 'n5-masu',
      pattern: 'V-ます / V-ません',
      meaning: { vi: 'làm / không làm (lịch sự, hiện tại – tương lai)', en: 'do / do not (polite, present–future)' },
      explanation: {
        vi: 'Thể ます là cách nói lịch sự của động từ, dùng cho thói quen và việc sẽ làm. Phủ định: đổi ます thành ません. Ví dụ: 食べる → 食べます → 食べません.',
        en: 'The ます form is the polite verb form for habits and future actions. Negative: change ます to ません. 食べる → 食べます → 食べません.',
      },
      examples: [
        ['{毎日|まいにち} {日本語|にほんご} を {勉強|べんきょう} します。', 'Hằng ngày tôi học tiếng Nhật.', 'I study Japanese every day.'],
        ['{私|わたし} は {朝|あさ}ご{飯|はん} を {食|た}べません。', 'Tôi không ăn sáng.', 'I do not eat breakfast.'],
      ],
      cloze: [
        ['{水|みず} を {飲|の}みます。', 'ます', 'Tôi uống nước.', 'I drink water.'],
        ['テレビ を {見|み}ません。', 'ません', 'Tôi không xem ti vi.', 'I do not watch TV.'],
      ],
    },
    {
      id: 'n5-mashita',
      pattern: 'V-ました / V-ませんでした',
      meaning: { vi: 'đã làm / đã không làm', en: 'did / did not' },
      explanation: {
        vi: 'Quá khứ lịch sự: ます → ました, ません → ませんでした. Thường đi với từ chỉ thời gian quá khứ như 昨日 (hôm qua).',
        en: 'Polite past: ます → ました, ません → ませんでした. Often used with past time words like 昨日 (yesterday).',
      },
      examples: [
        ['{昨日|きのう} {本|ほん} を {読|よ}みました。', 'Hôm qua tôi đã đọc sách.', 'I read a book yesterday.'],
        ['{昨日|きのう} {勉強|べんきょう} しません でした。', 'Hôm qua tôi đã không học.', 'I did not study yesterday.'],
      ],
      cloze: [
        ['{昨日|きのう} テレビ を {見|み}ました。', 'ました', 'Hôm qua tôi đã xem ti vi.', 'I watched TV yesterday.'],
        ['{朝|あさ}ご{飯|はん} を {食|た}べませんでした。', 'ませんでした', 'Tôi đã không ăn sáng.', 'I did not eat breakfast.'],
      ],
    },
    {
      id: 'n5-wo',
      pattern: 'N を V',
      meaning: { vi: 'làm gì với N (tân ngữ)', en: 'object marker' },
      explanation: {
        vi: 'を (đọc là "o") đánh dấu tân ngữ – vật chịu tác động của động từ: ăn cái gì, uống cái gì, đọc cái gì.',
        en: 'を (read "o") marks the direct object: what you eat, drink, read and so on.',
      },
      examples: [
        ['コーヒー を {飲|の}みます。', 'Tôi uống cà phê.', 'I drink coffee.'],
        ['{手紙|てがみ} を {書|か}きました。', 'Tôi đã viết thư.', 'I wrote a letter.'],
      ],
      cloze: [
        ['パン を {食|た}べます。', 'を', 'Tôi ăn bánh mì.', 'I eat bread.'],
        ['{新聞|しんぶん} を {読|よ}みます。', 'を', 'Tôi đọc báo.', 'I read the newspaper.'],
      ],
    },
  ],
  dialogue: [
    ['田中', 'ミン さん は {毎朝|まいあさ} {何時|なんじ} に {起|お}きますか。', 'Anh Minh mỗi sáng dậy lúc mấy giờ?', 'What time do you get up every morning, Minh?'],
    ['ミン', '{六時|ろくじ} に {起|お}きます。 それから {朝|あさ}ご{飯|はん} を {食|た}べます。', 'Tôi dậy lúc sáu giờ. Sau đó tôi ăn sáng.', 'I get up at six. Then I eat breakfast.'],
    ['田中', '{昨日|きのう} {何|なに} を しましたか。', 'Hôm qua anh đã làm gì?', 'What did you do yesterday?'],
    ['ミン', '{日本語|にほんご} を {勉強|べんきょう} しました。 テレビ は {見|み}ません でした。', 'Tôi đã học tiếng Nhật. Tôi không xem ti vi.', 'I studied Japanese. I did not watch TV.'],
  ],
} satisfies LessonSource;

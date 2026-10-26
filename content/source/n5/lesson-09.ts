import type { LessonSource } from '../types';

export default {
  id: 'n5-09',
  order: 9,
  title: { vi: 'Tính từ đuôi い', en: 'い-adjectives' },
  goals: [
    { vi: 'Miêu tả người, đồ vật bằng tính từ đuôi い', en: 'Describe people and things with い-adjectives' },
    { vi: 'Chia phủ định, quá khứ; dùng とても / あまり', en: 'Use negative and past forms; とても / あまり' },
  ],
  kanji: ['小', '古', '高', '安', '多', '少'],
  words: [
    { surface: '大きい', reading: 'おおきい', vi: 'to, lớn', example: ['{東京|とうきょう} は {大|おお}きい {町|まち} です。', 'Tokyo là thành phố lớn.', 'Tokyo is a big city.'] },
    { surface: '小さい', reading: 'ちいさい', vi: 'nhỏ, bé', example: ['この {部屋|へや} は {小|ちい}さい です。', 'Căn phòng này nhỏ.', 'This room is small.'] },
    { surface: '新しい', reading: 'あたらしい', vi: 'mới', example: ['{新|あたら}しい {車|くるま} を {買|か}いました。', 'Tôi đã mua xe mới.', 'I bought a new car.'] },
    { surface: '古い', reading: 'ふるい', vi: 'cũ', example: ['この {本|ほん} は {古|ふる}い です。', 'Quyển sách này cũ.', 'This book is old.'] },
    { surface: '高い', reading: 'たかい', vi: 'cao; đắt', example: ['この {時計|とけい} は {高|たか}い です。', 'Chiếc đồng hồ này đắt.', 'This watch is expensive.'] },
    { surface: '安い', reading: 'やすい', vi: 'rẻ', example: ['あの {店|みせ} は {安|やす}い です。', 'Cửa hàng kia rẻ.', 'That shop is cheap.'] },
    { surface: '暑い', reading: 'あつい', vi: 'nóng (thời tiết)', example: ['{今日|きょう} は とても {暑|あつ}い です。', 'Hôm nay rất nóng.', 'It is very hot today.'] },
    { surface: '寒い', reading: 'さむい', vi: 'lạnh (thời tiết)', example: ['{昨日|きのう} は {寒|さむ}かった です。', 'Hôm qua trời lạnh.', 'It was cold yesterday.'] },
    { surface: '美味しい', reading: 'おいしい', vi: 'ngon', example: ['この ラーメン は {美味|おい}しい です。', 'Món ramen này ngon.', 'This ramen is delicious.'] },
    { surface: '難しい', reading: 'むずかしい', vi: 'khó', example: ['{漢字|かんじ} は {難|むずか}しい です。', 'Kanji khó.', 'Kanji is difficult.'] },
    { surface: '易しい', reading: 'やさしい', vi: 'dễ', example: ['{今日|きょう} の テスト は {易|やさ}しかった です。', 'Bài kiểm tra hôm nay dễ.', 'Today’s test was easy.'] },
    { surface: '面白い', reading: 'おもしろい', vi: 'thú vị, hay', example: ['あの {映画|えいが} は {面白|おもしろ}い です。', 'Bộ phim đó hay.', 'That film is interesting.'] },
    { surface: '忙しい', reading: 'いそがしい', vi: 'bận', example: ['{今週|こんしゅう} は {忙|いそが}しい です。', 'Tuần này tôi bận.', 'I am busy this week.'] },
    { surface: '多い', reading: 'おおい', vi: 'nhiều', example: ['{東京|とうきょう} は {人|ひと} が {多|おお}い です。', 'Tokyo đông người.', 'Tokyo has a lot of people.'] },
    { surface: '少ない', reading: 'すくない', vi: 'ít', example: ['この {町|まち} は {店|みせ} が {少|すく}ない です。', 'Thị trấn này ít cửa hàng.', 'This town has few shops.'] },
    { surface: 'とても', reading: 'とても', vi: 'rất', example: ['{日本語|にほんご} は とても {面白|おもしろ}い です。', 'Tiếng Nhật rất thú vị.', 'Japanese is very interesting.'] },
    { surface: 'あまり', reading: 'あまり', vi: 'không … lắm (đi với phủ định)', example: ['{今日|きょう} は あまり {寒|さむ}くない です。', 'Hôm nay không lạnh lắm.', 'It is not very cold today.'] },
  ],
  grammar: [
    {
      id: 'n5-i-adj',
      pattern: 'A-い です / A-くない です / A-かった です',
      meaning: { vi: 'tính từ đuôi い: khẳng định, phủ định, quá khứ', en: 'い-adjectives: affirmative, negative, past' },
      explanation: {
        vi: 'Tính từ đuôi い đứng trước danh từ giữ nguyên: 高い車. Phủ định: bỏ い thêm くない (高くない). Quá khứ: bỏ い thêm かった (高かった). Ngoại lệ: いい → よくない, よかった.',
        en: 'い-adjectives go straight before nouns: 高い車. Negative: drop い, add くない (高くない). Past: drop い, add かった (高かった). Exception: いい → よくない, よかった.',
      },
      examples: [
        ['この {店|みせ} は {高|たか}くない です。', 'Cửa hàng này không đắt.', 'This shop is not expensive.'],
        ['{旅行|りょこう} は {楽|たの}しかった です。', 'Chuyến du lịch đã rất vui.', 'The trip was fun.'],
      ],
      cloze: [
        ['{今日|きょう} は {暑|あつ}くない です。', 'くない', 'Hôm nay không nóng.', 'It is not hot today.'],
        ['テスト は {難|むずか}しかった です。', 'かった', 'Bài kiểm tra đã khó.', 'The test was difficult.'],
      ],
    },
    {
      id: 'n5-totemo-amari',
      pattern: 'とても A / あまり A-くない',
      meaning: { vi: 'rất A / không A lắm', en: 'very A / not very A' },
      explanation: {
        vi: 'とても đi với câu khẳng định (rất). あまり luôn đi với câu phủ định (không … lắm).',
        en: 'とても goes with affirmative sentences (very). あまり always goes with negatives (not very).',
      },
      examples: [
        ['この {料理|りょうり} は とても {美味|おい}しい です。', 'Món này rất ngon.', 'This dish is very tasty.'],
        ['{日本語|にほんご} は あまり {難|むずか}しくない です。', 'Tiếng Nhật không khó lắm.', 'Japanese is not very difficult.'],
      ],
      cloze: [
        ['とても {寒|さむ}い です。', 'とても', 'Rất lạnh.', 'It is very cold.'],
        ['あまり {高|たか}くない です。', 'あまり', 'Không đắt lắm.', 'It is not very expensive.'],
      ],
    },
  ],
  dialogue: [
    ['田中', '{日本|にほん} の {生活|せいかつ} は どう ですか。', 'Cuộc sống ở Nhật thế nào?', 'How is life in Japan?'],
    ['アン', '{楽|たの}しい です。 でも、{物|もの} が {高|たか}い です。', 'Vui lắm. Nhưng đồ đắt.', 'It is fun. But things are expensive.'],
    ['田中', '{日本語|にほんご} は {難|むずか}しい ですか。', 'Tiếng Nhật có khó không?', 'Is Japanese difficult?'],
    ['アン', '{漢字|かんじ} は {難|むずか}しい です が、{会話|かいわ} は あまり {難|むずか}しくない です。', 'Kanji thì khó, nhưng hội thoại thì không khó lắm.', 'Kanji is hard, but conversation is not very hard.'],
  ],
} satisfies LessonSource;

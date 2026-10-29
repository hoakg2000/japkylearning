import type { LessonSource } from '../types';

export default {
  id: 'n5-11',
  order: 11,
  title: { vi: 'Mua sắm và tiền', en: 'Shopping and money' },
  goals: [
    { vi: 'Hỏi giá và nói số tiền', en: 'Ask prices and say amounts of money' },
    { vi: 'Mua hàng với ～をください và từ đếm', en: 'Buy things with ～をください and counters' },
  ],
  kanji: ['千', '万', '円'],
  words: [
    { surface: 'いくら', reading: 'いくら', vi: 'bao nhiêu (tiền)', en: 'how much; how many', example: ['この シャツ は いくら ですか。', 'Cái áo sơ mi này bao nhiêu tiền?', 'How much is this shirt?'] },
    { surface: '円', reading: 'えん', vi: 'yên (tiền Nhật)', example: ['この パン は {百|ひゃく}{円|えん} です。', 'Cái bánh mì này 100 yên.', 'This bread is 100 yen.'] },
    { surface: '千', reading: 'せん', vi: 'nghìn', example: ['この {本|ほん} は {千五百|せんごひゃく}{円|えん} です。', 'Quyển sách này 1.500 yên.', 'This book is 1,500 yen.'] },
    { surface: '万', reading: 'まん', vi: 'vạn, mười nghìn', example: ['この {鞄|かばん} は {一万|いちまん}{円|えん} です。', 'Cái cặp này 10.000 yên.', 'This bag is 10,000 yen.'] },
    { surface: 'お金', reading: 'おかね', vi: 'tiền', example: ['{今日|きょう} は お{金|かね} が ありません。', 'Hôm nay tôi không có tiền.', 'I have no money today.'] },
    { surface: '財布', reading: 'さいふ', vi: 'cái ví', example: ['{財布|さいふ} は {鞄|かばん} の {中|なか} に あります。', 'Ví ở trong cặp.', 'The wallet is in the bag.'] },
    { surface: '靴', reading: 'くつ', vi: 'giày', example: ['この {靴|くつ} を ください。', 'Cho tôi đôi giày này.', 'I’ll take these shoes, please.'] },
    { surface: 'シャツ', reading: 'シャツ', vi: 'áo sơ mi', en: 'shirt', example: ['{白|しろ}い シャツ を {二枚|にまい} {買|か}いました。', 'Tôi đã mua hai cái áo sơ mi trắng.', 'I bought two white shirts.'] },
    { surface: '一つ', reading: 'ひとつ', vi: 'một cái', example: ['りんご を {一|ひと}つ ください。', 'Cho tôi một quả táo.', 'One apple, please.'] },
    { surface: '二つ', reading: 'ふたつ', vi: 'hai cái', example: ['ケーキ を {二|ふた}つ {買|か}いました。', 'Tôi đã mua hai cái bánh ngọt.', 'I bought two cakes.'] },
    { surface: '三つ', reading: 'みっつ', vi: 'ba cái', example: ['{卵|たまご} が {三|みっ}つ あります。', 'Có ba quả trứng.', 'There are three eggs.'] },
    { surface: '枚', reading: 'まい', vi: 'tờ, cái (đếm vật mỏng, phẳng)', example: ['{紙|かみ} を {一枚|いちまい} ください。', 'Cho tôi một tờ giấy.', 'One sheet of paper, please.'] },
    { surface: '切手', reading: 'きって', vi: 'tem thư', example: ['{郵便局|ゆうびんきょく} で {切手|きって} を {買|か}います。', 'Tôi mua tem ở bưu điện.', 'I buy stamps at the post office.'] },
    { surface: '下さい', reading: 'ください', vi: 'xin cho tôi; xin hãy', example: ['{水|みず} を ください。', 'Cho tôi nước.', 'Water, please.'] },
    { surface: 'いらっしゃいませ', reading: 'いらっしゃいませ', vi: 'kính chào quý khách', example: ['いらっしゃいませ。 どうぞ。', 'Kính chào quý khách. Xin mời vào.', 'Welcome. Please come in.'] },
    { surface: '全部で', reading: 'ぜんぶで', vi: 'tổng cộng, tất cả', en: 'in total; altogether', example: ['{全部|ぜんぶ}で {三千|さんぜん}{円|えん} です。', 'Tổng cộng 3.000 yên.', 'That is 3,000 yen altogether.'] },
  ],
  grammar: [
    {
      id: 'n5-ikura',
      pattern: 'N は いくら ですか',
      meaning: { vi: 'N giá bao nhiêu?', en: 'How much is N?' },
      explanation: {
        vi: 'Dùng いくら để hỏi giá. Trả lời bằng số + 円: 五百円です. Số lớn: 千 (せん) = 1.000, 一万 (いちまん) = 10.000. Chú ý biến âm: 三百 (さんびゃく), 六百 (ろっぴゃく), 三千 (さんぜん), 八千 (はっせん).',
        en: 'Use いくら to ask a price. Answer with number + 円: 五百円です. Big numbers: 千 (せん) = 1,000, 一万 (いちまん) = 10,000. Note the sound changes: 三百 (さんびゃく), 六百 (ろっぴゃく), 三千 (さんぜん), 八千 (はっせん).',
      },
      examples: [
        ['この {傘|かさ} は いくら ですか。', 'Cái ô này bao nhiêu tiền?', 'How much is this umbrella?'],
        ['それ は {二万|にまん}{円|えん} です。', 'Cái đó 20.000 yên.', 'That one is 20,000 yen.'],
      ],
      cloze: [
        ['この {時計|とけい} は いくら ですか。', 'いくら', 'Chiếc đồng hồ này bao nhiêu tiền?', 'How much is this watch?'],
        ['{切手|きって} は {百|ひゃく}{円|えん} です。', '円', 'Con tem giá 100 yên.', 'The stamp is 100 yen.'],
      ],
    },
    {
      id: 'n5-wo-kudasai',
      pattern: 'N を (số lượng) ください',
      meaning: { vi: 'cho tôi N', en: 'N, please (asking for things)' },
      explanation: {
        vi: 'Dùng khi mua hàng hoặc gọi món. Số lượng đứng sau を, trước ください, không cần trợ từ: りんごを三つください. Từ đếm: ～つ (đồ vật nói chung, đến 10), ～枚 (vật mỏng, phẳng như giấy, áo, tem), ～本 (vật dài như bút, chai).',
        en: 'Use it when shopping or ordering. The quantity goes after を and before ください, with no particle: りんごを三つください. Counters: ～つ (things in general, up to 10), ～枚 (thin flat things: paper, shirts, stamps), ～本 (long things: pens, bottles).',
      },
      examples: [
        ['コーヒー を {二|ふた}つ ください。', 'Cho tôi hai cốc cà phê.', 'Two coffees, please.'],
        ['{鉛筆|えんぴつ} を {三本|さんぼん} ください。', 'Cho tôi ba cái bút chì.', 'Three pencils, please.'],
      ],
      cloze: [
        ['この シャツ を {一枚|いちまい} ください。', 'ください', 'Cho tôi một cái áo sơ mi này.', 'One of these shirts, please.'],
        ['りんご を {四|よっ}つ ください。', 'を', 'Cho tôi bốn quả táo.', 'Four apples, please.'],
      ],
    },
  ],
  dialogue: [
    ['店員', 'いらっしゃいませ。', 'Kính chào quý khách.', 'Welcome.'],
    ['ラン', 'すみません、この シャツ は いくら ですか。', 'Xin lỗi, cái áo sơ mi này bao nhiêu tiền?', 'Excuse me, how much is this shirt?'],
    ['店員', '{二千八百|にせんはっぴゃく}{円|えん} です。', '2.800 yên ạ.', 'It is 2,800 yen.'],
    ['ラン', 'じゃ、これ を {二枚|にまい} ください。', 'Vậy cho tôi hai cái này.', 'Then I’ll take two of these.'],
  ],
} satisfies LessonSource;

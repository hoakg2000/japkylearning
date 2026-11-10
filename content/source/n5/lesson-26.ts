import type { LessonSource } from '../types';

export default {
  id: 'n5-26',
  order: 26,
  title: { vi: 'Đếm đồ vật', en: 'Counting things' },
  goals: [
    { vi: 'Dùng các trợ số từ thường gặp: 本, 枚, 台, 匹, 冊, 杯, 回', en: 'Use common counters: 本, 枚, 台, 匹, 冊, 杯, 回' },
    { vi: 'Nói khoảng bao nhiêu bằng ぐらい, mấy cái bằng 何～', en: 'Say “about” with ぐらい and ask “how many” with 何～' },
  ],
  kanji: [],
  words: [
    { surface: '一本', reading: 'いっぽん', vi: 'một (vật dài: bút, chai, cây)', en: 'one (long, thin object)', example: ['ペン を {一本|いっぽん} {貸|か}して ください。', 'Cho tôi mượn một cây bút.', 'Please lend me one pen.'] },
    { surface: '一匹', reading: 'いっぴき', vi: 'một con (động vật nhỏ)', en: 'one (small animal)', example: ['{家|いえ} に {猫|ねこ} が {一匹|いっぴき} います。', 'Nhà tôi có một con mèo.', 'There is one cat at my house.'] },
    { surface: '一台', reading: 'いちだい', vi: 'một chiếc (máy móc, xe)', en: 'one (machine, vehicle)', example: ['{車|くるま} が {一台|いちだい} あります。', 'Có một chiếc ô tô.', 'There is one car.'] },
    { surface: '一冊', reading: 'いっさつ', vi: 'một cuốn (sách, vở)', en: 'one (book, notebook)', example: ['{本|ほん} を {一冊|いっさつ} {買|か}いました。', 'Tôi đã mua một cuốn sách.', 'I bought one book.'] },
    { surface: '一杯', reading: 'いっぱい', vi: 'một cốc, một bát', en: 'one cup; one bowl', example: ['コーヒー を {一杯|いっぱい} ください。', 'Cho tôi một cốc cà phê.', 'One cup of coffee, please.'] },
    { surface: '一回', reading: 'いっかい', vi: 'một lần', en: 'once; one time', example: ['{一週間|いっしゅうかん} に {一回|いっかい} プール へ {行|い}きます。', 'Mỗi tuần tôi đi bể bơi một lần.', 'I go to the pool once a week.'] },
    { surface: '一枚', reading: 'いちまい', vi: 'một tờ, một tấm (vật mỏng)', en: 'one (flat, thin object)', example: ['{紙|かみ} を {一枚|いちまい} ください。', 'Cho tôi một tờ giấy.', 'One sheet of paper, please.'] },
    { surface: '何回', reading: 'なんかい', vi: 'mấy lần', en: 'how many times', example: ['{日本|にほん} へ {何回|なんかい} {行|い}きました か。', 'Bạn đã đi Nhật mấy lần?', 'How many times have you been to Japan?'] },
    { surface: 'ぐらい', reading: 'ぐらい', vi: 'khoảng, chừng', en: 'about; approximately', example: ['{駅|えき} まで {十分|じゅっぷん} ぐらい です。', 'Đến ga khoảng mười phút.', 'It’s about ten minutes to the station.'] },
    { surface: '鳥', reading: 'とり', vi: 'con chim', example: ['{木|き} の {上|うえ} に {鳥|とり} が います。', 'Trên cây có con chim.', 'There is a bird in the tree.'] },
    { surface: '箱', reading: 'はこ', vi: 'cái hộp', example: ['{箱|はこ} の {中|なか} に {何|なに} が あります か。', 'Trong hộp có gì?', 'What is in the box?'] },
    { surface: 'ボールペン', reading: 'ボールペン', vi: 'bút bi', example: ['ボールペン で {書|か}いて ください。', 'Hãy viết bằng bút bi.', 'Please write with a ballpoint pen.'] },
    { surface: 'コップ', reading: 'コップ', vi: 'cái cốc', example: ['コップ に {水|みず} を {入|い}れます。', 'Rót nước vào cốc.', 'I pour water into the glass.'] },
    { surface: '皿', reading: 'さら', vi: 'cái đĩa', example: ['{皿|さら} を {三枚|さんまい} {出|だ}して ください。', 'Hãy lấy ra ba cái đĩa.', 'Please take out three plates.'] },
    { surface: 'パソコン', reading: 'パソコン', vi: 'máy tính cá nhân', example: ['{会社|かいしゃ} に パソコン が {十台|じゅうだい} あります。', 'Công ty có mười cái máy tính.', 'There are ten computers at the office.'] },
  ],
  grammar: [
    {
      id: 'n5-counters',
      pattern: 'N を (số + trợ số từ) V',
      meaning: { vi: 'đếm bằng trợ số từ: 本・枚・台・匹・冊・杯・回', en: 'counting with counters: 本・枚・台・匹・冊・杯・回' },
      explanation: {
        vi: 'Tiếng Nhật đếm bằng số + trợ số từ hợp với loại đồ vật: 本 vật dài, 枚 vật mỏng phẳng, 台 máy và xe, 匹 con vật nhỏ, 冊 sách vở, 杯 cốc bát, 回 số lần. Cụm số lượng thường đứng sau trợ từ và ngay trước động từ: りんご を 三つ 買います. Một số âm đổi khi đếm: いっぽん, さんぼん, ろっぽん; いっぴき, さんびき. Hỏi: 何本, 何枚, 何台…',
        en: 'Japanese counts with number + a counter that fits the kind of thing: 本 long objects, 枚 flat thin things, 台 machines and vehicles, 匹 small animals, 冊 books, 杯 cups and bowls, 回 times. The quantity usually comes after the particle, right before the verb: りんご を 三つ 買います. Some sounds change: いっぽん, さんぼん, ろっぽん; いっぴき, さんびき. Ask with 何本, 何枚, 何台…',
      },
      examples: [
        ['{切手|きって} を {五枚|ごまい} ください。', 'Cho tôi năm con tem.', 'Five stamps, please.'],
        ['{犬|いぬ} が {三匹|さんびき} います。', 'Có ba con chó.', 'There are three dogs.'],
      ],
      cloze: [
        ['ビール を {二杯|にはい} {飲|の}みました。', '二杯', 'Tôi đã uống hai cốc bia.', 'I drank two glasses of beer.'],
        ['{雑誌|ざっし} を {三冊|さんさつ} {借|か}りました。', '三冊', 'Tôi đã mượn ba cuốn tạp chí.', 'I borrowed three magazines.'],
      ],
    },
    {
      id: 'n5-gurai',
      pattern: '(số lượng / thời gian) ぐらい',
      meaning: { vi: 'khoảng, chừng (ước lượng)', en: 'about, around (estimate)' },
      explanation: {
        vi: 'ぐらい (くらい) đặt sau con số để nói ước chừng: 一時間 ぐらい, 三人 ぐらい. Với giờ cụ thể (mấy giờ) thì dùng ごろ: 三時 ごろ. Câu hỏi: どの ぐらい / どれ ぐらい (khoảng bao lâu, bao nhiêu).',
        en: 'ぐらい (くらい) after a number makes it approximate: 一時間 ぐらい, 三人 ぐらい. For a point in time use ごろ instead: 三時 ごろ. To ask: どの ぐらい / どれ ぐらい (about how long / how much).',
      },
      examples: [
        ['{毎日|まいにち} {二時間|にじかん} ぐらい {勉強|べんきょう} します。', 'Mỗi ngày tôi học khoảng hai tiếng.', 'I study for about two hours every day.'],
        ['{家|いえ} から {会社|かいしゃ} まで どの ぐらい かかります か。', 'Từ nhà đến công ty mất khoảng bao lâu?', 'About how long does it take from your home to the office?'],
      ],
      cloze: [
        ['パーティー に {二十人|にじゅうにん} ぐらい {来|き}ました。', 'ぐらい', 'Khoảng hai mươi người đã đến bữa tiệc.', 'About twenty people came to the party.'],
        ['{一週間|いっしゅうかん} に {三回|さんかい} ぐらい {泳|およ}ぎます。', '三回', 'Một tuần tôi bơi khoảng ba lần.', 'I swim about three times a week.'],
      ],
    },
  ],
  dialogue: [
    ['{店員|てんいん}', 'いらっしゃいませ。', 'Xin mời quý khách.', 'Welcome.'],
    ['ミン', 'すみません、この ボールペン を {五本|ごほん} と、ノート を {三冊|さんさつ} ください。', 'Cho tôi năm cây bút bi này và ba cuốn vở.', 'Five of these ballpoint pens and three notebooks, please.'],
    ['{店員|てんいん}', 'はい。 {全部|ぜんぶ} で {千二百円|せんにひゃくえん} です。 {袋|ふくろ} は {一枚|いちまい} で いい です か。', 'Vâng. Tất cả là 1.200 yên. Một túi được không ạ?', 'Sure. That’s 1,200 yen altogether. Is one bag enough?'],
    ['ミン', 'はい、{一枚|いちまい} で いい です。', 'Vâng, một túi là được.', 'Yes, one is fine.'],
  ],
} satisfies LessonSource;

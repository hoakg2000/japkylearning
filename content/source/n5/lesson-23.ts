import type { LessonSource } from '../types';

export default {
  id: 'n5-23',
  order: 23,
  title: { vi: 'Kinh nghiệm và sở thích', en: 'Experiences and hobbies' },
  goals: [
    { vi: 'Kể mình đã từng làm gì bằng ～たことがあります', en: 'Say what you have done before with ～たことがあります' },
    { vi: 'Liệt kê vài việc tiêu biểu bằng ～たり～たりします', en: 'Give examples of activities with ～たり～たりします' },
  ],
  kanji: [],
  words: [
    { surface: '一度', reading: 'いちど', vi: 'một lần', example: ['{一度|いちど} {日本|にほん} へ {行|い}きたい です。', 'Tôi muốn đi Nhật một lần.', 'I want to go to Japan once.'] },
    { surface: '富士山', reading: 'ふじさん', vi: 'núi Phú Sĩ', example: ['{富士山|ふじさん} は {日本|にほん} で {一番|いちばん} {高|たか}い {山|やま} です。', 'Núi Phú Sĩ là núi cao nhất Nhật Bản.', 'Mount Fuji is the highest mountain in Japan.'] },
    { surface: '登る', reading: 'のぼる', vi: 'leo, trèo', example: ['{夏|なつ} に {山|やま} に {登|のぼ}ります。', 'Mùa hè tôi leo núi.', 'I climb mountains in summer.'] },
    { surface: 'お寺', reading: 'おてら', vi: 'chùa', en: 'Buddhist temple', example: ['{京都|きょうと} に は お{寺|てら} が たくさん あります。', 'Ở Kyoto có rất nhiều chùa.', 'There are many temples in Kyoto.'] },
    { surface: '神社', reading: 'じんじゃ', vi: 'đền thần đạo', example: ['お{正月|しょうがつ} に {神社|じんじゃ} へ {行|い}きます。', 'Tết tôi đi đền.', 'I go to a shrine at New Year.'] },
    { surface: '着物', reading: 'きもの', vi: 'kimono', example: ['{着物|きもの} を {着|き}た こと が あります か。', 'Bạn đã từng mặc kimono chưa?', 'Have you ever worn a kimono?'] },
    { surface: '歌', reading: 'うた', vi: 'bài hát', example: ['この {歌|うた} が {好|す}き です。', 'Tôi thích bài hát này.', 'I like this song.'] },
    { surface: '歌う', reading: 'うたう', vi: 'hát', example: ['カラオケ で {歌|うた}います。', 'Tôi hát karaoke.', 'I sing at karaoke.'] },
    { surface: '音楽', reading: 'おんがく', vi: 'âm nhạc', example: ['{音楽|おんがく} を {聞|き}きながら {勉強|べんきょう} します。', 'Tôi vừa nghe nhạc vừa học.', 'I study while listening to music.'] },
    { surface: 'ギター', reading: 'ギター', vi: 'đàn ghi-ta', example: ['ギター を {練習|れんしゅう} して います。', 'Tôi đang tập ghi-ta.', 'I am practising the guitar.'] },
    { surface: '弾く', reading: 'ひく', vi: 'chơi (nhạc cụ có dây, phím)', example: ['{弟|おとうと} は ピアノ を {弾|ひ}きます。', 'Em trai tôi chơi piano.', 'My younger brother plays the piano.'] },
    { surface: '絵', reading: 'え', vi: 'tranh, bức vẽ', example: ['{妹|いもうと} は {絵|え} が {上手|じょうず} です。', 'Em gái tôi vẽ giỏi.', 'My younger sister is good at drawing.'] },
    { surface: '動物', reading: 'どうぶつ', vi: 'động vật', example: ['どんな {動物|どうぶつ} が {好|す}き です か。', 'Bạn thích con vật nào?', 'What kind of animals do you like?'] },
    { surface: '動物園', reading: 'どうぶつえん', vi: 'vườn thú', example: ['{子供|こども} と {動物園|どうぶつえん} へ {行|い}きました。', 'Tôi đã đi sở thú với con.', 'I went to the zoo with my child.'] },
    { surface: '趣味', reading: 'しゅみ', vi: 'sở thích', example: ['{趣味|しゅみ} は {何|なん} です か。', 'Sở thích của bạn là gì?', 'What are your hobbies?'] },
  ],
  grammar: [
    {
      id: 'n5-ta-koto-ga-aru',
      pattern: 'V-た こと が あります',
      meaning: { vi: 'đã từng làm V', en: 'have done V before (experience)' },
      explanation: {
        vi: 'Thể た (thể quá khứ thông thường) làm như thể て nhưng đổi て → た, で → だ: 行って → 行った, 飲んで → 飲んだ. V-た + こと が あります nói về kinh nghiệm đã từng có. Phủ định: ～た こと が ありません (chưa từng). Không dùng cho việc vừa làm hôm qua.',
        en: 'The た-form (plain past) is made like the て-form with て → た, で → だ: 行って → 行った, 飲んで → 飲んだ. V-た + こと が あります talks about an experience you have had. Negative: ～た こと が ありません (never). It is not used for something you simply did yesterday.',
      },
      examples: [
        ['{富士山|ふじさん} に {登|のぼ}った こと が あります。', 'Tôi đã từng leo núi Phú Sĩ.', 'I have climbed Mount Fuji.'],
        ['{着物|きもの} を {着|き}た こと が ありません。', 'Tôi chưa từng mặc kimono.', 'I have never worn a kimono.'],
      ],
      cloze: [
        ['{日本|にほん} の お{寺|てら} を {見|み}た こと が あります か。', 'こと', 'Bạn đã từng xem chùa Nhật chưa?', 'Have you ever seen a Japanese temple?'],
        ['{納豆|なっとう} を {食|た}べた こと が ありません。', '食べた', 'Tôi chưa từng ăn natto.', 'I have never eaten natto.'],
      ],
    },
    {
      id: 'n5-tari-tari',
      pattern: 'V1-たり V2-たり します',
      meaning: { vi: 'lúc thì V1, lúc thì V2; nào là V1, nào là V2', en: 'do things like V1 and V2' },
      explanation: {
        vi: 'Dùng thể た + り để nêu vài hoạt động tiêu biểu, ngụ ý còn việc khác nữa. Cuối mẫu luôn có します (hoặc しました cho quá khứ).',
        en: 'Use the た-form + り to give a few typical activities, implying there are others. The pattern always ends with します (or しました for the past).',
      },
      examples: [
        ['{週末|しゅうまつ} は {本|ほん} を {読|よ}んだり、{音楽|おんがく} を {聞|き}いたり します。', 'Cuối tuần tôi lúc thì đọc sách, lúc thì nghe nhạc.', 'At weekends I do things like reading and listening to music.'],
        ['{京都|きょうと} で お{寺|てら} を {見|み}たり、{写真|しゃしん} を {撮|と}ったり しました。', 'Ở Kyoto tôi đã ngắm chùa, chụp ảnh…', 'In Kyoto I saw temples, took photos and so on.'],
      ],
      cloze: [
        ['{休|やす}み の {日|ひ} は {歌|うた}を {歌|うた}ったり、ギター を {弾|ひ}いたり します。', '弾いたり', 'Ngày nghỉ tôi lúc thì hát, lúc thì chơi ghi-ta.', 'On days off I sing, play the guitar and so on.'],
        ['{公園|こうえん} で {散歩|さんぽ} したり、{絵|え} を {描|か}いたり しました。', 'したり', 'Tôi đã đi dạo, vẽ tranh ở công viên.', 'I walked, drew pictures and so on in the park.'],
      ],
    },
  ],
  dialogue: [
    ['{山田|やまだ}', 'ミン さん、{富士山|ふじさん} に {登|のぼ}った こと が あります か。', 'Anh Minh đã từng leo núi Phú Sĩ chưa?', 'Minh, have you ever climbed Mount Fuji?'],
    ['ミン', 'いいえ、まだ ありません。 {山田|やまだ} さん は？', 'Chưa, tôi chưa từng. Còn chị Yamada?', 'No, not yet. How about you, Ms Yamada?'],
    ['{山田|やまだ}', '{去年|きょねん} {一度|いちど} {登|のぼ}りました。 {写真|しゃしん} を {撮|と}ったり、{山|やま} の {上|うえ} で ご{飯|はん} を {食|た}べたり しました。', 'Năm ngoái tôi đã leo một lần. Tôi chụp ảnh, ăn cơm trên đỉnh núi…', 'I climbed it once last year. I took photos, ate on top of the mountain and so on.'],
    ['ミン', 'いい です ね。 {私|わたし} も {一度|いちど} {登|のぼ}りたい です。', 'Thích quá. Tôi cũng muốn leo một lần.', 'Sounds great. I want to climb it once too.'],
  ],
} satisfies LessonSource;

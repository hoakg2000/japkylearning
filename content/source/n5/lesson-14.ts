import type { LessonSource } from '../types';

export default {
  id: 'n5-14',
  order: 14,
  title: { vi: 'Chỉ đường', en: 'Giving directions' },
  goals: [
    { vi: 'Hỏi và chỉ đường, nói phương hướng', en: 'Ask for and give directions, name the compass points' },
    { vi: 'Nhờ người khác làm gì với thể て + ください', en: 'Ask someone to do something with the て-form + ください' },
  ],
  kanji: ['東', '西', '南', '北', '道'],
  words: [
    { surface: '東', reading: 'ひがし', vi: 'phía đông', example: ['{駅|えき} の {東|ひがし} に {公園|こうえん} が あります。', 'Phía đông nhà ga có công viên.', 'There is a park to the east of the station.'] },
    { surface: '西', reading: 'にし', vi: 'phía tây', example: ['{西|にし} の {空|そら} が {赤|あか}い です。', 'Bầu trời phía tây màu đỏ.', 'The western sky is red.'] },
    { surface: '南', reading: 'みなみ', vi: 'phía nam', example: ['{私|わたし} の {国|くに} の {南|みなみ} は {暑|あつ}い です。', 'Miền nam nước tôi nóng.', 'The south of my country is hot.'] },
    { surface: '北', reading: 'きた', vi: 'phía bắc', example: ['{北|きた} の {町|まち} は {冬|ふゆ} が {寒|さむ}い です。', 'Thị trấn phía bắc mùa đông lạnh.', 'Winters are cold in the northern towns.'] },
    { surface: '道', reading: 'みち', vi: 'con đường', example: ['この {道|みち} は {広|ひろ}い です。', 'Con đường này rộng.', 'This road is wide.'] },
    { surface: '角', reading: 'かど', vi: 'góc (đường, phố)', example: ['{角|かど} に {銀行|ぎんこう} が あります。', 'Ở góc đường có ngân hàng.', 'There is a bank on the corner.'] },
    { surface: '信号', reading: 'しんごう', vi: 'đèn giao thông', example: ['{次|つぎ} の {信号|しんごう} を {右|みぎ} へ {曲|ま}がります。', 'Đến đèn giao thông tiếp theo thì rẽ phải.', 'Turn right at the next traffic light.'] },
    { surface: '橋', reading: 'はし', vi: 'cây cầu', example: ['{川|かわ} に {古|ふる}い {橋|はし} が あります。', 'Trên sông có cây cầu cũ.', 'There is an old bridge over the river.'] },
    { surface: '地図', reading: 'ちず', vi: 'bản đồ', example: ['{地図|ちず} を {見|み}ません か。', 'Mình xem bản đồ không?', 'Shall we look at the map?'] },
    { surface: 'まっすぐ', reading: 'まっすぐ', vi: 'thẳng', example: ['この {道|みち} を まっすぐ {行|い}きます。', 'Đi thẳng con đường này.', 'Go straight along this road.'] },
    { surface: '曲がる', reading: 'まがる', vi: 'rẽ, quẹo', example: ['{二|ふた}つ {目|め} の {角|かど} を {左|ひだり} へ {曲|ま}がります。', 'Rẽ trái ở góc thứ hai.', 'Turn left at the second corner.'] },
    { surface: '渡る', reading: 'わたる', vi: 'đi qua, băng qua', example: ['{橋|はし} を {渡|わた}ります。', 'Đi qua cầu.', 'Cross the bridge.'] },
    { surface: '教える', reading: 'おしえる', vi: 'dạy; chỉ cho', example: ['{先生|せんせい} は {英語|えいご} を {教|おし}えます。', 'Thầy giáo dạy tiếng Anh.', 'The teacher teaches English.'] },
    { surface: '近く', reading: 'ちかく', vi: 'gần đây, chỗ gần', example: ['{駅|えき} の {近|ちか}く に {店|みせ} が {多|おお}い です。', 'Gần nhà ga có nhiều cửa hàng.', 'There are many shops near the station.'] },
    { surface: '隣', reading: 'となり', vi: 'bên cạnh', example: ['{銀行|ぎんこう} の {隣|となり} は {本屋|ほんや} です。', 'Bên cạnh ngân hàng là hiệu sách.', 'Next to the bank is a bookshop.'] },
    { surface: '待つ', reading: 'まつ', vi: 'đợi, chờ', example: ['{駅|えき} で {友達|ともだち} を {待|ま}ちます。', 'Tôi đợi bạn ở nhà ga.', 'I wait for my friend at the station.'] },
  ],
  grammar: [
    {
      id: 'n5-te-kudasai',
      pattern: 'V て ください',
      meaning: { vi: 'hãy làm V (nhờ, yêu cầu lịch sự)', en: 'please do V (polite request)' },
      explanation: {
        vi: 'Thể て + ください để nhờ hoặc chỉ dẫn lịch sự. Cách tạo thể て: động từ nhóm 1 đuôi う・つ・る → って (待つ → 待って), む・ぶ・ぬ → んで (読む → 読んで), く → いて (書く → 書いて; ngoại lệ 行く → 行って), ぐ → いで, す → して. Nhóm 2: bỏ る thêm て (教える → 教えて). Nhóm 3: する → して, 来る → 来て.',
        en: 'The て-form + ください makes a polite request or instruction. Making the て-form: group 1 verbs ending in う・つ・る → って (待つ → 待って), む・ぶ・ぬ → んで (読む → 読んで), く → いて (書く → 書いて; but 行く → 行って), ぐ → いで, す → して. Group 2: drop る, add て (教える → 教えて). Group 3: する → して, 来る → 来て.',
      },
      examples: [
        ['ちょっと {待|ま}って ください。', 'Xin đợi một chút.', 'Please wait a moment.'],
        ['{駅|えき} へ の {道|みち} を {教|おし}えて ください。', 'Xin chỉ cho tôi đường đến nhà ga.', 'Please tell me the way to the station.'],
      ],
      cloze: [
        ['{次|つぎ} の {角|かど} を {右|みぎ} へ {曲|ま}がって ください。', 'ください', 'Hãy rẽ phải ở góc tiếp theo.', 'Please turn right at the next corner.'],
        ['ここ に {名前|なまえ} を {書|か}いて ください。', '書いて', 'Xin hãy viết tên vào đây.', 'Please write your name here.'],
      ],
    },
    {
      id: 'n5-wo-movement',
      pattern: '(nơi chốn) を V (di chuyển)',
      meaning: { vi: 'đi qua/dọc theo nơi chốn', en: 'move through/along/across a place' },
      explanation: {
        vi: 'Với động từ di chuyển (渡る, 曲がる, 歩く, 通る…), を đánh dấu nơi mà ta đi qua hoặc đi dọc theo: 橋を渡る (qua cầu), 角を曲がる (rẽ ở góc), 道を歩く (đi bộ trên đường). Hướng rẽ dùng へ hoặc に: 右へ曲がる.',
        en: 'With movement verbs (渡る, 曲がる, 歩く, 通る…), を marks the place you pass through or along: 橋を渡る (cross the bridge), 角を曲がる (turn at the corner), 道を歩く (walk along the road). The direction takes へ or に: 右へ曲がる.',
      },
      examples: [
        ['この {道|みち} を まっすぐ {行|い}って ください。', 'Hãy đi thẳng con đường này.', 'Please go straight along this road.'],
        ['{公園|こうえん} を {歩|ある}きました。', 'Tôi đã đi bộ trong công viên.', 'I walked through the park.'],
      ],
      cloze: [
        ['{信号|しんごう} を {渡|わた}って ください。', 'を', 'Hãy băng qua chỗ đèn giao thông.', 'Please cross at the traffic light.'],
        ['あの {角|かど} を {左|ひだり} へ {曲|ま}がります。', '曲がります', 'Rẽ trái ở góc kia.', 'Turn left at that corner.'],
      ],
    },
  ],
  dialogue: [
    ['トム', 'すみません、{郵便局|ゆうびんきょく} は どこ ですか。', 'Xin lỗi, bưu điện ở đâu ạ?', 'Excuse me, where is the post office?'],
    ['女の人', 'この {道|みち} を まっすぐ {行|い}って ください。', 'Anh đi thẳng con đường này nhé.', 'Go straight along this road.'],
    ['女の人', 'それから、{信号|しんごう} を {右|みぎ} へ {曲|ま}がって ください。 {銀行|ぎんこう} の {隣|となり} です。', 'Sau đó rẽ phải ở đèn giao thông. Nó ở cạnh ngân hàng.', 'Then turn right at the traffic light. It is next to the bank.'],
    ['トム', 'ありがとう ございます。', 'Cảm ơn chị.', 'Thank you very much.'],
  ],
} satisfies LessonSource;

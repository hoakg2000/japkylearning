import type { LessonSource } from '../types';

export default {
  id: 'n5-19',
  order: 19,
  title: { vi: 'So sánh', en: 'Comparisons' },
  goals: [
    { vi: 'So sánh hai thứ với ～より, ～のほうが', en: 'Compare two things with ～より and ～のほうが' },
    { vi: 'Nói cái nhất trong một nhóm với いちばん', en: 'Say which is the most in a group with いちばん' },
  ],
  kanji: ['長', '白'],
  words: [
    { surface: '長い', reading: 'ながい', vi: 'dài', example: ['{姉|あね} の {髪|かみ} は {長|なが}い です。', 'Tóc chị gái tôi dài.', 'My older sister’s hair is long.'] },
    { surface: '短い', reading: 'みじかい', vi: 'ngắn', example: ['{冬|ふゆ} は {昼|ひる} が {短|みじか}い です。', 'Mùa đông ban ngày ngắn.', 'The days are short in winter.'] },
    { surface: '白い', reading: 'しろい', vi: 'trắng', example: ['{白|しろ}い {猫|ねこ} が {庭|にわ} に います。', 'Có con mèo trắng trong vườn.', 'There is a white cat in the garden.'] },
    { surface: '黒い', reading: 'くろい', vi: 'đen', example: ['{黒|くろ}い {鞄|かばん} は {誰|だれ} の ですか。', 'Cái cặp đen là của ai?', 'Whose is the black bag?'] },
    { surface: '赤い', reading: 'あかい', vi: 'đỏ', example: ['{赤|あか}い {花|はな} が {好|す}き です。', 'Tôi thích hoa màu đỏ.', 'I like red flowers.'] },
    { surface: '青い', reading: 'あおい', vi: 'xanh (da trời, nước biển)', example: ['{今日|きょう} は {空|そら} が {青|あお}い です ね。', 'Hôm nay trời xanh nhỉ.', 'The sky is blue today.'] },
    { surface: '重い', reading: 'おもい', vi: 'nặng', example: ['この {箱|はこ} は {重|おも}い です。', 'Cái hộp này nặng.', 'This box is heavy.'] },
    { surface: '軽い', reading: 'かるい', vi: 'nhẹ', example: ['この パソコン は とても {軽|かる}い です。', 'Cái máy tính này rất nhẹ.', 'This computer is very light.'] },
    { surface: '速い', reading: 'はやい', vi: 'nhanh', example: ['{新幹線|しんかんせん} は {速|はや}い です。', 'Tàu Shinkansen chạy nhanh.', 'The Shinkansen is fast.'] },
    { surface: '遅い', reading: 'おそい', vi: 'chậm; muộn', example: ['この バス は {遅|おそ}い です ね。', 'Xe buýt này chậm nhỉ.', 'This bus is slow, isn’t it?'] },
    { surface: '広い', reading: 'ひろい', vi: 'rộng', example: ['{新|あたら}しい {部屋|へや} は {広|ひろ}い です。', 'Căn phòng mới rộng.', 'The new room is spacious.'] },
    { surface: '狭い', reading: 'せまい', vi: 'chật, hẹp', example: ['{私|わたし} の {部屋|へや} は {狭|せま}い です。', 'Phòng tôi chật.', 'My room is small.'] },
    { surface: '強い', reading: 'つよい', vi: 'mạnh', example: ['{今日|きょう} は {風|かぜ} が {強|つよ}い です。', 'Hôm nay gió mạnh.', 'The wind is strong today.'] },
    { surface: '遠い', reading: 'とおい', vi: 'xa', example: ['{学校|がっこう} は {家|いえ} から {遠|とお}い です。', 'Trường học xa nhà.', 'The school is far from my house.'] },
    { surface: '一番', reading: 'いちばん', vi: 'nhất; số một', example: ['{家族|かぞく} で {父|ちち} が {一番|いちばん} {背|せ} が {高|たか}い です。', 'Trong nhà bố tôi cao nhất.', 'My father is the tallest in my family.'] },
    { surface: 'どちら', reading: 'どちら', vi: 'cái nào (trong hai cái); phía nào', example: ['{紅茶|こうちゃ} と コーヒー と どちら が いい ですか。', 'Trà đen và cà phê, bạn muốn cái nào?', 'Which would you like, tea or coffee?'] },
    { surface: '方', reading: 'ほう', vi: 'phía, bên (dùng khi so sánh)', example: ['こちら の {方|ほう} が {安|やす}い です。', 'Cái bên này rẻ hơn.', 'This one is cheaper.'] },
  ],
  grammar: [
    {
      id: 'n5-yori-hou-ga',
      pattern: 'A は B より ～ / A と B と どちら が ～ か — A の ほう が ～',
      meaning: { vi: 'A ～ hơn B; giữa A và B cái nào ～ hơn?', en: 'A is more ～ than B; which is more ～, A or B?' },
      explanation: {
        vi: 'So sánh hai thứ: A は B より + tính từ (A hơn B). Hỏi: A と B と どちらが + tính từ + ですか. Trả lời: A のほうが + tính từ + です (A hơn). Nếu ngang nhau: どちらも + tính từ + です. Tính từ trong tiếng Nhật không đổi hình thức khi so sánh.',
        en: 'To compare two things: A は B より + adjective (A is more ～ than B). Ask: A と B と どちらが + adjective + ですか. Answer: A のほうが + adjective + です (A is more ～). If equal: どちらも + adjective + です. Japanese adjectives do not change form for comparisons.',
      },
      examples: [
        ['{東京|とうきょう} は {大阪|おおさか} より {大|おお}きい です。', 'Tokyo lớn hơn Osaka.', 'Tokyo is bigger than Osaka.'],
        ['{電車|でんしゃ} と バス と どちら が {速|はや}い ですか。 — {電車|でんしゃ} の {方|ほう} が {速|はや}い です。', 'Tàu điện và xe buýt, cái nào nhanh hơn? — Tàu điện nhanh hơn.', 'Which is faster, the train or the bus? — The train is faster.'],
      ],
      cloze: [
        ['{兄|あに} は {父|ちち} より {背|せ} が {高|たか}い です。', 'より', 'Anh trai tôi cao hơn bố tôi.', 'My older brother is taller than my father.'],
        ['{夏|なつ} と {冬|ふゆ} と どちら が {好|す}き ですか。', 'どちら', 'Bạn thích mùa hè hay mùa đông hơn?', 'Which do you like better, summer or winter?'],
      ],
    },
    {
      id: 'n5-ichiban',
      pattern: 'N の 中 で ～ が いちばん ～',
      meaning: { vi: 'trong nhóm N, ～ là ～ nhất', en: 'among N, ～ is the most ～' },
      explanation: {
        vi: 'So sánh nhất trong một nhóm từ ba thứ trở lên: (nhóm) の中で X がいちばん + tính từ + です. Hỏi: (nhóm) の中で 何/どこ/誰/いつ が いちばん + tính từ + ですか. Với nhóm nhỏ như gia đình, lớp học có thể dùng で: 家族で.',
        en: 'For the most in a group of three or more: (group) の中で X がいちばん + adjective + です. Ask: (group) の中で 何/どこ/誰/いつ が いちばん + adjective + ですか. With groups like a family or class, で alone also works: 家族で.',
      },
      examples: [
        ['{果物|くだもの} の {中|なか} で {何|なに} が {一番|いちばん} {好|す}き ですか。', 'Trong các loại hoa quả, bạn thích loại nào nhất?', 'Which fruit do you like best?'],
        ['{日本|にほん} で {一番|いちばん} {高|たか}い {山|やま} は {富士山|ふじさん} です。', 'Ngọn núi cao nhất Nhật Bản là núi Phú Sĩ.', 'The highest mountain in Japan is Mt Fuji.'],
      ],
      cloze: [
        ['クラス の {中|なか} で {誰|だれ} が {一番|いちばん} {若|わか}い ですか。', '中', 'Trong lớp ai trẻ nhất?', 'Who is the youngest in the class?'],
        ['{一年|いちねん} で {八月|はちがつ} が {一番|いちばん} {暑|あつ}い です。', '一番', 'Trong năm tháng 8 nóng nhất.', 'August is the hottest month of the year.'],
      ],
    },
  ],
  dialogue: [
    ['店員', 'この {白|しろ}い {鞄|かばん} は どう ですか。', 'Cái cặp trắng này thế nào ạ?', 'How about this white bag?'],
    ['マイ', 'うーん、{白|しろ}い の と {黒|くろ}い の と どちら が {軽|かる}い ですか。', 'Ừm, cái trắng và cái đen, cái nào nhẹ hơn?', 'Hmm, which is lighter, the white one or the black one?'],
    ['店員', '{白|しろ}い {方|ほう} が {軽|かる}い です。 この {店|みせ} で {一番|いちばん} {軽|かる}い です よ。', 'Cái trắng nhẹ hơn ạ. Nó nhẹ nhất trong cửa hàng đấy.', 'The white one is lighter. It is the lightest in the shop.'],
    ['マイ', 'じゃ、{白|しろ}い の を ください。', 'Vậy cho tôi cái trắng.', 'Then I’ll take the white one.'],
  ],
} satisfies LessonSource;

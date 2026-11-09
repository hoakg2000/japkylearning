import type { LessonSource } from '../types';

export default {
  id: 'n5-15',
  order: 15,
  title: { vi: 'Đang làm gì', en: 'What are you doing?' },
  goals: [
    { vi: 'Nói hành động đang diễn ra với ～ています', en: 'Describe actions in progress with ～ています' },
    { vi: 'Nói trạng thái kéo dài: nơi ở, nghề nghiệp, quần áo đang mặc', en: 'Describe ongoing states: where you live, your job, what you are wearing' },
  ],
  kanji: ['出', '入', '立'],
  words: [
    { surface: '出る', reading: 'でる', vi: 'ra, ra khỏi', example: ['{七時|しちじ} に {家|いえ} を {出|で}ます。', 'Tôi ra khỏi nhà lúc 7 giờ.', 'I leave home at seven.'] },
    { surface: '入る', reading: 'はいる', vi: 'vào', example: ['{部屋|へや} に {入|はい}ります。', 'Tôi vào phòng.', 'I go into the room.'] },
    { surface: '立つ', reading: 'たつ', vi: 'đứng', example: ['{駅|えき} の {前|まえ} に {男|おとこ}の{人|ひと} が {立|た}って います。', 'Có người đàn ông đang đứng trước nhà ga.', 'A man is standing in front of the station.'] },
    { surface: '座る', reading: 'すわる', vi: 'ngồi', example: ['{椅子|いす} に {座|すわ}ります。', 'Tôi ngồi xuống ghế.', 'I sit on the chair.'] },
    { surface: '住む', reading: 'すむ', vi: 'sống, cư trú', example: ['{兄|あに} は {大阪|おおさか} に {住|す}んで います。', 'Anh trai tôi sống ở Osaka.', 'My older brother lives in Osaka.'] },
    { surface: '知る', reading: 'しる', vi: 'biết', example: ['{私|わたし} は あの {人|ひと} を {知|し}って います。', 'Tôi biết người đó.', 'I know that person.'] },
    { surface: '着る', reading: 'きる', vi: 'mặc (áo)', example: ['{今日|きょう} は {新|あたら}しい シャツ を {着|き}ます。', 'Hôm nay tôi mặc áo sơ mi mới.', 'Today I will wear a new shirt.'] },
    { surface: '持つ', reading: 'もつ', vi: 'cầm, mang; có', example: ['{傘|かさ} を {持|も}って いますか。', 'Bạn có mang ô không?', 'Do you have an umbrella with you?'] },
    { surface: '使う', reading: 'つかう', vi: 'dùng, sử dụng', example: ['この パソコン を {使|つか}います。', 'Tôi dùng cái máy tính này.', 'I use this computer.'] },
    { surface: '作る', reading: 'つくる', vi: 'làm, chế tạo; nấu', example: ['{母|はは} が {晩|ばん}ご{飯|はん} を {作|つく}ります。', 'Mẹ nấu bữa tối.', 'My mother makes dinner.'] },
    { surface: '開ける', reading: 'あける', vi: 'mở', example: ['{窓|まど} を {開|あ}けます。', 'Tôi mở cửa sổ.', 'I open the window.'] },
    { surface: '閉める', reading: 'しめる', vi: 'đóng', example: ['ドア を {閉|し}めます。', 'Tôi đóng cửa.', 'I close the door.'] },
    { surface: '降る', reading: 'ふる', vi: 'rơi (mưa, tuyết)', example: ['{雨|あめ} が {降|ふ}って います。', 'Trời đang mưa.', 'It is raining.'] },
    { surface: '洗う', reading: 'あらう', vi: 'rửa, giặt', example: ['{手|て} を {洗|あら}います。', 'Tôi rửa tay.', 'I wash my hands.'] },
    { surface: '掃除する', reading: 'そうじする', vi: 'dọn dẹp, quét dọn', example: ['{日曜日|にちようび} に {部屋|へや} を {掃除|そうじ} します。', 'Chủ nhật tôi dọn phòng.', 'I clean my room on Sunday.'] },
    { surface: '眼鏡', reading: 'めがね', vi: 'kính (đeo mắt)', example: ['{父|ちち} は {眼鏡|めがね} を かけて います。', 'Bố tôi đeo kính.', 'My father wears glasses.'] },
    { surface: '帽子', reading: 'ぼうし', vi: 'mũ', example: ['{弟|おとうと} は {赤|あか}い {帽子|ぼうし} を かぶって います。', 'Em trai tôi đang đội mũ đỏ.', 'My younger brother is wearing a red cap.'] },
  ],
  grammar: [
    {
      id: 'n5-te-imasu-progress',
      pattern: 'V て います',
      meaning: { vi: 'đang làm V', en: 'be doing V (action in progress)' },
      explanation: {
        vi: 'Thể て + います diễn tả hành động đang diễn ra vào lúc nói: 今、本を読んでいます. Phủ định: ～ていません. Hỏi: 何をしていますか (Bạn đang làm gì?). Văn nói hay rút gọn thành ～てます.',
        en: 'The て-form + います describes an action happening right now: 今、本を読んでいます. Negative: ～ていません. Question: 何をしていますか (What are you doing?). In casual speech it often shortens to ～てます.',
      },
      examples: [
        ['{今|いま}、{母|はは} は {料理|りょうり} を {作|つく}って います。', 'Bây giờ mẹ tôi đang nấu ăn.', 'My mother is cooking right now.'],
        ['{子供|こども} たち は {公園|こうえん} で {遊|あそ}んで います。', 'Bọn trẻ đang chơi ở công viên.', 'The children are playing in the park.'],
      ],
      cloze: [
        ['{今|いま} {何|なに} を して います か。', 'しています', 'Bây giờ bạn đang làm gì?', 'What are you doing now?'],
        ['{雨|あめ} が {降|ふ}って います。', '降って', 'Trời đang mưa.', 'It is raining.'],
      ],
    },
    {
      id: 'n5-te-imasu-state',
      pattern: 'V て います (trạng thái)',
      meaning: { vi: 'trạng thái kéo dài, kết quả của hành động', en: 'an ongoing state or the result of an action' },
      explanation: {
        vi: 'Với một số động từ, ～ています diễn tả trạng thái kéo dài chứ không phải hành động đang xảy ra: 住んでいます (đang sống ở), 結婚しています (đã kết hôn), 知っています (biết), 持っています (có), 着ています (đang mặc), 働いています (làm việc ở). Chú ý phủ định của 知っています là 知りません.',
        en: 'With some verbs, ～ています describes a continuing state rather than an action in progress: 住んでいます (live in), 結婚しています (be married), 知っています (know), 持っています (have), 着ています (be wearing), 働いています (work at). Note the negative of 知っています is 知りません.',
      },
      examples: [
        ['{姉|あね} は {結婚|けっこん} して います。', 'Chị gái tôi đã lập gia đình.', 'My older sister is married.'],
        ['{山田|やまだ}さん の {電話番号|でんわばんごう} を {知|し}って いますか。 — いいえ、{知|し}りません。', 'Bạn có biết số điện thoại của anh Yamada không? — Không, tôi không biết.', 'Do you know Mr Yamada’s phone number? — No, I don’t.'],
      ],
      cloze: [
        ['{私|わたし} は {東京|とうきょう} に {住|す}んで います。', '住んで', 'Tôi sống ở Tokyo.', 'I live in Tokyo.'],
        ['リン さん は {白|しろ}い シャツ を {着|き}て います。', '着て', 'Linh đang mặc áo sơ mi trắng.', 'Linh is wearing a white shirt.'],
      ],
    },
  ],
  dialogue: [
    ['ケン', 'もしもし、アン さん。 {今|いま} {何|なに} を して います か。', 'Alô, An à. Bây giờ bạn đang làm gì thế?', 'Hello, An. What are you doing now?'],
    ['アン', '{部屋|へや} を {掃除|そうじ} して います。', 'Mình đang dọn phòng.', 'I am cleaning my room.'],
    ['ケン', 'そう。 {僕|ぼく} は {駅|えき} の {前|まえ} で {待|ま}って います。', 'Thế à. Mình đang đợi ở trước nhà ga.', 'I see. I am waiting in front of the station.'],
    ['アン', 'あ、ごめん。 すぐ {家|いえ} を {出|で}ます。', 'A, xin lỗi. Mình ra khỏi nhà ngay đây.', 'Oh, sorry. I’ll leave home right away.'],
  ],
} satisfies LessonSource;

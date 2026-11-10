import type { LessonSource } from '../types';

export default {
  id: 'n5-30',
  order: 30,
  title: { vi: 'Ôn tập: dự định và đề nghị giúp', en: 'Review: plans and offers' },
  goals: [
    { vi: 'Nói dự định bằng V (từ điển) つもりです', en: 'Talk about plans with V (dictionary) つもりです' },
    { vi: 'Đề nghị giúp người khác bằng V-ましょうか', en: 'Offer help with V-ましょうか' },
  ],
  kanji: [],
  words: [
    { surface: '結婚', reading: 'けっこん', vi: 'kết hôn', example: ['{姉|あね} は {来年|らいねん} {結婚|けっこん} します。', 'Chị tôi năm sau kết hôn.', 'My sister is getting married next year.'] },
    { surface: '留学', reading: 'りゅうがく', vi: 'du học', example: ['{日本|にほん} へ {留学|りゅうがく} したい です。', 'Tôi muốn du học Nhật.', 'I want to study abroad in Japan.'] },
    { surface: '卒業', reading: 'そつぎょう', vi: 'tốt nghiệp', example: ['{来年|らいねん} {大学|だいがく} を {卒業|そつぎょう} します。', 'Năm sau tôi tốt nghiệp đại học.', 'I graduate from university next year.'] },
    { surface: '空港', reading: 'くうこう', vi: 'sân bay', example: ['{空港|くうこう} まで バス で {行|い}きます。', 'Tôi đi xe buýt ra sân bay.', 'I go to the airport by bus.'] },
    { surface: '切符', reading: 'きっぷ', vi: 'vé (tàu, xe)', example: ['{駅|えき} で {切符|きっぷ} を {買|か}います。', 'Tôi mua vé ở ga.', 'I buy a ticket at the station.'] },
    { surface: '地下鉄', reading: 'ちかてつ', vi: 'tàu điện ngầm', example: ['{地下鉄|ちかてつ} は {便利|べんり} です。', 'Tàu điện ngầm tiện lợi.', 'The subway is convenient.'] },
    { surface: '迎える', reading: 'むかえる', vi: 'đón', example: ['{空港|くうこう} へ {友達|ともだち} を {迎|むか}え に {行|い}きます。', 'Tôi ra sân bay đón bạn.', 'I go to the airport to meet my friend.'] },
    { surface: '見せる', reading: 'みせる', vi: 'cho xem', example: ['{写真|しゃしん} を {見|み}せて ください。', 'Cho tôi xem ảnh.', 'Please show me the photos.'] },
    { surface: '呼ぶ', reading: 'よぶ', vi: 'gọi, mời', example: ['タクシー を {呼|よ}びましょう か。', 'Tôi gọi taxi nhé?', 'Shall I call a taxi?'] },
    { surface: '急ぐ', reading: 'いそぐ', vi: 'vội, gấp', example: ['{急|いそ}いで ください。 {電車|でんしゃ} が {来|き}ます。', 'Nhanh lên. Tàu đến rồi.', 'Please hurry. The train is coming.'] },
    { surface: '止める', reading: 'とめる', vi: 'dừng, đỗ (xe)', example: ['ここ に {車|くるま} を {止|と}めないで ください。', 'Đừng đỗ xe ở đây.', 'Please don’t park here.'] },
    { surface: '手伝う', reading: 'てつだう', vi: 'giúp đỡ', example: ['{何|なに} か {手伝|てつだ}いましょう か。', 'Tôi giúp gì được không?', 'Shall I help with something?'] },
    { surface: '予定', reading: 'よてい', vi: 'kế hoạch, lịch trình', example: ['{週末|しゅうまつ} の {予定|よてい} は ありますか。', 'Cuối tuần bạn có kế hoạch gì không?', 'Do you have plans for the weekend?'] },
    { surface: '将来', reading: 'しょうらい', vi: 'tương lai', example: ['{将来|しょうらい}、{日本|にほん} で {働|はたら}きたい です。', 'Tương lai tôi muốn làm việc ở Nhật.', 'In the future I want to work in Japan.'] },
  ],
  grammar: [
    {
      id: 'n5-tsumori',
      pattern: 'V (từ điển) / V-ない つもり です',
      meaning: { vi: 'định làm / định không làm ～', en: 'intend to do / not to do ～' },
      explanation: {
        vi: 'Nói ý định đã suy nghĩ của mình: thể từ điển + つもり です; định không làm: thể ない + つもり です. Dùng cho dự định của bản thân; hỏi người khác thì nên lịch sự: ～つもり です か.',
        en: 'States a plan you have thought about: dictionary form + つもり です; to intend not to: ない-form + つもり です. Use it for your own plans; asking others ～つもり です か is fine among equals.',
      },
      examples: [
        ['{来年|らいねん}、{日本|にほん} へ {留学|りゅうがく} する つもり です。', 'Năm sau tôi định du học Nhật.', 'I plan to study in Japan next year.'],
        ['{今年|ことし} は {旅行|りょこう} しない つもり です。', 'Năm nay tôi định không đi du lịch.', 'I don’t intend to travel this year.'],
      ],
      cloze: [
        ['{夏休|なつやす}み に {国|くに} へ {帰|かえ}る つもり です。', 'つもり', 'Kỳ nghỉ hè tôi định về nước.', 'I plan to go back home in the summer holidays.'],
        ['{卒業|そつぎょう} したら、{結婚|けっこん} する つもり です。', 'する', 'Tốt nghiệp xong tôi định kết hôn.', 'I plan to get married after I graduate.'],
      ],
    },
    {
      id: 'n5-mashouka',
      pattern: 'V-ましょう か',
      meaning: { vi: 'để tôi làm ～ nhé? (đề nghị giúp)', en: 'shall I ～? (offering help)' },
      explanation: {
        vi: 'V-ましょう か dùng để đề nghị làm giúp người nghe. Trả lời đồng ý: ええ、お願いします; từ chối lịch sự: いいえ、大丈夫です. Khác với V-ませんか (rủ cùng làm, bài 8).',
        en: 'V-ましょう か offers to do something for the listener. Accept with ええ、お願いします; decline politely with いいえ、大丈夫です. Different from V-ませんか (inviting someone to do something together, lesson 8).',
      },
      examples: [
        ['{荷物|にもつ} を {持|も}ちましょう か。 — ありがとう ございます。 お{願|ねが}いします。', 'Để tôi xách đồ cho nhé? — Cảm ơn, nhờ bạn.', 'Shall I carry your bags? — Thank you, please.'],
        ['{窓|まど} を {閉|し}めましょう か。 — いいえ、{大丈夫|だいじょうぶ} です。', 'Tôi đóng cửa sổ nhé? — Không sao đâu.', 'Shall I close the window? — No, it’s fine.'],
      ],
      cloze: [
        ['タクシー を {呼|よ}びましょう か。', 'ましょう', 'Tôi gọi taxi nhé?', 'Shall I call a taxi?'],
        ['{写真|しゃしん} を {撮|と}りましょう か。', 'か', 'Tôi chụp ảnh giúp nhé?', 'Shall I take a photo for you?'],
      ],
    },
  ],
  dialogue: [
    ['{先生|せんせい}', 'ミン さん、{卒業|そつぎょう} した {後|あと} で、{何|なに} を する つもり です か。', 'Minh, tốt nghiệp xong em định làm gì?', 'Minh, what do you plan to do after you graduate?'],
    ['ミン', '{日本|にほん} の {会社|かいしゃ} で {働|はたら}く つもり です。 {将来|しょうらい} は {国|くに} で {会社|かいしゃ} を {作|つく}りたい です。', 'Em định làm ở công ty Nhật. Tương lai em muốn mở công ty ở nước mình.', 'I plan to work at a Japanese company. In the future I want to start a company back home.'],
    ['{先生|せんせい}', 'いい です ね。 {履歴書|りれきしょ}、{見|み}ましょう か。', 'Hay đấy. Để cô xem giúp sơ yếu lý lịch nhé?', 'Great. Shall I look over your CV?'],
    ['ミン', 'ありがとう ございます。 お{願|ねが}いします。', 'Em cảm ơn cô. Nhờ cô ạ.', 'Thank you very much. Yes, please.'],
  ],
} satisfies LessonSource;

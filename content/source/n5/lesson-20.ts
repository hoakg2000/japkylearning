import type { LessonSource } from '../types';

export default {
  id: 'n5-20',
  order: 20,
  title: { vi: 'Ôn tập: lý do và thời điểm', en: 'Review: reasons and time' },
  goals: [
    { vi: 'Nói lý do với ～から', en: 'Give reasons with ～から' },
    { vi: 'Nói về các mùa, kỳ nghỉ và thời điểm với ～とき', en: 'Talk about seasons, holidays and points in time with ～とき' },
  ],
  kanji: ['間'],
  words: [
    { surface: '時間', reading: 'じかん', vi: 'thời gian; tiếng (đồng hồ)', example: ['{今日|きょう} は {時間|じかん} が ありません。', 'Hôm nay tôi không có thời gian.', 'I have no time today.'] },
    { surface: '時', reading: 'とき', vi: 'khi, lúc', example: ['{子供|こども} の {時|とき}、{犬|いぬ} が いました。', 'Hồi nhỏ tôi có nuôi chó.', 'I had a dog when I was a child.'] },
    { surface: 'どうして', reading: 'どうして', vi: 'tại sao', example: ['どうして {日本語|にほんご} を {勉強|べんきょう} します か。', 'Tại sao bạn học tiếng Nhật?', 'Why do you study Japanese?'] },
    { surface: '疲れる', reading: 'つかれる', vi: 'mệt', example: ['{今日|きょう} は とても {疲|つか}れました。', 'Hôm nay tôi mệt quá.', 'I am very tired today.'] },
    { surface: '眠い', reading: 'ねむい', vi: 'buồn ngủ', example: ['{昨日|きのう} {遅|おそ}く {寝|ね}ました。 {今|いま} とても {眠|ねむ}い です。', 'Hôm qua tôi ngủ muộn. Bây giờ buồn ngủ quá.', 'I went to bed late yesterday. I’m very sleepy now.'] },
    { surface: '春', reading: 'はる', vi: 'mùa xuân', example: ['{春|はる} は {暖|あたた}かい です。', 'Mùa xuân ấm áp.', 'Spring is warm.'] },
    { surface: '夏', reading: 'なつ', vi: 'mùa hè', example: ['{日本|にほん} の {夏|なつ} は {暑|あつ}い です。', 'Mùa hè ở Nhật nóng.', 'Summer in Japan is hot.'] },
    { surface: '秋', reading: 'あき', vi: 'mùa thu', example: ['{秋|あき} は {果物|くだもの} が {美味|おい}しい です。', 'Mùa thu hoa quả ngon.', 'Fruit is delicious in autumn.'] },
    { surface: '冬', reading: 'ふゆ', vi: 'mùa đông', example: ['{北海道|ほっかいどう} の {冬|ふゆ} は とても {寒|さむ}い です。', 'Mùa đông ở Hokkaido rất lạnh.', 'Winter in Hokkaido is very cold.'] },
    { surface: '夏休み', reading: 'なつやすみ', vi: 'kỳ nghỉ hè', example: ['{夏休|なつやす}み に {国|くに} へ {帰|かえ}ります。', 'Kỳ nghỉ hè tôi sẽ về nước.', 'I am going back to my country for the summer holidays.'] },
    { surface: '旅行', reading: 'りょこう', vi: 'du lịch, chuyến đi', example: ['{来月|らいげつ} {家族|かぞく} と {旅行|りょこう} します。', 'Tháng sau tôi đi du lịch với gia đình.', 'I am going on a trip with my family next month.'] },
    { surface: '海', reading: 'うみ', vi: 'biển', example: ['{週末|しゅうまつ} に {海|うみ} へ {行|い}きました。', 'Cuối tuần tôi đã đi biển.', 'I went to the beach at the weekend.'] },
    { surface: '泳ぐ', reading: 'およぐ', vi: 'bơi', example: ['{弟|おとうと} は {泳|およ}ぐ こと が できます。', 'Em trai tôi biết bơi.', 'My younger brother can swim.'] },
    { surface: '若い', reading: 'わかい', vi: 'trẻ', example: ['{先生|せんせい} は まだ {若|わか}い です。', 'Thầy giáo còn trẻ.', 'The teacher is still young.'] },
    { surface: '楽しい', reading: 'たのしい', vi: 'vui', example: ['{旅行|りょこう} は {楽|たの}しかった です。', 'Chuyến du lịch đã rất vui.', 'The trip was fun.'] },
    { surface: '遊ぶ', reading: 'あそぶ', vi: 'chơi', example: ['{日曜日|にちようび} に {友達|ともだち} と {遊|あそ}びます。', 'Chủ nhật tôi đi chơi với bạn.', 'I hang out with friends on Sunday.'] },
  ],
  grammar: [
    {
      id: 'n5-kara-reason',
      pattern: '(câu) から、(câu)',
      meaning: { vi: 'vì ～ nên ～', en: 'because ～, ～' },
      explanation: {
        vi: 'から đứng sau vế chỉ lý do: 時間がありませんから、タクシーで行きます. Có thể dùng thể lịch sự (～ますから, ～ですから) hoặc thể thường. Trả lời câu hỏi どうして bằng ～からです: どうして休みましたか — 風邪をひきましたから. Đừng nhầm với から chỉ điểm bắt đầu (từ…).',
        en: 'から comes after the clause giving the reason: 時間がありませんから、タクシーで行きます. It works with polite (～ますから, ～ですから) or plain forms. Answer a どうして question with ～からです: どうして休みましたか — 風邪をひきましたから. Do not confuse it with から meaning “from”.',
      },
      examples: [
        ['{雨|あめ} が {降|ふ}って います から、{家|いえ} に います。', 'Vì trời đang mưa nên tôi ở nhà.', 'It is raining, so I am staying home.'],
        ['どうして {昨日|きのう} {休|やす}みました か。 — {頭|あたま} が {痛|いた}かった です から。', 'Tại sao hôm qua bạn nghỉ? — Vì tôi bị đau đầu.', 'Why were you absent yesterday? — Because I had a headache.'],
      ],
      cloze: [
        ['{眠|ねむ}い です から、もう {寝|ね}ます。', 'から', 'Vì buồn ngủ nên tôi đi ngủ đây.', 'I’m sleepy, so I’m going to bed.'],
        ['{明日|あした} は {休|やす}み です から、{海|うみ} へ {行|い}きましょう。', 'です', 'Vì mai là ngày nghỉ nên mình đi biển đi.', 'Tomorrow is a day off, so let’s go to the beach.'],
      ],
    },
    {
      id: 'n5-toki',
      pattern: 'V (từ điển/ない)・A い・A な・N の + とき、～',
      meaning: { vi: 'khi ～, lúc ～', en: 'when ～' },
      explanation: {
        vi: 'とき (時) nối với vế trước để nói thời điểm: động từ thể từ điển hoặc thể ない + とき (寝るとき), tính từ い + とき (若いとき), tính từ な + な + とき (暇なとき), danh từ + の + とき (子供のとき). Vế sau là sự việc xảy ra vào lúc đó.',
        en: 'とき (時) attaches to the clause before it to say “when”: dictionary or ない-form verb + とき (寝るとき), い-adjective + とき (若いとき), な-adjective + な + とき (暇なとき), noun + の + とき (子供のとき). The second clause says what happens at that time.',
      },
      examples: [
        ['{暇|ひま} な {時|とき}、{本|ほん} を {読|よ}みます。', 'Khi rảnh tôi đọc sách.', 'When I am free, I read books.'],
        ['{道|みち} を {渡|わた}る {時|とき}、{車|くるま} に {気|き} を つけて ください。', 'Khi qua đường hãy chú ý xe cộ.', 'Watch out for cars when you cross the road.'],
      ],
      cloze: [
        ['{若|わか}い {時|とき}、よく {旅行|りょこう} しました。', '時', 'Hồi trẻ tôi hay đi du lịch.', 'When I was young, I often travelled.'],
        ['{夏休|なつやす}み の {時|とき}、{海|うみ} で {泳|およ}ぎました。', 'の', 'Hồi nghỉ hè tôi đã bơi ở biển.', 'During the summer holidays I swam in the sea.'],
      ],
    },
  ],
  dialogue: [
    ['ユン', '{夏休|なつやす}み、どこ か へ {行|い}きました か。', 'Kỳ nghỉ hè bạn có đi đâu không?', 'Did you go anywhere during the summer holidays?'],
    ['ハイ', 'ええ、{家族|かぞく} と {海|うみ} へ {行|い}きました。 とても {楽|たの}しかった です。', 'Có, mình đã đi biển với gia đình. Vui lắm.', 'Yes, I went to the beach with my family. It was a lot of fun.'],
    ['ユン', 'いい です ね。 {私|わたし} は {時間|じかん} が ありません でした から、どこ も {行|い}きません でした。', 'Thích thật. Mình không có thời gian nên chẳng đi đâu cả.', 'Lucky you. I didn’t have time, so I didn’t go anywhere.'],
    ['ハイ', 'じゃ、{冬休|ふゆやす}み の {時|とき}、{一緒|いっしょ} に {旅行|りょこう} しません か。', 'Vậy kỳ nghỉ đông mình cùng đi du lịch nhé?', 'Then why don’t we take a trip together during the winter holidays?'],
  ],
} satisfies LessonSource;

import type { LessonSource } from '../types';

export default {
  id: 'n5-22',
  order: 22,
  title: { vi: 'Nói chuyện thân mật', en: 'Casual talk with friends' },
  goals: [
    { vi: 'Dùng thể thông thường (thể từ điển, thể ない) khi nói với bạn bè', en: 'Use plain forms (dictionary and ない forms) with friends' },
    { vi: 'Nói về thói quen, sở thích: いつも, 時々, 好き, 嫌い', en: 'Talk about habits and likes: いつも, 時々, 好き, 嫌い' },
  ],
  kanji: [],
  words: [
    { surface: '今日', reading: 'きょう', vi: 'hôm nay', example: ['{今日|きょう} は {暑|あつ}い ね。', 'Hôm nay nóng nhỉ.', 'It’s hot today, isn’t it?'] },
    { surface: '今朝', reading: 'けさ', vi: 'sáng nay', example: ['{今朝|けさ} {何|なに} を {食|た}べた？', 'Sáng nay cậu ăn gì?', 'What did you eat this morning?'] },
    { surface: '今晩', reading: 'こんばん', vi: 'tối nay', example: ['{今晩|こんばん} {暇|ひま}？', 'Tối nay rảnh không?', 'Are you free tonight?'] },
    { surface: '夕方', reading: 'ゆうがた', vi: 'chiều tối, chập tối', example: ['{夕方|ゆうがた} {公園|こうえん} を {散歩|さんぽ} する。', 'Chiều tối tớ đi dạo công viên.', 'I take a walk in the park in the early evening.'] },
    { surface: '毎朝', reading: 'まいあさ', vi: 'mỗi sáng', example: ['{毎朝|まいあさ} コーヒー を {飲|の}む。', 'Sáng nào tớ cũng uống cà phê.', 'I drink coffee every morning.'] },
    { surface: '毎晩', reading: 'まいばん', vi: 'mỗi tối', example: ['{毎晩|まいばん} {日本語|にほんご} を {勉強|べんきょう} する。', 'Tối nào tớ cũng học tiếng Nhật.', 'I study Japanese every night.'] },
    { surface: 'いつも', reading: 'いつも', vi: 'luôn luôn, lúc nào cũng', example: ['{兄|あに} は いつも {忙|いそが}しい。', 'Anh tớ lúc nào cũng bận.', 'My brother is always busy.'] },
    { surface: '時々', reading: 'ときどき', vi: 'thỉnh thoảng', example: ['{時々|ときどき} {映画|えいが} を {見|み}る。', 'Thỉnh thoảng tớ xem phim.', 'I sometimes watch films.'] },
    { surface: 'よく', reading: 'よく', vi: 'thường, hay', example: ['{週末|しゅうまつ} は よく {友達|ともだち} と {遊|あそ}ぶ。', 'Cuối tuần tớ hay đi chơi với bạn.', 'I often hang out with friends at the weekend.'] },
    { surface: 'たいてい', reading: 'たいてい', vi: 'thường thì, hầu như', example: ['{朝|あさ}ご{飯|はん} は たいてい パン だ。', 'Bữa sáng thường là bánh mì.', 'Breakfast is usually bread.'] },
    { surface: '好き', reading: 'すき', vi: 'thích', example: ['{日本|にほん} の {料理|りょうり} が {好|す}き。', 'Tớ thích đồ ăn Nhật.', 'I like Japanese food.'] },
    { surface: '大好き', reading: 'だいすき', vi: 'rất thích', example: ['{猫|ねこ} が {大好|だいす}き だ よ。', 'Tớ rất thích mèo.', 'I love cats.'] },
    { surface: '嫌い', reading: 'きらい', vi: 'ghét, không thích', example: ['{辛|から}い {物|もの} は {嫌|きら}い。', 'Tớ không thích đồ cay.', 'I don’t like spicy food.'] },
    { surface: '本当', reading: 'ほんとう', vi: 'thật, sự thật', example: ['{本当|ほんとう}？ すごい ね。', 'Thật á? Giỏi thế.', 'Really? That’s great.'] },
    { surface: 'うん', reading: 'うん', vi: 'ừ (thân mật)', en: 'yeah; uh-huh (casual yes)', example: ['うん、{行|い}く よ。', 'Ừ, tớ đi.', 'Yeah, I’ll go.'] },
  ],
  grammar: [
    {
      id: 'n5-plain-verb',
      pattern: 'V (thể từ điển) / V-ない (thể thông thường)',
      meaning: { vi: 'thể thông thường của động từ: làm / không làm', en: 'plain verb forms: do / don’t' },
      explanation: {
        vi: 'Với bạn bè, gia đình, người nhỏ tuổi hơn, ta dùng thể thông thường thay cho ～ます. Khẳng định là thể từ điển (食べる, 行く), phủ định là thể ない (食べない, 行かない). Nhóm 1 đổi âm cuối sang hàng あ + ない (行く → 行かない; riêng う → わ: 買う → 買わない), nhóm 2 bỏ る + ない, する → しない, 来る → 来ない (こない). ある → ない. Câu hỏi thân mật chỉ cần lên giọng: 行く？',
        en: 'With friends, family and younger people, use plain forms instead of ～ます. Positive is the dictionary form (食べる, 行く); negative is the ない-form (食べない, 行かない). Group 1 verbs change the last sound to the あ-row + ない (行く → 行かない; う becomes わ: 買う → 買わない), group 2 drop る + ない, する → しない, 来る → 来ない (こない). ある → ない. A casual question just uses rising intonation: 行く？',
      },
      examples: [
        ['{明日|あした}、{学校|がっこう} へ {行|い}く？ — ううん、{行|い}かない。', 'Mai cậu có đến trường không? — Không, tớ không đi.', 'Are you going to school tomorrow? — No, I’m not.'],
        ['{私|わたし} は {肉|にく} を {食|た}べない。', 'Tớ không ăn thịt.', 'I don’t eat meat.'],
      ],
      cloze: [
        ['{毎朝|まいあさ} コーヒー を {飲|の}む。', '飲む', 'Sáng nào tớ cũng uống cà phê.', 'I drink coffee every morning.'],
        ['{今日|きょう} は テレビ を {見|み}ない。', '見ない', 'Hôm nay tớ không xem TV.', 'I’m not watching TV today.'],
      ],
    },
    {
      id: 'n5-plain-adj-noun',
      pattern: 'A い / A な だ / N だ (thể thông thường)',
      meaning: { vi: 'tính từ và danh từ ở thể thông thường', en: 'plain forms of adjectives and nouns' },
      explanation: {
        vi: 'Trong câu thân mật bỏ です. Tính từ い đứng một mình (暑い), phủ định ～くない. Tính từ な và danh từ dùng だ (静かだ, 学生だ), phủ định じゃない. Khi nói chuyện, だ thường được lược bỏ hoặc thay bằng よ/ね: 好き！ 学生だよ.',
        en: 'Casual sentences drop です. An い-adjective stands alone (暑い), negative ～くない. な-adjectives and nouns take だ (静かだ, 学生だ), negative じゃない. In speech だ is often dropped or followed by よ/ね: 好き！ 学生だよ.',
      },
      examples: [
        ['この ケーキ、{美味|おい}しい ね。', 'Bánh này ngon nhỉ.', 'This cake is tasty, isn’t it?'],
        ['{今日|きょう} は {日曜日|にちようび} だ から、{学校|がっこう} は {休|やす}み だ よ。', 'Hôm nay là chủ nhật nên trường nghỉ đấy.', 'It’s Sunday today, so there’s no school.'],
      ],
      cloze: [
        ['この {部屋|へや} は {静|しず}か だ。', 'だ', 'Căn phòng này yên tĩnh.', 'This room is quiet.'],
        ['{今日|きょう} は {寒|さむ}くない。', '寒くない', 'Hôm nay không lạnh.', 'It’s not cold today.'],
      ],
    },
  ],
  dialogue: [
    ['ハイ', '{今晩|こんばん}、{暇|ひま}？ {一緒|いっしょ} に ご{飯|はん} {食|た}べない？', 'Tối nay rảnh không? Đi ăn cùng không?', 'Free tonight? Want to have dinner together?'],
    ['ユン', 'うん、いい よ。 {何|なに} {食|た}べる？', 'Ừ, được. Ăn gì đây?', 'Sure. What shall we eat?'],
    ['ハイ', 'ラーメン は？ {駅|えき} の {近|ちか}く の {店|みせ}、{本当|ほんとう} に {美味|おい}しい よ。', 'Ramen thì sao? Quán gần ga ngon lắm đấy.', 'How about ramen? The place near the station is really good.'],
    ['ユン', 'いい ね。 {私|わたし}、ラーメン {大好|だいす}き。', 'Được đấy. Tớ mê ramen.', 'Great. I love ramen.'],
  ],
} satisfies LessonSource;

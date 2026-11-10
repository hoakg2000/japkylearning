import type { LessonSource } from '../types';

export default {
  id: 'n5-25',
  order: 25,
  title: { vi: 'Thời tiết ngày mai', en: 'Tomorrow’s weather' },
  goals: [
    { vi: 'Phỏng đoán bằng ～でしょう (dự báo thời tiết)', en: 'Make guesses with ～でしょう (weather forecasts)' },
    { vi: 'Nói “đã … rồi” và “vẫn chưa …” bằng もう / まだ', en: 'Say “already” and “not yet” with もう / まだ' },
  ],
  kanji: [],
  words: [
    { surface: '晴れ', reading: 'はれ', vi: 'trời nắng, trời quang', example: ['{明日|あした} は {晴|は}れ でしょう。', 'Mai có lẽ trời nắng.', 'It will probably be sunny tomorrow.'] },
    { surface: '晴れる', reading: 'はれる', vi: 'nắng lên, trời quang', example: ['{午後|ごご} は {晴|は}れる でしょう。', 'Buổi chiều có lẽ trời sẽ quang.', 'It will probably clear up in the afternoon.'] },
    { surface: '曇り', reading: 'くもり', vi: 'trời nhiều mây', example: ['{今日|きょう} は {一日中|いちにちじゅう} {曇|くも}り です。', 'Hôm nay trời nhiều mây cả ngày.', 'It is cloudy all day today.'] },
    { surface: '雪', reading: 'ゆき', vi: 'tuyết', example: ['{北海道|ほっかいどう} は {雪|ゆき} が {多|おお}い です。', 'Hokkaido nhiều tuyết.', 'Hokkaido gets a lot of snow.'] },
    { surface: '風', reading: 'かぜ', vi: 'gió', example: ['{今日|きょう} は {風|かぜ} が {強|つよ}い です。', 'Hôm nay gió mạnh.', 'The wind is strong today.'] },
    { surface: '吹く', reading: 'ふく', vi: 'thổi (gió)', example: ['{冷|つめ}たい {風|かぜ} が {吹|ふ}いて います。', 'Gió lạnh đang thổi.', 'A cold wind is blowing.'] },
    { surface: '涼しい', reading: 'すずしい', vi: 'mát mẻ', example: ['{秋|あき} は {涼|すず}しい です。', 'Mùa thu mát mẻ.', 'Autumn is cool.'] },
    { surface: '暖かい', reading: 'あたたかい', vi: 'ấm áp', example: ['{春|はる} は {暖|あたた}かい です。', 'Mùa xuân ấm áp.', 'Spring is warm.'] },
    { surface: '天気予報', reading: 'てんきよほう', vi: 'dự báo thời tiết', example: ['{天気予報|てんきよほう} を {見|み}ました か。', 'Bạn đã xem dự báo thời tiết chưa?', 'Did you see the weather forecast?'] },
    { surface: '明るい', reading: 'あかるい', vi: 'sáng sủa', example: ['この {部屋|へや} は {明|あか}るい です。', 'Phòng này sáng sủa.', 'This room is bright.'] },
    { surface: '暗い', reading: 'くらい', vi: 'tối', example: ['{外|そと} は もう {暗|くら}い です。', 'Bên ngoài trời đã tối rồi.', 'It is already dark outside.'] },
    { surface: 'もう', reading: 'もう', vi: 'đã … rồi', example: ['もう {昼|ひる}ご{飯|はん} を {食|た}べました。', 'Tôi ăn trưa rồi.', 'I have already had lunch.'] },
    { surface: 'まだ', reading: 'まだ', vi: 'vẫn còn; vẫn chưa', example: ['まだ {雨|あめ} が {降|ふ}って います。', 'Trời vẫn còn mưa.', 'It is still raining.'] },
    { surface: '午前中', reading: 'ごぜんちゅう', vi: 'trong buổi sáng', example: ['{午前中|ごぜんちゅう} は {雨|あめ} でしょう。', 'Buổi sáng có lẽ mưa.', 'It will probably rain in the morning.'] },
  ],
  grammar: [
    {
      id: 'n5-deshou',
      pattern: '(thể thông thường) でしょう',
      meaning: { vi: 'có lẽ ～, chắc là ～', en: 'probably ～' },
      explanation: {
        vi: 'でしょう đặt sau thể thông thường để phỏng đoán, hay gặp trong dự báo thời tiết. Với tính từ な và danh từ bỏ だ: 晴れ でしょう, 静か でしょう. Lên giọng でしょう？ thì thành câu hỏi xác nhận “đúng không?”.',
        en: 'でしょう after a plain-form clause makes a guess and is typical of weather forecasts. With な-adjectives and nouns drop だ: 晴れ でしょう, 静か でしょう. Said with rising intonation, でしょう？ asks for agreement (“right?”).',
      },
      examples: [
        ['{明日|あした} は {雪|ゆき} が {降|ふ}る でしょう。', 'Mai có lẽ tuyết rơi.', 'It will probably snow tomorrow.'],
        ['{山|やま} の {上|うえ} は {寒|さむ}い でしょう。', 'Trên núi chắc là lạnh.', 'It’s probably cold at the top of the mountain.'],
      ],
      cloze: [
        ['{午後|ごご} は {晴|は}れる でしょう。', 'でしょう', 'Buổi chiều có lẽ trời quang.', 'It will probably clear up in the afternoon.'],
        ['{明日|あした} は {曇|くも}り でしょう。', '曇り', 'Mai có lẽ trời nhiều mây.', 'It will probably be cloudy tomorrow.'],
      ],
    },
    {
      id: 'n5-mou-mada',
      pattern: 'もう V-ました / まだ V-て いません',
      meaning: { vi: 'đã V rồi / vẫn chưa V', en: 'have already V-ed / have not V-ed yet' },
      explanation: {
        vi: 'もう + V-ました: việc đã xong. Trả lời phủ định dùng まだ + V-て いません (vẫn chưa), không dùng ～ませんでした. まだ + khẳng định nghĩa là “vẫn còn”: まだ 雨が 降って います.',
        en: 'もう + V-ました: the action is done. The negative answer is まだ + V-て いません (not yet), not ～ませんでした. まだ with a positive verb means “still”: まだ 雨が 降って います.',
      },
      examples: [
        ['もう {宿題|しゅくだい} を しました か。 — いいえ、まだ して いません。', 'Bạn làm bài tập chưa? — Chưa, mình vẫn chưa làm.', 'Have you done your homework yet? — No, not yet.'],
        ['{雨|あめ} は もう {止|や}みました。', 'Mưa đã tạnh rồi.', 'The rain has already stopped.'],
      ],
      cloze: [
        ['{天気予報|てんきよほう} は まだ {見|み}て いません。', 'まだ', 'Tôi vẫn chưa xem dự báo thời tiết.', 'I haven’t seen the weather forecast yet.'],
        ['もう {晩|ばん}ご{飯|はん} を {食|た}べました。', 'もう', 'Tôi đã ăn tối rồi.', 'I have already eaten dinner.'],
      ],
    },
  ],
  dialogue: [
    ['ユン', '{明日|あした} の {天気予報|てんきよほう}、もう {見|み}ました か。', 'Bạn đã xem dự báo thời tiết ngày mai chưa?', 'Have you seen tomorrow’s forecast yet?'],
    ['ハイ', 'ええ。 {午前中|ごぜんちゅう} は {雨|あめ} です が、{午後|ごご} は {晴|は}れる でしょう。', 'Rồi. Buổi sáng mưa nhưng chiều chắc là nắng.', 'Yes. It’ll rain in the morning, but it should clear up in the afternoon.'],
    ['ユン', 'じゃ、{午後|ごご} {公園|こうえん} へ {行|い}きません か。', 'Vậy chiều mình đi công viên không?', 'Then shall we go to the park in the afternoon?'],
    ['ハイ', 'いい です ね。 でも {風|かぜ} が {強|つよ}い でしょう から、{暖|あたた}かい {服|ふく} を {着|き}て ください。', 'Được đấy. Nhưng chắc gió mạnh nên mặc áo ấm nhé.', 'Sounds good. But it’ll probably be windy, so wear warm clothes.'],
  ],
} satisfies LessonSource;

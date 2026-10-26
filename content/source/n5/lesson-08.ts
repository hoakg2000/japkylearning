import type { LessonSource } from '../types';

export default {
  id: 'n5-08',
  order: 8,
  title: { vi: 'Rủ bạn đi chơi', en: 'Making plans' },
  goals: [
    { vi: 'Nói làm việc gì ở đâu với で', en: 'Say where you do something with で' },
    { vi: 'Rủ rê, đề nghị: 〜ませんか / 〜ましょう', en: 'Invite and suggest: 〜ませんか / 〜ましょう' },
  ],
  kanji: ['話', '休'],
  words: [
    { surface: '昼ご飯', reading: 'ひるごはん', vi: 'bữa trưa', example: ['{食堂|しょくどう} で {昼|ひる}ご{飯|はん} を {食|た}べます。', 'Tôi ăn trưa ở nhà ăn.', 'I eat lunch in the cafeteria.'] },
    { surface: '晩ご飯', reading: 'ばんごはん', vi: 'bữa tối', example: ['{家|いえ} で {晩|ばん}ご{飯|はん} を {食|た}べます。', 'Tôi ăn tối ở nhà.', 'I eat dinner at home.'] },
    { surface: '一緒に', reading: 'いっしょに', vi: 'cùng nhau', example: ['{一緒|いっしょ}に {行|い}きませんか。', 'Đi cùng nhau không?', 'Shall we go together?'] },
    { surface: '映画', reading: 'えいが', vi: 'phim', example: ['{週末|しゅうまつ} {映画|えいが} を {見|み}ませんか。', 'Cuối tuần đi xem phim không?', 'Would you like to see a film at the weekend?'] },
    { surface: '公園', reading: 'こうえん', vi: 'công viên', example: ['{公園|こうえん} で {散歩|さんぽ} します。', 'Tôi đi dạo ở công viên.', 'I take a walk in the park.'] },
    { surface: '図書館', reading: 'としょかん', vi: 'thư viện', example: ['{図書館|としょかん} で {勉強|べんきょう} しましょう。', 'Chúng ta học ở thư viện nhé.', 'Let’s study at the library.'] },
    { surface: '写真', reading: 'しゃしん', vi: 'ảnh', example: ['ここ で {写真|しゃしん} を {撮|と}りましょう。', 'Chụp ảnh ở đây đi.', 'Let’s take a photo here.'] },
    { surface: '撮る', reading: 'とる', vi: 'chụp (ảnh)', example: ['{花|はな} の {写真|しゃしん} を {撮|と}りました。', 'Tôi đã chụp ảnh hoa.', 'I took a photo of the flowers.'] },
    { surface: '会う', reading: 'あう', vi: 'gặp', example: ['{駅|えき} で {友達|ともだち} に {会|あ}います。', 'Tôi gặp bạn ở ga.', 'I meet a friend at the station.'] },
    { surface: '話す', reading: 'はなす', vi: 'nói chuyện', example: ['{日本語|にほんご} で {話|はな}しましょう。', 'Hãy nói chuyện bằng tiếng Nhật nào.', 'Let’s talk in Japanese.'] },
    { surface: '休む', reading: 'やすむ', vi: 'nghỉ ngơi', example: ['ちょっと {休|やす}みましょう。', 'Nghỉ một chút nhé.', 'Let’s take a short break.'] },
    { surface: '喫茶店', reading: 'きっさてん', vi: 'quán cà phê', example: ['{喫茶店|きっさてん} で コーヒー を {飲|の}みませんか。', 'Uống cà phê ở quán không?', 'Would you like coffee at a café?'] },
    { surface: 'コーヒー', reading: 'コーヒー', vi: 'cà phê', example: ['コーヒー を {飲|の}みましょう。', 'Uống cà phê nhé.', 'Let’s have coffee.'] },
    { surface: '散歩', reading: 'さんぽ', vi: 'đi dạo', example: ['{毎朝|まいあさ} {散歩|さんぽ} します。', 'Sáng nào tôi cũng đi dạo.', 'I go for a walk every morning.'] },
    { surface: '週末', reading: 'しゅうまつ', vi: 'cuối tuần', example: ['{週末|しゅうまつ} は {何|なに} を しますか。', 'Cuối tuần bạn làm gì?', 'What do you do at the weekend?'] },
    { surface: 'ええ', reading: 'ええ', vi: 'ừ, vâng (thân mật)', example: ['ええ、いいですね。', 'Ừ, hay đấy.', 'Yes, that sounds good.'] },
  ],
  grammar: [
    {
      id: 'n5-de-place',
      pattern: 'Nơi chốn で V',
      meaning: { vi: 'làm V ở nơi chốn', en: 'do V at a place' },
      explanation: {
        vi: 'で chỉ nơi diễn ra hành động (ăn ở đâu, học ở đâu). Khác với に chỉ nơi tồn tại (có ở đâu).',
        en: 'で marks where an action happens (eat at, study at). Compare に, which marks where something exists.',
      },
      examples: [
        ['{図書館|としょかん} で {本|ほん} を {読|よ}みます。', 'Tôi đọc sách ở thư viện.', 'I read books at the library.'],
        ['{会社|かいしゃ} で {昼|ひる}ご{飯|はん} を {食|た}べます。', 'Tôi ăn trưa ở công ty.', 'I eat lunch at the office.'],
      ],
      cloze: [
        ['{公園|こうえん} で {写真|しゃしん} を {撮|と}ります。', 'で', 'Tôi chụp ảnh ở công viên.', 'I take photos in the park.'],
        ['{喫茶店|きっさてん} で {話|はな}します。', 'で', 'Chúng tôi nói chuyện ở quán cà phê.', 'We talk at a café.'],
      ],
    },
    {
      id: 'n5-masenka-mashou',
      pattern: 'V-ませんか / V-ましょう',
      meaning: { vi: '… không? (rủ) / … nhé! (đề nghị cùng làm)', en: 'won’t you …? / let’s …' },
      explanation: {
        vi: 'V-ませんか là lời mời lịch sự, tôn trọng ý người nghe. V-ましょう là đề nghị cùng làm, cũng dùng để nhận lời mời: ええ、行きましょう.',
        en: 'V-ませんか is a polite invitation that leaves the choice to the listener. V-ましょう suggests doing something together and also accepts an invitation: ええ、行きましょう.',
      },
      examples: [
        ['{一緒|いっしょ}に {昼|ひる}ご{飯|はん} を {食|た}べませんか。', 'Ăn trưa cùng nhau không?', 'Would you like to have lunch together?'],
        ['ええ、{食|た}べましょう。', 'Ừ, ăn nhé.', 'Sure, let’s eat.'],
      ],
      cloze: [
        ['{映画|えいが} を {見|み}ませんか。', 'ませんか', 'Đi xem phim không?', 'Would you like to see a film?'],
        ['ちょっと {休|やす}みましょう。', 'ましょう', 'Nghỉ một chút nhé.', 'Let’s take a short break.'],
      ],
    },
  ],
  dialogue: [
    ['ミン', 'ラン さん、{週末|しゅうまつ} {一緒|いっしょ}に {映画|えいが} を {見|み}ませんか。', 'Lan ơi, cuối tuần đi xem phim cùng nhau không?', 'Lan, would you like to see a film together at the weekend?'],
    ['ラン', 'いいですね。 どこ で {見|み}ますか。', 'Hay đấy. Xem ở đâu vậy?', 'Sounds good. Where shall we watch it?'],
    ['ミン', '{駅|えき} の {前|まえ} の {映画館|えいがかん} で {見|み}ましょう。', 'Xem ở rạp chiếu phim trước nhà ga nhé.', 'Let’s watch it at the cinema in front of the station.'],
    ['ラン', 'ええ。 じゃ、{土曜日|どようび} に {会|あ}いましょう。', 'Ừ. Vậy gặp nhau vào thứ bảy nhé.', 'OK. Let’s meet on Saturday then.'],
  ],
} satisfies LessonSource;

import type { LessonSource } from '../types';

export default {
  id: 'n5-16',
  order: 16,
  title: { vi: 'Đồ ăn, thức uống và mong muốn', en: 'Food, drinks and wishes' },
  goals: [
    { vi: 'Gọi tên các món ăn, đồ uống thường ngày', en: 'Name everyday food and drinks' },
    { vi: 'Nói điều mình muốn làm và muốn có với ～たい, ～がほしい', en: 'Say what you want to do and want to have with ～たい and ～がほしい' },
  ],
  kanji: ['魚'],
  words: [
    { surface: '魚', reading: 'さかな', vi: 'cá', example: ['{私|わたし} は {魚|さかな} が {好|す}き です。', 'Tôi thích cá.', 'I like fish.'] },
    { surface: '肉', reading: 'にく', vi: 'thịt', example: ['スーパー で {肉|にく} を {買|か}いました。', 'Tôi đã mua thịt ở siêu thị.', 'I bought meat at the supermarket.'] },
    { surface: '野菜', reading: 'やさい', vi: 'rau', example: ['{毎日|まいにち} {野菜|やさい} を {食|た}べます。', 'Ngày nào tôi cũng ăn rau.', 'I eat vegetables every day.'] },
    { surface: '果物', reading: 'くだもの', vi: 'hoa quả, trái cây', example: ['ベトナム の {果物|くだもの} は {美味|おい}しい です。', 'Hoa quả Việt Nam ngon.', 'Vietnamese fruit is delicious.'] },
    { surface: '卵', reading: 'たまご', vi: 'trứng', example: ['{朝|あさ}ご{飯|はん} に {卵|たまご} を {食|た}べました。', 'Bữa sáng tôi đã ăn trứng.', 'I had eggs for breakfast.'] },
    { surface: '牛乳', reading: 'ぎゅうにゅう', vi: 'sữa bò', example: ['{冷蔵庫|れいぞうこ} に {牛乳|ぎゅうにゅう} が あります。', 'Trong tủ lạnh có sữa.', 'There is milk in the fridge.'] },
    { surface: 'お茶', reading: 'おちゃ', vi: 'trà', example: ['お{茶|ちゃ} を {一杯|いっぱい} どうぞ。', 'Mời anh một chén trà.', 'Please have a cup of tea.'] },
    { surface: 'パン', reading: 'パン', vi: 'bánh mì', example: ['{朝|あさ} は いつも パン です。', 'Buổi sáng tôi luôn ăn bánh mì.', 'I always have bread in the morning.'] },
    { surface: 'ご飯', reading: 'ごはん', vi: 'cơm; bữa ăn', example: ['ご{飯|はん} を {食|た}べましょう。', 'Mình ăn cơm thôi.', 'Let’s eat.'] },
    { surface: 'お菓子', reading: 'おかし', vi: 'bánh kẹo', example: ['{子供|こども} は お{菓子|かし} が {好|す}き です。', 'Trẻ con thích bánh kẹo.', 'Children like sweets.'] },
    { surface: '料理', reading: 'りょうり', vi: 'món ăn; nấu ăn', hanViet: 'LIỆU LÝ', example: ['{日本|にほん} の {料理|りょうり} は {綺麗|きれい} です。', 'Món ăn Nhật đẹp mắt.', 'Japanese food looks beautiful.'] },
    { surface: '甘い', reading: 'あまい', vi: 'ngọt', example: ['この ケーキ は とても {甘|あま}い です。', 'Cái bánh này rất ngọt.', 'This cake is very sweet.'] },
    { surface: '辛い', reading: 'からい', vi: 'cay', example: ['この スープ は {少|すこ}し {辛|から}い です。', 'Món súp này hơi cay.', 'This soup is a little spicy.'] },
    { surface: '欲しい', reading: 'ほしい', vi: 'muốn có', example: ['{新|あたら}しい {靴|くつ} が {欲|ほ}しい です。', 'Tôi muốn có đôi giày mới.', 'I want new shoes.'] },
    { surface: 'りんご', reading: 'りんご', vi: 'quả táo', example: ['りんご を {三|みっ}つ {買|か}いました。', 'Tôi đã mua ba quả táo.', 'I bought three apples.'] },
    { surface: '弁当', reading: 'べんとう', vi: 'cơm hộp', hanViet: 'BIỆN ĐƯƠNG', example: ['{毎日|まいにち} {会社|かいしゃ} に {弁当|べんとう} を {持|も}って {行|い}きます。', 'Ngày nào tôi cũng mang cơm hộp đến công ty.', 'I take a packed lunch to work every day.'] },
  ],
  grammar: [
    {
      id: 'n5-tai',
      pattern: 'V (bỏ ます) たい です',
      meaning: { vi: 'muốn làm V', en: 'want to do V' },
      explanation: {
        vi: 'Bỏ ます của động từ rồi thêm たいです: 食べます → 食べたいです, 行きます → 行きたいです. ～たい chia như tính từ đuôi い: phủ định ～たくないです, quá khứ ～たかったです. Tân ngữ có thể dùng を hoặc が: 水が飲みたいです. Chỉ dùng cho mong muốn của bản thân (hoặc hỏi người nghe), không dùng để nói thẳng mong muốn của người thứ ba.',
        en: 'Drop ます and add たいです: 食べます → 食べたいです, 行きます → 行きたいです. ～たい conjugates like an い-adjective: negative ～たくないです, past ～たかったです. The object can take を or が: 水が飲みたいです. Use it for your own wishes (or to ask the listener), not to state a third person’s wishes directly.',
      },
      examples: [
        ['{日本|にほん} で {寿司|すし} を {食|た}べたい です。', 'Tôi muốn ăn sushi ở Nhật.', 'I want to eat sushi in Japan.'],
        ['{今日|きょう} は どこ も {行|い}きたくない です。', 'Hôm nay tôi không muốn đi đâu cả.', 'I don’t want to go anywhere today.'],
      ],
      cloze: [
        ['{冷|つめ}たい {水|みず} が {飲|の}みたい です。', '飲みたい', 'Tôi muốn uống nước lạnh.', 'I want to drink cold water.'],
        ['{週末|しゅうまつ} {何|なに} を したい ですか。', 'したい', 'Cuối tuần bạn muốn làm gì?', 'What do you want to do this weekend?'],
      ],
    },
    {
      id: 'n5-ga-hoshii',
      pattern: 'N が ほしい です',
      meaning: { vi: 'muốn có N', en: 'want (to have) N' },
      explanation: {
        vi: 'ほしい là tính từ đuôi い nghĩa là “muốn có”. Vật muốn có đi với が: カメラがほしいです. Phủ định: ほしくないです. Phân biệt: ほしい dùng với danh từ (muốn có vật), ～たい dùng với động từ (muốn làm).',
        en: 'ほしい is an い-adjective meaning “want (to have)”. The thing you want takes が: カメラがほしいです. Negative: ほしくないです. Compare: ほしい goes with nouns (want a thing), ～たい with verbs (want to do).',
      },
      examples: [
        ['{誕生日|たんじょうび} に {何|なに} が {欲|ほ}しい ですか。', 'Sinh nhật bạn muốn có gì?', 'What do you want for your birthday?'],
        ['{大|おお}きい {冷蔵庫|れいぞうこ} が {欲|ほ}しい です。', 'Tôi muốn có cái tủ lạnh to.', 'I want a big fridge.'],
      ],
      cloze: [
        ['{新|あたら}しい {自転車|じてんしゃ} が {欲|ほ}しい です。', 'が', 'Tôi muốn có xe đạp mới.', 'I want a new bicycle.'],
        ['お{金|かね} は あまり {欲|ほ}しくない です。', '欲しくない', 'Tôi không muốn có nhiều tiền lắm.', 'I don’t really want money.'],
      ],
    },
  ],
  dialogue: [
    ['ナム', 'お{腹|なか} が すきました ね。 {何|なに} を {食|た}べたい ですか。', 'Đói bụng rồi nhỉ. Bạn muốn ăn gì?', 'I’m hungry. What do you want to eat?'],
    ['ユキ', '{魚|さかな} が {食|た}べたい です。 {辛|から}い {料理|りょうり} は ちょっと…。', 'Mình muốn ăn cá. Món cay thì hơi…', 'I want to eat fish. Spicy food is a bit…'],
    ['ナム', 'じゃ、あの {店|みせ} に {入|はい}りましょう。', 'Vậy mình vào quán kia đi.', 'Then let’s go into that restaurant.'],
    ['ユキ', 'いい です ね。 {冷|つめ}たい お{茶|ちゃ} も {飲|の}みたい です。', 'Được đấy. Mình cũng muốn uống trà lạnh.', 'Sounds good. I want some cold tea too.'],
  ],
} satisfies LessonSource;

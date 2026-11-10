import type { LessonSource } from '../types';

export default {
  id: 'n5-21',
  order: 21,
  title: { vi: 'Một ngày của tôi', en: 'My day, step by step' },
  goals: [
    { vi: 'Kể nhiều việc theo thứ tự bằng thể て', en: 'Tell several actions in order with the て-form' },
    { vi: 'Nói “sau khi làm A thì làm B” bằng ～てから', en: 'Say “after doing A, do B” with ～てから' },
  ],
  kanji: [],
  words: [
    { surface: '朝', reading: 'あさ', vi: 'buổi sáng', example: ['{朝|あさ} {六時|ろくじ} に {起|お}きます。', 'Buổi sáng tôi dậy lúc sáu giờ.', 'I get up at six in the morning.'] },
    { surface: '夜', reading: 'よる', vi: 'buổi tối, ban đêm', example: ['{夜|よる} {十一時|じゅういちじ} に {寝|ね}ます。', 'Buổi tối tôi ngủ lúc mười một giờ.', 'I go to bed at eleven at night.'] },
    { surface: 'シャワー', reading: 'シャワー', vi: 'vòi sen, tắm vòi sen', example: ['{朝|あさ} シャワー を {浴|あ}びます。', 'Buổi sáng tôi tắm vòi sen.', 'I take a shower in the morning.'] },
    { surface: '浴びる', reading: 'あびる', vi: 'tắm (vòi sen), dội', example: ['{毎晩|まいばん} シャワー を {浴|あ}びます。', 'Tối nào tôi cũng tắm vòi sen.', 'I take a shower every night.'] },
    { surface: '磨く', reading: 'みがく', vi: 'đánh (răng), đánh bóng', example: ['{寝|ね}る {前|まえ} に {歯|は} を {磨|みが}きます。', 'Tôi đánh răng trước khi ngủ.', 'I brush my teeth before bed.'] },
    { surface: '出かける', reading: 'でかける', vi: 'ra ngoài, đi ra ngoài', example: ['{日曜日|にちようび} は {家族|かぞく} と {出|で}かけます。', 'Chủ nhật tôi ra ngoài với gia đình.', 'On Sundays I go out with my family.'] },
    { surface: '乗る', reading: 'のる', vi: 'lên (xe), đi (tàu, xe)', example: ['{駅|えき} で {電車|でんしゃ} に {乗|の}ります。', 'Tôi lên tàu ở nhà ga.', 'I get on the train at the station.'] },
    { surface: '降りる', reading: 'おりる', vi: 'xuống (xe)', example: ['{次|つぎ} の {駅|えき} で {降|お}ります。', 'Tôi xuống ở ga tiếp theo.', 'I get off at the next station.'] },
    { surface: '着く', reading: 'つく', vi: 'đến nơi', example: ['{九時|くじ} に {会社|かいしゃ} に {着|つ}きます。', 'Tôi đến công ty lúc chín giờ.', 'I arrive at the office at nine.'] },
    { surface: '始まる', reading: 'はじまる', vi: 'bắt đầu', example: ['{授業|じゅぎょう} は {九時|くじ} に {始|はじ}まります。', 'Giờ học bắt đầu lúc chín giờ.', 'Class starts at nine.'] },
    { surface: '終わる', reading: 'おわる', vi: 'kết thúc, xong', example: ['{仕事|しごと} は {六時|ろくじ} に {終|お}わります。', 'Công việc kết thúc lúc sáu giờ.', 'Work ends at six.'] },
    { surface: '授業', reading: 'じゅぎょう', vi: 'giờ học, tiết học', example: ['{午後|ごご} は {授業|じゅぎょう} が ありません。', 'Buổi chiều không có giờ học.', 'There are no classes in the afternoon.'] },
    { surface: '仕事', reading: 'しごと', vi: 'công việc', example: ['{仕事|しごと} は {大変|たいへん} です か。', 'Công việc có vất vả không?', 'Is your work hard?'] },
    { surface: 'それから', reading: 'それから', vi: 'sau đó, rồi thì', example: ['{朝|あさ}ご{飯|はん} を {食|た}べます。 それから、{会社|かいしゃ} へ {行|い}きます。', 'Tôi ăn sáng. Sau đó tôi đến công ty.', 'I eat breakfast. After that, I go to work.'] },
    { surface: '次', reading: 'つぎ', vi: 'tiếp theo, kế tiếp', example: ['{次|つぎ} の バス は {何時|なんじ} です か。', 'Chuyến xe buýt tiếp theo lúc mấy giờ?', 'What time is the next bus?'] },
  ],
  grammar: [
    {
      id: 'n5-te-sequence',
      pattern: 'V1 て、V2 て、V3 ます',
      meaning: { vi: 'làm V1, rồi V2, rồi V3 (liệt kê theo thứ tự)', en: 'do V1, then V2, then V3 (actions in order)' },
      explanation: {
        vi: 'Nối nhiều động từ bằng thể て để kể các việc theo đúng thứ tự xảy ra. Chỉ động từ cuối câu mang thì (ます / ました), nên cả câu là hiện tại hay quá khứ tùy động từ cuối.',
        en: 'Join several verbs with the て-form to list actions in the order they happen. Only the last verb carries the tense (ます / ました), so it sets the tense of the whole sentence.',
      },
      examples: [
        ['{朝|あさ} {起|お}きて、シャワー を {浴|あ}びて、{会社|かいしゃ} へ {行|い}きます。', 'Buổi sáng tôi dậy, tắm, rồi đi làm.', 'In the morning I get up, take a shower and go to work.'],
        ['{昨日|きのう} は {友達|ともだち} に {会|あ}って、{映画|えいが} を {見|み}て、{帰|かえ}りました。', 'Hôm qua tôi gặp bạn, xem phim rồi về.', 'Yesterday I met a friend, watched a film and went home.'],
      ],
      cloze: [
        ['{駅|えき} で {電車|でんしゃ} に {乗|の}って、{東京|とうきょう} で {降|お}ります。', '乗って', 'Tôi lên tàu ở ga rồi xuống ở Tokyo.', 'I get on the train at the station and get off in Tokyo.'],
        ['{家|いえ} に {帰|かえ}って、{晩|ばん}ご{飯|はん} を {食|た}べました。', '帰って', 'Tôi về nhà rồi ăn tối.', 'I went home and ate dinner.'],
      ],
    },
    {
      id: 'n5-te-kara',
      pattern: 'V1 て から、V2',
      meaning: { vi: 'sau khi V1 thì V2', en: 'after V1, V2' },
      explanation: {
        vi: '～てから nhấn mạnh V1 phải xong rồi mới đến V2. Khác với chuỗi て thông thường, ～てから thường chỉ nối hai việc và làm rõ thứ tự trước – sau.',
        en: '～てから stresses that V1 finishes before V2 starts. Unlike a plain て-chain, it usually links just two actions and makes the order explicit.',
      },
      examples: [
        ['{仕事|しごと} が {終|お}わって から、{飲|の}み に {行|い}きましょう。', 'Sau khi xong việc mình đi uống nhé.', 'Let’s go for a drink after work.'],
        ['{手|て} を {洗|あら}って から、ご{飯|はん} を {食|た}べて ください。', 'Hãy rửa tay rồi mới ăn cơm.', 'Please wash your hands before you eat.'],
      ],
      cloze: [
        ['{歯|は} を {磨|みが}いて から、{寝|ね}ます。', 'から', 'Tôi đánh răng xong rồi mới ngủ.', 'I brush my teeth and then go to bed.'],
        ['{授業|じゅぎょう} が {始|はじ}まって から、{先生|せんせい} が {来|き}ました。', '始まって', 'Sau khi giờ học bắt đầu thì thầy mới đến.', 'The teacher came after class had started.'],
      ],
    },
  ],
  dialogue: [
    ['ミン', '{毎朝|まいあさ}、{何時|なんじ} に {会社|かいしゃ} に {着|つ}きます か。', 'Mỗi sáng mấy giờ bạn đến công ty?', 'What time do you get to the office every morning?'],
    ['{田中|たなか}', '{八時半|はちじはん} です。 {七時|しちじ} に {起|お}きて、シャワー を {浴|あ}びて、{電車|でんしゃ} に {乗|の}ります。', 'Tám rưỡi. Tôi dậy lúc bảy giờ, tắm rồi lên tàu.', 'Eight thirty. I get up at seven, take a shower and get on the train.'],
    ['ミン', '{朝|あさ}ご{飯|はん} は？', 'Còn bữa sáng thì sao?', 'What about breakfast?'],
    ['{田中|たなか}', '{会社|かいしゃ} に {着|つ}いて から、コーヒー と パン を {食|た}べます。', 'Đến công ty rồi tôi mới ăn bánh mì với cà phê.', 'I have coffee and bread after I get to the office.'],
  ],
} satisfies LessonSource;

import type { LessonSource } from '../types';

export default {
  id: 'n5-29',
  order: 29,
  title: { vi: 'Trước và sau', en: 'Before and after' },
  goals: [
    { vi: 'Nói “trước khi …” bằng V-る 前に / N の 前に', en: 'Say “before …” with V-る 前に / N の 前に' },
    { vi: 'Nói “sau khi …” bằng V-た 後で / N の 後で', en: 'Say “after …” with V-た 後で / N の 後で' },
  ],
  kanji: [],
  words: [
    { surface: '後', reading: 'あと', vi: 'sau, sau khi', example: ['{授業|じゅぎょう} の {後|あと} で {図書館|としょかん} へ {行|い}きます。', 'Sau giờ học tôi đi thư viện.', 'I go to the library after class.'] },
    { surface: '電話', reading: 'でんわ', vi: 'điện thoại; cuộc gọi', example: ['{夜|よる}、{母|はは} に {電話|でんわ} を かけます。', 'Buổi tối tôi gọi điện cho mẹ.', 'I call my mother in the evening.'] },
    { surface: 'かける', reading: 'かける', vi: 'gọi (điện thoại); đeo (kính)', example: ['{友達|ともだち} に {電話|でんわ} を かけました。', 'Tôi đã gọi điện cho bạn.', 'I phoned my friend.'] },
    { surface: '電気', reading: 'でんき', vi: 'điện; đèn', example: ['{電気|でんき} を つけて ください。', 'Hãy bật đèn lên.', 'Please turn on the light.'] },
    { surface: 'つける', reading: 'つける', vi: 'bật (đèn, máy)', example: ['エアコン を つけましょう か。', 'Tôi bật điều hòa nhé?', 'Shall I turn on the air conditioner?'] },
    { surface: '消す', reading: 'けす', vi: 'tắt; xóa', example: ['{寝|ね}る {前|まえ} に {電気|でんき} を {消|け}します。', 'Tôi tắt đèn trước khi ngủ.', 'I turn off the light before going to bed.'] },
    { surface: '窓', reading: 'まど', vi: 'cửa sổ', example: ['{窓|まど} を {開|あ}けて も いい です か。', 'Tôi mở cửa sổ được không?', 'May I open the window?'] },
    { surface: 'ドア', reading: 'ドア', vi: 'cửa ra vào', example: ['ドア を {閉|し}めて ください。', 'Hãy đóng cửa.', 'Please close the door.'] },
    { surface: '鍵', reading: 'かぎ', vi: 'chìa khóa', example: ['{出|で}かける {前|まえ} に {鍵|かぎ} を かけます。', 'Tôi khóa cửa trước khi ra ngoài.', 'I lock the door before going out.'] },
    { surface: '置く', reading: 'おく', vi: 'đặt, để', example: ['{鞄|かばん} を {机|つくえ} の {上|うえ} に {置|お}きます。', 'Tôi để cặp lên bàn.', 'I put my bag on the desk.'] },
    { surface: '取る', reading: 'とる', vi: 'lấy', example: ['すみません、{塩|しお} を {取|と}って ください。', 'Xin lỗi, lấy giúp tôi lọ muối.', 'Excuse me, could you pass the salt?'] },
    { surface: '履く', reading: 'はく', vi: 'đi (giày), mặc (quần)', example: ['{新|あたら}しい {靴|くつ} を {履|は}きます。', 'Tôi đi đôi giày mới.', 'I put on new shoes.'] },
    { surface: '脱ぐ', reading: 'ぬぐ', vi: 'cởi (giày, áo)', example: ['{家|いえ} に {入|はい}る {前|まえ} に {靴|くつ} を {脱|ぬ}ぎます。', 'Cởi giày trước khi vào nhà.', 'Take off your shoes before entering the house.'] },
    { surface: '帰り', reading: 'かえり', vi: 'lúc về, đường về', example: ['{会社|かいしゃ} の {帰|かえ}り に {買|か}い{物|もの} を します。', 'Trên đường đi làm về tôi đi mua đồ.', 'I go shopping on the way home from work.'] },
  ],
  grammar: [
    {
      id: 'n5-mae-ni',
      pattern: 'V (từ điển) 前に / N の 前に / (thời gian) 前に',
      meaning: { vi: 'trước khi ～; trước ～', en: 'before ～' },
      explanation: {
        vi: 'Động từ trước 前に luôn ở thể từ điển, kể cả khi cả câu ở quá khứ: 寝る 前に 歯を 磨きました. Danh từ thêm の: 食事の 前に. Thời lượng thì không cần の: 三年 前に (ba năm trước).',
        en: 'The verb before 前に is always in the dictionary form, even in a past sentence: 寝る 前に 歯を 磨きました. Nouns take の: 食事の 前に. A length of time needs no の: 三年 前に (three years ago).',
      },
      examples: [
        ['{寝|ね}る {前|まえ} に {電気|でんき} を {消|け}します。', 'Tôi tắt đèn trước khi ngủ.', 'I turn off the light before I go to bed.'],
        ['{食事|しょくじ} の {前|まえ} に {手|て} を {洗|あら}いましょう。', 'Hãy rửa tay trước bữa ăn.', 'Let’s wash our hands before the meal.'],
      ],
      cloze: [
        ['{出|で}かける {前|まえ} に {鍵|かぎ} を かけました。', '前に', 'Tôi đã khóa cửa trước khi ra ngoài.', 'I locked the door before I went out.'],
        ['{会議|かいぎ} の {前|まえ} に {資料|しりょう} を {読|よ}みます。', 'の', 'Tôi đọc tài liệu trước cuộc họp.', 'I read the documents before the meeting.'],
      ],
    },
    {
      id: 'n5-ato-de',
      pattern: 'V-た 後で / N の 後で',
      meaning: { vi: 'sau khi ～; sau ～', en: 'after ～' },
      explanation: {
        vi: 'Động từ trước 後で ở thể た (kể cả với việc tương lai): 宿題を した 後で 遊びます. Danh từ thêm の: 授業の 後で. ～てから (bài 21) nhấn thứ tự liền nhau, còn 後で chỉ nói việc sau xảy ra sau, có thể cách một khoảng.',
        en: 'The verb before 後で is in the た-form (even for future actions): 宿題を した 後で 遊びます. Nouns take の: 授業の 後で. ～てから (lesson 21) stresses one action right after the other; 後で just says the second happens later, possibly with a gap.',
      },
      examples: [
        ['{仕事|しごと} が {終|お}わった {後|あと} で、{飲|の}み に {行|い}きます。', 'Sau khi xong việc tôi đi uống.', 'I go for a drink after work is over.'],
        ['{映画|えいが} の {後|あと} で、ご{飯|はん} を {食|た}べましょう。', 'Sau khi xem phim mình đi ăn nhé.', 'Let’s eat after the film.'],
      ],
      cloze: [
        ['{晩|ばん}ご{飯|はん} を {食|た}べた {後|あと} で、{散歩|さんぽ} します。', '食べた', 'Ăn tối xong tôi đi dạo.', 'I take a walk after eating dinner.'],
        ['{授業|じゅぎょう} の {後|あと} で、{先生|せんせい} に {質問|しつもん} しました。', '後で', 'Sau giờ học tôi đã hỏi thầy.', 'After class I asked the teacher a question.'],
      ],
    },
  ],
  dialogue: [
    ['{大家|おおや}', '{部屋|へや} に {入|はい}る {前|まえ} に、{靴|くつ} を {脱|ぬ}いで ください。', 'Trước khi vào phòng hãy cởi giày.', 'Please take off your shoes before you enter the room.'],
    ['ミン', 'はい、{分|わ}かりました。 {鍵|かぎ} は どこ に {置|お}きます か。', 'Vâng. Chìa khóa để ở đâu ạ?', 'Sure. Where do I put the key?'],
    ['{大家|おおや}', 'ドア の {近|ちか}く の {箱|はこ} に {置|お}いて ください。 {出|で}かける {前|まえ} に、{電気|でんき} を {消|け}して ください ね。', 'Để vào hộp gần cửa. Trước khi ra ngoài nhớ tắt đèn nhé.', 'Put it in the box near the door. And turn off the lights before you go out.'],
    ['ミン', 'はい。 {荷物|にもつ} を {置|お}いた {後|あと} で、{買|か}い{物|もの} に {行|い}きます。', 'Vâng. Để hành lý xong tôi sẽ đi mua đồ.', 'OK. I’ll go shopping after I put down my luggage.'],
  ],
} satisfies LessonSource;

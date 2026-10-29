import type { LessonSource } from '../types';

export default {
  id: 'n5-17',
  order: 17,
  title: { vi: 'Cơ thể và sức khỏe', en: 'The body and health' },
  goals: [
    { vi: 'Gọi tên các bộ phận cơ thể và nói chỗ bị đau', en: 'Name parts of the body and say where it hurts' },
    { vi: 'Xin phép và cấm đoán với ～てもいいです, ～てはいけません', en: 'Ask for and refuse permission with ～てもいいです and ～てはいけません' },
  ],
  kanji: ['口', '目', '耳', '手', '足'],
  words: [
    { surface: '体', reading: 'からだ', vi: 'cơ thể', example: ['{体|からだ} に {気|き} を つけて ください。', 'Hãy giữ gìn sức khỏe nhé.', 'Please take care of yourself.'] },
    { surface: '頭', reading: 'あたま', vi: 'đầu', example: ['{今朝|けさ} から {頭|あたま} が {痛|いた}い です。', 'Từ sáng nay tôi bị đau đầu.', 'I have had a headache since this morning.'] },
    { surface: '顔', reading: 'かお', vi: 'mặt, khuôn mặt', example: ['{朝|あさ}、{顔|かお} を {洗|あら}います。', 'Buổi sáng tôi rửa mặt.', 'I wash my face in the morning.'] },
    { surface: '目', reading: 'め', vi: 'mắt', example: ['{妹|いもうと} は {目|め} が {大|おお}きい です。', 'Em gái tôi có đôi mắt to.', 'My younger sister has big eyes.'] },
    { surface: '耳', reading: 'みみ', vi: 'tai', example: ['{兎|うさぎ} は {耳|みみ} が {長|なが}い です。', 'Thỏ có tai dài.', 'Rabbits have long ears.'] },
    { surface: '鼻', reading: 'はな', vi: 'mũi', example: ['{象|ぞう} の {鼻|はな} は とても {長|なが}い です。', 'Vòi của con voi rất dài.', 'An elephant’s trunk is very long.'] },
    { surface: '口', reading: 'くち', vi: 'miệng', example: ['{口|くち} を {大|おお}きく {開|あ}けて ください。', 'Hãy há miệng to ra.', 'Please open your mouth wide.'] },
    { surface: '手', reading: 'て', vi: 'tay', example: ['{食事|しょくじ} の {前|まえ} に {手|て} を {洗|あら}います。', 'Tôi rửa tay trước khi ăn.', 'I wash my hands before meals.'] },
    { surface: '足', reading: 'あし', vi: 'chân', example: ['{足|あし} が {少|すこ}し {痛|いた}い です。', 'Chân tôi hơi đau.', 'My feet hurt a little.'] },
    { surface: '歯', reading: 'は', vi: 'răng', example: ['{寝|ね}る {前|まえ} に {歯|は} を {磨|みが}きます。', 'Tôi đánh răng trước khi ngủ.', 'I brush my teeth before going to bed.'] },
    { surface: 'お腹', reading: 'おなか', vi: 'bụng', example: ['お{腹|なか} が {痛|いた}い です。', 'Tôi bị đau bụng.', 'I have a stomach ache.'] },
    { surface: '痛い', reading: 'いたい', vi: 'đau', example: ['どこ が {痛|いた}い ですか。', 'Bạn đau ở đâu?', 'Where does it hurt?'] },
    { surface: '病気', reading: 'びょうき', vi: 'bệnh, ốm', example: ['{祖母|そぼ} は {病気|びょうき} で {入院|にゅういん} して います。', 'Bà tôi bị ốm và đang nằm viện.', 'My grandmother is ill and in hospital.'] },
    { surface: '薬', reading: 'くすり', vi: 'thuốc', example: ['{一日|いちにち} {三回|さんかい} この {薬|くすり} を {飲|の}みます。', 'Uống thuốc này mỗi ngày ba lần.', 'Take this medicine three times a day.'] },
    { surface: '風邪', reading: 'かぜ', vi: 'cảm lạnh', example: ['{風邪|かぜ} を ひきました。', 'Tôi bị cảm rồi.', 'I caught a cold.'] },
    { surface: 'たばこ', reading: 'たばこ', vi: 'thuốc lá', example: ['{父|ちち} は たばこ を やめました。', 'Bố tôi đã bỏ thuốc lá.', 'My father quit smoking.'] },
    { surface: '吸う', reading: 'すう', vi: 'hút (thuốc); hít', example: ['{外|そと} で {深|ふか}く {息|いき} を {吸|す}います。', 'Tôi hít một hơi thật sâu ở bên ngoài.', 'I take a deep breath outside.'] },
  ],
  grammar: [
    {
      id: 'n5-temo-ii',
      pattern: 'V て も いい です (か)',
      meaning: { vi: 'được phép làm V; (tôi) làm V được không?', en: 'may do V; may I do V?' },
      explanation: {
        vi: 'Thể て + もいいです diễn tả sự cho phép. Thêm か để xin phép: 窓を開けてもいいですか. Trả lời đồng ý: ええ、いいですよ / どうぞ. Từ chối nhẹ nhàng: すみません、ちょっと…',
        en: 'The て-form + もいいです gives permission. Add か to ask for permission: 窓を開けてもいいですか. To say yes: ええ、いいですよ / どうぞ. To refuse softly: すみません、ちょっと…',
      },
      examples: [
        ['ここ で {写真|しゃしん} を {撮|と}っても いい ですか。', 'Tôi chụp ảnh ở đây được không?', 'May I take photos here?'],
        ['{少|すこ}し {休|やす}んでも いい です よ。', 'Bạn nghỉ một chút cũng được đấy.', 'You can rest for a bit.'],
      ],
      cloze: [
        ['この {鉛筆|えんぴつ} を {使|つか}っても いい ですか。', 'も', 'Tôi dùng cái bút chì này được không?', 'May I use this pencil?'],
        ['{窓|まど} を {開|あ}けても いい ですか。 — ええ、どうぞ。', 'いい', 'Tôi mở cửa sổ được không? — Vâng, xin mời.', 'May I open the window? — Yes, go ahead.'],
      ],
    },
    {
      id: 'n5-tewa-ikemasen',
      pattern: 'V て は いけません',
      meaning: { vi: 'không được làm V', en: 'must not do V' },
      explanation: {
        vi: 'Thể て + はいけません diễn tả sự cấm đoán, thường dùng cho quy định, biển báo hoặc khi người trên nói với người dưới. Khi trả lời câu xin phép, thường nói mềm hơn: すみません、ちょっと… hoặc いいえ、いけません.',
        en: 'The て-form + はいけません forbids something. It is used for rules, signs, or by someone in authority. When answering a request for permission, a softer reply is common: すみません、ちょっと… or いいえ、いけません.',
      },
      examples: [
        ['{病院|びょういん} で たばこ を {吸|す}っては いけません。', 'Không được hút thuốc trong bệnh viện.', 'You must not smoke in the hospital.'],
        ['{図書館|としょかん} で {話|はな}しては いけません。', 'Không được nói chuyện trong thư viện.', 'You must not talk in the library.'],
      ],
      cloze: [
        ['{美術館|びじゅつかん} の {絵|え} に {手|て} で {触|さわ}っては いけません。', 'いけません', 'Không được dùng tay chạm vào tranh trong bảo tàng mỹ thuật.', 'You must not touch the paintings in the museum.'],
        ['ここ に {車|くるま} を {止|と}めては いけません。', 'は', 'Không được đỗ xe ở đây.', 'You must not park your car here.'],
      ],
    },
  ],
  dialogue: [
    ['医者', 'どう しました か。', 'Anh bị làm sao?', 'What seems to be the problem?'],
    ['ビン', '{昨日|きのう} から {頭|あたま} と {喉|のど} が {痛|いた}い です。', 'Từ hôm qua tôi bị đau đầu và đau họng.', 'My head and throat have hurt since yesterday.'],
    ['医者', '{風邪|かぜ} です ね。 この {薬|くすり} を {飲|の}んで ください。 {今日|きょう} は お{風呂|ふろ} に {入|はい}っては いけません。', 'Anh bị cảm rồi. Hãy uống thuốc này. Hôm nay không được tắm bồn nhé.', 'It’s a cold. Please take this medicine. Don’t take a bath today.'],
    ['ビン', 'はい。 {明日|あした} {会社|かいしゃ} を {休|やす}んでも いい ですか。', 'Vâng. Ngày mai tôi nghỉ làm có được không ạ?', 'All right. May I take tomorrow off work?'],
  ],
} satisfies LessonSource;

import type { LessonSource } from '../types';

export default {
  id: 'n5-24',
  order: 24,
  title: { vi: 'Ý kiến và lời nói', en: 'Opinions and quotes' },
  goals: [
    { vi: 'Nêu ý kiến của mình bằng ～と思います', en: 'Give your opinion with ～と思います' },
    { vi: 'Thuật lại lời người khác bằng ～と言いました', en: 'Report what someone said with ～と言いました' },
  ],
  kanji: [],
  words: [
    { surface: '思う', reading: 'おもう', vi: 'nghĩ, cho rằng', example: ['{日本語|にほんご} は {面白|おもしろ}い と {思|おも}います。', 'Tôi nghĩ tiếng Nhật thú vị.', 'I think Japanese is interesting.'] },
    { surface: '考える', reading: 'かんがえる', vi: 'suy nghĩ, cân nhắc', example: ['よく {考|かんが}えて ください。', 'Hãy suy nghĩ kỹ.', 'Please think carefully.'] },
    { surface: 'ニュース', reading: 'ニュース', vi: 'tin tức', example: ['{毎朝|まいあさ} ニュース を {見|み}ます。', 'Sáng nào tôi cũng xem tin tức.', 'I watch the news every morning.'] },
    { surface: '試験', reading: 'しけん', vi: 'kỳ thi, bài thi', example: ['{来週|らいしゅう} {日本語|にほんご} の {試験|しけん} が あります。', 'Tuần sau có thi tiếng Nhật.', 'There is a Japanese exam next week.'] },
    { surface: 'テスト', reading: 'テスト', vi: 'bài kiểm tra', example: ['テスト は {難|むずか}しかった です。', 'Bài kiểm tra khó.', 'The test was difficult.'] },
    { surface: '問題', reading: 'もんだい', vi: 'vấn đề; câu hỏi (bài thi)', example: ['この {問題|もんだい} は {簡単|かんたん} です。', 'Câu hỏi này dễ.', 'This question is easy.'] },
    { surface: '大切', reading: 'たいせつ', vi: 'quan trọng, quý giá', example: ['{家族|かぞく} は {大切|たいせつ} です。', 'Gia đình rất quan trọng.', 'Family is important.'] },
    { surface: '大変', reading: 'たいへん', vi: 'vất vả; rất', example: ['{夜|よる} の {仕事|しごと} は {大変|たいへん} です。', 'Làm đêm vất vả.', 'Night work is hard.'] },
    { surface: '多分', reading: 'たぶん', vi: 'có lẽ', example: ['{多分|たぶん} {雨|あめ} が {降|ふ}る と {思|おも}います。', 'Tôi nghĩ có lẽ trời sẽ mưa.', 'I think it will probably rain.'] },
    { surface: 'きっと', reading: 'きっと', vi: 'chắc chắn, nhất định', example: ['きっと {大丈夫|だいじょうぶ} です よ。', 'Chắc chắn sẽ ổn thôi.', 'I’m sure it’ll be fine.'] },
    { surface: '皆さん', reading: 'みなさん', vi: 'mọi người (lịch sự)', example: ['{皆|みな}さん、おはよう ございます。', 'Chào buổi sáng mọi người.', 'Good morning, everyone.'] },
    { surface: '皆', reading: 'みんな', vi: 'mọi người, tất cả', example: ['みんな で {写真|しゃしん} を {撮|と}りましょう。', 'Mọi người cùng chụp ảnh nào.', 'Let’s all take a photo together.'] },
    { surface: '会議', reading: 'かいぎ', vi: 'cuộc họp', example: ['{三時|さんじ} から {会議|かいぎ} が あります。', 'Từ ba giờ có cuộc họp.', 'There is a meeting from three.'] },
    { surface: '社長', reading: 'しゃちょう', vi: 'giám đốc (công ty)', example: ['{社長|しゃちょう} は {今|いま} {会議|かいぎ} {中|ちゅう} です。', 'Giám đốc đang họp.', 'The president is in a meeting now.'] },
    { surface: '意見', reading: 'いけん', vi: 'ý kiến', example: ['{皆|みな}さん の {意見|いけん} を {聞|き}かせて ください。', 'Hãy cho tôi nghe ý kiến của mọi người.', 'Please tell me your opinions.'] },
  ],
  grammar: [
    {
      id: 'n5-to-omoimasu',
      pattern: '(thể thông thường) と 思います',
      meaning: { vi: 'tôi nghĩ rằng ～', en: 'I think that ～' },
      explanation: {
        vi: 'Đặt câu ở thể thông thường trước と 思います để nêu ý kiến hay phỏng đoán. Với tính từ な và danh từ, giữ だ: 便利だ と 思います. Hỏi ý kiến người khác: ～に ついて どう 思います か.',
        en: 'Put a plain-form clause before と 思います to give an opinion or a guess. With な-adjectives and nouns keep だ: 便利だ と 思います. To ask someone’s opinion: ～に ついて どう 思います か.',
      },
      examples: [
        ['{明日|あした} は {晴|は}れる と {思|おも}います。', 'Tôi nghĩ mai trời nắng.', 'I think it will be sunny tomorrow.'],
        ['この {町|まち} は {便利|べんり} だ と {思|おも}います。', 'Tôi nghĩ thị trấn này tiện lợi.', 'I think this town is convenient.'],
      ],
      cloze: [
        ['{田中|たなか}さん は もう {帰|かえ}った と {思|おも}います。', 'と', 'Tôi nghĩ anh Tanaka đã về rồi.', 'I think Mr Tanaka has already gone home.'],
        ['{試験|しけん} は {難|むずか}しくない と {思|おも}います。', '思います', 'Tôi nghĩ bài thi không khó.', 'I don’t think the exam will be hard.'],
      ],
    },
    {
      id: 'n5-to-iimashita',
      pattern: '「câu nói」 と 言いました / (thể thông thường) と 言いました',
      meaning: { vi: '(ai đó) đã nói rằng ～', en: '(someone) said ～' },
      explanation: {
        vi: 'Trích nguyên văn đặt trong 「」 + と 言いました. Thuật lại gián tiếp dùng thể thông thường + と 言いました. Người nói được đánh dấu bằng は hoặc が.',
        en: 'For a direct quote put the words in 「」 + と 言いました. For indirect speech use a plain-form clause + と 言いました. Mark the speaker with は or が.',
      },
      examples: [
        ['{先生|せんせい} は 「{明日|あした} {試験|しけん} が あります」 と {言|い}いました。', 'Thầy nói: “Mai có bài thi.”', 'The teacher said, “There is an exam tomorrow.”'],
        ['{社長|しゃちょう} は {会議|かいぎ} に {行|い}かない と {言|い}いました。', 'Giám đốc nói sẽ không đi họp.', 'The president said he would not go to the meeting.'],
      ],
      cloze: [
        ['{友達|ともだち} は {明日|あした} {来|く}る と {言|い}いました。', '言いました', 'Bạn tôi nói mai sẽ đến.', 'My friend said they would come tomorrow.'],
        ['{母|はは} は 「{早|はや}く {寝|ね}なさい」 と {言|い}いました。', 'と', 'Mẹ tôi nói: “Ngủ sớm đi.”', 'My mother said, “Go to bed early.”'],
      ],
    },
  ],
  dialogue: [
    ['{課長|かちょう}', '{皆|みな}さん、{新|あたら}しい {会議室|かいぎしつ} に ついて どう {思|おも}います か。', 'Mọi người nghĩ sao về phòng họp mới?', 'Everyone, what do you think of the new meeting room?'],
    ['ミン', '{広|ひろ}くて、{明|あか}るくて、いい と {思|おも}います。', 'Tôi nghĩ nó rộng, sáng, tốt lắm.', 'I think it’s spacious, bright and good.'],
    ['{鈴木|すずき}', 'でも、{駅|えき} から {少|すこ}し {遠|とお}い と {思|おも}います。', 'Nhưng tôi nghĩ hơi xa ga.', 'But I think it’s a bit far from the station.'],
    ['{課長|かちょう}', '{社長|しゃちょう} も 「{少|すこ}し {遠|とお}い」 と {言|い}いました。 もう {一度|いちど} {考|かんが}えましょう。', 'Giám đốc cũng nói “hơi xa”. Mình suy nghĩ lại nhé.', 'The president also said “a bit far”. Let’s think about it again.'],
  ],
} satisfies LessonSource;

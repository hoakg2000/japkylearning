import type { LessonSource } from '../types';

export default {
  id: 'n5-18',
  order: 18,
  title: { vi: 'Ngôn ngữ và khả năng', en: 'Languages and abilities' },
  goals: [
    { vi: 'Nói về việc học ngoại ngữ và khả năng của mình với ～ことができます', en: 'Talk about learning languages and your abilities with ～ことができます' },
    { vi: 'Nhờ người khác đừng làm gì với ～ないでください', en: 'Ask someone not to do something with ～ないでください' },
  ],
  kanji: ['語', '言'],
  words: [
    { surface: '言葉', reading: 'ことば', vi: 'từ ngữ; ngôn ngữ', example: ['この {言葉|ことば} の {意味|いみ} が {分|わ}かりません。', 'Tôi không hiểu nghĩa của từ này.', 'I don’t understand the meaning of this word.'] },
    { surface: '日本語', reading: 'にほんご', vi: 'tiếng Nhật', hanViet: 'NHẬT BẢN NGỮ', example: ['{毎日|まいにち} {日本語|にほんご} を {勉強|べんきょう} します。', 'Ngày nào tôi cũng học tiếng Nhật.', 'I study Japanese every day.'] },
    { surface: '英語', reading: 'えいご', vi: 'tiếng Anh', example: ['{兄|あに} は {英語|えいご} の {先生|せんせい} です。', 'Anh trai tôi là giáo viên tiếng Anh.', 'My older brother is an English teacher.'] },
    { surface: '外国', reading: 'がいこく', vi: 'nước ngoài', example: ['いつか {外国|がいこく} で {働|はたら}きたい です。', 'Một ngày nào đó tôi muốn làm việc ở nước ngoài.', 'Someday I want to work abroad.'] },
    { surface: '言う', reading: 'いう', vi: 'nói', example: ['「ありがとう」 は ベトナム{語|ご} で {何|なん} と {言|い}いますか。', '“ありがとう” tiếng Việt nói thế nào?', 'How do you say “ありがとう” in Vietnamese?'] },
    { surface: '漢字', reading: 'かんじ', vi: 'chữ Hán', example: ['{漢字|かんじ} は {難|むずか}しい です が、{面白|おもしろ}い です。', 'Chữ Hán khó nhưng thú vị.', 'Kanji are difficult but interesting.'] },
    { surface: '平仮名', reading: 'ひらがな', vi: 'chữ Hiragana', example: ['{名前|なまえ} を {平仮名|ひらがな} で {書|か}いて ください。', 'Hãy viết tên bằng chữ Hiragana.', 'Please write your name in hiragana.'] },
    { surface: '片仮名', reading: 'かたかな', vi: 'chữ Katakana', example: ['「コーヒー」 は {片仮名|かたかな} で {書|か}きます。', '“コーヒー” được viết bằng chữ Katakana.', '“コーヒー” is written in katakana.'] },
    { surface: '意味', reading: 'いみ', vi: 'ý nghĩa', example: ['この {漢字|かんじ} は どういう {意味|いみ} ですか。', 'Chữ Hán này có nghĩa là gì?', 'What does this kanji mean?'] },
    { surface: '宿題', reading: 'しゅくだい', vi: 'bài tập về nhà', example: ['{今日|きょう} は {宿題|しゅくだい} が たくさん あります。', 'Hôm nay có nhiều bài tập về nhà.', 'I have a lot of homework today.'] },
    { surface: '質問', reading: 'しつもん', vi: 'câu hỏi', example: ['{先生|せんせい}、{質問|しつもん} が あります。', 'Thưa thầy, em có câu hỏi.', 'Excuse me, I have a question.'] },
    { surface: '答える', reading: 'こたえる', vi: 'trả lời', example: ['{日本語|にほんご} で {答|こた}えて ください。', 'Hãy trả lời bằng tiếng Nhật.', 'Please answer in Japanese.'] },
    { surface: '練習する', reading: 'れんしゅうする', vi: 'luyện tập', example: ['{毎晩|まいばん} {発音|はつおん} を {練習|れんしゅう} します。', 'Tối nào tôi cũng luyện phát âm.', 'I practise pronunciation every night.'] },
    { surface: '忘れる', reading: 'わすれる', vi: 'quên', example: ['{傘|かさ} を {電車|でんしゃ} に {忘|わす}れました。', 'Tôi để quên ô trên tàu.', 'I left my umbrella on the train.'] },
    { surface: '分かる', reading: 'わかる', vi: 'hiểu, biết', example: ['{少|すこ}し {分|わ}かります。', 'Tôi hiểu một chút.', 'I understand a little.'] },
    { surface: '出来る', reading: 'できる', vi: 'có thể, làm được', example: ['{兄|あに} は {料理|りょうり} が {出来|でき}ます。', 'Anh trai tôi biết nấu ăn.', 'My older brother can cook.'] },
    { surface: '上手', reading: 'じょうず', vi: 'giỏi', example: ['ミン さん は {日本語|にほんご} が {上手|じょうず} です ね。', 'Minh giỏi tiếng Nhật nhỉ.', 'Minh is good at Japanese, isn’t he?'] },
    { surface: '下手', reading: 'へた', vi: 'kém, dở', example: ['{私|わたし} は {歌|うた} が {下手|へた} です。', 'Tôi hát dở.', 'I am bad at singing.'] },
  ],
  grammar: [
    {
      id: 'n5-naide-kudasai',
      pattern: 'V ない で ください',
      meaning: { vi: 'xin đừng làm V', en: 'please don’t do V' },
      explanation: {
        vi: 'Thể ない + でください để nhờ người khác đừng làm gì. Cách tạo thể ない: nhóm 1 đổi âm cuối sang hàng あ + ない (書く → 書かない, 待つ → 待たない; đuôi う → わない: 言う → 言わない), nhóm 2 bỏ る + ない (忘れる → 忘れない), nhóm 3: する → しない, 来る → 来ない.',
        en: 'The ない-form + でください asks someone not to do something. Making the ない-form: group 1 changes the last sound to the あ row + ない (書く → 書かない, 待つ → 待たない; う becomes わ: 言う → 言わない), group 2 drops る + ない (忘れる → 忘れない), group 3: する → しない, 来る → 来ない.',
      },
      examples: [
        ['{宿題|しゅくだい} を {忘|わす}れないで ください。', 'Đừng quên bài tập về nhà nhé.', 'Please don’t forget your homework.'],
        ['{教室|きょうしつ} で {英語|えいご} を {話|はな}さないで ください。', 'Trong lớp xin đừng nói tiếng Anh.', 'Please don’t speak English in the classroom.'],
      ],
      cloze: [
        ['この こと は {誰|だれ} に も {言|い}わないで ください。', '言わないで', 'Xin đừng nói chuyện này với ai.', 'Please don’t tell anyone about this.'],
        ['{心配|しんぱい} しないで ください。', 'ください', 'Xin đừng lo lắng.', 'Please don’t worry.'],
      ],
    },
    {
      id: 'n5-koto-ga-dekiru',
      pattern: 'V (từ điển) こと が できます / N が できます',
      meaning: { vi: 'có thể làm V; biết làm V', en: 'can do V; be able to do V' },
      explanation: {
        vi: 'Động từ thể từ điển + ことができます diễn tả khả năng hoặc khả năng cho phép: 漢字を読むことができます. Với danh từ, dùng thẳng N ができます: 日本語ができます. Phủ định: ～ことができません.',
        en: 'Dictionary-form verb + ことができます expresses ability or possibility: 漢字を読むことができます. With a noun, just say N ができます: 日本語ができます. Negative: ～ことができません.',
      },
      examples: [
        ['{私|わたし} は {漢字|かんじ} を {百|ひゃく} {書|か}く こと が できます。', 'Tôi có thể viết được một trăm chữ Hán.', 'I can write a hundred kanji.'],
        ['この {部屋|へや} で {食事|しょくじ} を する こと が できません。', 'Không thể ăn uống trong phòng này.', 'You cannot eat in this room.'],
      ],
      cloze: [
        ['{妹|いもうと} は ピアノ を {弾|ひ}く こと が できます。', 'こと', 'Em gái tôi biết chơi piano.', 'My younger sister can play the piano.'],
        ['ラン さん は {英語|えいご} が できます。', 'できます', 'Lan biết tiếng Anh.', 'Lan can speak English.'],
      ],
    },
  ],
  dialogue: [
    ['先生', 'では、{教科書|きょうかしょ} を {見|み}ないで {答|こた}えて ください。', 'Nào, các em hãy trả lời mà không nhìn sách giáo khoa nhé.', 'Now, please answer without looking at the textbook.'],
    ['ホア', '{先生|せんせい}、この {言葉|ことば} は どういう {意味|いみ} ですか。', 'Thưa cô, từ này có nghĩa là gì ạ?', 'Excuse me, what does this word mean?'],
    ['先生', '「{分|わ}かる」 と {同|おな}じ {意味|いみ} です。 {辞書|じしょ} で {調|しら}べる こと も できます よ。', 'Nghĩa giống “分かる”. Em cũng có thể tra từ điển đấy.', 'It means the same as “分かる”. You can also look it up in a dictionary.'],
    ['ホア', 'はい、{分|わ}かりました。 ありがとう ございます。', 'Vâng, em hiểu rồi. Em cảm ơn cô.', 'I see. Thank you.'],
  ],
} satisfies LessonSource;

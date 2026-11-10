import type { LessonSource } from '../types';

export default {
  id: 'n5-28',
  order: 28,
  title: { vi: 'Miêu tả người và sự thay đổi', en: 'Describing people and changes' },
  goals: [
    { vi: 'Nối hai tính từ hoặc danh từ: ～くて, ～で', en: 'Join adjectives and nouns: ～くて, ～で' },
    { vi: 'Nói sự thay đổi: ～く なります, ～に なります', en: 'Talk about change: ～く なります, ～に なります' },
  ],
  kanji: [],
  words: [
    { surface: 'なる', reading: 'なる', vi: 'trở nên, trở thành', example: ['{医者|いしゃ} に なりたい です。', 'Tôi muốn trở thành bác sĩ.', 'I want to become a doctor.'] },
    { surface: '背', reading: 'せ', vi: 'chiều cao (người); lưng', example: ['{兄|あに} は {背|せ} が {高|たか}い です。', 'Anh tôi cao.', 'My brother is tall.'] },
    { surface: '髪', reading: 'かみ', vi: 'tóc', example: ['{妹|いもうと} は {髪|かみ} が {長|なが}い です。', 'Em gái tôi tóc dài.', 'My younger sister has long hair.'] },
    { surface: '低い', reading: 'ひくい', vi: 'thấp', example: ['この {机|つくえ} は {低|ひく}い です。', 'Cái bàn này thấp.', 'This desk is low.'] },
    { surface: '太い', reading: 'ふとい', vi: 'to, mập (vật hình dài)', example: ['{太|ふと}い ペン で {書|か}きます。', 'Viết bằng bút nét to.', 'I write with a thick pen.'] },
    { surface: '細い', reading: 'ほそい', vi: 'mảnh, gầy, hẹp', example: ['この {道|みち} は {細|ほそ}い です。', 'Con đường này hẹp.', 'This road is narrow.'] },
    { surface: '厚い', reading: 'あつい', vi: 'dày', example: ['{厚|あつ}い {本|ほん} です ね。', 'Cuốn sách dày nhỉ.', 'That’s a thick book.'] },
    { surface: '薄い', reading: 'うすい', vi: 'mỏng; nhạt', example: ['この コーヒー は {薄|うす}い です。', 'Cà phê này nhạt.', 'This coffee is weak.'] },
    { surface: '丸い', reading: 'まるい', vi: 'tròn', example: ['{丸|まる}い テーブル が あります。', 'Có cái bàn tròn.', 'There is a round table.'] },
    { surface: '優しい', reading: 'やさしい', vi: 'hiền, tốt bụng', example: ['{祖母|そぼ} は とても {優|やさ}しい です。', 'Bà tôi rất hiền.', 'My grandmother is very kind.'] },
    { surface: 'かわいい', reading: 'かわいい', vi: 'dễ thương', en: 'cute; lovely', example: ['かわいい {犬|いぬ} です ね。', 'Con chó dễ thương nhỉ.', 'What a cute dog.'] },
    { surface: '危ない', reading: 'あぶない', vi: 'nguy hiểm', example: ['{危|あぶ}ない！ {車|くるま} が {来|き}ます よ。', 'Nguy hiểm! Xe đến kìa.', 'Watch out! A car is coming.'] },
    { surface: '汚い', reading: 'きたない', vi: 'bẩn', example: ['{部屋|へや} が {汚|きたな}い です から、{掃除|そうじ} します。', 'Phòng bẩn nên tôi dọn.', 'The room is dirty, so I will clean it.'] },
    { surface: '大人', reading: 'おとな', vi: 'người lớn', example: ['{大人|おとな} {二人|ふたり}、{子供|こども} {一人|ひとり} です。', 'Hai người lớn, một trẻ em.', 'Two adults and one child.'] },
    { surface: '生まれる', reading: 'うまれる', vi: 'được sinh ra', example: ['{私|わたし} は ハノイ で {生|う}まれました。', 'Tôi sinh ra ở Hà Nội.', 'I was born in Hanoi.'] },
  ],
  grammar: [
    {
      id: 'n5-kute-de',
      pattern: 'A い → A くて / A な・N → で、～',
      meaning: { vi: '～ và ～ (nối tính từ, danh từ)', en: '～ and ～ (joining adjectives and nouns)' },
      explanation: {
        vi: 'Tính từ い đổi い → くて (いい → よくて), tính từ な và danh từ thêm で để nối với vế sau: 安くて おいしい, 静かで きれい, 学生で 二十歳. Hai vế nên cùng chiều (cùng tốt hoặc cùng xấu); trái chiều thì dùng が.',
        en: 'An い-adjective changes い → くて (いい → よくて); な-adjectives and nouns add で to link to what follows: 安くて おいしい, 静かで きれい, 学生で 二十歳. Both parts should point the same way (both good or both bad); for a contrast use が.',
      },
      examples: [
        ['この {店|みせ} は {安|やす}くて、{美味|おい}しい です。', 'Quán này rẻ và ngon.', 'This restaurant is cheap and tasty.'],
        ['{田中|たなか}さん は {親切|しんせつ} で、{面白|おもしろ}い {人|ひと} です。', 'Anh Tanaka là người tử tế và thú vị.', 'Mr Tanaka is kind and fun.'],
      ],
      cloze: [
        ['{兄|あに} は {背|せ} が {高|たか}くて、{髪|かみ} が {短|みじか}い です。', '高くて', 'Anh tôi cao và tóc ngắn.', 'My brother is tall and has short hair.'],
        ['この {町|まち} は {静|しず}か で、{綺麗|きれい} です。', 'で', 'Thị trấn này yên tĩnh và sạch đẹp.', 'This town is quiet and clean.'],
      ],
    },
    {
      id: 'n5-naru',
      pattern: 'A い → A く なります / A な・N → に なります',
      meaning: { vi: 'trở nên ～, trở thành ～', en: 'become ～' },
      explanation: {
        vi: 'Diễn tả sự thay đổi trạng thái: tính từ い đổi い → く + なります (寒く なります), tính từ な và danh từ + に なります (元気に なります, 医者に なります). Quá khứ なりました cho thay đổi đã xảy ra.',
        en: 'Expresses a change of state: an い-adjective changes い → く + なります (寒く なります); な-adjectives and nouns take に なります (元気に なります, 医者に なります). Use なりました for a change that has happened.',
      },
      examples: [
        ['{冬|ふゆ} に なりました。 {寒|さむ}く なりました ね。', 'Đã sang đông rồi. Trời lạnh rồi nhỉ.', 'Winter has come. It’s got cold, hasn’t it?'],
        ['{薬|くすり} を {飲|の}んで、{元気|げんき} に なりました。', 'Uống thuốc xong tôi khỏe lại rồi.', 'I took the medicine and got better.'],
      ],
      cloze: [
        ['{部屋|へや} が {明|あか}るく なりました。', '明るく', 'Căn phòng đã sáng hơn.', 'The room has become brighter.'],
        ['{弟|おとうと} は {来年|らいねん} {大学生|だいがくせい} に なります。', 'に', 'Năm sau em trai tôi thành sinh viên.', 'My younger brother will become a university student next year.'],
      ],
    },
  ],
  dialogue: [
    ['ユン', 'これ、{子供|こども} の {時|とき} の {写真|しゃしん} です。', 'Đây là ảnh hồi nhỏ của mình.', 'This is a photo of me as a child.'],
    ['ハイ', 'わあ、かわいい！ {今|いま} より {髪|かみ} が {短|みじか}くて、{丸|まる}い {顔|かお} です ね。', 'Ôi, dễ thương quá! Tóc ngắn hơn bây giờ, mặt tròn nhỉ.', 'Wow, so cute! Your hair is shorter than now and your face is round.'],
    ['ユン', 'ええ。 {中学生|ちゅうがくせい} の {時|とき}、{急|きゅう} に {背|せ} が {高|たか}く なりました。', 'Ừ. Hồi cấp hai mình đột nhiên cao lên.', 'Yes. I suddenly got taller in junior high.'],
    ['ハイ', 'そう です か。 {私|わたし} は ずっと {背|せ} が {低|ひく}い です よ。', 'Thế à. Mình thì lúc nào cũng thấp.', 'I see. I’ve always been short.'],
  ],
} satisfies LessonSource;

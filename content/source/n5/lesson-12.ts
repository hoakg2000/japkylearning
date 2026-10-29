import type { LessonSource } from '../types';

export default {
  id: 'n5-12',
  order: 12,
  title: { vi: 'Gia đình', en: 'Family' },
  goals: [
    { vi: 'Giới thiệu các thành viên trong gia đình mình', en: 'Introduce the members of your family' },
    { vi: 'Phân biệt cách gọi gia đình mình và gia đình người khác, đếm người', en: 'Tell your own family words from other people’s and count people' },
  ],
  kanji: ['父', '母'],
  words: [
    { surface: '父', reading: 'ちち', vi: 'bố (của mình)', example: ['{父|ちち} は {医者|いしゃ} です。', 'Bố tôi là bác sĩ.', 'My father is a doctor.'] },
    { surface: '母', reading: 'はは', vi: 'mẹ (của mình)', example: ['{母|はは} は {料理|りょうり} が {上手|じょうず} です。', 'Mẹ tôi nấu ăn giỏi.', 'My mother is good at cooking.'] },
    { surface: 'お父さん', reading: 'おとうさん', vi: 'bố (của người khác); bố ơi', example: ['お{父|とう}さん は お{元気|げんき} ですか。', 'Bố bạn có khỏe không?', 'Is your father well?'] },
    { surface: 'お母さん', reading: 'おかあさん', vi: 'mẹ (của người khác); mẹ ơi', example: ['{田中|たなか}さん の お{母|かあ}さん は {先生|せんせい} です。', 'Mẹ của anh Tanaka là giáo viên.', 'Mr Tanaka’s mother is a teacher.'] },
    { surface: '兄', reading: 'あに', vi: 'anh trai (của mình)', example: ['{兄|あに} は {東京|とうきょう} に います。', 'Anh trai tôi ở Tokyo.', 'My older brother is in Tokyo.'] },
    { surface: '姉', reading: 'あね', vi: 'chị gái (của mình)', example: ['{姉|あね} は {銀行員|ぎんこういん} です。', 'Chị gái tôi là nhân viên ngân hàng.', 'My older sister is a bank clerk.'] },
    { surface: '弟', reading: 'おとうと', vi: 'em trai', example: ['{弟|おとうと} は {高校生|こうこうせい} です。', 'Em trai tôi là học sinh cấp ba.', 'My younger brother is a high school student.'] },
    { surface: '妹', reading: 'いもうと', vi: 'em gái', example: ['{妹|いもうと} は {十歳|じゅっさい} です。', 'Em gái tôi mười tuổi.', 'My younger sister is ten years old.'] },
    { surface: 'お兄さん', reading: 'おにいさん', vi: 'anh trai (của người khác)', example: ['お{兄|にい}さん は {何|なん}{歳|さい} ですか。', 'Anh trai bạn bao nhiêu tuổi?', 'How old is your older brother?'] },
    { surface: 'お姉さん', reading: 'おねえさん', vi: 'chị gái (của người khác)', example: ['お{姉|ねえ}さん は とても {親切|しんせつ} です ね。', 'Chị gái bạn tử tế quá nhỉ.', 'Your older sister is very kind.'] },
    { surface: '両親', reading: 'りょうしん', vi: 'bố mẹ', example: ['{両親|りょうしん} は ベトナム に います。', 'Bố mẹ tôi ở Việt Nam.', 'My parents are in Vietnam.'] },
    { surface: '兄弟', reading: 'きょうだい', vi: 'anh chị em', example: ['{兄弟|きょうだい} が います か。', 'Bạn có anh chị em không?', 'Do you have any brothers or sisters?'] },
    { surface: 'おじいさん', reading: 'おじいさん', vi: 'ông; ông cụ', example: ['おじいさん は {毎朝|まいあさ} {散歩|さんぽ} します。', 'Ông tôi đi dạo mỗi sáng.', 'Grandpa takes a walk every morning.'] },
    { surface: 'おばあさん', reading: 'おばあさん', vi: 'bà; bà cụ', example: ['おばあさん の {家|いえ} は {田舎|いなか} に あります。', 'Nhà của bà ở quê.', 'Grandma’s house is in the countryside.'] },
    { surface: '奥さん', reading: 'おくさん', vi: 'vợ (của người khác)', example: ['{奥|おく}さん は {日本人|にほんじん} ですか。', 'Vợ anh là người Nhật à?', 'Is your wife Japanese?'] },
    { surface: '二人', reading: 'ふたり', vi: 'hai người', example: ['{子供|こども} が {二人|ふたり} います。', 'Tôi có hai đứa con.', 'I have two children.'] },
    { surface: '何人', reading: 'なんにん', vi: 'mấy người', example: ['{教室|きょうしつ} に {学生|がくせい} が {何人|なんにん} いますか。', 'Trong lớp có mấy học sinh?', 'How many students are in the classroom?'] },
  ],
  grammar: [
    {
      id: 'n5-family-terms',
      pattern: '父・母 (gia đình mình) / お父さん・お母さん (gia đình người khác)',
      meaning: { vi: 'cách gọi gia đình mình và gia đình người khác', en: 'words for your own family vs someone else’s' },
      explanation: {
        vi: 'Khi nói với người ngoài về gia đình mình, dùng từ khiêm tốn: 父, 母, 兄, 姉. Khi nói về gia đình người khác (hoặc gọi người thân trong nhà), dùng từ kính trọng: お父さん, お母さん, お兄さん, お姉さん. 弟 và 妹 dùng cho gia đình mình; với người khác thêm さん: 弟さん, 妹さん.',
        en: 'When talking to outsiders about your own family, use the humble words: 父, 母, 兄, 姉. For someone else’s family (or when calling your own relatives), use the polite words: お父さん, お母さん, お兄さん, お姉さん. 弟 and 妹 are for your own family; add さん for others: 弟さん, 妹さん.',
      },
      examples: [
        ['{私|わたし} の {父|ちち} は {会社員|かいしゃいん} です。', 'Bố tôi là nhân viên công ty.', 'My father is an office worker.'],
        ['{山田|やまだ}さん の お{父|とう}さん は エンジニア です。', 'Bố của anh Yamada là kỹ sư.', 'Mr Yamada’s father is an engineer.'],
      ],
      cloze: [
        ['{私|わたし} の {母|はは} は {看護師|かんごし} です。', '母', 'Mẹ tôi là y tá.', 'My mother is a nurse.'],
        ['リン さん の お{姉|ねえ}さん は {学生|がくせい} ですか。', 'お姉さん', 'Chị gái của Linh là sinh viên à?', 'Is Linh’s older sister a student?'],
      ],
    },
    {
      id: 'n5-nin-counter',
      pattern: '一人 (ひとり)・二人 (ふたり)・三人 (さんにん)… / 何人',
      meaning: { vi: 'đếm người', en: 'counting people' },
      explanation: {
        vi: 'Đếm người bằng ～人. Hai số đầu đọc đặc biệt: 一人 (ひとり), 二人 (ふたり); từ ba trở đi là số + にん: 三人 (さんにん), 四人 (よにん). Hỏi bằng 何人. Hỏi số người trong gia đình: 何人家族ですか — 四人家族です.',
        en: 'Count people with ～人. The first two are special: 一人 (ひとり), 二人 (ふたり); from three on it is number + にん: 三人 (さんにん), 四人 (よにん). Ask with 何人. To ask about family size: 何人家族ですか — 四人家族です.',
      },
      examples: [
        ['{何人|なんにん} {家族|かぞく} ですか。', 'Nhà bạn có mấy người?', 'How many people are in your family?'],
        ['{五人|ごにん} {家族|かぞく} です。 {両親|りょうしん} と {兄|あに} と {妹|いもうと} と {私|わたし} です。', 'Nhà tôi có năm người: bố mẹ, anh trai, em gái và tôi.', 'There are five of us: my parents, my older brother, my younger sister and me.'],
      ],
      cloze: [
        ['{妹|いもうと} が {二人|ふたり} います。', '二人', 'Tôi có hai em gái.', 'I have two younger sisters.'],
        ['{会議室|かいぎしつ} に {何人|なんにん} いますか。', '何人', 'Trong phòng họp có mấy người?', 'How many people are in the meeting room?'],
      ],
    },
  ],
  dialogue: [
    ['山田', 'ラン さん は {何人|なんにん} {家族|かぞく} ですか。', 'Nhà Lan có mấy người?', 'How many people are in your family, Lan?'],
    ['ラン', '{四人|よにん} {家族|かぞく} です。 {父|ちち} と {母|はは} と {弟|おとうと} が います。', 'Nhà em có bốn người. Có bố, mẹ và em trai.', 'There are four of us. I have my father, my mother and a younger brother.'],
    ['山田', 'そう ですか。 {弟|おとうと}さん は {学生|がくせい} ですか。', 'Vậy à. Em trai em là học sinh à?', 'I see. Is your brother a student?'],
    ['ラン', 'はい、{大学生|だいがくせい} です。', 'Vâng, nó là sinh viên đại học.', 'Yes, he is a university student.'],
  ],
} satisfies LessonSource;

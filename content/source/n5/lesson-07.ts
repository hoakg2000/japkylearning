import type { LessonSource } from '../types';

export default {
  id: 'n5-07',
  order: 7,
  title: { vi: 'Có gì, ở đâu?', en: 'What is where?' },
  goals: [
    { vi: 'Nói có đồ vật / người ở đâu với あります・います', en: 'Say where things and people are with あります・います' },
    { vi: 'Dùng từ chỉ vị trí: trên, dưới, trong, trước, sau…', en: 'Use position words: on, under, in, in front of, behind…' },
  ],
  kanji: ['上', '下', '中', '外', '前', '右', '左', '木', '男', '女', '子'],
  words: [
    { surface: 'ある', reading: 'ある', vi: 'có (đồ vật, cây cối)', example: ['{机|つくえ} の {上|うえ} に {本|ほん} が あります。', 'Trên bàn có quyển sách.', 'There is a book on the desk.'] },
    { surface: 'いる', reading: 'いる', vi: 'có, ở (người, động vật)', example: ['{教室|きょうしつ} に {先生|せんせい} が います。', 'Trong lớp có giáo viên.', 'There is a teacher in the classroom.'] },
    { surface: '上', reading: 'うえ', vi: 'trên', example: ['{鞄|かばん} は {椅子|いす} の {上|うえ} です。', 'Cái túi ở trên ghế.', 'The bag is on the chair.'] },
    { surface: '下', reading: 'した', vi: 'dưới', example: ['{机|つくえ} の {下|した} に {猫|ねこ} が います。', 'Dưới bàn có con mèo.', 'There is a cat under the desk.'] },
    { surface: '中', reading: 'なか', vi: 'trong', example: ['{鞄|かばん} の {中|なか} に {財布|さいふ} が あります。', 'Trong túi có cái ví.', 'There is a wallet in the bag.'] },
    { surface: '外', reading: 'そと', vi: 'ngoài', example: ['{外|そと} に {子供|こども} が います。', 'Bên ngoài có trẻ con.', 'There are children outside.'] },
    { surface: '前', reading: 'まえ', vi: 'trước, phía trước', example: ['{駅|えき} の {前|まえ} に {銀行|ぎんこう} が あります。', 'Trước nhà ga có ngân hàng.', 'There is a bank in front of the station.'] },
    { surface: '後ろ', reading: 'うしろ', vi: 'phía sau', example: ['{家|いえ} の {後|うし}ろ に {木|き} が あります。', 'Sau nhà có cái cây.', 'There is a tree behind the house.'] },
    { surface: '右', reading: 'みぎ', vi: 'bên phải', example: ['トイレ は {右|みぎ} です。', 'Nhà vệ sinh ở bên phải.', 'The toilet is on the right.'] },
    { surface: '左', reading: 'ひだり', vi: 'bên trái', example: ['{銀行|ぎんこう} の {左|ひだり} に {店|みせ} が あります。', 'Bên trái ngân hàng có cửa hàng.', 'There is a shop to the left of the bank.'] },
    { surface: '机', reading: 'つくえ', vi: 'cái bàn', example: ['{机|つくえ} の {上|うえ} に {何|なに} が ありますか。', 'Trên bàn có gì?', 'What is on the desk?'] },
    { surface: '椅子', reading: 'いす', vi: 'cái ghế', example: ['{椅子|いす} の {下|した} に {犬|いぬ} が います。', 'Dưới ghế có con chó.', 'There is a dog under the chair.'] },
    { surface: '猫', reading: 'ねこ', vi: 'con mèo', example: ['{部屋|へや} に {猫|ねこ} が います。', 'Trong phòng có con mèo.', 'There is a cat in the room.'] },
    { surface: '犬', reading: 'いぬ', vi: 'con chó', example: ['{公園|こうえん} に {犬|いぬ} が います。', 'Ở công viên có con chó.', 'There is a dog in the park.'] },
    { surface: '木', reading: 'き', vi: 'cái cây', example: ['{大|おお}きい {木|き} が あります。', 'Có một cái cây to.', 'There is a big tree.'] },
    { surface: '男の人', reading: 'おとこのひと', vi: 'người đàn ông', example: ['{前|まえ} に {男|おとこ}の{人|ひと} が います。', 'Phía trước có một người đàn ông.', 'There is a man in front.'] },
    { surface: '女の人', reading: 'おんなのひと', vi: 'người phụ nữ', example: ['あの {女|おんな}の{人|ひと} は {誰|だれ} ですか。', 'Người phụ nữ kia là ai?', 'Who is that woman?'] },
    { surface: '子供', reading: 'こども', vi: 'trẻ con', example: ['{子供|こども} が {二人|ふたり} います。', 'Tôi có hai đứa con.', 'I have two children.'] },
  ],
  grammar: [
    {
      id: 'n5-arimasu-imasu',
      pattern: 'N が あります / います',
      meaning: { vi: 'có N', en: 'there is N' },
      explanation: {
        vi: 'あります dùng cho đồ vật, cây cối (không tự cử động). います dùng cho người, động vật. が đánh dấu chủ ngữ là thứ "có".',
        en: 'あります is for things and plants (not moving by themselves); います for people and animals. が marks what exists.',
      },
      examples: [
        ['{部屋|へや} に テレビ が あります。', 'Trong phòng có ti vi.', 'There is a TV in the room.'],
        ['{部屋|へや} に {猫|ねこ} が います。', 'Trong phòng có con mèo.', 'There is a cat in the room.'],
      ],
      cloze: [
        ['{公園|こうえん} に {子供|こども} が います。', 'います', 'Ở công viên có trẻ con.', 'There are children in the park.'],
        ['{机|つくえ} の {上|うえ} に {時計|とけい} が あります。', 'あります', 'Trên bàn có đồng hồ.', 'There is a clock on the desk.'],
      ],
    },
    {
      id: 'n5-ni-location',
      pattern: 'Nơi chốn に N が あります',
      meaning: { vi: 'ở nơi … có N', en: 'at a place there is N' },
      explanation: {
        vi: 'に chỉ vị trí tồn tại. Vị trí cụ thể: N1 の 上 / 下 / 中 / 前 / 後ろ に … Ví dụ: 机の上に (trên bàn).',
        en: 'に marks where something exists. For exact positions use N1 の 上 / 下 / 中 / 前 / 後ろ に, e.g. 机の上に (on the desk).',
      },
      examples: [
        ['{駅|えき} の {前|まえ} に {本屋|ほんや} が あります。', 'Trước ga có hiệu sách.', 'There is a bookstore in front of the station.'],
        ['{木|き} の {下|した} に {犬|いぬ} が います。', 'Dưới gốc cây có con chó.', 'There is a dog under the tree.'],
      ],
      cloze: [
        ['{鞄|かばん} の {中|なか} に {本|ほん} が あります。', 'に', 'Trong túi có sách.', 'There is a book in the bag.'],
        ['{家|いえ} の {外|そと} に {車|くるま} が あります。', 'が', 'Bên ngoài nhà có xe hơi.', 'There is a car outside the house.'],
      ],
    },
  ],
  dialogue: [
    ['アン', 'すみません、この {近|ちか}く に {銀行|ぎんこう} が ありますか。', 'Xin lỗi, gần đây có ngân hàng không?', 'Excuse me, is there a bank near here?'],
    ['男の人', 'はい、あります。 {駅|えき} の {前|まえ} です。', 'Có. Ở trước nhà ga.', 'Yes, there is. In front of the station.'],
    ['アン', '{駅|えき} の {右|みぎ} ですか、{左|ひだり} ですか。', 'Bên phải hay bên trái nhà ga ạ?', 'To the right or left of the station?'],
    ['男の人', '{右|みぎ} です。 {大|おお}きい {木|き} の {後|うし}ろ に あります。', 'Bên phải. Nó ở phía sau cái cây to.', 'On the right. It is behind a big tree.'],
  ],
} satisfies LessonSource;

import type { LessonSource } from '../types';

export default {
  id: 'n5-03',
  order: 3,
  title: { vi: 'Ở đâu?', en: 'Where is it?' },
  goals: [
    { vi: 'Hỏi đường, hỏi địa điểm ở đâu', en: 'Ask where places are' },
    { vi: 'Dùng ここ / そこ / あそこ / どこ', en: 'Use ここ / そこ / あそこ / どこ' },
  ],
  kanji: ['会', '社', '駅', '店', '国'],
  words: [
    { surface: 'ここ', reading: 'ここ', vi: 'chỗ này, ở đây', example: ['ここ は {食堂|しょくどう} です。', 'Đây là nhà ăn.', 'This is the cafeteria.'] },
    { surface: 'そこ', reading: 'そこ', vi: 'chỗ đó', example: ['そこ は トイレ です。', 'Chỗ đó là nhà vệ sinh.', 'That is the toilet.'] },
    { surface: 'あそこ', reading: 'あそこ', vi: 'chỗ kia', example: ['あそこ は {銀行|ぎんこう} です。', 'Chỗ kia là ngân hàng.', 'Over there is a bank.'] },
    { surface: 'どこ', reading: 'どこ', vi: 'ở đâu', example: ['{駅|えき} は どこ ですか。', 'Nhà ga ở đâu?', 'Where is the station?'] },
    { surface: '教室', reading: 'きょうしつ', vi: 'phòng học', example: ['{教室|きょうしつ} は {二階|にかい} です。', 'Phòng học ở tầng hai.', 'The classroom is on the second floor.'] },
    { surface: '食堂', reading: 'しょくどう', vi: 'nhà ăn', example: ['{食堂|しょくどう} は どこ ですか。', 'Nhà ăn ở đâu?', 'Where is the cafeteria?'] },
    { surface: 'トイレ', reading: 'トイレ', vi: 'nhà vệ sinh', example: ['すみません、トイレ は どこ ですか。', 'Xin lỗi, nhà vệ sinh ở đâu?', 'Excuse me, where is the toilet?'] },
    { surface: '会社', reading: 'かいしゃ', vi: 'công ty', example: ['{私|わたし} の {会社|かいしゃ} は {東京|とうきょう} です。', 'Công ty tôi ở Tokyo.', 'My company is in Tokyo.'] },
    { surface: '家', reading: 'いえ', vi: 'nhà', example: ['ミン さん の {家|いえ} は どこ ですか。', 'Nhà anh Minh ở đâu?', 'Where is your house, Minh?'] },
    { surface: '駅', reading: 'えき', vi: 'nhà ga', example: ['{駅|えき} は あそこ です。', 'Nhà ga ở đằng kia.', 'The station is over there.'] },
    { surface: '銀行', reading: 'ぎんこう', vi: 'ngân hàng', example: ['{銀行|ぎんこう} は {駅|えき} の {前|まえ} です。', 'Ngân hàng ở trước nhà ga.', 'The bank is in front of the station.'] },
    { surface: '病院', reading: 'びょういん', vi: 'bệnh viện', example: ['{病院|びょういん} は ここ じゃ ありません。', 'Bệnh viện không phải ở đây.', 'The hospital is not here.'] },
    { surface: '店', reading: 'みせ', vi: 'cửa hàng, quán', example: ['あの {店|みせ} は {本屋|ほんや} です。', 'Cửa hàng kia là hiệu sách.', 'That shop is a bookstore.'] },
    { surface: '国', reading: 'くに', vi: 'đất nước', example: ['お{国|くに} は どこ ですか。', 'Bạn đến từ nước nào?', 'Which country are you from?'] },
    { surface: 'デパート', reading: 'デパート', vi: 'trung tâm thương mại', example: ['デパート は {駅|えき} の {近|ちか}く です。', 'Trung tâm thương mại ở gần nhà ga.', 'The department store is near the station.'] },
    { surface: '部屋', reading: 'へや', vi: 'căn phòng', example: ['{私|わたし} の {部屋|へや} は ここ です。', 'Phòng của tôi ở đây.', 'My room is here.'] },
  ],
  grammar: [
    {
      id: 'n5-koko-soko-asoko',
      pattern: 'ここ / そこ / あそこ は N です',
      meaning: { vi: 'chỗ này / chỗ đó / chỗ kia là N', en: 'here / there / over there is N' },
      explanation: {
        vi: 'Giống これ/それ/あれ nhưng dùng cho địa điểm: ここ gần người nói, そこ gần người nghe, あそこ xa cả hai.',
        en: 'Like これ/それ/あれ but for places: ここ near the speaker, そこ near the listener, あそこ far from both.',
      },
      examples: [
        ['ここ は {教室|きょうしつ} です。', 'Đây là phòng học.', 'This is the classroom.'],
        ['あそこ は {病院|びょういん} です。', 'Đằng kia là bệnh viện.', 'Over there is the hospital.'],
      ],
      cloze: [
        ['ここ は {会社|かいしゃ} です。', 'ここ', 'Đây là công ty.', 'This is the company.'],
        ['あそこ は デパート です。', 'あそこ', 'Đằng kia là trung tâm thương mại.', 'Over there is a department store.'],
      ],
    },
    {
      id: 'n5-doko',
      pattern: 'N は どこ ですか',
      meaning: { vi: 'N ở đâu?', en: 'Where is N?' },
      explanation: {
        vi: 'Hỏi vị trí của nơi chốn, đồ vật hay người. Trả lời: N は ここ/そこ/あそこ です, hoặc nói tên địa điểm.',
        en: 'Asks where a place, thing or person is. Answer with N は ここ/そこ/あそこ です or a place name.',
      },
      examples: [
        ['トイレ は どこ ですか。', 'Nhà vệ sinh ở đâu?', 'Where is the toilet?'],
        ['{銀行|ぎんこう} は あそこ です。', 'Ngân hàng ở đằng kia.', 'The bank is over there.'],
      ],
      cloze: [
        ['{駅|えき} は どこ ですか。', 'どこ', 'Nhà ga ở đâu?', 'Where is the station?'],
        ['{食堂|しょくどう} は どこ ですか。', 'どこ', 'Nhà ăn ở đâu?', 'Where is the cafeteria?'],
      ],
    },
  ],
  dialogue: [
    ['ラン', 'すみません。 {駅|えき} は どこ ですか。', 'Xin lỗi. Nhà ga ở đâu ạ?', 'Excuse me. Where is the station?'],
    ['店員', '{駅|えき} ですか。 あそこ です。', 'Nhà ga à? Ở đằng kia.', 'The station? It is over there.'],
    ['ラン', 'ありがとうございます。 {銀行|ぎんこう} も あそこ ですか。', 'Cảm ơn ạ. Ngân hàng cũng ở đằng kia ạ?', 'Thank you. Is the bank over there too?'],
    ['店員', 'いいえ、{銀行|ぎんこう} は {駅|えき} の {前|まえ} です。', 'Không, ngân hàng ở trước nhà ga.', 'No, the bank is in front of the station.'],
  ],
} satisfies LessonSource;

import type { LessonSource } from '../types';

export default {
  id: 'n5-06',
  order: 6,
  title: { vi: 'Đi lại', en: 'Getting around' },
  goals: [
    { vi: 'Nói đi / đến / về đâu', en: 'Say where you go, come or return' },
    { vi: 'Nói đi bằng phương tiện gì, đi với ai', en: 'Say how you travel and with whom' },
  ],
  kanji: ['行', '来', '校', '電', '週'],
  words: [
    { surface: '行く', reading: 'いく', vi: 'đi', example: ['{学校|がっこう} へ {行|い}きます。', 'Tôi đi đến trường.', 'I go to school.'] },
    { surface: '来る', reading: 'くる', vi: 'đến', example: ['{友達|ともだち} が {家|いえ} へ {来|き}ます。', 'Bạn tôi đến nhà.', 'My friend is coming to my house.'] },
    { surface: '帰る', reading: 'かえる', vi: 'về, trở về', example: ['{七時|しちじ} に {家|いえ} へ {帰|かえ}ります。', 'Tôi về nhà lúc bảy giờ.', 'I go home at seven.'] },
    { surface: '学校', reading: 'がっこう', vi: 'trường học', example: ['{学校|がっこう} は {八時|はちじ} から です。', 'Trường học bắt đầu từ tám giờ.', 'School starts at eight.'] },
    { surface: '電車', reading: 'でんしゃ', vi: 'tàu điện', example: ['{電車|でんしゃ} で {会社|かいしゃ} へ {行|い}きます。', 'Tôi đi làm bằng tàu điện.', 'I go to work by train.'] },
    { surface: 'バス', reading: 'バス', vi: 'xe buýt', example: ['バス で {駅|えき} へ {行|い}きます。', 'Tôi đi xe buýt ra ga.', 'I take the bus to the station.'] },
    { surface: '自転車', reading: 'じてんしゃ', vi: 'xe đạp', example: ['{自転車|じてんしゃ} で {学校|がっこう} へ {来|き}ました。', 'Tôi đã đến trường bằng xe đạp.', 'I came to school by bicycle.'] },
    { surface: '歩く', reading: 'あるく', vi: 'đi bộ', example: ['{駅|えき} まで {歩|ある}きます。', 'Tôi đi bộ đến ga.', 'I walk to the station.'] },
    { surface: '飛行機', reading: 'ひこうき', vi: 'máy bay', example: ['{飛行機|ひこうき} で {日本|にほん} へ {行|い}きます。', 'Tôi đi Nhật bằng máy bay.', 'I go to Japan by plane.'] },
    { surface: 'タクシー', reading: 'タクシー', vi: 'tắc xi', example: ['タクシー で {病院|びょういん} へ {行|い}きました。', 'Tôi đã đi bệnh viện bằng tắc xi.', 'I went to the hospital by taxi.'] },
    { surface: '明日', reading: 'あした', vi: 'ngày mai', example: ['{明日|あした} {大阪|おおさか} へ {行|い}きます。', 'Ngày mai tôi đi Osaka.', 'I will go to Osaka tomorrow.'] },
    { surface: '来週', reading: 'らいしゅう', vi: 'tuần sau', example: ['{来週|らいしゅう} {国|くに} へ {帰|かえ}ります。', 'Tuần sau tôi về nước.', 'I will go back to my country next week.'] },
    { surface: '先週', reading: 'せんしゅう', vi: 'tuần trước', example: ['{先週|せんしゅう} {京都|きょうと} へ {行|い}きました。', 'Tuần trước tôi đã đi Kyoto.', 'I went to Kyoto last week.'] },
    { surface: '家族', reading: 'かぞく', vi: 'gia đình', example: ['{家族|かぞく} と {日本|にほん} へ {来|き}ました。', 'Tôi đã đến Nhật cùng gia đình.', 'I came to Japan with my family.'] },
    { surface: '一人で', reading: 'ひとりで', vi: 'một mình', example: ['{一人|ひとり}で {帰|かえ}ります。', 'Tôi về một mình.', 'I will go home alone.'] },
  ],
  grammar: [
    {
      id: 'n5-e-ikimasu',
      pattern: 'Nơi chốn へ 行きます / 来ます / 帰ります',
      meaning: { vi: 'đi / đến / về nơi nào', en: 'go / come / return to a place' },
      explanation: {
        vi: 'へ (đọc là "e") chỉ hướng di chuyển. Dùng với 3 động từ di chuyển 行きます (đi), 来ます (đến), 帰ります (về nhà, về nước). Có thể thay へ bằng に.',
        en: 'へ (read "e") marks the direction of movement with 行きます (go), 来ます (come) and 帰ります (return home). に can also be used.',
      },
      examples: [
        ['{明日|あした} {銀行|ぎんこう} へ {行|い}きます。', 'Ngày mai tôi đi ngân hàng.', 'I will go to the bank tomorrow.'],
        ['{何時|なんじ} に {家|いえ} へ {帰|かえ}りますか。', 'Mấy giờ bạn về nhà?', 'What time do you go home?'],
      ],
      cloze: [
        ['{会社|かいしゃ} へ {行|い}きます。', 'へ', 'Tôi đi đến công ty.', 'I go to the company.'],
        ['{来週|らいしゅう} {国|くに} へ {帰|かえ}ります。', '帰ります', 'Tuần sau tôi về nước.', 'I will return to my country next week.'],
      ],
    },
    {
      id: 'n5-de-transport',
      pattern: 'Phương tiện で 行きます',
      meaning: { vi: 'đi bằng phương tiện gì', en: 'go by a means of transport' },
      explanation: {
        vi: 'で chỉ phương tiện, cách thức. Đi bộ không dùng で mà nói 歩いて 行きます. Đi cùng ai dùng と: 友達と 行きます.',
        en: 'で marks the means of transport. For walking say 歩いて 行きます. "With someone" uses と: 友達と 行きます.',
      },
      examples: [
        ['バス で {学校|がっこう} へ {行|い}きます。', 'Tôi đi học bằng xe buýt.', 'I go to school by bus.'],
        ['{友達|ともだち} と {電車|でんしゃ} で {来|き}ました。', 'Tôi đã đến bằng tàu điện cùng bạn.', 'I came by train with a friend.'],
      ],
      cloze: [
        ['{電車|でんしゃ} で {行|い}きます。', 'で', 'Tôi đi bằng tàu điện.', 'I go by train.'],
        ['{家族|かぞく} と {来|き}ました。', 'と', 'Tôi đã đến cùng gia đình.', 'I came with my family.'],
      ],
    },
  ],
  dialogue: [
    ['ラン', '{来週|らいしゅう} {京都|きょうと} へ {行|い}きます。', 'Tuần sau tôi đi Kyoto.', 'I am going to Kyoto next week.'],
    ['田中', 'いいですね。 {誰|だれ} と {行|い}きますか。', 'Hay quá. Chị đi với ai?', 'Nice. Who are you going with?'],
    ['ラン', '{一人|ひとり}で {行|い}きます。 {電車|でんしゃ} で {行|い}きます。', 'Tôi đi một mình. Tôi đi bằng tàu điện.', 'I am going alone, by train.'],
    ['田中', 'そうですか。 {気|き}をつけて。', 'Vậy à. Đi cẩn thận nhé.', 'I see. Take care.'],
  ],
} satisfies LessonSource;

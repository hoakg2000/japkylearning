import type { LessonSource } from '../types';

export default {
  id: 'n5-10',
  order: 10,
  title: { vi: 'Tính từ đuôi な, thời tiết', en: 'な-adjectives and weather' },
  goals: [
    { vi: 'Miêu tả bằng tính từ đuôi な', en: 'Describe things with な-adjectives' },
    { vi: 'Nói về thời tiết và cảnh vật', en: 'Talk about the weather and scenery' },
  ],
  kanji: ['気', '山', '川', '花', '天', '雨', '空'],
  words: [
    { surface: '静か', reading: 'しずか', vi: 'yên tĩnh', example: ['この {町|まち} は {静|しず}か です。', 'Thị trấn này yên tĩnh.', 'This town is quiet.'] },
    { surface: '賑やか', reading: 'にぎやか', vi: 'nhộn nhịp, đông vui', example: ['{駅|えき} の {前|まえ} は {賑|にぎ}やか です。', 'Trước nhà ga rất nhộn nhịp.', 'The area in front of the station is lively.'] },
    { surface: '綺麗', reading: 'きれい', vi: 'đẹp; sạch', example: ['{桜|さくら} が とても {綺麗|きれい} です。', 'Hoa anh đào rất đẹp.', 'The cherry blossoms are very beautiful.'] },
    { surface: '有名', reading: 'ゆうめい', vi: 'nổi tiếng', example: ['{富士山|ふじさん} は {有名|ゆうめい} な {山|やま} です。', 'Núi Phú Sĩ là ngọn núi nổi tiếng.', 'Mt Fuji is a famous mountain.'] },
    { surface: '元気', reading: 'げんき', vi: 'khỏe, khỏe mạnh', example: ['お{元気|げんき} ですか。', 'Bạn có khỏe không?', 'How are you?'] },
    { surface: '暇', reading: 'ひま', vi: 'rảnh', example: ['{明日|あした} は {暇|ひま} ですか。', 'Ngày mai bạn có rảnh không?', 'Are you free tomorrow?'] },
    { surface: '便利', reading: 'べんり', vi: 'tiện lợi', example: ['{電車|でんしゃ} は {便利|べんり} です。', 'Tàu điện rất tiện.', 'Trains are convenient.'] },
    { surface: '親切', reading: 'しんせつ', vi: 'tốt bụng, tử tế', example: ['{田中|たなか}さん は {親切|しんせつ} な {人|ひと} です。', 'Anh Tanaka là người tốt bụng.', 'Mr Tanaka is a kind person.'] },
    { surface: '大丈夫', reading: 'だいじょうぶ', vi: 'không sao, ổn', example: ['{大丈夫|だいじょうぶ} ですか。', 'Bạn có sao không?', 'Are you all right?'] },
    { surface: '簡単', reading: 'かんたん', vi: 'đơn giản, dễ', example: ['この {料理|りょうり} は {簡単|かんたん} です。', 'Món này dễ làm.', 'This dish is easy to make.'] },
    { surface: '町', reading: 'まち', vi: 'thị trấn, phố', example: ['{私|わたし} の {町|まち} は {小|ちい}さい です。', 'Thị trấn của tôi nhỏ.', 'My town is small.'] },
    { surface: '山', reading: 'やま', vi: 'núi', example: ['{山|やま} が {綺麗|きれい} です。', 'Núi đẹp.', 'The mountains are beautiful.'] },
    { surface: '川', reading: 'かわ', vi: 'sông', example: ['{町|まち} に {大|おお}きい {川|かわ} が あります。', 'Trong thị trấn có con sông lớn.', 'There is a big river in the town.'] },
    { surface: '花', reading: 'はな', vi: 'hoa', example: ['{公園|こうえん} の {花|はな} は {綺麗|きれい} でした。', 'Hoa ở công viên đã rất đẹp.', 'The flowers in the park were beautiful.'] },
    { surface: '天気', reading: 'てんき', vi: 'thời tiết', example: ['{今日|きょう} は いい {天気|てんき} です ね。', 'Hôm nay thời tiết đẹp nhỉ.', 'Nice weather today, isn’t it?'] },
    { surface: '雨', reading: 'あめ', vi: 'mưa', example: ['{昨日|きのう} は {雨|あめ} でした。', 'Hôm qua trời mưa.', 'It rained yesterday.'] },
    { surface: '空', reading: 'そら', vi: 'bầu trời', example: ['{空|そら} が {青|あお}い です。', 'Bầu trời xanh.', 'The sky is blue.'] },
  ],
  grammar: [
    {
      id: 'n5-na-adj',
      pattern: 'A な です / じゃありません / でした',
      meaning: { vi: 'tính từ đuôi な: khẳng định, phủ định, quá khứ', en: 'な-adjectives: affirmative, negative, past' },
      explanation: {
        vi: 'Tính từ đuôi な chia giống danh từ: 静かです, 静かじゃありません, 静かでした, 静かじゃありませんでした. Chú ý: 綺麗 (きれい) và 有名 là tính từ な dù kết thúc bằng âm い.',
        en: 'な-adjectives conjugate like nouns: 静かです, 静かじゃありません, 静かでした, 静かじゃありませんでした. Note 綺麗 (きれい) and 有名 are な-adjectives even if they end in an い sound.',
      },
      examples: [
        ['この {部屋|へや} は {静|しず}か じゃ ありません。', 'Phòng này không yên tĩnh.', 'This room is not quiet.'],
        ['{昨日|きのう} は {暇|ひま} でした。', 'Hôm qua tôi rảnh.', 'I was free yesterday.'],
      ],
      cloze: [
        ['{公園|こうえん} は {静|しず}か でした。', 'でした', 'Công viên đã rất yên tĩnh.', 'The park was quiet.'],
        ['{日本語|にほんご} は {簡単|かんたん} じゃありません。', 'じゃありません', 'Tiếng Nhật không đơn giản.', 'Japanese is not easy.'],
      ],
    },
    {
      id: 'n5-na-noun',
      pattern: 'A な + N',
      meaning: { vi: 'tính từ な bổ nghĩa cho danh từ', en: 'な-adjective before a noun' },
      explanation: {
        vi: 'Khi đứng trước danh từ, tính từ đuôi な cần thêm な: 静かな町 (thị trấn yên tĩnh). Tính từ đuôi い thì không: 大きい町.',
        en: 'Before a noun, a な-adjective takes な: 静かな町 (a quiet town). い-adjectives do not: 大きい町.',
      },
      examples: [
        ['{京都|きょうと} は {綺麗|きれい} な {町|まち} です。', 'Kyoto là thành phố đẹp.', 'Kyoto is a beautiful city.'],
        ['{有名|ゆうめい} な {山|やま} に {登|のぼ}りました。', 'Tôi đã leo một ngọn núi nổi tiếng.', 'I climbed a famous mountain.'],
      ],
      cloze: [
        ['{親切|しんせつ} な {人|ひと} です。', 'な', 'Là người tốt bụng.', 'They are a kind person.'],
        ['{便利|べんり} な {町|まち} です。', 'な', 'Là thị trấn tiện lợi.', 'It is a convenient town.'],
      ],
    },
  ],
  dialogue: [
    ['ラン', '{田中|たなか}さん、お{元気|げんき} ですか。', 'Anh Tanaka, anh khỏe không?', 'Mr Tanaka, how are you?'],
    ['田中', 'はい、{元気|げんき} です。 {今日|きょう} は いい {天気|てんき} です ね。', 'Vâng, tôi khỏe. Hôm nay thời tiết đẹp nhỉ.', 'I am fine. Nice weather today, isn’t it?'],
    ['ラン', 'ええ。 {昨日|きのう} は {雨|あめ} でした が、{今日|きょう} は {空|そら} が {綺麗|きれい} です。', 'Vâng. Hôm qua mưa nhưng hôm nay trời đẹp.', 'Yes. It rained yesterday, but the sky is beautiful today.'],
    ['田中', '{週末|しゅうまつ} は {静|しず}か な {山|やま} へ {行|い}きませんか。', 'Cuối tuần đi núi cho yên tĩnh không?', 'Shall we go to a quiet mountain at the weekend?'],
  ],
} satisfies LessonSource;

import type { LessonSource } from '../types';

export default {
  id: 'n5-04',
  order: 4,
  title: { vi: 'Số đếm và giờ giấc', en: 'Numbers and time' },
  goals: [
    { vi: 'Đếm từ 1 đến 100', en: 'Count from 1 to 100' },
    { vi: 'Hỏi giờ, nói giờ làm việc từ … đến …', en: 'Ask the time and say opening hours from … to …' },
  ],
  kanji: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '百', '今', '午', '後', '半', '時', '分'],
  words: [
    { surface: '一', reading: 'いち', vi: 'một (1)', example: ['{一時|いちじ} です。', 'Một giờ.', 'It is one o’clock.'] },
    { surface: '二', reading: 'に', vi: 'hai (2)', example: ['{二時|にじ} から です。', 'Từ hai giờ.', 'From two o’clock.'] },
    { surface: '三', reading: 'さん', vi: 'ba (3)', example: ['{今|いま} {三時|さんじ} です。', 'Bây giờ là ba giờ.', 'It is three o’clock now.'] },
    { surface: '四', reading: 'よん', vi: 'bốn (4)', example: ['{四時|よじ} まで {勉強|べんきょう} します。', 'Tôi học đến bốn giờ.', 'I study until four.'] },
    { surface: '五', reading: 'ご', vi: 'năm (5)', example: ['{五時|ごじ} です。', 'Năm giờ.', 'It is five o’clock.'] },
    { surface: '六', reading: 'ろく', vi: 'sáu (6)', example: ['{六時|ろくじ} に {起|お}きます。', 'Tôi dậy lúc sáu giờ.', 'I get up at six.'] },
    { surface: '七', reading: 'なな', vi: 'bảy (7)', example: ['{七時|しちじ} {半|はん} です。', 'Bảy giờ rưỡi.', 'It is half past seven.'] },
    { surface: '八', reading: 'はち', vi: 'tám (8)', example: ['{会社|かいしゃ} は {八時|はちじ} から です。', 'Công ty bắt đầu từ tám giờ.', 'The company starts at eight.'] },
    { surface: '九', reading: 'きゅう', vi: 'chín (9)', example: ['{銀行|ぎんこう} は {九時|くじ} から です。', 'Ngân hàng mở cửa từ chín giờ.', 'The bank opens at nine.'] },
    { surface: '十', reading: 'じゅう', vi: 'mười (10)', example: ['{十時|じゅうじ} に {寝|ね}ます。', 'Tôi ngủ lúc mười giờ.', 'I go to bed at ten.'] },
    { surface: '百', reading: 'ひゃく', vi: 'một trăm (100)', example: ['この {鉛筆|えんぴつ} は {百円|ひゃくえん} です。', 'Cây bút chì này giá một trăm yên.', 'This pencil is 100 yen.'] },
    { surface: '今', reading: 'いま', vi: 'bây giờ', example: ['{今|いま} {何時|なんじ} ですか。', 'Bây giờ là mấy giờ?', 'What time is it now?'] },
    { surface: '午前', reading: 'ごぜん', vi: 'buổi sáng (AM)', example: ['{午前|ごぜん} {九時|くじ} です。', 'Chín giờ sáng.', 'It is 9 a.m.'] },
    { surface: '午後', reading: 'ごご', vi: 'buổi chiều (PM)', example: ['{午後|ごご} {二時|にじ} から {休|やす}みます。', 'Tôi nghỉ từ hai giờ chiều.', 'I take a break from 2 p.m.'] },
    { surface: '半', reading: 'はん', vi: 'rưỡi, một nửa', example: ['{今|いま} {四時|よじ} {半|はん} です。', 'Bây giờ là bốn giờ rưỡi.', 'It is half past four now.'] },
    { surface: '何時', reading: 'なんじ', vi: 'mấy giờ', example: ['{昼休|ひるやす}み は {何時|なんじ} から ですか。', 'Giờ nghỉ trưa bắt đầu lúc mấy giờ?', 'What time does the lunch break start?'] },
    { surface: '分', reading: 'ふん', vi: 'phút', example: ['{三時|さんじ} {十分|じゅっぷん} です。', 'Ba giờ mười phút.', 'It is ten past three.'] },
  ],
  grammar: [
    {
      id: 'n5-ji-fun',
      pattern: '〜時〜分',
      meaning: { vi: '… giờ … phút', en: '… o’clock … minutes' },
      explanation: {
        vi: 'Số + 時 (じ) là giờ, số + 分 (ふん/ぷん) là phút. Chú ý cách đọc đặc biệt: 4時 よじ, 7時 しちじ, 9時 くじ; 1分 いっぷん, 3分 さんぷん, 10分 じゅっぷん. "Rưỡi" là 半 (はん).',
        en: 'Number + 時 (じ) gives the hour, number + 分 (ふん/ぷん) the minutes. Watch the special readings: 4時 よじ, 7時 しちじ, 9時 くじ; 1分 いっぷん, 3分 さんぷん, 10分 じゅっぷん. "Half past" is 半 (はん).',
      },
      examples: [
        ['{今|いま} {午前|ごぜん} {七時|しちじ} です。', 'Bây giờ là bảy giờ sáng.', 'It is 7 a.m. now.'],
        ['{九時|くじ} {半|はん} です。', 'Chín giờ rưỡi.', 'It is half past nine.'],
      ],
      cloze: [
        ['{今|いま} {四時|よじ} です。', '四時', 'Bây giờ là bốn giờ.', 'It is four o’clock now.'],
        ['{六時|ろくじ} {半|はん} です。', '半', 'Sáu giờ rưỡi.', 'It is half past six.'],
      ],
    },
    {
      id: 'n5-kara-made',
      pattern: 'N1 から N2 まで',
      meaning: { vi: 'từ N1 đến N2', en: 'from N1 to N2' },
      explanation: {
        vi: 'から chỉ điểm bắt đầu, まで chỉ điểm kết thúc (thời gian hoặc nơi chốn). Có thể dùng riêng từng trợ từ.',
        en: 'から marks the start and まで the end, of time or place. Each can also be used alone.',
      },
      examples: [
        ['{銀行|ぎんこう} は {九時|くじ} から {三時|さんじ} まで です。', 'Ngân hàng mở cửa từ chín giờ đến ba giờ.', 'The bank is open from nine to three.'],
        ['{昼休|ひるやす}み は {十二時|じゅうにじ} から です。', 'Giờ nghỉ trưa bắt đầu từ mười hai giờ.', 'The lunch break starts at twelve.'],
      ],
      cloze: [
        ['{会社|かいしゃ} は {八時|はちじ} から です。', 'から', 'Công ty bắt đầu từ tám giờ.', 'The company starts at eight.'],
        ['{店|みせ} は {十時|じゅうじ} まで です。', 'まで', 'Cửa hàng mở đến mười giờ.', 'The shop is open until ten.'],
      ],
    },
  ],
  dialogue: [
    ['ミン', 'すみません、{今|いま} {何時|なんじ} ですか。', 'Xin lỗi, bây giờ là mấy giờ?', 'Excuse me, what time is it now?'],
    ['田中', '{十一時|じゅういちじ} {半|はん} です。', 'Mười một giờ rưỡi.', 'It is half past eleven.'],
    ['ミン', '{食堂|しょくどう} は {何時|なんじ} から ですか。', 'Nhà ăn mở cửa từ mấy giờ?', 'What time does the cafeteria open?'],
    ['田中', '{十二時|じゅうにじ} から {一時|いちじ} まで です。', 'Từ mười hai giờ đến một giờ.', 'From twelve to one.'],
  ],
} satisfies LessonSource;

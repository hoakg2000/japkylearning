import type { LessonSource } from '../types';

export default {
  id: 'n5-13',
  order: 13,
  title: { vi: 'Ngày, tháng, năm', en: 'Days, months and years' },
  goals: [
    { vi: 'Nói thứ trong tuần, ngày và tháng', en: 'Say the days of the week, dates and months' },
    { vi: 'Nói thời điểm làm việc gì với trợ từ に', en: 'Say when something happens with the particle に' },
  ],
  kanji: ['月', '火', '金', '土', '年'],
  words: [
    { surface: '月曜日', reading: 'げつようび', vi: 'thứ Hai', example: ['{月曜日|げつようび} は {忙|いそが}しい です。', 'Thứ Hai tôi bận.', 'I am busy on Mondays.'] },
    { surface: '火曜日', reading: 'かようび', vi: 'thứ Ba', example: ['{火曜日|かようび} に {日本語|にほんご} の {授業|じゅぎょう} が あります。', 'Thứ Ba có giờ học tiếng Nhật.', 'There is a Japanese class on Tuesday.'] },
    { surface: '水曜日', reading: 'すいようび', vi: 'thứ Tư', example: ['{水曜日|すいようび} は {休|やす}み です。', 'Thứ Tư là ngày nghỉ.', 'Wednesday is a day off.'] },
    { surface: '木曜日', reading: 'もくようび', vi: 'thứ Năm', example: ['{木曜日|もくようび} に {図書館|としょかん} へ {行|い}きます。', 'Thứ Năm tôi đi thư viện.', 'I go to the library on Thursday.'] },
    { surface: '金曜日', reading: 'きんようび', vi: 'thứ Sáu', example: ['{金曜日|きんようび} の {夜|よる} は {暇|ひま} です。', 'Tối thứ Sáu tôi rảnh.', 'I am free on Friday evening.'] },
    { surface: '土曜日', reading: 'どようび', vi: 'thứ Bảy', example: ['{土曜日|どようび} に {友達|ともだち} と {会|あ}いました。', 'Thứ Bảy tôi đã gặp bạn.', 'I met a friend on Saturday.'] },
    { surface: '日曜日', reading: 'にちようび', vi: 'Chủ nhật', example: ['{日曜日|にちようび} は {家|いえ} で {休|やす}みます。', 'Chủ nhật tôi nghỉ ở nhà.', 'On Sundays I rest at home.'] },
    { surface: '何曜日', reading: 'なんようび', vi: 'thứ mấy', en: 'what day of the week', example: ['{今日|きょう} は {何曜日|なんようび} ですか。', 'Hôm nay là thứ mấy?', 'What day of the week is it today?'] },
    { surface: '何月', reading: 'なんがつ', vi: 'tháng mấy', en: 'what month', example: ['{誕生日|たんじょうび} は {何月|なんがつ} ですか。', 'Sinh nhật bạn là tháng mấy?', 'What month is your birthday?'] },
    { surface: '今月', reading: 'こんげつ', vi: 'tháng này', example: ['{今月|こんげつ} は とても {忙|いそが}しい です。', 'Tháng này tôi rất bận.', 'I am very busy this month.'] },
    { surface: '来月', reading: 'らいげつ', vi: 'tháng sau', example: ['{来月|らいげつ} {日本|にほん} へ {行|い}きます。', 'Tháng sau tôi đi Nhật.', 'I am going to Japan next month.'] },
    { surface: '先月', reading: 'せんげつ', vi: 'tháng trước', example: ['{先月|せんげつ} {新|あたら}しい {車|くるま} を {買|か}いました。', 'Tháng trước tôi đã mua xe mới.', 'I bought a new car last month.'] },
    { surface: '今年', reading: 'ことし', vi: 'năm nay', example: ['{今年|ことし} は {雨|あめ} が {多|おお}い です。', 'Năm nay mưa nhiều.', 'There is a lot of rain this year.'] },
    { surface: '去年', reading: 'きょねん', vi: 'năm ngoái', example: ['{去年|きょねん} {大学|だいがく} に {入|はい}りました。', 'Năm ngoái tôi đã vào đại học.', 'I entered university last year.'] },
    { surface: '来年', reading: 'らいねん', vi: 'năm sau', example: ['{来年|らいねん} {結婚|けっこん} します。', 'Năm sau tôi sẽ kết hôn.', 'I am getting married next year.'] },
    { surface: '誕生日', reading: 'たんじょうび', vi: 'sinh nhật', example: ['{誕生日|たんじょうび} おめでとう ございます。', 'Chúc mừng sinh nhật.', 'Happy birthday.'] },
    { surface: '休み', reading: 'やすみ', vi: 'ngày nghỉ; kỳ nghỉ', example: ['{明日|あした} は {休|やす}み です。', 'Ngày mai là ngày nghỉ.', 'Tomorrow is a day off.'] },
  ],
  grammar: [
    {
      id: 'n5-date',
      pattern: '～月～日～曜日',
      meaning: { vi: 'nói ngày tháng', en: 'saying dates' },
      explanation: {
        vi: 'Tháng: số + 月 (がつ): 一月, 四月 (しがつ), 七月 (しちがつ), 九月 (くがつ). Ngày: số + 日 (にち), nhưng ngày 1–10, 14, 20, 24 đọc đặc biệt: 一日 (ついたち), 二日 (ふつか), 三日 (みっか), 四日 (よっか), 五日 (いつか), 八日 (ようか), 十日 (とおか), 二十日 (はつか). Thứ tự: năm → tháng → ngày → thứ. Hỏi: 何月何日ですか.',
        en: 'Months: number + 月 (がつ): 一月, 四月 (しがつ), 七月 (しちがつ), 九月 (くがつ). Days: number + 日 (にち), but days 1–10, 14, 20 and 24 are special: 一日 (ついたち), 二日 (ふつか), 三日 (みっか), 四日 (よっか), 五日 (いつか), 八日 (ようか), 十日 (とおか), 二十日 (はつか). Order: year → month → day → weekday. Ask: 何月何日ですか.',
      },
      examples: [
        ['{今日|きょう} は {五月|ごがつ} {三日|みっか} {土曜日|どようび} です。', 'Hôm nay là thứ Bảy, ngày 3 tháng 5.', 'Today is Saturday, May 3.'],
        ['{私|わたし} の {誕生日|たんじょうび} は {九月|くがつ} {二十日|はつか} です。', 'Sinh nhật tôi là ngày 20 tháng 9.', 'My birthday is September 20.'],
      ],
      cloze: [
        ['{明日|あした} は {何月|なんがつ} {何日|なんにち} ですか。', '何日', 'Ngày mai là ngày bao nhiêu tháng mấy?', 'What is the date tomorrow?'],
        ['{四月|しがつ} {一日|ついたち} は {月曜日|げつようび} です。', '月曜日', 'Ngày 1 tháng 4 là thứ Hai.', 'April 1 is a Monday.'],
      ],
    },
    {
      id: 'n5-ni-time',
      pattern: '(thời điểm) に V',
      meaning: { vi: 'làm V vào lúc (thời điểm)', en: 'do V at/on/in (a point in time)' },
      explanation: {
        vi: 'Trợ từ に đánh dấu thời điểm cụ thể: giờ, thứ, ngày, tháng, năm: 七時に, 日曜日に, 三月に. Không dùng に với từ chỉ thời gian tương đối: 今日, 明日, 昨日, 毎日, 今月, 来年… (thứ trong tuần thì dùng に hay không đều được).',
        en: 'The particle に marks a specific point in time: hours, weekdays, dates, months, years: 七時に, 日曜日に, 三月に. Do not use に with relative time words: 今日, 明日, 昨日, 毎日, 今月, 来年… (with weekdays に is optional).',
      },
      examples: [
        ['{八月|はちがつ} に {国|くに} へ {帰|かえ}ります。', 'Tháng 8 tôi về nước.', 'I am going back to my country in August.'],
        ['{毎朝|まいあさ} {六時|ろくじ} に {起|お}きます。', 'Mỗi sáng tôi dậy lúc 6 giờ.', 'I get up at six every morning.'],
      ],
      cloze: [
        ['{金曜日|きんようび} に {映画|えいが} を {見|み}ます。', 'に', 'Thứ Sáu tôi xem phim.', 'I will watch a movie on Friday.'],
        ['{来年|らいねん} {日本|にほん} で {働|はたら}きます。', '来年', 'Năm sau tôi sẽ làm việc ở Nhật.', 'Next year I will work in Japan.'],
      ],
    },
  ],
  dialogue: [
    ['ミン', '{佐藤|さとう}さん の {誕生日|たんじょうび} は いつ ですか。', 'Sinh nhật chị Sato là khi nào?', 'When is your birthday, Ms Sato?'],
    ['佐藤', '{十月|じゅうがつ} {十日|とおか} です。 {来週|らいしゅう} の {金曜日|きんようび} です。', 'Ngày 10 tháng 10. Thứ Sáu tuần sau.', 'It is October 10. Next Friday.'],
    ['ミン', 'そう ですか。 {土曜日|どようび} に {一緒|いっしょ} に {食事|しょくじ} を しませんか。', 'Vậy à. Thứ Bảy mình cùng đi ăn nhé?', 'Really? Would you like to have a meal together on Saturday?'],
    ['佐藤', 'ええ、いい です ね。', 'Ừ, hay đấy.', 'Yes, that sounds good.'],
  ],
} satisfies LessonSource;

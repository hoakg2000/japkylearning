import type { LessonSource } from '../types';

export default {
  id: 'n5-27',
  order: 27,
  title: { vi: 'Cho và nhận', en: 'Giving and receiving' },
  goals: [
    { vi: 'Nói cho và nhận đồ vật: あげます, もらいます, くれます', en: 'Talk about giving and receiving things: あげます, もらいます, くれます' },
    { vi: 'Mượn, cho mượn, trả lại', en: 'Borrow, lend and return' },
  ],
  kanji: [],
  words: [
    { surface: 'あげる', reading: 'あげる', vi: 'cho, tặng (người khác)', example: ['{友達|ともだち} に {本|ほん} を あげました。', 'Tôi đã tặng bạn một cuốn sách.', 'I gave my friend a book.'] },
    { surface: 'もらう', reading: 'もらう', vi: 'nhận', example: ['{先生|せんせい} に {辞書|じしょ} を もらいました。', 'Tôi đã nhận cuốn từ điển từ thầy.', 'I received a dictionary from my teacher.'] },
    { surface: 'くれる', reading: 'くれる', vi: 'cho (tôi / người nhà tôi)', example: ['{姉|あね} が {時計|とけい} を くれました。', 'Chị gái đã cho tôi cái đồng hồ.', 'My sister gave me a watch.'] },
    { surface: 'プレゼント', reading: 'プレゼント', vi: 'quà tặng', example: ['{誕生日|たんじょうび} の プレゼント を {買|か}いました。', 'Tôi đã mua quà sinh nhật.', 'I bought a birthday present.'] },
    { surface: 'お土産', reading: 'おみやげ', vi: 'quà (mua khi đi xa về)', example: ['{京都|きょうと} の お{土産|みやげ} です。 どうぞ。', 'Đây là quà Kyoto. Mời bạn.', 'This is a souvenir from Kyoto. Here you are.'] },
    { surface: '手紙', reading: 'てがみ', vi: 'lá thư', example: ['{母|はは} に {手紙|てがみ} を {書|か}きます。', 'Tôi viết thư cho mẹ.', 'I write a letter to my mother.'] },
    { surface: '葉書', reading: 'はがき', vi: 'bưu thiếp', example: ['{旅行|りょこう} {先|さき} から {葉書|はがき} を {送|おく}りました。', 'Tôi đã gửi bưu thiếp từ nơi du lịch.', 'I sent a postcard from my trip.'] },
    { surface: '送る', reading: 'おくる', vi: 'gửi; tiễn', example: ['{国|くに} の {家族|かぞく} に {荷物|にもつ} を {送|おく}ります。', 'Tôi gửi đồ về cho gia đình ở quê.', 'I send a parcel to my family back home.'] },
    { surface: '荷物', reading: 'にもつ', vi: 'hành lý, đồ đạc, bưu kiện', example: ['{荷物|にもつ} が {重|おも}い です。', 'Hành lý nặng.', 'The luggage is heavy.'] },
    { surface: '貸す', reading: 'かす', vi: 'cho mượn', example: ['{傘|かさ} を {貸|か}して ください。', 'Cho tôi mượn cái ô.', 'Please lend me an umbrella.'] },
    { surface: '借りる', reading: 'かりる', vi: 'mượn', example: ['{図書館|としょかん} で {本|ほん} を {借|か}ります。', 'Tôi mượn sách ở thư viện.', 'I borrow books from the library.'] },
    { surface: '返す', reading: 'かえす', vi: 'trả lại', example: ['{明日|あした} {本|ほん} を {返|かえ}します。', 'Mai tôi trả sách.', 'I will return the book tomorrow.'] },
    { surface: 'ネクタイ', reading: 'ネクタイ', vi: 'cà vạt', example: ['{父|ちち} に ネクタイ を あげました。', 'Tôi đã tặng bố cà vạt.', 'I gave my father a tie.'] },
    { surface: '花瓶', reading: 'かびん', vi: 'lọ hoa', example: ['{花瓶|かびん} に {花|はな} を {入|い}れます。', 'Cắm hoa vào lọ.', 'I put flowers in the vase.'] },
  ],
  grammar: [
    {
      id: 'n5-ageru-morau',
      pattern: 'A は B に N を あげます / B は A に (から) N を もらいます',
      meaning: { vi: 'A cho B cái N / B nhận N từ A', en: 'A gives N to B / B receives N from A' },
      explanation: {
        vi: 'あげます: người cho là chủ ngữ, người nhận đi với に. もらいます: người nhận là chủ ngữ, người cho đi với に hoặc から (từ tổ chức thì dùng から). Không dùng あげます khi người nhận là “tôi”.',
        en: 'あげます: the giver is the subject and the receiver takes に. もらいます: the receiver is the subject and the giver takes に or から (use から for organisations). Do not use あげます when the receiver is “me”.',
      },
      examples: [
        ['{私|わたし} は {妹|いもうと} に {花|はな} を あげました。', 'Tôi đã tặng hoa cho em gái.', 'I gave my younger sister flowers.'],
        ['{私|わたし} は {会社|かいしゃ} から ボーナス を もらいました。', 'Tôi nhận tiền thưởng từ công ty.', 'I got a bonus from the company.'],
      ],
      cloze: [
        ['ハイ さん は {友達|ともだち} に お{土産|みやげ} を あげました。', 'あげました', 'Anh Hải đã tặng quà cho bạn.', 'Hai gave his friend a souvenir.'],
        ['{私|わたし} は {先生|せんせい} に {手紙|てがみ} を もらいました。', 'もらいました', 'Tôi đã nhận thư từ cô giáo.', 'I received a letter from my teacher.'],
      ],
    },
    {
      id: 'n5-kureru',
      pattern: 'A は (私 に) N を くれます',
      meaning: { vi: 'A cho tôi (người nhà tôi) cái N', en: 'A gives N to me (or my family)' },
      explanation: {
        vi: 'くれます dùng khi người nhận là “tôi” hoặc người phía tôi (gia đình, nhóm của tôi). Người cho là chủ ngữ; 私 に thường được lược bỏ. So sánh: 友達が 私に 本を くれました = 私は 友達に 本を もらいました.',
        en: 'くれます is used when the receiver is “me” or someone on my side (family, my group). The giver is the subject; 私 に is usually left out. Compare: 友達が 私に 本を くれました = 私は 友達に 本を もらいました.',
      },
      examples: [
        ['{祖母|そぼ} が この {時計|とけい} を くれました。', 'Bà đã cho tôi cái đồng hồ này.', 'My grandmother gave me this watch.'],
        ['{友達|ともだち} が {弟|おとうと} に ゲーム を くれました。', 'Bạn tôi đã cho em trai tôi trò chơi.', 'My friend gave my younger brother a game.'],
      ],
      cloze: [
        ['{田中|たなか}さん が {私|わたし} に {傘|かさ} を くれました。', 'くれました', 'Anh Tanaka đã cho tôi cái ô.', 'Mr Tanaka gave me an umbrella.'],
        ['{兄|あに} が ネクタイ を くれました。', 'が', 'Anh trai đã cho tôi cà vạt.', 'My brother gave me a tie.'],
      ],
    },
  ],
  dialogue: [
    ['{山田|やまだ}', 'その ネクタイ、すてき です ね。', 'Cà vạt đó đẹp nhỉ.', 'That tie is nice.'],
    ['ミン', 'ありがとう ございます。 {誕生日|たんじょうび} に {妻|つま} が くれました。', 'Cảm ơn chị. Vợ tôi tặng hôm sinh nhật.', 'Thank you. My wife gave it to me for my birthday.'],
    ['{山田|やまだ}', 'いい です ね。 {私|わたし} は {去年|きょねん}、{夫|おっと} に {時計|とけい} を あげました。', 'Hay quá. Năm ngoái tôi tặng chồng đồng hồ.', 'Lovely. Last year I gave my husband a watch.'],
    ['ミン', 'そう です か。 {私|わたし} も {来月|らいげつ}、{妻|つま} に {何|なに} か あげたい です。', 'Thế à. Tháng sau tôi cũng muốn tặng vợ gì đó.', 'I see. I want to give my wife something next month too.'],
  ],
} satisfies LessonSource;

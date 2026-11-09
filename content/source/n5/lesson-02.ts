import type { LessonSource } from '../types';

export default {
  id: 'n5-02',
  order: 2,
  title: { vi: 'Đồ vật quanh ta', en: 'Things around us' },
  goals: [
    { vi: 'Hỏi "cái này là gì?" và trả lời', en: 'Ask and answer "what is this?"' },
    { vi: 'Nói đồ vật là của ai với の', en: 'Say whose something is with の' },
  ],
  kanji: ['何', '車', '新', '聞', '書'],
  words: [
    { surface: 'これ', reading: 'これ', vi: 'cái này (gần người nói)', example: ['これ は {本|ほん} です。', 'Đây là quyển sách.', 'This is a book.'] },
    { surface: 'それ', reading: 'それ', vi: 'cái đó (gần người nghe)', example: ['それ は {何|なん} ですか。', 'Cái đó là gì?', 'What is that?'] },
    { surface: 'あれ', reading: 'あれ', vi: 'cái kia (xa cả hai)', example: ['あれ は {私|わたし} の {車|くるま} です。', 'Kia là xe của tôi.', 'That over there is my car.'] },
    { surface: 'この', reading: 'この', vi: '… này (đứng trước danh từ)', example: ['この {傘|かさ} は {私|わたし} の です。', 'Cái ô này là của tôi.', 'This umbrella is mine.'] },
    { surface: '本', reading: 'ほん', vi: 'sách', example: ['これ は {日本語|にほんご} の {本|ほん} です。', 'Đây là sách tiếng Nhật.', 'This is a Japanese book.'] },
    { surface: '辞書', reading: 'じしょ', vi: 'từ điển', example: ['それ は {誰|だれ} の {辞書|じしょ} ですか。', 'Cuốn từ điển đó là của ai?', 'Whose dictionary is that?'] },
    { surface: '新聞', reading: 'しんぶん', vi: 'báo', example: ['これ は {今日|きょう} の {新聞|しんぶん} です。', 'Đây là báo hôm nay.', 'This is today’s newspaper.'] },
    { surface: '雑誌', reading: 'ざっし', vi: 'tạp chí', example: ['あれ は {車|くるま} の {雑誌|ざっし} です。', 'Kia là tạp chí về xe hơi.', 'That is a car magazine.'] },
    { surface: '傘', reading: 'かさ', vi: 'cái ô, dù', example: ['その {傘|かさ} は {先生|せんせい} の です。', 'Cái ô đó là của thầy giáo.', 'That umbrella is the teacher’s.'] },
    { surface: '鞄', reading: 'かばん', vi: 'cặp, túi xách', example: ['これ は {私|わたし} の {鞄|かばん} じゃ ありません。', 'Đây không phải túi của tôi.', 'This is not my bag.'] },
    { surface: '時計', reading: 'とけい', vi: 'đồng hồ', example: ['この {時計|とけい} は {日本|にほん} の です。', 'Chiếc đồng hồ này là của Nhật.', 'This watch is from Japan.'] },
    { surface: '車', reading: 'くるま', vi: 'xe hơi, ô tô', example: ['あれ は {田中|たなか}さん の {車|くるま} ですか。', 'Kia có phải xe của anh Tanaka không?', 'Is that Mr Tanaka’s car?'] },
    { surface: '鉛筆', reading: 'えんぴつ', vi: 'bút chì', example: ['これ は {鉛筆|えんぴつ} です。', 'Đây là bút chì.', 'This is a pencil.'] },
    { surface: 'ノート', reading: 'ノート', vi: 'vở', example: ['それ は {私|わたし} の ノート です。', 'Đó là vở của tôi.', 'That is my notebook.'] },
    { surface: '何', reading: 'なん', vi: 'cái gì', example: ['これ は {何|なん} ですか。', 'Cái này là gì?', 'What is this?'] },
    { surface: '誰', reading: 'だれ', vi: 'ai', example: ['あの {人|ひと} は {誰|だれ} ですか。', 'Người kia là ai?', 'Who is that person?'] },
  ],
  grammar: [
    {
      id: 'n5-kore-sore-are',
      pattern: 'これ / それ / あれ は N です',
      meaning: { vi: 'cái này / cái đó / cái kia là N', en: 'this / that / that over there is N' },
      explanation: {
        vi: 'これ chỉ vật gần người nói, それ gần người nghe, あれ xa cả hai. Khi đứng trước danh từ thì dùng この / その / あの.',
        en: 'これ is near the speaker, それ near the listener, あれ far from both. Before a noun use この / その / あの.',
      },
      examples: [
        ['これ は {時計|とけい} です。', 'Đây là đồng hồ.', 'This is a watch.'],
        ['あの {人|ひと} は {先生|せんせい} です。', 'Người kia là giáo viên.', 'That person is a teacher.'],
      ],
      cloze: [
        ['それ は {辞書|じしょ} です。', 'それ', 'Đó là từ điển.', 'That is a dictionary.'],
        ['この {本|ほん} は {私|わたし} の です。', 'この', 'Quyển sách này là của tôi.', 'This book is mine.'],
      ],
    },
    {
      id: 'n5-no',
      pattern: 'N1 の N2',
      meaning: { vi: 'N2 của N1; N2 về N1', en: 'N1’s N2; N2 about N1' },
      explanation: {
        vi: 'の nối hai danh từ: chỉ sở hữu (của ai), nội dung (sách về gì) hoặc xuất xứ. Thứ tự ngược với tiếng Việt: "私の本" = "sách của tôi".',
        en: 'の links two nouns: possession, topic or origin. The order is owner first: 私の本 = "my book".',
      },
      examples: [
        ['これ は {私|わたし} の {傘|かさ} です。', 'Đây là ô của tôi.', 'This is my umbrella.'],
        ['それ は {日本語|にほんご} の {新聞|しんぶん} です。', 'Đó là báo tiếng Nhật.', 'That is a Japanese newspaper.'],
      ],
      cloze: [
        ['{田中|たなか}さん の {車|くるま} です。', 'の', 'Là xe của anh Tanaka.', 'It is Mr Tanaka’s car.'],
        ['これ は {誰|だれ} の {鞄|かばん} ですか。', 'の', 'Đây là túi của ai?', 'Whose bag is this?'],
      ],
    },
  ],
  dialogue: [
    ['アン', 'すみません、それ は {何|なん} ですか。', 'Xin lỗi, cái đó là gì vậy?', 'Excuse me, what is that?'],
    ['田中', 'これ ですか。 {日本語|にほんご} の {辞書|じしょ} です。', 'Cái này à? Là từ điển tiếng Nhật.', 'This? It is a Japanese dictionary.'],
    ['アン', 'あの {傘|かさ} は {田中|たなか}さん の ですか。', 'Cái ô kia là của anh Tanaka à?', 'Is that umbrella yours, Mr Tanaka?'],
    ['田中', 'いいえ、{私|わたし} の じゃ ありません。 {先生|せんせい} の です。', 'Không, không phải của tôi. Là của thầy giáo.', 'No, it is not mine. It is the teacher’s.'],
  ],
} satisfies LessonSource;

import type { LessonSource } from '../types';

export default {
  id: 'n5-01',
  order: 1,
  title: { vi: 'Chào hỏi, tự giới thiệu', en: 'Greetings and introductions' },
  goals: [
    { vi: 'Tự giới thiệu tên, quốc tịch, nghề nghiệp', en: 'Introduce your name, nationality and job' },
    { vi: 'Hỏi và trả lời câu hỏi có/không', en: 'Ask and answer yes/no questions' },
  ],
  kanji: ['人', '日', '本', '学', '生', '先', '名', '大', '友'],
  words: [
    { surface: '私', reading: 'わたし', vi: 'tôi', example: ['{私|わたし} は アン です。', 'Tôi là An.', 'I am An.'] },
    { surface: 'あなた', reading: 'あなた', vi: 'bạn, anh, chị (ngôi thứ hai)', example: ['あなた は {学生|がくせい} ですか。', 'Bạn là sinh viên phải không?', 'Are you a student?'] },
    { surface: '学生', reading: 'がくせい', vi: 'học sinh, sinh viên', example: ['{私|わたし} は {学生|がくせい} です。', 'Tôi là sinh viên.', 'I am a student.'] },
    { surface: '先生', reading: 'せんせい', vi: 'giáo viên, thầy/cô', example: ['{田中|たなか}さん は {先生|せんせい} です。', 'Anh Tanaka là giáo viên.', 'Mr Tanaka is a teacher.'] },
    { surface: '会社員', reading: 'かいしゃいん', vi: 'nhân viên công ty', example: ['ミン さん は {会社員|かいしゃいん} です。', 'Anh Minh là nhân viên công ty.', 'Minh is a company employee.'] },
    { surface: '医者', reading: 'いしゃ', vi: 'bác sĩ', example: ['{母|はは} は {医者|いしゃ} です。', 'Mẹ tôi là bác sĩ.', 'My mother is a doctor.'] },
    { surface: 'エンジニア', reading: 'エンジニア', vi: 'kỹ sư', example: ['{私|わたし} は エンジニア です。', 'Tôi là kỹ sư.', 'I am an engineer.'] },
    { surface: '日本', reading: 'にほん', vi: 'Nhật Bản', hanViet: 'NHẬT BẢN', example: ['{日本|にほん} は {大|おお}きい {国|くに} ですか。', 'Nhật Bản có phải là nước lớn không?', 'Is Japan a big country?'] },
    { surface: '日本人', reading: 'にほんじん', vi: 'người Nhật', hanViet: 'NHẬT BẢN NHÂN', example: ['{田中|たなか}さん は {日本人|にほんじん} です。', 'Anh Tanaka là người Nhật.', 'Mr Tanaka is Japanese.'] },
    { surface: 'ベトナム', reading: 'ベトナム', vi: 'Việt Nam', en: 'Vietnam', example: ['{私|わたし} は ベトナム から {来|き}ました。', 'Tôi đến từ Việt Nam.', 'I come from Vietnam.'] },
    { surface: '名前', reading: 'なまえ', vi: 'tên', example: ['お{名前|なまえ} は {何|なん} ですか。', 'Tên bạn là gì?', 'What is your name?'] },
    { surface: 'はい', reading: 'はい', vi: 'vâng, dạ, có', example: ['はい、そう です。', 'Vâng, đúng vậy.', 'Yes, that is right.'] },
    { surface: 'いいえ', reading: 'いいえ', vi: 'không', example: ['いいえ、{学生|がくせい} じゃ ありません。', 'Không, tôi không phải sinh viên.', 'No, I am not a student.'] },
    { surface: '大学', reading: 'だいがく', vi: 'trường đại học', example: ['ここ は {大学|だいがく} です。', 'Đây là trường đại học.', 'This is a university.'] },
    { surface: '友達', reading: 'ともだち', vi: 'bạn bè', example: ['ラン さん は {私|わたし} の {友達|ともだち} です。', 'Chị Lan là bạn của tôi.', 'Lan is my friend.'] },
    { surface: '初めまして', reading: 'はじめまして', vi: 'rất vui được gặp (lần đầu)', example: ['{初|はじ}めまして。 ミン です。', 'Rất vui được gặp anh. Tôi là Minh.', 'Nice to meet you. I am Minh.'] },
    { surface: 'よろしくお願いします', reading: 'よろしくおねがいします', vi: 'rất mong được giúp đỡ', en: 'nice to meet you; please treat me well', example: ['どうぞ よろしくお{願|ねが}いします。', 'Rất mong được anh giúp đỡ.', 'Nice to meet you (please treat me well).'] },
  ],
  grammar: [
    {
      id: 'n5-wa-desu',
      pattern: 'N1 は N2 です',
      meaning: { vi: 'N1 là N2', en: 'N1 is N2' },
      explanation: {
        vi: 'は (đọc là "wa") đánh dấu chủ đề của câu. です đặt cuối câu, làm câu lịch sự. Cấu trúc dùng để nói ai/cái gì là gì.',
        en: 'は (read "wa") marks the topic. です ends the sentence politely. Use it to say what someone or something is.',
      },
      examples: [
        ['{私|わたし} は ミン です。', 'Tôi là Minh.', 'I am Minh.'],
        ['ラン さん は {会社員|かいしゃいん} です。', 'Chị Lan là nhân viên công ty.', 'Lan is a company employee.'],
      ],
      cloze: [
        ['{私|わたし} は {学生|がくせい} です。', 'は', 'Tôi là sinh viên.', 'I am a student.'],
        ['{田中|たなか}さん は {先生|せんせい} です。', 'です', 'Anh Tanaka là giáo viên.', 'Mr Tanaka is a teacher.'],
      ],
    },
    {
      id: 'n5-ja-arimasen',
      pattern: 'N1 は N2 じゃありません',
      meaning: { vi: 'N1 không phải là N2', en: 'N1 is not N2' },
      explanation: {
        vi: 'じゃありません là dạng phủ định lịch sự của です. Trong văn viết trang trọng dùng ではありません.',
        en: 'じゃありません is the polite negative of です. In formal writing use ではありません.',
      },
      examples: [
        ['{私|わたし} は {先生|せんせい} じゃ ありません。', 'Tôi không phải giáo viên.', 'I am not a teacher.'],
        ['ミン さん は {日本人|にほんじん} じゃ ありません。', 'Anh Minh không phải người Nhật.', 'Minh is not Japanese.'],
      ],
      cloze: [
        ['{私|わたし} は {医者|いしゃ} じゃありません。', 'じゃありません', 'Tôi không phải bác sĩ.', 'I am not a doctor.'],
        ['アン さん は エンジニア じゃありません。', 'じゃありません', 'An không phải kỹ sư.', 'An is not an engineer.'],
      ],
    },
    {
      id: 'n5-ka',
      pattern: '〜か',
      meaning: { vi: 'câu hỏi (có phải… không?)', en: 'question marker' },
      explanation: {
        vi: 'Thêm か vào cuối câu để biến thành câu hỏi. Trả lời bằng はい (vâng) hoặc いいえ (không). Không cần dấu "?" trong tiếng Nhật trang trọng.',
        en: 'Add か at the end to make a question. Answer with はい (yes) or いいえ (no). A question mark is not needed in formal Japanese.',
      },
      examples: [
        ['あなた は {学生|がくせい} ですか。', 'Bạn là sinh viên phải không?', 'Are you a student?'],
        ['はい、{学生|がくせい} です。', 'Vâng, tôi là sinh viên.', 'Yes, I am a student.'],
      ],
      cloze: [
        ['ラン さん は {先生|せんせい} ですか。', 'か', 'Chị Lan là giáo viên phải không?', 'Is Lan a teacher?'],
        ['{田中|たなか}さん は {日本人|にほんじん} ですか。', 'か', 'Anh Tanaka là người Nhật phải không?', 'Is Mr Tanaka Japanese?'],
      ],
    },
  ],
  dialogue: [
    ['田中', '{初|はじ}めまして。 {田中|たなか} です。', 'Rất vui được gặp bạn. Tôi là Tanaka.', 'Nice to meet you. I am Tanaka.'],
    ['ミン', '{初|はじ}めまして。 ミン です。 ベトナム から {来|き}ました。', 'Rất vui được gặp anh. Tôi là Minh. Tôi đến từ Việt Nam.', 'Nice to meet you. I am Minh. I come from Vietnam.'],
    ['田中', 'ミン さん は {学生|がくせい} ですか。', 'Anh Minh là sinh viên phải không?', 'Are you a student, Minh?'],
    ['ミン', 'いいえ、{学生|がくせい} じゃ ありません。 エンジニア です。 よろしくお{願|ねが}いします。', 'Không, tôi không phải sinh viên. Tôi là kỹ sư. Rất mong được giúp đỡ.', 'No, I am not a student. I am an engineer. Nice to meet you.'],
  ],
} satisfies LessonSource;

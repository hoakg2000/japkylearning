# 06 – UI / UX

## 1. Nguyên tắc

- **Sáng sủa, hiện đại, ít ma sát.** Mở web là thấy "Hôm nay học gì" + streak.
- **Mobile-first**, dùng 1 tay; desktop có layout 2 cột.
- **Mỗi phiên học ngắn** (5–15 phút), luôn có phản hồi tức thì (màu, âm thanh, animation nhỏ).
- **Nội dung tiếng Nhật là trung tâm**: font lớn, furigana rõ, khoảng cách dòng rộng.

## 2. Design system

- Tokens qua CSS variables trong Tailwind v4 `@theme`: màu, radius, spacing, font, shadow.
- Màu chủ đạo gợi ý: đỏ son Nhật (accent), nền trắng ngà; dark mode nền xanh than. Màu ngữ nghĩa: `success`, `error`, `warning`, `info`, và màu theo cấp JLPT.
- Font: UI `Inter` / `Be Vietnam Pro` (hỗ trợ dấu tiếng Việt tốt); tiếng Nhật `Noto Sans JP` (subset + `next/font`), tùy chọn `Noto Serif JP` cho thẻ kanji.
- Component: shadcn/ui (Button, Card, Dialog, Tabs, Toast, Progress, Tooltip…) + component riêng: `WordCard`, `Ruby`, `KanaGrid`, `StrokeOrder`, `AudioButton`, `StreakFlame`, `QuizOption`, `LyricsLine`.

## 3. Theme & chế độ giao diện

| Trục | Giá trị | Cơ chế |
|------|---------|--------|
| Màu | `light` / `dark` / `system` | `next-themes`, class `dark` |
| Mode | `full` / `minimal` | attribute `data-ui` trên `<html>`, lưu **cookie** để SSR render đúng ngay (không nháy) + `user_settings.ui_mode` |

- **Full:** minh họa, mascot, animation, thanh XP, quest, confetti, gợi ý.
- **Minimal:** chỉ nội dung + điều khiển cần thiết, không animation trang trí, ít màu, mật độ thông tin cao hơn.
- Tailwind custom variant: `@custom-variant minimal ([data-ui="minimal"] &);` → viết `minimal:hidden`, `minimal:p-2`.
- Settings nhanh ở header: theme, mode, ngôn ngữ, âm thanh, toggle furigana/romaji/Hán-Việt.

## 4. Âm thanh action

| Sự kiện | Âm thanh |
|---------|----------|
| Click / chọn đáp án | tick nhẹ |
| Đúng | chime |
| Sai | buzz nhẹ (không gắt) |
| Hoàn thành bài / test | fanfare ngắn |
| Giữ streak / lên cấp | âm thanh đặc biệt |
| Lật thẻ | flip |

- `use-sound`, file ngắn (< 30 KB, `.webm`/`.mp3`), lazy-load sau tương tác đầu tiên.
- Nút mute toàn cục + volume; lưu trong settings.
- Mặc định **tắt** nếu `prefers-reduced-motion: reduce`.
- Âm thanh lấy từ nguồn CC0 hoặc tự tạo; ghi nguồn ở credits.

## 5. Trang chính (sitemap)

```
/[locale]                      Landing (khách) | Dashboard (đã đăng nhập): hôm nay học gì, streak, ôn tập đến hạn
/[locale]/kana                 Bảng hiragana/katakana + quiz
/[locale]/learn/n5             Lộ trình bài học N5
/[locale]/learn/n5/[lesson]    Bài học
/[locale]/kanji, /kanji/[char] Danh sách & chi tiết kanji (SEO)
/[locale]/words/[id]           Chi tiết từ (SEO)
/[locale]/packs/[sector]       Pack ngành nghề
/[locale]/review               Ôn SRS
/[locale]/tests                Kiểm tra, mock N5, test AI
/[locale]/speak                Shadowing / chấm phát âm
/[locale]/songs, /songs/[slug] Học qua bài hát
/[locale]/chat                 AI tutor
/[locale]/me                   Hồ sơ, streak, thống kê, cài đặt
/[locale]/admin                Quản trị (AI provider, nội dung AI, thống kê)
/[locale]/about/credits        Ghi nguồn dataset
/embed/...                     Widget iframe
```

## 6. Accessibility

- WCAG 2.2 AA: contrast, focus ring rõ, target ≥ 44px trên mobile.
- Quiz dùng bàn phím: phím 1–5 chọn đáp án, Enter tiếp, Space lật thẻ.
- `<ruby>` dùng đúng semantics; có `lang="ja"` trên đoạn tiếng Nhật để screen reader đọc đúng.
- Không truyền thông tin chỉ bằng màu (đúng/sai có icon + chữ).
- Tôn trọng `prefers-reduced-motion` và `prefers-color-scheme`.
- Axe check trong Playwright cho mọi trang chính.

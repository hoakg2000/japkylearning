# 06 – UI / UX

> Cập nhật 2026-10-26 theo [review panel](./REVIEW-2026-10-26.md).

## 1. Nguyên tắc

- **Sáng sủa, hiện đại, ít ma sát.** Mở web là thấy "Hôm nay học gì".
- **Mobile-first**, dùng 1 tay: nút chính ghim ở đáy (vùng ngón cái), đáp án ở nửa dưới màn hình. Desktop có layout 2 cột.
- **Phiên học ngắn** (5–15 phút), phản hồi tức thì (màu + icon, âm thanh, animation nhỏ).
- **Nội dung tiếng Nhật là trung tâm:** font lớn, furigana rõ, dòng thoáng.
- **Gamification không dark pattern:** không bán phục hồi streak, không thông báo gây tội lỗi, không league ở v1.

## 2. Design tokens

Tokens qua CSS variables trong Tailwind v4 `@theme`. Đỏ không thể vừa là màu thương hiệu vừa là màu "sai" trong app quiz → brand dùng chàm (藍).

| Token | Light | Dark | Ghi chú |
|-------|-------|------|---------|
| `brand` (藍 chàm) | `#3B4CCA` | `#8B96F0` | Nút chính, link |
| `vermilion` (朱) | `#E8452C` | `#FF7A5C` | Chỉ logo + ăn mừng, không dùng cho chữ |
| `bg` | `#FFFBF5` | `#0F172A` | |
| `surface` | `#FFFFFF` | `#1E293B` | |
| `ink` | `#1F2430` | `#E5E7EB` | |
| `muted` | `#5B6474` | `#94A3B8` | |
| `success` | `#2E9E5B` | `#4ADE80` | |
| `error` | `#C8283C` | `#F87171` | Luôn kèm icon |
| `warning` (streak/XP) | `#F2A900` | `#FBBF24` | |
| `info` | `#2F80ED` | `#60A5FA` | |
| JLPT N5→N1 | xanh lá, teal, xanh dương, tím, hồng đậm | | |

Mọi cặp chữ/nền đạt contrast AA (giá trị dark kiểm lại bằng tool ở Phase 0).

**Font**
- UI: `Be Vietnam Pro` (dấu tiếng Việt tốt), fallback `Inter`.
- Tiếng Nhật: `Noto Sans JP` qua `next/font` (subset); `Noto Serif JP` tùy chọn cho thẻ kanji.

**Component:** shadcn/ui + `WordCard`, `Ruby`, `KanaGrid`, `StrokeOrder`, `AudioButton`, `StreakChip`, `QuizOption`, `LyricsLine`, `TodayCard`, `BottomNav`.

## 3. Typography Việt + Nhật

- Mọi đoạn tiếng Nhật có `lang="ja"` và font stack JP đặt trước. Nếu không, Windows dùng glyph Trung Quốc (thống nhất Hán tự), ví dụ 直, 骨 hiện sai nét.
- Dấu tiếng Việt chồng (ệ, ỗ): `line-height` ≥ 1.6. Dòng có ruby: ~2.0.
- Furigana ≥ 11px trên mobile.
- Bật/tắt furigana không làm nhảy layout: giữ chỗ cho ruby, đổi `visibility`.

## 4. Theme & chế độ giao diện

| Trục | Giá trị | Cơ chế |
|------|---------|--------|
| Màu | `light` / `dark` / `system` | `next-themes`, class `dark` |
| Mode | `full` / `minimal` | attribute `data-ui` trên `<html>`, đặt bằng **script inline trước paint** đọc localStorage (giống cách next-themes làm). Server không đọc cookie → trang public vẫn SSG. Người dùng đăng nhập: đồng bộ với `user_settings.ui_mode` |

Tailwind: `@custom-variant minimal ([data-ui="minimal"] &);` → `minimal:hidden`, `minimal:p-2`.

**5 khác biệt cụ thể Full vs Minimal**

| # | Khía cạnh | Full | Minimal |
|---|-----------|------|---------|
| 1 | Màn hình Today | Mascot, streak flame, thẻ gợi ý có minh họa | 1 dòng: "23 thẻ đến hạn · Bài 4 · 12🔥" + nút Tiếp tục |
| 2 | Phản hồi đúng | Confetti nhỏ + hiệu ứng phóng | Chỉ màu + icon |
| 3 | Mật độ | Radius 16, spacing ×1.25 | Radius 8, spacing ×0.85 |
| 4 | WordCard mặc định | Density `standard` | Density `basic` |
| 5 | XP | Thanh XP + toast huy hiệu | Ẩn XP (vẫn tính), chỉ hiện số streak |

`prefers-reduced-motion: reduce` → mặc định Minimal (người dùng vẫn đổi được).

**Motion**
- Thời lượng: 120ms (micro), 200ms (component), 320ms (ăn mừng). Easing `cubic-bezier(.2,.8,.2,1)`.
- Chỉ animate `transform` và `opacity`.
- Lật thẻ 300ms; reduced-motion → crossfade.
- Không rung lắc khi sai.
- Trang public dùng CSS + View Transitions, không tải thư viện animation.

## 5. Âm thanh action

Một sprite < 60 KB, cùng 1 giọng ngũ cung, chuẩn hóa −16 LUFS, âm lượng mặc định 60%, phát bằng Web Audio, tải sau tương tác đầu tiên.

| Sự kiện | Âm thanh |
|---------|----------|
| Click / chọn | Tiếng mõ gỗ (拍子木), 30ms |
| Đúng | 2 nốt marimba đi lên |
| Sai | 1 nốt trầm, mềm (không buzz) |
| Lật thẻ | Tiếng giấy |
| Hoàn thành bài / test | Arpeggio 3 nốt |
| Giữ streak / mốc | Chuông gió (風鈴) |

- **Âm thanh tách khỏi reduced-motion**: đó là 2 sở thích khác nhau. Mặc định bật sau tương tác đầu tiên; nút mute ở header; lưu trong settings.
- Rung nhẹ (`navigator.vibrate`) trên Android khi đúng/sai, tắt được.
- Nguồn âm: tự tạo hoặc CC0; ghi nguồn ở credits.

## 6. Luồng chính

**First-run** ([F0](./02-FEATURES.md#f0-first-run-onboarding--màn-hình-today)): landing → quiz 5 câu → 3 câu onboarding → bài đầu tiên. Đăng ký, cổng tuổi, consent chỉ hiện khi "Lưu tiến độ".

**Today:** 1 nút "Tiếp tục" + tối đa 3 thẻ. Hết việc → trạng thái hoàn thành có lời khen, không phải trang trống.

**Bài học:** 6–8 bước, thanh tiến độ, tự lưu, tiếp tục giữa bài, nút chính ghim đáy.

**Điều hướng mobile:** bottom nav 4 tab **Hôm nay / Học / Ôn / Tôi**. "Học" chứa: Kana, Bài học, Kanji, Pack ngành, Bài hát, Chat AI, Luyện nói.

## 7. Sitemap

```
(public – SSG, không cookie)
/[locale]                      Landing + quiz first-run
/[locale]/kana                 Bảng kana + quiz
/[locale]/learn/n5             Lộ trình N5
/[locale]/learn/n5/[lesson]    Bài học (tiến độ tải bằng client island)
/[locale]/kanji, /kanji/[char] Kanji (SEO)
/[locale]/words/[id]           Từ (SEO)
/[locale]/packs/[sector]       Pack ngành
/[locale]/songs, /songs/[slug] Bài hát
/[locale]/about, /about/credits, /privacy, /terms

(app – PPR + dữ liệu động, noindex)
/[locale]/home                 Today
/[locale]/review               Ôn SRS
/[locale]/tests                Kiểm tra, mock, test AI
/[locale]/speak                Luyện nói (beta)
/[locale]/chat                 AI tutor (beta)
/[locale]/my-songs             v2: dán link YouTube, trạng thái xử lý, thư viện bài của tôi
/[locale]/me                   Hồ sơ, streak, thống kê, cài đặt, consent, xuất/xóa dữ liệu
/[locale]/admin                AI provider, voice allowlist, kill-switch, review nội dung AI, audit log

/embed/kanji/[char]            Widget
```

## 8. Accessibility

- WCAG 2.2 AA: contrast, focus ring rõ, target ≥ 44px trên mobile.
- Quiz bằng bàn phím: phím 1–5 chọn, Enter tiếp, Space lật thẻ.
- `<ruby>` đúng semantics, `lang="ja"`.
- Không truyền thông tin chỉ bằng màu.
- Tôn trọng `prefers-reduced-motion` và `prefers-color-scheme`.
- Axe check trong Playwright cho mọi trang chính, cả 2 locale, cả Full và Minimal.

# ADR 0004 – AI provider abstraction, mock-first

- **Trạng thái:** Accepted (2026-10-26)

## Bối cảnh
Chủ dự án muốn đổi được giữa Gemini, ChatGPT, Claude, MotAPI, GitHub Copilot – qua admin dashboard hoặc lúc build. Hiện tại dùng mock; tương lai nối **universal AI gateway** tự phát triển (SDK hoặc REST).

## Quyết định
- Interface `AiProvider { id, chat() (stream), generateObject() }` trong `src/lib/ai/`.
- Registry chọn provider **theo mode** (`tutor`, `quiz-gen`, `grading`, `adaptive`): `app_settings` (admin) → env `AI_PROVIDER` → `mock`.
- Adapter đầu tiên: `mock` (fixtures deterministic) và `gateway` (stub). Adapter `openai-compatible` (ChatGPT, MotAPI), `gemini`, `claude` thêm sau.
- Feature code chỉ gọi registry, không import SDK provider trực tiếp.

## Hệ quả
- (+) Phát triển và test toàn bộ tính năng AI không tốn tiền, CI ổn định.
- (+) Nối gateway riêng chỉ là thêm/hoàn thiện 1 adapter.
- (−) Không tận dụng được tính năng riêng của từng provider ngoài interface chung.
- GitHub Copilot chưa có API công khai cho bên thứ ba – dự kiến đi qua gateway.

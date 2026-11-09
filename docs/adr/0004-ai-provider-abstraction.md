# ADR 0004 – AI provider abstraction, mock-first

- **Trạng thái:** Superseded by [ADR 0010](./0010-ai-provider-strategy.md) (2026-10-26)

## Bối cảnh
Chủ dự án muốn đổi được AI provider qua admin dashboard hoặc lúc build, dùng mock trước và nối universal AI gateway tự phát triển sau.

## Quyết định (bản gốc)
- Interface `AiProvider { id, chat() (stream), generateObject() }` trong `src/lib/ai/`.
- Registry chọn provider theo mode: `app_settings` (admin) → env `AI_PROVIDER` → `mock`.
- Feature code chỉ gọi registry.

Interface và registry vẫn giữ. Danh sách adapter và cách xử lý GitHub Copilot, MotAPI được sửa ở [ADR 0010](./0010-ai-provider-strategy.md).

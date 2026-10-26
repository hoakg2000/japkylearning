# ADR 0010 – Chiến lược AI provider

- **Trạng thái:** Accepted (2026-10-26). Thay [ADR 0004](./0004-ai-provider-abstraction.md)

## Bối cảnh
Chủ dự án yêu cầu đổi được giữa Gemini, ChatGPT, Claude, MotAPI, GitHub Copilot qua admin hoặc env; mock trước; sau này nối universal AI gateway tự làm. Review panel phát hiện:
- GitHub Copilot không có API được phép cho ứng dụng bên thứ ba; proxy dùng token Copilot có rủi ro vi phạm ToS/AUP và bị khóa tài khoản.
- OpenAI, Gemini, MotAPI, GitHub Models đều có endpoint OpenAI-compatible → 1 adapter là đủ.
- MotAPI là processor chưa kiểm chứng.

## Quyết định
- Interface `AiProvider` + registry theo mode: `app_settings` → env → `mock`.
- 3 adapter: **`mock`**, **`openai-compatible`** (preset: openai, gemini, claude, motapi, github-models), **`gateway`** (stub).
- **Copilot → GitHub Models** (`https://models.github.ai/inference`).
- **Giữ MotAPI** theo quyết định của chủ dự án, với điều kiện không gửi PII.
- `app_settings` chỉ chọn preset đã có key trong env; không lưu URL/key.
- Kill-switch theo ngân sách ngày; quota theo user; preview deploy luôn dùng `mock`.

## Hệ quả
- (+) Ít code, vẫn đáp ứng yêu cầu đổi provider; nối gateway chỉ là thêm preset hoặc hoàn thiện stub.
- (−) Không dùng được tính năng riêng của từng provider ngoài chuẩn OpenAI.

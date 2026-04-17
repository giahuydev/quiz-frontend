# Quiz Online — Tài liệu hệ thống

> Hệ thống thi trắc nghiệm trực tuyến  
> Stack: NextJS 14 + NestJS + TypeORM + MySQL + Socket.IO

---

## 1. Vai trò trong hệ thống

Hệ thống có 2 vai trò chính, không có tài khoản Admin riêng — mọi quản trị đều thực hiện trực tiếp qua database hoặc qua tài khoản Teacher.

| Vai trò | Mô tả | Đăng ký |
|---|---|---|
| **TEACHER** (Giảng viên) | Quản lý lớp học, câu hỏi, đề thi, kỳ thi | Tự đăng ký, chọn role khi tạo tài khoản |
| **STUDENT** (Sinh viên) | Tham gia lớp, vào phòng chờ, thi, xem kết quả | Tự đăng ký, chọn role khi tạo tài khoản |

---

## 2. Chức năng theo vai trò

### 2.1 Giảng viên (TEACHER)

#### Quản lý tài khoản
- Đăng ký tài khoản với role TEACHER
- Đăng nhập, nhận JWT token
- Xem thông tin tài khoản hiện tại

#### Quản lý lớp học
- Tạo lớp học mới — backend tự sinh `class_code`
- Xem danh sách lớp học của mình
- Xem chi tiết lớp (thành viên, thông báo)
- Xoá lớp học
- Xoá sinh viên khỏi lớp
- Đăng thông báo trong lớp
- Xem danh sách thông báo

#### Quản lý câu hỏi
- Xem danh sách câu hỏi (chỉ thấy câu hỏi do mình tạo)
- Thêm câu hỏi thủ công (nội dung + 4 đáp án A/B/C/D + đáp án đúng)
- Sửa câu hỏi
- Xoá câu hỏi
- Import hàng loạt từ file Excel (.xlsx)

#### Quản lý đề thi
- Xem danh sách đề thi
- Tạo đề thi — chọn câu hỏi từ ngân hàng hoặc import Excel
- Cấu hình xáo trộn thứ tự câu hỏi và đáp án
- Xem chi tiết đề thi
- Cập nhật đề thi (chỉ khi status = DRAFT)
- Xoá đề thi

#### Quản lý kỳ thi
- Tạo kỳ thi — chọn đề thi, lớp học, đặt lịch giờ
- Cấu hình `waiting_start_time`, `start_time`, `end_time`
- Chọn hình thức: LIVE (thi trực tiếp) hoặc ASSIGNED (giao bài có deadline)
- Xem danh sách kỳ thi
- Theo dõi phòng chờ (danh sách sinh viên đã check-in)
- Xem bảng kết quả kỳ thi — điểm, vi phạm, trạng thái từng sinh viên

---

### 2.2 Sinh viên (STUDENT)

#### Quản lý tài khoản
- Đăng ký tài khoản với role STUDENT
- Đăng nhập, nhận JWT token
- Xem thông tin tài khoản hiện tại

#### Quản lý lớp học
- Tham gia lớp bằng `class_code` do giảng viên cung cấp
- Xem danh sách lớp đã tham gia
- Xem thông báo trong lớp
- Nhập `access_code` để vào phòng chờ kỳ thi

#### Tham gia kỳ thi
- Nhập `access_code` → check-in phòng chờ
- Chờ đếm ngược đến giờ thi trong phòng chờ
- Vào phòng thi khi đến `start_time`
- Làm bài trắc nghiệm — chọn đáp án, điều hướng giữa các câu
- Nộp bài thủ công hoặc tự động khi hết giờ
- Hệ thống phát hiện vi phạm: chuyển tab, thoát fullscreen

#### Xem kết quả
- Xem điểm số sau khi nộp bài
- Xem lại từng câu hỏi: đáp án đã chọn, đáp án đúng, đúng/sai
- Xem thống kê vi phạm (tab switch, fullscreen exit, disconnected)

---

## 3. API Endpoints

### 3.1 Auth — Xác thực

| Method | Endpoint | Mô tả | Ai dùng |
|---|---|---|---|
| POST | `/auth/register` | Đăng ký tài khoản, chọn role TEACHER/STUDENT | Public |
| POST | `/auth/login` | Đăng nhập, trả về `access_token` | Public |
| GET | `/auth/me` | Lấy thông tin user hiện tại từ JWT | Teacher, Student |

---

### 3.2 Lớp học — Classes

| Method | Endpoint | Mô tả | Ai dùng |
|---|---|---|---|
| POST | `/classes` | Tạo lớp học mới, backend tự sinh `class_code` | **Teacher** |
| GET | `/classes` | Danh sách lớp của giảng viên | **Teacher** |
| GET | `/classes/:id` | Chi tiết một lớp học | **Teacher** |
| DELETE | `/classes/:id` | Xoá lớp học | **Teacher** |
| GET | `/classes/:id/members` | Danh sách sinh viên trong lớp | **Teacher** |
| DELETE | `/classes/:id/members/:studentId` | Xoá sinh viên khỏi lớp | **Teacher** |
| POST | `/classes/join` | Sinh viên nhập `class_code` tham gia lớp | **Student** |
| GET | `/classes/joined` | Danh sách lớp sinh viên đã tham gia | **Student** |
| POST | `/classes/:id/announcements` | Đăng thông báo trong lớp | **Teacher** |
| GET | `/classes/:id/announcements` | Danh sách thông báo của lớp | Teacher, Student |

---

### 3.3 Câu hỏi — Questions

| Method | Endpoint | Mô tả | Ai dùng |
|---|---|---|---|
| GET | `/questions` | Danh sách câu hỏi (chỉ thấy câu hỏi của mình) | **Teacher** |
| POST | `/questions` | Tạo câu hỏi thủ công | **Teacher** |
| PUT | `/questions/:id` | Cập nhật câu hỏi | **Teacher** |
| DELETE | `/questions/:id` | Xoá câu hỏi | **Teacher** |
| POST | `/questions/import` | Import từ file Excel — `multipart/form-data` | **Teacher** |

---

### 3.4 Đề thi — Exams

| Method | Endpoint | Mô tả | Ai dùng |
|---|---|---|---|
| GET | `/exams` | Danh sách đề thi của giảng viên | **Teacher** |
| POST | `/exams` | Tạo đề thi, gán câu hỏi, cấu hình shuffle | **Teacher** |
| GET | `/exams/:id` | Chi tiết đề thi kèm danh sách câu hỏi | **Teacher** |
| PUT | `/exams/:id` | Cập nhật đề thi (chỉ khi status = DRAFT) | **Teacher** |
| DELETE | `/exams/:id` | Xoá đề thi | **Teacher** |

---

### 3.5 Kỳ thi & Phòng chờ — Sessions

| Method | Endpoint | Mô tả | Ai dùng |
|---|---|---|---|
| POST | `/sessions` | Tạo kỳ thi (exam_id, class_id, lịch giờ, mode) | **Teacher** |
| GET | `/sessions` | Danh sách kỳ thi đã tổ chức | **Teacher** |
| GET | `/sessions/:id` | Chi tiết kỳ thi | **Teacher** |
| POST | `/sessions/join` | Nhập `access_code`, check-in phòng chờ | **Student** |
| GET | `/sessions/:id/waiting` | Danh sách sinh viên đã check-in phòng chờ | **Teacher** |
| POST | `/sessions/:id/start-attempt` | Tạo lượt thi khi đến giờ, nhận đề đã shuffle | **Student** |
| GET | `/sessions/:id/results` | Bảng điểm toàn kỳ thi | **Teacher** |

---

### 3.6 Kết quả & Chấm điểm — Results

| Method | Endpoint | Mô tả | Ai dùng |
|---|---|---|---|
| GET | `/results/:id` | Trạng thái lượt thi — dùng khi reconnect | **Student** |
| POST | `/results/:id/submit` | Nộp bài — backend chấm điểm | **Student** |
| GET | `/results/:id/review` | Xem lại từng câu: đúng/sai, đáp án đúng | **Student** |

---

## 4. WebSocket Events

### 4.1 Waiting Gateway — namespace `/waiting`

| Event | Hướng | Mô tả | Ai dùng |
|---|---|---|---|
| `join-waiting` | Client → Server | Sinh viên vào phòng chờ, server thêm vào room `waiting-{sessionId}` | **Student** |
| `exam-started` | Server → Client | Broadcast khi đến `start_time` — client chuyển sang phòng thi | **Student** |

---

### 4.2 Exam Gateway — namespace `/exam`

| Event | Hướng | Mô tả | Ai dùng |
|---|---|---|---|
| `join-exam` | Client → Server | Sinh viên vào phòng thi, server thêm vào room `exam-{resultId}` | **Student** |
| `save-answer` | Client → Server | Gửi đáp án vừa chọn `{questionId, answer}` — lưu ngay vào DB | **Student** |
| `violation` | Client → Server | Ghi vi phạm `{type: 'tab_switch' \| 'fullscreen_exit'}` | **Student** |
| `ping` | Client → Server | Heartbeat mỗi 20s — server cập nhật `last_heartbeat_at` | **Student** |
| `pong` | Server → Client | Phản hồi ping — xác nhận kết nối còn sống | **Student** |
| `force-submit` | Server → Client | Bài đã bị nộp (hết giờ / disconnected lần 2 / mất kết nối > 2 phút) | **Student** |
| `time-warning` | Server → Client | Cảnh báo còn 5 phút làm bài | **Student** |
| `onDisconnect` | Hệ thống | Mất kết nối — ghi `disconnected_at`, xử lý `disconnected_count` | Hệ thống |
| `onConnect` | Hệ thống | Reconnect — kiểm tra trạng thái, cho tiếp hoặc force-submit | Hệ thống |

---

## 5. Logic xử lý đặc biệt

### 5.1 Cơ chế phòng thi

```
8h30 → Mở phòng chờ (waiting_start_time)
         Sinh viên vào phòng chờ bằng access_code
         Chỉ sinh viên trong class_members mới được vào

9h00 → Bắt đầu thi (start_time)
         Broadcast event exam-started
         Sinh viên trong phòng chờ mới được vào phòng thi
         Sinh viên đến muộn KHÔNG được vào

10h00 → Kết thúc (end_time)
          Tất cả bài thi tự động nộp
```

---

### 5.2 Xử lý mất kết nối (Disconnect)

```
Sinh viên mất kết nối
        ↓
onDisconnect() → ghi disconnected_at, tăng disconnected_count
        ↓
Lần 1 + thời gian ≤ 2 phút  → Cho phép reconnect, tiếp tục thi
Lần 1 + thời gian > 2 phút  → Force submit ngay
Lần 2 bất kể thời gian       → Force submit ngay
```

---

### 5.3 Chống gian lận

| Vi phạm | Cơ chế phát hiện | Lưu vào |
|---|---|---|
| Chuyển tab | `visibilitychange` event | `tab_switch_count` |
| Thoát fullscreen | `fullscreenchange` event | `fullscreen_exit_count` |
| Mất kết nối | `onDisconnect` WebSocket | `disconnected_count` |

---

### 5.4 Heartbeat — Zombie connection

- Client gửi `ping` mỗi **20 giây**
- Server cập nhật `last_heartbeat_at`
- Scheduler chạy `@Cron` mỗi **30 giây** quét các kết nối có `last_heartbeat_at > 60 giây`
- Kết nối zombie → force submit

---

### 5.5 Shuffle câu hỏi và đáp án

- Khi sinh viên gọi `POST /sessions/:id/start-attempt`:
  - Backend shuffle thứ tự câu hỏi (nếu `shuffle_questions = true`)
  - Backend shuffle thứ tự đáp án (nếu `shuffle_options = true`)
  - Lưu thứ tự vào `exam_result_questions.option_order` (VD: `"C,A,D,B"`)
- Khi chấm điểm: dùng `option_order` để map lại đáp án đúng

---

## 6. Tóm tắt số lượng

| Loại | Số lượng |
|---|---|
| REST Endpoints | 30 |
| WebSocket Events | 10 |
| Bảng database | 12 |
| Vai trò | 2 (Teacher, Student) |

---

*Tài liệu được tổng hợp từ quá trình phân tích và phát triển dự án Quiz Online.*
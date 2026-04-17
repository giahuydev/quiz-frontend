export const MOCK_DATA = {
  stats: [
    { label: 'Lớp học', value: 12 },
    { label: 'Câu hỏi', value: 150 },
    { label: 'Đề thi',  value: 8 },
    { label: 'Kỳ thi',  value: 5 },
  ],
  classes: [
    { id: 1, name: 'Lập trình Web nâng cao', class_code: 'WEB2024', created_at: new Date() },
    { id: 2, name: 'Cấu trúc dữ liệu & Giải thuật', class_code: 'DSA001', created_at: new Date() },
  ],
  questions: [
    { 
      id: 1, 
      content: 'Giao thức nào được sử dụng để truyền tải trang web?', 
      option_a: 'FTP', option_b: 'HTTP', option_c: 'SMTP', option_d: 'SSH', 
      correct_answer: 'B', created_at: new Date() 
    },
    { 
      id: 2, 
      content: 'Thành phần nào của CSS dùng để tạo khoảng cách bên trong một phần tử?', 
      option_a: 'Margin', option_b: 'Border', option_c: 'Padding', option_d: 'Display', 
      correct_answer: 'C', created_at: new Date() 
    }
  ],
  examResult: {
    score: 8.5,
    correct_answers: 17,
    total_questions: 20,
    violations_count: 0,
    duration_seconds: 1200,
    questions: [
      { id: 1, content: 'HTML là gì?', option_a: 'Ngôn ngữ lập trình', option_b: 'Ngôn ngữ đánh dấu', option_c: 'CSDL', option_d: 'Hệ điều hành', student_answer: 'B', correct_answer: 'B' },
      { id: 2, content: 'CSS là gì?', option_a: 'Style sheet', option_b: 'Script', option_c: 'Server', option_d: 'Socket', student_answer: 'C', correct_answer: 'A' },
    ]
  },
  session: {
    access_code: 'TEST99',
    duration_minutes: 60,
    start_time: new Date(Date.now() + 300000).toISOString(), // 5 phút nữa bắt đầu
    exam: { title: 'KIỂM TRA CUỐI KỲ' }
  }
};

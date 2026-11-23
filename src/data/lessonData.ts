import type {
  BehaviorItem,
  GroupTask,
  LeafMeasure,
  QuizQuestion,
  ScenarioCase,
  ScheduleSlot,
} from '../types/lesson';

export const STAGE_TITLES = [
  'Khởi động & mục tiêu',
  'Khám phá',
  'Nhóm chat tử tế',
  'Phòng thử thách',
  'Nên hay không nên',
  'Hồi sinh cây',
  'Kiểm tra',
  'Sản phẩm và kết quả',
  'Bảng Vàng vinh danh',
] as const;

export const LESSON_OBJECTIVES: string[] = [
  'Giao tiếp qua mạng đúng quy tắc, dùng ngôn ngữ lịch sự và ứng xử có văn hóa.',
  'Nêu ví dụ truy cập không hợp lệ; biết xử lí nội dung xấu, không phù hợp lứa tuổi.',
  'Nêu tác hại của nghiện Internet và đề xuất cách phòng tránh.',
  'Biết nhờ người lớn giúp đỡ, tư vấn khi cần thiết.',
];

export const RULES_5T: Array<{ title: string; description: string }> = [
  { title: 'Tôn trọng', description: 'Lắng nghe ý kiến khác biệt; tôn trọng quyền riêng tư.' },
  { title: 'Tử tế', description: 'Nói lời lịch sự; đồng cảm và giúp đỡ bạn.' },
  { title: 'Thận trọng', description: 'Bảo vệ tài khoản, cân nhắc trước khi nhấn gửi.' },
  { title: 'Tra cứu', description: 'Kiểm tra nguồn và đối chiếu trước khi chia sẻ.' },
  { title: 'Trách nhiệm', description: 'Chịu trách nhiệm về nội dung và hành động của mình.' },
];

export const RULES_5K: string[] = [
  'nói những từ ngữ gây xúc phạm và ảnh hưởng đến nhân phẩm, danh dự của người khác.',
  'đùa cợt quá đáng khi đăng ảnh của một người khác lên mạng.',
  'nói xấu, nói bậy gây ảnh hưởng đến hình ảnh của người khác.',
  'chia sẻ những thông tin sai sự thật, chưa qua kiểm chứng và những thông tin xấu, tin độc.',
  'ấn nút like hay share đối với những tin xấu, tin độc, tin phản cảm gây ảnh hưởng đến hình ảnh của người khác.',
];

export const SELF_ASSESSMENT_ITEMS: string[] = [
  'Em biết giao tiếp lịch sự và tôn trọng người khác trên mạng.',
  'Em không bình luận xúc phạm hoặc chế giễu người khác.',
  'Em không tự ý truy cập tài khoản của người khác.',
  'Em biết đóng trang web có nội dung xấu, không phù hợp.',
  'Em biết nhờ người lớn giúp đỡ khi gặp vấn đề trên mạng.',
  'Em biết kiểm soát thời gian sử dụng Internet.',
  'Em biết sử dụng AI để tham khảo và kiểm chứng thông tin.',
  'Em có trách nhiệm với nội dung mình đăng tải.',
];

export const SCENARIO_CASES: ScenarioCase[] = [
  {
    q: 'Trong nhóm chat, có bạn tung tin đồn về An rồi nhắn “Share nhanh!”. An rất buồn. Em sẽ phản hồi thế nào?',
    a: [
      'Chia sẻ tiếp vì nhiều bạn đã chia sẻ.',
      'Nhắc dừng lan truyền, kiểm chứng thông tin, động viên An và nhờ thầy cô hỗ trợ.',
      'Im lặng và để An tự giải quyết.',
    ],
    ok: 1,
    e: 'Không hùa theo hay lan truyền tin chưa kiểm chứng. Người ở phía bên kia màn hình có cảm xúc thật; hãy giúp bạn tìm người lớn đáng tin cậy.',
  },
  {
    q: 'Máy tính bất ngờ mở một trang có video bạo lực, không phù hợp lứa tuổi. Em nên làm gì?',
    a: [
      'Đóng ngay trang đó và nhờ người lớn hỗ trợ ngăn chặn nội dung xấu.',
      'Gửi đường dẫn cho cả lớp cùng xem.',
      'Xem tiếp để biết chuyện gì xảy ra.',
    ],
    ok: 0,
    e: 'Đóng ngay nội dung không phù hợp. Không phát tán; hỏi người lớn khi cần, nhờ hỗ trợ cài công cụ chặn trang xấu.',
  },
  {
    q: 'Bạn quên đăng xuất thư điện tử trên máy dùng chung. Em muốn mở thư của bạn để đọc.',
    a: [
      'Đọc nhanh vì tài khoản đang mở sẵn.',
      'Chụp lại thư để kể cho nhóm bạn.',
      'Không đọc; nhắc bạn đăng xuất và bảo vệ tài khoản.',
    ],
    ok: 2,
    e: 'Đọc thư người khác khi chưa được phép là truy cập không hợp lệ, xâm phạm riêng tư. Tài khoản mở sẵn không có nghĩa là em được quyền sử dụng.',
  },
];

export const BEHAVIORS: BehaviorItem[] = [
  {
    text: 'Tôn trọng người có ý kiến khác mình.',
    shouldDo: true,
    explanation: 'Bất đồng ý kiến vẫn cần lịch sự.',
  },
  {
    text: 'Giấu bố mẹ khi bị đe dọa trên mạng.',
    shouldDo: false,
    explanation: 'Hãy chia sẻ với bố mẹ, thầy cô hoặc người lớn đáng tin cậy.',
  },
  {
    text: 'Dùng từ ngữ, biểu tượng văn minh.',
    shouldDo: true,
    explanation: 'Lời nói trên mạng cần thể hiện sự tôn trọng.',
  },
  {
    text: 'Giữ kín mật khẩu, bảo vệ tài khoản.',
    shouldDo: true,
    explanation: 'Không cung cấp mật khẩu cho người khác.',
  },
  {
    text: 'Nói xấu, chế giễu bạn trong nhóm chat.',
    shouldDo: false,
    explanation: 'Có thể gây tổn thương thật cho người bị trêu chọc.',
  },
  {
    text: 'Nhờ thầy cô giúp khi bị bắt nạt.',
    shouldDo: true,
    explanation: 'Không nên im lặng chịu đựng.',
  },
  {
    text: 'Đăng ảnh riêng của bạn khi chưa xin phép.',
    shouldDo: false,
    explanation: 'Cần được bạn đồng ý trước khi đăng.',
  },
  {
    text: 'Bỏ học, thức khuya để chơi trực tuyến.',
    shouldDo: false,
    explanation: 'Dùng mạng quá mức ảnh hưởng học tập và sinh hoạt.',
  },
  {
    text: 'Tự chủ thời gian sử dụng Internet.',
    shouldDo: true,
    explanation: 'Cân bằng học tập, nghỉ ngơi và giao tiếp trực tiếp.',
  },
  {
    text: 'Tự ý đọc hộp thư điện tử của người khác.',
    shouldDo: false,
    explanation: 'Tôn trọng quyền riêng tư và quyền truy cập.',
  },
];

export const LEAF_MEASURES: LeafMeasure[] = [
  {
    title: 'Chia sẻ',
    description: 'Tâm sự thường xuyên với bố mẹ, thầy cô hoặc người mình tin tưởng.',
  },
  {
    title: 'Rời xa',
    description: 'Hạn chế thiết bị kết nối Internet trong phòng riêng; dùng máy ở nơi sinh hoạt chung.',
  },
  {
    title: 'Giới hạn',
    description: 'Lập kế hoạch, dùng công cụ giới hạn thời gian sử dụng Internet phù hợp.',
  },
  {
    title: 'Theo đuổi',
    description: 'Đọc sách, chơi thể thao, gặp gỡ bạn bè và tham gia hoạt động thực tế.',
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: 'Khi bất đồng với bạn trong nhóm lớp, em nên:',
    options: [
      'Góp ý vào vấn đề bằng lời lịch sự.',
      'Chê bai con người của bạn.',
      'Dùng tài khoản ẩn danh để nói xấu.',
    ],
    correctIndices: [0],
    explanation: 'Ẩn danh không làm mất trách nhiệm. Hãy góp ý rõ ràng và tôn trọng.',
  },
  {
    question: 'Những hành vi nào là truy cập không hợp lệ? (Chọn tất cả đáp án đúng)',
    options: [
      'Đọc thư riêng của bạn khi chưa được phép.',
      'Xem trang học tập công khai phù hợp lứa tuổi.',
      'Dùng tài khoản của người khác khi chưa được đồng ý.',
    ],
    correctIndices: [0, 2],
    explanation: 'Chỉ truy cập tài khoản, dữ liệu khi được phép.',
  },
  {
    question: 'Khi vô tình gặp nội dung xấu, em cần: (Chọn tất cả đáp án đúng)',
    options: [
      'Đóng trang đó.',
      'Chia sẻ cho bạn xem thử.',
      'Nhờ người lớn hỗ trợ ngăn chặn.',
    ],
    correctIndices: [0, 2],
    explanation: 'Không tiếp tục xem hoặc phát tán nội dung xấu.',
  },
  {
    question: 'Cách phù hợp khi em bị bắt nạt trên mạng là:',
    options: [
      'Đe dọa lại người đó.',
      'Nhờ bố mẹ, thầy cô giúp đỡ và tư vấn.',
      'Cố chịu đựng một mình.',
    ],
    correctIndices: [1],
    explanation: 'Tìm sự giúp đỡ là cách bảo vệ mình.',
  },
  {
    question: 'Biểu hiện nào cho thấy việc dùng mạng đang ảnh hưởng cuộc sống? (Chọn tất cả đáp án đúng)',
    options: [
      'Bỏ bê học tập để lên mạng.',
      'Cáu gắt khi không được dùng mạng.',
      'Tham gia thể thao và sinh hoạt gia đình đều đặn.',
    ],
    correctIndices: [0, 1],
    explanation: 'Cần chú ý khi dùng mạng gây ảnh hưởng học tập, tâm trạng và quan hệ.',
  },
  {
    question: 'Tác hại của nghiện Internet có thể gồm: (Chọn tất cả đáp án đúng)',
    options: [
      'Giảm tập trung, kết quả học tập sa sút.',
      'Sức khỏe và giao tiếp trực tiếp bị ảnh hưởng.',
      'Luôn học tốt hơn vì lên mạng nhiều.',
    ],
    correctIndices: [0, 1],
    explanation: 'SGK nêu ảnh hưởng đến sức khỏe thể chất, tinh thần, học tập và giao tiếp.',
  },
  {
    question: 'Hai hoạt động cần đặc biệt tự chủ để tránh sử dụng quá mức là:',
    options: [
      'Trò chơi trực tuyến và mạng xã hội.',
      'Chỉ thư điện tử và tra cứu từ điển.',
      'Mọi hoạt động trên mạng đều gây nghiện như nhau.',
    ],
    correctIndices: [0],
    explanation: 'Chơi trực tuyến, mạng xã hội dễ kéo dài thời gian sử dụng; cần chủ động quản lí.',
  },
  {
    question: 'Biện pháp phòng tránh phù hợp là: (Chọn tất cả đáp án đúng)',
    options: [
      'Dùng máy tính ở không gian sinh hoạt chung.',
      'Giới hạn thời gian, theo đuổi thể thao và sở thích ngoài mạng.',
      'Giấu gia đình về thời gian sử dụng.',
    ],
    correctIndices: [0, 1],
    explanation: 'Ghi nhớ: Chia sẻ – Rời xa – Giới hạn – Theo đuổi.',
  },
];

export const GROUP_TASKS: GroupTask[] = [
  {
    name: 'TÔN TRỌNG',
    topic: 'Tôn trọng người khác',
    task: 'Ứng xử lịch sự trên mạng',
    caseText:
      'Trong nhóm chat lớp, một bạn đưa ra ý kiến khác với em về một vấn đề học tập. Một số bạn không đồng tình và bắt đầu dùng những lời lẽ thiếu lịch sự để phản đối.',
    challenges: [
      'Chỉ ra những hành vi chưa phù hợp trong tình huống.',
      'Đề xuất cách phản hồi thể hiện sự tôn trọng người khác.',
      'Viết 3 nguyên tắc giao tiếp lịch sự trên mạng.',
    ],
    products: [
      '3 nguyên tắc ứng xử.',
      '1 câu bình luận mẫu thể hiện sự tôn trọng.',
      'Một thông điệp ngắn của nhóm.',
    ],
  },
  {
    name: 'TỬ TẾ',
    topic: 'Lan tỏa sự tử tế',
    task: 'Nói lời hay – Làm việc tốt',
    caseText:
      'Một bạn trong lớp bị một số người chế giễu, bình luận ác ý trên mạng xã hội. Bạn ấy cảm thấy buồn và không muốn tham gia các hoạt động của lớp.',
    challenges: [
      'Theo em, hành vi trên có thể gây ra những ảnh hưởng gì?',
      'Em sẽ làm gì để giúp đỡ bạn?',
      'Hãy đề xuất 3 hành động lan tỏa sự tử tế trên mạng.',
    ],
    products: [
      '3 hành động tử tế.',
      'Một lời động viên dành cho bạn.',
      'Một khẩu hiệu tuyên truyền.',
    ],
  },
  {
    name: 'THẬN TRỌNG',
    topic: 'Bảo vệ bản thân',
    task: 'Cảnh giác khi tham gia Internet',
    caseText:
      'Một người lạ gửi tin nhắn cho em với nội dung: “Bạn đã trúng thưởng một chiếc điện thoại. Hãy nhấn vào đường link và nhập họ tên, địa chỉ, số điện thoại và mật khẩu tài khoản để nhận quà”.',
    challenges: [
      'Tình huống trên có những dấu hiệu đáng ngờ nào?',
      'Nếu nhận được tin nhắn này, em sẽ xử lý như thế nào?',
      'Hãy nêu 4 thông tin hoặc hành động cần bảo vệ khi tham gia Internet.',
    ],
    products: [
      'Danh sách dấu hiệu đáng ngờ.',
      '3 bước xử lý an toàn.',
      'Một khẩu hiệu cảnh báo.',
    ],
  },
  {
    name: 'TRA CỨU',
    topic: 'Kiểm chứng thông tin',
    task: 'Là người dùng Internet thông minh',
    caseText:
      'Em đọc được một bài đăng trên mạng với nội dung: “Ngày mai tất cả học sinh được nghỉ học”. Bài đăng được chia sẻ rất nhiều nhưng không ghi rõ nguồn thông tin.',
    challenges: [
      'Em có nên tin ngay thông tin này không? Vì sao?',
      'Em sẽ tra cứu và kiểm chứng thông tin bằng cách nào?',
      'Hãy xây dựng quy trình 4 bước kiểm tra độ tin cậy của thông tin trước khi chia sẻ.',
    ],
    products: [
      'Quy trình kiểm chứng thông tin.',
      'Những nguồn thông tin nên ưu tiên kiểm tra.',
      'Một thông điệp nhắc nhở mọi người.',
    ],
  },
  {
    name: 'TRÁCH NHIỆM',
    topic: 'Trách nhiệm trên mạng',
    task: 'Nghĩ trước khi đăng – Chịu trách nhiệm khi chia sẻ',
    caseText:
      'Một học sinh chia sẻ một thông tin chưa được kiểm chứng lên nhóm lớp. Sau đó, em phát hiện thông tin đó không đúng sự thật nhưng bài đăng đã được nhiều bạn chia sẻ tiếp.',
    challenges: [
      'Hành động chia sẻ thông tin chưa kiểm chứng có thể gây hậu quả gì?',
      'Người đăng cần làm gì khi phát hiện thông tin mình chia sẻ là sai?',
      'Hãy đề xuất 4 việc thể hiện trách nhiệm của học sinh khi tham gia môi trường mạng.',
    ],
    products: [
      'Các hậu quả có thể xảy ra.',
      'Cách khắc phục khi chia sẻ thông tin sai.',
      'Một thông điệp về trách nhiệm khi sử dụng Internet.',
    ],
  },
];

export const LESSON_SCHEDULE_90M: ScheduleSlot[] = [
  { duration: '10 phút', activity: 'Xem clip giáo viên cung cấp, trao đổi và kết nối bài mới' },
  { duration: '10 phút', activity: 'Khám phá văn hóa giao tiếp, 5T và xử lí nội dung xấu' },
  { duration: '20 phút', activity: 'Phòng thử thách 5 nhóm (Hoạt động 2)' },
  { duration: '5 phút', activity: 'Chốt xử lí rủi ro, bảo vệ bản thân và tìm người lớn hỗ trợ' },
  { duration: '15 phút', activity: 'Tác hại và phòng tránh nghiện Internet, Hồi sinh cây' },
  { duration: '15 phút', activity: 'Luyện tập phân loại hành vi và kiểm tra kiến thức' },
  { duration: '10 phút', activity: 'Viết thông điệp, kế hoạch và giúp bạn' },
  { duration: '5 phút', activity: 'Tổng kết, tải phiếu kết quả, hướng dẫn về nhà' },
];

export const WARMUP_YOUTUBE_URL = 'https://www.youtube.com/watch?v=YSN5dysrkxA';
export const WARMUP_YOUTUBE_EMBED = 'https://www.youtube-nocookie.com/embed/YSN5dysrkxA?rel=0';
export const FRIEND_VIDEO_SRC = '/assets/aistudio/can-than-ket-ban_7bf01754.mp4';
export const EMOTION_VIDEO_SRC =
  '/assets/aistudio/VIDEO_The_hien_cam_xuc_ca_nhan_tren_mang_XH_6dabdd51.mp4?v=2';
export const INTERNET_RISKS_VIDEO_SRC =
  '/assets/aistudio/video_mat_trai_Internet_d35350fa.mp4';
export const SELF_STUDY_GUIDE_VIDEO_SRC =
  '/assets/aistudio/Video_tu_hoc_Bai5_Ung_xu_tren_mang_ecc95476.mp4';
export const APPLICATION_TASK_IMAGE_SRC = '/assets/aistudio/image_5eaad8f1.png';

export const APPLICATION_PRODUCT_TYPES: string[] = [
  'Áp phích (Poster)',
  'Đoạn kịch ngắn',
  'Sơ đồ tư duy',
  'Bài trình chiếu',
  'Khác',
];

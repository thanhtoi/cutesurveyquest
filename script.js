// Target Email for background submission
const TARGET_EMAIL = "thanhtoicntt2000@gmail.com";

// App State
let questions = [];
let userAnswers = {};
let currentQuestionIndex = 0;
let currentUserName = "";

// Default Questions Set (Logically ordered 17 questions)
const DEFAULT_QUESTIONS = [
  {
    question: "Bạn đang cảm thấy thế nào?",
    options: ["Dễ chịu 🌿", "Khó chịu 🥺"]
  },
  {
    question: "Hôm nay bầu trời chỗ bạn trông thế nào?",
    options: ["Nắng ấm tươi tắn ☀️", "Mây trắng bồng bềnh ☁️", "Mưa nhẹ dịu mát 🌧️"]
  },
  {
    question: "Thời tiết ưa thích của bạn là gì?",
    options: ["Nắng ấm ☀️", "Mưa rào 🌧️", "Se lạnh 🍂"]
  },
  {
    question: "Một ngày hôm nay của bạn thế nào?",
    options: ["Khác (Nhập tay...)"]
  },
  {
    question: "Bạn thường thức dậy vào lúc mấy giờ?",
    options: ["Trước 6h sáng 🌅", "6h - 8h sáng ⏰", "Sau 8h sáng 😴"]
  },
  {
    question: "Bạn thường ngủ vào lúc mấy giờ?",
    options: ["10h 🕙", "11h 🕚", "12h 🕛", "Khác (Nhập tay...)"]
  },
  {
    question: "Âm thanh nào làm tâm trạng bạn thấy dễ chịu nhất?",
    options: ["Tiếng mưa rơi tí tách 🌧️", "Tiếng nhạc Lofi / Acoustic 🎶", "Tiếng sóng biển rì rào 🌊"]
  },
  {
    question: "Loại vật nuôi bạn yêu thích nhất?",
    options: ["Mèo 🐱", "Chó 🐶"]
  },
  {
    question: "Nếu được biến thành một em cún/mèo nhỏ, bạn thích làm gì nhất?",
    options: ["Nằm cuộn tròn sưởi nắng 🐱", "Chạy nhảy lon ton tung tăng 🐶", "Được xoa đầu chiều chuộng 🌸"]
  },
  {
    question: "Món đồ uống nào sẽ làm ngày hôm nay của bạn tuyệt hơn?",
    options: ["Trà sữa ngọt ngào 🧋", "Cà phê thơm lừng ☕", "Nước ép hoa quả 🍹"]
  },
  {
    question: "Bạn có thích ăn Bánh ép không?",
    options: ["Có 😋", "Không 😅"]
  },
  {
    question: "Món ăn vặt 'chữa lành' tâm trạng của bạn mỗi khi mệt mỏi?",
    options: ["Bánh ngọt / Kem 🍦", "Đồ nướng nóng hổi 🍢", "Bánh ép giòn thơm 🍪"]
  },
  {
    question: "Tối nay bạn dự định thưởng cho bản thân điều gì?",
    options: ["Xem một bộ phim hay 🎬", "Đi ngủ thật sớm 😴", "Nghe playlist nhạc yêu thích 🎧"]
  },
  {
    question: "Bạn đang nghĩ đến điều gì những lúc bộn bề?",
    options: ["Khác (Nhập tay...)"]
  },
  {
    question: "Điều nhỏ xíu nào mới làm bạn mỉm cười gần đây?",
    options: ["Khác (Nhập tay...)"]
  },
  {
    question: "Lúc này, bạn thích nhận điều gì nhất?",
    options: ["Một cái ôm ấm áp 🫂", "Một ly nước ngon lành 🧋", "Một lời khen dịu dàng 💖"]
  },
  {
    question: "Bạn đánh giá phong cách giao diện này như thế nào?",
    options: ["Rất dễ thương 🌸", "Tuyệt vời ✨", "Khá ổn 🌿", "Cần cải thiện 🛠️"]
  }
];

// DOM Elements
const welcomeScreen = document.getElementById('welcomeScreen');
const questionScreen = document.getElementById('questionScreen');
const resultScreen = document.getElementById('resultScreen');
const questionWrapper = document.getElementById('questionWrapper');

const btnStart = document.getElementById('btnStart');
const btnPrev = document.getElementById('btnPrev');
const btnNext = document.getElementById('btnNext');
const btnRestart = document.getElementById('btnRestart');
const btnDownloadTxt = document.getElementById('btnDownloadTxt');

const giftModal = document.getElementById('giftModal');
const btnCloseGiftModal = document.getElementById('btnCloseGiftModal');
const modalHeartsOverlay = document.getElementById('modalHeartsOverlay');
const toastContainer = document.getElementById('toastContainer');

const questionCounter = document.getElementById('questionCounter');
const progressPercent = document.getElementById('progressPercent');
const progressBarFill = document.getElementById('progressBarFill');
const questionText = document.getElementById('questionText');
const optionsContainer = document.getElementById('optionsContainer');
const customInputWrapper = document.getElementById('customInputWrapper');
const customInput = document.getElementById('customInput');
const summaryList = document.getElementById('summaryList');
const userNameInput = document.getElementById('userNameInput');

// Web Audio API Sound Synthesizer (Cute Sheep & Pop)
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
    if (AudioCtxClass) {
      audioCtx = new AudioCtxClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Global Listener to unlock audio & auto-start background music on first user gesture
function unlockAudio() {
  getAudioContext();
  if (!isMusicPlaying) {
    toggleBackgroundMusic(true);
  }
}
document.addEventListener('click', unlockAudio, { once: false });
document.addEventListener('touchstart', unlockAudio, { once: false });
document.addEventListener('pointerdown', unlockAudio, { once: false });
document.addEventListener('mousemove', unlockAudio, { once: true });
document.addEventListener('keydown', unlockAudio, { once: true });

// Cute Pop Sound on Option/Button Click
function playPopSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1040, ctx.currentTime + 0.09);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.09);
  } catch (e) {}
}

// Real Cute Sheep "Beee~" Audio Sample (Local sheep.mp3 file)
const sheepAudioSample = new Audio('sheep.mp3');
sheepAudioSample.volume = 0.7;

function playSheepBaaSound() {
  try {
    const soundClone = sheepAudioSample.cloneNode();
    soundClone.volume = 0.7;
    soundClone.play().catch(e => console.log("Audio play error:", e));
  } catch (e) {}
}

// Celebration Chime Sound on Survey Finish
function playChimeSound() {
  try {
    const ctx = getAudioContext();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);

      gain.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + i * 0.08);
      osc.stop(ctx.currentTime + i * 0.08 + 0.35);
    });
  } catch (e) {}
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  initBackgroundDecorations();
  detectDeviceOS();
  setupCardElasticDrag();
  loadJsonQuestionsOrDefault();
  setupEventListeners();
  
  // Try default background music autoplay on load
  toggleBackgroundMusic(true);

  // Attach pleasant bubble pop sound to all buttons & answer options
  document.addEventListener('click', (e) => {
    if (e.target.closest('.option-item') || e.target.closest('.btn')) {
      playPopSound();
    }
  });

  // Attach cute sheep sound when typing in input fields
  let lastTypingTime = 0;
  document.addEventListener('input', (e) => {
    if (e.target.classList.contains('form-input')) {
      const now = Date.now();
      if (now - lastTypingTime > 150) { // Slight throttle for pleasant sound
        playSheepBaaSound();
        lastTypingTime = now;
      }
    }
  });
});

// Detect User OS (Windows, Android, iOS) internally if elements exist
function detectDeviceOS() {
  const iconEl = document.getElementById('deviceIcon');
  const textEl = document.getElementById('deviceText');
  if (!iconEl || !textEl) return;
}

// Interactive Elastic Pull / Drag Effect on Card
function setupCardElasticDrag() {
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    let startY = 0;
    let isDragging = false;

    card.addEventListener('touchstart', (e) => {
      startY = e.touches[0].clientY;
      isDragging = true;
      card.style.transition = 'none';
    }, { passive: true });

    card.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const currentY = e.touches[0].clientY;
      const deltaY = (currentY - startY) * 0.35; // Resistance factor
      if (Math.abs(deltaY) < 60) {
        card.style.transform = `translateY(${deltaY}px) rotate(${deltaY * 0.05}deg)`;
      }
    }, { passive: true });

    const resetDrag = () => {
      if (!isDragging) return;
      isDragging = false;
      card.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      card.style.transform = 'translateY(0) rotate(0deg)';
    };

    card.addEventListener('touchend', resetDrag);
    card.addEventListener('touchcancel', resetDrag);
  });
}

// Create Floating Background Elements for Page
function initBackgroundDecorations() {
  const container = document.getElementById('bgDecorations');
  const icons = ['🐑', '🌸', '✨', '💖', '🐑', '🎀', '☁️', '⭐', '🍓', '🐑'];
  
  for (let i = 0; i < 20; i++) {
    const bubble = document.createElement('div');
    bubble.className = 'bg-bubble';
    bubble.innerText = icons[Math.floor(Math.random() * icons.length)];
    bubble.style.left = `${Math.random() * 100}%`;
    bubble.style.animationDuration = `${8 + Math.random() * 10}s`;
    bubble.style.animationDelay = `${Math.random() * 5}s`;
    container.appendChild(bubble);
  }
}

// Auto-load questions from questions.json or fallback to defaults
async function loadJsonQuestionsOrDefault() {
  try {
    const response = await fetch('questions.json');
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setQuestions(data);
        return;
      }
    }
  } catch (e) {
    console.log("Using default questions set.");
  }
  setQuestions(DEFAULT_QUESTIONS);
}

// Process Options Array (If < 4 options, auto append 'Khác (Nhập tay...)')
function setQuestions(rawQuestionsList) {
  questions = rawQuestionsList.map(item => {
    let opts = [...item.options];
    let customIdx = -1;
    
    if (opts.length < 4 && !opts.some(o => o.includes("Khác"))) {
      opts.push("Khác (Nhập tay...)");
      customIdx = opts.length - 1;
    } else {
      customIdx = opts.findIndex(o => o.includes("Khác"));
    }

    return {
      question: item.question,
      options: opts,
      customOptionIndex: customIdx
    };
  });

  currentQuestionIndex = 0;
  userAnswers = {};
}

// Setup Event Listeners
function setupEventListeners() {
  btnStart.addEventListener('click', startSurvey);
  btnNext.addEventListener('click', handleNextQuestion);
  btnPrev.addEventListener('click', handlePrevQuestion);
  btnRestart.addEventListener('click', restartSurvey);
  if (btnDownloadTxt) btnDownloadTxt.addEventListener('click', exportAnswersToTxt);
  
  const btnMusicToggle = document.getElementById('btnMusicToggle');
  if (btnMusicToggle) {
    btnMusicToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleBackgroundMusic();
    });
  }

  btnCloseGiftModal.addEventListener('click', () => {
    giftModal.classList.add('hidden');
  });
}

// Background Lofi Music Player (Track 1: Lo-Fi Study Chill)
const bgMusic = new Audio('https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.22;

// Fallback to local bg_music.mp3 if network fails
bgMusic.onerror = () => {
  bgMusic.src = 'bg_music.mp3';
};
let isMusicPlaying = false;

function toggleBackgroundMusic(enable) {
  const musicBtn = document.getElementById('btnMusicToggle');
  const musicIcon = document.getElementById('musicIcon');
  const musicText = document.getElementById('musicText');

  const shouldPlay = enable !== undefined ? enable : !isMusicPlaying;

  if (shouldPlay) {
    bgMusic.play().then(() => {
      isMusicPlaying = true;
      if (musicBtn) musicBtn.classList.add('playing');
      if (musicIcon) musicIcon.innerText = '🎶';
      if (musicText) musicText.innerText = 'Nhạc Nền: Bật';
    }).catch(err => {
      console.log('Autoplay restriction:', err);
    });
  } else {
    bgMusic.pause();
    isMusicPlaying = false;
    if (musicBtn) musicBtn.classList.remove('playing');
    if (musicIcon) musicIcon.innerText = '🎵';
    if (musicText) musicText.innerText = 'Nhạc Nền: Tắt';
  }
}

// Start Survey Flow
function startSurvey() {
  const nameVal = userNameInput ? userNameInput.value.trim() : "";
  if (!nameVal) {
    showToast('✏️ Vui lòng nhập tên hoặc biệt danh của bạn nhé!', 'warning');
    if (userNameInput) userNameInput.focus();
    return;
  }

  currentUserName = nameVal;

  if (questions.length === 0) {
    showToast('⚠️ Không có câu hỏi nào để bắt đầu!', 'warning');
    return;
  }

  welcomeScreen.classList.add('hidden');
  resultScreen.classList.add('hidden');
  questionScreen.classList.remove('hidden');
  renderQuestion(currentQuestionIndex);

  // Automatically start soothing background Lofi music
  if (!isMusicPlaying) {
    toggleBackgroundMusic(true);
  }

  // Trigger 1: Send notification email when user clicks Start Survey
  sendEmailStartSurveyNotification();
}

// Send Notification Email when someone starts survey
async function sendEmailStartSurveyNotification() {
  const timeStr = new Date().toLocaleString('vi-VN');
  console.log(`Sending start notification for ${currentUserName} to: ${TARGET_EMAIL}...`);

  try {
    await fetch(`https://formsubmit.co/ajax/${TARGET_EMAIL}`, {
      method: "POST",
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: `🔔 [${currentUserName}] VỪA BẮT ĐẦU LÀM KHẢO SÁT 🌸`,
        _captcha: "false",
        UserName: currentUserName,
        Notification: `Người dùng "${currentUserName}" vừa bấm nút 'Bắt Đầu Ngay' để làm khảo sát mẫu thử!`,
        StartTime: timeStr
      })
    });
  } catch (err) {
    console.error('Start email notification error:', err);
  }
}

// Render Question with Animations
function renderQuestion(index) {
  const currentQ = questions[index];
  
  const total = questions.length;
  const progressPercentVal = Math.round(((index + 1) / total) * 100);
  questionCounter.innerText = `Câu hỏi ${index + 1} / ${total}`;
  progressPercent.innerText = `${progressPercentVal}%`;
  progressBarFill.style.width = `${progressPercentVal}%`;

  if (index === 0) {
    btnPrev.style.visibility = 'hidden';
  } else {
    btnPrev.style.visibility = 'visible';
  }

  if (index === total - 1) {
    btnNext.innerText = 'Hoàn Thành ✨';
  } else {
    btnNext.innerText = 'Câu Tiếp ➡️';
  }

  questionWrapper.classList.remove('fade-in');
  questionWrapper.classList.add('fade-out');

  setTimeout(() => {
    questionText.innerText = currentQ.question;
    optionsContainer.innerHTML = '';
    customInputWrapper.classList.add('hidden');
    customInput.value = '';

    const savedAnswer = userAnswers[index];

    currentQ.options.forEach((optText, optIdx) => {
      const optionEl = document.createElement('div');
      optionEl.className = 'option-item';
      
      const badgeText = String.fromCharCode(65 + optIdx);
      optionEl.innerHTML = `
        <span>${optText}</span>
        <span class="option-badge">${badgeText}</span>
      `;

      if (savedAnswer && savedAnswer.selectedIndex === optIdx) {
        optionEl.classList.add('selected');
        if (optIdx === currentQ.customOptionIndex) {
          customInputWrapper.classList.remove('hidden');
          customInput.value = savedAnswer.customText || '';
        }
      }

      optionEl.addEventListener('click', () => selectOption(optIdx, currentQ));
      optionsContainer.appendChild(optionEl);
    });

    questionWrapper.classList.remove('fade-out');
    questionWrapper.classList.add('fade-in');
  }, 250);
}

// Option Click Handler
function selectOption(selectedIndex, currentQ) {
  const allOptions = optionsContainer.querySelectorAll('.option-item');
  allOptions.forEach((el, idx) => {
    if (idx === selectedIndex) {
      el.classList.add('selected');
    } else {
      el.classList.remove('selected');
    }
  });

  if (selectedIndex === currentQ.customOptionIndex) {
    customInputWrapper.classList.remove('hidden');
    customInput.focus();
  } else {
    customInputWrapper.classList.add('hidden');
  }

  userAnswers[currentQuestionIndex] = {
    selectedIndex: selectedIndex,
    selectedText: currentQ.options[selectedIndex],
    customText: selectedIndex === currentQ.customOptionIndex ? customInput.value : ''
  };
}

// Handle Next Button
function handleNextQuestion() {
  const currentQ = questions[currentQuestionIndex];
  const answer = userAnswers[currentQuestionIndex];

  if (answer && answer.selectedIndex === currentQ.customOptionIndex) {
    answer.customText = customInput.value.trim();
  }

  if (!answer) {
    showToast('⚠️ Vui lòng chọn một đáp án nhé!', 'warning');
    return;
  }
  if (answer.selectedIndex === currentQ.customOptionIndex && !answer.customText) {
    showToast('✏️ Bạn vui lòng điền câu trả lời nhập tay vào ô nhé!', 'warning');
    customInput.focus();
    return;
  }

  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    renderQuestion(currentQuestionIndex);
  } else {
    finishSurvey();
  }
}

// Handle Previous Button
function handlePrevQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    renderQuestion(currentQuestionIndex);
  }
}

// Finish Survey Screen & Trigger Completion Popup
function finishSurvey() {
  questionScreen.classList.add('hidden');
  resultScreen.classList.remove('hidden');
  resultScreen.classList.add('fade-in');

  // Trigger Confetti
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
  }

  // Render Summary List
  summaryList.innerHTML = '';
  questions.forEach((q, idx) => {
    const ans = userAnswers[idx];
    let displayText = ans.selectedText;
    if (ans.selectedIndex === q.customOptionIndex) {
      displayText = `Khác: "${ans.customText}"`;
    }

    const itemEl = document.createElement('div');
    itemEl.className = 'summary-item';
    itemEl.innerHTML = `
      <div class="summary-q">Câu ${idx + 1}: ${q.question}</div>
      <div class="summary-a">👉 Đáp án: ${displayText}</div>
    `;
    summaryList.appendChild(itemEl);
  });

  // Open Gift Popup with Floating Hearts
  showGiftModal();

  // Send Email to thanhtoicntt2000@gmail.com
  sendEmailResultsBackground();
}

// Display Gift Modal & Spawn Floating Hearts
function showGiftModal() {
  playChimeSound();
  modalHeartsOverlay.innerHTML = '';
  const heartIcons = ['💖', '🐑', '🌸', '✨', '🎁', '💕', '🐑'];
  
  for (let i = 0; i < 18; i++) {
    const heart = document.createElement('div');
    heart.className = 'modal-heart';
    heart.innerText = heartIcons[Math.floor(Math.random() * heartIcons.length)];
    heart.style.left = `${Math.random() * 90 + 5}%`;
    heart.style.animationDuration = `${3 + Math.random() * 3}s`;
    heart.style.animationDelay = `${Math.random() * 2}s`;
    modalHeartsOverlay.appendChild(heart);
  }

  giftModal.classList.remove('hidden');
}

// Restart Survey
function restartSurvey() {
  currentQuestionIndex = 0;
  userAnswers = {};
  resultScreen.classList.add('hidden');
  welcomeScreen.classList.remove('hidden');
}

// Export Answers to .txt File
function exportAnswersToTxt() {
  let content = "=== KẾT QUẢ KHẢO SÁT ===\n";
  content += `Thời gian hoàn thành: ${new Date().toLocaleString('vi-VN')}\n`;
  content += `Email người nhận: ${TARGET_EMAIL}\n\n`;

  questions.forEach((q, idx) => {
    const ans = userAnswers[idx];
    let displayText = ans ? ans.selectedText : "Chưa trả lời";
    if (ans && ans.selectedIndex === q.customOptionIndex) {
      displayText = `Khác (Nhập tay): ${ans.customText}`;
    }
    content += `Câu ${idx + 1}: ${q.question}\n`;
    content += `   -> Đáp án chọn: ${displayText}\n\n`;
  });

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ket-qua-khao-sat-${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast('📥 Đã tự động xuất file kết quả .txt!', 'success');
}

// Send Email Results in Background to thanhtoicntt2000@gmail.com using FormSubmit AJAX API
async function sendEmailResultsBackground() {
  let emailBody = `KẾT QUẢ KHẢO SÁT CỦA: ${currentUserName}\nThời gian: ${new Date().toLocaleString('vi-VN')}\n\n`;
  questions.forEach((q, idx) => {
    const ans = userAnswers[idx];
    let displayText = ans ? ans.selectedText : "Chưa trả lời";
    if (ans && ans.selectedIndex === q.customOptionIndex) {
      displayText = `Khác: ${ans.customText}`;
    }
    emailBody += `Câu ${idx + 1}: ${q.question}\n   -> Đáp án: ${displayText}\n\n`;
  });

  console.log(`Đang gửi email kết quả của ${currentUserName} tới: ${TARGET_EMAIL}...`);

  try {
    const response = await fetch(`https://formsubmit.co/ajax/${TARGET_EMAIL}`, {
      method: "POST",
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: `🌸 KẾT QUẢ KHẢO SÁT CỦA [${currentUserName}] 🌸`,
        _template: "table",
        _captcha: "false",
        UserName: currentUserName,
        Recipient: TARGET_EMAIL,
        CompletionTime: new Date().toLocaleString('vi-VN'),
        SurveyDetails: emailBody
      })
    });

    const data = await response.json();
    if (data.success === "true" || response.ok) {
      showToast(`📧 Đã gửi kết quả khảo sát của ${currentUserName} tới Email!`, 'success');
      console.log('Email sent successfully via FormSubmit API:', data);
    } else {
      console.warn('FormSubmit response:', data);
      showToast(`📧 Đã kích hoạt lệnh gửi mail tới ${TARGET_EMAIL}`, 'info');
    }
  } catch (err) {
    console.error('Email sending error:', err);
    showToast(`📧 Đã lưu và chuẩn bị gửi mail tới ${TARGET_EMAIL}`, 'info');
  }
}

// Toast Notifications System
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerText = message;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-out');
    toast.addEventListener('animationend', () => {
      toast.remove();
    });
  }, 3200);
}

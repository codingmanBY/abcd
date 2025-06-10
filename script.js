// 전역 변수
let currentIndex = 0;
let autoPlayInterval;
let isAutoPlaying = true;
let progressInterval;
const totalCards = 6; // 수정된 후기 개수로 변경
const autoPlayDuration = 5000; // 5초
let isInitialized = false;

// 성능 최적화를 위한 디바운스 함수
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// 주문 버튼 클릭 핸들러 (신규 추가)
function handleOrderClick() {
  alert('🎉 예약 주문 접수되었습니다!\n\n정식 출시일(2025년 8월 15일)에 우선 배송해드리며,\n출시 전 할인 혜택과 특별 소식을 이메일로 안내드릴 예정입니다.\n\n문의: hello@auraier.com');
}

// 프리로더 숨기기
function hideLoader() {
  const loader = document.getElementById('loadingOverlay');
  if (loader) {
    loader.classList.add('hidden');
    setTimeout(() => {
      loader.style.display = 'none';
    }, 500);
  }
}

// 별 배경 생성 함수
function createStars() {
  const starBg = document.getElementById('starBg');
  if(!starBg) return;
  
  const starCount = window.innerWidth < 768 ? 40 : 80;
  const fragment = document.createDocumentFragment();
  
  for(let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.className = Math.random() < 0.2 ? 'star bright' : 'star dim';
    const size = (Math.random() * 2 + 0.5);
    star.style.width = size + 'px';
    star.style.height = size + 'px';
    star.style.top = Math.random() * 100 + '%';
    star.style.left = Math.random() * 100 + '%';
    star.style.animationDelay = (Math.random() * 3) + 's';
    fragment.appendChild(star);
  }
  
  starBg.appendChild(fragment);
}

// 스크롤 효과 초기화
function initScrollEffects() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { 
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
  });
}

// 자동 재생 진행 바 업데이트
function updateProgressBar() {
  const progressBar = document.getElementById('progressBar');
  if (!progressBar) return;
  
  let progress = 0;
  const increment = 100 / (autoPlayDuration / 100);
  
  if (progressInterval) {
    clearInterval(progressInterval);
  }
  
  progressInterval = setInterval(() => {
    progress += increment;
    progressBar.style.width = Math.min(progress, 100) + '%';
    
    if (progress >= 100) {
      clearInterval(progressInterval);
    }
  }, 100);
}

// 자동 재생 시작
function startAutoPlay() {
  if (!isAutoPlaying) return;
  
  if (autoPlayInterval) clearInterval(autoPlayInterval);
  if (progressInterval) clearInterval(progressInterval);
  
  updateProgressBar();
  
  autoPlayInterval = setInterval(() => {
    if (isAutoPlaying) {
      currentIndex = (currentIndex + 1) % totalCards;
      scrollToCard(currentIndex);
      updateProgressBar();
    }
  }, autoPlayDuration);
}

// 자동 재생 중지
function stopAutoPlay() {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval);
    autoPlayInterval = null;
  }
  if (progressInterval) {
    clearInterval(progressInterval);
    progressInterval = null;
  }
  
  const progressBar = document.getElementById('progressBar');
  if (progressBar) {
    progressBar.style.width = '0%';
  }
}

// 자동 재생 토글
function toggleAutoPlay() {
  const autoPlayBtn = document.getElementById('autoPlayBtn');
  if (!autoPlayBtn) return;
  
  if (isAutoPlaying) {
    stopAutoPlay();
    isAutoPlaying = false;
    autoPlayBtn.innerHTML = '▶️ 재생';
    autoPlayBtn.classList.remove('auto-play');
  } else {
    isAutoPlaying = true;
    autoPlayBtn.innerHTML = '⏸️ 일시정지';
    autoPlayBtn.classList.add('auto-play');
    startAutoPlay();
  }
}

// 캐러셀 스크롤 함수
function scrollCarousel(direction) {
  const carousel = document.getElementById('reviewsCarousel');
  if (!carousel) return;
  
  const cardWidth = carousel.querySelector('.review-card')?.offsetWidth + 32 || 452; // gap 포함
  
  if (direction === 'left') {
    currentIndex = currentIndex > 0 ? currentIndex - 1 : totalCards - 1;
  } else {
    currentIndex = (currentIndex + 1) % totalCards;
  }
  
  carousel.scrollTo({ 
    left: cardWidth * currentIndex, 
    behavior: 'smooth' 
  });
  
  updateIndicators();
  
  // 수동 조작 시 자동 재생 재시작
  if (isAutoPlaying) {
    stopAutoPlay();
    setTimeout(() => {
      if (isAutoPlaying) startAutoPlay();
    }, 1000);
  }
}

// 특정 카드로 스크롤
function scrollToCard(index) {
  const carousel = document.getElementById('reviewsCarousel');
  if (!carousel) return;
  
  const cardWidth = carousel.querySelector('.review-card')?.offsetWidth + 32 || 452;
  currentIndex = Math.max(0, Math.min(index, totalCards - 1));
  
  carousel.scrollTo({ 
    left: cardWidth * currentIndex, 
    behavior: 'smooth' 
  });
  
  updateIndicators();
}

// 인디케이터 업데이트
function updateIndicators() {
  const indicators = document.querySelectorAll('.indicator');
  indicators.forEach((indicator, index) => {
    indicator.classList.toggle('active', index === currentIndex);
  });
}

// 캐러셀 호버 이벤트
function setupCarouselHover() {
  const carousel = document.getElementById('reviewsCarousel');
  if (!carousel) return;
  
  carousel.addEventListener('mouseenter', () => {
    if (isAutoPlaying) stopAutoPlay();
  });
  
  carousel.addEventListener('mouseleave', () => {
    if (isAutoPlaying) {
      setTimeout(() => {
        if (isAutoPlaying) startAutoPlay();
      }, 500);
    }
  });
}

// 모바일 메뉴 토글
function toggleMobileMenu() {
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileMenu) {
    mobileMenu.classList.toggle('hidden');
  }
}

// 이벤트 리스너 설정
function setupEventListeners() {
  // ESC 키로 모달 닫기
  document.addEventListener('keydown', function(e) {
    if (e.key === "Escape") {
      closeHowModal();
    }
  });

  // 모달 배경 클릭으로 닫기
  const modal = document.getElementById('howModal');
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === this) {
        closeHowModal();
      }
    });
  }

  // 스무스 스크롤
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // 캐러셀 호버 이벤트 설정
  setupCarouselHover();

  // 리사이즈 이벤트
  window.addEventListener('resize', debounce(() => {
    updateIndicators();
  }, 250));
}

// 모달 열기
function openHowModal() {
  const modal = document.getElementById('howModal');
  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // 포커스 관리
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) {
      closeBtn.focus();
    }
  }
}

// 모달 닫기
function closeHowModal() {
  const modal = document.getElementById('howModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

// 오늘 날짜 자동 계산 함수
function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 위쪽 방향 단방향 회전 단계 계산
function calculateUpwardSteps(start, target) {
  if (start <= target) {
    return target - start;
  } else {
    return (10 - start) + target;
  }
}

// 0000-00-00에서 오늘날짜로 직접 전환하는 룰렛 애니메이션
function animateLuxuryDigitRoulette() {
  const digitElements = document.querySelectorAll('.digit-roulette');
  const dateRoulette = document.getElementById('dateRoulette');
  const todayDate = getTodayDate();
  
  if (!digitElements.length || !dateRoulette) return;
  
  // 시작 날짜: 0000-00-00
  const startDate = '0000-00-00';
  const [startYear, startMonth, startDay] = startDate.split('-');
  const [targetYear, targetMonth, targetDay] = todayDate.split('-');
  
  // 전체 날짜 문자열 생성
  const startDateStr = startYear + startMonth + startDay; // "00000000"
  const targetDateStr = targetYear + targetMonth + targetDay; // "20250610"
  
  dateRoulette.classList.add('luxury-spinning');
  
  // 각 자릿수별 애니메이션 설정
  digitElements.forEach((digitEl, index) => {
    const digitColumn = digitEl.querySelector('.digit-column');
    if (!digitColumn) return;
    
    const startDigit = parseInt(startDateStr[index]) || 0;
    const targetDigit = parseInt(targetDateStr[index]) || 0;
    
    // 초기 위치 설정 (0000-00-00)
    digitColumn.style.transform = `translateY(-${startDigit * 1.2}em)`;
    digitColumn.style.transition = 'none';
    
    // 위쪽 방향 단방향 회전 단계 계산
    const steps = calculateUpwardSteps(startDigit, targetDigit);
    
    // 자릿수별 지연 시간 (고급스러운 연쇄 효과)
    const baseDelay = 200;
    const staggerDelay = index * 100;
    const randomVariation = Math.random() * 150;
    const totalDelay = baseDelay + staggerDelay + randomVariation;
    
    // 애니메이션 실행
    setTimeout(() => {
      // 부드러운 transition 적용
      digitColumn.style.transition = 'transform 2.2s cubic-bezier(0.23, 0.82, 0.24, 1)';
      
      // 목표 위치로 이동 (단방향 회전)
      const finalPosition = (startDigit + steps) % 10;
      digitColumn.style.transform = `translateY(-${finalPosition * 1.2}em)`;
    }, totalDelay);
  });
  
  // 전체 애니메이션 완료 후 로고 글로우 효과
  setTimeout(() => {
    const openingLogo = document.getElementById('openingLogo');
    if (openingLogo) {
      openingLogo.classList.add('glowing');
    }
  }, 1800);
  
  // 모든 애니메이션 완료 후 날짜 사라짐
  setTimeout(() => {
    dateRoulette.classList.remove('luxury-spinning');
    dateRoulette.classList.add('fade-out');
    
    // 날짜가 사라진 후 메시지 표시
    setTimeout(showOpeningMessage, 600);
  }, 3000);
}

function showOpeningMessage() {
  const typingContainer = document.getElementById('typingContainer');
  const openingLogo = document.getElementById('openingLogo');
  const dateRoulette = document.getElementById('dateRoulette');
  
  if (!typingContainer || !dateRoulette) return;
  
  // 날짜 룰렛 페이드아웃
  dateRoulette.classList.add('fade-out');
  
  // Auraier 표시 (날짜가 사라지면서 바로 시작)
  typingContainer.textContent = 'Auraier';
  typingContainer.classList.add('visible', 'slide-up');
  
  // 메시지 표시 후 오프닝 완료
  setTimeout(() => {
    typingContainer.classList.add('fading');
    setTimeout(completeOpening, 1200);
  }, 1800);
}

// 오프닝 완료 및 메인 컨텐츠 표시
function completeOpening() {
  const overlay = document.getElementById('openingOverlay');
  const mainContent = document.getElementById('mainContent');
  
  if (overlay) overlay.classList.add('hide');
  if (mainContent) mainContent.style.opacity = '1';
  
  document.body.classList.remove('no-scroll');
  
  // 별들의 반짝임 강화
  setTimeout(() => {
    document.querySelectorAll('.star').forEach(star => {
      if (Math.random() < 0.3) {
        star.style.animation = 'twinkleBright 2s ease-in-out infinite';
      }
    });
  }, 700);
  
  // 자동 재생 시작
  setTimeout(() => {
    if (isAutoPlaying) {
      startAutoPlay();
    }
  }, 1000);
}

// 초기화 함수
function initialize() {
  if (isInitialized) return;
  
  try {
    // 모든 초기화 함수 실행
    hideLoader();
    createStars();
    initScrollEffects();
    setupEventListeners();
    
    // 고급스러운 오프닝 애니메이션 시작
    setTimeout(() => {
      animateLuxuryDigitRoulette();
    }, 600);
    
    isInitialized = true;
  } catch (error) {
    console.error('초기화 중 오류 발생:', error);
    // 오류 발생 시 기본 상태로 복구
    hideLoader();
    completeOpening();
  }
}

// DOMContentLoaded 이벤트 리스너
document.addEventListener('DOMContentLoaded', initialize);

// 페이지 로드 완료 후 백업 초기화
window.addEventListener('load', () => {
  if (!isInitialized) {
    initialize();
  }
});

// 페이지 언로드 시 정리
window.addEventListener('beforeunload', () => {
  if (autoPlayInterval) clearInterval(autoPlayInterval);
  if (progressInterval) clearInterval(progressInterval);
});

// 에러 핸들링
window.addEventListener('error', (e) => {
  console.error('JavaScript 오류:', e.error);
});

// Service Worker 등록 (PWA 대응)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

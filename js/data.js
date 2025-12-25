/* ===========================================
   Data - 데이터 모델 및 초기 데이터
   =========================================== */

const Data = {
    // 시술 데이터 (객단가 계산 포함)
    treatments: [
        { 
            id: 1, 
            name: '피부색소', 
            category: '색소관리',
            revenue: 470000000, 
            count: 78, 
            avgPrice: 6025641,  // 603만
            tier: 2,
            code: 'H10N5A20',  // 원장 10분 + 간호사 5분 + 관리사 20분
            totalTime: 35
        },
        { 
            id: 2, 
            name: '피부돌출', 
            category: '돌출관리',
            revenue: 320000000, 
            count: 108, 
            avgPrice: 2962963,  // 296만
            tier: 3,
            code: 'S10A15',  // 부원장 10분 + 관리사 15분
            totalTime: 25
        },
        { 
            id: 3, 
            name: '탄력쫀쫀', 
            category: '탄력관리',
            revenue: 280000000, 
            count: 23, 
            avgPrice: 12173913,  // 1,217만
            tier: 2,
            code: 'H20N10A30',  // 원장 20분 + 간호사 10분 + 관리사 30분
            totalTime: 60
        },
        { 
            id: 4, 
            name: '피부모공/결', 
            category: '모공관리',
            revenue: 210000000, 
            count: 57, 
            avgPrice: 3684211,  // 368만
            tier: 2,
            code: 'HS10A20',  // 원장(택1) 10분 + 관리사 20분
            totalTime: 30
        },
        { 
            id: 5, 
            name: 'Special흉터', 
            category: '흉터관리',
            revenue: 150000000, 
            count: 23, 
            avgPrice: 6521739,  // 652만
            tier: 1,
            code: 'H30N10',  // 원장전용 30분 + 간호사 10분
            totalTime: 40
        },
        { 
            id: 6, 
            name: '꺼짐볼륨', 
            category: '볼륨관리',
            revenue: 130000000, 
            count: 31, 
            avgPrice: 4193548,  // 419만
            tier: 1,
            code: 'H20N5',  // 원장 20분 + 간호사 5분
            totalTime: 25
        },
        { 
            id: 7, 
            name: '탄력잔주름', 
            category: '주름관리',
            revenue: 110000000, 
            count: 28, 
            avgPrice: 3928571,  // 393만
            tier: 2,
            code: 'HS15A15',  // 원장(택1) 15분 + 관리사 15분
            totalTime: 30
        },
        { 
            id: 8, 
            name: '피부제모', 
            category: '제모관리',
            revenue: 50000000, 
            count: 32, 
            avgPrice: 1562500,  // 156만
            tier: 3,
            code: 'N5A20',  // 간호사 5분 + 관리사 20분
            totalTime: 25
        }
    ],
    
    // 인력 데이터
    staff: [
        { id: 1, name: '이원장', role: 'H', roleLabel: '대표원장', status: 'available' },
        { id: 2, name: '오원장', role: 'S', roleLabel: '부원장', status: 'available' },
        { id: 3, name: '유원장', role: 'S', roleLabel: '부원장', status: 'available' },
        { id: 4, name: '김간호사', role: 'N', roleLabel: '간호사', status: 'available' },
        { id: 5, name: '박관리사', role: 'A', roleLabel: '관리사', status: 'available' },
        { id: 6, name: '최관리사', role: 'A', roleLabel: '관리사', status: 'available' }
    ],
    
    // 인력 가용 수
    staffCapacity: {
        H: 1,  // 대표원장 1명
        S: 2,  // 부원장 2명
        N: 1,  // 간호사 1명
        A: 2   // 관리사 2명
    },
    
    // 추천 콤비네이션
    recommendedCombos: [
        {
            id: 1,
            name: '피부돌출 + 색소 패키지',
            target: '피부돌출 고객 → 색소 업셀링',
            items: ['피부돌출 관리', '피부색소 1회', '사후관리'],
            originalPrice: 9000000,
            discountedPrice: 7650000,
            upsellPotential: '+307만원 객단가 상승'
        },
        {
            id: 2,
            name: '제모 + 모공케어 패키지',
            target: '제모 고객 → 모공/결 업셀링',
            items: ['피부제모 3회', '피부모공/결 1회', '보습관리'],
            originalPrice: 6500000,
            discountedPrice: 5520000,
            upsellPotential: '+212만원 객단가 상승'
        },
        {
            id: 3,
            name: '탄력 안티에이징 패키지',
            target: '잔주름 고객 → 탄력쫀쫀 업셀링',
            items: ['탄력잔주름 2회', '탄력쫀쫀 1회', '꺼짐볼륨 보완'],
            originalPrice: 18500000,
            discountedPrice: 15725000,
            upsellPotential: '+824만원 객단가 상승'
        }
    ],
    
    // 객단가 향상 전략
    strategies: [
        {
            icon: '🎁',
            title: '패키지 번들링',
            description: '저객단가 시술(제모, 피부돌출)을 고객단가 시술과 묶어 세트 상품으로 판매. 진입 장벽을 낮추면서 업셀링 유도.',
            impact: '예상 효과: 객단가 +45%'
        },
        {
            icon: '💳',
            title: '정기권 구독 모델',
            description: '월정액 관리 프로그램 도입. 저객단가 시술을 미끼로 사용하여 정기 방문 유도 후 추가 시술 제안.',
            impact: '예상 효과: 재방문율 +35%p'
        },
        {
            icon: '📈',
            title: '단계별 업셀링 경로',
            description: '제모→모공/결→색소, 피부돌출→탄력쫀쫀→Special흉터 등 자연스러운 시술 확장 경로 설계.',
            impact: '예상 효과: 고객당 LTV +68%'
        }
    ],
    
    // 샘플 예약 데이터
    reservations: [
        {
            id: 1,
            patientName: '김지현',
            phone: '010-1234-5678',
            treatmentId: 1,
            treatmentName: '피부색소',
            date: '2024-12-23',
            startTime: '10:00',
            endTime: '10:35',
            staffIds: [1, 4, 5],
            status: 'confirmed',
            code: 'H10N5A20'
        },
        {
            id: 2,
            patientName: '박소영',
            phone: '010-2345-6789',
            treatmentId: 8,
            treatmentName: '피부제모',
            date: '2024-12-23',
            startTime: '10:30',
            endTime: '10:55',
            staffIds: [4, 6],
            status: 'confirmed',
            code: 'N5A20'
        },
        {
            id: 3,
            patientName: '이민수',
            phone: '010-3456-7890',
            treatmentId: 3,
            treatmentName: '탄력쫀쫀',
            date: '2024-12-23',
            startTime: '11:00',
            endTime: '12:00',
            staffIds: [1, 4, 5],
            status: 'confirmed',
            code: 'H20N10A30'
        }
    ],
    
    // 운영 시간
    operatingHours: {
        start: 9,  // 9시
        end: 18,   // 18시
        interval: 30  // 30분 단위
    },
    
    // 현재 선택된 날짜
    currentDate: new Date(),
    
    // 콤비네이션 선택 상태
    selectedLowPrice: null,
    selectedHighPrice: null
};

// 객단가 기준으로 시술 분류
Data.getLowPriceTreatments = function() {
    return this.treatments
        .filter(t => t.avgPrice < 4000000)  // 400만원 미만
        .sort((a, b) => a.avgPrice - b.avgPrice);
};

Data.getHighPriceTreatments = function() {
    return this.treatments
        .filter(t => t.avgPrice >= 4000000)  // 400만원 이상
        .sort((a, b) => b.avgPrice - a.avgPrice);
};

// 시간 슬롯 생성
Data.getTimeSlots = function() {
    const slots = [];
    for (let h = this.operatingHours.start; h < this.operatingHours.end; h++) {
        for (let m = 0; m < 60; m += this.operatingHours.interval) {
            const hour = String(h).padStart(2, '0');
            const min = String(m).padStart(2, '0');
            slots.push(`${hour}:${min}`);
        }
    }
    return slots;
};

// 특정 시간의 인력 가용성 확인
Data.checkAvailability = function(date, time, code) {
    const required = this.parseCode(code);
    const occupied = this.getOccupiedStaff(date, time);
    
    const result = {};
    for (const [role, count] of Object.entries(required)) {
        const actualRole = role === 'HS' ? 'S' : role;  // HS는 H 또는 S
        const capacity = role === 'HS' 
            ? this.staffCapacity['H'] + this.staffCapacity['S']
            : this.staffCapacity[actualRole] || 0;
        const used = occupied[actualRole] || 0;
        result[role] = {
            required: count,
            available: capacity - used,
            isAvailable: (capacity - used) >= count
        };
    }
    return result;
};

// 인력시간코드 파싱
Data.parseCode = function(code) {
    const result = {};
    const regex = /(HS|H|S|N|A)(\d+)/g;
    let match;
    while ((match = regex.exec(code)) !== null) {
        result[match[1]] = parseInt(match[2]);
    }
    return result;
};

// 특정 시간에 점유된 인력 조회
Data.getOccupiedStaff = function(date, time) {
    const occupied = { H: 0, S: 0, N: 0, A: 0 };
    
    this.reservations
        .filter(r => r.date === date && r.startTime <= time && r.endTime > time)
        .forEach(r => {
            const required = this.parseCode(r.code);
            for (const [role, minutes] of Object.entries(required)) {
                const actualRole = role === 'HS' ? 'S' : role;
                occupied[actualRole] = (occupied[actualRole] || 0) + 1;
            }
        });
    
    return occupied;
};

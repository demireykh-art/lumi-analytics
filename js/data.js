/* ===========================================
   Data - 카테고리 기반 데이터 구조
   =========================================== */

const Data = {
    // ============================================
    // 카테고리 (기본 인력시간코드 포함)
    // ============================================
    categories: [
        { id: 1, name: '색소', code: 'H10N5A20', time: 35, color: '#f472b6' },
        { id: 2, name: '돌출', code: 'S10A15', time: 25, color: '#fb923c' },
        { id: 3, name: '탄력쫀쫀', code: 'H20N10A30', time: 60, color: '#a78bfa' },
        { id: 4, name: '탄력잔주름', code: 'HS15A15', time: 30, color: '#c084fc' },
        { id: 5, name: '탄력윤곽', code: 'H10N5', time: 15, color: '#e879f9' },
        { id: 6, name: '꺼짐볼륨', code: 'H20N5', time: 25, color: '#22d3ee' },
        { id: 7, name: '꺼짐주름', code: 'H15N10', time: 25, color: '#2dd4bf' },
        { id: 8, name: 'Special포다이스', code: 'H30N10A20', time: 60, color: '#f43f5e' },
        { id: 9, name: 'Special흉터', code: 'H30N10', time: 40, color: '#ef4444' },
        { id: 10, name: 'Special구멍', code: 'H40N15', time: 55, color: '#dc2626' },
        { id: 11, name: '모공', code: 'HS10A20', time: 30, color: '#84cc16' },
        { id: 12, name: '제모', code: 'N5A20', time: 25, color: '#a3e635' },
        { id: 13, name: '여드름', code: 'S10N5A20', time: 35, color: '#fbbf24' },
        { id: 14, name: '보톡스', code: 'H10N5', time: 15, color: '#60a5fa' },
        { id: 15, name: '부스터', code: 'H15N10A15', time: 40, color: '#38bdf8' },
        { id: 16, name: '리프팅', code: 'H20N10A30', time: 60, color: '#818cf8' },
        { id: 17, name: '재생', code: 'N5A30', time: 35, color: '#34d399' },
        { id: 18, name: '기타', code: 'N5A10', time: 15, color: '#94a3b8' }
    ],

    // ============================================
    // 시술 목록 (실제 데이터 기반)
    // ============================================
    treatments: [
        // 색소
        { id: 101, name: 'BB 토닝 1회', categoryId: 1, price: 330000, count: 19, code: null, time: null },
        { id: 102, name: 'BB 토닝 5회', categoryId: 1, price: 1320000, count: 14, code: null, time: null },
        { id: 103, name: 'BB 팔 잡티 1회', categoryId: 1, price: 550000, count: 5, code: null, time: null },
        { id: 104, name: '검버섯 ~2mm', categoryId: 1, price: 55000, count: 4, code: 'H5N5', time: 10 },
        { id: 105, name: '검버섯 2~5mm', categoryId: 1, price: 77000, count: 4, code: 'H5N5', time: 10 },
        { id: 106, name: '검버섯 5mm이상', categoryId: 1, price: 110000, count: 3, code: 'H10N5', time: 15 },
        { id: 107, name: '검버섯 얼굴전체', categoryId: 1, price: 660000, count: 5, code: null, time: null },
        { id: 108, name: '보통점', categoryId: 1, price: 22000, count: 13, code: 'H5', time: 5 },
        { id: 109, name: '색소침착 5X5cm', categoryId: 1, price: 55000, count: 6, code: null, time: null },
        { id: 110, name: '색소침착 10X10cm', categoryId: 1, price: 88000, count: 3, code: null, time: null },
        { id: 111, name: '원데이잡티 1회', categoryId: 1, price: 110000, count: 2, code: null, time: null },
        { id: 112, name: '미백토닝 10회', categoryId: 1, price: 1430000, count: 1, code: null, time: null },
        
        // 돌출
        { id: 201, name: '돌출점 ~2mm', categoryId: 2, price: 55000, count: 8, code: 'S5A10', time: 15 },
        { id: 202, name: '돌출점 ~5mm', categoryId: 2, price: 77000, count: 2, code: 'S5A10', time: 15 },
        { id: 203, name: '돌출점 5mm이상', categoryId: 2, price: 110000, count: 2, code: 'S10A15', time: 25 },
        { id: 204, name: '비립종 눈가', categoryId: 2, price: 33000, count: 5, code: 'S5A10', time: 15 },
        { id: 205, name: '비립종 얼굴', categoryId: 2, price: 22000, count: 7, code: 'S5A10', time: 15 },
        { id: 206, name: '쥐젖 ~2mm', categoryId: 2, price: 22000, count: 4, code: 'S5A10', time: 15 },
        { id: 207, name: '쥐젖 ~5mm', categoryId: 2, price: 55000, count: 2, code: 'S5A10', time: 15 },
        { id: 208, name: '쥐젖 5mm이상', categoryId: 2, price: 110000, count: 1, code: 'S10A15', time: 25 },
        { id: 209, name: '쥐젖 목 전체', categoryId: 2, price: 440000, count: 1, code: 'S15A20', time: 35 },
        { id: 210, name: '편평사마귀 얼굴/목 ~100개', categoryId: 2, price: 319000, count: 28, code: 'S20A30', time: 50 },
        { id: 211, name: '편평사마귀 +100개 추가', categoryId: 2, price: 209000, count: 17, code: null, time: null },
        { id: 212, name: '한관종 1개', categoryId: 2, price: 33000, count: 2, code: 'S5A10', time: 15 },
        { id: 213, name: '한관종 전체 1회', categoryId: 2, price: 440000, count: 1, code: 'S20A30', time: 50 },
        { id: 214, name: '어븀 핀홀 1x1cm', categoryId: 2, price: 33000, count: 19, code: 'S10A15', time: 25 },
        { id: 215, name: '모낭상피종 1개', categoryId: 2, price: 33000, count: 5, code: 'S5A10', time: 15 },
        
        // 탄력쫀쫀
        { id: 301, name: 'BBL HERO 안티에이징+타이트닝 1회', categoryId: 3, price: 770000, count: 7, code: null, time: null },
        { id: 302, name: 'BBL HERO 안티에이징+타이트닝 3회', categoryId: 3, price: 1980000, count: 1, code: null, time: null },
        { id: 303, name: 'BBL HERO 타이트닝 1회', categoryId: 3, price: 440000, count: 4, code: 'H15N10A20', time: 45 },
        { id: 304, name: '아이모노실', categoryId: 3, price: 22000, count: 1, code: 'H10N5', time: 15 },
        
        // 탄력잔주름
        { id: 401, name: '스킨 코어 보톡스', categoryId: 4, price: 275000, count: 3, code: null, time: null },
        { id: 402, name: '주름 국산 보톡스', categoryId: 4, price: 44000, count: 3, code: 'H10N5', time: 15 },
        { id: 403, name: '주름 제오민 보톡스', categoryId: 4, price: 88000, count: 1, code: 'H10N5', time: 15 },
        { id: 404, name: '주름 코어 보톡스', categoryId: 4, price: 66000, count: 31, code: 'H10N5', time: 15 },
        
        // 탄력윤곽
        { id: 501, name: '사각턱 컨투어 코어', categoryId: 5, price: 110000, count: 17, code: null, time: null },
        { id: 502, name: '침샘,관자 컨투어 코어', categoryId: 5, price: 132000, count: 2, code: null, time: null },
        { id: 503, name: '지방분해주사 1cc', categoryId: 5, price: 55000, count: 1, code: 'H5N5', time: 10 },
        
        // 꺼짐볼륨
        { id: 601, name: '바비콜 1키트', categoryId: 6, price: 209000, count: 3, code: null, time: null },
        { id: 602, name: '바비콜 4cc event', categoryId: 6, price: 440000, count: 5, code: 'H25N10', time: 35 },
        { id: 603, name: '필러 추가', categoryId: 6, price: 220000, count: 11, code: 'H15N5', time: 20 },
        { id: 604, name: '로리앙 1cc', categoryId: 6, price: 209000, count: 1, code: null, time: null },
        
        // 꺼짐주름 (대박!)
        { id: 701, name: '쥬브젠10', categoryId: 7, price: 110000, count: 49, code: null, time: null },
        
        // Special 포다이스 (최고 매출!)
        { id: 801, name: '입술1부위', categoryId: 8, price: 209000, count: 60, code: null, time: null },
        { id: 802, name: '입술1부위 (예약금제외)', categoryId: 8, price: 99000, count: 26, code: null, time: null },
        { id: 803, name: '유착방지주사HN', categoryId: 8, price: 55000, count: 51, code: 'H5N5', time: 10 },
        
        // Special 흉터
        { id: 901, name: 'Mjoule 핀홀 1곳', categoryId: 9, price: 55000, count: 1, code: 'H10N5', time: 15 },
        { id: 902, name: 'Mjoule 흉터 치료 1x1cm', categoryId: 9, price: 330000, count: 1, code: null, time: null },
        { id: 903, name: '꺼진흉터 쥬브젠 1개', categoryId: 9, price: 55000, count: 1, code: 'H10N5', time: 15 },
        
        // Special 구멍
        { id: 1001, name: '미세절개수술40', categoryId: 10, price: 440000, count: 1, code: null, time: null },
        { id: 1002, name: '미세절개수술50', categoryId: 10, price: 550000, count: 11, code: null, time: null },
        { id: 1003, name: '미세절개수술60', categoryId: 10, price: 660000, count: 4, code: 'H50N20', time: 70 },
        { id: 1004, name: '추가10', categoryId: 10, price: 110000, count: 1, code: 'H10N5', time: 15 },
        { id: 1005, name: '추가20', categoryId: 10, price: 220000, count: 12, code: 'H20N10', time: 30 },
        
        // 모공
        { id: 1101, name: '라비앙 1회', categoryId: 11, price: 220000, count: 1, code: null, time: null },
        { id: 1102, name: '포텐자펌핑 1회', categoryId: 11, price: 550000, count: 1, code: 'H15N10A25', time: 50 },
        
        // 제모
        { id: 1201, name: 'BB파인제모 5회', categoryId: 12, price: 880000, count: 2, code: null, time: null },
        
        // 여드름
        { id: 1301, name: '3단계 압출+PTT+네오빔 1회', categoryId: 13, price: 330000, count: 1, code: null, time: null },
        { id: 1302, name: '3단계 압출+PTT+네오빔 5회', categoryId: 13, price: 1320000, count: 1, code: null, time: null },
        { id: 1303, name: 'BBL HERO 여드름 1회', categoryId: 13, price: 330000, count: 1, code: null, time: null },
        { id: 1304, name: '압출관리 1회', categoryId: 13, price: 66000, count: 7, code: 'N5A20', time: 25 },
        
        // 보톡스
        { id: 1401, name: '주름 국산', categoryId: 14, price: 44000, count: 1, code: null, time: null },
        { id: 1402, name: '주름 제오민2', categoryId: 14, price: 88000, count: 3, code: null, time: null },
        { id: 1403, name: '주름 코어', categoryId: 14, price: 66000, count: 12, code: null, time: null },
        { id: 1404, name: '턱 코어', categoryId: 14, price: 110000, count: 5, code: null, time: null },
        { id: 1405, name: '턱 제오민2', categoryId: 14, price: 165000, count: 1, code: null, time: null },
        
        // 부스터
        { id: 1501, name: '리쥬란HB 4cc', categoryId: 15, price: 539000, count: 8, code: null, time: null },
        { id: 1502, name: '리쥬네이쳐P 5cc', categoryId: 15, price: 539000, count: 2, code: null, time: null },
        { id: 1503, name: '물광주사 2cc', categoryId: 15, price: 110000, count: 5, code: 'H10N5A15', time: 30 },
        { id: 1504, name: '물광 6cc', categoryId: 15, price: 330000, count: 1, code: null, time: null },
        { id: 1505, name: '아이리쥬란 1cc', categoryId: 15, price: 209000, count: 1, code: 'H10N5A10', time: 25 },
        
        // 리프팅
        { id: 1601, name: '흑자 size별', categoryId: 16, price: 110000, count: 24, code: null, time: null },
        { id: 1602, name: 'BBL Hero 리프팅+하이드라', categoryId: 16, price: 605000, count: 1, code: null, time: null },
        { id: 1603, name: 'BBL Hero 전체+하이드라', categoryId: 16, price: 880000, count: 12, code: null, time: null },
        { id: 1604, name: '트리플실리프팅 1줄', categoryId: 16, price: 165000, count: 2, code: 'H15N10A20', time: 45 },
        { id: 1605, name: '흑자/잡티 I', categoryId: 16, price: 770000, count: 9, code: null, time: null },
        { id: 1606, name: '흑자/잡티 II', categoryId: 16, price: 1650000, count: 15, code: null, time: null },
        { id: 1607, name: '흑자/잡티 III', categoryId: 16, price: 3300000, count: 3, code: null, time: null },
        
        // 재생
        { id: 1701, name: 'LDM 12분', categoryId: 17, price: 88000, count: 4, code: null, time: null },
        { id: 1702, name: '라라필 1회', categoryId: 17, price: 88000, count: 2, code: null, time: null },
        { id: 1703, name: '하이드라페이셜 1,2,3단계', categoryId: 17, price: 275000, count: 3, code: 'N10A35', time: 45 },
        { id: 1704, name: '실펌 항염 1회', categoryId: 17, price: 330000, count: 1, code: null, time: null }
    ],

    // ============================================
    // 인력 데이터
    // ============================================
    staff: [
        { id: 1, name: '유경훈', role: 'H', roleLabel: '대표원장', status: 'available' },
        { id: 2, name: '김민정', role: 'S', roleLabel: '부원장', status: 'available' },
        { id: 3, name: '', role: 'S', roleLabel: '부원장', status: 'available' },
        { id: 4, name: '김간호사', role: 'N', roleLabel: '간호사', status: 'available' },
        { id: 5, name: '박관리사', role: 'A', roleLabel: '관리사', status: 'available' },
        { id: 6, name: '최관리사', role: 'A', roleLabel: '관리사', status: 'available' }
    ],
    
    // 인력 가용 수
    staffCapacity: {
        H: 1,
        S: 2,
        N: 1,
        A: 2
    },
    
    // 예약 데이터
    reservations: [],
    
    // 운영 시간
    operatingHours: {
        start: 9,
        end: 18,
        interval: 30
    },
    
    // 현재 선택된 날짜
    currentDate: new Date(),

    // ============================================
    // 헬퍼 함수들
    // ============================================
    
    getCategory(categoryId) {
        return this.categories.find(c => c.id === categoryId);
    },
    
    getTreatmentCode(treatment) {
        if (treatment.code) return treatment.code;
        const category = this.getCategory(treatment.categoryId);
        return category ? category.code : 'A15';
    },
    
    getTreatmentTime(treatment) {
        if (treatment.time) return treatment.time;
        const category = this.getCategory(treatment.categoryId);
        return category ? category.time : 15;
    },
    
    getTreatmentsByCategory(categoryId) {
        return this.treatments.filter(t => t.categoryId === categoryId);
    },
    
    getCategoryRevenue(categoryId) {
        return this.getTreatmentsByCategory(categoryId)
            .reduce((sum, t) => sum + (t.price * t.count), 0);
    },
    
    getCategoryCount(categoryId) {
        return this.getTreatmentsByCategory(categoryId)
            .reduce((sum, t) => sum + t.count, 0);
    },
    
    getTimeSlots() {
        const slots = [];
        for (let h = this.operatingHours.start; h < this.operatingHours.end; h++) {
            for (let m = 0; m < 60; m += this.operatingHours.interval) {
                slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
            }
        }
        return slots;
    },
    
    parseCode(code) {
        const result = {};
        const regex = /(HS|H|S|N|A)(\d+)/g;
        let match;
        while ((match = regex.exec(code)) !== null) {
            result[match[1]] = parseInt(match[2]);
        }
        return result;
    },
    
    getOccupiedStaff(date, time) {
        const occupied = { H: 0, S: 0, N: 0, A: 0 };
        this.reservations
            .filter(r => r.date === date && r.startTime <= time && r.endTime > time)
            .forEach(r => {
                const treatment = this.treatments.find(t => t.id === r.treatmentId);
                const code = treatment ? this.getTreatmentCode(treatment) : r.code;
                const required = this.parseCode(code);
                for (const [role] of Object.entries(required)) {
                    const actualRole = role === 'HS' ? 'S' : role;
                    occupied[actualRole] = (occupied[actualRole] || 0) + 1;
                }
            });
        return occupied;
    },
    
    checkAvailability(date, time, code) {
        const required = this.parseCode(code);
        const occupied = this.getOccupiedStaff(date, time);
        const result = {};
        for (const [role, count] of Object.entries(required)) {
            const actualRole = role === 'HS' ? 'S' : role;
            const capacity = role === 'HS' 
                ? this.staffCapacity['H'] + this.staffCapacity['S']
                : this.staffCapacity[actualRole] || 0;
            const used = occupied[actualRole] || 0;
            result[role] = {
                required: count,
                available: capacity - used,
                isAvailable: (capacity - used) >= 1
            };
        }
        return result;
    },
    
    // 새 시술 추가
    addTreatment(treatment) {
        const newId = Math.max(...this.treatments.map(t => t.id)) + 1;
        this.treatments.push({ ...treatment, id: newId });
        return newId;
    },
    
    // 시술 수정
    updateTreatment(id, updates) {
        const idx = this.treatments.findIndex(t => t.id === id);
        if (idx !== -1) {
            this.treatments[idx] = { ...this.treatments[idx], ...updates };
            return true;
        }
        return false;
    },
    
    // 시술 삭제
    deleteTreatment(id) {
        const idx = this.treatments.findIndex(t => t.id === id);
        if (idx !== -1) {
            this.treatments.splice(idx, 1);
            return true;
        }
        return false;
    },
    
    // 카테고리 추가
    addCategory(category) {
        const newId = Math.max(...this.categories.map(c => c.id)) + 1;
        this.categories.push({ ...category, id: newId });
        return newId;
    },
    
    // 카테고리 수정
    updateCategory(id, updates) {
        const idx = this.categories.findIndex(c => c.id === id);
        if (idx !== -1) {
            this.categories[idx] = { ...this.categories[idx], ...updates };
            return true;
        }
        return false;
    }
};

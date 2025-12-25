/* ===========================================
   App - 메인 애플리케이션 로직
   =========================================== */

const App = {
    // 초기화
    init() {
        console.log('🚀 Lumi CRM 초기화 중...');
        
        // 탭 네비게이션 초기화
        this.initNavigation();
        
        // 모든 컴포넌트 렌더링
        this.renderAll();
        
        console.log('✅ Lumi CRM 초기화 완료');
    },
    
    // 탭 네비게이션 초기화
    initNavigation() {
        Utils.$$('.nav-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.dataset.tab;
                this.switchTab(targetTab);
            });
        });
    },
    
    // 탭 전환
    switchTab(tabId) {
        // 네비게이션 업데이트
        Utils.$$('.nav-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabId);
        });
        
        // 패널 업데이트
        Utils.$$('.tab-panel').forEach(panel => {
            panel.classList.toggle('active', panel.id === tabId);
        });
        
        // 탭별 초기화
        if (tabId === 'reservation') {
            this.renderReservation();
        }
    },
    
    // 전체 렌더링
    renderAll() {
        // 객단가 전략 탭
        Components.renderPriceRankingChart();
        Components.renderProblemTreatments();
        Components.renderStrategyCards();
        
        // 콤비네이션 탭
        Components.renderLowPriceTreatments();
        Components.renderHighPriceTreatments();
        Components.renderPackageResult();
        Components.renderRecommendedCombos();
        
        // 예약 탭
        Components.renderStaffGrid();
        this.updateDateDisplay();
        Reservation.renderTimelineHeader();
        Reservation.renderTimelineBody();
        Reservation.renderTreatmentOptions();
        Reservation.renderTimeOptions();
        
        // 설정 탭
        Components.renderTreatmentSettings();
        Components.renderStaffConfig();
    },
    
    // 예약 탭 렌더링
    renderReservation() {
        this.updateDateDisplay();
        Reservation.renderTimelineHeader();
        Reservation.renderTimelineBody();
        Components.renderStaffGrid();
    },
    
    // 날짜 표시 업데이트
    updateDateDisplay() {
        const display = Utils.$('#currentDate');
        if (display) {
            display.textContent = Utils.formatDate(Data.currentDate);
        }
    },
    
    // 이전 날짜
    prevDay() {
        Data.currentDate.setDate(Data.currentDate.getDate() - 1);
        this.renderReservation();
    },
    
    // 다음 날짜
    nextDay() {
        Data.currentDate.setDate(Data.currentDate.getDate() + 1);
        this.renderReservation();
    },
    
    // 오늘로 이동
    goToday() {
        Data.currentDate = new Date();
        this.renderReservation();
    },
    
    // 저객단가 시술 선택
    selectLowPrice(id) {
        Data.selectedLowPrice = Data.selectedLowPrice === id ? null : id;
        Components.renderLowPriceTreatments();
        Components.renderPackageResult();
    },
    
    // 고객단가 시술 선택
    selectHighPrice(id) {
        Data.selectedHighPrice = Data.selectedHighPrice === id ? null : id;
        Components.renderHighPriceTreatments();
        Components.renderPackageResult();
    },
    
    // 시술 코드 업데이트
    updateTreatmentCode(id, code) {
        const treatment = Data.treatments.find(t => t.id === id);
        if (treatment) {
            treatment.code = code;
            // 총 시간 재계산
            const parsed = Data.parseCode(code);
            treatment.totalTime = Object.values(parsed).reduce((a, b) => a + b, 0);
            Utils.showToast('인력시간코드가 업데이트되었습니다', 'success');
        }
    },
    
    // 시술 Tier 업데이트
    updateTreatmentTier(id, tier) {
        const treatment = Data.treatments.find(t => t.id === id);
        if (treatment) {
            treatment.tier = parseInt(tier);
            Utils.showToast('Tier가 업데이트되었습니다', 'success');
        }
    },
    
    // 시술 편집
    editTreatment(id) {
        Utils.showToast('시술 편집 기능 (개발 예정)', 'info');
    },
    
    // 시술 삭제
    deleteTreatment(id) {
        if (confirm('정말 삭제하시겠습니까?')) {
            Data.treatments = Data.treatments.filter(t => t.id !== id);
            Components.renderTreatmentSettings();
            Utils.showToast('시술이 삭제되었습니다', 'success');
        }
    },
    
    // 인력 이름 업데이트
    updateStaffName(id, name) {
        const staff = Data.staff.find(s => s.id === id);
        if (staff) {
            staff.name = name;
        }
    },
    
    // 인력 역할 업데이트
    updateStaffRole(id, role) {
        const staff = Data.staff.find(s => s.id === id);
        if (staff) {
            staff.role = role;
            const roleLabels = { H: '대표원장', S: '부원장', N: '간호사', A: '관리사' };
            staff.roleLabel = roleLabels[role];
            Components.renderStaffConfig();
            Utils.showToast('역할이 업데이트되었습니다', 'success');
        }
    },
    
    // 인력 추가
    addStaff() {
        const newId = Math.max(...Data.staff.map(s => s.id)) + 1;
        Data.staff.push({
            id: newId,
            name: '새 직원',
            role: 'A',
            roleLabel: '관리사',
            status: 'available'
        });
        Data.staffCapacity.A++;
        Components.renderStaffConfig();
        Components.renderStaffGrid();
        Utils.showToast('새 인력이 추가되었습니다', 'success');
    },
    
    // 슬롯 클릭
    onSlotClick(date, time, role) {
        const cell = Utils.$(`.slot-cell[data-date="${date}"][data-time="${time}"][data-role="${role}"]`);
        if (cell && !cell.classList.contains('full')) {
            // 예약 모달 열기
            this.openReservationModal();
            Utils.$('#timeSelect').value = time;
            Reservation.updateAvailability();
        }
    },
    
    // 예약 모달 열기
    openReservationModal() {
        Utils.$('#reservationModal').classList.add('active');
        // 폼 초기화
        Utils.$('#customerName').value = '';
        Utils.$('#customerPhone').value = '';
        Utils.$('#treatmentSelect').value = '';
        Utils.$('#timeSelect').value = '';
        Utils.$('#selectedCode').textContent = '-';
        Utils.$('#slotAvailability').innerHTML = '';
    },
    
    // 모달 닫기
    closeModal() {
        Utils.$('#reservationModal').classList.remove('active');
    },
    
    // 예약 저장
    saveReservation() {
        if (Reservation.saveReservation()) {
            this.closeModal();
            this.renderReservation();
        }
    },
    
    // 네이버 동기화
    syncNaver() {
        Reservation.syncNaverReservation();
    }
};

// DOM 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// 전역 접근
window.App = App;

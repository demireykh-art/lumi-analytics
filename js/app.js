/* ===========================================
   App - 메인 애플리케이션 로직
   =========================================== */

const App = {
    editingTreatmentId: null,
    
    // ============================================
    // 초기화
    // ============================================
    init() {
        console.log('🚀 Lumi CRM 초기화...');
        this.initNavigation();
        this.renderAll();
        this.initFirebase();
        console.log('✅ 초기화 완료');
    },
    
    initFirebase() {
        if (typeof initFirebase === 'function') {
            initFirebase();
        }
    },
    
    initNavigation() {
        Utils.$$('.nav-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchTab(tab.dataset.tab);
            });
        });
    },
    
    switchTab(tabId) {
        Utils.$$('.nav-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabId);
        });
        Utils.$$('.tab-panel').forEach(panel => {
            panel.classList.toggle('active', panel.id === tabId);
        });
        
        // 탭별 렌더링
        if (tabId === 'reservation') this.renderReservation();
        if (tabId === 'categories') Components.renderCategoryGrid();
        if (tabId === 'treatments') Components.renderTreatmentTable();
        if (tabId === 'staff') this.renderStaffTab();
    },
    
    // ============================================
    // 전체 렌더링
    // ============================================
    renderAll() {
        // 대시보드
        Components.renderCategoryRevenueChart();
        Components.renderPriceAnalysis();
        Components.renderRecommendedCombos();
        
        // 카테고리
        Components.renderCategoryGrid();
        
        // 시술
        Components.renderTreatmentTable();
        
        // 콤비네이션
        this.renderCombinationTab();
        
        // 예약
        this.renderReservation();
        
        // 인력
        this.renderStaffTab();
    },
    
    // ============================================
    // 카테고리 관리
    // ============================================
    updateCategoryName(id, name) {
        Data.updateCategory(id, { name });
        Utils.showToast('카테고리명 수정됨', 'success');
        Components.renderTreatmentTable();
    },
    
    updateCategoryCode(id, code) {
        Data.updateCategory(id, { code });
        Utils.showToast('기본 인력시간코드 수정됨', 'success');
        Components.renderTreatmentTable();
    },
    
    updateCategoryTime(id, time) {
        Data.updateCategory(id, { time: parseInt(time) });
        Utils.showToast('기본 소요시간 수정됨', 'success');
        Components.renderTreatmentTable();
    },
    
    addCategory() {
        const colors = ['#f472b6', '#fb923c', '#a78bfa', '#22d3ee', '#84cc16', '#f43f5e'];
        const newId = Data.addCategory({
            name: '새 카테고리',
            code: 'A15',
            time: 15,
            color: colors[Math.floor(Math.random() * colors.length)]
        });
        Utils.showToast('카테고리 추가됨', 'success');
        Components.renderCategoryGrid();
    },
    
    // ============================================
    // 시술 관리
    // ============================================
    openAddTreatmentModal() {
        this.editingTreatmentId = null;
        Utils.$('#treatmentName').value = '';
        Utils.$('#treatmentPrice').value = '';
        Utils.$('#treatmentCode').value = '';
        Utils.$('#treatmentTime').value = '';
        Components.renderCategorySelect('treatmentCategory');
        Utils.$('#treatmentModal').classList.add('active');
    },
    
    editTreatment(id) {
        const treatment = Data.treatments.find(t => t.id === id);
        if (!treatment) return;
        
        this.editingTreatmentId = id;
        Utils.$('#treatmentName').value = treatment.name;
        Utils.$('#treatmentPrice').value = treatment.price;
        Utils.$('#treatmentCode').value = treatment.code || '';
        Utils.$('#treatmentTime').value = treatment.time || '';
        Components.renderCategorySelect('treatmentCategory', treatment.categoryId);
        Utils.$('#treatmentModal').classList.add('active');
    },
    
    saveTreatment() {
        const name = Utils.$('#treatmentName').value.trim();
        const categoryId = parseInt(Utils.$('#treatmentCategory').value);
        const price = parseInt(Utils.$('#treatmentPrice').value) || 0;
        const code = Utils.$('#treatmentCode').value.trim() || null;
        const time = parseInt(Utils.$('#treatmentTime').value) || null;
        
        if (!name || !categoryId) {
            Utils.showToast('시술명과 카테고리를 입력하세요', 'error');
            return;
        }
        
        if (this.editingTreatmentId) {
            Data.updateTreatment(this.editingTreatmentId, { name, categoryId, price, code, time });
            Utils.showToast('시술 수정됨', 'success');
        } else {
            Data.addTreatment({ name, categoryId, price, code, time, count: 0 });
            Utils.showToast('시술 추가됨', 'success');
        }
        
        this.closeModal('treatmentModal');
        Components.renderTreatmentTable();
        Components.renderCategoryGrid();
    },
    
    deleteTreatment(id) {
        if (!confirm('정말 삭제하시겠습니까?')) return;
        Data.deleteTreatment(id);
        Utils.showToast('시술 삭제됨', 'success');
        Components.renderTreatmentTable();
        Components.renderCategoryGrid();
    },
    
    updateTreatmentCode(id, code) {
        Data.updateTreatment(id, { code: code.trim() || null });
        Utils.showToast('인력시간코드 수정됨', 'success');
        Components.renderTreatmentTable();
    },
    
    updateTreatmentTime(id, time) {
        Data.updateTreatment(id, { time: parseInt(time) || null });
        Utils.showToast('소요시간 수정됨', 'success');
        Components.renderTreatmentTable();
    },
    
    filterTreatments(keyword) {
        const rows = Utils.$$('#treatmentTableBody tr:not(.category-row)');
        const lowerKeyword = keyword.toLowerCase();
        
        rows.forEach(row => {
            const name = row.querySelector('.treatment-name')?.textContent.toLowerCase() || '';
            row.style.display = name.includes(lowerKeyword) ? '' : 'none';
        });
    },
    
    // ============================================
    // 콤비네이션 탭
    // ============================================
    renderCombinationTab() {
        const lowContainer = Utils.$('#lowPriceCategories');
        const highContainer = Utils.$('#highPriceCategories');
        
        if (!lowContainer || !highContainer) return;
        
        const catStats = Data.categories.map(c => {
            const count = Data.getCategoryCount(c.id);
            const revenue = Data.getCategoryRevenue(c.id);
            return { ...c, avgPrice: count > 0 ? revenue / count : 0 };
        }).filter(c => c.avgPrice > 0);
        
        const low = catStats.filter(c => c.avgPrice < 300000);
        const high = catStats.filter(c => c.avgPrice >= 500000);
        
        lowContainer.innerHTML = low.map(c => `
            <div class="category-item" onclick="App.selectComboCategory(${c.id}, 'low')" 
                 style="border-left: 3px solid ${c.color}">
                <span class="name">${c.name}</span>
                <span class="price">${Utils.formatMoney(c.avgPrice)}</span>
            </div>
        `).join('') || '<div class="empty">해당 카테고리 없음</div>';
        
        highContainer.innerHTML = high.map(c => `
            <div class="category-item" onclick="App.selectComboCategory(${c.id}, 'high')"
                 style="border-left: 3px solid ${c.color}">
                <span class="name">${c.name}</span>
                <span class="price">${Utils.formatMoney(c.avgPrice)}</span>
            </div>
        `).join('') || '<div class="empty">해당 카테고리 없음</div>';
    },
    
    selectComboCategory(id, type) {
        const items = Utils.$$(`#${type === 'low' ? 'lowPriceCategories' : 'highPriceCategories'} .category-item`);
        items.forEach(item => item.classList.remove('selected'));
        event.currentTarget.classList.add('selected');
        this.updatePackageBuilder();
    },
    
    updatePackageBuilder() {
        const builder = Utils.$('#packageBuilder');
        const lowSelected = Utils.$('#lowPriceCategories .category-item.selected');
        const highSelected = Utils.$('#highPriceCategories .category-item.selected');
        
        if (!lowSelected && !highSelected) {
            builder.innerHTML = '<div class="empty-state">카테고리를 선택하세요</div>';
            return;
        }
        
        let items = [];
        let totalPrice = 0;
        
        if (lowSelected) {
            const cat = Data.categories.find(c => c.name === lowSelected.querySelector('.name').textContent);
            const treatments = Data.getTreatmentsByCategory(cat.id).slice(0, 2);
            treatments.forEach(t => {
                items.push(t.name);
                totalPrice += t.price;
            });
        }
        
        if (highSelected) {
            const cat = Data.categories.find(c => c.name === highSelected.querySelector('.name').textContent);
            const treatments = Data.getTreatmentsByCategory(cat.id).slice(0, 1);
            treatments.forEach(t => {
                items.push(t.name);
                totalPrice += t.price;
            });
        }
        
        const discounted = Math.round(totalPrice * 0.85);
        
        builder.innerHTML = `
            <div class="package-card">
                <h4>✨ 맞춤 패키지</h4>
                <ul>${items.map(i => `<li>✓ ${i}</li>`).join('')}</ul>
                <div class="package-total">
                    <div class="original">${Utils.formatMoney(totalPrice)}</div>
                    <div class="discounted">${Utils.formatMoney(discounted)}</div>
                </div>
                <div class="savings">💰 ${Utils.formatMoney(totalPrice - discounted)} 할인 (15%)</div>
            </div>
        `;
    },
    
    // ============================================
    // 예약 관리
    // ============================================
    renderReservation() {
        this.updateDateDisplay();
        Components.renderStaffGrid();
        Components.renderTreatmentSelect('reservationTreatment');
        this.renderTimeSelect();
        this.renderTimeline();
    },
    
    updateDateDisplay() {
        const display = Utils.$('#currentDate');
        if (display) display.textContent = Utils.formatDate(Data.currentDate);
    },
    
    prevDay() {
        Data.currentDate.setDate(Data.currentDate.getDate() - 1);
        this.renderReservation();
    },
    
    nextDay() {
        Data.currentDate.setDate(Data.currentDate.getDate() + 1);
        this.renderReservation();
    },
    
    goToday() {
        Data.currentDate = new Date();
        this.renderReservation();
    },
    
    renderTimeSelect() {
        const select = Utils.$('#reservationTime');
        if (!select) return;
        
        const slots = Data.getTimeSlots();
        select.innerHTML = `
            <option value="">시간 선택</option>
            ${slots.map(s => `<option value="${s}">${s}</option>`).join('')}
        `;
    },
    
    renderTimeline() {
        const header = Utils.$('#timelineHeader');
        const body = Utils.$('#timelineBody');
        if (!header || !body) return;
        
        const roles = ['H', 'S', 'N', 'A'];
        const roleLabels = { H: '대표원장', S: '부원장', N: '간호사', A: '관리사' };
        
        header.innerHTML = roles.map(r => `
            <div class="staff-col">${roleLabels[r]} (${Data.staffCapacity[r]})</div>
        `).join('');
        
        const slots = Data.getTimeSlots();
        const dateStr = Utils.toISODate(Data.currentDate);
        
        body.innerHTML = slots.map(time => {
            const occupied = Data.getOccupiedStaff(dateStr, time);
            
            return `
                <div class="timeline-row">
                    <div class="time-col">${time}</div>
                    <div class="staff-cols">
                        ${roles.map(role => {
                            const used = occupied[role] || 0;
                            const capacity = Data.staffCapacity[role];
                            const available = capacity - used;
                            let statusClass = 'available';
                            if (available === 0) statusClass = 'full';
                            else if (used > 0) statusClass = 'partial';
                            
                            return `<div class="slot-cell ${statusClass}">${available}/${capacity}</div>`;
                        }).join('')}
                    </div>
                </div>
            `;
        }).join('');
    },
    
    onTreatmentSelect() {
        const select = Utils.$('#reservationTreatment');
        const option = select.options[select.selectedIndex];
        
        if (option && option.dataset.code) {
            Utils.$('#selectedTreatmentCode').textContent = option.dataset.code;
            Utils.$('#selectedTreatmentTime').textContent = option.dataset.time + '분';
        } else {
            Utils.$('#selectedTreatmentCode').textContent = '-';
            Utils.$('#selectedTreatmentTime').textContent = '-';
        }
        
        this.checkSlotAvailability();
    },
    
    checkSlotAvailability() {
        const container = Utils.$('#slotAvailability');
        const treatmentId = Utils.$('#reservationTreatment').value;
        const time = Utils.$('#reservationTime').value;
        
        if (!treatmentId || !time) {
            container.innerHTML = '';
            return;
        }
        
        const treatment = Data.treatments.find(t => t.id == treatmentId);
        const code = Data.getTreatmentCode(treatment);
        const dateStr = Utils.toISODate(Data.currentDate);
        const availability = Data.checkAvailability(dateStr, time, code);
        
        const roleLabels = { H: '대표원장', S: '부원장', HS: '원장', N: '간호사', A: '관리사' };
        const allAvailable = Object.values(availability).every(v => v.isAvailable);
        
        container.innerHTML = `
            <div class="availability-header">${allAvailable ? '✅ 예약 가능' : '❌ 인력 부족'}</div>
            <div class="availability-grid">
                ${Object.entries(availability).map(([role, info]) => `
                    <div class="availability-item ${info.isAvailable ? 'ok' : 'fail'}">
                        <span class="role">${roleLabels[role]}</span>
                        <span class="status">${info.available} 가용</span>
                    </div>
                `).join('')}
            </div>
        `;
    },
    
    openReservationModal() {
        Utils.$('#customerName').value = '';
        Utils.$('#customerPhone').value = '';
        Utils.$('#reservationTreatment').value = '';
        Utils.$('#reservationTime').value = '';
        Utils.$('#selectedTreatmentCode').textContent = '-';
        Utils.$('#selectedTreatmentTime').textContent = '-';
        Utils.$('#slotAvailability').innerHTML = '';
        Utils.$('#reservationModal').classList.add('active');
    },
    
    saveReservation() {
        const name = Utils.$('#customerName').value.trim();
        const phone = Utils.$('#customerPhone').value.trim();
        const treatmentId = parseInt(Utils.$('#reservationTreatment').value);
        const startTime = Utils.$('#reservationTime').value;
        
        if (!name || !treatmentId || !startTime) {
            Utils.showToast('필수 항목을 입력하세요', 'error');
            return;
        }
        
        const treatment = Data.treatments.find(t => t.id === treatmentId);
        const code = Data.getTreatmentCode(treatment);
        const time = Data.getTreatmentTime(treatment);
        const dateStr = Utils.toISODate(Data.currentDate);
        
        // 가용성 확인
        const availability = Data.checkAvailability(dateStr, startTime, code);
        if (!Object.values(availability).every(v => v.isAvailable)) {
            Utils.showToast('해당 시간에 가용 인력이 부족합니다', 'error');
            return;
        }
        
        // 종료 시간 계산
        const [h, m] = startTime.split(':').map(Number);
        const endMinutes = h * 60 + m + time;
        const endTime = `${String(Math.floor(endMinutes / 60)).padStart(2, '0')}:${String(endMinutes % 60).padStart(2, '0')}`;
        
        Data.reservations.push({
            id: Date.now(),
            patientName: name,
            phone,
            treatmentId,
            date: dateStr,
            startTime,
            endTime,
            code,
            status: 'confirmed'
        });
        
        Utils.showToast('예약 등록 완료', 'success');
        this.closeModal('reservationModal');
        this.renderTimeline();
    },
    
    // ============================================
    // 인력 관리
    // ============================================
    renderStaffTab() {
        Components.renderStaffConfig();
        this.updateCapacityDisplay();
    },
    
    updateCapacityDisplay() {
        const counts = { H: 0, S: 0, N: 0, A: 0 };
        Data.staff.forEach(s => counts[s.role]++);
        
        Utils.$('#capacityH').textContent = counts.H;
        Utils.$('#capacityS').textContent = counts.S;
        Utils.$('#capacityN').textContent = counts.N;
        Utils.$('#capacityA').textContent = counts.A;
        
        Data.staffCapacity = counts;
    },
    
    updateStaffName(id, name) {
        const staff = Data.staff.find(s => s.id === id);
        if (staff) staff.name = name;
        Utils.showToast('이름 수정됨', 'success');
    },
    
    updateStaffRole(id, role) {
        const staff = Data.staff.find(s => s.id === id);
        if (staff) {
            staff.role = role;
            const labels = { H: '대표원장', S: '부원장', N: '간호사', A: '관리사' };
            staff.roleLabel = labels[role];
        }
        Utils.showToast('역할 수정됨', 'success');
        this.updateCapacityDisplay();
        Components.renderStaffConfig();
    },
    
    addStaff() {
        const newId = Math.max(...Data.staff.map(s => s.id), 0) + 1;
        Data.staff.push({
            id: newId,
            name: '',
            role: 'A',
            roleLabel: '관리사',
            status: 'available'
        });
        Utils.showToast('인력 추가됨', 'success');
        this.renderStaffTab();
    },
    
    deleteStaff(id) {
        const idx = Data.staff.findIndex(s => s.id === id);
        if (idx !== -1) {
            Data.staff.splice(idx, 1);
            Utils.showToast('인력 삭제됨', 'success');
            this.renderStaffTab();
        }
    },
    
    // ============================================
    // 공통
    // ============================================
    closeModal(modalId) {
        Utils.$(`#${modalId}`).classList.remove('active');
    },
    
    syncNaver() {
        Utils.showToast('네이버 예약 동기화 중...', 'info');
        setTimeout(() => {
            Utils.showToast('동기화 완료 (시뮬레이션)', 'success');
            Utils.$('#connectionStatus').textContent = '연결됨';
            Utils.$('.status-badge').classList.add('online');
        }, 1500);
    }
};

// DOM 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => App.init());

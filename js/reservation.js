/* ===========================================
   Reservation - 예약 관리 시스템
   =========================================== */

const Reservation = {
    // 타임라인 헤더 렌더링
    renderTimelineHeader() {
        const container = Utils.$('#staffColumns');
        
        // 역할별로 그룹화
        const roles = [
            { code: 'H', label: '대표원장' },
            { code: 'S', label: '부원장' },
            { code: 'N', label: '간호사' },
            { code: 'A', label: '관리사' }
        ];
        
        container.innerHTML = roles.map(r => `
            <div class="staff-column-header">${r.label} (${Data.staffCapacity[r.code]})</div>
        `).join('');
    },
    
    // 타임라인 본문 렌더링
    renderTimelineBody() {
        const container = Utils.$('#timelineBody');
        const slots = Data.getTimeSlots();
        const dateStr = Utils.toISODate(Data.currentDate);
        
        container.innerHTML = slots.map(time => {
            const roles = ['H', 'S', 'N', 'A'];
            
            return `
                <div class="timeline-row">
                    <div class="time-cell">${time}</div>
                    <div class="slot-cells">
                        ${roles.map(role => this.renderSlotCell(dateStr, time, role)).join('')}
                    </div>
                </div>
            `;
        }).join('');
    },
    
    // 개별 슬롯 셀 렌더링
    renderSlotCell(date, time, role) {
        const occupied = Data.getOccupiedStaff(date, time);
        const capacity = Data.staffCapacity[role];
        const used = occupied[role] || 0;
        
        let statusClass = 'available';
        if (used >= capacity) statusClass = 'full';
        else if (used > 0) statusClass = 'partial';
        
        // 해당 시간에 예약이 있는지 확인
        const reservation = Data.reservations.find(r => 
            r.date === date && 
            r.startTime === time &&
            Data.parseCode(r.code)[role]
        );
        
        let content = '';
        if (reservation) {
            content = `
                <div class="reservation-block">
                    <div class="patient">${reservation.patientName}</div>
                    <div class="treatment">${reservation.treatmentName}</div>
                </div>
            `;
        }
        
        return `
            <div class="slot-cell ${statusClass}" 
                 data-date="${date}" data-time="${time}" data-role="${role}"
                 onclick="App.onSlotClick('${date}', '${time}', '${role}')">
                ${content}
            </div>
        `;
    },
    
    // 예약 모달 시술 선택 옵션 렌더링
    renderTreatmentOptions() {
        const select = Utils.$('#treatmentSelect');
        select.innerHTML = `
            <option value="">시술을 선택하세요</option>
            ${Data.treatments.map(t => `
                <option value="${t.id}" data-code="${t.code}">${t.name} (${t.code})</option>
            `).join('')}
        `;
        
        select.addEventListener('change', () => this.onTreatmentChange());
    },
    
    // 시간 선택 옵션 렌더링
    renderTimeOptions() {
        const select = Utils.$('#timeSelect');
        const slots = Data.getTimeSlots();
        
        select.innerHTML = `
            <option value="">시간을 선택하세요</option>
            ${slots.map(time => `
                <option value="${time}">${time}</option>
            `).join('')}
        `;
        
        select.addEventListener('change', () => this.onTimeChange());
    },
    
    // 시술 변경 시
    onTreatmentChange() {
        const select = Utils.$('#treatmentSelect');
        const codeDisplay = Utils.$('#selectedCode');
        const selectedOption = select.options[select.selectedIndex];
        
        if (selectedOption && selectedOption.dataset.code) {
            codeDisplay.textContent = selectedOption.dataset.code;
        } else {
            codeDisplay.textContent = '-';
        }
        
        this.updateAvailability();
    },
    
    // 시간 변경 시
    onTimeChange() {
        this.updateAvailability();
    },
    
    // 가용성 업데이트
    updateAvailability() {
        const container = Utils.$('#slotAvailability');
        const treatmentSelect = Utils.$('#treatmentSelect');
        const timeSelect = Utils.$('#timeSelect');
        
        const treatmentId = treatmentSelect.value;
        const time = timeSelect.value;
        
        if (!treatmentId || !time) {
            container.innerHTML = '';
            return;
        }
        
        const treatment = Data.treatments.find(t => t.id == treatmentId);
        const dateStr = Utils.toISODate(Data.currentDate);
        const availability = Data.checkAvailability(dateStr, time, treatment.code);
        
        const slots = Object.entries(availability).map(([role, info]) => {
            const isAvailable = info.isAvailable;
            const roleLabels = { H: '대표원장', S: '부원장', HS: '원장', N: '간호사', A: '관리사' };
            
            return `
                <span class="slot ${isAvailable ? 'available' : 'unavailable'}">
                    ${roleLabels[role]}: ${info.available}/${info.required}
                </span>
            `;
        }).join('');
        
        const allAvailable = Object.values(availability).every(v => v.isAvailable);
        
        container.innerHTML = `
            <h4>인력 가용 현황 ${allAvailable ? '✅' : '❌'}</h4>
            <div class="slot-indicator">${slots}</div>
        `;
    },
    
    // 예약 저장
    saveReservation() {
        const customerName = Utils.$('#customerName').value;
        const customerPhone = Utils.$('#customerPhone').value;
        const treatmentId = parseInt(Utils.$('#treatmentSelect').value);
        const startTime = Utils.$('#timeSelect').value;
        
        if (!customerName || !treatmentId || !startTime) {
            Utils.showToast('모든 필드를 입력해주세요', 'error');
            return false;
        }
        
        const treatment = Data.treatments.find(t => t.id === treatmentId);
        const dateStr = Utils.toISODate(Data.currentDate);
        
        // 가용성 확인
        const availability = Data.checkAvailability(dateStr, startTime, treatment.code);
        const allAvailable = Object.values(availability).every(v => v.isAvailable);
        
        if (!allAvailable) {
            Utils.showToast('해당 시간에 가용 인력이 부족합니다', 'error');
            return false;
        }
        
        // 종료 시간 계산
        const [hours, mins] = startTime.split(':').map(Number);
        const endMinutes = hours * 60 + mins + treatment.totalTime;
        const endHour = Math.floor(endMinutes / 60);
        const endMin = endMinutes % 60;
        const endTime = `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;
        
        // 새 예약 추가
        const newReservation = {
            id: Date.now(),
            patientName: customerName,
            phone: customerPhone,
            treatmentId: treatmentId,
            treatmentName: treatment.name,
            date: dateStr,
            startTime: startTime,
            endTime: endTime,
            staffIds: [],
            status: 'confirmed',
            code: treatment.code
        };
        
        Data.reservations.push(newReservation);
        Utils.showToast('예약이 등록되었습니다', 'success');
        
        return true;
    },
    
    // 네이버 예약 동기화 (시뮬레이션)
    syncNaverReservation() {
        Utils.showToast('네이버 예약 동기화 중...', 'info');
        
        // 실제 구현 시 네이버 API 연동
        setTimeout(() => {
            Utils.showToast('네이버 예약 동기화 완료 (3건)', 'success');
        }, 1500);
    }
};

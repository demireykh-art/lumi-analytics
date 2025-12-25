/* ===========================================
   Utils - 유틸리티 함수
   =========================================== */

const Utils = {
    // 금액 포맷팅
    formatMoney(num, showUnit = true) {
        if (num >= 100000000) {
            return (num / 100000000).toFixed(1) + (showUnit ? '억' : '');
        }
        if (num >= 10000) {
            return Math.round(num / 10000).toLocaleString() + (showUnit ? '만' : '');
        }
        return num.toLocaleString() + (showUnit ? '원' : '');
    },
    
    // 날짜 포맷팅
    formatDate(date) {
        const d = new Date(date);
        const days = ['일', '월', '화', '수', '목', '금', '토'];
        const year = d.getFullYear();
        const month = d.getMonth() + 1;
        const day = d.getDate();
        const dayName = days[d.getDay()];
        return `${year}년 ${month}월 ${day}일 (${dayName})`;
    },
    
    // ISO 날짜 문자열
    toISODate(date) {
        const d = new Date(date);
        return d.toISOString().split('T')[0];
    },
    
    // 요소 선택
    $(selector) {
        return document.querySelector(selector);
    },
    
    $$(selector) {
        return document.querySelectorAll(selector);
    },
    
    // 토스트 메시지
    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast show ${type}`;
        setTimeout(() => toast.classList.remove('show'), 3000);
    }
};

/* ===========================================
   Components - UI 컴포넌트 렌더링
   =========================================== */

const Components = {
    // 객단가 순위 차트 렌더링
    renderPriceRankingChart() {
        const container = Utils.$('#priceRankingChart');
        const sorted = [...Data.treatments].sort((a, b) => b.avgPrice - a.avgPrice);
        const maxPrice = sorted[0].avgPrice;
        
        container.innerHTML = sorted.map(t => {
            const percentage = (t.avgPrice / maxPrice) * 100;
            let barClass = 'high';
            if (t.avgPrice < 4000000) barClass = 'medium';
            if (t.avgPrice < 2500000) barClass = 'low';
            
            return `
                <div class="price-bar">
                    <div class="price-bar-label">${t.name}</div>
                    <div class="price-bar-track">
                        <div class="price-bar-fill ${barClass}" style="width: ${percentage}%">
                            ${Utils.formatMoney(t.avgPrice)}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },
    
    // 문제 시술 렌더링
    renderProblemTreatments() {
        const container = Utils.$('#problemTreatments');
        const problems = Data.treatments
            .filter(t => t.avgPrice < 4000000)
            .sort((a, b) => a.avgPrice - b.avgPrice);
        
        const suggestions = {
            '피부제모': '→ 모공/결 패키지 연계',
            '피부돌출': '→ 탄력쫀쫀 업셀링',
            '피부모공/결': '→ 피부색소 연계',
            '탄력잔주름': '→ 탄력쫀쫀 업그레이드'
        };
        
        container.innerHTML = problems.map(t => `
            <div class="problem-item">
                <div>
                    <div class="name">${t.name}</div>
                    <div class="suggestion">${suggestions[t.name] || ''}</div>
                </div>
                <div class="price">${Utils.formatMoney(t.avgPrice)}</div>
            </div>
        `).join('');
    },
    
    // 전략 카드 렌더링
    renderStrategyCards() {
        const container = Utils.$('#strategyCards');
        container.innerHTML = Data.strategies.map(s => `
            <div class="strategy-card">
                <div class="icon">${s.icon}</div>
                <h4>${s.title}</h4>
                <p>${s.description}</p>
                <div class="impact">${s.impact}</div>
            </div>
        `).join('');
    },
    
    // 저객단가 시술 목록 렌더링
    renderLowPriceTreatments() {
        const container = Utils.$('#lowPriceTreatments');
        const treatments = Data.getLowPriceTreatments();
        
        container.innerHTML = treatments.map(t => `
            <div class="treatment-item ${Data.selectedLowPrice === t.id ? 'selected' : ''}" 
                 data-id="${t.id}" onclick="App.selectLowPrice(${t.id})">
                <span class="name">${t.name}</span>
                <span class="price">${Utils.formatMoney(t.avgPrice)}</span>
            </div>
        `).join('');
    },
    
    // 고객단가 시술 목록 렌더링
    renderHighPriceTreatments() {
        const container = Utils.$('#highPriceTreatments');
        const treatments = Data.getHighPriceTreatments();
        
        container.innerHTML = treatments.map(t => `
            <div class="treatment-item ${Data.selectedHighPrice === t.id ? 'selected' : ''}" 
                 data-id="${t.id}" onclick="App.selectHighPrice(${t.id})">
                <span class="name">${t.name}</span>
                <span class="price">${Utils.formatMoney(t.avgPrice)}</span>
            </div>
        `).join('');
    },
    
    // 패키지 결과 렌더링
    renderPackageResult() {
        const container = Utils.$('#packageResult');
        
        if (!Data.selectedLowPrice || !Data.selectedHighPrice) {
            container.innerHTML = '<div class="empty-state">좌측에서 시술을 선택하세요</div>';
            return;
        }
        
        const low = Data.treatments.find(t => t.id === Data.selectedLowPrice);
        const high = Data.treatments.find(t => t.id === Data.selectedHighPrice);
        const total = low.avgPrice + high.avgPrice;
        const discounted = Math.round(total * 0.85);
        const savings = total - discounted;
        
        container.innerHTML = `
            <div class="package-card">
                <h4>✨ ${low.name} + ${high.name} 패키지</h4>
                <ul class="items">
                    <li>${low.name} (${Utils.formatMoney(low.avgPrice)})</li>
                    <li>${high.name} (${Utils.formatMoney(high.avgPrice)})</li>
                    <li>사후관리 1회 포함</li>
                </ul>
                <div class="total">
                    <span>패키지 가격</span>
                    <span class="value">${Utils.formatMoney(discounted)}</span>
                </div>
                <div class="savings">💰 ${Utils.formatMoney(savings)} 할인 (15%)</div>
            </div>
        `;
    },
    
    // 추천 콤비네이션 렌더링
    renderRecommendedCombos() {
        const container = Utils.$('#recommendedCombos');
        
        container.innerHTML = Data.recommendedCombos.map(c => `
            <div class="combo-card">
                <div class="combo-name">${c.name}</div>
                <div class="combo-target">${c.target}</div>
                <ul class="combo-items">
                    ${c.items.map(item => `<li>${item}</li>`).join('')}
                </ul>
                <div class="combo-price">
                    <span class="original">${Utils.formatMoney(c.originalPrice)}</span>
                    <span class="discounted">${Utils.formatMoney(c.discountedPrice)}</span>
                </div>
                <div class="upsell-potential">${c.upsellPotential}</div>
            </div>
        `).join('');
    },
    
    // 인력 현황 렌더링
    renderStaffGrid() {
        const container = Utils.$('#staffGrid');
        
        container.innerHTML = Data.staff.map(s => `
            <div class="staff-card">
                <div class="staff-avatar ${s.role}">${s.name.charAt(0)}</div>
                <div class="staff-info">
                    <div class="name">${s.name}</div>
                    <div class="role">${s.roleLabel}</div>
                </div>
                <div class="staff-status-badge ${s.status}">${s.status === 'available' ? '가용' : '점유'}</div>
            </div>
        `).join('');
    },
    
    // 시술 설정 테이블 렌더링
    renderTreatmentSettings() {
        const container = Utils.$('#treatmentSettingsBody');
        
        container.innerHTML = Data.treatments.map(t => `
            <tr data-id="${t.id}">
                <td>${t.name}</td>
                <td>${t.category}</td>
                <td>${Utils.formatMoney(t.avgPrice)}</td>
                <td>
                    <input type="text" value="${t.code}" 
                           onchange="App.updateTreatmentCode(${t.id}, this.value)">
                </td>
                <td>${t.totalTime}분</td>
                <td>
                    <select class="tier-select" onchange="App.updateTreatmentTier(${t.id}, this.value)">
                        <option value="1" ${t.tier === 1 ? 'selected' : ''}>Tier 1</option>
                        <option value="2" ${t.tier === 2 ? 'selected' : ''}>Tier 2</option>
                        <option value="3" ${t.tier === 3 ? 'selected' : ''}>Tier 3</option>
                    </select>
                </td>
                <td>
                    <button class="btn-icon-sm edit" onclick="App.editTreatment(${t.id})">✏️</button>
                    <button class="btn-icon-sm delete" onclick="App.deleteTreatment(${t.id})">🗑️</button>
                </td>
            </tr>
        `).join('');
    },
    
    // 인력 설정 렌더링
    renderStaffConfig() {
        const container = Utils.$('#staffConfigGrid');
        
        container.innerHTML = Data.staff.map(s => `
            <div class="staff-config-card" data-id="${s.id}">
                <div class="avatar" style="background: ${this.getRoleColor(s.role)}">${s.name.charAt(0)}</div>
                <div class="details">
                    <input type="text" class="name-input" value="${s.name}" 
                           onchange="App.updateStaffName(${s.id}, this.value)">
                    <select class="role-select" onchange="App.updateStaffRole(${s.id}, this.value)">
                        <option value="H" ${s.role === 'H' ? 'selected' : ''}>대표원장 (H)</option>
                        <option value="S" ${s.role === 'S' ? 'selected' : ''}>부원장 (S)</option>
                        <option value="N" ${s.role === 'N' ? 'selected' : ''}>간호사 (N)</option>
                        <option value="A" ${s.role === 'A' ? 'selected' : ''}>관리사 (A)</option>
                    </select>
                </div>
            </div>
        `).join('');
    },
    
    // 역할별 색상
    getRoleColor(role) {
        const colors = {
            H: 'linear-gradient(135deg, #f472b6, #6366f1)',
            S: 'linear-gradient(135deg, #6366f1, #22d3ee)',
            N: 'linear-gradient(135deg, #10b981, #22d3ee)',
            A: 'linear-gradient(135deg, #f59e0b, #f472b6)'
        };
        return colors[role] || colors.A;
    }
};

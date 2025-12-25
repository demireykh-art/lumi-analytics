/* ===========================================
   Utils - 유틸리티 함수
   =========================================== */

const Utils = {
    formatMoney(num, showUnit = true) {
        if (num >= 100000000) {
            return (num / 100000000).toFixed(1) + (showUnit ? '억' : '');
        }
        if (num >= 10000) {
            return Math.round(num / 10000).toLocaleString() + (showUnit ? '만' : '');
        }
        return num.toLocaleString() + (showUnit ? '원' : '');
    },
    
    formatDate(date) {
        const d = new Date(date);
        const days = ['일', '월', '화', '수', '목', '금', '토'];
        return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${days[d.getDay()]})`;
    },
    
    toISODate(date) {
        return new Date(date).toISOString().split('T')[0];
    },
    
    $(selector) {
        return document.querySelector(selector);
    },
    
    $$(selector) {
        return document.querySelectorAll(selector);
    },
    
    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        if (toast) {
            toast.textContent = message;
            toast.className = `toast show ${type}`;
            setTimeout(() => toast.classList.remove('show'), 3000);
        }
    }
};

/* ===========================================
   Components - UI 컴포넌트 렌더링
   =========================================== */

const Components = {
    
    // ============================================
    // 카테고리 관리 렌더링
    // ============================================
    renderCategoryGrid() {
        const container = Utils.$('#categoryGrid');
        if (!container) return;
        
        container.innerHTML = Data.categories.map(cat => {
            const revenue = Data.getCategoryRevenue(cat.id);
            const count = Data.getCategoryCount(cat.id);
            const treatmentCount = Data.getTreatmentsByCategory(cat.id).length;
            
            return `
                <div class="category-card" data-id="${cat.id}" style="border-left: 4px solid ${cat.color}">
                    <div class="category-header">
                        <span class="category-color" style="background: ${cat.color}"></span>
                        <input type="text" class="category-name-input" value="${cat.name}" 
                               onchange="App.updateCategoryName(${cat.id}, this.value)">
                    </div>
                    <div class="category-stats">
                        <div class="stat">
                            <span class="stat-label">매출</span>
                            <span class="stat-value">${Utils.formatMoney(revenue)}</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">건수</span>
                            <span class="stat-value">${count}건</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">시술수</span>
                            <span class="stat-value">${treatmentCount}개</span>
                        </div>
                    </div>
                    <div class="category-code">
                        <label>기본 인력시간코드</label>
                        <input type="text" value="${cat.code}" 
                               onchange="App.updateCategoryCode(${cat.id}, this.value)">
                    </div>
                    <div class="category-time">
                        <label>기본 소요시간</label>
                        <input type="number" value="${cat.time}" min="5" step="5"
                               onchange="App.updateCategoryTime(${cat.id}, this.value)"> 분
                    </div>
                </div>
            `;
        }).join('');
    },
    
    // ============================================
    // 시술 테이블 렌더링 (카테고리별 그룹)
    // ============================================
    renderTreatmentTable() {
        const container = Utils.$('#treatmentTableBody');
        if (!container) return;
        
        let html = '';
        
        Data.categories.forEach(cat => {
            const treatments = Data.getTreatmentsByCategory(cat.id);
            if (treatments.length === 0) return;
            
            // 카테고리 헤더
            html += `
                <tr class="category-row" style="background: ${cat.color}22">
                    <td colspan="7">
                        <span class="category-badge" style="background: ${cat.color}">${cat.name}</span>
                        <span class="category-meta">기본: ${cat.code} / ${cat.time}분</span>
                    </td>
                </tr>
            `;
            
            // 시술 목록
            treatments.forEach(t => {
                const actualCode = Data.getTreatmentCode(t);
                const actualTime = Data.getTreatmentTime(t);
                const isInherited = !t.code;
                
                html += `
                    <tr data-id="${t.id}">
                        <td class="treatment-name">${t.name}</td>
                        <td class="treatment-price">${Utils.formatMoney(t.price)}</td>
                        <td class="treatment-count">${t.count}건</td>
                        <td class="treatment-code ${isInherited ? 'inherited' : ''}">
                            <input type="text" value="${t.code || ''}" 
                                   placeholder="${cat.code}"
                                   onchange="App.updateTreatmentCode(${t.id}, this.value)">
                        </td>
                        <td class="treatment-time ${isInherited ? 'inherited' : ''}">
                            <input type="number" value="${t.time || ''}" 
                                   placeholder="${cat.time}"
                                   min="5" step="5"
                                   onchange="App.updateTreatmentTime(${t.id}, this.value)">
                        </td>
                        <td class="treatment-actual">
                            <span class="code-badge">${actualCode}</span>
                            <span class="time-badge">${actualTime}분</span>
                        </td>
                        <td class="treatment-actions">
                            <button class="btn-icon edit" onclick="App.editTreatment(${t.id})">✏️</button>
                            <button class="btn-icon delete" onclick="App.deleteTreatment(${t.id})">🗑️</button>
                        </td>
                    </tr>
                `;
            });
        });
        
        container.innerHTML = html;
    },
    
    // ============================================
    // 카테고리 선택 드롭다운 렌더링
    // ============================================
    renderCategorySelect(selectId, selectedId = null) {
        const select = Utils.$(`#${selectId}`);
        if (!select) return;
        
        select.innerHTML = `
            <option value="">카테고리 선택</option>
            ${Data.categories.map(c => `
                <option value="${c.id}" ${c.id === selectedId ? 'selected' : ''}>
                    ${c.name}
                </option>
            `).join('')}
        `;
    },
    
    // ============================================
    // 시술 선택 드롭다운 (카테고리별 그룹)
    // ============================================
    renderTreatmentSelect(selectId) {
        const select = Utils.$(`#${selectId}`);
        if (!select) return;
        
        let html = '<option value="">시술 선택</option>';
        
        Data.categories.forEach(cat => {
            const treatments = Data.getTreatmentsByCategory(cat.id);
            if (treatments.length === 0) return;
            
            html += `<optgroup label="${cat.name}">`;
            treatments.forEach(t => {
                const code = Data.getTreatmentCode(t);
                const time = Data.getTreatmentTime(t);
                html += `<option value="${t.id}" data-code="${code}" data-time="${time}">
                    ${t.name} (${Utils.formatMoney(t.price)})
                </option>`;
            });
            html += '</optgroup>';
        });
        
        select.innerHTML = html;
    },
    
    // ============================================
    // 인력 현황 렌더링
    // ============================================
    renderStaffGrid() {
        const container = Utils.$('#staffGrid');
        if (!container) return;
        
        container.innerHTML = Data.staff.map(s => `
            <div class="staff-card">
                <div class="staff-avatar ${s.role}">${s.name ? s.name.charAt(0) : s.role}</div>
                <div class="staff-info">
                    <div class="name">${s.name || '(미지정)'}</div>
                    <div class="role">${s.roleLabel}</div>
                </div>
                <div class="staff-status-badge ${s.status}">${s.status === 'available' ? '가용' : '점유'}</div>
            </div>
        `).join('');
    },
    
    // ============================================
    // 인력 설정 렌더링
    // ============================================
    renderStaffConfig() {
        const container = Utils.$('#staffConfigGrid');
        if (!container) return;
        
        const roleColors = {
            H: 'linear-gradient(135deg, #f472b6, #6366f1)',
            S: 'linear-gradient(135deg, #6366f1, #22d3ee)',
            N: 'linear-gradient(135deg, #10b981, #22d3ee)',
            A: 'linear-gradient(135deg, #f59e0b, #f472b6)'
        };
        
        container.innerHTML = Data.staff.map(s => `
            <div class="staff-config-card" data-id="${s.id}">
                <div class="avatar" style="background: ${roleColors[s.role]}">${s.name ? s.name.charAt(0) : s.role}</div>
                <div class="details">
                    <input type="text" class="name-input" value="${s.name}" 
                           placeholder="이름 입력"
                           onchange="App.updateStaffName(${s.id}, this.value)">
                    <select class="role-select" onchange="App.updateStaffRole(${s.id}, this.value)">
                        <option value="H" ${s.role === 'H' ? 'selected' : ''}>대표원장 (H)</option>
                        <option value="S" ${s.role === 'S' ? 'selected' : ''}>부원장 (S)</option>
                        <option value="N" ${s.role === 'N' ? 'selected' : ''}>간호사 (N)</option>
                        <option value="A" ${s.role === 'A' ? 'selected' : ''}>관리사 (A)</option>
                    </select>
                </div>
                <button class="btn-icon delete" onclick="App.deleteStaff(${s.id})">🗑️</button>
            </div>
        `).join('');
    },
    
    // ============================================
    // 카테고리별 매출 차트
    // ============================================
    renderCategoryRevenueChart() {
        const container = Utils.$('#categoryRevenueChart');
        if (!container) return;
        
        const sortedCats = Data.categories
            .map(c => ({
                ...c,
                revenue: Data.getCategoryRevenue(c.id),
                count: Data.getCategoryCount(c.id)
            }))
            .filter(c => c.revenue > 0)
            .sort((a, b) => b.revenue - a.revenue);
        
        const maxRevenue = sortedCats[0]?.revenue || 1;
        
        container.innerHTML = sortedCats.map(c => `
            <div class="revenue-bar">
                <div class="bar-label">${c.name}</div>
                <div class="bar-track">
                    <div class="bar-fill" style="width: ${(c.revenue / maxRevenue) * 100}%; background: ${c.color}">
                        ${Utils.formatMoney(c.revenue)}
                    </div>
                </div>
                <div class="bar-count">${c.count}건</div>
            </div>
        `).join('');
    },
    
    // ============================================
    // 객단가 분석 렌더링
    // ============================================
    renderPriceAnalysis() {
        const container = Utils.$('#priceAnalysisChart');
        if (!container) return;
        
        const catStats = Data.categories
            .map(c => {
                const revenue = Data.getCategoryRevenue(c.id);
                const count = Data.getCategoryCount(c.id);
                return {
                    ...c,
                    revenue,
                    count,
                    avgPrice: count > 0 ? Math.round(revenue / count) : 0
                };
            })
            .filter(c => c.count > 0)
            .sort((a, b) => b.avgPrice - a.avgPrice);
        
        const maxPrice = catStats[0]?.avgPrice || 1;
        
        container.innerHTML = catStats.map(c => {
            let barClass = 'high';
            if (c.avgPrice < 300000) barClass = 'low';
            else if (c.avgPrice < 500000) barClass = 'medium';
            
            return `
                <div class="price-bar">
                    <div class="bar-label">${c.name}</div>
                    <div class="bar-track">
                        <div class="bar-fill ${barClass}" style="width: ${(c.avgPrice / maxPrice) * 100}%">
                            ${Utils.formatMoney(c.avgPrice)}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },
    
    // ============================================
    // 추천 콤비네이션 렌더링
    // ============================================
    renderRecommendedCombos() {
        const container = Utils.$('#recommendedCombos');
        if (!container) return;
        
        // 저객단가 + 고객단가 조합 추천
        const lowPriceCats = Data.categories
            .map(c => ({ ...c, avgPrice: Data.getCategoryCount(c.id) > 0 ? Data.getCategoryRevenue(c.id) / Data.getCategoryCount(c.id) : 0 }))
            .filter(c => c.avgPrice > 0 && c.avgPrice < 300000)
            .slice(0, 3);
        
        const highPriceCats = Data.categories
            .map(c => ({ ...c, avgPrice: Data.getCategoryCount(c.id) > 0 ? Data.getCategoryRevenue(c.id) / Data.getCategoryCount(c.id) : 0 }))
            .filter(c => c.avgPrice >= 500000)
            .slice(0, 3);
        
        const combos = [
            {
                name: '제모 + 색소 패키지',
                target: '제모 고객 → 색소 업셀링',
                items: ['BB파인제모 5회', 'BB 토닝 3회', '사후관리'],
                originalPrice: 2200000,
                discountedPrice: 1870000,
                potential: '+122만원 객단가 상승'
            },
            {
                name: '돌출 + 탄력쫀쫀 패키지',
                target: '돌출 치료 후 → 탄력 업셀링',
                items: ['편평사마귀 100개', 'BBL HERO 타이트닝 1회', '재생관리'],
                originalPrice: 760000,
                discountedPrice: 650000,
                potential: '+35만원 객단가 상승'
            },
            {
                name: '포다이스 VIP 패키지',
                target: 'Special 고객 락인',
                items: ['입술1부위', '유착방지주사 3회', '리쥬란HB'],
                originalPrice: 880000,
                discountedPrice: 750000,
                potential: '재방문율 +45%'
            }
        ];
        
        container.innerHTML = combos.map(c => `
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
                <div class="combo-potential">${c.potential}</div>
            </div>
        `).join('');
    }
};

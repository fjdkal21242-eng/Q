// 대학 검색
function searchUniversities() {
    const gradeInput = document.getElementById('gradeInput').value;
    
    if (!gradeInput) {
        document.getElementById('universityList').innerHTML = '';
        document.getElementById('recommendationInfo').innerHTML = '';
        return;
    }

    const grade = parseFloat(gradeInput);

    // 입력값 유효성 검사
    if (isNaN(grade) || grade < 1.0 || grade > 6.0) {
        document.getElementById('universityList').innerHTML = 
            '<p style="color: #e74c3c; text-align: center; padding: 20px;">1.0 ~ 6.0 사이의 값을 입력해주세요.</p>';
        return;
    }

    // 현재 등급 범위 찾기
    let currentRange = null;
    for (let range of gradeRanges) {
        if (grade >= range.min && grade <= range.max) {
            currentRange = range;
            break;
        }
    }

    // 범위 정보 표시
    let rangeInfo = '';
    if (currentRange) {
        rangeInfo = `
            <div class="recommendation-info">
                <strong>📊 현재 등급: ${currentRange.gradeRange}</strong><br>
                상위 ${currentRange.percent} (9등급제: ${currentRange.koreanGrade})<br>
                <br>
                ${currentRange.description}
            </div>
        `;
    }
    document.getElementById('recommendationInfo').innerHTML = rangeInfo;

    // 추천 대학 필터링 (입력 등급 ±0.5 범위)
    const filteredUniversities = universities.filter(uni => {
        const diff = Math.abs(uni.grade - grade);
        return diff <= 0.8; // ±0.8 범위 내
    });

    // 등급이 정확한 것부터 정렬
    filteredUniversities.sort((a, b) => {
        const diffA = Math.abs(a.grade - grade);
        const diffB = Math.abs(b.grade - grade);
        return diffA - diffB;
    });

    // 대학 리스트 표시
    if (filteredUniversities.length === 0) {
        document.getElementById('universityList').innerHTML = 
            '<p style="color: #e74c3c; text-align: center; padding: 20px;">해당 등급에 맞는 대학이 없습니다.</p>';
        return;
    }

    let universityHTML = '';
    filteredUniversities.forEach((uni, index) => {
        const match = uni.grade === grade ? 'exact' : 
                      Math.abs(uni.grade - grade) < 0.3 ? 'close' : 'similar';
        
        let matchBadge = '';
        if (match === 'exact') {
            matchBadge = '<span style="color: #27ae60; font-weight: bold; font-size: 12px;">✓ 정확일치</span>';
        } else if (match === 'close') {
            matchBadge = '<span style="color: #f39c12; font-weight: bold; font-size: 12px;">△ 근접</span>';
        }

        universityHTML += `
            <div class="university-item">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div>
                        <div class="uni-name">${uni.name}</div>
                        <div class="uni-tier">${uni.tier}</div>
                        ${matchBadge}
                    </div>
                    <div style="text-align: right; color: #667eea; font-weight: bold; font-size: 16px;">
                        ${uni.grade}등급
                    </div>
                </div>
                <div class="uni-info">
                    📍 ${uni.region} 
                </div>
                <div class="uni-major">
                    📚 주요 학부: ${uni.majors.slice(0, 3).join(', ')}
                </div>
            </div>
        `;
    });

    document.getElementById('universityList').innerHTML = universityHTML;
}

// 입력 필드 엔터키 처리
document.addEventListener('DOMContentLoaded', () => {
    const gradeInput = document.getElementById('gradeInput');
    if (gradeInput) {
        gradeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchUniversities();
            }
        });
    }
});

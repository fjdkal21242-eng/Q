// 설문조사 상태 관리
let currentQuestion = 0;
let answers = {};
let resultScores = {
    realistic: 0,
    investigative: 0,
    artistic: 0,
    social: 0,
    enterprising: 0,
    conventional: 0
};

// 현재 질문 표시
function displayQuestion() {
    const question = surveyQuestions[currentQuestion];
    const category = categories[question.category];

    // 카테고리 정보 표시
    const categoryInfo = document.getElementById('categoryInfo');
    categoryInfo.innerHTML = `
        <div class="category-name">${category.name}</div>
        <div class="category-desc">${category.description}</div>
    `;

    // 질문 표시
    const questionText = document.getElementById('questionText');
    questionText.textContent = question.text;

    // 답변 버튼 생성
    const answersContainer = document.getElementById('answersContainer');
    answersContainer.innerHTML = '';
    
    const scales = [
        { value: 5, label: "매우 그렇다" },
        { value: 4, label: "그렇다" },
        { value: 3, label: "보통이다" },
        { value: 2, label: "그렇지 않다" },
        { value: 1, label: "매우 그렇지 않다" }
    ];

    scales.forEach(scale => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.textContent = `${scale.label} (${scale.value}점)`;
        btn.onclick = () => selectAnswer(question.id, scale.value, question.category, btn);
        
        // 이미 선택한 답변이 있으면 표시
        if (answers[question.id] && answers[question.id].value === scale.value) {
            btn.classList.add('selected');
        }
        
        answersContainer.appendChild(btn);
    });

    // 진행도 표시
    document.getElementById('surveyProgress').textContent = 
        `${currentQuestion + 1} / ${surveyQuestions.length}`;
    
    // 이전/다음 버튼 상태
    document.getElementById('prevBtn').disabled = currentQuestion === 0;
    document.getElementById('nextBtn').textContent = 
        currentQuestion === surveyQuestions.length - 1 ? '완료' : '다음';
    
    // 질문 번호 표시
    document.getElementById('questionNumber').textContent = 
        `${currentQuestion + 1} / ${surveyQuestions.length}`;
}

// 답변 선택
function selectAnswer(questionId, value, category, element) {
    answers[questionId] = { value, category };
    
    // 모든 버튼에서 selected 제거
    document.querySelectorAll('.answer-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // 선택한 버튼에 selected 추가
    element.classList.add('selected');
}

// 다음 질문으로
function nextQuestion() {
    const question = surveyQuestions[currentQuestion];
    
    // 답변이 선택되었는지 확인
    if (!answers[question.id]) {
        alert('답변을 선택해주세요.');
        return;
    }

    if (currentQuestion < surveyQuestions.length - 1) {
        currentQuestion++;
        displayQuestion();
    } else {
        // 설문 완료
        calculateResults();
        showResults();
    }
}

// 이전 질문으로
function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        displayQuestion();
    }
}

// 결과 계산
function calculateResults() {
    // 점수 초기화
    resultScores = {
        realistic: 0,
        investigative: 0,
        artistic: 0,
        social: 0,
        enterprising: 0,
        conventional: 0
    };

    // 각 카테고리별 점수 합산
    Object.values(answers).forEach(answer => {
        resultScores[answer.category] += answer.value;
    });
}

// 결과 표시
function showResults() {
    // 점수를 배열로 변환하고 정렬
    const scores = Object.entries(resultScores)
        .map(([category, score]) => ({
            category,
            score,
            categoryInfo: categories[category]
        }))
        .sort((a, b) => b.score - a.score);

    // 최고 점수 카테고리 3개
    const topThree = scores.slice(0, 3);

    // 결과 HTML 생성
    let resultHTML = '<div style="margin-bottom: 30px;">';
    resultHTML += '<h3 style="color: #667eea; margin-bottom: 20px; font-size: 20px;">당신의 진로 적성 유형</h3>';

    topThree.forEach((item, index) => {
        const color = item.categoryInfo.color;
        resultHTML += `
            <div class="result-item" style="border-left-color: ${color};">
                <div class="result-title" style="color: ${color};">
                    ${index + 1}. ${item.categoryInfo.name}
                </div>
                <div class="result-description">
                    ${item.categoryInfo.description}
                </div>
                <div class="result-examples">
                    예시 분야: ${item.categoryInfo.examples}
                </div>
                <div class="result-score" style="background: ${color}; color: white;">
                    점수: ${item.score}점
                </div>
            </div>
        `;
    });

    resultHTML += '</div>';

    // 전체 점수 표시
    resultHTML += '<div style="background: #f0f4ff; padding: 20px; border-radius: 10px;">';
    resultHTML += '<h4 style="color: #333; margin-bottom: 15px;">전체 점수</h4>';
    
    scores.forEach(item => {
        const percentage = (item.score / 10) * 100;
        resultHTML += `
            <div style="margin-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span style="font-weight: 500; color: #333;">${item.categoryInfo.name}</span>
                    <span style="color: #667eea; font-weight: bold;">${item.score}점</span>
                </div>
                <div style="background: #e0e0e0; height: 8px; border-radius: 4px; overflow: hidden;">
                    <div style="background: ${item.categoryInfo.color}; height: 100%; width: ${percentage}%;"></div>
                </div>
            </div>
        `;
    });
    
    resultHTML += '</div>';

    document.getElementById('resultContent').innerHTML = resultHTML;
    showScreen('resultScreen');
}

// Firebase設定
const firebaseConfig = {
    apiKey: "AIzaSyCqXmypkzJHMQnmvHOGbHQfHldnanJN5so",
    databaseURL: "https://vote-9dea2-default-rtdb.firebaseio.com"
};

// Firebase初期化
firebase.initializeApp(firebaseConfig);

// DOM要素
const voteSection = document.getElementById('vote-section');
const resultSection = document.getElementById('result-section');
const voteButtons = document.querySelectorAll('.vote-btn');
const voteCounts = document.querySelectorAll('.vote-count');
const backToVoteBtn = document.getElementById('back-to-vote');

// 画面遷移関数
function showVoteSection() {
    voteSection.style.display = 'block';
    resultSection.style.display = 'none';
}

function showResultSection() {
    voteSection.style.display = 'none';
    resultSection.style.display = 'block';
}

// グラフの初期化
const ctx = document.getElementById('voteChart').getContext('2d');
const voteChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['選択肢1', '選択肢2', '選択肢3'],
        datasets: [{
            label: '投票数',
            data: [0, 0, 0],
            backgroundColor: [
                'rgba(54, 162, 235, 0.8)',
                'rgba(255, 99, 132, 0.8)',
                'rgba(75, 192, 192, 0.8)'
            ],
            borderColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                }
            }
        },
        plugins: {
            title: {
                display: true,
                text: 'リアルタイム投票結果',
                font: {
                    size: 16
                }
            }
        }
    }
});

// 投票データの読み込み
function loadVotes() {
    const votesRef = firebase.database().ref('votes');
    votesRef.on('value', (snapshot) => {
        const data = snapshot.val() || {};
        const voteData = [0, 0, 0];
        
        voteCounts.forEach((count, index) => {
            const optionNumber = index + 1;
            const voteCount = data[optionNumber] || 0;
            count.textContent = voteCount;
            voteData[index] = voteCount;
        });

        // グラフの更新
        voteChart.data.datasets[0].data = voteData;
        voteChart.update();
    });
}

// 初期データの読み込み
loadVotes();

// 投票処理
voteButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const option = button.dataset.option;
        const votesRef = firebase.database().ref(`votes/${option}`);
        
        // 投票数を増やす
        votesRef.transaction((count) => {
            return (count || 0) + 1;
        }).then(() => {
            // 投票後に結果画面に遷移
            showResultSection();
        });
    });
});

// 戻るボタンの処理
backToVoteBtn.addEventListener('click', showVoteSection); 
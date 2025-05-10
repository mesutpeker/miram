document.addEventListener('DOMContentLoaded', () => {
    // DOM elementleri
    const patternDisplay = document.getElementById('pattern-display');
    const optionsContainer = document.getElementById('options-container');
    const resultMessage = document.getElementById('result-message');
    const scoreElement = document.getElementById('score');
    const gameOverElement = document.getElementById('game-over');
    const finalScoreElement = document.getElementById('final-score');
    const restartButton = document.getElementById('restart-button');
    const questionContainer = document.getElementById('question-container');
    
    // Ses elementleri
    const correctSound = document.getElementById('correct-sound');
    const wrongSound = document.getElementById('wrong-sound');
    const backgroundMusic = document.getElementById('background-music');
    const toggleSoundButton = document.getElementById('toggle-sound');
    const soundIcon = document.getElementById('sound-icon');
    
    // Ses ayarları
    let isSoundOn = true;

    // Oyun değişkenleri
    let currentQuestion = 0;
    let score = 0;
    let selectedOption = null;
    let correctAnswer = null;
    let questionSlot = null;
    let feedbackTimeout = null;
    let isProcessingTouch = false; // Dokunma işlemi kontrolü için

    // Ses kontrolü
    function toggleSound() {
        isSoundOn = !isSoundOn;
        
        if (isSoundOn) {
            soundIcon.textContent = '🔊';
            try {
                backgroundMusic.play().catch(err => console.log('Müzik çalma hatası:', err));
            } catch (error) {
                console.log('Müzik çalma hatası:', error);
            }
        } else {
            soundIcon.textContent = '🔇';
            try {
                backgroundMusic.pause();
            } catch (error) {
                console.log('Müzik durdurma hatası:', error);
            }
        }
    }
    
    // Ses düğmesine tıklama olayı
    toggleSoundButton.addEventListener('click', toggleSound);
    
    // Ses çalma fonksiyonu
    function playSound(sound) {
        if (isSoundOn && sound) {
            try {
                sound.currentTime = 0;
                sound.play().catch(err => console.log('Ses çalma hatası:', err));
            } catch (error) {
                console.log('Ses çalma hatası:', error);
            }
        }
    }
    
    // Arkaplan müziğini başlat
    function startBackgroundMusic() {
        if (isSoundOn && backgroundMusic) {
            try {
                backgroundMusic.volume = 0.3; // Ses seviyesini ayarla
                backgroundMusic.play().catch(error => {
                    console.log("Otomatik müzik çalma engellendi:", error);
                    // Kullanıcı etkileşimi olmadan müzik çalınamayabilir
                });
            } catch (error) {
                console.log('Müzik başlatma hatası:', error);
            }
        }
    }
    
    // Konfeti efekti oluştur
    function createConfetti() {
        const confettiCount = 50;
        const container = document.querySelector('.game-container');
        
        // Önceki konfetileri temizle
        const oldConfetti = document.querySelectorAll('.confetti');
        oldConfetti.forEach(item => item.remove());
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            // Rastgele pozisyon
            const left = Math.random() * 100;
            const delay = Math.random() * 0.5;
            
            confetti.style.left = `${left}%`;
            confetti.style.animationDelay = `${delay}s`;
            confetti.style.webkitAnimationDelay = `${delay}s`;
            
            // Rastgele şekil
            if (Math.random() > 0.5) {
                confetti.style.borderRadius = '50%';
            } else if (Math.random() > 0.5) {
                confetti.style.width = '5px';
                confetti.style.height = '15px';
            } else {
                confetti.style.width = '15px';
                confetti.style.height = '5px';
            }
            
            confetti.classList.add('confetti-animation');
            container.appendChild(confetti);
            
            // 2 saniye sonra konfetileri temizle
            setTimeout(() => {
                confetti.remove();
            }, 2000);
        }
    }

    // Örüntü soruları - Harf örüntüleri kaldırıldı, daha kolay örüntüler eklendi
    const questions = [
        // Sayı örüntüleri
        {
            type: 'number',
            pattern: [2, 4, 6, 8, '?'],
            options: [9, 10, 12, 14],
            answer: 10,
            explanation: 'Her sayı 2 artıyor.'
        },
        {
            type: 'number',
            pattern: [1, 3, 5, 7, '?'],
            options: [8, 9, 10, 11],
            answer: 9,
            explanation: 'Her sayı 2 artıyor.'
        },
        {
            type: 'number',
            pattern: [10, 20, 30, 40, '?'],
            options: [45, 50, 55, 60],
            answer: 50,
            explanation: 'Her sayı 10 artıyor.'
        },
        {
            type: 'number',
            pattern: [5, 10, 15, 20, '?'],
            options: [25, 30, 35, 40],
            answer: 25,
            explanation: 'Her sayı 5 artıyor.'
        },
        {
            type: 'number',
            pattern: [100, 90, 80, 70, '?'],
            options: [50, 55, 60, 65],
            answer: 60,
            explanation: 'Her sayı 10 azalıyor.'
        },
        {
            type: 'number',
            pattern: [2, 4, 6, 8, 10, '?'],
            options: [11, 12, 14, 16],
            answer: 12,
            explanation: 'Her sayı 2 artıyor.'
        },
        {
            type: 'number',
            pattern: [5, 10, 15, 20, 25, '?'],
            options: [30, 35, 40, 45],
            answer: 30,
            explanation: 'Her sayı 5 artıyor.'
        },
        {
            type: 'number',
            pattern: [3, 6, 9, 12, 15, '?'],
            options: [16, 17, 18, 21],
            answer: 18,
            explanation: 'Her sayı 3 artıyor.'
        },
        {
            type: 'number',
            pattern: [25, 20, 15, 10, 5, '?'],
            options: [0, 1, 2, 3],
            answer: 0,
            explanation: 'Her sayı 5 azalıyor.'
        },
        {
            type: 'number',
            pattern: [1, 4, 7, 10, 13, '?'],
            options: [14, 15, 16, 17],
            answer: 16,
            explanation: 'Her sayı 3 artıyor.'
        },
        {
            type: 'number',
            pattern: [2, 4, 8, 10, 14, '?'],
            options: [16, 18, 20, 22],
            answer: 16,
            explanation: 'Sayılar 2, 4, 2, 4, 2 şeklinde artıyor.'
        },
        {
            type: 'number',
            pattern: [1, 2, 3, 4, 5, '?'],
            options: [6, 7, 8, 9],
            answer: 6,
            explanation: 'Sayılar sırayla 1 artıyor.'
        },
        {
            type: 'number',
            pattern: [10, 9, 8, 7, 6, '?'],
            options: [3, 4, 5, 6],
            answer: 5,
            explanation: 'Her sayı 1 azalıyor.'
        },
        {
            type: 'number',
            pattern: [2, 4, 6, 8, 10, '?'],
            options: [11, 12, 13, 14],
            answer: 12,
            explanation: 'Çift sayılar sırayla gidiyor.'
        },
        {
            type: 'number',
            pattern: [1, 3, 5, 7, 9, '?'],
            options: [10, 11, 12, 13],
            answer: 11,
            explanation: 'Tek sayılar sırayla gidiyor.'
        },
        {
            type: 'number',
            pattern: [1, 1, 2, 2, 3, '?'],
            options: [3, 4, 5, 6],
            answer: 3,
            explanation: 'Her sayı iki kez tekrar ediyor.'
        },
        {
            type: 'number',
            pattern: [2, 2, 3, 3, 4, '?'],
            options: [4, 5, 6, 7],
            answer: 4,
            explanation: 'Her sayı iki kez tekrar ediyor.'
        },
        {
            type: 'number',
            pattern: [1, 2, 2, 3, 3, 3, '?'],
            options: [3, 4, 5, 6],
            answer: 4,
            explanation: 'Her sayı, değeri kadar tekrar ediyor.'
        },
        {
            type: 'number',
            pattern: [5, 5, 4, 4, 3, '?'],
            options: [2, 3, 4, 5],
            answer: 3,
            explanation: 'Her sayı iki kez tekrar ediyor ve 1 azalıyor.'
        },
        {
            type: 'number',
            pattern: [1, 3, 5, 3, 5, '?'],
            options: [3, 5, 7, 9],
            answer: 7,
            explanation: 'Sayılar 1, 3, 5, 3, 5, 7 şeklinde artıp azalıyor.'
        },

        // Şekil örüntüleri
        {
            type: 'shape',
            pattern: ['🔴', '🔵', '🔴', '🔵', '?'],
            options: ['🔴', '🔵', '🟢', '🟡'],
            answer: '🔴',
            explanation: 'Kırmızı ve mavi daire sırayla tekrar ediyor.'
        },
        {
            type: 'shape',
            pattern: ['🟥', '🟦', '🟩', '🟥', '?'],
            options: ['🟥', '🟦', '🟩', '🟨'],
            answer: '🟦',
            explanation: 'Kırmızı, mavi, yeşil örüntüsü tekrar ediyor.'
        },
        {
            type: 'shape',
            pattern: ['🔺', '🔻', '🔺', '🔻', '?'],
            options: ['🔶', '🔺', '🔻', '🔷'],
            answer: '🔺',
            explanation: 'Yukarı ve aşağı üçgen sırayla tekrar ediyor.'
        },
        {
            type: 'shape',
            pattern: ['⭐', '⭐', '🌙', '⭐', '⭐', '?'],
            options: ['⭐', '🌙', '☀️', '🌈'],
            answer: '🌙',
            explanation: 'İki yıldızdan sonra ay geliyor.'
        },
        {
            type: 'shape',
            pattern: ['🍎', '🍌', '🍊', '🍎', '?'],
            options: ['🍇', '🍌', '🍊', '🍓'],
            answer: '🍌',
            explanation: 'Elma, muz, portakal örüntüsü tekrar ediyor.'
        },
        {
            type: 'shape',
            pattern: ['🐶', '🐱', '🐶', '🐱', '?'],
            options: ['🐶', '🐱', '🐭', '🐰'],
            answer: '🐶',
            explanation: 'Köpek ve kedi sırayla tekrar ediyor.'
        },
        {
            type: 'shape',
            pattern: ['🚗', '🚲', '🚌', '🚗', '?'],
            options: ['🚗', '🚲', '🚌', '🚁'],
            answer: '🚲',
            explanation: 'Araba, bisiklet, otobüs örüntüsü tekrar ediyor.'
        },
        {
            type: 'shape',
            pattern: ['🦁', '🐯', '🐘', '🦁', '?'],
            options: ['🦁', '🐯', '🐘', '🦒'],
            answer: '🐯',
            explanation: 'Aslan, kaplan, fil örüntüsü tekrar ediyor.'
        },
        {
            type: 'shape',
            pattern: ['🌞', '🌧️', '🌞', '🌧️', '?'],
            options: ['🌞', '🌧️', '❄️', '🌪️'],
            answer: '🌞',
            explanation: 'Güneş ve yağmur sırayla tekrar ediyor.'
        },
        {
            type: 'shape',
            pattern: ['🏀', '⚽', '🏈', '🏀', '?'],
            options: ['🏀', '⚽', '🏈', '⚾'],
            answer: '⚽',
            explanation: 'Basketbol, futbol, amerikan futbolu örüntüsü tekrar ediyor.'
        },
        {
            type: 'shape',
            pattern: ['🌸', '🌸', '🌵', '🌸', '🌸', '?'],
            options: ['🌸', '🌵', '🌴', '🌲'],
            answer: '🌵',
            explanation: 'İki çiçekten sonra kaktüs geliyor.'
        },
        {
            type: 'shape',
            pattern: ['🔴', '🔴', '🔵', '🔴', '🔴', '?'],
            options: ['🔴', '🔵', '🟢', '🟡'],
            answer: '🔵',
            explanation: 'İki kırmızı daireden sonra mavi daire geliyor.'
        },
        {
            type: 'shape',
            pattern: ['🔼', '◼️', '🔽', '🔼', '?'],
            options: ['🔼', '◼️', '🔽', '🔷'],
            answer: '◼️',
            explanation: 'Yukarı üçgen, kare, aşağı üçgen örüntüsü tekrar ediyor.'
        },
        {
            type: 'shape',
            pattern: ['🍓', '🍓', '🍏', '🍏', '?'],
            options: ['🍓', '🍏', '🍌', '🍊'],
            answer: '🍓',
            explanation: 'İki çilek, iki elma örüntüsü tekrar ediyor.'
        },
        {
            type: 'shape',
            pattern: ['🐢', '🐇', '🐇', '🐢', '?'],
            options: ['🐢', '🐇', '🐘', '🦒'],
            answer: '🐇',
            explanation: 'Kaplumbağa, iki tavşan örüntüsü tekrar ediyor.'
        },
        {
            type: 'shape',
            pattern: ['🍎', '🍎', '🍌', '🍎', '🍎', '?'],
            options: ['🍎', '🍌', '🍊', '🍓'],
            answer: '🍌',
            explanation: 'İki elmadan sonra bir muz geliyor.'
        },
        {
            type: 'shape',
            pattern: ['🌞', '🌞', '🌞', '🌧️', '🌞', '🌞', '🌞', '?'],
            options: ['🌞', '🌧️', '❄️', '🌪️'],
            answer: '🌧️',
            explanation: 'Üç güneşten sonra bir yağmur geliyor.'
        },
        {
            type: 'shape',
            pattern: ['🐶', '🐱', '🐭', '🐶', '🐱', '?'],
            options: ['🐶', '🐱', '🐭', '🐰'],
            answer: '🐭',
            explanation: 'Köpek, kedi, fare örüntüsü tekrar ediyor.'
        },
        {
            type: 'shape',
            pattern: ['🍉', '🍉', '🍇', '🍉', '🍉', '?'],
            options: ['🍉', '🍇', '🍌', '🍊'],
            answer: '🍇',
            explanation: 'İki karpuzdan sonra üzüm geliyor.'
        },
        {
            type: 'shape',
            pattern: ['🚗', '🚗', '🚲', '🚗', '🚗', '?'],
            options: ['🚗', '🚲', '🚌', '🚁'],
            answer: '🚲',
            explanation: 'İki arabadan sonra bisiklet geliyor.'
        },

        // Karışık örüntüler
        {
            type: 'mixed',
            pattern: ['🐶', '🐱', '🐶', '🐱', '?'],
            options: ['🐶', '🐱', '🐭', '🐰'],
            answer: '🐶',
            explanation: 'Köpek ve kedi sırayla tekrar ediyor.'
        },
        {
            type: 'mixed',
            pattern: [1, 2, 3, 1, 2, 3, '?'],
            options: [1, 2, 3, 4],
            answer: 1,
            explanation: '1, 2, 3 örüntüsü tekrar ediyor.'
        },
        {
            type: 'mixed',
            pattern: ['🍎', 1, '🍌', 2, '?'],
            options: ['🍊', 3, '🍇', 4],
            answer: '🍊',
            explanation: 'Meyve ve sayı sırayla gidiyor.'
        },
        {
            type: 'mixed',
            pattern: [2, 4, '🔴', 6, 8, '?'],
            options: ['🔴', '🔵', 10, 12],
            answer: '🔴',
            explanation: 'İki çift sayıdan sonra kırmızı daire geliyor.'
        },
        {
            type: 'mixed',
            pattern: [1, 2, 3, '🌟', 1, 2, 3, '?'],
            options: ['🌟', 1, 4, 5],
            answer: '🌟',
            explanation: '1, 2, 3, yıldız örüntüsü tekrar ediyor.'
        },
        {
            type: 'mixed',
            pattern: ['🔵', '🔵', '🔴', '🔵', '🔵', '🔵', '?'],
            options: ['🔴', '🔵', '🟢', '🟡'],
            answer: '🔴',
            explanation: 'İki maviden sonra kırmızı, üç maviden sonra kırmızı geliyor.'
        },
        {
            type: 'mixed',
            pattern: [1, 3, 5, '🌟', 7, 9, '?'],
            options: ['🌟', 11, 13, 15],
            answer: '🌟',
            explanation: 'Üç tek sayıdan sonra yıldız geliyor.'
        },
        {
            type: 'mixed',
            pattern: ['🐘', '🐘', '🦁', '🐘', '🐘', '?'],
            options: ['🐘', '🦁', '🐯', '🦒'],
            answer: '🦁',
            explanation: 'İki filden sonra aslan geliyor.'
        },
        {
            type: 'mixed',
            pattern: [10, 20, '🍕', 30, 40, '?'],
            options: ['🍕', '🍔', 50, 60],
            answer: '🍕',
            explanation: 'İki sayıdan sonra pizza geliyor.'
        },
        {
            type: 'mixed',
            pattern: [1, '🍎', 2, '🍎', 3, '?'],
            options: ['🍎', 4, 5, 6],
            answer: '🍎',
            explanation: 'Sayı ve elma sırayla tekrar ediyor.'
        },
        
        // YENİ EKLENEN SORULAR
        {
            type: 'number',
            pattern: [1, 4, 7, 10, '?'],
            options: [12, 13, 14, 15],
            answer: 13,
            explanation: 'Her sayı 3 artıyor.'
        },
        {
            type: 'number',
            pattern: [20, 18, 16, 14, '?'],
            options: [10, 11, 12, 13],
            answer: 12,
            explanation: 'Her sayı 2 azalıyor.'
        },
        {
            type: 'number',
            pattern: [2, 4, 8, 16, '?'],
            options: [24, 28, 32, 36],
            answer: 32,
            explanation: 'Her sayı 2 katına çıkıyor.'
        },
        {
            type: 'shape',
            pattern: ['🍓', '🍌', '🍓', '🍌', '🍓', '?'],
            options: ['🍓', '🍌', '🍊', '🍎'],
            answer: '🍌',
            explanation: 'Çilek ve muz sırayla tekrar ediyor.'
        },
        {
            type: 'shape',
            pattern: ['🌞', '🌞', '🌙', '🌞', '🌞', '?'],
            options: ['🌙', '🌞', '⭐', '☁️'],
            answer: '🌙',
            explanation: 'İki güneşten sonra bir ay geliyor.'
        },
        {
            type: 'shape',
            pattern: ['🐶', '🐱', '🐭', '🐶', '🐱', '🐭', '?'],
            options: ['🐶', '🐱', '🐭', '🐰'],
            answer: '🐶',
            explanation: 'Köpek, kedi, fare örüntüsü tekrar ediyor.'
        },
        {
            type: 'mixed',
            pattern: ['🚗', 1, '🚲', 2, '🚗', '?'],
            options: [1, 2, 3, 4],
            answer: 3,
            explanation: 'Araç ve sayı örüntüsü, sayılar sırayla artıyor.'
        },
        {
            type: 'mixed',
            pattern: [5, '🌟', 10, '🌟', 15, '?'],
            options: ['🌟', 15, 20, 25],
            answer: '🌟',
            explanation: 'Sayı ve yıldız sırayla geliyor, sayılar 5 artıyor.'
        },
        {
            type: 'mixed',
            pattern: ['🔴', '🔵', '🔴', '🔵', '🔴', '?'],
            options: ['🔴', '🔵', '🟢', '🟡'],
            answer: '🔵',
            explanation: 'Kırmızı ve mavi daire sırayla tekrar ediyor.'
        },
        {
            type: 'number',
            pattern: [2, 4, 6, 8, 10, '?'],
            options: [11, 12, 13, 14],
            answer: 12,
            explanation: 'Her sayı 2 artıyor.'
        }
    ];

    // Soruları karıştır
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Oyunu başlat
    function startGame() {
        // Soruları karıştır
        shuffleArray(questions);
        
        currentQuestion = 0;
        score = 0;
        updateScore();
        showQuestion(currentQuestion);
        
        // Arkaplan müziğini başlat - kullanıcı etkileşimi gerektiği için ilk tıklamada başlatacağız
        document.body.addEventListener('click', function startMusicOnFirstClick() {
            startBackgroundMusic();
            document.body.removeEventListener('click', startMusicOnFirstClick);
        }, { once: true });
    }

    // Soruyu göster
    function showQuestion(index) {
        if (index >= questions.length) {
            showGameOver();
            return;
        }

        // Seçili seçeneği sıfırla
        selectedOption = null;
        questionSlot = null;
        
        // Sonuç mesajını temizle
        resultMessage.textContent = '';
        resultMessage.className = '';
        
        // Geri bildirim zamanlayıcısını temizle
        if (feedbackTimeout) {
            clearTimeout(feedbackTimeout);
            feedbackTimeout = null;
        }
        
        // İşlem durumunu sıfırla
        isProcessingTouch = false;
        
        // Geçerli soruyu al
        const question = questions[index];
        correctAnswer = question.answer;
        
        // Örüntüyü göster
        displayPattern(question.pattern);
        
        // Seçenekleri göster
        displayOptions(question.options);
    }

    // Örüntüyü ekranda göster
    function displayPattern(pattern) {
        patternDisplay.innerHTML = '';
        
        pattern.forEach(item => {
            const patternItem = document.createElement('div');
            patternItem.className = 'pattern-item';
            
            if (item === '?') {
                patternItem.classList.add('question-mark');
                patternItem.textContent = '?';
                
                // Soru işaretine tıklama ve dokunma özelliği ekle
                patternItem.addEventListener('click', handleQuestionMarkInteraction);
                patternItem.addEventListener('touchstart', handleQuestionMarkInteraction, { passive: true });
                
                // Soru işaretini sakla
                questionSlot = patternItem;
            } else {
                patternItem.textContent = item;
            }
            
            patternDisplay.appendChild(patternItem);
        });
    }
    
    // Soru işareti etkileşimi
    function handleQuestionMarkInteraction(event) {
        // Çift tıklama/dokunma olayını engelle
        if (isProcessingTouch) return;
        isProcessingTouch = true;
        
        // 300ms sonra tekrar etkileşime izin ver
        setTimeout(() => {
            isProcessingTouch = false;
        }, 300);
        
        if (selectedOption !== null) {
            // Seçili seçeneği soru işaretine yerleştir
            placeSelectedOption(event.currentTarget);
        } else {
            // Seçili seçenek yoksa uyarı ver
            showMessage('Önce bir seçenek seç!', 'incorrect');
        }
        
        // Varsayılan olay davranışını engelle
        event.preventDefault();
    }

    // Seçenekleri ekranda göster
    function displayOptions(options) {
        optionsContainer.innerHTML = '';
        
        options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.textContent = option;
            optionElement.dataset.value = option;
            
            // Hem tıklama hem de dokunma olaylarını ekle
            optionElement.addEventListener('click', () => handleOptionSelection(optionElement, option));
            optionElement.addEventListener('touchstart', (event) => {
                event.preventDefault();
                handleOptionSelection(optionElement, option);
            }, { passive: false });
            
            optionsContainer.appendChild(optionElement);
        });
    }
    
    // Seçenek seçimini işle
    function handleOptionSelection(optionElement, option) {
        // Çift tıklama/dokunma olayını engelle
        if (isProcessingTouch) return;
        isProcessingTouch = true;
        
        // 300ms sonra tekrar etkileşime izin ver
        setTimeout(() => {
            isProcessingTouch = false;
        }, 300);
        
        // Önceki seçimi kaldır
        document.querySelectorAll('.option').forEach(el => {
            el.classList.remove('selected');
        });
        
        // Yeni seçimi işaretle
        optionElement.classList.add('selected');
        selectedOption = option;
    }

    // Seçili seçeneği yerleştir ve kontrol et
    function placeSelectedOption(targetElement) {
        // Seçili seçeneği soru işaretine yerleştir
        targetElement.textContent = selectedOption;
        targetElement.classList.remove('question-mark');
        targetElement.classList.add('filled');
        
        // Cevabı kontrol et
        const isCorrect = selectedOption === correctAnswer;
        
        if (isCorrect) {
            showMessage('Doğru! ' + questions[currentQuestion].explanation, 'correct');
            score += 10;
            updateScore();
            targetElement.classList.add('bounce');
            
            // Doğru ses efektini çal
            playSound(correctSound);
            
            // Konfeti efekti göster
            createConfetti();
            
            // 2 saniye sonra sonraki soruya geç
            feedbackTimeout = setTimeout(() => {
                targetElement.classList.remove('bounce');
                currentQuestion++;
                showQuestion(currentQuestion);
            }, 2000);
        } else {
            showMessage('Yanlış! Doğru cevap: ' + correctAnswer + '. ' + questions[currentQuestion].explanation, 'incorrect');
            targetElement.classList.add('shake');
            
            // Yanlış ses efektini çal
            playSound(wrongSound);
            
            // Doğru cevabı göster
            document.querySelectorAll('.option').forEach(el => {
                if (el.textContent == correctAnswer) {
                    el.classList.add('correct-answer');
                }
            });
            
            // 2 saniye sonra sonraki soruya geç
            feedbackTimeout = setTimeout(() => {
                targetElement.classList.remove('shake');
                currentQuestion++;
                showQuestion(currentQuestion);
            }, 2000);
        }
    }

    // Mesaj göster
    function showMessage(text, className) {
        resultMessage.textContent = text;
        resultMessage.className = className;
        
        // 2 saniye sonra mesajı temizle
        feedbackTimeout = setTimeout(() => {
            resultMessage.textContent = '';
            resultMessage.className = '';
        }, 2000);
    }

    // Skoru güncelle
    function updateScore() {
        scoreElement.textContent = score;
        finalScoreElement.textContent = score;
    }

    // Oyun sonu ekranını göster
    function showGameOver() {
        questionContainer.style.display = 'none';
        gameOverElement.style.display = 'block';
    }
    
    // Dokunma olaylarını iyileştir
    function preventZoom(event) {
        // Çift dokunma ile yakınlaştırmayı engelle
        if (event.touches.length > 1) {
            event.preventDefault();
        }
    }
    
    // Safari için dokunma olaylarını iyileştir
    document.addEventListener('touchmove', preventZoom, { passive: false });
    
    // Yeniden başlatma butonu
    restartButton.addEventListener('click', () => {
        questionContainer.style.display = 'block';
        gameOverElement.style.display = 'none';
        startGame();
    });

    // Oyunu başlat
    startGame();
}); 
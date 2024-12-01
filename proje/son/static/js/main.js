console.log("main.js yüklendi.");


loadNavbar();



// Sayfa yüklendiğinde mevcut sayfayı yükle
const currentPath = window.location.pathname; // Mevcut URL yolu
const currentPage = currentPath.split('/').pop(); // URL'den sayfa adını al

loadPage(currentPage === '' ? 'base' : currentPage); // Eğer currentPage boşsa 'base' yükle

function loadNavbar() {
    fetch('/load_navbar/')
        .then(response => {
            if (!response.ok) throw new Error('Navbar yüklenemedi.');
            return response.text();
        })
        .then(html => {
            document.getElementById('navbar-container').innerHTML = html;
            bindMenuLinks();
            setupLanguageSelector();
        })
        .catch(error => {
            console.error("Bir hata oluştu:", error);
        });
}

function loadPage(page) {
    console.log(`Yüklenen sayfa: ${page}`);
    fetch(`/load_page/?page=${page}`)
        .then(response => {
            if (!response.ok) throw new Error(`Sayfa bulunamadı: ${page} - ${response.statusText}`);
            return response.text();
        })
        .then(html => {
            const mainContainer = document.getElementById("main-container");
            if (mainContainer) {
                mainContainer.innerHTML = html;
                bindMenuLinks();
                setupLanguageSelector();
                let videoPath;
            
                if (page === 'base') {
                    videoPath = "/static/videos/1.mp4";
                } else if (page === 'game-single') {
                    videoPath = "/static/videos/4.mp4";
                } else if (page === 'game-multi') {
                    videoPath = "/static/videos/4.mp4";
                } else if (page === 'g_conti') {
                    videoPath = "/static/videos/3.mp4";
                } else if (page === 'profile') {
                    videoPath = "/static/videos/2.mp4";
                } else if (page === 'login_with_42') {
                    videoPath = "/static/videos/2.mp4";
                }

                if (videoPath) {
                    loadNewVideo(videoPath);
                }

                if (page === 'g_conti' || page === 'game-multi' || page === 'game-single') {
                    // Eğer game.js dosyası yüklenmemişse, yükleyin
                    if (page === 'game-single' || page === 'game-multi') {
                        resetGame();
                    }
                    console.log("page: ", page);
                    if (!window.initializeGame) {
                        const script = document.createElement('script');
                        script.src = '/static/js/game.js';
                        script.defer = true;
                        script.onload = function () {
                            // game.js dosyası yüklendikten sonra initializeGame fonksiyonunu çağırın
                            if (typeof initializeGame === 'function') {
                                initializeGame();
                            } else {
                                console.error("initializeGame fonksiyonu tanımlı değil.");
                            }
                        };
                        document.head.appendChild(script);
                    } else {
                        initializeGame();
                    }
                }
                // Sadece sayfa başarıyla yüklendiyse pushState çağrısı yap
                if (!history.state || history.state.page !== page) {
                    window.history.pushState({ page }, "", `/${page}`);
                }

                // Sayfanın başlığını güncelle
                document.title = page.charAt(0).toUpperCase() + page.slice(1); // Sayfa başlığını güncelle
            } else {
                console.error("main-container öğesi bulunamadı.");
            }
        })
        .catch(error => {
            console.error("Bir hata oluştu:", error);
            // Hata durumunda sayfa yüklenemedi mesajı gösterebiliriz
            const mainContainer = document.getElementById("main-container");
            if (mainContainer) {
                mainContainer.innerHTML = `<p>Sayfa yüklenemedi: ${error.message}</p>`;
            }
        });
}


function loadScript(src, callback) {
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;

    // Eğer callback varsa, script yüklendikten sonra çalıştırılacak
    if (callback) {
        script.onload = callback;
    }
    document.head.appendChild(script);
}

function bindMenuLinks() {
    document.querySelectorAll('.nav-link').forEach(link => {
        // Önceki olayları kaldırın
        link.removeEventListener('click', link.clickHandler);

        // Yeni bir click handler tanımlayın ve onu kaydedin
        link.clickHandler = function (e) {
            e.preventDefault();
            const page = link.getAttribute('data-ref').split('/').pop();
            loadPage(page);
        };
        link.addEventListener('click', link.clickHandler);
    });

    // g_conti sayfasındaki butonlar için tıklama olaylarını da bağlayalım
    const singlePlayerBtn = document.getElementById('singlePlayer');
    if (singlePlayerBtn) {
        singlePlayerBtn.addEventListener('click', function (e) {
            e.preventDefault();
            loadPage('game-single');  // game-single sayfasına yönlendirme
        });
    }

    const tournamentModeBtn = document.getElementById('tournamentMode');
    if (tournamentModeBtn) {
        tournamentModeBtn.addEventListener('click', function (e) {
            e.preventDefault();
            loadPage('game-multi');  // turnuva moduna yönlendirme
        });
    }
}

window.onpopstate = function (event) {
    if (event.state && event.state.page) {
        loadPage(event.state.page);
    } else {
        loadPage('base'); // Varsayılan sayfa
    }
};

document.addEventListener('DOMContentLoaded', () => {



    
    const currentPage = window.location.pathname.split('/').pop() || 'base';
    loadPage(currentPage);
    bindMenuLinks();
});
// burada sayfa gmae-single'dan başka yere tıklanınca sıfırlamayı dene
//
//
// Geçerli dili tarayıcı yerel depolamasında sakla

document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('currentLanguage') || 'tr'; // varsayılan olarak 'tr'
    loadLanguage(savedLang);
  });

async function loadLanguage(lang) {
    try {
        console.log(`Dil dosyası yükleniyor: ${lang}`);
        const response = await fetch(`/static/js/lang/${lang}.json`);
        
        if (!response.ok) {
            throw new Error(`Dil dosyası yüklenemedi: ${lang} - ${response.statusText}`);
        }

        const translations = await response.json();

        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[key]) {
                element.textContent = translations[key];
            }
        });

        localStorage.setItem('lang', lang);
    } catch (error) {
        console.error('Dil dosyası yüklenirken hata oluştu:', error);
    }
}
let currentLang = localStorage.getItem('lang') || 'tr';
// Sayfa yüklendiğinde mevcut dili yükle

function setupLanguageSelector() {
    const languageSelector = document.getElementById('languageSelector');
    if (languageSelector) {
        languageSelector.value = currentLang;
        languageSelector.addEventListener('change', function () {
            currentLang = this.value;
            loadLanguage(currentLang);
            localStorage.setItem('currentLanguage', currentLang); // Seçilen dili yerel depolamada sakla
            updateLanguageDisplay(currentLang); // Bayrak simgesini güncelle
        });
        loadLanguage(currentLang);
        updateLanguageDisplay(currentLang); // Sayfa yüklendiğinde bayrak simgesini ayarla
    }
}

function updateLanguageDisplay(lang) {
    const languageDisplay = document.getElementById('languageDisplay');
    if (languageDisplay) {
        languageDisplay.innerHTML = ''; // Önceki içeriği temizle
        const img = document.createElement('img');
        img.src = `/static/images/flags/${lang}.png`; // Bayrak simgesi yolu
        img.alt = lang; // Alternatif metin
        img.style.width = '30px'; // Genişlik ayarı
        img.style.height = '20px'; // Yükseklik ayarı
        languageDisplay.appendChild(img); // Bayrak simgesini ekle
    } else {
        console.error('languageDisplay öğesi bulunamadı');
    }
}

function loadNewVideo(videoPath) {
    // Eski video elementini bul ve kaldır
    let oldVideo = document.getElementById('backgroundVideo');
    if (oldVideo) {
      oldVideo.pause(); // Videoyu durdur
      oldVideo.src = ''; // Kaynağı boşalt
      oldVideo.load(); // Belleği temizle
      oldVideo.parentNode.removeChild(oldVideo); // Elementi DOM'dan kaldır
    }

    // Yeni video elementini oluştur ve ekle
    let newVideo = document.createElement('video');
    newVideo.id = 'backgroundVideo';
    newVideo.autoplay = true;
    newVideo.muted = true;
    newVideo.loop = true;

    let sourceElement = document.createElement('source');
    sourceElement.src = videoPath;
    sourceElement.type = 'video/mp4';

    newVideo.appendChild(sourceElement);
    document.body.insertBefore(newVideo, document.getElementById('main-container'));
  }
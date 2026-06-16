document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. STICKY NAVBAR EFFECT
    // ==========================================
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ==========================================
    // 2. MOBILE MENU TOGGLE
    // ==========================================
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const toggleIcon = menuToggle.querySelector('i');
    
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Toggle Icon between Bars and X
        if (navMenu.classList.contains('active')) {
            toggleIcon.classList.remove('fa-bars');
            toggleIcon.classList.add('fa-xmark');
        } else {
            toggleIcon.classList.remove('fa-xmark');
            toggleIcon.classList.add('fa-bars');
        }
    });

    // Close menu when clicking nav link on mobile
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            toggleIcon.classList.remove('fa-xmark');
            toggleIcon.classList.add('fa-bars');
        });
    });

    // ==========================================
    // 3. SCROLL REVEAL ANIMATIONS
    // ==========================================
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Optional: Stop observing after reveal to keep animations static
                // observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before element is in full view
    });
    
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // ==========================================
    // 4. ANIMATED SKILLS PROGRESS BARS
    // ==========================================
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    const skillsSection = document.querySelector('.skills-container');
    
    const skillsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                skillBars.forEach(bar => {
                    const width = bar.getAttribute('data-width');
                    bar.style.width = width;
                });
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, {
        threshold: 0.2
    });
    
    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }

    // ==========================================
    // 5. ACTIVE NAVBAR LINK HIGHLIGHTING
    // ==========================================
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.scrollY + 120; // Offset for sticky header
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // ==========================================
    // 6. PORTFOLIO FILTER
    // ==========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active to current
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filterValue === 'all') {
                    item.style.display = 'flex';
                    // Animation trigger
                    setTimeout(() => item.style.opacity = '1', 50);
                } else if (category === filterValue) {
                    item.style.display = 'flex';
                    setTimeout(() => item.style.opacity = '1', 50);
                } else {
                    item.style.opacity = '0';
                    // Delay display: none to allow fade out animation
                    setTimeout(() => item.style.display = 'none', 300);
                }
            });
        });
    });

    // ==========================================
    // 7. CONTACT FORM VALIDATION & WEB3FORMS API
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    const successModal = document.getElementById('successModal');
    const closeModal = document.getElementById('closeModal');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent page reload
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            if (name.trim() !== '' && email.trim() !== '' && message.trim() !== '') {
                const submitBtn = document.getElementById('btn-submit-form');
                const originalBtnText = submitBtn.innerHTML;
                
                // Show loading spinner
                submitBtn.innerHTML = '<span>Mengirim...</span> <i class="fa-solid fa-spinner fa-spin"></i>';
                submitBtn.disabled = true;
                
                const formData = new FormData(contactForm);
                const accessKey = formData.get('access_key');
                
                // Simulated success fallback if API Key is not configured yet
                if (accessKey === 'YOUR_ACCESS_KEY_HERE') {
                    setTimeout(() => {
                        successModal.classList.add('active');
                        contactForm.reset();
                        submitBtn.innerHTML = originalBtnText;
                        submitBtn.disabled = false;
                    }, 1000);
                    return;
                }
                
                // Perform real AJAX submission to Web3Forms
                fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        successModal.classList.add('active');
                        contactForm.reset();
                    } else {
                        alert('Gagal mengirim: ' + data.message);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Gagal mengirim pesan. Silakan periksa koneksi internet Anda.');
                })
                .finally(() => {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                });
            }
        });
    }
    
    if (closeModal && successModal) {
        closeModal.addEventListener('click', () => {
            successModal.classList.remove('active');
        });
        
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                successModal.classList.remove('active');
            }
        });
    }

    // ==========================================
    // 8. BACKGROUND MUSIC PLAYER
    // ==========================================
    const tracks = [
        { name: "Payung Teduh - Untuk Perempuan Yang Sedang Di Pelukan", path: "Music/03%20Untuk%20Perempuan%20Yang%20Sedang%20Di%20Pe.m4a" },
        { name: "Payung Teduh - Resah", path: "Music/07%20Resah.m4a" },
    ];

    let currentTrackIndex = 0;
    const audio = new Audio();
    audio.volume = 0.35; // Comfortable background level (35%)

    const audioPlayer = document.getElementById('audioPlayer');
    const playerToggle = document.getElementById('playerToggle');
    const playerIcon = playerToggle.querySelector('i');
    const musicTitle = audioPlayer.querySelector('.music-title');
    const musicStatus = audioPlayer.querySelector('.music-status');

    function loadTrack(index) {
        currentTrackIndex = index;
        const track = tracks[currentTrackIndex];
        audio.src = track.path;
        musicTitle.textContent = track.name;
        musicStatus.textContent = `Lagu ${currentTrackIndex + 1} dari ${tracks.length}`;
    }

    function playTrack() {
        audio.play()
            .then(() => {
                audioPlayer.classList.add('playing');
                playerIcon.classList.remove('fa-play');
                playerIcon.classList.add('fa-pause');
            })
            .catch(err => {
                console.log("Autoplay blocked, waiting for user interaction.");
            });
    }

    function pauseTrack() {
        audio.pause();
        audioPlayer.classList.remove('playing');
        playerIcon.classList.remove('fa-pause');
        playerIcon.classList.add('fa-play');
    }

    function togglePlay() {
        if (audio.paused) {
            playTrack();
        } else {
            pauseTrack();
        }
    }

    // Initialize first song
    loadTrack(0);

    // Toggle button handler
    playerToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePlay();
    });

    // Sequential playback and wrap-around
    audio.addEventListener('ended', () => {
        let nextIndex = (currentTrackIndex + 1) % tracks.length;
        loadTrack(nextIndex);
        playTrack();
    });

    // ==========================================
    // WELCOME OVERLAY & MUSIC AUTOPLAY ACTIVATOR
    // ==========================================
    const welcomeOverlay = document.getElementById('welcomeOverlay');
    const enterSiteBtn = document.getElementById('enterSiteBtn');

    // Lock scroll on load
    document.body.classList.add('overlay-active');

    if (enterSiteBtn && welcomeOverlay) {
        enterSiteBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Avoid triggering document-level click listener
            welcomeOverlay.classList.add('hidden');
            document.body.classList.remove('overlay-active');
            playTrack();
        });
    }

    // Interaction fallback trigger
    const startAudioOnInteraction = () => {
        if (audio.paused && audio.src) {
            playTrack();
        }
        if (welcomeOverlay && !welcomeOverlay.classList.contains('hidden')) {
            welcomeOverlay.classList.add('hidden');
            document.body.classList.remove('overlay-active');
        }
        document.removeEventListener('click', startAudioOnInteraction);
        document.removeEventListener('scroll', startAudioOnInteraction);
    };

    document.addEventListener('click', startAudioOnInteraction);
    document.addEventListener('scroll', startAudioOnInteraction);
});


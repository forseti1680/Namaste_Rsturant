   // Initialize
    document.addEventListener('DOMContentLoaded', function() {
      // Set minimum dates
      const today = new Date().toISOString().split('T')[0];
      document.getElementById('checkinDate').min = today;
      document.getElementById('checkoutDate').min = today;
      
      // Update checkout min date when checkin changes
      document.getElementById('checkinDate').addEventListener('change', function() {
        document.getElementById('checkoutDate').min = this.value;
      });
      
      // Load saved data
      loadUserData();

        // Setup event listeners
      setupEventListeners();
    });

    // DARK MODE TOGGLE
    const darkToggle = document.getElementById("darkToggle");
    darkToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      darkToggle.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌓";
      
      // Save preference
      localStorage.setItem('darkMode', document.body.classList.contains("dark-mode"));
    });

    // Load dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
      document.body.classList.add("dark-mode");
      darkToggle.textContent = "☀️";
    }

    // LANGUAGE TOGGLE

const langToggleBtn = document.getElementById('langToggle');
  let currentLang = 'en';

  langToggleBtn.addEventListener('click', () => {
    // Toggle language
    currentLang = currentLang === 'en' ? 'ar' : 'en';

    // Update page direction
    document.documentElement.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');

    // Update button text
    langToggleBtn.textContent = currentLang === 'ar' ? '🌐 AR' : '🌐 EN';

    // Update all translatable elements
    document.querySelectorAll('[data-en]').forEach(el => {
      const newText = el.getAttribute(`data-${currentLang}`);
      if (newText) {
        el.textContent = newText;
      }
    });
  
    
      
      // In a real app, you'd implement full translation here
      if (currentLang === 'ar') {
        document.body.style.direction = 'rtl';
        document.querySelector('.hero h1').textContent = 'اكتشف سحر دهب';
        document.querySelector('.hero p').textContent = 'تجارب تخييم فاخرة في أجمل المواقع الصحراوية والساحلية في مصر';
      } else {
        document.body.style.direction = 'ltr';
        document.querySelector('.hero h1').textContent = "Discover Dahab's Magic";
        document.querySelector('.hero p').textContent = "Premium camping experiences in Egypt's most beautiful desert & coastal locations";
      }
    });

    // FILTER CAMPS
    function filterCamps(type) {
      const cards = document.querySelectorAll(".camp-card");
      const buttons = document.querySelectorAll(".filters button");
      
      // Update active button
      buttons.forEach(btn => btn.classList.remove('active'));
      event.target.classList.add('active');
      
      // Filter cards with animation
      cards.forEach(card => {
        if (type === "all" || card.classList.contains(type)) {
          card.style.display = "block";
          card.style.animation = "fadeInUp 0.5s ease";
        } else {
          card.style.display = "none";
        }
      });
    }

    // CAMP SELECTION
    let selectedCampName = '';
    let selectedCampPrice = 0;

    function selectCamp(campName, price) {
      selectedCampName = campName;
      selectedCampPrice = price;
      document.getElementById('selectedCamp').value = `${campName} - ${price} EGP per night`;
      
      // Scroll to booking section
      document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
      
      // Add points and show confirmation
      addPoints();
      showBookingModal();
    }

    // PROCESS BOOKING
    function processBooking() {
      const checkin = document.getElementById('checkinDate').value;
      const checkout = document.getElementById('checkoutDate').value;
      const guests = document.getElementById('guestCount').value;
      const experience = document.getElementById('experienceLevel').value;
      const activities = Array.from(document.getElementById('activities').selectedOptions).map(option => option.text);
      
      if (!selectedCampName) {
        alert('Please select a camp first!');
        return;
      }
      
      if (!checkin || !checkout) {
        alert('Please select your dates!');
        return;
      }
      
      // Calculate total price
      const nights = Math.ceil((new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24));
      const basePrice = selectedCampPrice * nights * parseInt(guests);
      const activitiesPrice = activities.length * 500; // Average activity price
      const totalPrice = basePrice + activitiesPrice;
      
      // Create WhatsApp message
      const phoneNumber = "201001234567";
      let message = `🏕️ DAHAB CAMPING BOOKING REQUEST\n\n`;
      message += `📅 Camp: ${selectedCampName}\n`;
      message += `📅 Check-in: ${checkin}\n`;
      message += `📅 Check-out: ${checkout}\n`;
      message += `👥 Guests: ${guests}\n`;
      message += `🎯 Experience: ${experience}\n`;
      if (activities.length > 0) {
        message += `🎪 Activities: ${activities.join(', ')}\n`;
      }
      message += `💰 Estimated Total: ${totalPrice} EGP\n\n`;
      message += `Please confirm availability and send final quote. Thank you! 🌟`;
      
      const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappURL, "_blank");
    }

    // USER POINTS SYSTEM
    let userData = {
      campsBooked: 0,
      userPoints: 0,
      bookingHistory: []
    };

    function loadUserData() {
      const saved = localStorage.getItem('dahabUserData');
      if (saved) {
        userData = JSON.parse(saved);
        updatePointsDisplay();
      }
    }

    function saveUserData() {
      localStorage.setItem('dahabUserData', JSON.stringify(userData));
    }

    function addPoints() {
      userData.campsBooked += 1;
      userData.userPoints += 10;
      userData.bookingHistory.push({
        camp: selectedCampName,
        date: new Date().toLocaleDateString(),
        points: 10
      });
      updatePointsDisplay();
      saveUserData();
    }

    function updatePointsDisplay() {
      document.getElementById("campsBooked").textContent = userData.campsBooked;
      document.getElementById("userPoints").textContent = userData.userPoints;
      
      // Calculate next reward
      let nextReward = 100;
      if (userData.userPoints >= 500) nextReward = 1000;
      else if (userData.userPoints >= 100) nextReward = 500;
      
      document.getElementById("nextReward").textContent = nextReward - (userData.userPoints % nextReward);
    }

    // MODAL FUNCTIONS
    function showBookingModal() {
      const modal = document.getElementById('bookingModal');
      modal.style.display = 'flex';
      
      // Apply dark mode to modal if active
      if (document.body.classList.contains('dark-mode')) {
        modal.classList.add('dark-mode');
      }
      
      setTimeout(() => {
        closeModal();
      }, 3000);
    }

    function closeModal() {
      document.getElementById('bookingModal').style.display = 'none';
    }

    // SMOOTH SCROLLING FOR NAVIGATION
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    // TYPING EFFECT FOR HERO (Optional enhancement)
    function typeWriter(element, text, speed = 50) {
      let i = 0;
      element.innerHTML = '';
      function type() {
        if (i < text.length) {
          element.innerHTML += text.charAt(i);
          i++;
          setTimeout(type, speed);
        }
      }
      type();
    }

    // INTERSECTION OBSERVER FOR ANIMATIONS
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
        }
      });
    }, observerOptions);

    // Observe all sections
    document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
      });
    });

    // PRICE CALCULATOR
    function calculatePrice() {
      const checkin = document.getElementById('checkinDate').value;
      const checkout = document.getElementById('checkoutDate').value;
      const guests = parseInt(document.getElementById('guestCount').value);
      
      if (checkin && checkout && selectedCampPrice > 0) {
        const nights = Math.ceil((new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24));
        const total = selectedCampPrice * nights * guests;
        
        // Show price estimate (you could add this to the form)
        console.log(`Estimated total: ${total} EGP for ${nights} nights`);
      }
    }

    // Add event listeners for price calculation
    document.getElementById('checkinDate').addEventListener('change', calculatePrice);
    document.getElementById('checkoutDate').addEventListener('change', calculatePrice);
    document.getElementById('guestCount').addEventListener('change', calculatePrice);
    
    // Theme and Language Switcher with RTL Support
class ThemeLanguageManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.currentLanguage = localStorage.getItem('language') || 'ar';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.applyLanguage(this.currentLanguage);
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.querySelector('#theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Language buttons
        const arabicBtn = document.querySelector('#arabic-btn');
        const englishBtn = document.querySelector('#english-btn');
        
        if (arabicBtn) {
            arabicBtn.addEventListener('click', () => this.switchLanguage('ar'));
        }
        if (englishBtn) {
            englishBtn.addEventListener('click', () => this.switchLanguage('en'));
        }

        // Update button states
        this.updateButtonStates();
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
        this.updateThemeButton();
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.updateThemeButton();
    }

    updateThemeButton() {
        const themeToggle = document.querySelector('#theme-toggle');
        if (themeToggle) {
            themeToggle.innerHTML = this.currentTheme === 'light' ? '🌙' : '☀️';
            themeToggle.title = this.currentTheme === 'light' ? 
                (this.currentLanguage === 'ar' ? 'الوضع المظلم' : 'Dark Mode') : 
                (this.currentLanguage === 'ar' ? 'الوضع الفاتح' : 'Light Mode');
        }
    }

    switchLanguage(lang) {
        this.currentLanguage = lang;
        this.applyLanguage(lang);
        localStorage.setItem('language', lang);
        this.updateButtonStates();
    }

    applyLanguage(lang) {
        const html = document.documentElement;
        
        if (lang === 'ar') {
            html.setAttribute('dir', 'rtl');
            html.setAttribute('lang', 'ar');
            document.body.classList.add('rtl-active');
            this.updateContentToArabic();
        } else {
            html.setAttribute('dir', 'ltr');
            html.setAttribute('lang', 'en');
            document.body.classList.remove('rtl-active');
            this.updateContentToEnglish();
        }
    }

    updateButtonStates() {
        const arabicBtn = document.querySelector('#arabic-btn');
        const englishBtn = document.querySelector('#english-btn');
        
        // Remove active class from all buttons
        [arabicBtn, englishBtn].forEach(btn => {
            if (btn) btn.classList.remove('active');
        });
        
        // Add active class to current language button
        if (this.currentLanguage === 'ar' && arabicBtn) {
            arabicBtn.classList.add('active');
        } else if (this.currentLanguage === 'en' && englishBtn) {
            englishBtn.classList.add('active');
        }
    }

    updateContentToArabic() {
        const translations = {
            // Navigation
            'home': 'الرئيسية',
            'about': 'من نحن',
            'services': 'الخدمات',
            'activities': 'الأنشطة',
            'contact': 'التواصل',
            'book': 'احجز الآن',
            'reviews': 'التقييمات',
            
            // Hero Section
            'hero-title': 'اكتشف سحر دهب',
            'hero-subtitle': 'تجارب تخييم فاخرة في أجمل المواقع الصحراوية والساحلية في مصر',
            'hero-button': 'احجز مغامرتك',
            
            // Common
            'read-more': 'اقرأ المزيد',
            'book-now': 'احجز الآن',
            'close': 'إغلاق',
            'submit': 'إرسال',
            'cancel': 'إلغاء',
            'loading': 'جاري التحميل...',
            'error': 'حدث خطأ',
            'success': 'تم بنجاح',
            
            // Form Labels
            'name': 'الاسم',
            'email': 'البريد الإلكتروني',
            'phone': 'رقم الهاتف',
            'message': 'الرسالة',
            'date': 'التاريخ',
            'guests': 'عدد الضيوف',
            
            // Sections
            'camps': 'المخيمات',
            'activities': 'الأنشطة',
            'testimonials': 'آراء العملاء',
            'contact-us': 'تواصل معنا'
        };

        this.updateTranslations(translations);
    }

    updateContentToEnglish() {
        const translations = {
            // Navigation
            'home': 'Home',
            'about': 'About',
            'services': 'Services',
            'activities': 'Activities',
            'contact': 'Contact',
            'book': 'Book Now',
            'reviews': 'Reviews',
            
            // Hero Section
            'hero-title': 'Discover Dahab Magic',
            'hero-subtitle': 'Luxury camping experiences in Egypt\'s most beautiful desert and coastal locations',
            'hero-button': 'Book Your Adventure',
            
            // Common
            'read-more': 'Read More',
            'book-now': 'Book Now',
            'close': 'Close',
            'submit': 'Submit',
            'cancel': 'Cancel',
            'loading': 'Loading...',
            'error': 'Error occurred',
            'success': 'Success',
            
            // Form Labels
            'name': 'Name',
            'email': 'Email',
            'phone': 'Phone',
            'message': 'Message',
            'date': 'Date',
            'guests': 'Guests',
            
            // Sections
            'camps': 'Camps',
            'activities': 'Activities',
            'testimonials': 'Testimonials',
            'contact-us': 'Contact Us'
        };

        this.updateTranslations(translations);
    }

    updateTranslations(translations) {
        Object.keys(translations).forEach(key => {
            const elements = document.querySelectorAll(`[data-translate="${key}"]`);
            elements.forEach(element => {
                if (element.tagName === 'INPUT' && element.type === 'submit') {
                    element.value = translations[key];
                } else if (element.hasAttribute('placeholder')) {
                    element.placeholder = translations[key];
                } else {
                    element.textContent = translations[key];
                }
            });
        });

        // Update theme button text
        this.updateThemeButton();
    }

    // Method to add smooth transitions
    addSmoothTransitions() {
        const style = document.createElement('style');
        style.textContent = `
            * {
                transition: background-color 0.3s ease, 
                           color 0.3s ease, 
                           border-color 0.3s ease,
                           transform 0.3s ease !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const themeManager = new ThemeLanguageManager();
    themeManager.addSmoothTransitions();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + D for dark mode toggle
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            themeManager.toggleTheme();
        }
        
        // Ctrl/Cmd + L for language toggle
        if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
            e.preventDefault();
            const newLang = themeManager.currentLanguage === 'ar' ? 'en' : 'ar';
            themeManager.switchLanguage(newLang);
        }
    });
});
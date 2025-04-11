// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Plant Characters Carousel
document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.carousel');
    const items = carousel.innerHTML;
    carousel.innerHTML = items + items; // Duplicate items for infinite scroll

    // Modal functionality
    const modal = document.querySelector('.plant-modal');
    const modalClose = document.querySelector('.modal-close');
    const carouselItems = document.querySelectorAll('.carousel-item');

    carouselItems.forEach(item => {
        item.addEventListener('click', () => {
            const plantId = item.querySelector('img').src.split('/').pop().split('.')[0];
            const plant = plantData[plantId];
            
            if (plant) {
                modal.querySelector('.modal-image').src = item.querySelector('img').src;
                modal.querySelector('.modal-title').textContent = plant.title;
                modal.querySelector('.modal-description').textContent = plant.description;
                modal.querySelector('.light-detail').textContent = plant.light;
                modal.querySelector('.water-detail').textContent = plant.water;
                modal.querySelector('.temp-detail').textContent = plant.temp;
                
                modal.style.display = 'flex';
            }
        });
    });

    modalClose.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Smooth scroll to catalog
document.querySelector('.btn-primary').addEventListener('click', (e) => {
    e.preventDefault();
    const catalogSection = document.querySelector('.catalog');
    catalogSection.scrollIntoView({ behavior: 'smooth' });
});

// Smooth scroll to plant finder and initialize quiz
document.querySelector('.btn-secondary').addEventListener('click', (e) => {
    e.preventDefault();
    const plantFinderSection = document.querySelector('.plant-finder');
    plantFinderSection.scrollIntoView({ behavior: 'smooth' });
    
    // Initialize quiz
    const quizContainer = document.querySelector('.quiz-container');
    const steps = document.querySelectorAll('.quiz-step');
    const resultsDiv = document.querySelector('.quiz-results');
    
    // Reset quiz state
    steps.forEach(step => step.style.display = 'none');
    steps[0].style.display = 'block';
    resultsDiv.style.display = 'none';
    
    // Reset user answers
    userAnswers = {
        experience: '',
        light: '',
        care: ''
    };
});

// Cart functionality
let cart = [];
const cartModal = document.querySelector('.cart-modal');
const cartItemsContainer = document.querySelector('.cart-items');
const itemsCountElement = document.querySelector('.items-count');
const finalPriceElement = document.querySelector('.final-price');
const cartCountElement = document.querySelector('.cart-count');

// Open cart modal
document.querySelector('.header-cart').addEventListener('click', (e) => {
    e.preventDefault();
    cartModal.style.display = 'flex';
    updateCartDisplay();
});

// Close cart modal
document.querySelector('.modal-close').addEventListener('click', () => {
    cartModal.style.display = 'none';
});

// Close modal when clicking outside
cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

// Add to cart functionality
document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', () => {
        const productCard = button.closest('.product-card');
        const product = {
            id: productCard.dataset.id,
            title: productCard.querySelector('h3').textContent,
            price: parseInt(productCard.querySelector('.price').textContent),
            image: productCard.querySelector('img').src,
            quantity: 1
        };

        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push(product);
        }

        updateCartCount();
        updateCartDisplay();
        
        // Add animation class
        button.classList.add('added');
        setTimeout(() => {
            button.classList.remove('added');
        }, 1000);
    });
});

// Update cart display
function updateCartDisplay() {
    cartItemsContainer.innerHTML = '';
    let totalItems = 0;
    let totalPrice = 0;

    cart.forEach(item => {
        totalItems += item.quantity;
        totalPrice += item.price * item.quantity;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="cart-item-info">
                <h4 class="cart-item-title">${item.title}</h4>
                <p class="cart-item-price">${item.price} ₽</p>
            </div>
            <div class="cart-item-actions">
                <div class="quantity-control">
                    <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn increase" data-id="${item.id}">+</button>
                </div>
                <button class="remove-item" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    // Update summary
    itemsCountElement.textContent = totalItems;
    finalPriceElement.textContent = `${totalPrice} ₽`;

    // Add event listeners for quantity controls
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            const item = cart.find(item => item.id === id);
            
            if (e.target.classList.contains('decrease')) {
                if (item.quantity > 1) {
                    item.quantity--;
                } else {
                    cart = cart.filter(item => item.id !== id);
                }
            } else if (e.target.classList.contains('increase')) {
                item.quantity++;
            }

            updateCartCount();
            updateCartDisplay();
        });
    });

    // Add event listeners for remove buttons
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.closest('.remove-item').dataset.id;
            cart = cart.filter(item => item.id !== id);
            updateCartCount();
            updateCartDisplay();
        });
    });
}

// Update cart count in header
function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = totalItems;
}

// Checkout button
document.querySelector('.checkout-btn').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Корзина пуста');
        return;
    }
    alert('Заказ оформлен! Спасибо за покупку!');
    cart = [];
    updateCartCount();
    updateCartDisplay();
    cartModal.style.display = 'none';
});

// Catalog filtering
document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    // Фильтрация товаров
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Убираем активный класс у всех кнопок
            filterBtns.forEach(b => b.classList.remove('active'));
            // Добавляем активный класс текущей кнопке
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            productCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Добавление в корзину
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = btn.closest('.product-card');
            const product = {
                id: Date.now(), // Временный ID
                name: card.querySelector('h3').textContent,
                price: card.querySelector('.price').textContent,
                image: card.querySelector('img').src
            };
            addToCart(product);
        });
    });

    // Быстрый просмотр
    const quickViewBtns = document.querySelectorAll('.quick-view-btn');
    const modal = document.querySelector('.plant-modal');
    
    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.product-card');
            const productImage = card.querySelector('img').src;
            const productName = card.querySelector('h3').textContent;
            const productDescription = card.querySelector('.product-description').textContent;
            
            modal.querySelector('.modal-image').src = productImage;
            modal.querySelector('.modal-title').textContent = productName;
            modal.querySelector('.modal-description').textContent = productDescription;
            
            modal.style.display = 'flex';
        });
    });
});

// Добавляем стили анимации
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

// Plant Finder Quiz
const plantData = {
    'sansevieria': {
        title: 'Сансевиерия',
        description: 'Неприхотливое растение для начинающих',
        price: '1200 ₽',
        image: 'images/sansevieria.png',
        experience: 'beginner',
        light: 'low',
        care: 'low',
        categories: ['beginner', 'shade']
    },
    'orchid': {
        title: 'Орхидея Фаленопсис',
        description: 'Изящное цветущее растение',
        price: '2500 ₽',
        image: 'images/orchid.png',
        experience: 'intermediate',
        light: 'medium',
        care: 'medium',
        categories: ['flowering']
    },
    'zamioculcas': {
        title: 'Замиокулькас',
        description: 'Идеален для затененных мест',
        price: '1800 ₽',
        image: 'images/zamioculcas.png',
        experience: 'beginner',
        light: 'low',
        care: 'low',
        categories: ['beginner', 'shade']
    },
    'ficus': {
        title: 'Фикус',
        description: 'Идеален для создания уюта и зелёных акцентов',
        price: '2000 ₽',
        image: 'images/zamioculcas.png',
        experience: 'beginner',
        light: 'low',
        care: 'low',
        categories: ['beginner', 'shade']
    },
    // Добавьте больше растений по аналогии
};

// Quiz functionality
document.addEventListener('DOMContentLoaded', () => {
    const quizContainer = document.querySelector('.quiz-container');
    const steps = document.querySelectorAll('.quiz-step');
    const resultsDiv = document.querySelector('.quiz-results');
    const resultsGrid = document.querySelector('.results-grid');
    const restartBtn = document.querySelector('.restart-quiz-btn');
    
    let userAnswers = {
        experience: '',
        light: '',
        care: ''
    };

    // Handle option clicks
    quizContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('option')) {
            const currentStep = e.target.closest('.quiz-step');
            const nextStep = currentStep.nextElementSibling;
            
            // Store answer
            Object.keys(userAnswers).forEach(key => {
                if (e.target.dataset[key]) {
                    userAnswers[key] = e.target.dataset[key];
                }
            });

            // Hide current step
            currentStep.style.display = 'none';

            // If there's a next step, show it, otherwise show results
            if (nextStep && nextStep.classList.contains('quiz-step')) {
                nextStep.style.display = 'block';
            } else {
                showResults();
            }
        }
    });

    // Show quiz results
    function showResults() {
        const matchingPlants = findMatchingPlants(userAnswers);
        resultsGrid.innerHTML = matchingPlants.map(plant => `
            <div class="product-card" data-category="${plant.categories[0]}">
                <div class="product-image">
                    <img src="${plant.image}" alt="${plant.title}">
                    <div class="product-overlay">
                        <button class="quick-view-btn">Быстрый просмотр</button>
                    </div>
                </div>
                <div class="product-info">
                    <h3>${plant.title}</h3>
                    <p class="product-description">${plant.description}</p>
                    <div class="product-meta">
                        <span class="price">${plant.price}</span>
                        <button class="add-to-cart-btn">
                            <i class="fas fa-shopping-cart"></i>
                            В корзину
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Show results section
        steps.forEach(step => step.style.display = 'none');
        resultsDiv.style.display = 'block';
    }

    // Find matching plants based on user answers
    function findMatchingPlants(answers) {
        return Object.values(plantData).filter(plant => {
            const experienceMatch = answers.experience === plant.experience;
            const lightMatch = answers.light === plant.light;
            const careMatch = answers.care === plant.care;
            
            // Return plants that match at least 2 out of 3 criteria
            const matchCount = [experienceMatch, lightMatch, careMatch].filter(Boolean).length;
            return matchCount >= 2;
        });
    }

    // Restart quiz
    restartBtn.addEventListener('click', () => {
        userAnswers = {
            experience: '',
            light: '',
            care: ''
        };
        resultsDiv.style.display = 'none';
        steps[0].style.display = 'block';
    });
});

// Newsletter Form
const newsletterForm = document.getElementById('newsletter-form');
newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector('input[type="email"]').value;
    
    if (validateEmail(email)) {
        alert('Спасибо за подписку!');
        newsletterForm.reset();
    } else {
        alert('Пожалуйста, введите корректный email');
    }
});

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});



// Render Featured Plants
function renderFeaturedPlants() {
    const container = document.querySelector('.featured-plants');
    if (!container) return;

    container.innerHTML = featuredPlants.map(plant => `
        <div class="featured-plant">
            <img src="${plant.image}" alt="${plant.name}">
            <h3>${plant.name}</h3>
            <p class="price">${plant.price}</p>
        </div>
    `).join('');
}

// Initialize Featured Plants
renderFeaturedPlants();

// Header scroll effect
const header = document.querySelector('.main-header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
}); 


window.addEventListener('scroll', function() {
    const heroSection = document.querySelector('.hero'); // или ваш селектор hero-секции
    const targetElement = document.querySelector('.header-contact'); // элемент, который нужно изменить
    const heroHeight = heroSection.offsetHeight; // высота hero-секции
    const scrollPosition = window.scrollY || window.pageYOffset; // текущая позиция скролла
  
    if (scrollPosition > heroHeight) {
      // Если прокрутили ниже hero-секции
      targetElement.style.color = 'grey'; // пример изменения стиля
      targetElement.classList.add('scrolled-class'); // или добавление класса
    } else {
      // Если мы ВНУТРИ hero-секции — возвращаем исходные стили
      targetElement.style.color = ''; // убираем inline-стиль
      targetElement.classList.remove('scrolled-class'); // удаляем класс
    }
  });

window.addEventListener('scroll', function() {
    const heroSection = document.querySelector('.hero'); // или ваш селектор hero-секции
    const targetElement = document.querySelector('.header-cart'); // элемент, который нужно изменить
    const heroHeight = heroSection.offsetHeight; // высота hero-секции
    const scrollPosition = window.scrollY || window.pageYOffset; // текущая позиция скролла
  
    if (scrollPosition > heroHeight) {
      // Если прокрутили ниже hero-секции
      targetElement.style.color = 'grey'; // пример изменения стиля
      targetElement.classList.add('scrolled-class'); // или добавление класса
    } else {
      // Если мы ВНУТРИ hero-секции — возвращаем исходные стили
      targetElement.style.color = ''; // убираем inline-стиль
      targetElement.classList.remove('scrolled-class'); // удаляем класс
    }
  });

  window.addEventListener('scroll', () => {
    const heroHeight = document.querySelector('.hero').offsetHeight;
    const elements = document.querySelectorAll('.main__logo-img');
    
    if (window.scrollY > heroHeight) {
      elements.forEach(el => {
        el.style.filter = 'none';
      });
    } else {
      elements.forEach(el => {
        el.style.filter = ''; // или ваше исходное значение
      });
    }
  });




// lightbox.js

document.addEventListener("DOMContentLoaded", function() {
    const images = document.querySelectorAll('.gallery-container img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.lightbox .close');
    const nextBtn = document.querySelector('.lightbox .next');
    const prevBtn = document.querySelector('.lightbox .prev');
    let currentIndex = 0;

    // Open lightbox
    images.forEach((img, index) => {
        img.addEventListener('click', function() {
            currentIndex = index;
            showLightbox(img.src, img.alt);
        });
    });

    function showLightbox(src, alt) {
        lightbox.style.display = 'block';
        lightboxImg.src = src;
        lightboxCaption.textContent = alt;
    }

    // Close lightbox
    function closeLightbox() {
        lightbox.style.display = 'none';
    }

    closeBtn.addEventListener('click', closeLightbox);

    // Navigate to next image
    function showNext() {
        currentIndex = (currentIndex + 1) % images.length;
        lightboxImg.src = images[currentIndex].src;
        lightboxCaption.textContent = images[currentIndex].alt;
    }

    nextBtn.addEventListener('click', showNext);

    // Navigate to previous image
    function showPrev() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        lightboxImg.src = images[currentIndex].src;
        lightboxCaption.textContent = images[currentIndex].alt;
    }

    prevBtn.addEventListener('click', showPrev);

    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', function(event) {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(event) {
        if (lightbox.style.display === 'block') {
            if (event.key === 'ArrowRight') {
                showNext();
            } else if (event.key === 'ArrowLeft') {
                showPrev();
            } else if (event.key === 'Escape') {
                closeLightbox();
            }
        }
    });
});

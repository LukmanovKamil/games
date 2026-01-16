// Подключение к базе данных
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.90.1/+esm';
const supabaseUrl = 'https://zfzjdjxcktzvpeekihod.supabase.co';
const supabaseKey = 'sb_publishable_03qTtgBceL4u5vS_vCE9Cw_GEBdNdy4';
const supabase = createClient(supabaseUrl, supabaseKey);
const games = window.games;


// Создание айди для всех чекбоксов
const checkBoxesId = document.querySelectorAll('.checkbox');

checkBoxesId.forEach((cb, index) => {
    cb.id = `id-${index + 1}`;
});


// Загрузка чекбоксов с базы данных
const { data } = await supabase.from(games).select('*');
const map = new Map(data.map(item => [item.id, item.checkbox]));
checkBoxesId.forEach(cb => {
    const id = Number(cb.id.split('-')[1]);
    const checked = map.get(id);
    cb.classList.toggle('checked', !!checked);
});

updatePercents();


// Сохранение чекбокса в базу данных
async function saveData(cb) {
    const parentOne = cb.closest('.one');

    if (parentOne) {
        const checkboxes = parentOne.querySelectorAll('.checkbox');
        for (const c of checkboxes) {
            const value = c.classList.contains('checked');
            await supabase
                .from(games)
                .upsert({ id: Number(c.id.split('-')[1]), checkbox: value }, { onConflict: ['id'] });
        }
    } else {
        const id = Number(cb.id.split('-')[1]);
        const value = cb.classList.contains('checked');
        await supabase
            .from(games)
            .upsert({ id, checkbox: value }, { onConflict: ['id'] });
    }
}


// Подсчет процентов
function updatePercents() {
    // ===== 1. Глобальный элемент %
    const globalPercent = document.querySelector('.global-percent');
    if (!globalPercent) {
        console.warn('На странице отсутствует проценты .global-percent');
        return;
    }

    let allPoints = []; // для глобального подсчета

    // ===== 2. Проходим по каждой карточке
    document.querySelectorAll('.card').forEach(card => {
        const cardpercent = card.querySelector('.card-percent');
        if (!cardpercent) {
            console.warn('В какой-то карточке отсутствует проценты .card-percent');
            return;
        }

        // ===== 2a. Собираем все пункты карточки
        const cardPoints = [
            ...Array.from(card.querySelectorAll('.checkbox:not(.one .checkbox)')).map(cb => cb.classList.contains('checked')),
            ...Array.from(card.querySelectorAll('.one')).map(one => !!one.querySelector('.checkbox.checked'))
        ];

        // ===== 2b. Процент карточки
        const checkedCard = cardPoints.filter(Boolean).length;
        cardpercent.textContent = cardPoints.length
            ? ((checkedCard / cardPoints.length) * 100).toFixed(2) + '%'
            : '0%';

        // ===== 2c. Добавляем в глобальный массив
        allPoints = allPoints.concat(cardPoints);
    });

    // ===== 3. Процент глобально
    const checkedGlobal = allPoints.filter(Boolean).length;
    globalPercent.textContent = allPoints.length
        ? ((checkedGlobal / allPoints.length) * 100).toFixed(2) + '%'
        : '0%';
}

// Обработчик чекбоксов
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', e => {
        const checkbox = e.target.closest('.checkbox');
        if (!checkbox) return;

        const parentOne = checkbox.closest('.one');

        if (parentOne) {
            if (checkbox.classList.contains('checked')) {
                checkbox.classList.remove('checked');
            } else {
                checkbox.classList.add('checked');
            }
        } else {
            checkbox.classList.toggle('checked');
        }

        updatePercents();

        saveData(checkbox);
    });
});


// Переключание страниц
const buttons = document.querySelectorAll('.btn');
const contents = document.querySelectorAll('.page');

buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        contents.forEach(c => c.classList.remove('active'));
        document.getElementById(btn.dataset.page).classList.add('active');
    });
});



// Сворачивание карточек
document.querySelectorAll('.card-title, .card-percent').forEach(el => {
    el.addEventListener('click', () => {
        let target = el.nextElementSibling;

        while (target && !target.classList.contains('card-table')) {
            target = target.nextElementSibling;
        }

        if (target) {
            target.classList.toggle('hidden');
        }
    });
});


// fullscreen
const fullscreen = document.getElementById('fullscreen');
const fullscreenImg = fullscreen.querySelector('img');

let scale = 1;
let posX = 0;
let posY = 0;

document.querySelectorAll('.item-img').forEach(img => {
    img.addEventListener('click', () => {
        fullscreenImg.style.display = 'block';
        fullscreen.classList.add('show');
        fullscreenImg.src = img.src;
        updateTransform();
    });
});


fullscreen.addEventListener('click', e => {
    if (e.target === fullscreen) {
        closeFullscreen();
    }
});



document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeFullscreen();
});

function closeFullscreen() {
    fullscreen.classList.remove('show');
    resetTransform();
}

fullscreenImg.addEventListener('wheel', e => {
    e.preventDefault();

    const zoomSpeed = 0.3;

    scale += (e.deltaY < 0 ? zoomSpeed : -zoomSpeed);
    scale = Math.min(Math.max(scale, 1), 5);

    limitPosition();
    updateTransform();
});

let dragging = false;
let startX = 0;
let startY = 0;

fullscreenImg.addEventListener('mousedown', e => {
    if (scale === 1) return;

    dragging = true;
    startX = e.clientX - posX;
    startY = e.clientY - posY;

    fullscreenImg.style.cursor = "grabbing";

    e.preventDefault();
});

document.addEventListener('mousemove', e => {
    if (!dragging) return;

    posX = e.clientX - startX;
    posY = e.clientY - startY;

    limitPosition();
    updateTransform();
});

const stopDragging = () => {
    if (!dragging) return;
    dragging = false;
    fullscreenImg.style.cursor = "grab";
};

document.addEventListener('mouseup', stopDragging);
document.addEventListener('mouseleave', stopDragging);

function limitPosition() {
    const rect = fullscreenImg.getBoundingClientRect();
    const box = fullscreen.getBoundingClientRect();

    const maxX = (rect.width - box.width) / 2;
    const maxY = (rect.height - box.height) / 2;

    if (rect.width < box.width) posX = 0;
    else posX = Math.min(Math.max(posX, -maxX), maxX);

    if (rect.height < box.height) posY = 0;
    else posY = Math.min(Math.max(posY, -maxY), maxY);
}

function updateTransform() {
    fullscreenImg.style.transform =
        `translate(${posX}px, ${posY}px) scale(${scale})`;
}













// --- TOUCH DRAGGING ---
fullscreenImg.addEventListener('touchstart', e => {
    if (scale === 1) return;
    if (e.touches.length !== 1) return; // только 1 палец

    dragging = true;

    const touch = e.touches[0];
    startX = touch.clientX - posX;
    startY = touch.clientY - posY;

    fullscreenImg.style.cursor = "grabbing";
});

fullscreenImg.addEventListener('touchmove', e => {
    if (!dragging || e.touches.length !== 1) return;

    const touch = e.touches[0];
    posX = touch.clientX - startX;
    posY = touch.clientY - startY;

    limitPosition();
    updateTransform();
});

fullscreenImg.addEventListener('touchend', () => {
    dragging = false;
    fullscreenImg.style.cursor = "grab";
});













let initialDistance = 0;
let initialScale = 1;

function getDistance(t1, t2) {
    return Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
}

fullscreenImg.addEventListener('touchstart', e => {
    if (e.touches.length === 2) {
        initialDistance = getDistance(e.touches[0], e.touches[1]);
        initialScale = scale;
    }
});

fullscreenImg.addEventListener('touchmove', e => {
    if (e.touches.length === 2) {
        e.preventDefault();

        const newDistance = getDistance(e.touches[0], e.touches[1]);
        const zoomFactor = newDistance / initialDistance;

        scale = initialScale * zoomFactor;
        scale = Math.min(Math.max(scale, 1), 5);

        limitPosition();
        updateTransform();
    }
});

function resetTransform() {
    // сбрасываем все переменные
    scale = 1;
    posX = 0;
    posY = 0;
    lastX = 0;
    lastY = 0;
    dragging = false;
    startX = 0;
    startY = 0;
    initialScale = 1;
    initialDistance = 0;

    // сброс визуальной трансформации
    fullscreenImg.style.transform = "translate(0px, 0px) scale(1)";
    fullscreenImg.style.cursor = "grab";
}
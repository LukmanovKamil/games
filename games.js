import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import {
    getDatabase,
    ref,
    get,
    set,
    onValue
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCcSPusMgUeawomzrsN37Bk5PDaxPNPJO0",
    authDomain: "lk-games-gtasa.firebaseapp.com",
    databaseURL: "https://lk-games-gtasa-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "lk-games-gtasa",
    storageBucket: "lk-games-gtasa.firebasestorage.app",
    messagingSenderId: "483790839435",
    appId: "1:483790839435:web:654bdc8da918a1d827fe8e"
  };

const ap = initializeApp(firebaseConfig);
const db = getDatabase(app);

const basePath = "checkboxes";

const checkBoxesId = document.querySelectorAll('.checkbox');

checkBoxesId.forEach((cb, index) => {
    cb.id = `id-${index + 1}`;
});

const dbRef = ref(db, "checkboxes");

onValue(dbRef, (snapshot) => {
    const data = snapshot.val() || {};

    checkBoxesId.forEach(cb => {
        const id = Number(cb.id.split('-')[1]);
        const checked = data[id];

        cb.classList.toggle('checked', !!checked);
    });

    updatePercents();
    visibility();
    sto();
    mapCheckList();
});

async function saveData(cb) {
    const id = Number(cb.id.split('-')[1]);
    const value = cb.classList.contains('checked');

    await set(ref(db, `checkboxes/${id}`), value);
}






// Подсчет процентов
function updatePercents() {
    // Процент страницы
    const globalPercent = document.querySelector('.global-percent');
    if (!globalPercent) return;
    const checkboxesGlobal = document.querySelectorAll('.checkbox').length;
    const checkedGlobal = document.querySelectorAll('.checkbox.checked').length;
    globalPercent.textContent = ((checkedGlobal / checkboxesGlobal) * 100).toFixed(2) + '%';
    // Процент карточек
    document.querySelectorAll('.card').forEach(card => {
        const cardPercent = card.querySelector('.card-percent');
        if (!cardPercent) return;
        const checkboxesСard = card.querySelectorAll('.checkbox').length;
        const checkedСard = card.querySelectorAll('.checkbox.checked').length;
        cardPercent.textContent = ((checkedСard / checkboxesСard) * 100).toFixed(2) + '%';
    });
    // Процент блока
    document.querySelectorAll('.block').forEach(block => {
        const blockPercent = block.querySelector('.block-percent');
        if (!blockPercent) return;
        const checkboxesBlock = block.querySelectorAll('.checkbox').length;
        const checkedBlock = block.querySelectorAll('.checkbox.checked').length;
        blockPercent.textContent = ((checkedBlock / checkboxesBlock) * 100).toFixed(2) + '%';
    });
}


// Автоскрытие блоков если чекбоксы все вкл
function visibility(checkbox = null) {
    const updateContainer = container => {
        const content = container.querySelector('.block-content, .card-content');
        if (!content) return;
        const checkboxes = container.querySelectorAll('.checkbox');
        const allChecked = [...checkboxes].every(cb => cb.classList.contains('checked'));
        if (container.classList.contains('block')) {

            if (container.querySelector('.block-header') && allChecked) {
                content.classList.add('hidden');
            } else {
                content.classList.remove('hidden');
            }
        } else {
            content.classList.toggle('hidden', allChecked);
        }
    };
    if (!checkbox) {
        document.querySelectorAll('.block, .card').forEach(updateContainer);
        return;
    }
    const block = checkbox.closest('.block');
    if (block) updateContainer(block);
    const card = checkbox.closest('.card');
    if (card) updateContainer(card);
}


// Обработчик чекбоксов
document.addEventListener('click', e => {
    const checkbox = e.target.closest('.checkbox');
    if (!checkbox) return;
    checkbox.classList.toggle('checked');
    mapCheckList()
    updatePercents();
    visibility(checkbox);
    sto()
    saveData(checkbox);
});


// Изменение дизайна если карточки и блоки на 100
function sto() {
    // Блок
    document.querySelectorAll('.block').forEach(block => {
        const blockHeader = block.querySelector('.block-header');
        if (!blockHeader) return;
        const blockTitle = block.querySelector('.block-title');
        const blockPercent = block.querySelector('.block-percent');
        const checkboxes = block.querySelectorAll('.checkbox');
        const allChecked = [...checkboxes].every(cb => cb.classList.contains('checked'));
        if (allChecked) {
            blockHeader.classList.add('sto');
            blockTitle.classList.add('sto');
            blockPercent.classList.add('sto');
        } else {
            blockHeader.classList.remove('sto');
            blockTitle.classList.remove('sto');
            blockPercent.classList.remove('sto');
        }
    });
    // Карточка
    document.querySelectorAll('.card').forEach(card => {
        const cardkHeader = card.querySelector('.card-header');
        const cardTitle = card.querySelector('.card-title');
        const cardPercent = card.querySelector('.card-percent');
        const checkboxes = card.querySelectorAll('.checkbox');
        const allChecked = [...checkboxes].every(cb => cb.classList.contains('checked'));
        if (allChecked) {
            cardkHeader.classList.add('sto');
            cardTitle.classList.add('sto');
            cardPercent.classList.add('sto');
        } else {
            cardkHeader.classList.remove('sto');
            cardTitle.classList.remove('sto');
            cardPercent.classList.remove('sto');
        }
    });
}


// Сворачивание карточек
document.querySelectorAll('.card-header').forEach(el => {
    el.addEventListener('click', () => {
        el.nextElementSibling.classList.toggle('hidden');
    });
});


// Сворачивание блоков
document.querySelectorAll('.block-header').forEach(el => {
    el.addEventListener('click', () => {
        el.nextElementSibling.classList.toggle('hidden');
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



// fullscreen
const fullscreen = document.querySelector('.fullscreen');
const fsWrap = fullscreen.querySelector('.fs-wrap');
const fsMap = fsWrap.querySelector('.fs-map');
const fsImg = fsMap.querySelector('.fs-img');
const fsMarker = fsMap.querySelector('.fs-marker');
const fsLineX = fsMap.querySelector('.fs-lineX');
const fsLineY = fsMap.querySelector('.fs-lineY');

const fsPopup = fullscreen.querySelector('.fs-popup');
const fsPopupimg = fullscreen.querySelector('.fs-popupimg');
const fsCheckbox = fullscreen.querySelector('.fs-checkbox');
const fsText = fullscreen.querySelector('.fs-text');
const fsCb = fullscreen.querySelector('.fs-cb');

document.querySelectorAll('.img').forEach(img => {
    img.addEventListener('click', () => {
        const checkbox = img.closest('.item').querySelector('.checkbox');
        fsPopup._checkbox = checkbox;
        fsCheckbox.classList.toggle(
            'checked',
            checkbox.classList.contains('checked')
        );
        fullscreen.style.display = 'flex'
        fsImg.src = img.dataset.popup;
        fsMap.style.cursor = "grab";

        const mX = img.getAttribute('markerX');
        const mY = img.getAttribute('markerY');
        const icon = img.dataset.icon;
        fsPopupimg.src = img.src;
        const text = img.previousElementSibling.textContent;

        fsMarker.src = icon;
        fsText.textContent = text;
        fsMarker.style.left = mX;
        fsMarker.style.bottom = mY;
        fsLineX.style.left = mX;
        fsLineY.style.bottom = mY;
        fsPopup.style.display = 'block';
    });
});

fsMarker.addEventListener('click', () => {
    if (fsPopup.style.display === 'block') {
        fsPopup.style.display = 'none';
    } else {
        fsPopup.style.display = 'block';
    }
});

fsPopupimg.addEventListener('click', () => {
    fsPopup.style.display = 'none';
});

// Клик по чекбоксу в попапе
fsCb.addEventListener('click', () => {
    const checkbox = fsPopup._checkbox;
    if (!checkbox) return;
    checkbox.classList.toggle('checked');
    fsCheckbox.classList.toggle(
        'checked',
        checkbox.classList.contains('checked')
    );
    fullscreen.style.display = 'none';
    updatePercents();
    visibility(checkbox);
    sto();
    saveData(checkbox);
    mapCheckList()
});

fullscreen.addEventListener('click', e => {
    if (e.target === fullscreen) {
        closeFullscreen();
    }
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        closeFullscreen();
    }
});

function closeFullscreen() {
    fullscreen.style.display = 'none';
    resetTransform();
}


// Приближение, перемещение и лимит для фулскрин
let scale = 1;
let posX = 0;
let posY = 0;
let dragging = false;
let startX = 0;
let startY = 0;

fsMap.addEventListener('wheel', e => {
    e.preventDefault();

    const zoomSpeed = 0.3;
    const parent = fsMap.parentElement; // .fs-wrap

    // координаты мыши относительно контейнера
    const rect = parent.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    const prevScale = scale;
    const delta = e.deltaY < 0 ? zoomSpeed : -zoomSpeed;
    scale = Math.min(Math.max(scale + delta, 1), 5);

    // смещаем карту так, чтобы точка под курсором оставалась на месте
    posX -= (offsetX - posX) * (scale / prevScale - 1);
    posY -= (offsetY - posY) * (scale / prevScale - 1);

    limitPosition();
    updateTransform();
});

function updateTransform() {
    fsMap.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
}

function limitPosition() {
    const parent = fsMap.parentElement; // .fs-wrap

    const parentWidth = parent.offsetWidth;
    const parentHeight = parent.offsetHeight;

    const mapWidth = fsMap.offsetWidth * scale;
    const mapHeight = fsMap.offsetHeight * scale;

    // если карта меньше контейнера — центрируем
    const minX = Math.min(parentWidth - mapWidth, 0);
    const minY = Math.min(parentHeight - mapHeight, 0);

    posX = Math.max(Math.min(posX, 0), minX);
    posY = Math.max(Math.min(posY, 0), minY);
}

fsMap.addEventListener('mousedown', e => {
    if (scale === 1) return;

    dragging = true;
    startX = e.clientX - posX;
    startY = e.clientY - posY;

    fsMap.style.cursor = "grabbing";

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
    fsMap.style.cursor = "grab";
};

document.addEventListener('mouseup', stopDragging);
document.addEventListener('mouseleave', stopDragging);

function resetTransform() {
    // сбрасываем все переменные
    scale = 1;
    posX = 0;
    posY = 0;
    dragging = false;
    startX = 0;
    startY = 0;

    // сброс визуальной трансформации
    fsMap.style.transform = "translate(0px, 0px) scale(1)";
}

















let wasFsDrag = false;
fsMap.addEventListener('touchstart', e => {
    wasFsDrag = false;

    if (e.touches.length === 1 && scale > 1) {
        const touch = e.touches[0];
        dragging = true;
        startX = touch.clientX - posX;
        startY = touch.clientY - posY;
    }
}, { passive: false });

document.addEventListener('touchmove', e => {
    if (!dragging || e.touches.length !== 1) return;

    wasFsDrag = true;

    const touch = e.touches[0];
    posX = touch.clientX - startX;
    posY = touch.clientY - startY;

    limitPosition();
    updateTransform();

    e.preventDefault(); // ❗ только если реально двигаем
}, { passive: false });

document.addEventListener('touchend', e => {
    dragging = false;

    // если НЕ было drag → это tap → даём клику пройти
    if (!wasFsDrag) {
        const target = e.target.closest('.map-img');
        if (target) {
            target.click();
        }
    }
});




let pinchStartDist = 0;
let pinchStartScale = 1;

function getTouchDistance(t1, t2) {
    return Math.hypot(
        t2.clientX - t1.clientX,
        t2.clientY - t1.clientY
    );
}

fsMap.addEventListener('touchstart', e => {
    if (e.touches.length === 2) {
        pinchStartDist = getTouchDistance(e.touches[0], e.touches[1]);
        pinchStartScale = scale;
        e.preventDefault();
    }
}, { passive: false });

fsMap.addEventListener('touchmove', e => {
    if (e.touches.length !== 2) return;

    const parent = fsMap.parentElement;
    const rect = parent.getBoundingClientRect();

    const t1 = e.touches[0];
    const t2 = e.touches[1];

    const currentDist = getTouchDistance(t1, t2);
    let newScale = pinchStartScale * (currentDist / pinchStartDist);

    newScale = Math.min(Math.max(newScale, 1), 5);

    // центр между пальцами
    const centerX = (t1.clientX + t2.clientX) / 2 - rect.left;
    const centerY = (t1.clientY + t2.clientY) / 2 - rect.top;

    const prevScale = scale;
    scale = newScale;

    posX -= (centerX - posX) * (scale / prevScale - 1);
    posY -= (centerY - posY) * (scale / prevScale - 1);

    limitPosition();
    updateTransform();

    e.preventDefault();
}, { passive: false });









































// Карта на второй странице
const map = document.querySelector('.map');

let mapscale = 1;
let mapposX = 0;
let mapposY = 0;
let mapdragging = false;
let mapstartX = 0;
let mapstartY = 0;

map.addEventListener('wheel', e => {
    e.preventDefault();
    map.style.cursor = "grab";
    const zoomSpeed = 0.3;
    const parent = map.parentElement;

    // координаты мыши относительно контейнера
    const rect = parent.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    const prevScale = mapscale;
    const delta = e.deltaY < 0 ? zoomSpeed : -zoomSpeed;
    mapscale = Math.min(Math.max(mapscale + delta, 1), 5);

    // смещаем карту так, чтобы точка под курсором оставалась на месте
    mapposX -= (offsetX - mapposX) * (mapscale / prevScale - 1);
    mapposY -= (offsetY - mapposY) * (mapscale / prevScale - 1);

    maplimitPosition();
    mapupdateTransform();
});

function mapupdateTransform() {
    map.style.transform = `translate(${mapposX}px, ${mapposY}px) scale(${mapscale})`;
}

function maplimitPosition() {
    const parent = map.parentElement;

    const parentWidth = parent.offsetWidth;
    const parentHeight = parent.offsetHeight;

    const mapWidth = map.offsetWidth * mapscale;
    const mapHeight = map.offsetHeight * mapscale;

    // если карта меньше контейнера — центрируем
    const minX = Math.min(parentWidth - mapWidth, 0);
    const minY = Math.min(parentHeight - mapHeight, 0);

    mapposX = Math.max(Math.min(mapposX, 0), minX);
    mapposY = Math.max(Math.min(mapposY, 0), minY);
}




map.addEventListener('mousedown', e => {
    if (mapscale === 1) return;

    mapdragging = true;
    mapstartX = e.clientX - mapposX;
    mapstartY = e.clientY - mapposY;

    map.style.cursor = "grabbing";

    e.preventDefault();
});

document.addEventListener('mousemove', e => {
    if (!mapdragging) return;

    mapposX = e.clientX - mapstartX;
    mapposY = e.clientY - mapstartY;

    maplimitPosition();
    mapupdateTransform();
});

const mapstopDragging = () => {
    if (!mapdragging) return;
    mapdragging = false;
    map.style.cursor = "grab";
};

document.addEventListener('mouseup', mapstopDragging);
document.addEventListener('mouseleave', mapstopDragging);







// Приближение, перемещение и лимит для карты на второй странице
const mapPopup = document.querySelector('.map-popup');
const mapPopupImg = mapPopup.querySelector('.map-popupimg');
const mapCheckbox = mapPopup.querySelector('.map-checkbox');
const mapCb = mapPopup.querySelector('.map-cb');

document.querySelectorAll('.map-item').forEach(mapItem => {
    const mapImg = mapItem.querySelector('.map-img');
    const x = mapImg.getAttribute('markerX');
    const y = mapImg.getAttribute('markerY');

    mapItem.style.left = x;
    mapItem.style.bottom = y;
});

document.querySelectorAll('.map-img').forEach(mapImg => {
    mapImg.addEventListener('click', () => {
        const checkbox = mapImg.closest('.map-item').querySelector('.checkbox');

        // Клик на тот же маркер
        if (mapPopup._checkbox === checkbox) {
            mapPopup.style.display = mapPopup.style.display === 'block' ? 'none' : 'block';
            return;
        }

        // Клик на другой маркер
        mapPopupImg.src = mapImg.dataset.popup;
        mapPopup._checkbox = checkbox;

        mapCheckbox.classList.toggle(
            'checked',
            checkbox.classList.contains('checked')
        );

        mapPopup.style.display = 'block';
    });
});

// Клик по чекбоксу в попапе
mapCb.addEventListener('click', () => {
    const checkbox = mapPopup._checkbox;
    if (!checkbox) return;

    // переключаем состояние
    checkbox.classList.toggle('checked');

    // синхронизируем попап
    mapCheckbox.classList.toggle(
        'checked',
        checkbox.classList.contains('checked')
    );

    mapPopup.style.display = 'none';
    updatePercents();
    visibility(checkbox);
    sto();
    saveData(checkbox);
    mapCheckList()
});

// Клик на картинку в попапе закрывает его
mapPopupImg.addEventListener('click', () => {
    mapPopup.style.display = 'none';
});

document.addEventListener('click', (e) => {
    // Если клик **не на попапе и не на маркере**, закрываем
    if (
        !mapPopup.contains(e.target) &&
        !e.target.classList.contains('map-img')
    ) {
        mapPopup.style.display = 'none';
        mapPopup._checkbox = null;
    }
});
;
















let wasMapDrag = false;
map.addEventListener('touchstart', e => {
    wasMapDrag = false;

    // один палец — потенциальный drag
    if (e.touches.length === 1 && mapscale > 1) {
        const touch = e.touches[0];
        mapdragging = true;
        mapstartX = touch.clientX - mapposX;
        mapstartY = touch.clientY - mapposY;
    }

    // два пальца — pinch (оставляем твою логику)
    if (e.touches.length === 2) {
        mappinchStartDist = mapGetTouchDistance(e.touches[0], e.touches[1]);
        mappinchStartScale = mapscale;
        e.preventDefault();
    }
}, { passive: false });

document.addEventListener('touchmove', e => {
    if (!mapdragging || e.touches.length !== 1) return;

    wasMapDrag = true;

    const touch = e.touches[0];
    mapposX = touch.clientX - mapstartX;
    mapposY = touch.clientY - mapstartY;

    maplimitPosition();
    mapupdateTransform();

    e.preventDefault(); // ❗ только при реальном движении
}, { passive: false });

document.addEventListener('touchend', e => {
    mapdragging = false;

    // если это был tap — вручную прокидываем клик
    if (!wasMapDrag) {
        const target = e.target.closest('.map-img');
        if (target) {
            target.click();
        }
    }
});

let mappinchStartDist = 0;
let mappinchStartScale = 1;

function mapGetTouchDistance(t1, t2) {
    return Math.hypot(
        t2.clientX - t1.clientX,
        t2.clientY - t1.clientY
    );
}

map.addEventListener('touchstart', e => {
    if (e.touches.length === 2) {
        mappinchStartDist = mapGetTouchDistance(e.touches[0], e.touches[1]);
        mappinchStartScale = mapscale;
        e.preventDefault();
    }
}, { passive: false });

map.addEventListener('touchmove', e => {
    if (e.touches.length !== 2) return;

    const parent = map.parentElement;
    const rect = parent.getBoundingClientRect();

    const t1 = e.touches[0];
    const t2 = e.touches[1];

    const currentDist = mapGetTouchDistance(t1, t2);
    let newScale = mappinchStartScale * (currentDist / mappinchStartDist);

    newScale = Math.min(Math.max(newScale, 1), 5);

    // центр между пальцами
    const centerX = (t1.clientX + t2.clientX) / 2 - rect.left;
    const centerY = (t1.clientY + t2.clientY) / 2 - rect.top;

    const prevScale = mapscale;
    mapscale = newScale;

    mapposX -= (centerX - mapposX) * (mapscale / prevScale - 1);
    mapposY -= (centerY - mapposY) * (mapscale / prevScale - 1);

    maplimitPosition();
    mapupdateTransform();

    e.preventDefault();
}, { passive: false });
























// Чеклист на карте
function mapCheckList() {
        const map = document.querySelector('.map');

        const pmCheckboxes = map.querySelectorAll('.checkbox').length;
        const pmChecked = map.querySelectorAll('.checkbox.checked').length;
        const pm = document.querySelector('.pm');
        if (!pm) return;
        const pmCheck = pm.querySelector('.col-check');
        pmCheck.textContent = `${pmChecked} из ${pmCheckboxes}`;

        const pm1Checkboxes = map.querySelectorAll('.map-item img.m1').length;
        const pm1Checked = map.querySelectorAll('.map-item .checkbox.checked + img.m1').length;
        const pm1 = document.querySelector('.pm1');
        if (!pm1) return;
        const pm1Check = pm1.querySelector('.col-check');
        pm1Check.textContent = `${pm1Checked} из ${pm1Checkboxes}`;

        const pm2Checkboxes = map.querySelectorAll('.map-item img.m2').length;
        const pm2Checked = map.querySelectorAll('.map-item .checkbox.checked + img.m2').length;
        const pm2 = document.querySelector('.pm2');
        if (!pm2) return;
        const pm2Check = pm2.querySelector('.col-check');
        pm2Check.textContent = `${pm2Checked} из ${pm2Checkboxes}`;

        const pm3Checkboxes = map.querySelectorAll('.map-item img.m3').length;
        const pm3Checked = map.querySelectorAll('.map-item .checkbox.checked + img.m3').length;
        const pm3 = document.querySelector('.pm3');
        if (!pm3) return;
        const pm3Check = pm3.querySelector('.col-check');
        pm3Check.textContent = `${pm3Checked} из ${pm3Checkboxes}`;

        const pm4Checkboxes = map.querySelectorAll('.map-item img.m4').length;
        const pm4Checked = map.querySelectorAll('.map-item .checkbox.checked + img.m4').length;
        const pm4 = document.querySelector('.pm4');
        if (!pm4) return;
        const pm4Check = pm4.querySelector('.col-check');
        pm4Check.textContent = `${pm4Checked} из ${pm4Checkboxes}`;
}

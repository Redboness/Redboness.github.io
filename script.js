// --- Selección de Elementos del DOM ---
const chatMessages = document.querySelector('.chat-messages');
const buttonRefresh = document.querySelector('.button-refresh');
const textInput = document.querySelector('.text-input');
const sendButton = document.querySelector('.send-button');

// Panel Lateral
const sidePanel = document.getElementById('side-panel');
const openPanelButton = document.querySelector('.chat-header .button-panel:not(#close-panel-btn)'); // Selector específico
const closePanelButton = document.getElementById('close-panel-btn');
const panelContent = document.querySelector('#side-panel .panel-content');
const panelSectionContents = document.querySelectorAll('.panel-section-content');

// --- Selectores Pantalla Nickname y Contenedor Chat ---
const nicknameScreen = document.getElementById('nickname-screen');
const nicknameInput = document.getElementById('nickname-input');
const nicknameSubmitButton = document.getElementById('nickname-submit');
const nicknameError = document.getElementById('nickname-error');
const chatContainer = document.querySelector('.chat-container');

// --- Selector para el span del nickname en la cabecera ---
const headerNicknameSpan = document.getElementById('header-nickname');
// console.log('DEBUG: Elemento Span Cabecera encontrado:', headerNicknameSpan); // Opcional

// --- Selectores Panel Ajustes (AÑADIDO) ---
const settingsNicknameInput = document.getElementById('settings-nickname-input');
const settingsAvatarUrlInput = document.getElementById('settings-avatar-url-input');
const settingsAvatarPreview = document.getElementById('settings-avatar-preview');
const settingsSaveButton = document.getElementById('settings-save-btn');
const settingsFeedback = document.getElementById('settings-feedback');
// --- FIN AÑADIDO ---

// --- Botones iniciales ---
let tipsButton = null;
let newsButton = null;

// --- Datos ---
const botAvatarUrl = 'https://i.postimg.cc/GpMfkzPx/Rat-n-profesor-Copy.png';
// Variable para Avatar de Usuario - Se inicializa en DOMContentLoaded
let userAvatarUrl = 'https://i.postimg.cc/SQwcn892/Ni-o-avatar-copy.png'; // Valor por defecto inicial

const tips = [
    { title: "Consejo 1:", text: "Revisa siempre la fuente de la información. ¿Es conocida? ¿Es fiable?", imageUrl: null },
    { title: "Consejo 2:", text: "Busca otras fuentes que confirmen o desmientan la noticia. No te quedes con la primera versión.", imageUrl: null },
    { title: "Consejo 3:", text: "Fíjate en la fecha de publicación. A veces, noticias antiguas se hacen pasar por actuales.", imageUrl: null }
];
let userNickname = null;

// --- Funciones ---

function createInitialMessageHtml() {
    let welcomeText = userNickname
        ? `¡Encantado de conocerte, ${userNickname}! Soy Pimpoyo.`
        : `¡Encantado/a de conocerte! soy Pimpoyo.`;
    return `
        <div class="message received" id="initial-message">
            <img src="${botAvatarUrl}" alt="Avatar de Pimpollo" class="avatar bot-avatar">
            <div class="message-bubble">
                <p>${welcomeText} Puedo ayudarte con tips y consejos, descifrar noticias falsas o simplemente conversar un rato. ¿Cómo empezamos?</p>
                <div class="message-buttons">
                    <button id="btn-tips">TIPS Y CONSEJOS</button>
                    <button id="btn-news">DESCIFRAR NOTICIAS FALSAS</button>
                </div>
            </div>
        </div>
    `;
}

function addBotMessage(htmlContent, messageId = null) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'received');
    if (messageId) { messageElement.id = messageId; }
    messageElement.innerHTML = `
    <img src="${botAvatarUrl}" alt="Avatar de Pimpollo" class="avatar bot-avatar">
    <div class="message-bubble"> ${htmlContent} </div>
  `;
    if (chatMessages) {
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    else { console.error("Error: chatMessages no encontrado al añadir mensaje de bot."); }
}

function addUserMessage(textContent) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'sent');
    const buttonHtml = `<button class="choice-button">${textContent}</button>`;
    // Usamos userAvatarUrl que ahora puede cambiar
    messageElement.innerHTML = `
    <img src="${userAvatarUrl}" alt="Avatar de ${userNickname || 'Usuario'}" class="avatar user-avatar"> <div class="message-bubble"> ${buttonHtml} </div>
  `;
    if (chatMessages) {
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    else { console.error("Error: chatMessages no encontrado al añadir mensaje de usuario."); }
}

function addUserTextMessage(textContent) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'sent');
    const escapedText = textContent.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    // Usamos userAvatarUrl que ahora puede cambiar
    messageElement.innerHTML = `
    <img src="${userAvatarUrl}" alt="Avatar de ${userNickname || 'Usuario'}" class="avatar user-avatar"> <div class="message-bubble"> <p>${escapedText}</p> </div>
  `;
    if (chatMessages) {
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    else { console.error("Error: chatMessages no encontrado al añadir mensaje de texto de usuario."); }
}

// --- Lógica de Tips ---

function createTipCarouselBubble() {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'received', 'tip-carousel-message');
    messageElement.dataset.currentTipIndex = '0';
    messageElement.innerHTML = `
        <img src="${botAvatarUrl}" alt="Avatar de Pimpollo" class="avatar bot-avatar">
        <div class="message-bubble">
            <div class="tip-content-area">
                 <p><strong class="tip-title"></strong></p>
                 <p class="tip-text"></p>
            </div>
            <div class="navigation-buttons tip-navigation" style="text-align: right; margin-top: 10px; display: flex; justify-content: flex-end; gap: 10px;"></div>
        </div>`;
    return messageElement;
}

function updateTipContent(index, bubbleElement) {
    if (!bubbleElement || index < 0 || index >= tips.length) {
        console.error("Error: No se puede actualizar el contenido del tip.", bubbleElement, index);
        return;
    }
    bubbleElement.dataset.currentTipIndex = index;
    const tip = tips[index];
    const isFirstTip = (index === 0);
    const isLastTip = (index === tips.length - 1);
    const titleElement = bubbleElement.querySelector('.tip-title');
    const textElement = bubbleElement.querySelector('.tip-text');
    const navContainer = bubbleElement.querySelector('.tip-navigation');

    if (titleElement) titleElement.textContent = tip.title;
    if (textElement) textElement.textContent = tip.text;

    let navHtml = '';
    if (isLastTip) {
        navHtml = `<button class="btn-action btn-understood-tips">He entendido los consejos</button>`;
    } else {
        const prevDisabled = isFirstTip ? 'disabled' : '';
        navHtml = `<button class="btn-nav btn-prev-tip" aria-label="Anterior" ${prevDisabled}><i class="fa-solid fa-arrow-left"></i></button>
                   <button class="btn-nav btn-next-tip" aria-label="Siguiente"><i class="fa-solid fa-arrow-right"></i></button>`;
    }
    if (navContainer) navContainer.innerHTML = navHtml;
}

function startTipsFlow() {
    console.log('Iniciando flujo de Tips con NUEVA burbuja');
    const currentTipIndex = 0;
    const newBubbleElement = createTipCarouselBubble();
    if (chatMessages) {
        chatMessages.appendChild(newBubbleElement);
    } else { console.error("Error: chatMessages no encontrado en startTipsFlow."); return; }
    updateTipContent(currentTipIndex, newBubbleElement);
    if (chatMessages) { chatMessages.scrollTop = chatMessages.scrollHeight; }
}

function handleNextTipClick(event) {
    console.log("Clic en Siguiente Tip");
    const button = event.currentTarget;
    const bubbleElement = button.closest('.tip-carousel-message');
    if (!bubbleElement) return;
    let currentTipIndex = parseInt(bubbleElement.dataset.currentTipIndex || '0', 10);
    if (currentTipIndex < tips.length - 1) {
        currentTipIndex++;
        updateTipContent(currentTipIndex, bubbleElement);
    }
}

function handlePreviousTipClick(event) {
    console.log("Clic en Anterior Tip");
    const button = event.currentTarget;
    const bubbleElement = button.closest('.tip-carousel-message');
    if (!bubbleElement) return;
    let currentTipIndex = parseInt(bubbleElement.dataset.currentTipIndex || '0', 10);
    if (currentTipIndex > 0) {
        currentTipIndex--;
        updateTipContent(currentTipIndex, bubbleElement);
    }
}

function handleUnderstoodTipsClick(event) {
    console.log("Clic en He entendido los Tips");
    const button = event.currentTarget;
    const bubbleElement = button.closest('.tip-carousel-message');
    const buttonText = button.textContent;
    if (bubbleElement) {
        const navContainer = bubbleElement.querySelector('.tip-navigation');
        if (navContainer) navContainer.innerHTML = '';
    }
    addUserMessage(buttonText);
    setTimeout(askRepeatTips, 500);
}

function askRepeatTips() {
    const askHtml = `
        <p>¡Estupendo que hayas revisado los consejos! 👍</p>
        <p>¿Te gustaría repasarlos de nuevo?</p>
        <div class="message-buttons">
            <button id="btn-repeat-tips-yes" class="btn-action">Sí, por favor</button>
            <button id="btn-repeat-tips-no" class="btn-action">No, gracias</button>
        </div>
    `;
    addBotMessage(askHtml);
}

// --- Otras Funciones ---
function startNewsFlow() {
    console.log('Iniciando flujo de Noticias Falsas');
    const initialMsg = document.getElementById('initial-message');
    if (initialMsg) {
        const buttons = initialMsg.querySelector('.message-buttons');
        if (buttons && buttons.style.display !== 'none') { buttons.style.display = 'none'; }
    }
    const newsIntroContent = `<p>¡Muy bien! Vamos a analizar juntos.</p><p>Imagina que lees este titular: <i>"Científicos descubren que comer chocolate adelgaza"</i>.</p><p>¿Qué es lo primero que deberías preguntarte?</p>`;
    addBotMessage(newsIntroContent);
    setTimeout(offerNextStepGeneral, 3500);
}

function handleInitialChoice(event) {
    const chosenButton = event.target;
    const choiceText = chosenButton.textContent;
    console.log(`Usuario eligió: ${choiceText}`);
    const initialButtonsContainer = chosenButton.closest('.message-buttons');
    if (initialButtonsContainer) { initialButtonsContainer.style.display = 'none'; }
    addUserMessage(choiceText);
    setTimeout(() => {
        if (chosenButton.id === 'btn-tips') { startTipsFlow(); }
        else if (chosenButton.id === 'btn-news') { startNewsFlow(); }
    }, 500);
}

function offerNextStepGeneral() {
    const offerHtml = `<p>De acuerdo. ¿Hay algo más en lo que te pueda ayudar?</p>
                     <div class="message-buttons">
                         <button id="btn-tips-again" class="btn-action">Ver Tips</button>
                         <button id="btn-news-again" class="btn-action">Descifrar Noticias Falsas</button>
                         <button id="btn-talk" class="btn-action">Sólo charlar</button>
                     </div>`;
    addBotMessage(offerHtml);
}

function attachInitialButtonListeners() {
    const initialMsg = document.getElementById('initial-message');
    if (!initialMsg) { console.warn("attachInitialButtonListeners: No se encontró #initial-message."); return; }
    tipsButton = initialMsg.querySelector('#btn-tips');
    newsButton = initialMsg.querySelector('#btn-news');
    if (tipsButton) {
        tipsButton.removeEventListener('click', handleInitialChoice);
        tipsButton.addEventListener('click', handleInitialChoice);
    } else { console.warn("attachInitialButtonListeners: No se encontró #btn-tips."); }
    if (newsButton) {
        newsButton.removeEventListener('click', handleInitialChoice);
        newsButton.addEventListener('click', handleInitialChoice);
    } else { console.warn("attachInitialButtonListeners: No se encontró #btn-news."); }
}

function resetChat() {
    console.log("Reiniciando chat...");
    if (chatMessages) { chatMessages.innerHTML = ''; }
    else { console.error("Error: chatMessages no encontrado en resetChat."); return; }
    // Llama a createInitialMessageHtml DESPUÉS de asegurar que userNickname está cargado
    chatMessages.innerHTML = createInitialMessageHtml();
    attachInitialButtonListeners();
    chatMessages.scrollTop = 0;
    if (sidePanel && sidePanel.classList.contains('open')) {
        sidePanel.classList.remove('open');
        panelSectionContents.forEach(content => { content.style.display = 'none'; });
    }
    console.log("Chat reiniciado.");
}

function openSidePanel() { if (sidePanel) { sidePanel.classList.add('open'); } else { console.error("Elemento #side-panel no encontrado"); } }
function closeSidePanel() { if (sidePanel) { sidePanel.classList.remove('open'); panelSectionContents.forEach(content => { content.style.display = 'none'; }); } else { console.error("Elemento #side-panel no encontrado"); } }

// --- Función para manejar clics en el panel (MODIFICADA) ---
function handlePanelClicks(event) {
    const target = event.target;
    const panelButton = target.closest('.panel-button'); // Botones Glosario, Stats, Ajustes

    if (panelButton && panelButton.id.startsWith('btn-')) {
        console.log("Clic en botón principal panel:", panelButton.id);
        const targetContentId = panelButton.id.replace('btn-', '') + '-content';

        panelSectionContents.forEach(content => { content.style.display = 'none'; }); // Oculta todos

        const targetContent = document.getElementById(targetContentId);
        if (targetContent) {
            targetContent.style.display = 'block'; // Muestra el correcto
            if (panelContent) panelContent.scrollTop = 0; // Reinicia scroll

            // --- LLAMADAS A FUNCIONES ESPECIALES AL ABRIR SECCIÓN ---
            if (targetContentId === 'stats-content') {
                displayStats(); // Actualiza barras de stats
            } else if (targetContentId === 'settings-content') {
                loadSettings(); // Carga ajustes actuales en los inputs
            }
            // --- FIN LLAMADAS ---

            console.log("Mostrando contenido:", targetContentId);
        } else {
            console.error("Contenido del panel no encontrado:", targetContentId);
        }
        return; // Detiene aquí
    }
    // Si se hace clic en otra cosa dentro del panel (ej: enlaces del índice), no hace nada especial aquí
}
// --- FIN handlePanelClicks ---

// --- Función para estadísticas (CON DATOS DE EJEMPLO) ---
function displayStats() {
    console.log("Mostrando/Actualizando estadísticas...");
    const userStats = {
        veracidad: 75,
        fuentes: 90,
        actualidad: 30
    };
    const getColorForStat = (statName, percentage) => {
        if (percentage < 40) return '#E57373';
        if (percentage < 70) return '#FFB74D';
        const defaultColors = { veracidad: '#A0522D', fuentes: '#FA77C5', actualidad: '#94AB3D' };
        return defaultColors[statName] || '#4DB6AC';
    }
    for (const statName in userStats) {
        const percentage = userStats[statName];
        const barId = `stat-bar-${statName}`;
        const barElement = document.getElementById(barId);
        if (barElement) {
            barElement.style.width = `${percentage}%`;
            barElement.style.backgroundColor = getColorForStat(statName, percentage);
        } else { console.warn(`Elemento de barra no encontrado con ID: ${barId}`); }
    }
}
// --- FIN displayStats ---

// --- Funciones para Cargar y Guardar Ajustes (AÑADIDAS) ---
function loadSettings() {
    console.log("Cargando ajustes...");
    // Comprueba si los elementos existen antes de usarlos
    if (!settingsNicknameInput || !settingsAvatarUrlInput || !settingsAvatarPreview) {
        console.error("Error: Faltan elementos del DOM en loadSettings.");
        return;
    }
    // Carga desde las variables globales (que se cargan desde localStorage al inicio)
    settingsNicknameInput.value = userNickname || '';
    settingsAvatarUrlInput.value = userAvatarUrl || '';
    // Muestra el avatar actual o uno por defecto si no hay URL válida o está vacía
    settingsAvatarPreview.src = (userAvatarUrl && userAvatarUrl.startsWith('http'))
        ? userAvatarUrl
        : 'https://i.postimg.cc/SQwcn892/Ni-o-avatar-copy.png'; // Placeholder si no hay/no es URL válida

    // Oculta mensaje feedback si existiera
    if (settingsFeedback) settingsFeedback.style.display = 'none';
}

function saveSettings() {
    console.log("Guardando ajustes...");

    if (!settingsNicknameInput || !settingsAvatarUrlInput || !headerNicknameSpan || !settingsAvatarPreview || !settingsFeedback) {
        console.error("Error: Faltan elementos del DOM para guardar ajustes.");
        return;
    }

    const newNickname = settingsNicknameInput.value.trim();
    const newAvatarUrl = settingsAvatarUrlInput.value.trim();

    if (newNickname === "") {
        alert("El nickname no puede estar vacío.");
        settingsNicknameInput.focus(); // Pone el foco en el input
        return;
    }

    // Usa placeholder si la URL se deja vacía
    const finalAvatarUrl = newAvatarUrl || 'https://i.postimg.cc/SQwcn892/Ni-o-avatar-copy.png';

    // Actualiza variables globales
    userNickname = newNickname;
    userAvatarUrl = finalAvatarUrl;

    // Guarda en localStorage
    try {
        localStorage.setItem('pimpoyoUserNickname', userNickname);
        localStorage.setItem('pimpoyoUserAvatarUrl', userAvatarUrl);
        console.log("Ajustes guardados en localStorage:", { userNickname, userAvatarUrl });
    } catch (e) {
        console.error("Error al guardar ajustes en localStorage:", e);
        settingsFeedback.textContent = "Error al guardar.";
        settingsFeedback.style.color = 'red'; // Mensaje de error
        settingsFeedback.style.display = 'block';
        return; // No continúa si no se pudo guardar
    }

    // Actualiza UI inmediatamente
    headerNicknameSpan.textContent = userNickname;
    settingsAvatarPreview.src = userAvatarUrl; // Actualiza preview

    // Muestra mensaje de éxito
    settingsFeedback.textContent = "¡Cambios guardados!";
    settingsFeedback.style.color = 'green'; // Asegura color verde
    settingsFeedback.style.display = 'block';
    setTimeout(() => {
        if (settingsFeedback) settingsFeedback.style.display = 'none';
    }, 2500);

    console.log("Ajustes guardados y UI actualizada.");
    // Nota: Los avatares antiguos en el chat no se actualizan aquí.
}
// --- FIN Funciones Ajustes ---


function sendMessage() {
    if (!textInput) return;
    const messageText = textInput.value.trim();
    if (messageText !== '') {
        addUserTextMessage(messageText);
        textInput.value = '';
        setTimeout(() => {
            const genericResponseHtml = `<p>He recibido tu mensaje: "${messageText.replace(/</g, "&lt;").replace(/>/g, "&gt;")}"</p>
                                     <p>Todavía estoy aprendiendo a conversar. 🤔</p>
                                     <p>¿Quizás prefieres intentar con los Tips o Noticias Falsas?</p>
                                     <div class="message-buttons">
                                         <button id="btn-tips-again" class="btn-action">Ver Tips</button>
                                         <button id="btn-news-again" class="btn-action">Descifrar Noticias</button>
                                     </div>`;
            addBotMessage(genericResponseHtml);
        }, 800);
    }
}

// --- Lógica Nickname ---
function handleNicknameSubmit() {
    if (!nicknameInput || !nicknameScreen || !chatContainer || !nicknameError || !headerNicknameSpan) {
        console.error("Error Crítico: Faltan elementos del DOM esenciales para handleNicknameSubmit.");
        console.log({ nicknameInput, nicknameScreen, chatContainer, nicknameError, headerNicknameSpan });
        if (nicknameError) {
            nicknameError.textContent = "Error interno. No se puede iniciar el chat.";
            nicknameError.style.display = 'block';
        }
        return;
    }
    const nickname = nicknameInput.value.trim();
    if (nickname === "") {
        nicknameError.textContent = "Por favor, introduce un nickname.";
        nicknameError.style.display = 'block';
        return;
    }
    nicknameError.textContent = "";
    nicknameError.style.display = 'none';
    userNickname = nickname; // Establece nickname global
    console.log("Nickname guardado en variable:", userNickname);

    // Establece avatar por defecto al registrar nickname nuevo (si no se cargó de localStorage)
    if (!localStorage.getItem('pimpoyoUserAvatarUrl')) {
        userAvatarUrl = 'https://i.postimg.cc/SQwcn892/Ni-o-avatar-copy.png';
        localStorage.setItem('pimpoyoUserAvatarUrl', userAvatarUrl); // Guarda el por defecto
        console.log("Estableciendo avatar por defecto en registro.");
    }


    if (headerNicknameSpan) { headerNicknameSpan.textContent = userNickname; }
    try { localStorage.setItem('pimpoyoUserNickname', userNickname); }
    catch (e) { console.error("Error al guardar nickname en localStorage:", e); }

    if (nicknameScreen) nicknameScreen.classList.add('hidden');
    if (chatContainer) chatContainer.classList.remove('hidden');
    resetChat();
    console.log("Nickname enviado y chat iniciado.");
}

// --- Event Listeners ---

// Listener principal delegado para burbujas de mensajes
if (chatMessages) {
    chatMessages.addEventListener('click', function (event) {
        const target = event.target;
        const buttonTarget = target.closest('button');
        if (!buttonTarget) return;

        // Botones DENTRO del carrusel de Tips
        if (buttonTarget.matches('.btn-next-tip')) { handleNextTipClick({ currentTarget: buttonTarget }); return; }
        if (buttonTarget.matches('.btn-prev-tip')) { handlePreviousTipClick({ currentTarget: buttonTarget }); return; }
        if (buttonTarget.matches('.btn-understood-tips')) { handleUnderstoodTipsClick({ currentTarget: buttonTarget }); return; }

        // Botones para repetir Tips
        if (buttonTarget.matches('#btn-repeat-tips-yes')) {
            addUserMessage(buttonTarget.textContent);
            setTimeout(startTipsFlow, 500);
            buttonTarget.closest('.message-buttons').style.display = 'none';
            return;
        }
        if (buttonTarget.matches('#btn-repeat-tips-no')) {
            addUserMessage(buttonTarget.textContent);
            setTimeout(offerNextStepGeneral, 500);
            buttonTarget.closest('.message-buttons').style.display = 'none';
            return;
        }

        // Botones de oferta general
        if (buttonTarget.matches('#btn-tips-again')) {
            addUserMessage(buttonTarget.textContent);
            setTimeout(startTipsFlow, 500);
            buttonTarget.closest('.message-buttons').style.display = 'none';
            return;
        }
        if (buttonTarget.matches('#btn-news-again')) {
            addUserMessage(buttonTarget.textContent);
            setTimeout(startNewsFlow, 500);
            buttonTarget.closest('.message-buttons').style.display = 'none';
            return;
        }
        if (buttonTarget.matches('#btn-talk')) {
            addUserMessage(buttonTarget.textContent);
            setTimeout(() => addBotMessage("<p>¡Claro! ¿De qué te gustaría hablar?</p>"), 500);
            buttonTarget.closest('.message-buttons').style.display = 'none';
            return;
        }
    });
} else { console.error("Error Crítico: El contenedor chatMessages no existe."); }

// Listeners directos para elementos fuera del flujo de mensajes
if (closePanelButton) { closePanelButton.addEventListener('click', closeSidePanel); }
else { console.error("Error Crítico: Botón para cerrar panel no encontrado (#close-panel-btn)."); }

if (buttonRefresh) { buttonRefresh.addEventListener('click', resetChat); }
else { console.error('Error Crítico: No se encontró .button-refresh'); }

if (openPanelButton) { openPanelButton.addEventListener('click', openSidePanel); }
else { console.error("Error Crítico: Botón para abrir panel no encontrado."); }

// Listener directo para botones y clics DENTRO del panel
if (panelContent) {
    panelContent.removeEventListener('click', handlePanelClicks); // Limpia por si acaso
    panelContent.addEventListener('click', handlePanelClicks); // Añade el listener actualizado
} else {
    console.error("Error Crítico: Contenedor de contenido del panel no encontrado (#side-panel .panel-content).");
}

// Listener para botón GUARDAR AJUSTES (AÑADIDO)
if (settingsSaveButton) {
    settingsSaveButton.addEventListener('click', saveSettings);
} else {
    // Este error solo aparecería si el HTML de ajustes no se ha añadido correctamente
    console.error("Error Crítico: No se encontró el botón #settings-save-btn.");
}
// FIN AÑADIDO

if (sendButton) { sendButton.addEventListener('click', sendMessage); }
else { console.error("Error Crítico: No se encontró el botón de enviar (.send-button)."); }

if (textInput) { textInput.addEventListener('keydown', function (event) { if ((event.key === 'Enter' || event.keyCode === 13) && !event.shiftKey) { event.preventDefault(); sendMessage(); } }); }
else { console.error("Error Crítico: No se encontró el input de texto (.text-input)."); }

// Listeners para pantalla de Nickname
if (nicknameSubmitButton) { nicknameSubmitButton.addEventListener('click', handleNicknameSubmit); }
else { console.error("Error Crítico: No se encontró el botón #nickname-submit."); }

if (nicknameInput) { nicknameInput.addEventListener('keydown', function (event) { if (event.key === 'Enter' || event.keyCode === 13) { event.preventDefault(); handleNicknameSubmit(); } }); }


// --- Lógica de Inicialización Principal (MODIFICADA para cargar Avatar URL) ---
document.addEventListener('DOMContentLoaded', () => {
    const localHeaderNicknameSpan = document.getElementById('header-nickname');
    const storedNickname = localStorage.getItem('pimpoyoUserNickname');
    // --- AÑADIDO: Cargar también URL de Avatar ---
    const storedAvatarUrl = localStorage.getItem('pimpoyoUserAvatarUrl');
    // --- FIN AÑADIDO ---
    const nicknameScreenElem = document.getElementById('nickname-screen');
    const chatContainerElem = document.querySelector('.chat-container');

    // Comprobación más robusta de elementos esenciales
    if (!nicknameScreenElem || !chatContainerElem || !localHeaderNicknameSpan) {
        console.error("Error Crítico en DOMContentLoaded: Faltan elementos esenciales (#nickname-screen, .chat-container o #header-nickname).");
        document.body.innerHTML = "Error al cargar la aplicación.";
        return;
    }

    if (storedNickname) {
        console.log("Nickname recuperado:", storedNickname);
        userNickname = storedNickname; // Establece nickname global
        // --- AÑADIDO: Asignar URL de Avatar si existe, si no, usa el placeholder ---
        userAvatarUrl = storedAvatarUrl || 'https://i.postimg.cc/SQwcn892/Ni-o-avatar-copy.png';
        console.log("Avatar URL recuperada:", userAvatarUrl);
        // --- FIN AÑADIDO ---

        localHeaderNicknameSpan.textContent = userNickname; // Actualiza header

        nicknameScreenElem.classList.add('hidden');
        chatContainerElem.classList.remove('hidden');
        resetChat(); // Inicia el chat
    } else {
        console.log("No se encontró nickname guardado.");
        // --- AÑADIDO: Asegurar avatar por defecto si no hay login ---
        userAvatarUrl = 'https://i.postimg.cc/SQwcn892/Ni-o-avatar-copy.png'; // Placeholder inicial
        // --- FIN AÑADIDO ---
        nicknameScreenElem.classList.remove('hidden');
        chatContainerElem.classList.add('hidden');
    }
});
// --- FIN MODIFICACIÓN ---
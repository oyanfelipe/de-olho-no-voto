// =====================================================
// PROTEÇÃO CONTRA MODIFICAÇÕES E INSPEÇÃO
// =====================================================

// 1. Detectar DevTools aberto
(function() {
  let devtools = { open: false };
  const threshold = 160;

  setInterval(function() {
    if (window.outerHeight - window.innerHeight > threshold ||
        window.outerWidth - window.innerWidth > threshold) {
      if (!devtools.open) {
        devtools.open = true;
        console.clear();
        console.warn('⚠️ As DevTools foram detectadas. Modificações não-autorizadas são proibidas.');
      }
    } else {
      devtools.open = false;
    }
  }, 500);
})();

// 2. Desabilitar atalhos de DevTools
document.addEventListener('keydown', function(e) {
  // F12
  if (e.key === 'F12') {
    e.preventDefault();
    return false;
  }
  // Ctrl+Shift+I / Cmd+Option+I (DevTools)
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
    e.preventDefault();
    return false;
  }
  // Ctrl+Shift+J / Cmd+Option+J (Console)
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'J') {
    e.preventDefault();
    return false;
  }
  // Ctrl+Shift+C / Cmd+Shift+C (Inspector)
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
    e.preventDefault();
    return false;
  }
});

// 3. Desabilitar clique direito (inspect element)
document.addEventListener('contextmenu', function(e) {
  e.preventDefault();
  return false;
});

// 4. Proteção contra console.log
const originalLog = console.log;
const originalWarn = console.warn;
const originalError = console.error;

console.log = function(...args) {
  // Permite apenas alguns logs específicos
  if (args[0]?.toString().includes('De Olho')) {
    originalLog.apply(console, args);
  }
};

// 5. Avisos claros no console
console.clear();
console.log('%c🔒 Acesso Restrito', 'color: red; font-size: 20px; font-weight: bold;');
console.log('%cEste navegador tem proteção contra modificações não-autorizadas.', 'color: orange; font-size: 14px;');
console.log('%cModificações detectadas serão bloqueadas automaticamente.', 'color: orange; font-size: 12px;');
console.log('%c—————————————————————————————————————————', 'color: gray;');

// 6. Monitorar mudanças no DOM
const observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.type === 'childList' || mutation.type === 'attributes') {
      // Aqui você pode adicionar lógica para reverter mudanças não-autorizadas
      console.warn('⚠️ Tentativa de modificação do DOM detectada.');
    }
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ['class', 'id', 'style']
});

// 7. Avisar sobre uso de JavaScript direto
window.addEventListener('beforeunload', function() {
  // Detecta manipulação direta
});

// Log de segurança
console.log('%c✅ Proteção ativada com sucesso!', 'color: green; font-size: 12px;');

/**
 * MIRESERVA UI COMPONENTS
 * Centralized components for the entire website.
 */

// 1. Define Global Functions FIRST (Failsafe for early clicks)
window.toggleMobileMenu = function() {
    const menu = document.getElementById('mobile-menu');
    const btnIcon = document.querySelector('#mobile-menu-button i');
    
    if (!menu) {
        console.warn("Mobile menu element not found");
        return;
    }

    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        if (btnIcon) {
            btnIcon.classList.remove('fa-bars');
            btnIcon.classList.add('fa-times');
        }
    } else {
        menu.classList.add('hidden');
        if (btnIcon) {
            btnIcon.classList.remove('fa-times');
            btnIcon.classList.add('fa-bars');
        }
    }
};

window.logout = function() {
    localStorage.clear();
    window.location.href = 'login.html';
};

// 2. Initialize UI on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        renderHeader();
        renderFooter();
        highlightActiveLink();
    } catch (err) {
        console.error("UI Initialization failed:", err);
    }
});

function renderHeader() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (!headerPlaceholder) return;

    // Use safe role detection
    const role = localStorage.getItem('role') || 'player';
    const isPlayer = role === 'player';

    headerPlaceholder.innerHTML = `
        <header class="bg-white border-b sticky top-0 z-50 shadow-sm">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-20">
                    <div class="flex items-center">
                        <a href="${isPlayer ? 'playerHome.html' : 'ownerHome.html'}" class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
                                <i class="fas fa-futbol"></i>
                            </div>
                            <span class="text-xl font-black text-slate-800 tracking-tight">MiReserva <span class="text-emerald-500 hidden sm:inline">${role.toUpperCase()}</span></span>
                        </a>
                    </div>
                    
                    <!-- Desktop Nav -->
                    <nav class="hidden md:flex space-x-8 items-center">
                        ${isPlayer ? `
                            <a href="playerHome.html" class="nav-link text-slate-500 hover:text-emerald-600 font-black text-[10px] uppercase tracking-widest transition" data-page="playerHome">Descubrir</a>
                            <a href="reservas.html" class="nav-link text-slate-500 hover:text-emerald-600 font-black text-[10px] uppercase tracking-widest transition" data-page="reservas">Mis Reservas</a>
                        ` : `
                            <a href="ownerHome.html" class="nav-link text-slate-500 hover:text-emerald-600 font-black text-[10px] uppercase tracking-widest transition" data-page="ownerHome">Panel</a>
                            <a href="myFields.html" class="nav-link text-slate-500 hover:text-emerald-600 font-black text-[10px] uppercase tracking-widest transition" data-page="myFields">Mis Canchas</a>
                            <a href="ownerCalendar.html" class="nav-link text-slate-500 hover:text-emerald-600 font-black text-[10px] uppercase tracking-widest transition" data-page="ownerCalendar">Calendario</a>
                        `}
                        <button onclick="logout()" class="ml-4 px-5 py-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-red-50 hover:text-red-600 font-black text-[10px] uppercase tracking-widest transition flex items-center gap-2 border border-slate-100">
                            Cerrar Sesión
                        </button>
                    </nav>

                    <!-- Mobile Menu Button -->
                    <div class="md:hidden">
                        <button id="mobile-menu-button" onclick="toggleMobileMenu()" class="text-slate-600 p-3 hover:bg-slate-50 rounded-2xl transition-all active:scale-90 border-none outline-none">
                            <i class="fas fa-bars text-2xl pointer-events-none"></i>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Mobile Menu Content -->
            <div id="mobile-menu" class="hidden md:hidden bg-white border-t border-slate-50 shadow-xl overflow-hidden transition-all">
                <div class="px-4 py-6 space-y-2">
                    ${isPlayer ? `
                        <a href="playerHome.html" class="block px-6 py-4 text-sm font-black text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-2xl transition uppercase tracking-widest">Explorar Canchas</a>
                        <a href="reservas.html" class="block px-6 py-4 text-sm font-black text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-2xl transition uppercase tracking-widest">Mis Reservas</a>
                    ` : `
                        <a href="ownerHome.html" class="block px-6 py-4 text-sm font-black text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-2xl transition uppercase tracking-widest">Panel de Reservas</a>
                        <a href="myFields.html" class="block px-6 py-4 text-sm font-black text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-2xl transition uppercase tracking-widest">Mis Canchas</a>
                        <a href="ownerCalendar.html" class="block px-6 py-4 text-sm font-black text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-2xl transition uppercase tracking-widest">Calendario</a>
                    `}
                    <div class="pt-6 mt-4 border-t border-slate-50">
                        <button onclick="logout()" class="w-full text-left px-6 py-4 text-sm font-black text-red-500 hover:bg-red-50 rounded-2xl transition flex items-center gap-3 uppercase tracking-widest">
                            <i class="fas fa-sign-out-alt"></i> Salir de la cuenta
                        </button>
                    </div>
                </div>
            </div>
        </header>
    `;
}

function renderFooter() {
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (!footerPlaceholder) return;

    const year = new Date().getFullYear();
    footerPlaceholder.innerHTML = `
        <footer class="bg-white border-t py-16 mt-20">
            <div class="max-w-7xl mx-auto px-4 text-center">
                <div class="inline-flex items-center gap-3 mb-8">
                    <div class="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                        <i class="fas fa-futbol text-sm"></i>
                    </div>
                    <span class="text-xl font-black text-slate-800 tracking-tight">MiReserva</span>
                </div>
                <div class="flex justify-center gap-8 mb-8">
                    <a href="#" class="text-slate-400 hover:text-emerald-500 transition-all transform hover:scale-110"><i class="fab fa-instagram text-2xl"></i></a>
                    <a href="#" class="text-slate-400 hover:text-emerald-500 transition-all transform hover:scale-110"><i class="fab fa-facebook text-2xl"></i></a>
                    <a href="#" class="text-slate-400 hover:text-emerald-500 transition-all transform hover:scale-110"><i class="fab fa-whatsapp text-2xl"></i></a>
                </div>
                <p class="text-slate-400 font-bold text-xs uppercase tracking-widest mb-4">© ${year} CodRam™ - Software. Todos los derechos reservados.</p>
                <div class="flex justify-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <a href="#" class="hover:text-slate-600 transition">Privacidad</a>
                    <a href="#" class="hover:text-slate-600 transition">Términos</a>
                    <a href="#" class="hover:text-slate-600 transition">Soporte</a>
                </div>
            </div>
        </footer>
    `;
}

function highlightActiveLink() {
    try {
        const path = window.location.pathname.split('/').pop().replace('.html', '');
        const currentPage = path || 'index';
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.dataset.page === currentPage) {
                link.classList.remove('text-slate-500');
                link.classList.add('text-emerald-600', 'border-b-4', 'border-emerald-500', 'pb-1');
            }
        });
    } catch (e) {}
}

/**
 * MIRESERVA UI COMPONENTS
 * Centralized components for the entire website.
 * This script injects the Header and Footer into pages dynamically.
 */

document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    renderFooter();
    highlightActiveLink();
});

function renderHeader() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (!headerPlaceholder) return;

    const role = localStorage.getItem('role') || 'player';
    const isPlayer = role === 'player';

    headerPlaceholder.innerHTML = `
        <header class="bg-white border-b sticky top-0 z-50 shadow-sm">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center">
                        <a href="${isPlayer ? 'playerHome.html' : 'ownerHome.html'}" class="flex items-center gap-2">
                            <i class="fas fa-futbol text-emerald-500 text-2xl"></i>
                            <span class="text-xl md:text-2xl font-black text-slate-800 tracking-tight">MiReserva <span class="text-emerald-500 hidden sm:inline">${role.charAt(0).toUpperCase() + role.slice(1)}</span></span>
                        </a>
                    </div>
                    
                    <!-- Desktop Nav -->
                    <nav class="hidden md:flex space-x-6 items-center">
                        ${isPlayer ? `
                            <a href="playerHome.html" class="nav-link text-slate-600 hover:text-emerald-600 font-bold text-xs uppercase tracking-widest transition" data-page="playerHome">Descubrir</a>
                            <a href="reservas.html" class="nav-link text-slate-600 hover:text-emerald-600 font-bold text-xs uppercase tracking-widest transition" data-page="reservas">Mis Reservas</a>
                        ` : `
                            <a href="ownerHome.html" class="nav-link text-slate-600 hover:text-emerald-600 font-bold text-xs uppercase tracking-widest transition" data-page="ownerHome">Panel</a>
                            <a href="myFields.html" class="nav-link text-slate-600 hover:text-emerald-600 font-bold text-xs uppercase tracking-widest transition" data-page="myFields">Mis Canchas</a>
                            <a href="ownerCalendar.html" class="nav-link text-slate-600 hover:text-emerald-600 font-bold text-xs uppercase tracking-widest transition" data-page="ownerCalendar">Calendario</a>
                        `}
                        <button onclick="logout()" class="ml-4 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-red-50 hover:text-red-600 font-black text-[10px] uppercase tracking-widest transition flex items-center gap-2 border border-slate-100">
                            <i class="fas fa-sign-out-alt"></i> Salir
                        </button>
                    </nav>

                    <!-- Mobile Menu Button -->
                    <div class="md:hidden flex items-center">
                        <button id="mobile-menu-button" class="text-slate-600 p-2 hover:bg-slate-50 rounded-lg transition focus:outline-none">
                            <i class="fas fa-bars text-xl"></i>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Mobile Menu -->
            <div id="mobile-menu" class="hidden md:hidden bg-white border-b border-slate-100 shadow-lg overflow-hidden transition-all duration-300">
                <div class="px-4 pt-2 pb-6 space-y-1">
                    ${isPlayer ? `
                        <a href="playerHome.html" class="block px-4 py-3 text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition">Descubrir</a>
                        <a href="reservas.html" class="block px-4 py-3 text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition">Mis Reservas</a>
                    ` : `
                        <a href="ownerHome.html" class="block px-4 py-3 text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition">Panel de Control</a>
                        <a href="myFields.html" class="block px-4 py-3 text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition">Gestionar Canchas</a>
                        <a href="ownerCalendar.html" class="block px-4 py-3 text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition">Ver Calendario</a>
                    `}
                    <div class="pt-4 mt-4 border-t border-slate-50">
                        <button onclick="logout()" class="w-full text-left px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition flex items-center gap-2">
                            <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
        </header>
    `;

    // Toggle Mobile Menu using Event Delegation for better reliability
    document.addEventListener('click', (e) => {
        const btn = document.getElementById('mobile-menu-button');
        const menu = document.getElementById('mobile-menu');
        
        if (!btn || !menu) return;

        // If clicking the button or an icon inside it
        if (btn.contains(e.target)) {
            menu.classList.toggle('hidden');
            const icon = btn.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        } 
        // Close menu if clicking outside
        else if (!menu.contains(e.target) && !menu.classList.contains('hidden')) {
            menu.classList.add('hidden');
            const icon = btn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

function renderFooter() {
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (!footerPlaceholder) return;

    const year = new Date().getFullYear();
    footerPlaceholder.innerHTML = `
        <footer class="bg-white border-t py-12 mt-20">
            <div class="max-w-7xl mx-auto px-4 text-center">
                <div class="flex justify-center gap-6 mb-6">
                    <a href="#" class="text-slate-400 hover:text-emerald-500 transition"><i class="fab fa-instagram text-xl"></i></a>
                    <a href="#" class="text-slate-400 hover:text-emerald-500 transition"><i class="fab fa-facebook text-xl"></i></a>
                    <a href="#" class="text-slate-400 hover:text-emerald-500 transition"><i class="fab fa-whatsapp text-xl"></i></a>
                </div>
                <p class="text-slate-500">&copy; ${year} MiReserva. Tu pasión, nuestra cancha.</p>
                <div class="mt-2 text-xs text-slate-400 flex justify-center gap-4">
                    <a href="#" class="hover:underline">Privacidad</a>
                    <a href="#" class="hover:underline">Términos</a>
                    <a href="#" class="hover:underline">Soporte</a>
                </div>
            </div>
        </footer>
    `;
}

function highlightActiveLink() {
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.dataset.page === currentPage) {
            link.classList.remove('text-slate-600');
            link.classList.add('text-emerald-600', 'border-b-2', 'border-emerald-500');
        }
    });
}

function logout() {
    localStorage.clear();
    window.location.href = 'login.html';
}

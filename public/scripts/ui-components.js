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

    const role = localStorage.getItem('role') || 'player'; // Default for UI preview
    const isPlayer = role === 'player';

    headerPlaceholder.innerHTML = `
        <header class="bg-white border-b sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center">
                        <a href="${isPlayer ? 'playerHome.html' : 'ownerHome.html'}" class="flex items-center gap-2">
                            <i class="fas fa-futbol text-emerald-500 text-2xl"></i>
                            <span class="text-2xl font-bold text-slate-800">MiReserva <span class="text-emerald-500">${role.charAt(0).toUpperCase() + role.slice(1)}</span></span>
                        </a>
                    </div>
                    <nav class="hidden md:flex space-x-8 items-center">
                        ${isPlayer ? `
                            <a href="playerHome.html" class="nav-link text-slate-600 hover:text-emerald-600 font-medium transition" data-page="playerHome">Descubrir</a>
                            <a href="reservas.html" class="nav-link text-slate-600 hover:text-emerald-600 font-medium transition" data-page="reservas">Mis Reservas</a>
                        ` : `
                            <a href="ownerHome.html" class="nav-link text-slate-600 hover:text-emerald-600 font-medium transition" data-page="ownerHome">Panel</a>
                            <a href="myFields.html" class="nav-link text-slate-600 hover:text-emerald-600 font-medium transition" data-page="myFields">Mis Canchas</a>
                            <a href="ownerCalendar.html" class="nav-link text-slate-600 hover:text-emerald-600 font-medium transition" data-page="ownerCalendar">Calendario</a>
                        `}
                        <button onclick="logout()" class="ml-4 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-red-50 hover:text-red-600 font-medium transition flex items-center gap-2">
                            <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
                        </button>
                    </nav>
                    <div class="md:hidden">
                        <button class="text-slate-600"><i class="fas fa-bars text-xl"></i></button>
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

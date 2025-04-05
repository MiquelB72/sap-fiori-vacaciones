document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos DOM
    const menuButton = document.getElementById('menuButton');
    const sidebar = document.getElementById('sidebar');
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const requestButton = document.querySelector('.primary-button');
    const requestModal = document.getElementById('requestModal');
    const closeModal = document.getElementById('closeModal');
    const cancelRequest = document.getElementById('cancelRequest');
    const submitRequest = document.getElementById('submitRequest');
    const absenceForm = document.getElementById('absenceForm');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    
    // Toggle sidebar
    menuButton.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
    });
    
    // Cambiar pestañas
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Desactivar todas las pestañas
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Activar la pestaña seleccionada
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Abrir modal de solicitud
    requestButton.addEventListener('click', function() {
        requestModal.classList.add('active');
    });
    
    // Cerrar modal
    function closeModalFunction() {
        requestModal.classList.remove('active');
        absenceForm.reset();
    }
    
    closeModal.addEventListener('click', closeModalFunction);
    cancelRequest.addEventListener('click', closeModalFunction);
    
    // Enviar solicitud
    submitRequest.addEventListener('click', function() {
        // Validar formulario
        const absenceType = document.getElementById('absenceType').value;
        const startDate = startDateInput.value;
        const endDate = endDateInput.value;
        
        if (!absenceType || !startDate || !endDate) {
            alert('Por favor, complete todos los campos obligatorios.');
            return;
        }
        
        if (new Date(startDate) > new Date(endDate)) {
            alert('La fecha de inicio debe ser anterior a la fecha de fin.');
            return;
        }
        
        // Simular envío exitoso
        alert('Solicitud enviada correctamente.');
        closeModalFunction();
        
        // Actualizar calendario (simulación)
        const selectedDates = getDatesBetween(new Date(startDate), new Date(endDate));
        selectedDates.forEach(date => {
            const dayElements = document.querySelectorAll('.day');
            dayElements.forEach(day => {
                const dayNumber = parseInt(day.textContent);
                if (!isNaN(dayNumber)) {
                    const monthContainer = day.closest('.month-container');
                    if (monthContainer) {
                        const monthName = monthContainer.querySelector('h4').textContent;
                        const monthIndex = getMonthIndex(monthName);
                        
                        if (date.getDate() === dayNumber && date.getMonth() === monthIndex) {
                            if (absenceType === 'vacation') {
                                day.classList.add('vacation');
                            } else {
                                day.classList.add('selected');
                            }
                        }
                    }
                }
            });
        });
    });
    
    // Función para obtener fechas entre dos fechas
    function getDatesBetween(startDate, endDate) {
        const dates = [];
        let currentDate = new Date(startDate);
        
        while (currentDate <= endDate) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        return dates;
    }
    
    // Función para obtener índice del mes
    function getMonthIndex(monthName) {
        const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        return months.indexOf(monthName);
    }
    
    // Inicializar fechas en el formulario
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    startDateInput.valueAsDate = today;
    endDateInput.valueAsDate = tomorrow;
    
    // Interacción con el calendario
    const dayElements = document.querySelectorAll('.day');
    dayElements.forEach(day => {
        day.addEventListener('click', function() {
            const isSelected = this.classList.contains('selected');
            const isVacation = this.classList.contains('vacation');
            
            if (!isSelected && !isVacation) {
                // Si es el primer clic, establecer como fecha de inicio
                if (!startDateInput.value) {
                    const dayNumber = parseInt(this.textContent);
                    const monthContainer = this.closest('.month-container');
                    const monthName = monthContainer.querySelector('h4').textContent;
                    const monthIndex = getMonthIndex(monthName);
                    
                    const selectedDate = new Date(2024, monthIndex, dayNumber);
                    startDateInput.valueAsDate = selectedDate;
                    this.classList.add('selected');
                }
                // Si ya hay fecha de inicio pero no de fin, establecer como fecha de fin
                else if (startDateInput.value && !endDateInput.value) {
                    const dayNumber = parseInt(this.textContent);
                    const monthContainer = this.closest('.month-container');
                    const monthName = monthContainer.querySelector('h4').textContent;
                    const monthIndex = getMonthIndex(monthName);
                    
                    const selectedDate = new Date(2024, monthIndex, dayNumber);
                    
                    // Verificar que la fecha de fin sea posterior a la de inicio
                    if (selectedDate >= new Date(startDateInput.value)) {
                        endDateInput.valueAsDate = selectedDate;
                        
                        // Marcar días entre inicio y fin
                        const startDate = new Date(startDateInput.value);
                        const endDate = selectedDate;
                        const datesBetween = getDatesBetween(startDate, endDate);
                        
                        datesBetween.forEach(date => {
                            dayElements.forEach(d => {
                                const dNumber = parseInt(d.textContent);
                                if (!isNaN(dNumber)) {
                                    const dMonthContainer = d.closest('.month-container');
                                    if (dMonthContainer) {
                                        const dMonthName = dMonthContainer.querySelector('h4').textContent;
                                        const dMonthIndex = getMonthIndex(dMonthName);
                                        
                                        if (date.getDate() === dNumber && date.getMonth() === dMonthIndex) {
                                            d.classList.add('selected');
                                        }
                                    }
                                }
                            });
                        });
                    } else {
                        alert('La fecha de fin debe ser posterior a la fecha de inicio.');
                    }
                }
                // Si ya hay fechas de inicio y fin, reiniciar selección
                else {
                    dayElements.forEach(d => d.classList.remove('selected'));
                    startDateInput.value = '';
                    endDateInput.value = '';
                    
                    const dayNumber = parseInt(this.textContent);
                    const monthContainer = this.closest('.month-container');
                    const monthName = monthContainer.querySelector('h4').textContent;
                    const monthIndex = getMonthIndex(monthName);
                    
                    const selectedDate = new Date(2024, monthIndex, dayNumber);
                    startDateInput.valueAsDate = selectedDate;
                    this.classList.add('selected');
                }
            }
        });
    });
    
    // Filtrado de tipos de ausencia
    const absenceCheckboxes = document.querySelectorAll('.absence-checkbox input');
    absenceCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Aquí se implementaría la lógica de filtrado real
            // Esta es una simulación simple
            if (this.id === 'vacaciones' && !this.checked) {
                const vacationDays = document.querySelectorAll('.day.vacation');
                vacationDays.forEach(day => {
                    day.style.opacity = '0.3';
                });
            } else if (this.id === 'vacaciones' && this.checked) {
                const vacationDays = document.querySelectorAll('.day.vacation');
                vacationDays.forEach(day => {
                    day.style.opacity = '1';
                });
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    var calendarEl = document.getElementById('calendar');
    var selectedEvent = null;
    var events = [];

    var calendar = new FullCalendar.Calendar(calendarEl, {
        plugins: ['interaction', 'dayGrid', 'timeGrid', 'bootstrap', 'momentTimezone'],
        themeSystem: 'standard',
        bootstrapFontAwesome: {
            dayGridMonth: 'calendar',
            prev: 'fa-chevron-circle-left',
            next: 'fa-chevron-circle-right'
        },
        header: {
            left: 'prev, today, next',
            center: 'title',
            right: 'dayGridMonth, timeGridWeek'

        },
        footer: {
            left: 'prevYear',
            right: 'nextYear'
        },
        snapDuration: '00:05:00',
        slotDuration: '00:15:00',
        slotLabelInterval: '00:15:00',
        slotLabelFormat: {
            hour: '2-digit',
            minute: '2-digit',
            meridiemLocation: 'long'
        },
        fixedWeekCount: true,
        showNonCurrentDates: false,
        handleWindowResize: true,
        handleWindowDelay: 100,
        contentHeight: 650,
        defaultView: 'dayGridMonth',
        weekends: true,
        hiddenDays: [0],
        allDaysSlot: false,
        firstDay: 1, //Pazardan baslayacak sekilde 0, 1, 2 ...
        titleFormat: {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        },
        titleRangeSeparator: ' - ',
        columnHeaderFormat: {
            weekday: 'long',
        },
        views: {
            timeGridForFourDay: {
                type: 'timeGrid',
                dayCount: 4,
                buttonText: '4 day'
            }
        },
        eventColor: 'white',
        eventBackgroundColor: 'red',
        eventBorderColor: 'black',
        eventTimeFormat: {
            hour: '2-digit',
            minute: '2-digit',
            meridiemLocation: 'long'
        },
        eventClick: (info) => {
            selectedEvent = {
                id: info.event.id,
                start: info.event.start.toUTCString(),
                end: info.event.end.toUTCString(),
                patientName: info.event.extendedProps.patientName,
                patientSurname: info.event.extendedProps.patientSurname,
                description: info.event.extendedProps.description,
                dentistId: info.event.extendedProps.userId
            };

            $('#appointmentIdDetail').val(info.event.id);
            $('#selectDentistIdDetail').val(info.event.extendedProps.userId);
            $('#inputStartDateDetail').val(moment(info.event.start).format('DD/MM/YYYY HH:mm'));
            $('#inputEndDateDetail').val(moment(info.event.end).format('DD/MM/YYYY HH:mm'));
            $('#inputPatientNameDetail').val(info.event.extendedProps.patientName);
            $('#inputPatientSurnameDetail').val(info.event.extendedProps.patientSurname);
            $('#inputDescriptionDetail').val(info.event.extendedProps.description);

            $("#detailModal").modal();
        },
        displayEventTime: true,
        displayEventEnd: true,
        eventOrder: 'title',
        timeZone: 'UTC',
        events: [],
        selectable: false,
        editable: false
    });

    calendar.render();
    getAppointmentsByDentist();

    function getAppointmentsByDentist() {
        const dentistId = document.getElementById('currentDentistId').value;

        $.ajax({
            type: 'GET',
            url: `/appointment/GetAppointmentsByDentist?userId=${dentistId}`,
            success: (response) => {
                events = [];
                var sources = calendar.getEventSources();

                sources.forEach(source => {
                    source.remove();
                });

                for (var i = 0; i < response.length; i++) {
                    events.push({
                        id: response[i].id,
                        title: response[i].dentist,
                        patientName: response[i].patientName,
                        patientSurname: response[i].patientSurname,
                        start: response[i].startDate,
                        end: response[i].endDate,
                        description: response[i].description,
                        color: response[i].color,
                        userId: response[i].userId
                    });

                }

                console.log(events);
                calendar.addEventSource(events);
            },
            error: () => {
                $('#saveModal').modal('hide');
                alertify.error('An error occured.');
            }
        });
    }
});

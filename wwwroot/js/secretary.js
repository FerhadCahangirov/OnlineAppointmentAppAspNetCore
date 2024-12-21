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
        displayEventTime: true,
        displayEventEnd: true,
        eventOrder: 'title',
        timeZone: 'UTC',
        events: [],
        selectable: true,
        select: (selectionInfo) => {
            console.log(selectionInfo);

            selectedEvent = {
                id: 0,
                start: moment(selectionInfo.start),
                end: moment(selectionInfo.end),
                patientName: '',
                patientSurname: '',
                description: '',
                dentistId: 0
            };

            openAddOrUpdateModal();

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
        editable: true,
        eventDrop: (dropEventInfo) => {
            var appointment = {
                Id: dropEventInfo.event.id,
                UserId: dropEventInfo.event.extendedProps.userId,
                StartDate: dropEventInfo.event.start.toUTCString(),
                EndDate: dropEventInfo.event.end.toUTCString(),
                PatientName: dropEventInfo.event.extendedProps.patientName,
                PatientSurname: dropEventInfo.event.extendedProps.patientSurname,
                Description: dropEventInfo.event.extendedProps.description,
            };

            console.log(appointment);

            saveAppointment(appointment);

        },
        eventResize: (resizeEventInfo) => {
            var appointment = {
                Id: resizeEventInfo.event.id,
                UserId: resizeEventInfo.event.extendedProps.userId,
                StartDate: resizeEventInfo.event.start.toUTCString(),
                EndDate: resizeEventInfo.event.end.toUTCString(),
                PatientName: resizeEventInfo.event.extendedProps.patientName,
                PatientSurname: resizeEventInfo.event.extendedProps.patientSurname,
                Description: resizeEventInfo.event.extendedProps.description,
            };

            console.log(appointment);

            saveAppointment(appointment);
        },
    });
    calendar.render();
    getAppointments();

    function openAddOrUpdateModal() {
        if (selectedEvent != null) {
            $('#appointmentId').val(selectedEvent.id);
            $('#inputStartDate').val(moment(selectedEvent.start).format('DD/MM/YYYY HH:mm'));
            $('#inputEndDate').val(moment(selectedEvent.end).format('DD/MM/YYYY HH:mm'));
            $('#inputPatientName').val(selectedEvent.patientName);
            $('#inputPatientSurname').val(selectedEvent.patientSurname);
            $('#inputDescription').val(selectedEvent.description);
            $('#selectDentistId').val(selectedEvent.dentistId);
        }

        $('#saveModal').modal()
    }


    function getAppointments() {
        $.ajax({
            type: 'GET',
            url: '/appointment/GetAppointments',
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

    function getAppointmentsByDentist(dentistId) {
        $.ajax({
            type: 'GET',
            url:  `/appointment/GetAppointmentsByDentist?userId=${dentistId}`,
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

    function saveAppointment(data) {
        $.ajax({
            type: 'POST',
            url: '/appointment/addOrUpdateAppointment',
            data: data,
            success: (response) => {
                if (response === "200") {
                    $('#saveModal').modal('hide');

                    data.Id === ""
                        ? alertify.success('Successfully Added.')
                        : alertify.success('Successfully Updated.');

                    getAppointments();
                }
                else {
                    $('#saveModal').modal('hide');  
                    alertify.error('Failed to add');
                }
            },
            error: () => {
                $('#saveModal').modal('hide');
                alertify.error('An error occured.');
            }
        });
    }

    function parseDate(dateString) {
        var parts = dateString.split(' ');
        var dateParts = parts[0].split('/');
        var timeParts = parts[1].split(':');

        return new Date(parseInt(dateParts[2]), parseInt(dateParts[1]) - 1, parseInt(dateParts[0]), timeParts[0], timeParts[1]);
    }

    $("#btnSave").click(function () {
        var startDate = parseDate($('#inputStartDate').val());
        var endDate = parseDate($('#inputEndDate').val());

        console.log(startDate, endDate);

        var appointment = {
            Id: $('#appointmentId').val(),
            UserId: $('#selectDentistId').val(),
            StartDate: startDate.toUTCString(),
            EndDate: endDate.toUTCString(),
            PatientName: $('#inputPatientName').val(),
            PatientSurname: $('#inputPatientSurname').val(),
            Description: $('#inputDescription').val(),
        };

        console.log(appointment);

        saveAppointment(appointment);
    });

    $("#btnUpdate").click(function () {
        $('#detailModal').modal('hide');
        openAddOrUpdateModal();
    });

    $("#btnDelete").click(function () {

        $.ajax({
            type: 'DELETE',
            url: `/appointment/DeleteAppointment?id=${selectedEvent.id}`,
            success: (response) => {
                if (response === "200") {
                    $('#detailModal').modal('hide');
                    getAppointments();
                    alertify.success('Appointment deleted success.');
                }
                else {  
                    $('#detailModal').modal('hide');
                    alertify.error('Failed to delete appointment.');

                }
            },
            error: () => {
                $('#saveModal').modal('hide');
                alertify.error('An error occured.');
            }
        });
        
    });

    $(".list-group-item").click(function () {

        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            getAppointments();
        }
        else {
            $(".list-group-item").removeClass('active');
            $(this).addClass('active');
            getAppointmentsByDentist($(this).data('value'));
        }
    }); 
});

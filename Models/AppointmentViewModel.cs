﻿namespace FullCalendarApp
{
    public class AppointmentViewModel
    {

        public string Dentist { get; internal set; }
        public string PatientName { get; internal set; }
        public string PatientSurname { get; internal set; }
        public DateTime StartDate { get; internal set; }
        public DateTime EndDate { get; internal set; }
        public string Description { get; internal set; }
        public string UserId { get; internal set; }
        public string Color { get; internal set; }
        public int Id { get; internal set; }
    }
}
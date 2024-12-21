using System.ComponentModel.DataAnnotations.Schema;

namespace FullCalendarApp.Data.Entity
{
    public class Appointment
    {
        public int Id { get; set; }

        [ForeignKey("userId")]
        public AppUser User { get; set; }

        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public string PatientName { get; set; }
        public string PatientSurname { get; set; }
        public string Description { get; set; }

        public Appointment()
        {
            User = new AppUser();
            PatientName = string.Empty;
            PatientSurname = string.Empty;
            Description = string.Empty;
        }
    }
}

using Microsoft.AspNetCore.Identity;

namespace FullCalendarApp.Data.Entity
{
    public class AppUser : IdentityUser
    {
        public bool IsDentist { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }

        public string Color { get; set; }

        public List<Appointment> Appointments { get; set; }

        public AppUser()
        {
            Name = string.Empty;
            Surname = string.Empty;
            Appointments = new List<Appointment>();
            Color = string.Empty;
        }
    }
}

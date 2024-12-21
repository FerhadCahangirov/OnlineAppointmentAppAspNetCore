using FullCalendarApp.Data.Entity;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace FullCalendarApp.Models
{
    public class SecretaryViewModel
    {
        public AppUser User { get; set; }
        public IEnumerable<AppUser>? Dentists { get; set; }
        public IEnumerable<SelectListItem> DentistsSelectList { get; internal set; }
    }
}

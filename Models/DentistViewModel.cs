using FullCalendarApp.Data.Entity;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace FullCalendarApp.Models
{
    public class DentistViewModel
    {
        public AppUser User { get; set; }
        public IEnumerable<SelectListItem> DentistsSelectList { get; internal set; }
    }
}

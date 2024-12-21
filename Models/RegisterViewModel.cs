using System.ComponentModel.DataAnnotations;

namespace FullCalendarApp.Models
{
    public class RegisterViewModel
    {
        [Required]
        [Display(Name = "User Name: ")]
        public string UserName { get; set; }
        [Required]
        [Display(Name = "Name: ")]
        public string Name { get; set; }
        [Required]
        [Display(Name = "Surname: ")]
        public string Surname { get; set; }

        [Display(Name = "Meeting Color: ")]
        public string Color { get; set; }
        [Required]
        [Display(Name = "Email: ")]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        [Display(Name = "Password: ")]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [Display(Name = "Is Dentist: ")]
        public bool IsDentist { get; set; }
    }
}

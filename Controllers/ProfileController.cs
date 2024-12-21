using FullCalendarApp.Data.Entity;
using FullCalendarApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace FullCalendarApp.Controllers
{
    public class ProfileController : Controller
    {
        private readonly UserManager<AppUser> _userManager;

        public ProfileController(UserManager<AppUser> userManager)
        {
            _userManager = userManager;
        }

        [Authorize(Roles = "Secretary, Dentist")]
        public IActionResult Index()
        {
            AppUser user = _userManager.Users.SingleOrDefault(x => x.UserName == HttpContext.User.Identity.Name);

            if (user == null)
            {
                return View("Error");
            }

            if (_userManager.IsInRoleAsync(user, "Secretary").Result)
            {
                var dentists = _userManager.Users.Where(x => x.IsDentist).ToList();
                SecretaryViewModel model = new SecretaryViewModel()
                {
                    User = user,
                    Dentists = dentists,
                    DentistsSelectList = dentists.Select(x => new SelectListItem()
                    {
                        Value = x.Id,
                        Text = "Dr. " + x.Name + " " + x.Surname
                    })
                };
                return View("Secretary", model);
            }
            else
            {
                var dentists = _userManager.Users.Where(x => x.IsDentist).ToList();
                DentistViewModel model = new DentistViewModel()
                {
                    User = _userManager.Users.Single(x => x.UserName == HttpContext.User.Identity.Name),
                    DentistsSelectList = dentists.Select(x => new SelectListItem()
                    {
                        Value = x.Id,
                        Text = "Dr. " + x.Name + " " + x.Surname
                    })
                };
                return View("Dentist", model);
            }
        }

        [Authorize(Roles = "Secretary")]
        public IActionResult Secretary()
        {
            return View();
        }

        [Authorize(Roles = "Dentist")]
        public IActionResult Dentist()
        {
            return View();
        }
    }
}

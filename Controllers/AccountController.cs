using FullCalendarApp.Data.Entity;
using FullCalendarApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using NuGet.Protocol;

namespace FullCalendarApp.Controllers
{
    public class AccountController : Controller
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly RoleManager<AppRole> _roleManager;

        public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, RoleManager<AppRole> roleManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
        }

        public IActionResult Denied()
        {
            return View();
        }

        public IActionResult Logout()
        {
            _signInManager.SignOutAsync().Wait();
            return RedirectToAction("Index", "Profile");
        }

        public IActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Login(LoginViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            AppUser? user = await _userManager.FindByNameAsync(model.UserName);

            if(user == null)
            {
                ModelState.AddModelError(String.Empty, "Cannot find user!");
                return View(model);
            }

            var result = await _signInManager.PasswordSignInAsync(user, model.Password, model.RememberMe, false);

            if (result.Succeeded)
            {
                return RedirectToAction("Index", "Profile");
            }

            ModelState.AddModelError(string.Empty, "Failed to login!");
            return View(model);
        }

        public IActionResult Register()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Register(RegisterViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            AppUser user = new AppUser()
            {
                UserName = model.UserName,
                Name = model.Name,
                Surname = model.Surname,
                Email = model.Email,
                Color = model.Color,
                IsDentist = model.IsDentist,
            };

            IdentityResult result = _userManager.CreateAsync(user, model.Password).Result;

            if (result.Succeeded)
            {
                bool roleCheck = model.IsDentist ? AddRole("Dentist") : AddRole("Secretary");

                if (!roleCheck)
                {
                    return View("Error");
                }

                _userManager.AddToRoleAsync(user, model.IsDentist ? "Dentist" : "Secretary").Wait();
                return RedirectToAction("Index", "Profile");
            }

            return View("Error");
        }

        private bool AddRole(string roleName) 
        {
            if (!_roleManager.RoleExistsAsync(roleName).Result)
            {
                AppRole role = new AppRole()
                {
                    Name = roleName,
                };

                IdentityResult result = _roleManager.CreateAsync(role).Result;
                return result.Succeeded;
            }
            return true;
        }
    }
}

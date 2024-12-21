using FullCalendarApp.Data;
using FullCalendarApp.Data.Entity;
using FullCalendarApp.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FullCalendarApp.Controllers
{
    public class AppointmentController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<AppUser> _userManager;

        public AppointmentController(ApplicationDbContext context, UserManager<AppUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public JsonResult GetAppointments()
        {
            var model = _context.Appointments
                .Include(x => x.User).Select(x => new AppointmentViewModel()
                {
                    Id = x.Id,
                    Dentist = x.User.Name + " " + x.User.Surname,
                    PatientName = x.PatientName,
                    PatientSurname = x.PatientSurname,
                    StartDate = x.StartDate,
                    EndDate = x.EndDate,
                    Description = x.Description,
                    UserId = x.User.Id,
                    Color = x.User.Color
                });
            return Json(model);
        }

        public JsonResult GetAppointmentsByDentist(string userId = "")
        {
            var model = _context.Appointments.Include(x => x.User)
                .Where(x => x.User.Id == userId).Select(x => new AppointmentViewModel()
                {
                    Id = x.Id,
                    Dentist = x.User.Name + " " + x.User.Surname,
                    PatientName = x.PatientName,
                    PatientSurname = x.PatientSurname,
                    StartDate = x.StartDate,
                    EndDate = x.EndDate,
                    Description = x.Description,
                    UserId = x.User.Id,
                    Color = x.User.Color
                });
            return Json(model);
        }

        [HttpPost]
        public JsonResult AddOrUpdateAppointment(AddOrUpdateAppointmentModel model)
        {
            if (model.Id == 0)
            {
                Appointment entity = new Appointment()
                {
                    CreatedDate = DateTime.Now,
                    StartDate = model.StartDate,
                    EndDate = model.EndDate,
                    Description = model.Description,
                    PatientName = model.PatientName,
                    PatientSurname = model.PatientSurname,
                    User = _userManager.Users.Single(user => user.Id == model.UserId)
                };

                _context.Add(entity);
                _context.SaveChanges();
            }
            else
            {
                var entity = _context.Appointments.SingleOrDefault(x => x.Id == model.Id);

                if(entity == null)
                {
                    return Json("Not Found");
                }

                entity.UpdatedDate = DateTime.Now;
                entity.StartDate = model.StartDate;
                entity.EndDate = model.EndDate;
                entity.Description = model.Description;
                entity.PatientName = model.PatientName;
                entity.PatientSurname = model.PatientSurname;
                entity.User = _userManager.Users.Single(user => user.Id == model.UserId);

                _context.Update(entity);
                _context.SaveChanges();
            }

            return Json("200");
        }

        [HttpDelete]
        public JsonResult DeleteAppointment(int id = 0)
        {
            var entity = _context.Appointments.SingleOrDefault(_ => _.Id == id);

            if(entity == null)
            {
                return Json("Not Found");
            }

            _context.Remove(entity);
            _context.SaveChanges();

            return Json("200");
        }
    }
}

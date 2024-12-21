using FullCalendarApp.Data;
using FullCalendarApp.Data.Entity;
using Microsoft.EntityFrameworkCore;
using System.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer("Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=TestFullCalendarDb;Integrated Security=True;Connect Timeout=30;Encrypt=False;Trust Server Certificate=False;Application Intent=ReadWrite;Multi Subnet Failover=False"))
    .AddIdentity<AppUser, AppRole>(options =>
    {
        options.User.RequireUniqueEmail = true;

        options.Password.RequireDigit = false;
        options.Password.RequiredLength = 3;
        options.Password.RequireLowercase = false;
        options.Password.RequireUppercase = false;
        options.Password.RequireNonAlphanumeric = false;
    })
    .AddEntityFrameworkStores<ApplicationDbContext>();

builder.Services.ConfigureApplicationCookie(options =>
{
    options.LoginPath = "/Account/Login";
    options.LogoutPath = "/Account/Logout";
    options.AccessDeniedPath = "/Account/Denied";
    options.Cookie.Name = "Dentist.Cookie";
    options.SlidingExpiration = true;
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("NotAuthenticatedPolicy", policy => policy.RequireAssertion(context => !context.User.Identity.IsAuthenticated));
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
}
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Profile}/{action=Index}/{id?}");

app.Run();

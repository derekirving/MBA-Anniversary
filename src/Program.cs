using Unify.Web.Extensions;
using src;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddRazorPages();

var app = builder.Build();
app.MapRazorPages();
app.UseUnifyWeb();
app.UseUnifyStaticSite();
app.Run();

using Bootstrap.Components.Doc.Swagger;
using Bootstrap.Extensions;
using InsideCollector.Business;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers().AddNewtonsoftJson();
builder.Services.AddDbContext<InsideCollectorDbContext>(t =>
    t.UseMySQL(InsideCollectorDbContextFactory.ConnectionString));
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddBootstrapSwaggerGen("v1", "API");


var app = builder.Build();

// Configure the HTTP request pipeline.

await using var scope = app.Services.CreateAsyncScope();
var dbContext = scope.ServiceProvider.GetRequiredService<InsideCollectorDbContext>();
dbContext.Database.MigrateAsync();

app.UseStaticFiles();

app.UseSwagger(t => t.RouteTemplate = "internal-doc/swagger/{documentName}/swagger.json");

app.UseBootstrapCors();

app.MapControllers();

app.Run();

using System.Net;
using Bootstrap.Models.ResponseModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace InsideCollector.Controllers
{
    [Route("~/file")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;

        public FileController(IWebHostEnvironment env)
        {
            _env = env;
        }

        [HttpPost]
        [SwaggerOperation(OperationId = "UploadFile")]
        public async Task<SingletonResponse<string>> Upload(IFormFile file)
        {
            const string subPath = "list-files";
            var dir = Path.Combine(_env.WebRootPath, subPath);
            Directory.CreateDirectory(dir);
            var filename = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var fullname = Path.Combine(dir, filename);
            await using var fs = new FileStream(fullname, FileMode.Create);
            await file.CopyToAsync(fs);
            var uri = $"/{subPath}/{WebUtility.UrlEncode(filename)}";
            return new SingletonResponse<string>(uri);
        }
    }
}

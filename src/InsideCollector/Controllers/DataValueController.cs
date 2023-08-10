using Bootstrap.Models.ResponseModels;
using InsideCollector.Business;
using InsideCollector.Models.Dto.Request;
using InsideCollector.Models.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Swashbuckle.AspNetCore.Annotations;

namespace InsideCollector.Controllers
{
    [Route("~/data/value")]
    [ApiController]
    public class DataValueController : ControllerBase
    {
        private readonly InsideCollectorDbContext _dbCtx;

        public DataValueController(InsideCollectorDbContext dbCtx)
        {
            _dbCtx = dbCtx;
        }

        [HttpPut]
        [SwaggerOperation(OperationId = "PutListDataValue")]
        public async Task<SingletonResponse<ListDataValue>> PutListDataValue(
            [FromBody] ListDataValuePutRequestModel model)
        {
            var dv = await _dbCtx.ListDataValues.FirstOrDefaultAsync(a =>
                a.DataId == model.DataId && a.PropertyId == model.PropertyId);
            if (dv == null)
            {
                dv = new ListDataValue
                {
                    DataId = model.DataId,
                    PropertyId = model.PropertyId,
                };
                _dbCtx.ListDataValues.Add(dv);
            }

            var trimmedValue = model.Value?.Trim();
            dv.Value = string.IsNullOrEmpty(trimmedValue) ? null : trimmedValue;
            await _dbCtx.SaveChangesAsync();
            return new SingletonResponse<ListDataValue>(dv);
        }
    }
}

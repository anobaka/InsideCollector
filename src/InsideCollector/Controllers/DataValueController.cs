using Bootstrap.Components.Miscellaneous.ResponseBuilders;
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
            var id = model.Key.ToString();
            var dv = await _dbCtx.ListDataValues.FirstOrDefaultAsync(a => a.Id == id);
            if (dv == null)
            {
                dv = model.Key.CreateValue();
                _dbCtx.ListDataValues.Add(dv);
            }

            var trimmedValue = model.Value?.Trim();
            dv.Value = string.IsNullOrEmpty(trimmedValue) ? null : trimmedValue;
            await _dbCtx.SaveChangesAsync();
            return new SingletonResponse<ListDataValue>(dv);
        }

        [HttpPut("copy")]
        [SwaggerOperation(OperationId = "CopyDataValueToOthers")]
        public async Task<BaseResponse> CopyToOthers([FromBody] ListDataValueCopyRequestModel model)
        {
            if (model.Targets.Length == 0)
            {
                return BaseResponseBuilder.BuildBadRequest("No targets");
            }

            if (new HashSet<int>(model.Targets.Select(t => t.PropertyId)) {model.Source.PropertyId}.Count != 1)
            {
                return BaseResponseBuilder.BuildBadRequest("All values must belongs to same property");
            }

            var sourceId = model.Source.ToString();
            var allIds = new HashSet<string>(model.Targets.Select(t => t.ToString())) {sourceId};

            var valueMap = await _dbCtx.ListDataValues.Where(a => allIds.Contains(a.Id))
                .ToDictionaryAsync(a => a.Id, a => a);


            var srcValue = valueMap.GetValueOrDefault(sourceId)?.Value;

            foreach (var otherKey in model.Targets)
            {
                if (!valueMap.TryGetValue(otherKey.ToString(), out var v))
                {
                    v = otherKey.CreateValue();
                    _dbCtx.ListDataValues.Add(v);
                }

                v.Value = srcValue;
            }

            await _dbCtx.SaveChangesAsync();

            return BaseResponseBuilder.Ok;
        }

        [HttpDelete("bulk")]
        [SwaggerOperation(OperationId = "BulkRemoveDataValues")]
        public async Task<BaseResponse> BulkRemove([FromBody] ListDataValueBulkRemoveRequestModel model)
        {
            var ids = model.Keys.Select(a => a.ToString()).ToArray();
            var values = await _dbCtx.ListDataValues.Where(a => ids.Contains(a.Id)).ToListAsync();

            foreach (var othValue in values)
            {
                othValue.Value = null;
            }

            await _dbCtx.SaveChangesAsync();

            return BaseResponseBuilder.Ok;
        }
    }
}
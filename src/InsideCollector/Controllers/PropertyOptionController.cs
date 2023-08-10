using Bootstrap.Models.ResponseModels;
using InsideCollector.Business;
using InsideCollector.Models.Dto.Request;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Swashbuckle.AspNetCore.Annotations;

namespace InsideCollector.Controllers
{
    [Route("~/property/option")]
    [ApiController]
    public class PropertyOptionController : ControllerBase
    {
        private readonly InsideCollectorDbContext _dbCtx;

        public PropertyOptionController(InsideCollectorDbContext dbCtx)
        {
            _dbCtx = dbCtx;
        }

        [HttpPut("order")]
        [SwaggerOperation(OperationId = "ReorderPropertyOptions")]
        public async Task<SingletonResponse<Dictionary<int, int>>> ReorderPropertyOptions(
            [FromBody] DataReorderRequestModel model)
        {
            var newOrders = new Dictionary<int, int>();

            var option = (await _dbCtx.ListPropertyOptions.FirstOrDefaultAsync(a => a.Id == model.DataId))!;
            option.Order = model.NewOrder;
            newOrders[model.DataId] = model.NewOrder;

            var newOrderDataList = (await _dbCtx.ListPropertyOptions
                    .Where(a => a.PropertyId == option.PropertyId && a.Order >= model.NewOrder).ToListAsync())
                .Where(d => d.Id != model.DataId).OrderBy(a => a.Order).ToList();
            for (var i = 0; i < newOrderDataList.Count; i++)
            {
                var newOrder = model.NewOrder + i + 1;
                var d = newOrderDataList[i];
                if (d.Order != newOrder)
                {
                    d.Order = newOrder;
                    newOrders[d.Id] = newOrder;
                }
            }

            await _dbCtx.SaveChangesAsync();
            return new SingletonResponse<Dictionary<int, int>>(newOrders);
        }
    }
}
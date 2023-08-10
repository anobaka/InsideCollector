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
    [Route("~/property")]
    [ApiController]
    public class PropertyController : ControllerBase
    {
        private readonly InsideCollectorDbContext _dbCtx;

        public PropertyController(InsideCollectorDbContext dbCtx)
        {
            _dbCtx = dbCtx;
        }

        [HttpPut]
        [SwaggerOperation(OperationId = "PutListProperty")]
        public async Task<BaseResponse> PutListProperty([FromBody] ListProperty data)
        {
            if (data.Id > 0)
            {
                _dbCtx.Attach(data).State = EntityState.Modified;
            }
            else
            {
                data.Order = int.MaxValue;
                _dbCtx.Add(data);
                await _dbCtx.SaveChangesAsync();
            }

            var prevOptions = await _dbCtx.ListPropertyOptions.Where(a => a.PropertyId == data.Id).ToListAsync();
            var currentOptions = data.Options;

            var newOptions = currentOptions.Where(a => prevOptions.All(b => b.Id != a.Id)).ToList();
            var deletedOptions = prevOptions.Where(a => currentOptions.All(b => b.Id != a.Id)).ToList();
            foreach (var o in newOptions)
            {
                o.PropertyId = data.Id;
            }

            await _dbCtx.AddRangeAsync(newOptions);
            _dbCtx.RemoveRange(deletedOptions);

            foreach (var po in prevOptions)
            {
                var co = currentOptions.FirstOrDefault(a => a.Id == po.Id && a.Label != po.Label);
                if (co != null)
                {
                    po.Label = co.Label;
                }
            }

            await _dbCtx.SaveChangesAsync();

            return BaseResponseBuilder.Ok;
        }

        [HttpPut("order")]
        [SwaggerOperation(OperationId = "ReorderProperties")]
        public async Task<SingletonResponse<Dictionary<int, int>>> ReorderListProperties(
            [FromBody] DataReorderRequestModel model)
        {
            var newOrders = new Dictionary<int, int>();

            var property = (await _dbCtx.ListProperties.FirstOrDefaultAsync(a => a.Id == model.DataId))!;
            property.Order = model.NewOrder;
            newOrders[model.DataId] = model.NewOrder;

            var newOrderDataList = (await _dbCtx.ListProperties
                    .Where(a => a.ListId == property.ListId && a.Order >= model.NewOrder).ToListAsync())
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

        [HttpDelete("{id}")]
        [SwaggerOperation(OperationId = "DeleteListProperty")]
        public async Task<BaseResponse> DeleteListProperty(int id)
        {
            _dbCtx.Remove(new ListProperty() { Id = id });
            var options = await _dbCtx.ListPropertyOptions.Where(a => a.PropertyId == id).ToListAsync();
            _dbCtx.RemoveRange(options);
            await _dbCtx.SaveChangesAsync();
            return BaseResponseBuilder.Ok;
        }
    }
}

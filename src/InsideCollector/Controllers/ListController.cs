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
    [Route("~/list")]
    [ApiController]
    public class ListController
    {
        private readonly InsideCollectorDbContext _dbCtx;

        public ListController(InsideCollectorDbContext dbCtx)
        {
            _dbCtx = dbCtx;
        }

        [HttpGet("~/my-lists/{myListsId}/list")]
        [SwaggerOperation(OperationId = "GetListsInMyLists")]
        public async Task<ListResponse<InsideList>> GetListsInMyLists(int myListsId)
        {
            var lists = await _dbCtx.Lists.Where(a => a.MyListsId == myListsId).ToListAsync();
            var listIds = lists.Select(l => l.Id).ToList();
            var properties = await _dbCtx.ListProperties.Where(a => listIds.Contains(a.ListId)).ToListAsync();
            var propertyIds = properties.Select(p => p.Id).ToList();
            var propertyOptions = await _dbCtx.ListPropertyOptions.Where(a => propertyIds.Contains(a.PropertyId))
                .ToListAsync();

            foreach (var l in lists)
            {
                l.Properties = properties.Where(a => a.ListId == l.Id).OrderBy(a => a.Order).ToList();
                foreach (var p in l.Properties)
                {
                    p.Options = propertyOptions.Where(a => a.PropertyId == p.Id).OrderBy(a => a.Order).ToList();
                }
            }

            return new ListResponse<InsideList>(lists.OrderBy(a => a.Order));
        }

        [HttpPut]
        [SwaggerOperation(OperationId = "PutList")]
        public async Task<BaseResponse> PutList([FromBody] ListPutRequestModel data)
        {
            var list = new InsideList()
            {
                Id = data.Id,
                MyListsId = data.MyListsId,
                Name = data.Name,
                DataNameConvention = data.DataNameConvention,
                VariableName = data.VariableName,
                Order = data.Order,
                Description = data.Description,
                Width = data.Width
            };
            if (list.Id > 0)
            {
                _dbCtx.Attach(list!).State = EntityState.Modified;
            }
            else
            {
                _dbCtx.Add(list!);
            }

            await _dbCtx.SaveChangesAsync();
            return BaseResponseBuilder.Ok;
        }

        [HttpPut("order")]
        [SwaggerOperation(OperationId = "ReorderLists")]
        public async Task<SingletonResponse<Dictionary<int, int>>> ReorderLists(
            [FromBody] DataReorderRequestModel model)
        {
            var newOrders = new Dictionary<int, int>();

            var list = (await _dbCtx.Lists.FirstOrDefaultAsync(a => a.Id == model.DataId))!;
            list.Order = model.NewOrder;
            newOrders[model.DataId] = model.NewOrder;

            // todo: index
            var newOrderDataList = (await _dbCtx.Lists
                    .Where(a => a.MyListsId == list.MyListsId && a.Order >= model.NewOrder).ToListAsync())
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
        [SwaggerOperation(OperationId = "DeleteList")]
        public async Task<BaseResponse> DeleteList(int id)
        {
            _dbCtx.Remove(new InsideList() {Id = id});
            var properties = await _dbCtx.ListProperties.Where(a => a.ListId == id).ToListAsync();
            var propertyIds = properties.Select(a => a.Id).ToList();
            var data = await _dbCtx.ListData.Where(a => a.ListId == id).ToListAsync();
            var dataValues = await _dbCtx.ListDataValues.Where(a => propertyIds.Contains(a.PropertyId)).ToListAsync();

            _dbCtx.RemoveRange(properties);
            _dbCtx.RemoveRange(data);
            _dbCtx.RemoveRange(dataValues);

            await _dbCtx.SaveChangesAsync();
            return BaseResponseBuilder.Ok;
        }
    }
}
using System.Linq.Expressions;
using System.Net;
using System.Xml.Linq;
using Bootstrap.Components.Miscellaneous.ResponseBuilders;
using Bootstrap.Models.ResponseModels;
using InsideCollector.Business;
using InsideCollector.Models.Dto.Request;
using InsideCollector.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using NPOI.OpenXmlFormats.Dml.Diagram;
using NPOI.POIFS.Crypt.Dsig;
using NPOI.SS.Formula.Functions;
using Swashbuckle.AspNetCore.Annotations;

namespace InsideCollector.Controllers
{
    [ApiController]
    [Route("data")]
    public class DataController : ControllerBase
    {
        private readonly InsideCollectorDbContext _dbCtx;
        private readonly IWebHostEnvironment _env;

        public DataController(InsideCollectorDbContext dbCtx, IWebHostEnvironment env)
        {
            _dbCtx = dbCtx;
            _env = env;
        }

        [HttpGet("~/my-lists/{myListsId}/data")]
        [SwaggerOperation(OperationId = "GetMyListsData")]
        public async Task<ListResponse<ListData>> GetMyListsData(int myListsId)
        {
            var data = await _dbCtx.ListData.Where(a => a.MyListsId == myListsId).ToListAsync();
            var dataIds = data.Select(d => d.Id).ToList();
            var dataValues = await _dbCtx.ListDataValues.Where(a => dataIds.Contains(a.DataId)).ToListAsync();

            foreach (var d in data)
            {
                d.Values = dataValues.Where(a => a.DataId == d.Id).ToList();
            }

            return new ListResponse<ListData>(data.OrderBy(a => a.Order));
        }

        [HttpPut]
        [SwaggerOperation(OperationId = "PutListData")]
        public async Task<SingletonResponse<ListData>> PutListData([FromBody] DataPutRequestModel data)
        {
            if (data.Id == 0)
            {
                var list = (await _dbCtx.Lists.FirstOrDefaultAsync(a => a.Id == data.ListId))!;
                var d = new ListData {ListId = data.ListId, MyListsId = list.MyListsId, Order = int.MaxValue};
                _dbCtx.Add(d);
                data.Id = d.Id;
            }

            await _dbCtx.SaveChangesAsync();
            return new SingletonResponse<ListData>(await GetListData(data.Id));
        }

        private async Task<ListData> GetListData(int id)
        {
            var data = await _dbCtx.ListData.FirstOrDefaultAsync(a => a.Id == id);
            var values = await _dbCtx.ListDataValues.Where(a => a.DataId == id).ToListAsync();

            data!.Values = values;
            return data;
        }

        [HttpDelete("{id}")]
        [SwaggerOperation(OperationId = "DeleteListData")]
        public async Task<BaseResponse> DeleteListData(int id)
        {
            _dbCtx.Remove(new ListData {Id = id});
            var values = await _dbCtx.ListDataValues.Where(a => a.DataId == id).ToListAsync();
            _dbCtx.RemoveRange(values);
            await _dbCtx.SaveChangesAsync();
            return BaseResponseBuilder.Ok;
        }

        [HttpPut("order")]
        [SwaggerOperation(OperationId = "ReorderListData")]
        public async Task<SingletonResponse<Dictionary<int, int>>>
            ReorderListData([FromBody] DataReorderRequestModel model)
        {
            var newOrders = new Dictionary<int, int>();

            var data = (await _dbCtx.ListData.FirstOrDefaultAsync(a => a.Id == model.DataId))!;
            data.Order = model.NewOrder;
            newOrders[model.DataId] = model.NewOrder;

            var newOrderDataList = (await _dbCtx.ListData
                    .Where(a => a.ListId == data.ListId && a.Order >= model.NewOrder).ToListAsync())
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
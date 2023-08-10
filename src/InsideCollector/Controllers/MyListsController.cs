using Bootstrap.Components.Miscellaneous.ResponseBuilders;
using Bootstrap.Models.ResponseModels;
using InsideCollector.Business;
using InsideCollector.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Swashbuckle.AspNetCore.Annotations;

namespace InsideCollector.Controllers
{
    [ApiController]
    [Route("~/my-lists")]
    public class MyListsController
    {
        private readonly InsideCollectorDbContext _dbCtx;

        public MyListsController(InsideCollectorDbContext dbCtx)
        {
            _dbCtx = dbCtx;
        }

        [HttpGet]
        [SwaggerOperation(OperationId = "GetAllMyLists")]
        public async Task<ListResponse<MyLists>> GetAll()
        {
            var myLists = await _dbCtx.MyLists.ToListAsync();
            return new ListResponse<MyLists>(myLists.OrderBy(a => a.Order));
        }

        [HttpPut]
        [SwaggerOperation(OperationId = "PutMyLists")]
        public async Task<BaseResponse> PutMyLists([FromBody] MyLists data)
        {
            if (data.Id > 0)
            {
                _dbCtx.Attach(data!).State = EntityState.Modified;
            }
            else
            {
                _dbCtx.Add(data!);
            }

            await _dbCtx.SaveChangesAsync();
            return BaseResponseBuilder.Ok;
        }

        [HttpDelete("{id}")]
        [SwaggerOperation(OperationId = "DeleteMyLists")]
        public async Task<BaseResponse> DeleteMyLists(int id)
        {
            _dbCtx.Remove(new MyLists() {Id = id});


            var lists = await _dbCtx.Lists.Where(a => a.MyListsId == id).ToListAsync();
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

            var data = await _dbCtx.ListData.Where(a => a.MyListsId == id).ToListAsync();
            var dataIds = data.Select(d => d.Id).ToList();
            var dataValues = await _dbCtx.ListDataValues.Where(a => dataIds.Contains(a.DataId)).ToListAsync();

            foreach (var d in data)
            {
                d.Values = dataValues.Where(a => a.DataId == d.Id).ToList();
            }

            _dbCtx.RemoveRange(lists);
            _dbCtx.RemoveRange(lists.SelectMany(s => s.Properties));
            _dbCtx.RemoveRange(lists.SelectMany(s => s.Properties.SelectMany(b => b.Options)));

            _dbCtx.RemoveRange(data);
            _dbCtx.RemoveRange(data.SelectMany(d => d.Values));

            await _dbCtx.SaveChangesAsync();
            return BaseResponseBuilder.Ok;
        }
    }
}
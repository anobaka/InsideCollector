// using Bootstrap.Models.ResponseModels;
// using InsideCollector.Business;
// using InsideCollector.Models.Entities;
// using Microsoft.AspNetCore.Http;
// using Microsoft.AspNetCore.Mvc;
// using Microsoft.EntityFrameworkCore;
// using Swashbuckle.AspNetCore.Annotations;
//
// namespace InsideCollector.Controllers
// {
//     [Route("~/data-set")]
//     [ApiController]
//     public class ListDataSetController : ControllerBase
//     {
//         private readonly InsideCollectorDbContext _dbCtx;
//
//         public ListDataSetController(InsideCollectorDbContext dbCtx)
//         {
//             _dbCtx = dbCtx;
//         }
//
//         [HttpPut]
//         [SwaggerOperation(OperationId = "PutListDataSet")]
//         public async Task<SingletonResponse<ListDataSet>> Put([FromBody] ListDataSet data)
//         {
//             if (data.Id > 0)
//             {
//                 _dbCtx.ListDataSets.Attach(data).State = EntityState.Modified;
//             }
//             else
//             {
//                 _dbCtx.ListDataSets.Add(data);
//             }
//
//             await _dbCtx.SaveChangesAsync();
//             return new SingletonResponse<ListDataSet>(data);
//         }
//     }
// }
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InsideCollector.Models.Dto.Request
{
    public record ListDataValueBulkRemoveRequestModel
    {
        public ListDataKey[] Keys { get; set; } = null!;
    }
}

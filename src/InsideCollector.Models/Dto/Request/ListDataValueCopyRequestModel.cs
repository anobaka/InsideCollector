using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InsideCollector.Models.Dto.Request
{
    public class ListDataValueCopyRequestModel
    {
        public ListDataKey Source { get; set; } = null!;
        public ListDataKey[] Targets { get; set; } = Array.Empty<ListDataKey>();
    }
}
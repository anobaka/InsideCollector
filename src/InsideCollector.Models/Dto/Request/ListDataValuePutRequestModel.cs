using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InsideCollector.Models.Dto.Request
{
    public class ListDataValuePutRequestModel
    {
        public int DataId { get; set; }
        public int PropertyId { get; set; }
        public string? Value { get; set; }
    }
}

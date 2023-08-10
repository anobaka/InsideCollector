using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using InsideCollector.Models.Constants;

namespace InsideCollector.Models.Dto.Request
{
    public class DataReorderRequestModel
    {
        public int DataId { get; set; }
        public int NewOrder { get; set; }
    }
}
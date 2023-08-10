using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InsideCollector.Models.Dto.Request
{
    public class DataPutRequestModel
    {
        public int Id { get; set; }
        public int ListId { get; set; }
        // public int SetId { get; set; }
        public Dictionary<string, string> Values { get; set; } = new();
    }
}

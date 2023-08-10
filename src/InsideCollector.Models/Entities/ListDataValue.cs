using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InsideCollector.Models.Entities
{
    public class ListDataValue
    {
        public int Id { get; set; }
        public int DataId { get; set; }
        public int PropertyId { get; set; }
        public string? Value { get; set; }
    }
}
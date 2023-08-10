using InsideCollector.Models.Constants;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InsideCollector.Models.Entities
{
    public class ListPropertyOption
    {
        public int Id { get; set; }
        public int PropertyId { get; set; }
        public int Order { get; set; }
        [MaxLength(DataLengths.MaxNameLength)]
        public string Label { get; set; } = null!;
    }
}
using InsideCollector.Models.Constants;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InsideCollector.Models.Entities
{
    public class MyLists
    {
        public int Id { get; set; }
        [MaxLength(DataLengths.MaxNameLength)]
        public string Name { get; set; } = null!;
        public int Order { get; set; }
        public string? Description { get; set; }

        [NotMapped] public List<InsideList> Lists { get; set; } = new();
    }
}

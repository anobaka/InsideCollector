using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using InsideCollector.Models.Constants;

namespace InsideCollector.Models.Entities
{
    public class InsideList
    {
        public int Id { get; set; }
        public int MyListsId { get; set; }
        [MaxLength(DataLengths.MaxNameLength)] public string VariableName { get; set; } = null!;
        [MaxLength(DataLengths.MaxNameLength)] public string Name { get; set; } = null!;
        public int Order { get; set; }
        public string? Description { get; set; }
        public string? DataNameConvention { get; set; }

        [Range(0, 100)]
        public int Width { get; set; }

        [NotMapped] public List<ListProperty> Properties { get; set; } = new List<ListProperty>();
        [NotMapped] public List<ListData> Data { get; set; } = new List<ListData>();
        // [NotMapped] public List<ListDataSet> DataSets { get; set; } = new();
    }
}
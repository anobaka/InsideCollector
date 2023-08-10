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
    public class ListProperty
    {
        public int Id { get; set; }
        public int ListId { get; set; }
        [MaxLength(DataLengths.MaxNameLength)] public string VariableName { get; set; } = null!;
        [MaxLength(DataLengths.MaxNameLength)] public string Name { get; set; } = null!;
        public int Order { get; set; }
        public string? Description { get; set; }
        public ListPropertyType Type { get; set; }
        public string? Function { get; set; }
        public int? ExternalListId { get; set; }
        [MaxLength(DataLengths.MaxNameLength)] public string? Group { get; set; }

        public ListPropertyTag Tags { get; set; } = 0;
        [NotMapped] public List<ListPropertyOption> Options { get; set; } = new();
        [Range(0, 100)] public int Width { get; set; }
    }
}
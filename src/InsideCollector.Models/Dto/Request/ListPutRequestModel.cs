using InsideCollector.Models.Constants;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InsideCollector.Models.Dto.Request
{
    public class ListPutRequestModel
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
    }
}

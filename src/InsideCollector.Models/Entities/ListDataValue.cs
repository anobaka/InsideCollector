using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using InsideCollector.Models.Constants;
using InsideCollector.Models.Dto;

namespace InsideCollector.Models.Entities
{
    public record ListDataValue
    {
        [Key]
        [MaxLength(DataLengths.MaxDataValueIdLength)]
        public string Id { get; set; } = null!;
        public int DataId { get; set; }
        public int PropertyId { get; set; }
        public string? Value { get; set; }
    }
}
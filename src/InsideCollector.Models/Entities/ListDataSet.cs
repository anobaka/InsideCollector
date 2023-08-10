// using InsideCollector.Models.Constants;
// using System;
// using System.Collections.Generic;
// using System.ComponentModel.DataAnnotations;
// using System.ComponentModel.DataAnnotations.Schema;
// using System.Linq;
// using System.Text;
// using System.Threading.Tasks;
//
// namespace InsideCollector.Models.Entities
// {
//     public class ListDataSet
//     {
//         public int Id { get; set; }
//         public int ListId { get; set; }
//         public int Order { get; set; }
//         [MaxLength(DataLengths.MaxNameLength)] public string Name { get; set; } = null!;
//         [NotMapped] public List<ListData> Data { get; set; } = new List<ListData>();
//     }
// }
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InsideCollector.Models.Entities
{
    public class ListData
    {
        public int Id { get; set; }
        public int MyListsId { get; set; }
        public int ListId { get; set; }
        // public int SetId { get; set; }
        public int Order { get; set; }

        [NotMapped] public List<ListDataValue> Values { get; set; } = new List<ListDataValue>();
    }
}
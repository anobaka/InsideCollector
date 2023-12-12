using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using InsideCollector.Models.Entities;

namespace InsideCollector.Models.Dto
{
    public record ListDataKey
    {
        public ListDataKey()
        {
        }

        public ListDataKey(int dataId, int propertyId)
        {
            DataId = dataId;
            PropertyId = propertyId;
        }

        public ListDataValue CreateValue(string? value = null)
        {
            return new ListDataValue
            {
                Id = ToString(),
                DataId = DataId,
                PropertyId = PropertyId,
                Value = value
            };
        }

        public int DataId { get; set; }
        public int PropertyId { get; set; }

        public override string ToString()
        {
            return $"{DataId}-{PropertyId}";
        }
    }
}
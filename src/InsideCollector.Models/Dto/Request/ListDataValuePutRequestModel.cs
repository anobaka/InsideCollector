﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InsideCollector.Models.Dto.Request
{
    public class ListDataValuePutRequestModel
    {
        public ListDataKey Key { get; set; } = null!;
        public string? Value { get; set; }
    }
}

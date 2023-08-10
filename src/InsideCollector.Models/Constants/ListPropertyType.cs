using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InsideCollector.Models.Constants
{
    public enum ListPropertyType
    {
        Number = 1,
        Input = 2,
        DateTime = 3,
        TimeSpan = 4,
        Select = 5,
        Date = 6,
        Text = 7,
        Image = 8,
        File = 9,
        External = 100,
        Computed = 200,
    }
}
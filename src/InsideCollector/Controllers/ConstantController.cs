using System.Reflection;
using Bootstrap.Extensions;

namespace InsideCollector.Controllers
{
    public class ConstantController : Bootstrap.Components.Miscellaneous.ConstantController
    {
        protected override List<Type> Types
        {
            get
            {
                var assemblies = Assembly.GetExecutingAssembly().GetReferencedAssemblies()
                    .Where(t => t.Name!.Contains("InsideCollector") || t.Name == "Bootstrap").Select(Assembly.Load).ToList();
                var enums = assemblies.SelectMany(t => t.GetTypes().Where(x => x.IsEnum)).ToList();
                enums.Add(SpecificTypeUtils<LogLevel>.Type);
                return enums;
            }
        }
    }
}
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace InsideCollector.Business
{
    public class InsideCollectorDbContextFactory : IDesignTimeDbContextFactory<InsideCollectorDbContext>
    {
        public const string ConnectionString = "Server=localhost;Database=inside_collector;Uid=root;Pwd=root;";
        public InsideCollectorDbContext CreateDbContext(string[] args)
        {
            var ob = new DbContextOptionsBuilder<InsideCollectorDbContext>();
            ob.UseMySQL(ConnectionString);
            return new InsideCollectorDbContext(ob.Options);
        }
    }
}

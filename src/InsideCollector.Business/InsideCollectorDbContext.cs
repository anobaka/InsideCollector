using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using InsideCollector.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace InsideCollector.Business
{
    public class InsideCollectorDbContext : DbContext
    {
        public DbSet<MyLists> MyLists { get; set; }
        public DbSet<InsideList> Lists { get; set; }
        public DbSet<ListProperty> ListProperties { get; set; }
        public DbSet<ListPropertyOption> ListPropertyOptions { get; set; }
        public DbSet<ListData> ListData { get; set; }
        public DbSet<ListDataValue> ListDataValues { get; set; }
        // public DbSet<ListDataSet> ListDataSets { get; set; }

        public InsideCollectorDbContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<MyLists>(t => { t.HasIndex(a => a.Name).IsUnique(); });
            modelBuilder.Entity<InsideList>(t =>
            {
                t.HasIndex(a => a.MyListsId);
                t.HasIndex(a => new {a.MyListsId, a.Name}).IsUnique();
            });
            modelBuilder.Entity<ListProperty>(t =>
            {
                t.HasIndex(a => a.ListId);
                t.HasIndex(a => new {a.ListId, a.VariableName}).IsUnique();
            });
            modelBuilder.Entity<ListPropertyOption>(t => { });
            modelBuilder.Entity<ListData>(t =>
            {
                t.HasIndex(a => a.ListId);
                // t.HasIndex(a => a.SetId);
                // t.HasIndex(a => new {a.ListId, a.SetId});
            });
            modelBuilder.Entity<ListDataValue>(t =>
            {
                t.HasIndex(a => a.DataId);
                t.HasIndex(a => new {a.DataId, a.PropertyId}).IsUnique();
            });

            // modelBuilder.Entity<ListDataSet>(t => { t.HasIndex(a => a.ListId); });

            base.OnModelCreating(modelBuilder);
        }
    }
}
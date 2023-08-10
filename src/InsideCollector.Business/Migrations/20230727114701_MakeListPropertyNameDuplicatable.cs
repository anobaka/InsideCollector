using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InsideCollector.Business.Migrations
{
    public partial class MakeListPropertyNameDuplicatable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ListProperties_ListId_Name",
                table: "ListProperties");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_ListProperties_ListId_Name",
                table: "ListProperties",
                columns: new[] { "ListId", "Name" },
                unique: true);
        }
    }
}

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InsideCollector.Business.Migrations
{
    public partial class AddHiddenToProperty : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Hidden",
                table: "ListProperties",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Hidden",
                table: "ListProperties");
        }
    }
}

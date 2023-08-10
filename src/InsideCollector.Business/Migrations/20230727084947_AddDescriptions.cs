using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InsideCollector.Business.Migrations
{
    public partial class AddDescriptions : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "MyLists",
                type: "longtext",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "ListProperties",
                type: "longtext",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Lists",
                type: "longtext",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "MyLists");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "ListProperties");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Lists");
        }
    }
}

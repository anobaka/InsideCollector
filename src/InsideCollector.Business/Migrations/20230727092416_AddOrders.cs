using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InsideCollector.Business.Migrations
{
    public partial class AddOrders : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Order",
                table: "MyLists",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Order",
                table: "ListPropertyOptions",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Order",
                table: "ListProperties",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Order",
                table: "ListData",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Order",
                table: "Lists",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Order",
                table: "MyLists");

            migrationBuilder.DropColumn(
                name: "Order",
                table: "ListPropertyOptions");

            migrationBuilder.DropColumn(
                name: "Order",
                table: "ListProperties");

            migrationBuilder.DropColumn(
                name: "Order",
                table: "ListData");

            migrationBuilder.DropColumn(
                name: "Order",
                table: "Lists");
        }
    }
}

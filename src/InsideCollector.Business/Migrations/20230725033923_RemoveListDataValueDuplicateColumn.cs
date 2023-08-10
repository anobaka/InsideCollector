using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InsideCollector.Business.Migrations
{
    public partial class RemoveListDataValueDuplicateColumn : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ListDataValues_ListData_ListDataId",
                table: "ListDataValues");

            migrationBuilder.DropIndex(
                name: "IX_ListDataValues_ListDataId",
                table: "ListDataValues");

            migrationBuilder.DropColumn(
                name: "ListDataId",
                table: "ListDataValues");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ListDataId",
                table: "ListDataValues",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ListDataValues_ListDataId",
                table: "ListDataValues",
                column: "ListDataId");

            migrationBuilder.AddForeignKey(
                name: "FK_ListDataValues_ListData_ListDataId",
                table: "ListDataValues",
                column: "ListDataId",
                principalTable: "ListData",
                principalColumn: "Id");
        }
    }
}

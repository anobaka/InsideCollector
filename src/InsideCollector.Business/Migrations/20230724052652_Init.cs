using Microsoft.EntityFrameworkCore.Migrations;
using MySql.EntityFrameworkCore.Metadata;

#nullable disable

namespace InsideCollector.Business.Migrations
{
    public partial class Init : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Lists",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    MyListsId = table.Column<int>(type: "int", nullable: false),
                    VariableName = table.Column<string>(type: "varchar(64)", maxLength: 64, nullable: false),
                    Name = table.Column<string>(type: "varchar(64)", maxLength: 64, nullable: false),
                    DataNameConvention = table.Column<string>(type: "longtext", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InsideLists", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ListData",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    MyListsId = table.Column<int>(type: "int", nullable: false),
                    ListId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ListData", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ListProperties",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    ListId = table.Column<int>(type: "int", nullable: false),
                    VariableName = table.Column<string>(type: "varchar(64)", maxLength: 64, nullable: false),
                    Name = table.Column<string>(type: "varchar(64)", maxLength: 64, nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false),
                    Function = table.Column<string>(type: "longtext", nullable: true),
                    ExternalListId = table.Column<int>(type: "int", nullable: true),
                    Group = table.Column<string>(type: "varchar(64)", maxLength: 64, nullable: true),
                    Tags = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ListProperties", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ListPropertyOptions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    PropertyId = table.Column<int>(type: "int", nullable: false),
                    Label = table.Column<string>(type: "varchar(64)", maxLength: 64, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ListPropertyOptions", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "MyLists",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "varchar(64)", maxLength: 64, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MyLists", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ListDataValues",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    DataId = table.Column<int>(type: "int", nullable: false),
                    PropertyId = table.Column<int>(type: "int", nullable: false),
                    Value = table.Column<string>(type: "longtext", nullable: true),
                    ListDataId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ListDataValues", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ListDataValues_ListData_ListDataId",
                        column: x => x.ListDataId,
                        principalTable: "ListData",
                        principalColumn: "Id");
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Lists_MyListsId",
                table: "Lists",
                column: "MyListsId");

            migrationBuilder.CreateIndex(
                name: "IX_Lists_MyListsId_Name",
                table: "Lists",
                columns: new[] { "MyListsId", "Name" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ListData_ListId",
                table: "ListData",
                column: "ListId");

            migrationBuilder.CreateIndex(
                name: "IX_ListDataValues_DataId",
                table: "ListDataValues",
                column: "DataId");

            migrationBuilder.CreateIndex(
                name: "IX_ListDataValues_DataId_PropertyId",
                table: "ListDataValues",
                columns: new[] { "DataId", "PropertyId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ListDataValues_ListDataId",
                table: "ListDataValues",
                column: "ListDataId");

            migrationBuilder.CreateIndex(
                name: "IX_ListProperties_ListId",
                table: "ListProperties",
                column: "ListId");

            migrationBuilder.CreateIndex(
                name: "IX_ListProperties_ListId_Name",
                table: "ListProperties",
                columns: new[] { "ListId", "Name" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ListProperties_ListId_VariableName",
                table: "ListProperties",
                columns: new[] { "ListId", "VariableName" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MyLists_Name",
                table: "MyLists",
                column: "Name",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Lists");

            migrationBuilder.DropTable(
                name: "ListDataValues");

            migrationBuilder.DropTable(
                name: "ListProperties");

            migrationBuilder.DropTable(
                name: "ListPropertyOptions");

            migrationBuilder.DropTable(
                name: "MyLists");

            migrationBuilder.DropTable(
                name: "ListData");
        }
    }
}

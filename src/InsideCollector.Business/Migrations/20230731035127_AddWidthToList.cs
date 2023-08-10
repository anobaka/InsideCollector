﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InsideCollector.Business.Migrations
{
    public partial class AddWidthToList : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Width",
                table: "Lists",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Width",
                table: "Lists");
        }
    }
}

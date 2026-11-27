using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CardiologiaHGSM.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ConcurrenciaCamaYQuitarIndiceUnicoCamaActiva : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Internaciones_CamaId_Activa",
                table: "Internaciones");

            migrationBuilder.AddColumn<uint>(
                name: "xmin",
                table: "Camas",
                type: "xid",
                rowVersion: true,
                nullable: false,
                defaultValue: 0u);

            migrationBuilder.CreateIndex(
                name: "IX_Internaciones_CamaId",
                table: "Internaciones",
                column: "CamaId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Internaciones_CamaId",
                table: "Internaciones");

            migrationBuilder.DropColumn(
                name: "xmin",
                table: "Camas");

            migrationBuilder.CreateIndex(
                name: "IX_Internaciones_CamaId_Activa",
                table: "Internaciones",
                column: "CamaId",
                unique: true,
                filter: "\"FechaFin\" IS NULL");
        }
    }
}

using DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DAL.EntityConfigurations
{
    public class CodeDraftConfiguration : IEntityTypeConfiguration<CodeDraft>
    {
        //Garanterar att en användare endast har ett unikt utkast per uppgift

        public void Configure(EntityTypeBuilder<CodeDraft> builder)
        {
            builder.HasKey(d => d.Id);

            // Sammansatt unikt index: En användare har max 1 utkast per uppgift
            builder.HasIndex(d => new { d.UserId, d.ExerciseId }).IsUnique();

            builder.Property(d => d.Code)
                .IsRequired();

            builder.HasOne(d => d.User)
                .WithMany(u => u.CodeDrafts)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(d => d.Exercise)
                .WithMany(e => e.CodeDrafts)
                .HasForeignKey(d => d.ExerciseId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}

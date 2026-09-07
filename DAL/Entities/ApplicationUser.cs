using Microsoft.AspNetCore.Identity;

namespace DAL.Entities
{
    public class ApplicationUser : IdentityUser
    {
        // Täcker US1,US2, US3, US7

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public int CurrentLevel { get; set; } = 1;
        public int ExperiencePoints { get; set; }

        public ICollection<CodeDraft> CodeDrafts { get; set; } = new List<CodeDraft>();
    }
}

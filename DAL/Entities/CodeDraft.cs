namespace DAL.Entities
{
    public class CodeDraft
    {
        // Täcker US9 (Spara kodutkast automatiskt)

        public int Id { get; set; }

        public string UserId { get; set; } = string.Empty;
        public ApplicationUser User { get; set; } = null!;

        public int ExerciseId { get; set; }
        public Exercise Exercise { get; set; } = null!;

        public string Code { get; set; } = string.Empty;
        public DateTime LastSavedAt { get; set; } = DateTime.UtcNow;
    }
}

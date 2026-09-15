namespace DAL.Entities
{
    public class Submission
    {
        public int Id { get; set; }

        public string UserId { get; set; } = string.Empty;
        public ApplicationUser User { get; set; } = null!;

        public int ExerciseId { get; set; }
        public Exercise Exercise { get; set; } = null!;

        public string SubmittedCode { get; set; } = string.Empty;
        public string Status { get; set; } = "Pending"; // "Passed", "Failed", "CompilationError", "TimedOut"
        public bool IsPassed { get; set; }
        public int ExecutionTimeMs { get; set; }
        public string? CompilerErrors { get; set; }
        public string? Feedback { get; set; }
        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    }
}

namespace BLL.DTOs.Exercises
{
    public class SubmissionHistoryDto
    {
        public int Id { get; set; }
        public int ExerciseId { get; set; }
        public string ExerciseTitle { get; set; } = string.Empty;
        public string ModuleTitle { get; set; } = string.Empty;
        public int ModuleId { get; set; }
        public bool IsPassed { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? Feedback { get; set; }
        public string SubmittedCode { get; set; } = string.Empty;
        public DateTime SubmittedAt { get; set; }
    }
}

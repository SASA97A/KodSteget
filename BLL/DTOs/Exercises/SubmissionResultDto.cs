namespace BLL.DTOs.Exercises
{
    public class SubmissionResultDto
    {
        public int SubmissionId { get; set; }
        public bool IsPassed { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? CompilerErrors { get; set; }
        public string? Feedback { get; set; }
        public int ExecutionTimeMs { get; set; }
        public List<TestCaseResultDto> TestCaseResults { get; set; } = new();
    }
}

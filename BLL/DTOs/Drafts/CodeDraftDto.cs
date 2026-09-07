namespace BLL.DTOs.Drafts
{
    public class CodeDraftDto
    {
        public int Id { get; set; }
        public int ExerciseId { get; set; }
        public string Code { get; set; } = string.Empty;
        public DateTime LastSavedAt { get; set; }
    }
}

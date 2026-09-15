namespace BLL.DTOs.Exercises
{
    public class ExerciseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public int XpValue { get; set; }
        public bool IsCompleted { get; set; }
    }
}

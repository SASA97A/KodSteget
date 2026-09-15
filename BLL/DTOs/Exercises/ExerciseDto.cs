namespace BLL.DTOs.Exercises
{
    public class ExerciseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public int XpValue { get; set; }
    }

    public class ModuleDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public List<ExerciseDto> Exercises { get; set; } = new();
    }
}

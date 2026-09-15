namespace BLL.DTOs.Exercises
{
    public class ExerciseDetailDto
    {
        public int Id { get; set; }
        public int ModuleId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Instruction { get; set; } = string.Empty;
        public List<BlockDto> Blocks { get; set; } = new();
        public List<string> CorrectOrder { get; set; } = new();
        public int XpValue { get; set; }
    }

    public class TestCaseDto
    {
        public string InputData { get; set; } = string.Empty;
        public string ExpectedOutput { get; set; } = string.Empty;
    }

    public class BlockDto
    {
        public string Id { get; set; } = string.Empty;
        public string Text { get; set; } = string.Empty;
    }
}

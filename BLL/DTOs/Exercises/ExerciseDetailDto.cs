namespace BLL.DTOs.Exercises
{
    public class ExerciseDetailDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string StarterCode { get; set; } = string.Empty;
        public int CharacterLimit { get; set; }
        public List<TestCaseDto> PublicTestCases { get; set; } = new();
    }

    public class TestCaseDto
    {
        public string InputData { get; set; } = string.Empty;
        public string ExpectedOutput { get; set; } = string.Empty;
    }
}

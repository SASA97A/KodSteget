namespace DAL.Entities
{
    public class Exercise
    {
        // För att identifiera övningen i databasen, (kodutkast)

        public int Id { get; set; }
        public int ModuleId { get; set; }
        public CourseModule Module { get; set; } = null!;

        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Instruction { get; set; } = string.Empty;

        // JSON-serialiserade listor för drag-and-drop
        public string BlocksJson { get; set; } = "[]";
        public string CorrectOrderJson { get; set; } = "[]";

        public string StarterCode { get; set; } = string.Empty;
        public string SolutionCode { get; set; } = string.Empty;
        public int XpValue { get; set; } = 10;

        public int MaxExecutionTimeMs { get; set; } = 3000;
        public int MaxMemoryLimitMb { get; set; } = 64;
        public int CharacterLimit { get; set; } = 5000;

        // Navigation properties
        public ICollection<CodeDraft> CodeDrafts { get; set; } = new List<CodeDraft>();
        public ICollection<ExerciseTestCase> TestCases { get; set; } = new List<ExerciseTestCase>();
        public ICollection<Submission> Submissions { get; set; } = new List<Submission>();
    }
}



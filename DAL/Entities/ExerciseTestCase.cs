namespace DAL.Entities
{
    public class ExerciseTestCase
    {
        public int Id { get; set; }

        public int ExerciseId { get; set; }
        public Exercise Exercise { get; set; } = null!;

        public string InputData { get; set; } = string.Empty;
        public string ExpectedOutput { get; set; } = string.Empty;
        public bool IsHidden { get; set; } = false; // Publika exempeltest vs dolda bedömningstest
    }
}

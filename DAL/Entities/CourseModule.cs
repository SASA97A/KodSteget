namespace DAL.Entities
{
    public class CourseModule
    {

        // Grupperar uppgifter och övningar i en kurs.
        // Varje modul kan ha flera övningar och kan vara kopplad till ett specifikt kursavsnitt.

        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int OrderIndex { get; set; }
        public int RequiredLevel { get; set; } = 1;

        // Navigation properties
        public ICollection<Exercise> Exercises { get; set; } = new List<Exercise>();
    }
}

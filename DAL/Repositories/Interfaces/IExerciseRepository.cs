using DAL.Entities;

namespace DAL.Repositories.Interfaces
{
    public interface IExerciseRepository
    {
        Task<IEnumerable<CourseModule>> GetModulesWithExercisesAsync();
        Task<Exercise?> GetByIdWithTestCasesAsync(int id);
    }

}

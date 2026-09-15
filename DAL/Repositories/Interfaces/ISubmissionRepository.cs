using DAL.Entities;

namespace DAL.Repositories.Interfaces
{
    public interface ISubmissionRepository
    {
        Task<List<int>> GetPassedExerciseIdsAsync(string userId);
        Task<Submission> CreateAsync(Submission submission);
        Task<IEnumerable<Submission>> GetUserSubmissionsAsync(string userId, int exerciseId);
    }
}

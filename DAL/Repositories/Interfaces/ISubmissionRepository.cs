using DAL.Entities;

namespace DAL.Repositories.Interfaces
{
    public interface ISubmissionRepository
    {
        Task<Submission> CreateAsync(Submission submission);
        Task<IEnumerable<Submission>> GetUserSubmissionsAsync(string userId, int exerciseId);
    }
}

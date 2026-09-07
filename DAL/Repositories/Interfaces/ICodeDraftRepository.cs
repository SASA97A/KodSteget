using DAL.Entities;

namespace DAL.Repositories.Interfaces
{
    public interface ICodeDraftRepository
    {
        Task<CodeDraft?> GetByUserAndExerciseAsync(string userId, int exerciseId);
        Task<CodeDraft> UpsertDraftAsync(string userId, int exerciseId, string code);
    }
}

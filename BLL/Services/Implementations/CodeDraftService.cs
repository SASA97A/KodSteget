using BLL.DTOs.Drafts;
using BLL.Mapping;
using BLL.Services.Interfaces;
using DAL.Repositories.Interfaces;

namespace BLL.Services.Implementations
{
    public class CodeDraftService : ICodeDraftService
    {
        private readonly ICodeDraftRepository _repository;

        public CodeDraftService(ICodeDraftRepository repository)
        {
            _repository = repository;
        }

        public async Task<CodeDraftDto?> GetDraftAsync(string userId, int exerciseId)
        {
            var draft = await _repository.GetByUserAndExerciseAsync(userId, exerciseId);
            return draft?.ToDto();
        }

        public async Task<CodeDraftDto> SaveDraftAsync(string userId, SaveDraftDto dto)
        {
            var draft = await _repository.UpsertDraftAsync(userId, dto.ExerciseId, dto.Code);
            return draft.ToDto();
        }
    }
}

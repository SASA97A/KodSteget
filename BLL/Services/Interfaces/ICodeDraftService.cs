using BLL.DTOs.Drafts;

namespace BLL.Services.Interfaces
{
    public interface ICodeDraftService
    {
        Task<CodeDraftDto?> GetDraftAsync(string userId, int exerciseId);
        Task<CodeDraftDto> SaveDraftAsync(string userId, SaveDraftDto dto);
    }
}

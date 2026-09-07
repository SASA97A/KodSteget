using BLL.DTOs.Auth;
using BLL.DTOs.Drafts;
using DAL.Entities;

namespace BLL.Mapping
{
    public static class MappingExtensions
    {
        public static UserProfileDto ToDto(this ApplicationUser user) => new()
        {
            Id = user.Id,
            Email = user.Email ?? string.Empty,
            CurrentLevel = user.CurrentLevel,
            ExperiencePoints = user.ExperiencePoints,
            CreatedAt = user.CreatedAt
        };

        public static CodeDraftDto ToDto(this CodeDraft draft) => new()
        {
            Id = draft.Id,
            ExerciseId = draft.ExerciseId,
            Code = draft.Code,
            LastSavedAt = draft.LastSavedAt
        };
    }
}

using BLL.DTOs.Exercises;

namespace BLL.Services.Interfaces
{
    public interface IExerciseService
    {
        Task<IEnumerable<ModuleDto>> GetModulesWithExercisesAsync(string userId);
        Task<ExerciseDetailDto?> GetExerciseByIdAsync(int exerciseId);
        Task<SubmissionResultDto> EvaluateSubmissionAsync(string userId, SubmitCodeDto dto);
    }
}

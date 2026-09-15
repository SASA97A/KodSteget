using BLL.DTOs.Exercises;
using BLL.Services.Interfaces;
using DAL.Entities;
using DAL.Repositories.Interfaces;
using System.Text.Json;

namespace BLL.Services.Implementations;

public class ExerciseService : IExerciseService
{
    private readonly IExerciseRepository _exerciseRepository;
    private readonly ISubmissionRepository _submissionRepository;
    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNameCaseInsensitive = true };

    public ExerciseService(
        IExerciseRepository exerciseRepository,
        ISubmissionRepository submissionRepository)
    {
        _exerciseRepository = exerciseRepository;
        _submissionRepository = submissionRepository;
    }

    public async Task<IEnumerable<ModuleDto>> GetModulesWithExercisesAsync(string userId)
    {
        var modules = await _exerciseRepository.GetModulesWithExercisesAsync();

        // Hämtar godkända övnings-ID via repositoryt
        var passedExerciseIds = await _submissionRepository.GetPassedExerciseIdsAsync(userId);

        var result = new List<ModuleDto>();
        int previousProgress = 100; // Nivå 1 är alltid öppen

        foreach (var m in modules.OrderBy(m => m.OrderIndex))
        {
            var totalExercises = m.Exercises.Count;
            var completedCount = m.Exercises.Count(e => passedExerciseIds.Contains(e.Id));

            int progress = totalExercises > 0
                ? (int)Math.Round((double)completedCount / totalExercises * 100)
                : 0;

            bool unlocked = m.OrderIndex == 1 || previousProgress >= 70;

            result.Add(new ModuleDto
            {
                Id = m.Id,
                Title = m.Title,
                Description = m.Description,
                OrderIndex = m.OrderIndex,
                ProgressPercent = progress,
                IsUnlocked = unlocked,
                Exercises = m.Exercises.Select(e => new ExerciseDto
                {
                    Id = e.Id,
                    Title = e.Title,
                    XpValue = e.XpValue,
                    IsCompleted = passedExerciseIds.Contains(e.Id)
                }).ToList()
            });

            previousProgress = progress;
        }

        return result;
    }

    public async Task<ExerciseDetailDto?> GetExerciseByIdAsync(int exerciseId)
    {
        var exercise = await _exerciseRepository.GetByIdWithTestCasesAsync(exerciseId);
        if (exercise == null)
            return null;

        return new ExerciseDetailDto
        {
            Id = exercise.Id,
            ModuleId = exercise.ModuleId,
            Title = exercise.Title,
            Description = exercise.Description,
            Instruction = exercise.Instruction,
            Blocks = JsonSerializer.Deserialize<List<BlockDto>>(exercise.BlocksJson, JsonOptions) ?? new(),
            CorrectOrder = JsonSerializer.Deserialize<List<string>>(exercise.CorrectOrderJson, JsonOptions) ?? new(),
            XpValue = exercise.XpValue
        };
    }

    public async Task<SubmissionResultDto> EvaluateSubmissionAsync(string userId, SubmitCodeDto dto)
    {
        var exercise = await _exerciseRepository.GetByIdWithTestCasesAsync(dto.ExerciseId);
        if (exercise == null)
            throw new ArgumentException("Uppgiften hittades inte.");

        string Normalize(string input) => string.Join(" ", input.Split(new[] { '\r', '\n', ' ', '\t' }, StringSplitOptions.RemoveEmptyEntries));

        var userClean = Normalize(dto.Code);
        var solutionClean = Normalize(exercise.SolutionCode);

        bool isPassed = string.Equals(userClean, solutionClean, StringComparison.OrdinalIgnoreCase);

        var submission = new Submission
        {
            UserId = userId,
            ExerciseId = exercise.Id,
            SubmittedCode = dto.Code,
            IsPassed = isPassed,
            Status = isPassed ? "Passed" : "Failed",
            Feedback = isPassed ? "Bra jobbat! Rätt lösning." : "Koden matchar inte det förväntade svaret. Försök igen!",
            ExecutionTimeMs = 0,
            SubmittedAt = DateTime.UtcNow
        };

        var saved = await _submissionRepository.CreateAsync(submission);

        return new SubmissionResultDto
        {
            SubmissionId = saved.Id,
            IsPassed = saved.IsPassed,
            Status = saved.Status,
            Feedback = saved.Feedback,
            ExecutionTimeMs = saved.ExecutionTimeMs
        };
    }

    public async Task<IEnumerable<SubmissionHistoryDto>> GetUserSubmissionHistoryAsync(string userId)
    {
        var submissions = await _submissionRepository.GetAllUserSubmissionsAsync(userId);

        return submissions.Select(s => new SubmissionHistoryDto
        {
            Id = s.Id,
            ExerciseId = s.ExerciseId,
            ExerciseTitle = s.Exercise?.Title ?? "Okänd övning",
            ModuleTitle = s.Exercise?.Module?.Title ?? "Nivå",
            ModuleId = s.Exercise?.ModuleId ?? 0,
            IsPassed = s.IsPassed,
            Status = s.Status,
            Feedback = s.Feedback,
            SubmittedCode = s.SubmittedCode,
            SubmittedAt = s.SubmittedAt
        });
    }
}
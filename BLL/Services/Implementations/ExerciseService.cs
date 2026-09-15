using BLL.DTOs.Exercises;
using BLL.Services.Interfaces;
using DAL.Entities;
using DAL.Repositories.Interfaces;

namespace BLL.Services.Implementations
{
    public class ExerciseService : IExerciseService
    {
        private readonly IExerciseRepository _exerciseRepository;
        private readonly ISubmissionRepository _submissionRepository;

        public ExerciseService(
            IExerciseRepository exerciseRepository,
            ISubmissionRepository submissionRepository)
        {
            _exerciseRepository = exerciseRepository;
            _submissionRepository = submissionRepository;
        }

        public async Task<IEnumerable<ModuleDto>> GetModulesWithExercisesAsync()
        {
            var modules = await _exerciseRepository.GetModulesWithExercisesAsync();

            return modules.Select(m => new ModuleDto
            {
                Id = m.Id,
                Title = m.Title,
                Description = m.Description,
                Exercises = m.Exercises.Select(e => new ExerciseDto
                {
                    Id = e.Id,
                    Title = e.Title,
                    XpValue = e.XpValue
                }).ToList()
            });
        }

        public async Task<ExerciseDetailDto?> GetExerciseByIdAsync(int exerciseId)
        {
            var exercise = await _exerciseRepository.GetByIdWithTestCasesAsync(exerciseId);
            if (exercise == null)
                return null;

            return new ExerciseDetailDto
            {
                Id = exercise.Id,
                Title = exercise.Title,
                Description = exercise.Description,
                StarterCode = exercise.StarterCode,
                CharacterLimit = exercise.CharacterLimit,
                PublicTestCases = exercise.TestCases
                    .Where(tc => !tc.IsHidden)
                    .Select(tc => new TestCaseDto
                    {
                        InputData = tc.InputData,
                        ExpectedOutput = tc.ExpectedOutput
                    }).ToList()
            };
        }

        public async Task<SubmissionResultDto> EvaluateSubmissionAsync(string userId, SubmitCodeDto dto)
        {
            var exercise = await _exerciseRepository.GetByIdWithTestCasesAsync(dto.ExerciseId);
            if (exercise == null)
                throw new ArgumentException("Uppgiften hittades inte.");

            // Normalisera koden: ta bort överflödiga blanksteg och radbrytningsskillnader (\r\n vs \n)
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
    }
}

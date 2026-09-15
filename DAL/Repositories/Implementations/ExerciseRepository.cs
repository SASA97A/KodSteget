using DAL.Data;
using DAL.Entities;
using DAL.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories.Implementations
{
    public class ExerciseRepository : IExerciseRepository
    {
        private readonly AppDbContext _context;

        public ExerciseRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CourseModule>> GetModulesWithExercisesAsync()
        {
            return await _context.CourseModules
                .Include(m => m.Exercises)
                .OrderBy(m => m.OrderIndex)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<Exercise?> GetByIdWithTestCasesAsync(int id)
        {
            return await _context.Exercises
                .Include(e => e.TestCases)
                .FirstOrDefaultAsync(e => e.Id == id);
        }
    }
}

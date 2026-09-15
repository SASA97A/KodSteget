using DAL.Data;
using DAL.Entities;
using DAL.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories.Implementations
{
    public class SubmissionRepository : ISubmissionRepository
    {
        private readonly AppDbContext _context;

        public SubmissionRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Submission> CreateAsync(Submission submission)
        {
            await _context.Submissions.AddAsync(submission);
            await _context.SaveChangesAsync();
            return submission;
        }

        public async Task<IEnumerable<Submission>> GetUserSubmissionsAsync(string userId, int exerciseId)
        {
            return await _context.Submissions
                .Where(s => s.UserId == userId && s.ExerciseId == exerciseId)
                .OrderByDescending(s => s.SubmittedAt)
                .AsNoTracking()
                .ToListAsync();
        }
    }
}

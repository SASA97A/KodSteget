using DAL.Data;
using DAL.Entities;
using DAL.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories.Implementations
{
    public class CodeDraftRepository : ICodeDraftRepository
    {
        private readonly AppDbContext _context;

        public CodeDraftRepository(AppDbContext context)
        {
            _context = context;
        }


        public async Task<CodeDraft?> GetByUserAndExerciseAsync(string userId, int exerciseId)
        {
            return await _context.CodeDrafts
            .AsNoTracking()
            .FirstOrDefaultAsync(d => d.UserId == userId && d.ExerciseId == exerciseId);
        }

        public async Task<CodeDraft> UpsertDraftAsync(string userId, int exerciseId, string code)
        {
            var existingDraft = await _context.CodeDrafts
            .FirstOrDefaultAsync(d => d.UserId == userId && d.ExerciseId == exerciseId);

            if (existingDraft is not null)
            {
                existingDraft.Code = code;
                existingDraft.LastSavedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
                return existingDraft;
            }

            var newDraft = new CodeDraft
            {
                UserId = userId,
                ExerciseId = exerciseId,
                Code = code,
                LastSavedAt = DateTime.UtcNow
            };

            await _context.CodeDrafts.AddAsync(newDraft);
            await _context.SaveChangesAsync();
            return newDraft;
        }
    }
}

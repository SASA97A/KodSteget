using DAL.Data;
using DAL.Entities;
using DAL.Repositories.Implementations;
using DAL.Tests.Infrastructure;

namespace DAL.Tests.Repositories
{
    public class CodeDraftRepositoryTests : IDisposable
    {
        private readonly AppDbContext _context;
        private readonly CodeDraftRepository _repository;

        public CodeDraftRepositoryTests()
        {
            _context = TestDbContextFactory.CreateInMemoryDbContext();
            _repository = new CodeDraftRepository(_context);

            // Seed data
            var module = new CourseModule { Id = 1, Title = "C# Grunder" };
            var exercise = new Exercise { Id = 1, ModuleId = 1, Title = "Hello World" };
            var user = new ApplicationUser { Id = "user-123", UserName = "tester@test.com", Email = "tester@test.com" };

            _context.CourseModules.Add(module);
            _context.Exercises.Add(exercise);
            _context.Users.Add(user);
            _context.SaveChanges();
        }

        [Fact]
        public async Task UpsertDraftAsync_ShouldCreateNewDraft_WhenNoDraftExists()
        {
            var result = await _repository.UpsertDraftAsync("user-123", 1, "Console.WriteLine(\"Test\");");

            Assert.NotNull(result);
            Assert.Equal("Console.WriteLine(\"Test\");", result.Code);
            Assert.Equal(1, _context.CodeDrafts.Count());
        }

        [Fact]
        public async Task UpsertDraftAsync_ShouldUpdateExistingDraft_WhenDraftAlreadyExists()
        {
            await _repository.UpsertDraftAsync("user-123", 1, "Initial code");

            var updated = await _repository.UpsertDraftAsync("user-123", 1, "Updated code");

            Assert.Equal("Updated code", updated.Code);
            Assert.Equal(1, _context.CodeDrafts.Count());
        }

        [Fact]
        public async Task GetByUserAndExerciseAsync_ShouldReturnNull_WhenNoMatch()
        {
            var result = await _repository.GetByUserAndExerciseAsync("user-999", 1);
            Assert.Null(result);
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}

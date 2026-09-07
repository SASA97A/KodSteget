using DAL.Data;
using Microsoft.EntityFrameworkCore;

namespace DAL.Tests.Infrastructure
{
    public static class TestDbContextFactory
    {
        public static AppDbContext CreateInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString()) // Unikt namn per test så testerna inte krockar
                .Options;

            var context = new AppDbContext(options);
            context.Database.EnsureCreated();

            return context;
        }
    }
}

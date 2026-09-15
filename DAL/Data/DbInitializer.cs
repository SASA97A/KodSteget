using System.Text.Json;
using DAL.Entities;

namespace DAL.Data;

public static class DbInitializer
{
    public static async Task SeedAsync(AppDbContext context)
    {
        if (context.CourseModules.Any())
        {
            return; // Databasen har redan data
        }

        var module1 = new CourseModule
        {
            Title = "Nivå 1",
            Description = "Grunderna i programmering",
            OrderIndex = 1,
            RequiredLevel = 1
        };

        var module2 = new CourseModule
        {
            Title = "Nivå 2",
            Description = "Fortsätt med fler programmeringskoncept",
            OrderIndex = 2,
            RequiredLevel = 2
        };

        var module3 = new CourseModule
        {
            Title = "Nivå 3",
            Description = "Mer avancerade övningar",
            OrderIndex = 3,
            RequiredLevel = 3
        };

        var module4 = new CourseModule
        {
            Title = "Nivå 4",
            Description = "Utmanande programmeringsproblem",
            OrderIndex = 4,
            RequiredLevel = 4
        };

        await context.CourseModules.AddRangeAsync(module1, module2, module3, module4);
        await context.SaveChangesAsync();

        var exercises = new List<Exercise>
        {
            new()
            {
                ModuleId = module1.Id,
                Title = "Din första variabel",
                Description = "Skapa en variabel som heter age och ge den värdet 25.",
                Instruction = "Dra kodblocken till rätt ordning så att variabeln skapas korrekt.",
                BlocksJson = JsonSerializer.Serialize(new[]
                {
                    new { id = "age-variable", text = "age" },
                    new { id = "age-equals", text = "=" },
                    new { id = "age-value", text = "25" }
                }),
                CorrectOrderJson = JsonSerializer.Serialize(new[] { "age-variable", "age-equals", "age-value" }),
                SolutionCode = "age = 25",
                XpValue = 10
            },
            new()
            {
                ModuleId = module1.Id,
                Title = "Arbeta med text",
                Description = "Skapa en variabel som heter name och ge den texten \"Elin\".",
                Instruction = "Placera blocken i rätt ordning så att texten sparas i variabeln.",
                BlocksJson = JsonSerializer.Serialize(new[]
                {
                    new { id = "name-variable", text = "name" },
                    new { id = "name-equals", text = "=" },
                    new { id = "name-value", text = "\"Elin\"" }
                }),
                CorrectOrderJson = JsonSerializer.Serialize(new[] { "name-variable", "name-equals", "name-value" }),
                SolutionCode = "name = \"Elin\"",
                XpValue = 10
            },
            new()
            {
                ModuleId = module1.Id,
                Title = "Enkel beräkning",
                Description = "Skapa en variabel som heter result och spara resultatet av 5 + 3.",
                Instruction = "Bygg beräkningen genom att placera blocken i rätt ordning.",
                BlocksJson = JsonSerializer.Serialize(new[]
                {
                    new { id = "result-variable", text = "result" },
                    new { id = "result-equals", text = "=" },
                    new { id = "number-five", text = "5" },
                    new { id = "plus", text = "+" },
                    new { id = "number-three", text = "3" }
                }),
                CorrectOrderJson = JsonSerializer.Serialize(new[] { "result-variable", "result-equals", "number-five", "plus", "number-three" }),
                SolutionCode = "result = 5 + 3",
                XpValue = 10
            },
            new()
            {
                ModuleId = module1.Id,
                Title = "Villkor",
                Description = "Skapa ett villkor som kontrollerar om age är större än 18.",
                Instruction = "Sätt ihop if-satsen i rätt ordning.",
                BlocksJson = JsonSerializer.Serialize(new[]
                {
                    new { id = "if-open", text = "if (" },
                    new { id = "if-age", text = "age" },
                    new { id = "greater-than", text = ">" },
                    new { id = "eighteen", text = "18" },
                    new { id = "if-close", text = ")" }
                }),
                CorrectOrderJson = JsonSerializer.Serialize(new[] { "if-open", "if-age", "greater-than", "eighteen", "if-close" }),
                SolutionCode = "if ( age > 18 )",
                XpValue = 10
            },
            new()
            {
                ModuleId = module1.Id,
                Title = "Kombinera det du lärt dig",
                Description = "Skapa en variabel för ålder och använd den sedan i ett villkor.",
                Instruction = "Bygg koden i rätt ordning genom att kombinera variabel och villkor.",
                BlocksJson = JsonSerializer.Serialize(new[]
                {
                    new { id = "combined-age", text = "age" },
                    new { id = "combined-equals", text = "=" },
                    new { id = "combined-value", text = "25" },
                    new { id = "combined-if-open", text = "if (" },
                    new { id = "combined-if-age", text = "age" },
                    new { id = "combined-greater-than", text = ">" },
                    new { id = "combined-eighteen", text = "18" },
                    new { id = "combined-if-close", text = ")" }
                }),
                CorrectOrderJson = JsonSerializer.Serialize(new[] { "combined-age", "combined-equals", "combined-value", "combined-if-open", "combined-if-age", "combined-greater-than", "combined-eighteen", "combined-if-close" }),
                SolutionCode = "age = 25 if ( age > 18 )",
                XpValue = 20
            }
        };

        await context.Exercises.AddRangeAsync(exercises);
        await context.SaveChangesAsync();
    }
}
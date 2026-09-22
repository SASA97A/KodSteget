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
            },
            // Nivå 2
            new()
            {
                ModuleId = module2.Id,
                Title = "Enkel loop",
                Description = "Skapa en loop som körs 5 gånger.",
                Instruction = "Sätt ihop for-loopen i rätt ordning.",
                BlocksJson = JsonSerializer.Serialize(new[]
                {
                    new { id = "for-open", text = "for (" },
                    new { id = "for-init", text = "i = 0 ;" },
                    new { id = "for-cond", text = "i < 5 ;" },
                    new { id = "for-inc", text = "i++" },
                    new { id = "for-close", text = ")" }
                }),
                CorrectOrderJson = JsonSerializer.Serialize(new[] { "for-open", "for-init", "for-cond", "for-inc", "for-close" }),
                SolutionCode = "for ( i = 0 ; i < 5 ; i++ )",
                XpValue = 15
            },
            new()
            {
                ModuleId = module2.Id,
                Title = "Skriv ut ett meddelande",
                Description = "Använd console.log för att skriva ut 'Hej'.",
                Instruction = "Sätt ihop utskriften.",
                BlocksJson = JsonSerializer.Serialize(new[]
                {
                    new { id = "console", text = "console.log" },
                    new { id = "log-open", text = "(" },
                    new { id = "log-msg", text = "\"Hej\"" },
                    new { id = "log-close", text = ")" }
                }),
                CorrectOrderJson = JsonSerializer.Serialize(new[] { "console", "log-open", "log-msg", "log-close" }),
                SolutionCode = "console.log ( \"Hej\" )",
                XpValue = 15
            },
            new()
            {
                ModuleId = module2.Id,
                Title = "Loop med utskrift",
                Description = "Kombinera en loop och en utskrift.",
                Instruction = "Skapa en loop som skriver ut värdet i.",
                BlocksJson = JsonSerializer.Serialize(new[]
                {
                    new { id = "l-for", text = "for ( i = 0 ; i < 3 ; i++ )" },
                    new { id = "l-block-open", text = "{" },
                    new { id = "l-log", text = "console.log ( i )" },
                    new { id = "l-block-close", text = "}" }
                }),
                CorrectOrderJson = JsonSerializer.Serialize(new[] { "l-for", "l-block-open", "l-log", "l-block-close" }),
                SolutionCode = "for ( i = 0 ; i < 3 ; i++ ) { console.log ( i ) }",
                XpValue = 20
            },
            new()
            {
                ModuleId = module2.Id,
                Title = "Skapa en array",
                Description = "Skapa en lista med siffrorna 1, 2, 3.",
                Instruction = "Bygg din array.",
                BlocksJson = JsonSerializer.Serialize(new[]
                {
                    new { id = "arr-var", text = "lista" },
                    new { id = "arr-eq", text = "=" },
                    new { id = "arr-open", text = "[" },
                    new { id = "arr-vals", text = "1, 2, 3" },
                    new { id = "arr-close", text = "]" }
                }),
                CorrectOrderJson = JsonSerializer.Serialize(new[] { "arr-var", "arr-eq", "arr-open", "arr-vals", "arr-close" }),
                SolutionCode = "lista = [ 1, 2, 3 ]",
                XpValue = 15
            },
            new()
            {
                ModuleId = module2.Id,
                Title = "Hämta från array",
                Description = "Hämta det första värdet från listan.",
                Instruction = "Skapa koden för att hämta värdet på index 0.",
                BlocksJson = JsonSerializer.Serialize(new[]
                {
                    new { id = "get-var", text = "forsta" },
                    new { id = "get-eq", text = "=" },
                    new { id = "get-arr", text = "lista" },
                    new { id = "get-idx", text = "[ 0 ]" }
                }),
                CorrectOrderJson = JsonSerializer.Serialize(new[] { "get-var", "get-eq", "get-arr", "get-idx" }),
                SolutionCode = "forsta = lista [ 0 ]",
                XpValue = 15
            },
            // Nivå 3
            new()
            {
                ModuleId = module3.Id,
                Title = "Skapa en funktion",
                Description = "Skapa en funktion som heter hej.",
                Instruction = "Bygg funktionen.",
                BlocksJson = JsonSerializer.Serialize(new[]
                {
                    new { id = "fn-kw", text = "function" },
                    new { id = "fn-name", text = "hej" },
                    new { id = "fn-args", text = "()" },
                    new { id = "fn-body", text = "{ }" }
                }),
                CorrectOrderJson = JsonSerializer.Serialize(new[] { "fn-kw", "fn-name", "fn-args", "fn-body" }),
                SolutionCode = "function hej () { }",
                XpValue = 25
            },
            new()
            {
                ModuleId = module3.Id,
                Title = "Funktion med retur",
                Description = "Skapa en funktion som returnerar 10.",
                Instruction = "Lägg till returvärdet.",
                BlocksJson = JsonSerializer.Serialize(new[]
                {
                    new { id = "rfn-kw", text = "function tio ()" },
                    new { id = "rfn-open", text = "{" },
                    new { id = "rfn-ret", text = "return 10 ;" },
                    new { id = "rfn-close", text = "}" }
                }),
                CorrectOrderJson = JsonSerializer.Serialize(new[] { "rfn-kw", "rfn-open", "rfn-ret", "rfn-close" }),
                SolutionCode = "function tio () { return 10 ; }",
                XpValue = 25
            },
            new()
            {
                ModuleId = module3.Id,
                Title = "Anropa funktionen",
                Description = "Anropa funktionen hej.",
                Instruction = "Gör funktionsanropet.",
                BlocksJson = JsonSerializer.Serialize(new[]
                {
                    new { id = "call-name", text = "hej" },
                    new { id = "call-open", text = "(" },
                    new { id = "call-close", text = ")" },
                    new { id = "call-semi", text = ";" }
                }),
                CorrectOrderJson = JsonSerializer.Serialize(new[] { "call-name", "call-open", "call-close", "call-semi" }),
                SolutionCode = "hej ( ) ;",
                XpValue = 20
            },
            new()
            {
                ModuleId = module3.Id,
                Title = "Funktion med parameter",
                Description = "Skapa en funktion som tar emot x och dubblar det.",
                Instruction = "Skapa funktionen.",
                BlocksJson = JsonSerializer.Serialize(new[]
                {
                    new { id = "dfn-def", text = "function dubbla ( x )" },
                    new { id = "dfn-open", text = "{" },
                    new { id = "dfn-ret", text = "return x * 2 ;" },
                    new { id = "dfn-close", text = "}" }
                }),
                CorrectOrderJson = JsonSerializer.Serialize(new[] { "dfn-def", "dfn-open", "dfn-ret", "dfn-close" }),
                SolutionCode = "function dubbla ( x ) { return x * 2 ; }",
                XpValue = 30
            },
            new()
            {
                ModuleId = module3.Id,
                Title = "Använd parameter",
                Description = "Anropa funktionen dubbla med värdet 5.",
                Instruction = "Gör anropet med argumentet 5.",
                BlocksJson = JsonSerializer.Serialize(new[]
                {
                    new { id = "pcall-name", text = "dubbla" },
                    new { id = "pcall-open", text = "(" },
                    new { id = "pcall-arg", text = "5" },
                    new { id = "pcall-close", text = ")" }
                }),
                CorrectOrderJson = JsonSerializer.Serialize(new[] { "pcall-name", "pcall-open", "pcall-arg", "pcall-close" }),
                SolutionCode = "dubbla ( 5 )",
                XpValue = 25
            },
            // Nivå 4
            new()
            {
                ModuleId = module4.Id,
                Title = "Fizzbuzz logik",
                Description = "Kontrollera om ett tal är delbart med 3.",
                Instruction = "Bygg villkoret med modulo (%).",
                BlocksJson = JsonSerializer.Serialize(new[]
                {
                    new { id = "fb-if", text = "if (" },
                    new { id = "fb-x", text = "x" },
                    new { id = "fb-mod", text = "% 3 == 0" },
                    new { id = "fb-close", text = ")" }
                }),
                CorrectOrderJson = JsonSerializer.Serialize(new[] { "fb-if", "fb-x", "fb-mod", "fb-close" }),
                SolutionCode = "if ( x % 3 == 0 )",
                XpValue = 40
            },
            new()
            {
                ModuleId = module4.Id,
                Title = "Enkel addition",
                Description = "Skapa en funktion som plussar två tal.",
                Instruction = "Bygg adderingen.",
                BlocksJson = JsonSerializer.Serialize(new[]
                {
                    new { id = "add-def", text = "function add ( a , b ) {" },
                    new { id = "add-ret", text = "return" },
                    new { id = "add-exp", text = "a + b" },
                    new { id = "add-close", text = "; }" }
                }),
                CorrectOrderJson = JsonSerializer.Serialize(new[] { "add-def", "add-ret", "add-exp", "add-close" }),
                SolutionCode = "function add ( a , b ) { return a + b ; }",
                XpValue = 40
            },
            new()
            {
                ModuleId = module4.Id,
                Title = "While loop",
                Description = "Skapa en while-loop som körs så länge x < 10.",
                Instruction = "Bygg loopen.",
                BlocksJson = JsonSerializer.Serialize(new[]
                {
                    new { id = "w-kw", text = "while (" },
                    new { id = "w-cond", text = "x < 10" },
                    new { id = "w-close", text = ") {" },
                    new { id = "w-body", text = "x++ ; }" }
                }),
                CorrectOrderJson = JsonSerializer.Serialize(new[] { "w-kw", "w-cond", "w-close", "w-body" }),
                SolutionCode = "while ( x < 10 ) { x++ ; }",
                XpValue = 40
            },
            new()
            {
                ModuleId = module4.Id,
                Title = "Störst av två",
                Description = "Kolla om a är större än b och returnera a.",
                Instruction = "Bygg villkoret.",
                BlocksJson = JsonSerializer.Serialize(new[]
                {
                    new { id = "max-if", text = "if ( a > b )" },
                    new { id = "max-open", text = "{" },
                    new { id = "max-ret", text = "return a ;" },
                    new { id = "max-close", text = "}" }
                }),
                CorrectOrderJson = JsonSerializer.Serialize(new[] { "max-if", "max-open", "max-ret", "max-close" }),
                SolutionCode = "if ( a > b ) { return a ; }",
                XpValue = 40
            },
            new()
            {
                ModuleId = module4.Id,
                Title = "Jämn siffra",
                Description = "Returnera sant om siffran x är jämn.",
                Instruction = "Använd modulo-operatorn för att kolla om jämn.",
                BlocksJson = JsonSerializer.Serialize(new[]
                {
                    new { id = "even-ret", text = "return" },
                    new { id = "even-x", text = "x" },
                    new { id = "even-mod", text = "% 2" },
                    new { id = "even-eq", text = "== 0 ;" }
                }),
                CorrectOrderJson = JsonSerializer.Serialize(new[] { "even-ret", "even-x", "even-mod", "even-eq" }),
                SolutionCode = "return x % 2 == 0 ;",
                XpValue = 50
            }
        };

        await context.Exercises.AddRangeAsync(exercises);
        await context.SaveChangesAsync();
    }
}
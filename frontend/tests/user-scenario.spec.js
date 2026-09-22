import { test, expect } from "@playwright/test";

test.describe("Scenario: Ny användares onboarding och dashboard-tillgång", () => {
  // Generera unika uppgifter per körning
  const uniqueId = Date.now();
  const testEmail = `elev_${uniqueId}@skola.se`;
  const testPassword = "Password123!";

  test("ska navigera från landing page, skapa konto, logga in och nå dashboarden", async ({
    page,
  }) => {
    // 1. Besök Landing Page
    await page.goto("/");
    await expect(page).toHaveTitle(/KodSteget/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Lär dig programmera",
    );

    // 2. Klicka på CTA för registrering
    await page.getByRole("link", { name: "Börja koda gratis" }).click();
    await expect(page).toHaveURL(/\/register/);

    // 3. Fyll i registreringsformuläret
    await page.locator("input#email").fill(testEmail);
    await page.locator("input#password").fill(testPassword);

    // Verifiera att lösenordsvalideringen aktiveras i UI
    await expect(
      page.locator("#validationBox").getByText("Utmärkt lösenord!")
    ).toBeVisible();

    // Skicka in formuläret
    await page.getByRole("button", { name: "Skapa konto" }).click();

    // 4. Vänta på att navigation sker till /login
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });

    // 5. Logga in med det nya kontot
    await page.locator("input#email").fill(testEmail);
    await page.locator("input#password").fill(testPassword);
    await page.getByRole("button", { name: "Logga in" }).click();

    // 6. Verifiera att ProtectedRoute släpper igenom och Dashboard visas
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      `Hej, elev_${uniqueId}!`,
    );

    // Verifiera att huvudelementen på Dashboarden laddas
    await expect(page.getByText("Aktiv nivå")).toBeVisible();
    await expect(page.getByText("Dina nivåer (Nivåstege)")).toBeVisible();
  });

  test("ska blockera oautentiserad användare från att nå /dashboard direkt", async ({
    page,
  }) => {
    // Rensa tokens för att simulera en utloggad användare
    await page.goto("/dashboard");

    // ProtectedRoute ska omdirigera till login
    await expect(page).toHaveURL(/\/login/);
  });
});

# Projektstruktur

## Projektöversikt

* **DAL** – Class Library (.NET)
  * **DAL.Tests** – xUnit Test Project (.NET)
* **BLL** – Class Library (.NET)
  * **BLL.Tests** – xUnit Test Project (.NET)
* **API** – ASP.NET Core Web API
  * **API.Tests** – xUnit Test Project (.NET)

---

## Beroenden (Project Dependencies)

* `DAL.Tests` → `DAL`
* `BLL` → `DAL`
* `BLL.Tests` → `BLL`
* `API` → `BLL` & `DAL`
* `API.Tests` → `API`

---

## NuGet-paket

### DAL
* `Microsoft.EntityFrameworkCore`
* `Microsoft.EntityFrameworkCore.SqlServer`
* `Microsoft.EntityFrameworkCore.Tools`
* `Microsoft.AspNetCore.Identity.EntityFrameworkCore`

### API
* `Microsoft.EntityFrameworkCore.Design`
* `Microsoft.EntityFrameworkCore.SqlServer`
* `Microsoft.AspNetCore.Identity.EntityFrameworkCore`
* `Microsoft.AspNetCore.Authentication.JwtBearer`

### BLL
* `Microsoft.AspNetCore.Identity.EntityFrameworkCore`
* `System.IdentityModel.Tokens.Jwt`
* `Microsoft.IdentityModel.Tokens`

### DAL.Tests
* `Microsoft.EntityFrameworkCore.InMemory`
using DAL.Entities;

namespace BLL.Services.Interfaces
{
    public interface ITokenService
    {
        string GenerateToken(ApplicationUser user);
    }
}

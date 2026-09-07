using BLL.DTOs.Auth;

namespace BLL.Services.Interfaces
{
    public interface IAuthService
    {
        Task<(bool Success, AuthResponseDto? Response, string? Error)> RegisterAsync(RegisterDto dto);
        Task<(bool Success, AuthResponseDto? Response, string? Error)> LoginAsync(LoginDto dto);
        Task<UserProfileDto?> GetProfileAsync(string userId);
        Task<(bool Success, string? Error)> ChangePasswordAsync(string userId, ChangePasswordDto dto);
    }
}

using BLL.DTOs.Auth;
using BLL.Mapping;
using BLL.Services.Interfaces;
using DAL.Entities;
using Microsoft.AspNetCore.Identity;

namespace BLL.Services.Implementations
{
    public class AuthService : IAuthService
    {

        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ITokenService _tokenService;

        public AuthService(UserManager<ApplicationUser> userManager, ITokenService tokenService)
        {
            _userManager = userManager;
            _tokenService = tokenService;
        }

        public async Task<(bool Success, AuthResponseDto? Response, string? Error)> RegisterAsync(RegisterDto dto)
        {
            var existingUser = await _userManager.FindByEmailAsync(dto.Email);
            if (existingUser != null)
                return (false, null, "Email is already in use.");

            var user = new ApplicationUser
            {
                UserName = dto.Email,
                Email = dto.Email
            };

            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
                return (false, null, string.Join(", ", result.Errors.Select(e => e.Description)));

            var token = _tokenService.GenerateToken(user);
            var response = new AuthResponseDto
            {
                Token = token,
                UserId = user.Id,
                Email = user.Email,
                CurrentLevel = user.CurrentLevel,
                ExperiencePoints = user.ExperiencePoints
            };

            return (true, response, null);
        }

        public async Task<(bool Success, AuthResponseDto? Response, string? Error)> LoginAsync(LoginDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null || !await _userManager.CheckPasswordAsync(user, dto.Password))
                return (false, null, "Invalid email or password.");

            var token = _tokenService.GenerateToken(user);
            var response = new AuthResponseDto
            {
                Token = token,
                UserId = user.Id,
                Email = user.Email ?? string.Empty,
                CurrentLevel = user.CurrentLevel,
                ExperiencePoints = user.ExperiencePoints
            };

            return (true, response, null);
        }

        public async Task<UserProfileDto?> GetProfileAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            return user?.ToDto();
        }

        public async Task<(bool Success, string? Error)> ChangePasswordAsync(string userId, ChangePasswordDto dto)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return (false, "User not found.");

            var result = await _userManager.ChangePasswordAsync(user, dto.CurrentPassword, dto.NewPassword);
            if (!result.Succeeded)
                return (false, string.Join(", ", result.Errors.Select(e => e.Description)));

            return (true, null);
        }
    }
}

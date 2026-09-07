namespace BLL.DTOs.Auth
{
    public class UserProfileDto
    {
        public string Id { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public int CurrentLevel { get; set; }
        public int ExperiencePoints { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}

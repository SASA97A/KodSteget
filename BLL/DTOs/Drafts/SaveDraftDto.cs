using System.ComponentModel.DataAnnotations;

namespace BLL.DTOs.Drafts
{
    public class SaveDraftDto
    {
        [Required]
        public int ExerciseId { get; set; }

        [Required]
        public string Code { get; set; } = string.Empty;
    }
}

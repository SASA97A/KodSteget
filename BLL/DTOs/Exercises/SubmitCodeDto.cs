using System.ComponentModel.DataAnnotations;

namespace BLL.DTOs.Exercises
{
    public class SubmitCodeDto
    {
        [Required]
        public int ExerciseId { get; set; }

        [Required]
        public string Code { get; set; } = string.Empty;
    }
}

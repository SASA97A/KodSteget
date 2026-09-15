using BLL.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExercisesController : ControllerBase
    {
        private readonly IExerciseService _exerciseService;

        public ExercisesController(IExerciseService exerciseService)
        {
            _exerciseService = exerciseService;
        }

        [HttpGet("modules")]
        public async Task<IActionResult> GetModules()
        {
            var modules = await _exerciseService.GetModulesWithExercisesAsync();
            return Ok(modules);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetExercise(int id)
        {
            var exercise = await _exerciseService.GetExerciseByIdAsync(id);
            if (exercise == null)
                return NotFound();

            return Ok(exercise);
        }
    }
}

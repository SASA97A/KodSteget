using BLL.DTOs.Drafts;
using BLL.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class DraftsController : ControllerBase
    {
        private readonly ICodeDraftService _draftService;

        public DraftsController(ICodeDraftService draftService)
        {
            _draftService = draftService;
        }

        [HttpGet("{exerciseId:int}")]
        public async Task<IActionResult> GetDraft(int exerciseId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var draft = await _draftService.GetDraftAsync(userId, exerciseId);
            if (draft == null)
                return NotFound();

            return Ok(draft);
        }

        [HttpPost]
        public async Task<IActionResult> SaveDraft([FromBody] SaveDraftDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var result = await _draftService.SaveDraftAsync(userId, dto);
            return Ok(result);
        }
    }
}

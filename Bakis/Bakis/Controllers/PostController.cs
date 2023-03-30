using Bakis.Auth.Model;
using Bakis.Data;
using Bakis.Data.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Bakis.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PostController : ControllerBase
    {
        private readonly ApplicationDbContext _databaseContext;
        private readonly IAuthorizationService _authorizationService;
        public PostController(ApplicationDbContext context, IAuthorizationService authorizationService)
        {
            _databaseContext = context;

            _authorizationService = authorizationService;
        }

        [HttpGet]
        [Authorize(Roles = Roles.User)]
        public async Task<ActionResult<List<Post>>> Get()
        {
            var allList = await _databaseContext.Posts.ToListAsync();
            if (allList.Count == 0)
                return BadRequest("User has nothing in list");
            var List = allList.Where(s => s.UserId == User.FindFirstValue(JwtRegisteredClaimNames.Sub)).ToList();
            if (List.Count == 0)
                return BadRequest("User has nothing in list");
            return Ok(List);
        }
        [HttpPost]
        [Authorize(Roles = Roles.User)]
        public async Task<ActionResult<List<Post>>> Create(Post List)
        {
            List.UserId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            List.CreatedDate = DateTime.Now;
            _databaseContext.Posts.Add(List);
            await _databaseContext.SaveChangesAsync();
            return Ok(await _databaseContext.Posts.ToListAsync());
        }

        [HttpDelete("{id}")]
        // [Authorize(Roles = Roles.User + "," + Roles.Admin)]
        public async Task<ActionResult<List<Post>>> Delete(int id)
        {
            var List = await _databaseContext.Posts.FindAsync(id);
            if (List == null)
                return BadRequest("List not found");

            var authResult = await _authorizationService.AuthorizeAsync(User, List, PolicyNames.ResourceOwner);
            if (!authResult.Succeeded)
            {
                return BadRequest("No permissions");
            }

            _databaseContext.Posts.Remove(List);
            await _databaseContext.SaveChangesAsync();
            return Ok(List);
        }

    }
}

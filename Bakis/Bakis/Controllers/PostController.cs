using Bakis.Auth.Model;
using Bakis.Data;
using Bakis.Data.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

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
        //[Authorize(Roles = Roles.User)]
        public async Task<ActionResult<List<Post>>> Get(int page = 1, int pageSize = 100)
        {
            var allList = await _databaseContext.Posts.ToListAsync();

            var totalItems = allList.Count();

            var totalPages = (int)Math.Ceiling((double)totalItems / pageSize);

            var items = allList.Skip((page - 1) * pageSize).Take(pageSize).ToList();

            var metadata = new
            {
                TotalItems = totalItems,
                TotalPages = totalPages,
                PageSize = pageSize,
                CurrentPage = page
            };

            Response.Headers.Add("X-Pagination", JsonConvert.SerializeObject(metadata));

            if (allList.Count == 0)
                return BadRequest("User has nothing in list");
            //var List = allList.Where(s => s.UserId == User.FindFirstValue(JwtRegisteredClaimNames.Sub)).ToList();
            //if (List.Count == 0)
            //    return BadRequest("User has nothing in list");
            return Ok(items);
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

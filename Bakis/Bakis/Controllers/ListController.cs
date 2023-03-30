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
    public class ListController : ControllerBase
    {
        private readonly ApplicationDbContext _databaseContext;
        private readonly IAuthorizationService _authorizationService;
        public ListController(ApplicationDbContext context,  IAuthorizationService authorizationService)
        {
            _databaseContext = context;
           
            _authorizationService = authorizationService;
        }

        [HttpGet]
        [Authorize(Roles = Roles.User)]
        public async Task<ActionResult<List<MyList>>> Get()
        {
            var allList = await _databaseContext.Lists.ToListAsync();
            if (allList.Count == 0)
                return BadRequest("User has nothing in list");
            var List = allList.Where(s => s.UserId == User.FindFirstValue(JwtRegisteredClaimNames.Sub)).ToList();
            if (List.Count == 0)
                return BadRequest("User has nothing in list");
            return Ok(List);
        }
        [HttpPost]
        [Authorize(Roles = Roles.User)]
        public async Task<ActionResult<List<MyList>>> Create(MyList List)
        {
            List.UserId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);

            _databaseContext.Lists.Add(List);
            await _databaseContext.SaveChangesAsync();
            return Ok(await _databaseContext.Lists.ToListAsync());
        }

        [HttpDelete("{id}")]
       // [Authorize(Roles = Roles.User + "," + Roles.Admin)]
        public async Task<ActionResult<List<MyList>>> Delete(int id)
        {
            var List = await _databaseContext.Lists.FindAsync(id);
            if (List == null)
                return BadRequest("List not found");

            var authResult = await _authorizationService.AuthorizeAsync(User, List, PolicyNames.ResourceOwner);
            if (!authResult.Succeeded)
            {
                return BadRequest("No permissions");
            }

            _databaseContext.Lists.Remove(List);
            await _databaseContext.SaveChangesAsync();
            return Ok(List);
        }

    }
}

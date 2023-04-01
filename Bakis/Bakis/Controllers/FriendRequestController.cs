using Bakis.Auth.Model;
using Bakis.Data.Models;
using Bakis.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.EntityFrameworkCore;

namespace Bakis.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class FriendRequestController : ControllerBase
    {
        private readonly ApplicationDbContext _databaseContext;
        private readonly IAuthorizationService _authorizationService;
        public FriendRequestController(ApplicationDbContext context, IAuthorizationService authorizationService)
        {
            _databaseContext = context;

            _authorizationService = authorizationService;
        }

        [HttpGet]
        [Authorize(Roles = Roles.User)]
        public async Task<ActionResult<List<Friend>>> GetUserRequests()
        {
            var allList = await _databaseContext.FriendRequests.ToListAsync();
            if (allList.Count == 0)
                return BadRequest("User has nothing in list");
            var List = allList.Where(s => s.FriendId == User.FindFirstValue(JwtRegisteredClaimNames.Sub)).ToList();
            if (List.Count == 0)
                return BadRequest("User has nothing in list");
            return Ok(List);
        }
        [HttpPost]
        [Authorize(Roles = Roles.User)]
        public async Task<ActionResult<List<Friend>>> InviteFriend(Friend List)
        {
            List.UserId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);

            _databaseContext.Friends.Add(List);
            await _databaseContext.SaveChangesAsync();
            return Ok(await _databaseContext.Friends.ToListAsync());
        }

        [HttpDelete("{id}")]
        // [Authorize(Roles = Roles.User + "," + Roles.Admin)]
        public async Task<ActionResult<List<Friend>>> Delete(int id)
        {
            var List = await _databaseContext.Friends.FindAsync(id);
            if (List == null)
                return BadRequest("List not found");

            var authResult = await _authorizationService.AuthorizeAsync(User, List, PolicyNames.ResourceOwner);
            if (!authResult.Succeeded)
            {
                return BadRequest("No permissions");
            }

            _databaseContext.Friends.Remove(List);
            await _databaseContext.SaveChangesAsync();
            return Ok(List);
        }
    }
}

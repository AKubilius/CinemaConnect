using Bakis.Auth.Model;
using Bakis.Data.Models;
using Bakis.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.EntityFrameworkCore;
using Bakis.Data.Migrations;

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
        public async Task<ActionResult<List<FriendRequest>>> GetUserRequests()
        {
            var allList = await _databaseContext.FriendRequests.ToListAsync();
            if (allList.Count == 0)
                return NotFound("There are no friend requests");

            _databaseContext.FriendRequests.RemoveRange(allList);
            await _databaseContext.SaveChangesAsync();
            //var List = allList.Where(s => s.FriendId == User.FindFirstValue(JwtRegisteredClaimNames.Sub)).ToList();
            //if (List.Count == 0)
            //    return NotFound("User has no friend requests");
            return Ok(allList);
        }

        [HttpPost]
        [Authorize(Roles = Roles.User)]
        public async Task<ActionResult<List<FriendRequest>>> InviteFriend(FriendRequest friend)
        {
            friend.InvitedBy = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            friend.Status = "Pending"; // čia ištrynt nes nereikia

            var List =  _databaseContext.FriendRequests.SingleOrDefault(e => e.FriendId == friend.FriendId && e.InvitedBy == friend.InvitedBy);
            if (List !=null)
            {
                return BadRequest("Friend request already exist");
            }
            _databaseContext.FriendRequests.Add(friend);
            
            await _databaseContext.SaveChangesAsync();
            var Created =_databaseContext.FriendRequests.SingleOrDefault(e => e.FriendId == friend.FriendId && e.InvitedBy == friend.InvitedBy);

            return Ok(Created.Id);
        }

        [HttpDelete("{id}")]
        // [Authorize(Roles = Roles.User + "," + Roles.Admin)]
        public async Task<ActionResult<List<FriendRequest>>> CancelRequest(string id)
        {
            string myId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);

            var List = _databaseContext.FriendRequests.SingleOrDefault(e => e.FriendId == id && e.InvitedBy == myId);// cia same apdaryt ka ten dariau

            if (List == null)
                return BadRequest("Request not found");

            //var authResult = await _authorizationService.AuthorizeAsync(User, List, PolicyNames.ResourceOwner);
            //if (!authResult.Succeeded)
            //{
            //    return BadRequest("No permissions");
            //}

            _databaseContext.FriendRequests.Remove(List);
            await _databaseContext.SaveChangesAsync();
            return Ok(List);
        }
        //[HttpDelete("{id}")]
        //// [Authorize(Roles = Roles.User + "," + Roles.Admin)]
        //public async Task<ActionResult<List<FriendRequest>>> AcceptRequest(int id)
        //{
        //    var List = await _databaseContext.FriendRequests.FindAsync(id);
        //    if (List == null)
        //        return BadRequest("List not found");


        //    _databaseContext.FriendRequests.Remove(List);
        //    await _databaseContext.SaveChangesAsync();
        //    return Ok(List);
        //}

    }
}

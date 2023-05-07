using Bakis.Auth.Model;
using Bakis.Data;
using Bakis.Data.Migrations;
using Bakis.Data.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Bakis.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WatchingRequestController : ControllerBase
    {
        private readonly ApplicationDbContext _databaseContext;
        private readonly IAuthorizationService _authorizationService;
        public WatchingRequestController(ApplicationDbContext context, IAuthorizationService authorizationService)
        {
            _databaseContext = context;
            _authorizationService = authorizationService;
        }

        private async Task<User> getCurrentUser()
        {
            return await _databaseContext.Users.FindAsync(User.FindFirstValue(JwtRegisteredClaimNames.Sub));
        }

        private string getCurrentUserId()
        {
            return User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        }


        [HttpGet("{id}")]
        [Authorize(Roles = Roles.User)]
        public async Task<ActionResult<List<WatchingRequest>>> GetUserRequest(int id) //Tikrinam kas jį pakvietę,ir visus userius, kurie pakvietę grąžinam.
        {
            var watchingRequest = _databaseContext.WatchingRequests.SingleOrDefault(e => e.MessageId == id);
            return Ok(watchingRequest);
        }

        [HttpGet]
        [Authorize(Roles = Roles.User)]
        public async Task<ActionResult<List<WatchingRequest>>> Get()
        {
            var allList = await _databaseContext.WatchingRequests.ToListAsync();
            if (allList.Count == 0)
                return BadRequest("User has nothing in list");
            var List = allList.Where(s => s.InvitedById == getCurrentUserId()).ToList();//cia ne tiap

            return Ok(List);
        }


        [HttpPut("accept/{id}")]
        [Authorize(Roles = Roles.User + "," + Roles.Admin)]
        public async Task<ActionResult<List<WatchingRequest>>> AcceptRequest(int id)
        {
            var watchingRequest =  _databaseContext.WatchingRequests.SingleOrDefault(e => e.MessageId == id);
            watchingRequest.Status = Status.Accepted;
            await _databaseContext.SaveChangesAsync();
            return Ok(watchingRequest);
        }

        [HttpPut("decline/{id}")]
        [Authorize(Roles = Roles.User + "," + Roles.Admin)]
        public async Task<ActionResult<List<WatchingRequest>>> DeclineRequest(int id)
        {
            var watchingRequest = _databaseContext.WatchingRequests.SingleOrDefault(e => e.MessageId == id);
            watchingRequest.Status = Status.Declined;
            await _databaseContext.SaveChangesAsync();
            return Ok(watchingRequest);
        }

        // gal idesim.
        [HttpDelete("{id}")]
        [Authorize(Roles = Roles.User + "," + Roles.Admin)]
        public async Task<ActionResult<List<WatchingRequest>>> CancelRequest(string id)
        {
            string myId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);

            var List = _databaseContext.WatchingRequests.SingleOrDefault(e => e.FriendId == id && e.InvitedById == myId);

            if (List == null)
                return BadRequest("Request not found");

            _databaseContext.WatchingRequests.Remove(List);
            await _databaseContext.SaveChangesAsync();
            return Ok("Request canceled");
        }
    }
}

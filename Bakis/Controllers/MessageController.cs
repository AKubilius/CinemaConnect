using Bakis.Data.Models;
using Bakis.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Bakis.Data.Migrations;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Bakis.Data.Models.DTOs;
using Bakis.Auth.Model;
using UserDto = Bakis.Data.Models.DTOs.UserDto;

namespace Bakis.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private readonly ApplicationDbContext _databaseContext;
        private readonly IAuthorizationService _authorizationService;
        public MessageController(ApplicationDbContext context, IAuthorizationService authorizationService)
        {
            _databaseContext = context;

            _authorizationService = authorizationService;
        }

        [HttpGet]
        [Authorize(Roles = Roles.User)]
        public async Task<ActionResult<List<Message>>> Get()
        {
            var allList = await _databaseContext.Messages
        .Include(m => m.Sender)
        .OrderByDescending(m => m.DateTime)
        .Take(50)
        .Select(m => new MessageDto
        {
            Id = m.Id,
            Body = m.Body,
            DateTime = m.DateTime,
            RoomId = m.RoomId,
            Sender = new UserDto
            {
                Id = m.Sender.Id,
                UserName = m.Sender.UserName
                //Nuotrauka dar bus
            }
        })
        .ToListAsync();

            return Ok(allList);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = Roles.User)]
        public async Task<ActionResult> GetRoomId(string id)
        {
            // Fetch rooms for both users
            var userRooms = _databaseContext.UserRooms.Where(ur => ur.UserId == User.FindFirstValue(JwtRegisteredClaimNames.Sub)).Select(ur => ur.RoomId).ToList();
            var friendRooms = _databaseContext.UserRooms.Where(ur => ur.UserId == id).Select(ur => ur.RoomId).ToList();

            // Find the common room
            var commonRoomId = userRooms.Intersect(friendRooms).FirstOrDefault();

            // If commonRoomId is 0, then there's no common room between the two users
            if (commonRoomId == 0)
            {
                return null;
            }
            return Ok(commonRoomId);
        }


        //    var messages = await _databaseContext.Messages
        //.Where(m => m.RoomId == roomId)
        //.OrderByDescending(m => m.DateTime)
        //.Take(50)
        //.ToListAsync();
    }
}

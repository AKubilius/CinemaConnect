﻿using Bakis.Auth.Model;
using Bakis.Data;
using Bakis.Data.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Bakis.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _databaseContext;
        private readonly IAuthorizationService _authorizationService;
        public UserController(ApplicationDbContext context, IAuthorizationService authorizationService)
        {
            _databaseContext = context;

            _authorizationService = authorizationService;
        }

        [HttpGet("friends")]
        //[Authorize(Roles = Roles.User)]
        public async Task<ActionResult<List<User>>> GetFriends()// Gettinam tik dabartinio žmogaus draugus,pasiimam userį, pasiimam visus friends ir where userid imam listą userių, kurių id yra friends
        {
            var Friends = await _databaseContext.Friends.ToListAsync();

            var UserID = await _databaseContext.Users.FindAsync(User.FindFirstValue(JwtRegisteredClaimNames.Sub));

            var Users = await _databaseContext.Users.ToListAsync();

            //_databaseContext.Friends.RemoveRange(Friends);
            //await _databaseContext.SaveChangesAsync();

            //if (Requests.Count == 0)
            //    return NotFound("User has no friend requests");

            List<User> users = new List<User>();

            foreach (var friend in Friends) // Friends klasė durnai padaryta, tikrinam ar bent kuris iš variable yra dabartinis useris.
            {
                if (friend.UserId == UserID.Id )
                    users.Add(Users.SingleOrDefault(e => e.Id == friend.FriendId));

                if(friend.FriendId == UserID.Id)
                    users.Add(Users.SingleOrDefault(e => e.Id == friend.UserId));
            }

            //if (allList.Count == 0)
            //    return BadRequest("There are no users available");


            return Ok(users);
        }

        [HttpGet]
        //[Authorize(Roles = Roles.User)]
        public async Task<ActionResult<List<User>>> GetUsers()// Getinam friends dar, ir juos irgi istrinam is listo
        {
            var Users = await _databaseContext.Users.FindAsync(User.FindFirstValue(JwtRegisteredClaimNames.Sub));

            var allList = await _databaseContext.Users.ToListAsync();
            if (allList.Count == 0)
                return BadRequest("There are no users available");
            allList.Remove(Users);


            return Ok(allList);
        }


        [HttpPut]
       // [Authorize(Roles = Roles.User)]
        public async Task<ActionResult<List<User>>> Update(User request)
        {

            var Users = await _databaseContext.Users.FindAsync(User.FindFirstValue(JwtRegisteredClaimNames.Sub));
            if (Users == null)
                return BadRequest("User was not found");

            Users.Name = request.Name;
            Users.Surname = request.Surname;
            await _databaseContext.SaveChangesAsync();
            return Ok(Users);
        }

    }
}

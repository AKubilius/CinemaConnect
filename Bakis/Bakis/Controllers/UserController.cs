using Bakis.Auth.Model;
using Bakis.Data;
using Bakis.Data.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

        [HttpGet]
        //[Authorize(Roles = Roles.User)]
        public async Task<ActionResult<List<User>>> Get()
        {
            var allList = await _databaseContext.Users.ToListAsync();
            if (allList.Count == 0)
                return BadRequest("User has nothing in list");
            return Ok(allList);
        }

    }
}

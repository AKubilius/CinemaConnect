using Bakis.Data.Models;
using Bakis.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

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

        //[HttpPost]
        ////[Authorize(Roles = Roles.User)]
        //public async Task<ActionResult<List<Message>>> SendMessage()
        //{
        //    var allList = await _databaseContext.Users.ToListAsync();
        //    if (allList.Count == 0)
        //        return BadRequest("User has nothing in list");
        //    return Ok(allList);
        //}

    }
}

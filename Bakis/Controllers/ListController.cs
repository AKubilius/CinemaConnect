using Bakis.Auth.Model;
using Bakis.Data;
using Bakis.Data.Models;
using IO.Ably;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http;
using System.Security.Claims;

namespace Bakis.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ListController : ControllerBase
    {
        private readonly ApplicationDbContext _databaseContext;
        private readonly IAuthorizationService _authorizationService;
        private readonly HttpClient _httpClient;
        private readonly string API_KEY;
        public ListController(IHttpClientFactory httpClientFactory, ApplicationDbContext context,  IAuthorizationService authorizationService, IConfiguration configuration)
        {
            _httpClient = httpClientFactory.CreateClient();
            _databaseContext = context;
            _authorizationService = authorizationService;
            API_KEY = configuration["TMDB:ApiKey"];
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

        //STRINGAS ID MOVIE???? perdaryk
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


        public async Task<List<int>> GetUserMovieIdsAsync(string userId)
        {
            var movieList = await _databaseContext.Lists
                .Where(list => list.UserId == userId)
                .ToListAsync();

            return movieList.Select(list => int.Parse(list.MovieID)).ToList();
        }

        public async Task<double> CalculateCompatibility(string userId1, string userId2)
        {
            // Retrieve movie IDs from the database
            var user1Movies = await GetUserMovieIdsAsync(userId1);
            var user2Movies = await GetUserMovieIdsAsync(userId2);

            // Fetch movie criteria for both users
            var user1Criteria = new HashSet<string>();
            var user2Criteria = new HashSet<string>();

            foreach (var movieId in user1Movies)
            {
                var criteria = await GetMovieCriteriaAsync(movieId);
                user1Criteria.UnionWith(criteria);
            }

            foreach (var movieId in user2Movies)
            {
                var criteria = await GetMovieCriteriaAsync(movieId);
                user2Criteria.UnionWith(criteria);
            }

            // Calculate the Jaccard similarity index
            double similarity = CalculateJaccardSimilarity(user1Criteria, user2Criteria);
            double compatibilityPercentage = similarity * 100;

            return compatibilityPercentage;
        }

        [HttpGet("compatibility/{userName}")]
        public async Task<IActionResult> GetCompatibility(string userName)
        {

            var user = await _databaseContext.Users.SingleOrDefaultAsync(u => u.UserName == userName);

            var userId2 = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            var compatibility = await CalculateCompatibility(user.Id, userId2);
            return Ok(new { Compatibility = compatibility });
        }

        public async Task<HashSet<string>> GetMovieCriteriaAsync(int movieId)
        {
            var genres = await GetMovieGenresAsync(movieId);
            var directors = await GetMovieDirectorsAsync(movieId);
            var actors = await GetMovieActorsAsync(movieId);

            genres.UnionWith(directors);
            genres.UnionWith(actors);

            return genres;
        }

        static double CalculateJaccardSimilarity(HashSet<string> setA, HashSet<string> setB)
        {
            var intersection = setA.Intersect(setB).Count();
            var union = setA.Union(setB).Count();

            if (union == 0) return 0.0;

            return (double)intersection / union;
        }

        public async Task<HashSet<string>> GetMovieGenresAsync(int movieId)
        {
            var genres = new HashSet<string>();

            var url = $"https://api.themoviedb.org/3/movie/{movieId}?api_key={API_KEY}&language=en-US";
            var response = await _httpClient.GetAsync(url);
            var content = await response.Content.ReadAsStringAsync();

            dynamic json = JObject.Parse(content);
            foreach (var genre in json.genres)
            {
                genres.Add("genre_" + (string)genre.name); // Prefix to differentiate from other criteria
            }

            return genres;
        }

        public async Task<HashSet<string>> GetMovieDirectorsAsync(int movieId)
        {
            var directors = new HashSet<string>();

            var url = $"https://api.themoviedb.org/3/movie/{movieId}/credits?api_key={API_KEY}";
            var response = await _httpClient.GetAsync(url);
            var content = await response.Content.ReadAsStringAsync();

            dynamic json = JObject.Parse(content);
            foreach (var crew in json.crew)
            {
                if (crew.job == "Director")
                {
                    directors.Add("director_" + (string)crew.name); // Prefix to differentiate from other criteria
                }
            }

            return directors;
        }

        public async Task<HashSet<string>> GetMovieActorsAsync(int movieId)
        {
            var actors = new HashSet<string>();

            var url = $"https://api.themoviedb.org/3/movie/{movieId}/credits?api_key={API_KEY}";
            var response = await _httpClient.GetAsync(url);
            var content = await response.Content.ReadAsStringAsync();

            dynamic json = JObject.Parse(content);
            foreach (var cast in json.cast)
            {
                actors.Add("actor_" + (string)cast.name); // Prefix to differentiate from other criteria
            }

            return actors;
        }

    }
}

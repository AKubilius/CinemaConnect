using Bakis.Auth.Model;
using Bakis.Data;
using Bakis.Data.Models;
using IO.Ably;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
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

        [HttpGet("Mylist")]
        //[Authorize(Roles = Roles.User)]
        public async Task<ActionResult<List<MyList>>> Get()
        {
            var allList = await _databaseContext.Lists.ToListAsync();
            if (allList.Count == 0)
                return BadRequest("User has nothing in list");
            var List = allList.Where(s => s.UserId == User.FindFirstValue(JwtRegisteredClaimNames.Sub)).ToList();//cia ne tiap

            return Ok(List);
        }


        [HttpGet("Mylist/{userName}")]
        public async Task<ActionResult<List<MyList>>> GetUserList(string userName)
        {
            var user = await _databaseContext.Users.SingleOrDefaultAsync(u => u.UserName == userName);

            var allList = await _databaseContext.Lists.ToListAsync();
            if (allList.Count == 0)
                return NotFound("There are nothing in Lists database");

            var List = allList.Where(s => s.UserId == user.Id).ToList();//cia ne tiap

            return Ok(List);
        }

        //STRINGAS ID MOVIE???? perdaryk
        [HttpPost("Mylist")]
        [Authorize(Roles = Roles.User)]
        public async Task<ActionResult<List<MyList>>> Create(MyList List) 
        {
            List.UserId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);

            var movieList = await _databaseContext.Lists
               .Where(list => list.MovieID == List.MovieID && list.UserId == User.FindFirstValue(JwtRegisteredClaimNames.Sub))
               .ToListAsync();

            var UserId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);


            if (movieList.Count != 0)
            {
                return Ok("Movie already in list");
            }
            _databaseContext.Lists.Add(List);
            await _databaseContext.SaveChangesAsync();
            return Ok(await _databaseContext.Lists.ToListAsync());
        }

        [HttpGet("isListed/{id}")]
        [Authorize(Roles = Roles.User + "," + Roles.Admin)]
        public async Task<ActionResult<List<MyList>>> GetIsLiked(int id)
        {
            var List = await _databaseContext.Posts.FindAsync(id);
            if (List == null)
                return NotFound();

            var UserId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);

            var inList = _databaseContext.Lists.SingleOrDefault(e => e.UserId == UserId && e.MovieID == List.MovieId.ToString());

            if (inList == null)
                return Ok(false);

            return Ok(true);
        }


        //var Likes = await _databaseContext.Likes.ToListAsync();
        //_databaseContext.Likes.RemoveRange(Likes);
        //await _databaseContext.SaveChangesAsync();


        [HttpDelete("{id}")]
       // [Authorize(Roles = Roles.User + "," + Roles.Admin)]
        public async Task<ActionResult<List<MyList>>> Delete(string id)
        {

            var movieList = _databaseContext.Lists.SingleOrDefault(e => e.UserId == User.FindFirstValue(JwtRegisteredClaimNames.Sub) && e.MovieID == id);

            _databaseContext.Lists.Remove(movieList);
            await _databaseContext.SaveChangesAsync();
            return Ok(movieList);
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

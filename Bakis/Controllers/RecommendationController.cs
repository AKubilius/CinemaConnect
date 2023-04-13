using Bakis.Data;
using IO.Ably;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Bakis.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecommendationController : ControllerBase
    {
        private const string TmdbApiBase = "https://api.themoviedb.org/3";
        private readonly ApplicationDbContext _databaseContext;
        private readonly IAuthorizationService _authorizationService;
        private readonly HttpClient _httpClient;
        private readonly string API_KEY;
        public RecommendationController(IHttpClientFactory httpClientFactory, ApplicationDbContext context, IAuthorizationService authorizationService, IConfiguration configuration)
        {
            _httpClient = httpClientFactory.CreateClient();
            _databaseContext = context;
            _authorizationService = authorizationService;
            API_KEY = configuration["TMDB:ApiKey"];
        }

        public async Task<HashSet<int>> GetRecommendationsForUserIdsAsync(string userId1, string userId2)
        {
            // Retrieve movie IDs from the database
            var user1Movies = await GetUserMovieIdsAsync(userId1);
            var user2Movies = await GetUserMovieIdsAsync(userId2);

            // Get recommendations
            var recommendations = await GetRecommendationsForMultipleUsers(new List<List<int>> { user1Movies, user2Movies });

            return recommendations;
        }

        public async Task<List<int>> GetUserMovieIdsAsync(string userId)
        {
            var movieList = await _databaseContext.Lists
                .Where(list => list.UserId == userId)
                .ToListAsync();

            return movieList.Select(list => int.Parse(list.MovieID)).ToList();
        }

        [HttpGet("recommendations/{userId1}")]
        public async Task<IActionResult> GetRecommendations(string userId1)
        {
                var userId2 = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
                var recommendations = await GetRecommendationsForUserIdsAsync(userId1, userId2);
                return Ok(new { Recommendations = recommendations });
        }

        public async Task<HashSet<int>> GetRecommendationsForMultipleUsers(List<List<int>> userMovieLists)
        {
            var combinedMovieList = GetCombinedMovieList(userMovieLists);
            var recommendationsSet = new HashSet<int>();

            foreach (var movieId in combinedMovieList)
            {
                var recommendations = await GetRecommendations(movieId);
                foreach (var recommendation in recommendations)
                {
                    recommendationsSet.Add(recommendation);
                }
            }

            return recommendationsSet;
        }

        private HashSet<int> GetCombinedMovieList(List<List<int>> userMovieLists)
        {
            var combinedList = new HashSet<int>();
            foreach (var list in userMovieLists)
            {
                foreach (var movieId in list)
                {
                    combinedList.Add(movieId);
                }
            }
            return combinedList;
        }

        private async Task<List<int>> GetRecommendations(int movieId)
        {
            var url = $"{TmdbApiBase}/movie/{movieId}/recommendations?api_key={API_KEY}";
            var response = await _httpClient.GetAsync(url);
            var content = await response.Content.ReadAsStringAsync();

            dynamic json = JObject.Parse(content);
            var recommendations = new List<int>();

            foreach (var movie in json.results)
            {
                recommendations.Add((int)movie.id);
            }

            return recommendations;
        }


    }
  

}

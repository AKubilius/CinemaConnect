using Bakis.Data.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Bakis.Data
{
    public class ApplicationDbContext : IdentityDbContext<User>
    {
        public DbSet<MyList> Lists { get; set; }
        public DbSet<Post> Posts   { get; set; }
        public DbSet<Friend> Friends { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Like> Likes { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=aspnet-Bakis-53bc9b9d-9d6a-45d4-8429-2a2761773502;");
        }
    }
}
using Bakis.Auth.Model;

namespace Bakis.Data.Models
{
    public class Like:IUserOwnedResource
    {
        public int Id { get; set; }

        public string? Type { get; set; }
        public int PostId { get; set; }
        public string? UserId { get; set; } = null;
        public User? User { get; set; } = null;
    }
}

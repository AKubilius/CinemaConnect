using Bakis.Auth.Model;

namespace Bakis.Data.Models
{
    public class Comment:IUserOwnedResource
    {
        public int Id { get; set; }
        public int PostID { get; set; }

        public string Body { get; set; }
        public string? UserId { get; set; } = null;
        public User? User { get; set; } = null;

    }
}

using Microsoft.AspNetCore.Identity;

namespace Bakis.Data.Models
{
    public class User:IdentityUser
    {
        [PersonalData]
        public string Name { get; set; }

        [PersonalData]
        public string Surname { get; set; }
        [PersonalData]
        public DateTime BirthDate { get; set; }
        [PersonalData]
        public int Age { get; set; }
    }
}

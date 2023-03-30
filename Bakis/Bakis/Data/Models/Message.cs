namespace Bakis.Data.Models
{
    public class Message
    {
        public int Id { get; set; }
        public string Body { get; set; }
        public DateTime DateTime { get; set; }
        public string SenderId { get; set; }

        public string ReceiverId { get; set; }
        
    }
}

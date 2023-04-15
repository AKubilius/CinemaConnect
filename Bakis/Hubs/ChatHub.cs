using System.Linq;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using Bakis.Data.Models;
using Bakis.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Bakis.Auth.Model;
using Microsoft.AspNetCore.Identity;
using System.Diagnostics;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Bakis.Data.Models.DTOs;
using UserDto = Bakis.Data.Models.DTOs.UserDto;

public class ChatHub : Hub
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<User> _userManager;
    public ChatHub(ApplicationDbContext context, UserManager<User> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    public async Task JoinUserRooms(string userId)
    {
        var userRooms = _context.UserRooms.Where(ur => ur.UserId == userId).Include(ur => ur.Room).ToList();

        foreach (var userRoom in userRooms)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, userRoom.RoomId.ToString());
        }
    }

    [Authorize(Roles = Roles.User + "," + Roles.Admin)]
    public override async Task OnConnectedAsync()
    {

        var httpContext = Context.GetHttpContext();
        var paramName1 = httpContext.Request.Query["paramName1"].ToString();

        var userId = await _userManager.FindByNameAsync(paramName1);

        if (userId != null)
        {
            
            await JoinUserRooms(userId.Id);
        }
       

        await base.OnConnectedAsync();
    }

    public async Task JoinRoom(string roomId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
    }

    public async Task LeaveRoom(string roomId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomId);
    }

    public async Task SendMessageToRoom(string roomId, string user, string message)
    {
        Debug.WriteLine($"SendMessageToRoom called with roomId: {roomId}, user: {user}, message: {message}"); // Add this line
        

        var userId = await _userManager.FindByNameAsync(user);

        var newMessage = new Message
        {
            SenderId = userId.Id,
            Sender = userId,
            Body = message,
            DateTime = DateTime.UtcNow,
            RoomId = Int32.Parse(roomId)

        };

        _context.Messages.Add(newMessage);
        await _context.SaveChangesAsync();

        Debug.WriteLine($"Broadcasting message to group: {roomId}"); // Add this line
        await Clients.Group(roomId).SendAsync("ReceiveMessage", user, message);
    }

    public async Task<IEnumerable<MessageDto>> LoadMessages(string roomId)
    {
        if (string.IsNullOrEmpty(roomId))
        {
            throw new ArgumentNullException(nameof(roomId), "Room ID cannot be null or empty.");
        }

        var allList = await _context.Messages
        .Where(m => m.RoomId == Int32.Parse(roomId))
        .Include(m => m.Sender)
        .Take(100)
        .Select(m => new MessageDto
        {
            Id = m.Id,
            Body = m.Body,
            DateTime = m.DateTime,
            Sender = new UserDto
            {
                Id = m.Sender.Id,
                UserName = m.Sender.UserName,
                ProfileImageBase64 = m.Sender.ProfileImageBase64
            }
        })
        .ToListAsync();



        return allList;
    }
}
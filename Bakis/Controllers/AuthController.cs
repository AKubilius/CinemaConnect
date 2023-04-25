﻿using Bakis.Auth;
using Bakis.Auth.Model;
using Bakis.Data;
using Bakis.Data.Models;
using Bakis.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Security.Claims;
using System.Web;

namespace Bakis.Controllers
{
    [ApiController]
    [AllowAnonymous]
    [Route("api")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly ApplicationDbContext _dbContext;
        private readonly IEmailService _emailService;
        public AuthController(IEmailService emailService, ApplicationDbContext context, UserManager<User> userManager, IJwtTokenService jwtTokenService)
        {
            _dbContext = context;
            _userManager = userManager;
            _jwtTokenService = jwtTokenService;
            _emailService = emailService;
        }

        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register(RegisterUserDto registerUserDto)
        {
            var user = await _userManager.FindByNameAsync(registerUserDto.UserName);
            if (user != null)
                return BadRequest("UserName is Taken");

            var newUser = new User
            {
                Email = registerUserDto.Email,
                UserName = registerUserDto.UserName
            };
            var createUserResult = await _userManager.CreateAsync(newUser, registerUserDto.Password);
            if (!createUserResult.Succeeded)
                return BadRequest("Could not create a user.");

            await _userManager.AddToRoleAsync(newUser, Roles.User);

            return CreatedAtAction(nameof(Register), new UserDto(newUser.Id, newUser.UserName, newUser.Email));
        }

        [HttpPost]
        [Route("login")]
        public async Task<ActionResult> Login(LoginDto loginDto)
        {
            var user = await _userManager.FindByNameAsync(loginDto.UserName);
            if (user == null)
                return BadRequest("User name or password is invalid.");

            var isPasswordValid = await _userManager.CheckPasswordAsync(user, loginDto.Password);
            if (!isPasswordValid)
                return BadRequest("User name or password is invalid.");



            //lyg nereikia
            var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id)
                };
            var userIdentity = new ClaimsIdentity(claims, "login");
            var principal = new ClaimsPrincipal(userIdentity);

            await HttpContext.SignInAsync(principal);
            // cia


            // valid user
            var roles = await _userManager.GetRolesAsync(user);
            bool aa = false;
            foreach (var role in roles)
            {
                if (role == "Admin")
                    aa = true;
                
            }
            var accessToken = _jwtTokenService.CreateAccessToken(user.UserName, user.Id, roles);

            return Ok(new SuccessfulLoginDto(accessToken, loginDto.UserName, aa, user.ProfileImageBase64));
        }
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                // Don't reveal that the user does not exist
                return Ok("If an account with this email exists, a password reset link has been sent.");
            }

            // Generate a password reset token using UserManager
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

            // Send the password reset link via email
            var callbackUrl = $"http://localhost:3000/reset-password?token={HttpUtility.UrlEncode(token)}&email={HttpUtility.UrlEncode(user.Email)}";
            await _emailService.SendEmailAsync(user.Email, "Reset Password", $"Please reset your password by clicking <a href='{callbackUrl}'>here</a>");

            return Ok("If an account with this email exists, a password reset link has been sent.");
        }

        [HttpPost("confirm-reset-password")]
        public async Task<IActionResult> ConfirmResetPassword([FromBody] ConfirmResetPasswordRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                return BadRequest("Invalid email address");
            }

            var resetPasswordResult = await _userManager.ResetPasswordAsync(user, request.Token, request.NewPassword);

            if (!resetPasswordResult.Succeeded)
            {
                return BadRequest("Failed to reset password");
            }

            return Ok("Password reset successfully");
        }
    }
}
